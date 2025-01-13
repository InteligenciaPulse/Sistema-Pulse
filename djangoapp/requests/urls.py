from django.urls import path
from .views import criar_solicitacao

urlpatterns = [
    path('create/', criar_solicitacao, name='create_request'),
]
