from django.core.management.base import BaseCommand
from cadastro.models import Parceiro


class Command(BaseCommand):
    help = "Atualiza o nome do parceiro 'Anestesia e Servicos Medicoas LTDA' para 'Anestesia e Serviços Médicos LTDA'"

    def handle(self, *args, **options):
        nome_antigo = "Anestesia e Servicos Medicoas LTDA"
        nome_novo = "Anestesia e Serviços Médicos LTDA"

        parceiros = Parceiro.objects.filter(nome=nome_antigo)

        if not parceiros.exists():
            self.stdout.write(self.style.ERROR(f"❌ Nenhum parceiro encontrado com o nome '{nome_antigo}'."))
            return

        self.stdout.write(self.style.WARNING(f"{parceiros.count()} registro(s) encontrado(s) com o nome antigo:\n"))

        for p in parceiros:
            self.stdout.write(f"- ID {p.id}: {p.nome}")

        confirm = input(f"\nTem certeza que deseja alterar para '{nome_novo}'? (digite 'SIM' para confirmar): ")

        if confirm.strip().upper() == "SIM":
            updated = parceiros.update(nome=nome_novo)
            self.stdout.write(self.style.SUCCESS(f"\n✅ {updated} registro(s) atualizado(s) com sucesso."))
        else:
            self.stdout.write(self.style.NOTICE("\nOperação cancelada. Nenhum registro foi modificado."))
