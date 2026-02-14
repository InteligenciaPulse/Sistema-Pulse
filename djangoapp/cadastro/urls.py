from django.urls import path
from .views import home, criar_orcamento, historico, buscar_pacientes, buscar_procedimentos, buscar_parceiros, buscar_procedimentos_por_pacote, buscar_pacotes, buscar_parceiros_by, buscar_produtos_por_parceiro, buscar_parceiros_por_subtipo, buscar_subtipos
from .views import visualizar_orcamento_pdf, visualizar_orcamento_html, salvar_paciente, buscar_especialidades, buscar_procedimentos_by
from .views import salvar_orcamento, editar_orcamento, atualizar_orcamento, atualizar_status, buscar_status, exportar_historico_excel
from .views import historico_api, kanban_board, atualizar_orcamento_status
from .views import get_csrf_token
from .views import deletar_coluna, parceiro_desconto
from .views import listar_parceiros, atualizar_desconto_parceiro

from .views import OrcamentoRelatorioExcelView

from .views import DebugRelatorioView

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
    path('buscar_especialidades/', buscar_especialidades, name='buscar_especialidades'),
    path('buscar_procedimentos_by/', buscar_procedimentos_by, name='buscar_procedimentos_by'),

    path('historico/', historico_api, name='historico_api'),
    path('kanban_board/', kanban_board, name='kanban_board'),
    path('orcamentos/<int:pk>/', atualizar_orcamento_status),
    path("parceiro/<int:pk>/desconto/", parceiro_desconto),
    path('api/deletar_coluna/<int:coluna_id>/', deletar_coluna, name='deletar_coluna'),
    # path('api/csrf/', get_csrf_token),
    path("api/parceiros/", listar_parceiros, name="listar_parceiros"),
    path("api/parceiro/<int:pk>/atualizar_desconto/", atualizar_desconto_parceiro, name="atualizar_desconto_parceiro"),

    path( "relatorios/orcamentos/excel/", OrcamentoRelatorioExcelView.as_view(), name="relatorio_orcamentos_excel"),
    path('relatorios/debug/', DebugRelatorioView.as_view(), name='debug-relatorio'),
]

# ============================================
from rest_framework.routers import DefaultRouter
from .views import ColumnViewSet, CardViewSet, StatusViewSet, EspecialidadeViewSet, ProcedimentoViewSet
from .views import ParceiroViewSet, SubtipoViewSet

router = DefaultRouter()
router.register(r'columns', ColumnViewSet)
router.register(r'cards', CardViewSet)
router.register(r'status', StatusViewSet)
router.register(r'especialidades', EspecialidadeViewSet)
router.register(r'procedimentos', ProcedimentoViewSet)
router.register(r'parceiros', ParceiroViewSet)
router.register(r'subtipos', SubtipoViewSet)


urlpatterns += router.urls