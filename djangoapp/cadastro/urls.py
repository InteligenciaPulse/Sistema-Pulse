from django.urls import path
from .views import home, criar_orcamento, historico, buscar_pacientes

urlpatterns = [
    path('', home, name='home'),
    path('orcamentos/criar/', criar_orcamento, name='criar_orcamento'),
    path('historico/', historico, name='historico'),
    path('buscar_pacientes/', buscar_pacientes, name='buscar_pacientes'),
]