from django.contrib import admin
from .models import Endereco, Paciente, Especialidade, Tipo, Subtipo, Parceiro, Procedimento, Status, ParceiroProcedimentos, Orcamento, OrcamentoParceiros, SolicitacaoOrcamento, Pacote, PacoteProcedimentos, OrcamentoPacotes

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
    list_display = ('nome', 'tipo', 'subtipo', 'especialidade', 'telefone', 'email')
    list_filter = ('tipo', 'subtipo', 'especialidade')
    search_fields = ('nome', 'email', 'telefone')

@admin.register(Procedimento)
class ProcedimentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'especialidade')
    search_fields = ('nome',)
    list_filter = ('especialidade',)

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'descricao')
    search_fields = ('nome',)

@admin.register(ParceiroProcedimentos)
class ParceiroProcedimentosAdmin(admin.ModelAdmin):
    list_display = ('parceiro', 'procedimento', 'valor_repasse')
    list_filter = ('parceiro', 'procedimento')
    search_fields = ('parceiro__nome', 'procedimento__nome')

@admin.register(Orcamento)
class OrcamentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'data_aprovacao', 'valor_total')

@admin.register(OrcamentoParceiros)
class OrcamentoParceirosAdmin(admin.ModelAdmin):
    list_display = ('orcamento', 'parceiro', 'valor_venda', 'valor_repasse')
    list_filter = ('orcamento', 'parceiro')
    search_fields = ('orcamento__id', 'parceiro__nome')

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