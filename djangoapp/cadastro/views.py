import os
import json
import logging
import tempfile
from django.conf import settings
from weasyprint import HTML, CSS
from django.db import transaction
from django.http import JsonResponse
from django.http import HttpResponse
from django.utils.timezone import now
from django.middleware.csrf import get_token
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_protect
from .models import SolicitacaoOrcamento, Orcamento, Paciente, Procedimento, Parceiro, ParceiroProcedimentos, Subtipo, Pacote, PacoteProcedimentos, Endereco, Status, OrcamentoParceiros

def home(request):
    return render(request, 'cadastro/home.html')

def criar_orcamento(request):
    return render(request, 'cadastro/criar_orcamento.html')

def historico(request):
    tipo = request.GET.get("tipo", "solicitacoes")

    if tipo == "solicitacoes":
        atividades = SolicitacaoOrcamento.objects.select_related("paciente", "orcamento", "status").order_by("-data_solicitacao")
    else:
        atividades = Orcamento.objects.select_related("solicitacaoorcamento__paciente", "status").prefetch_related("orcamento_parceiros__parceiro", "orcamento_parceiros__procedimento").order_by("-data_criacao")

    context = {
        "atividades": atividades,
        "tipo": tipo,
    }
    return render(request, "cadastro/historico.html", context)

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

def buscar_parceiros_by(request):
    query = request.GET.get('q', '').strip()
    subtipo_id = request.GET.get('subtipo', '').strip()
    
    if not query:
        return JsonResponse([], safe=False)
    
    parceiros = Parceiro.objects.filter(nome__icontains=query)

    if subtipo_id:
        parceiros = parceiros.filter(subtipo_id=subtipo_id)
    
    parceiros = parceiros.values("id", "nome")
    
    return JsonResponse(list(parceiros), safe=False)

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

def buscar_procedimentos_por_parceiro(request):
    parceiro_nome = request.GET.get("parceiro_nome", "").strip()

    if not parceiro_nome:
        return JsonResponse([], safe=False)

    try:
        parceiro = Parceiro.objects.get(nome=parceiro_nome)
        parceiro_id = parceiro.id

        procedimentos_parceiro = ParceiroProcedimentos.objects.filter(parceiro_id=parceiro_id)

        resposta = [
            {
                "id": pp.procedimento.id,
                "nome": pp.procedimento.nome,
                "valor_venda": pp.valor_venda,
            }
            for pp in procedimentos_parceiro
        ]

        return JsonResponse(resposta, safe=False)

    except Parceiro.DoesNotExist:
        return JsonResponse([], safe=False)

def buscar_pacotes(request):
    query = request.GET.get('q', '').strip()
    
    if not query:
        return JsonResponse([], safe=False)
    
    pacotes = Pacote.objects.filter(nome__icontains=query).values("id", "nome")
    return JsonResponse(list(pacotes), safe=False)

def buscar_procedimentos_por_pacote(request):
    pacote_nome = request.GET.get("pacote_nome", "").strip()

    try:
        pacote = Pacote.objects.get(nome=pacote_nome)

        procedimentos_relacionados = PacoteProcedimentos.objects.filter(pacote=pacote)
        
        procedimentos = [
            {"id": p.procedimento.id, "nome": p.procedimento.nome}
            for p in procedimentos_relacionados
        ]

        return JsonResponse(procedimentos, safe=False)
    except Pacote.DoesNotExist:
        return JsonResponse([], safe=False)
    
def buscar_subtipos(request):
    subtipos = Subtipo.objects.all().values("id", "nome")
    return JsonResponse(list(subtipos), safe=False)

def buscar_parceiros_por_subtipo(request):
    subtipo_id = request.GET.get("subtipo")
    parceiros = ParceiroProcedimentos.objects.filter(parceiro__subtipo_id=subtipo_id).values("parceiro__id", "parceiro__nome", "valor_venda")
    return JsonResponse(list(parceiros), safe=False)

