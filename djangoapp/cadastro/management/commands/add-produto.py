from django.core.management.base import BaseCommand
from cadastro.models import Parceiro, Produto, ParceiroProdutos


class Command(BaseCommand):
    help = "Adiciona o produto 'Consulta reumatologista' para o parceiro Atma"

    def handle(self, *args, **options):
        parceiro_nome = "Atma"
        tipo_nome = "Local"
        subtipo_nome = "Clínica"
        especialidade_nome = "Multidisciplinar"
        produto_nome = "Consulta reumatologista"

        valor_particular = 300.00
        valor_repasse = 125.00
        valor_venda = 180.00

        # Verifica se o parceiro existe com os filtros completos
        parceiro = (
            Parceiro.objects.filter(
                nome=parceiro_nome,
                tipo__nome=tipo_nome,
                subtipo__nome=subtipo_nome,
                especialidade__nome=especialidade_nome,
            )
            .select_related("tipo", "subtipo", "especialidade")
            .first()
        )

        if not parceiro:
            self.stdout.write(self.style.ERROR("❌ Parceiro 'Atma' com os filtros especificados não encontrado."))
            return

        # Busca ou cria o produto
        produto, created_prod = Produto.objects.get_or_create(nome=produto_nome)

        if created_prod:
            self.stdout.write(self.style.SUCCESS(f"🆕 Produto '{produto_nome}' criado."))
        else:
            self.stdout.write(self.style.WARNING(f"Produto '{produto_nome}' já existia."))

        # Verifica se já existe o vínculo
        exists = ParceiroProdutos.objects.filter(parceiro=parceiro, produto=produto).exists()

        if exists:
            self.stdout.write(self.style.WARNING("⚠️ Este vínculo já existe. Nenhum novo registro criado."))
            return

        # Cria o vínculo
        pp = ParceiroProdutos.objects.create(
            parceiro=parceiro,
            produto=produto,
            valor_particular=valor_particular,
            valor_repasse=valor_repasse,
            valor_venda=valor_venda,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Registro criado com sucesso (ID={pp.id}): {parceiro.nome} - {produto.nome}"
            )
        )
