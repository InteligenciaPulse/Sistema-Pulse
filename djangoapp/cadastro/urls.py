from django.urls import path
from .views import home, criar_orcamento, historico, buscar_pacientes, buscar_procedimentos, buscar_parceiros, buscar_procedimentos_por_pacote, buscar_pacotes, buscar_parceiros_por_procedimento

urlpatterns = [
    path('', home, name='home'),
    path('orcamentos/criar/', criar_orcamento, name='criar_orcamento'),
    path('historico/', historico, name='historico'),
    path('buscar_pacientes/', buscar_pacientes, name='buscar_pacientes'),
    path("buscar_procedimentos/", buscar_procedimentos, name="buscar_procedimentos"),
    path('buscar_parceiros/', buscar_parceiros, name='buscar_parceiros'),
    path("buscar_parceiros_por_procedimento/", buscar_parceiros_por_procedimento, name="buscar_parceiros_por_procedimento"),
    path('buscar_pacotes/', buscar_pacotes, name='buscar_pacotes'),
    path("buscar_procedimentos_por_pacote/", buscar_procedimentos_por_pacote, name="buscar_procedimentos_por_pacotes"),
]