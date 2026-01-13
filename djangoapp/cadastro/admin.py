from django.contrib import admin
from .models import Endereco, Paciente, Especialidade, Tipo, Subtipo, Parceiro, Produto, Procedimento, Status, ParceiroProdutos, Orcamento, OrcamentoParceiros, SolicitacaoOrcamento, Pacote, PacoteProcedimentos, OrcamentoPacotes, ProcedimentoProdutos, Custos, OrcamentoProcedimentos

# Register your models here.
@admin.register(Endereco)
class EnderecoAdmin(admin.ModelAdmin):
    list_display = ('rua', 'numero', 'bairro', 'cidade', 'estado', 'cep')
    search_fields = ('rua', 'bairro', 'cidade', 'estado', 'cep')

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'email', 'telefone', 'data_nascimento', 'genero')
    search_fields = ('nome', 'cpf')

@admin.register(Especialidade)
class EspecialidadeAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descricao')
    search_fields = ('nome',)

@admin.register(Tipo)
class TipoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)

@admin.register(Subtipo)
class SubtipoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'tipo')
    search_fields = ('nome', 'tipo__nome')

@admin.register(Parceiro)
class ParceiroAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf_cnpj', 'tipo', 'subtipo', 'especialidade', 'telefone', 'email', 'desconto2produto')
    list_filter = ('tipo', 'subtipo', 'especialidade')
    search_fields = ('nome', 'cpf_cnpj', 'email', 'telefone')

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome',)
    search_fields = ('nome',)
    ordering = ('nome',)
    list_filter = ('nome',)

@admin.register(Procedimento)
class ProcedimentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'especialidade')
    search_fields = ('nome',)
    list_filter = ('especialidade',)

@admin.register(ProcedimentoProdutos)
class ProcedimentoProdutosAdmin(admin.ModelAdmin):
    list_display = ('id', 'procedimento', 'produto')
    search_fields = ('procedimento', 'produto',)
    list_filter = ('procedimento', 'produto',)

@admin.register(OrcamentoProcedimentos)
class OrcamentoProcedimentosAdmin(admin.ModelAdmin):
    list_display = ('id', 'procedimento', 'orcamento')
    search_fields = ('procedimento', 'orcamento',)
    list_filter = ('procedimento', 'orcamento',)

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'descricao')
    search_fields = ('nome',)

@admin.register(ParceiroProdutos)
class ParceiroProdutosAdmin(admin.ModelAdmin):
    list_display = ('parceiro', 'produto', 'valor_particular', 'valor_repasse', 'valor_venda')
    list_filter = ('parceiro', 'produto')
    search_fields = ('parceiro__nome', 'produto__nome')
    autocomplete_fields = ('parceiro', 'produto')

@admin.register(Orcamento)
class OrcamentoAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'status', 'data_criacao', 'data_aprovacao', 'valor_total',
        'data_agendamento', 'custo_total', 'lucro_total', 'tipo_orcamento',
        'responsavel', 'observacoes', 'pagamento', 'canal'
    )

@admin.register(OrcamentoParceiros)
class OrcamentoParceirosAdmin(admin.ModelAdmin):
    list_display = ('orcamento', 'parceiro', 'produto', 'valor_venda', 'valor_repasse', 'custos', 'margem_lucro')
    list_filter = ('orcamento', 'parceiro', 'produto')
    search_fields = ('orcamento__id', 'parceiro__nome', 'produto__nome')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related(
            'orcamento',
            'orcamento__solicitacao_orcamento',
            'orcamento__solicitacao_orcamento__paciente',
            'parceiro',
            'produto',
            'custos',
        )

    def get_paciente(self, obj):
        so = getattr(obj.orcamento, 'solicitacao_orcamento', None)
        return so.paciente.nome if so else '-'

    get_paciente.short_description = 'Paciente'

@admin.register(SolicitacaoOrcamento)
class SolicitacaoOrcamentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'data_solicitacao', 'paciente', 'orcamento', 'status')
    list_filter = ('status', 'data_solicitacao')
    search_fields = ('paciente__nome', 'status__nome')

@admin.register(Pacote)
class PacoteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'valor_base')
    search_fields = ('nome', 'descricao')
    list_filter = ('valor_base',)

@admin.register(PacoteProcedimentos)
class PacoteProcedimentosAdmin(admin.ModelAdmin):
    list_display = ('pacote', 'procedimento')
    list_filter = ('pacote', 'procedimento')
    search_fields = ('pacote__nome', 'procedimento__nome')

@admin.register(OrcamentoPacotes)
class OrcamentoPacotesAdmin(admin.ModelAdmin):
    list_display = ('orcamento', 'pacote', 'parceiro', 'valor_total')
    list_filter = ('orcamento', 'pacote', 'parceiro')
    search_fields = ('orcamento__id', 'pacote__nome', 'parceiro__nome')

@admin.register(Custos)
class CustosAdmin(admin.ModelAdmin):
    list_display = ('comissao_venda', 'comissao_indicacao', 'brindes', 'imposto', 'cartao')
    list_filter = ('comissao_venda', 'comissao_indicacao', 'brindes', 'imposto', 'cartao')
    search_fields = ('comissao_venda', 'comissao_indicacao', 'brindes', 'imposto', 'cartao')


# ==============================================================================
from django.contrib import admin
from .models import Coluna, Card

admin.site.register(Coluna)
admin.site.register(Card)