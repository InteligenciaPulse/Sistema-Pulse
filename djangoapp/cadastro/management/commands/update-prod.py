import csv
import re
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand
from cadastro.models import Parceiro, Produto, ParceiroProdutos


class Command(BaseCommand):
    help = "Atualiza ou cria produtos e vínculos ParceiroProdutos conforme CSV. Mostra apenas os criados e avisa inconsistências."

    VALID_VALUE_PATTERN = re.compile(
        r"^\s*(R\$)?\s*\d{1,6}([.,]\d{1,2})?\s*$"
    )  # aceita: "R$ 150,00", "4800.00", "140,40", etc.

    def add_arguments(self, parser):
        parser.add_argument("--csv", type=str, required=True, help="Caminho do arquivo CSV (ex: cadastro/management/commands/parc_prod_new.csv)")
        parser.add_argument("--col-parceiro", type=str, default="Parceiro", help="Nome da coluna do parceiro")
        parser.add_argument("--col-produto", type=str, default="Produto", help="Nome da coluna do produto")
        parser.add_argument("--col-particular", type=str, default="Valor Particular", help="Nome da coluna de valor particular")
        parser.add_argument("--col-repasse", type=str, default="Valor Repasse", help="Nome da coluna de valor repasse")
        parser.add_argument("--col-venda", type=str, default="Valor Venda", help="Nome da coluna de valor venda")

    def parse_valor(self, raw_valor, produto_nome, parceiro_nome):
        """Valida e converte um valor do CSV para Decimal, ou retorna None se inválido."""
        valor = str(raw_valor).strip()

        if not valor:
            self.stdout.write(self.style.WARNING(f"⚠️ Valor vazio para '{produto_nome}' ({parceiro_nome})"))
            return None

        # remove símbolo de moeda e espaços
        valor_limpo = valor.replace("R$", "").replace(" ", "")

        # valida formato
        if not self.VALID_VALUE_PATTERN.match(valor):
            self.stdout.write(self.style.WARNING(f"⚠️ Formato inválido em '{produto_nome}' ({parceiro_nome}): '{valor}'"))
            return None

        # substitui vírgula por ponto
        valor_padrao = valor_limpo.replace(",", ".")

        try:
            return Decimal(valor_padrao)
        except InvalidOperation:
            self.stdout.write(self.style.WARNING(f"⚠️ Erro ao converter '{valor}' em número para {produto_nome}"))
            return None

    def handle(self, *args, **options):
        csv_path = options["csv"]
        col_parceiro = options["col_parceiro"]
        col_produto = options["col_produto"]
        col_particular = options["col_particular"]
        col_repasse = options["col_repasse"]
        col_venda = options["col_venda"]

        try:
            with open(csv_path, newline="", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                linhas = list(reader)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"❌ Arquivo não encontrado: {csv_path}"))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erro ao ler CSV: {e}"))
            return

        if not linhas:
            self.stdout.write(self.style.WARNING("⚠️ Nenhum dado encontrado no CSV."))
            return

        criados = []
        ignorados = set()

        for row in linhas:
            parceiro_nome = row.get(col_parceiro, "").strip()
            produto_nome = row.get(col_produto, "").strip()

            # validações básicas
            if not parceiro_nome or not produto_nome:
                continue

            # verifica se o nome do produto é muito longo
            if len(produto_nome) > 500:
                self.stdout.write(
                    self.style.WARNING(f"⚠️ Produto '{produto_nome[:60]}...' tem {len(produto_nome)} caracteres (máx 500).")
                )
                continue

            parceiro = Parceiro.objects.filter(nome=parceiro_nome).first()
            if not parceiro:
                ignorados.add(parceiro_nome)
                continue

            # tenta converter os três valores com verificação de formato
            valor_particular = self.parse_valor(row.get(col_particular, ""), produto_nome, parceiro_nome)
            valor_repasse = self.parse_valor(row.get(col_repasse, ""), produto_nome, parceiro_nome)
            valor_venda = self.parse_valor(row.get(col_venda, ""), produto_nome, parceiro_nome)

            # se algum valor for inválido, ignora a linha
            if None in (valor_particular, valor_repasse, valor_venda):
                continue

            produto, _ = Produto.objects.get_or_create(nome=produto_nome)

            # Atualiza ou cria o vínculo ParceiroProdutos
            obj, created = ParceiroProdutos.objects.update_or_create(
                parceiro=parceiro,
                produto=produto,
                defaults={
                    "valor_particular": valor_particular,
                    "valor_repasse": valor_repasse,
                    "valor_venda": valor_venda,
                },
            )

            if created:
                criados.append(f"{parceiro.nome} - {produto.nome}")

        # ----- RESULTADOS -----
        if ignorados:
            self.stdout.write(self.style.WARNING(f"\n⚠️ Parceiros ignorados (não encontrados no banco):"))
            for nome in sorted(ignorados):
                self.stdout.write(f"   - {nome}")

        if criados:
            self.stdout.write(self.style.SUCCESS(f"\n✅ {len(criados)} novos vínculos criados:\n"))
            for item in criados:
                self.stdout.write(f"   + {item}")
        else:
            self.stdout.write(self.style.WARNING("\nℹ️ Nenhum novo vínculo criado. Todos já existiam e foram apenas atualizados."))
