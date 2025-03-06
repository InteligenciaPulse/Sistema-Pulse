from django.urls import path
from .views import home, criar_orcamento, historico, buscar_pacientes, buscar_procedimentos, buscar_parceiros, buscar_procedimentos_por_pacote, buscar_pacotes, buscar_parceiros_by, buscar_produtos_por_parceiro, buscar_parceiros_por_subtipo, buscar_subtipos
from .views import visualizar_orcamento_pdf, visualizar_orcamento_html, salvar_paciente
from .views import salvar_orcamento, editar_orcamento, atualizar_orcamento, atualizar_status, buscar_status, exportar_historico_excel

urlpatterns = [
    path('', home, name='home'),
    path('orcamentos/criar/', criar_orcamento, name='criar_orcamento'),
    path('historico/', historico, name='historico'),
    path('buscar_pacientes/', buscar_pacientes, name='buscar_pacientes'),
    path("buscar_procedimentos/", buscar_procedimentos, name="buscar_procedimentos"),
    path('buscar_parceiros/', buscar_parceiros, name='buscar_parceiros'),
    path('buscar_parceiros_by/', buscar_parceiros_by, name='buscar_parceiros_by'),
    path('buscar_pacotes/', buscar_pacotes, name='buscar_pacotes'),
    path('buscar_parceiros_por_subtipo/', buscar_parceiros_por_subtipo, name='buscar_parceiros_por_subtipo'),
    path('buscar_subtipos/', buscar_subtipos, name='buscar_subtipos'),
    path("buscar_procedimentos_por_pacote/", buscar_procedimentos_por_pacote, name="buscar_procedimentos_por_pacotes"),
    path("buscar_produtos_por_parceiro/", buscar_produtos_por_parceiro, name="buscar_produtos_por_parceiro"),
    path('visualizar-orcamento/', visualizar_orcamento_pdf, name='visualizar_orcamento'),
    path('visualizar-orcamento-html/<int:orcamento_id>/', visualizar_orcamento_html, name='visualizar_orcamento_html'),
    path('visualizar-orcamento-html/', visualizar_orcamento_html, name='visualizar_orcamento_html'),
    path('salvar_paciente/', salvar_paciente, name='salvar_paciente'),
    path('salvar_orcamento/', salvar_orcamento, name='salvar_orcamento'),
    path('atualizar_status/<int:orcamento_id>/', atualizar_status, name='atualizar_status'),
    path("editar_orcamento/<int:orcamento_id>/", editar_orcamento, name="editar_orcamento"),
    path('atualizar_orcamento/', atualizar_orcamento, name='atualizar_orcamento'),
    path('atualizar_orcamento/<int:orcamento_id>/', atualizar_orcamento, name='atualizar_orcamento'),
    path('buscar_status/', buscar_status, name='buscar_status'),
    path("exportar-historico/", exportar_historico_excel, name="exportar_historico_excel"),
]