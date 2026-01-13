from rest_framework import serializers
from .models import Coluna, Card, Orcamento, Status, Procedimento, Especialidade, Parceiro, Subtipo

class OrcamentoKanbanSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(
        source='solicitacao_orcamento.paciente.nome',
        read_only=True
    )

    status_nome = serializers.CharField(
        source='status.nome',
        read_only=True
    )

    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    data_criacao = serializers.SerializerMethodField()

    # valor_total = serializers.SerializerMethodField()

    # tipo_orcamento = serializers.CharField(read_only=True)
    # responsavel = serializers.CharField(read_only=True)
    # observacoes = serializers.CharField(read_only=True)
    # pagamento = serializers.CharField(read_only=True)
    # canal = serializers.CharField(read_only=True)

    class Meta:
        model = Orcamento
        fields = ['id', 'title', 'description', 'paciente_nome',
                  'data_criacao', 'valor_total', 'status_nome',
                #   'tipo_orcamento', 'responsavel', 'observacoes',
                #   'pagamento', 'canal',
                ]

    def get_title(self, obj):
        return f"Orçamentos #{obj.id}"

    def get_description(self, obj):
        return f"R$ {obj.valor_total:.2f}"

    def get_data_criacao(self, obj):
        return obj.data_criacao.strftime('%d/%m/%Y') if obj.data_criacao else ''
    
    # def get_valor_total(self, obj):
    #     return obj.valor_total

class OrcamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orcamento
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    orcamento = OrcamentoKanbanSerializer(read_only=True)

    coluna = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    coluna_id = serializers.PrimaryKeyRelatedField(
        queryset=Coluna.objects.all(),
        source='coluna',
        write_only=True,
        required=False
    )

    class Meta:
        model = Card
        fields = ['id', 'prioridade', 'coluna', 'coluna_id', 'orcamento']

class ColunaSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Coluna
        fields = ['id', 'titulo', 'ordem', 'cards']

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'nome']

class EspecialidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidade
        fields = ['id', 'nome']

class ProcedimentoSerializer(serializers.ModelSerializer):
    especialidade = EspecialidadeSerializer()

    class Meta:
        model = Procedimento
        fields = ['id', 'nome', 'especialidade']

class SubtipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtipo
        fields = ['id', 'nome']

class ParceiroSerializer(serializers.ModelSerializer):
    subtipo = SubtipoSerializer()

    class Meta:
        model = Parceiro
        fields = ['id', 'nome', 'subtipo']