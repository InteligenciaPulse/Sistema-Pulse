from django.shortcuts import render

# Create your views here.

from django.shortcuts import render, redirect
from .forms import SolicitationForm

def criar_solicitacao(request):
    if request.method == 'POST':
        form = SolicitationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('sucesso')  # Redireciona para uma página de sucesso
    else:
        form = SolicitationForm()
    return render(request, 'requests/create_request.html', {'form': form})
