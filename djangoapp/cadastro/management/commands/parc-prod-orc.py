import csv
from django.core.management.base import BaseCommand
from cadastro.models import Parceiro, Produto, ParceiroProdutos, OrcamentoParceiros


class Command(BaseCommand):
    help = "Verifica quais parceiros do CSV possuem produtos associados a orçamentos"

    def add_arguments(self, parser):
        parser.add_argument(
            "--csv",
            type=str,
            required=True,
            help="Caminho para o arquivo CSV com colunas Parceiro e Produto",
        )
        parser.add_argument(
            "--col-parceiro",
            type=str,
            default="Parceiro",
            help="Nome da coluna do parceiro no CSV (padrão: 'Parceiro')",
        )
        parser.add_argument(
            "--col-produto",
            type=str,
            default="Produto",
            help="Nome da coluna do produto no CSV (padrão: 'Produto')",
        )

    def handle(self, *args, **options):
        csv_path = options["csv"]
        col_parceiro = options["col_parceiro"]
        col_produto = options["col_produto"]

        try:
            with open(csv_path, newline="", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                dados = [
                    (row[col_parceiro].strip(), row[col_produto].strip())
                    for row in reader
                    if row.get(col_parceiro) and row.get(col_produto)
                ]
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"❌ Arquivo não encontrado: {csv_path}"))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erro ao ler CSV: {e}"))
            return

        parceiros_csv = sorted({p for p, _ in dados})
        produtos_csv = sorted({prod for _, prod in dados})

        self.stdout.write(self.style.SUCCESS(f"🔍 Verificando {len(parceiros_csv)} parceiros e {len(produtos_csv)} produtos...\n"))

        parceiros_existentes = Parceiro.objects.filter(nome__in=parceiros_csv)
        parceiros_encontrados = set(parceiros_existentes.values_list("nome", flat=True))

        parceiros_inexistentes = set(parceiros_csv) - parceiros_encontrados
        if parceiros_inexistentes:
            self.stdout.write(self.style.WARNING(f"⚠️ Ignorando {len(parceiros_inexistentes)} parceiros inexistentes:"))
            for nome in sorted(parceiros_inexistentes):
                self.stdout.write(f"   - {nome}")
            self.stdout.write("")

        for parceiro in parceiros_existentes:
            self.stdout.write(self.style.HTTP_INFO(f"🧩 Parceiro: {parceiro.nome}"))
            produtos_do_csv = [prod for p, prod in dados if p == parceiro.nome]

            for nome_produto in produtos_do_csv:
                produto = Produto.objects.filter(nome=nome_produto).first()
                if not produto:
                    self.stdout.write(f"   ⚠️ Produto '{nome_produto}' não encontrado no banco.")
                    continue

                # Verifica vínculo com orçamentos
                orcamentos = OrcamentoParceiros.objects.filter(
                    parceiro=parceiro, produto=produto
                ).values_list("orcamento_id", flat=True).distinct()

                if orcamentos:
                    orc_ids = ", ".join(map(str, orcamentos))
                    self.stdout.write(self.style.ERROR(f"   🟢 {nome_produto} → associado a orçamento(s): {orc_ids}"))
                else:
                    self.stdout.write(self.style.SUCCESS(f"   🔴 {nome_produto} → sem vínculo"))

            self.stdout.write("")  # linha em branco para separar parceiros
