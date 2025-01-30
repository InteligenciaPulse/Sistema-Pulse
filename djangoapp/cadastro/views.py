from django.shortcuts import render
from django.http import JsonResponse
from .models import SolicitacaoOrcamento, Orcamento, Paciente

def home(request):
    return render(request, 'cadastro/home.html')

def criar_orcamento(request):
    return render(request, 'cadastro/criar_orcamento.html')

def historico(request):
    tipo = request.GET.get('tipo', 'solicitacoes')

    paciente = request.GET.get('paciente')
    especialidade = request.GET.get('especialidade')
    procedimento = request.GET.get('procedimento')
    parceiro = request.GET.get('parceiro')
    data_criacao = request.GET.get('data_criacao')
    data_aprovacao = request.GET.get('data_aprovacao')

    if tipo == 'solicitacoes':
        atividades = SolicitacaoOrcamento.objects.all().order_by('-data_solicitacao')[:10]
    else:
        atividades = Orcamento.objects.all().order_by('-data_aprovacao')[:10]

    if paciente:
        atividades = atividades.filter(paciente__nome__icontains=paciente)
    if especialidade:
        atividades = atividades.filter(procedimento__especialidade__nome__icontains=especialidade)
    if procedimento:
        atividades = atividades.filter(procedimento__nome__icontains=procedimento)
    if parceiro:
        atividades = atividades.filter(parceiro__nome__icontains=parceiro)
    if data_criacao:
        atividades = atividades.filter(data_solicitacao=data_criacao)
    if data_aprovacao and tipo == 'orcamentos':
        atividades = atividades.filter(data_aprovacao=data_aprovacao)

    context = {
        'atividades': atividades,
        'tipo': tipo,
    }
    return render(request, 'cadastro/historico.html', context)

def buscar_pacientes(request):
    query = request.GET.get('q', '')
    pacientes = Paciente.objects.filter(nome__icontains=query)[:10]
    data = [{"id": p.id, "nome": p.nome} for p in pacientes]
    return JsonResponse(data, safe=False)