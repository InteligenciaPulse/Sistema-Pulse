import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import SolicitacaoOrcamento, Orcamento, Paciente, Procedimento, Parceiro, ParceiroProcedimentos, Subtipo

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

def buscar_procedimentos(request):
    query = request.GET.get('q', '').strip()
    
    if not query:
        return JsonResponse([], safe=False)
    
    procedimentos = Procedimento.objects.filter(nome__icontains=query).values("id", "nome")
    return JsonResponse(list(procedimentos), safe=False)

def buscar_parceiros(request):
    parceiros = Parceiro.objects.values("id", "nome")
    return JsonResponse(list(parceiros), safe=False)

def buscar_parceiros_por_procedimento(request):
    procedimento_nome = request.GET.get("procedimento_nome", "").strip()

    if not procedimento_nome:
        return JsonResponse([], safe=False)

    try:
        procedimento = Procedimento.objects.get(nome=procedimento_nome)
        procedimento_id = procedimento.id

        parceiros_procedimentos = ParceiroProcedimentos.objects.filter(procedimento_id=procedimento_id)

        resposta = [
            {
                "id": pp.parceiro.id,
                "nome": pp.parceiro.nome,
                "valor_venda": pp.valor_venda,
            }
            for pp in parceiros_procedimentos
        ]

        return JsonResponse(resposta, safe=False)

    except Procedimento.DoesNotExist:
        return JsonResponse([], safe=False)

# @csrf_exempt
# def cadastrar_paciente(request):
#     if request.method == "POST":
#         data = json.loads(request.body)

#         nome = data.get("nome")
#         cpf = data.get("cpf")
#         telefone = data.get("telefone")

#         if Paciente.objects.filter(cpf=cpf).exists():
#             return JsonResponse({"status": "error", "message": "Paciente já cadastrado!"}, status=400)
        
#         paciente = Paciente.objects.create(nome=nome, cpf=cpf, telefone=telefone)
        
#         return JsonResponse({"status": "success", "paciente_id": paciente.id})

#     return JsonResponse({"status": "error", "message": "Método não permitido"}, status=405)
