from django.core.management.base import BaseCommand
from cadastro.models import ParceiroProdutos, OrcamentoParceiros


class Command(BaseCommand):
    help = "Verifica se os ParceiroProdutos da Atma estão associados a algum orçamento e mostra os IDs"

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

        pps = ParceiroProdutos.objects.filter(
            parceiro__nome=parceiro_nome,
            parceiro__tipo__nome=tipo_nome,
            parceiro__subtipo__nome=subtipo_nome,
            parceiro__especialidade__nome=especialidade_nome,
            produto__nome__in=produtos,
        )

        if not pps.exists():
            self.stdout.write(self.style.WARNING("Nenhum registro encontrado."))
            return

        self.stdout.write(self.style.SUCCESS(f"Verificando {pps.count()} registros...\n"))

        for pp in pps:
            orcamentos = OrcamentoParceiros.objects.filter(
                parceiro=pp.parceiro,
                produto=pp.produto,
            ).values_list("orcamento_id", flat=True).distinct()

            if orcamentos:
                orc_ids = ", ".join(map(str, orcamentos))
                status = self.style.ERROR(f"🟢 Associado a orçamento(s): {orc_ids}")
            else:
                status = self.style.SUCCESS("🔴 Sem vínculo")

            self.stdout.write(f"{pp.produto.nome:<35} → {status}")
