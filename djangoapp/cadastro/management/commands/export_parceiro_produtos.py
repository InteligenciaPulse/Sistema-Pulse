import csv
from django.core.management.base import BaseCommand
from cadastro.models import ParceiroProdutos

class Command(BaseCommand):
    help = 'Exporta os dados de ParceiroProdutos para CSV'

    def handle(self, *args, **kwargs):
        file_path = 'parceiros_produtos_BD.csv'

        headers = [
            'Parceiro',
            'Tipo',
            'Subtipo',
            'Especialidade',
            'Produto',
            'Valor Particular',
            'Valor Repasse',
            'Valor Venda'
        ]

        with open(file_path, mode='w', newline='', encoding='utf-8-sig') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(headers)

            for pp in ParceiroProdutos.objects.select_related(
                'parceiro__tipo',
                'parceiro__subtipo',
                'parceiro__especialidade',
                'produto'
            ):
                writer.writerow([
                    pp.parceiro.nome if pp.parceiro else '',
                    pp.parceiro.tipo.nome if pp.parceiro and pp.parceiro.tipo else '',
                    pp.parceiro.subtipo.nome if pp.parceiro and pp.parceiro.subtipo else '',
                    pp.parceiro.especialidade.nome if pp.parceiro and pp.parceiro.especialidade else '',
                    pp.produto.nome if pp.produto else '',
                    pp.valor_particular,
                    pp.valor_repasse,
                    pp.valor_venda
                ])

        self.stdout.write(self.style.SUCCESS(f'CSV gerado com sucesso em: {file_path}'))
