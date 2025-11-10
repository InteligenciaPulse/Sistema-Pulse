from django.core.management.base import BaseCommand
from cadastro.models import ParceiroProdutos


class Command(BaseCommand):
    help = "Remove os registros de ParceiroProdutos da Atma (clínica multidisciplinar)"

    def handle(self, *args, **options):
        parceiro_nome = "Atma"
        tipo_nome = "Local"
        subtipo_nome = "Clínica"
        especialidade_nome = "Multidisciplinar"

        produtos = [
            "Cardiologista",
            "Cirurgião cabeça e pescoço",
            "Clinico geral",
            "Consulta psicologia",
            "Endocrinologista",
            "Fisioterapia",
            "Gastroenterologista/clinico geral",
            "Ginecologista/obstetra",
            "Neurologista/clinico geral",
            "Nutricionista",
            "Ortopedista",
            "Otorrinolaringologista",
            "Pediatria",
            "Pneumologista",
            "Proctologista",
            "Psiquiatra",
            "Sessão psicologia",
        ]

        qs = ParceiroProdutos.objects.filter(
            parceiro__nome=parceiro_nome,
            parceiro__tipo__nome=tipo_nome,
            parceiro__subtipo__nome=subtipo_nome,
            parceiro__especialidade__nome=especialidade_nome,
            produto__nome__in=produtos,
        )

        total = qs.count()

        if total == 0:
            self.stdout.write(self.style.WARNING("Nenhum registro encontrado para exclusão."))
            return

        self.stdout.write(self.style.WARNING(f"Foram encontrados {total} registros para exclusão:\n"))

        for pp in qs:
            self.stdout.write(f"- {pp.id}: {pp.parceiro.nome} - {pp.produto.nome}")

        confirm = input("\nTem certeza que deseja remover esses registros? (digite 'SIM' para confirmar): ")

        if confirm.strip().upper() == "SIM":
            deleted_count, _ = qs.delete()
            self.stdout.write(self.style.SUCCESS(f"\n✅ {deleted_count} registro(s) removido(s) com sucesso."))
        else:
            self.stdout.write(self.style.NOTICE("\nOperação cancelada. Nenhum registro foi excluído."))