def visualizar_orcamento_pdf(request):
    cliente = {
        "nome": "Maria Estetiane da Silva",
        "cpf": "000.000.00-00",
        "telefone": "(87) 9 8176-0222",
        "email": "gestão@meupulse.com.br",
        "endereco": "R. Dr. Júlio de Melo, 538 - Centro, Petrolina - PE"
    }

    procedimentos = [
        {"descricao": "Procedimento X", "observacao": "Observação Y"},
        {"descricao": "Procedimento Z", "observacao": "Observação W"},
    ]

    valor_total = "00.000,00"

    # Renderiza o HTML
    html_string = render(request, "cadastro/orcamento.html", {
        "cliente": cliente,
        "procedimentos": procedimentos,
        "valor_total": valor_total
    }).content.decode("utf-8")

    # Caminho absoluto do CSS estático
    css_path = os.path.join(settings.BASE_DIR, 'cadastro/static/cadastro/css/orcamento_style.css')

    # Geração do PDF com WeasyPrint usando o CSS externo
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'inline; filename="orcamento.pdf"'
    
    with tempfile.NamedTemporaryFile(delete=True) as temp_file:
        HTML(string=html_string).write_pdf(temp_file.name, stylesheets=[CSS(css_path)])
        response.write(open(temp_file.name, "rb").read())

    return response

def visualizar_orcamento_html(request, orcamento_id):
    orcamento = get_object_or_404(Orcamento, id=orcamento_id)

    try:
        solicitacao = SolicitacaoOrcamento.objects.get(orcamento=orcamento)
    except SolicitacaoOrcamento.DoesNotExist:
        return JsonResponse({"error": "Solicitação de orçamento não encontrada."}, status=404)
    
    paciente = solicitacao.paciente
    procedimentos = OrcamentoParceiros.objects.filter(orcamento=orcamento).select_related("procedimento", "parceiro")

    cliente = {
        "nome": paciente.nome,
        "cpf": paciente.cpf,
        "telefone": paciente.telefone,
        "email": paciente.email,
        "endereco": f"{paciente.endereco.rua}, {paciente.endereco.numero} - {paciente.endereco.bairro}, {paciente.endereco.cidade} - {paciente.endereco.estado}, {paciente.endereco.cep}",
    }

    procedimentos_lista = [
        {
            "descricao": f"{proc.procedimento.nome} - {proc.parceiro.nome}",
            "observacao": f"Valor: R$ {proc.valor_venda:.2f} - Repasse: R$ {proc.valor_repasse:.2f}"
        }
        for proc in procedimentos
    ]
    
    return render(request, "cadastro/orcamento.html", {
        "cliente": cliente,
        "procedimentos": procedimentos_lista,
        "valor_total": f"R$ {orcamento.valor_total:.2f}"
    })

