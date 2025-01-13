from django import forms
from .models import Solicitation

class SolicitationForm(forms.ModelForm):
    class Meta:
        model = Solicitation
        fields = ['cliente_nome', 'cliente_email', 'procedimento', 'hospital', 'valor_estimado']
