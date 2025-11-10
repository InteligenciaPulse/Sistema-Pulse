import csv
from django.core.management.base import BaseCommand
from cadastro.models import Parceiro


class Command(BaseCommand):
    help = "Verifica se todos os parceiros de um arquivo CSV existem no banco de dados"

    def add_arguments(self, parser):
        parser.add_argument(
            "--csv",
            type=str,
            required=True,
            help="Caminho completo para o arquivo CSV (ex: ./dados/parceiros_produtos.csv)",
        )
        parser.add_argument(
            "--coluna",
            type=str,
            default="Parceiro",
            help="Nome da coluna no CSV que contém o nome dos parceiros (padrão: 'Parceiro')",
        )

    def handle(self, *args, **options):
        csv_path = options["csv"]
        coluna_parceiro = options["coluna"]

        try:
            with open(csv_path, newline="", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                parceiros_csv = {row[coluna_parceiro].strip() for row in reader if row.get(coluna_parceiro)}
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"❌ Arquivo não encontrado: {csv_path}"))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erro ao ler CSV: {e}"))
            return

        if not parceiros_csv:
            self.stdout.write(self.style.WARNING("⚠️ Nenhum nome de parceiro encontrado no CSV."))
            return

        self.stdout.write(self.style.SUCCESS(f"🔍 Verificando {len(parceiros_csv)} parceiros...\n"))

        parceiros_existentes = set(
            Parceiro.objects.filter(nome__in=parceiros_csv).values_list("nome", flat=True)
        )
        parceiros_inexistentes = parceiros_csv - parceiros_existentes

        self.stdout.write(self.style.SUCCESS(f"✅ {len(parceiros_existentes)} parceiros encontrados no banco.\n"))
        self.stdout.write(self.style.WARNING(f"❌ {len(parceiros_inexistentes)} parceiros não encontrados:\n"))

        for nome in sorted(parceiros_inexistentes):
            self.stdout.write(f"   - {nome}")