@csrf_protect
def salvar_paciente(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                # Capturando dados do endereço
                rua = request.POST.get('rua')
                numero = request.POST.get('numero')
                bairro = request.POST.get('bairro')
                cidade = request.POST.get('cidade')
                estado = request.POST.get('estado')
                cep = request.POST.get('cep')
                complemento = request.POST.get('complemento', '')
                referencia = request.POST.get('referencia', '')

                # Criando e salvando endereço
                endereco = Endereco.objects.create(
                    rua=rua, numero=numero, bairro=bairro, cidade=cidade,
                    estado=estado, cep=cep, complemento=complemento, referencia=referencia
                )

                # Capturando dados do paciente
                nome = request.POST.get('nome')
                cpf = request.POST.get('cpf')
                telefone = request.POST.get('telefone')
                email = request.POST.get('email', '')
                data_nascimento = request.POST.get('data_nascimento')
                genero = request.POST.get('genero')
                anamnese = request.POST.get('anamnese', '')

                # Criando e salvando paciente
                paciente = Paciente.objects.create(
                    nome=nome, cpf=cpf, telefone=telefone, email=email,
                    data_nascimento=data_nascimento, genero=genero, anamnese=anamnese, endereco=endereco
                )

            return JsonResponse({'message': 'Paciente salvo com sucesso!'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_protect
def salvar_orcamento(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            with transaction.atomic():
                paciente_id = data.get("paciente_id")
                paciente = Paciente.objects.get(id=paciente_id)
                status = Status.objects.get(id=data.get('status'))

                orcamento = Orcamento.objects.create(
                    status=status,
                    valor_total=data.get("valor_total"),
                    data_criacao=now()
                )

                solicitacao = SolicitacaoOrcamento.objects.create(
                    paciente=paciente,
                    orcamento=orcamento,
                    status=status,
                    data_solicitacao=now()
                )

                for item in data.get("procedimentos", []):
                    parceiro_id = item["parceiro_id"]
                    procedimento_id = item["procedimento_id"]
                    valor_venda = item["valor_venda"]

                    parceiro_procedimento = ParceiroProcedimentos.objects.get(
                        parceiro_id=parceiro_id, 
                        procedimento_id=procedimento_id
                    )

                    OrcamentoParceiros.objects.create(
                        orcamento=orcamento,
                        parceiro_id=parceiro_id,
                        procedimento_id=procedimento_id,
                        valor_venda=valor_venda,
                        valor_repasse=parceiro_procedimento.valor_repasse
                    )

            return JsonResponse({"success": True, "message": "Orçamento salvo com sucesso!", "orcamento_id": orcamento.id}, status=201)

        except Paciente.DoesNotExist:
            return JsonResponse({"error": "Paciente não encontrado."}, status=404)
        except ParceiroProcedimentos.DoesNotExist:
            return JsonResponse({"error": "Parceiro ou Procedimento inválido."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método não permitido."}, status=405)

def atualizar_status(request, orcamento_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            novo_status = data.get("status")

            orcamento = Orcamento.objects.get(id=orcamento_id)
            orcamento.status_id = novo_status
            orcamento.save()

            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse({"error": "Método não permitido"}, status=405)

def editar_orcamento(request, orcamento_id):
    orcamento = get_object_or_404(Orcamento, id=orcamento_id)

    try:
        solicitacao = SolicitacaoOrcamento.objects.get(orcamento=orcamento)
        paciente = solicitacao.paciente
    except SolicitacaoOrcamento.DoesNotExist:
        paciente = None
        
    parceiros_dict = {}
    orcamento_parceiros = OrcamentoParceiros.objects.filter(orcamento=orcamento)

    for orc_parc in orcamento_parceiros:
        parceiro_id = orc_parc.parceiro.id

        if parceiro_id not in parceiros_dict:
            parceiros_dict[parceiro_id] = {
                "parceiro_id": parceiro_id,
                "parceiro_nome": orc_parc.parceiro.nome,
                "procedimentos": []
            }
        
        parceiros_dict[parceiro_id]["procedimentos"].append({
            "procedimento_id": orc_parc.procedimento.id,
            "procedimento_nome": orc_parc.procedimento.nome,
            "valor_venda": str(orc_parc.valor_venda),
            "valor_repasse": str(orc_parc.valor_repasse),
        })

    context = {
        "orcamento": orcamento,
        "status": orcamento.status,
        "paciente": paciente,
        "parceiros": list(parceiros_dict.values())
    }
    
    return render(request, "cadastro/editar_orcamento.html", context)

@csrf_protect
def atualizar_orcamento(request, orcamento_id=None):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            orcamento_id = data.get("orcamento_id", orcamento_id)
            status = Status.objects.get(id=data.get('status'))

            if not orcamento_id:
                return JsonResponse({"error": "Orçamento ID não fornecido"}, status=400)

            orcamento = Orcamento.objects.get(id=orcamento_id)

            with transaction.atomic():
                orcamento.valor_total = data["valor_total"]
                orcamento.status = status
                orcamento.save()

                OrcamentoParceiros.objects.filter(orcamento=orcamento).delete()

                for proc_data in data["procedimentos"]:
                    parceiro = Parceiro.objects.get(id=proc_data["parceiro_id"])
                    procedimento = Procedimento.objects.get(id=proc_data["procedimento_id"])

                    orc = OrcamentoParceiros.objects.create(
                        orcamento=orcamento,
                        parceiro=parceiro,
                        procedimento=procedimento,
                        valor_venda=proc_data["valor_venda"],
                        valor_repasse=ParceiroProcedimentos.objects.get(parceiro=parceiro, procedimento=procedimento).valor_repasse
                    )
            return JsonResponse({"message": "Orçamento atualizado com sucesso!"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método não permitido"}, status=405)

def buscar_status(request):
    status_list = list(Status.objects.values("id", "nome"))
    return JsonResponse({"status": status_list})