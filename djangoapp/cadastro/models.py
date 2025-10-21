from django.db import models

# Create your models here.
class Endereco(models.Model):
    rua = models.CharField(max_length=255, verbose_name="Rua")
    numero = models.CharField(max_length=50, null=True, blank=True, verbose_name="Número")
    bairro = models.CharField(max_length=255, null=True, blank=True, verbose_name="Bairro")
    cidade = models.CharField(max_length=255, verbose_name="Cidade")
    estado = models.CharField(max_length=255, verbose_name="Estado")
    cep = models.CharField(max_length=20, null=True, blank=True, verbose_name="CEP")
    complemento = models.CharField(max_length=255, null=True, blank=True, verbose_name="Complemento")
    referencia = models.CharField(max_length=255, null=True, blank=True, verbose_name="Referência")

    class Meta:
        db_table = 'sistema_pulse"."endereco'
        verbose_name = "Endereço"
        verbose_name_plural = "Endereços"

    def __str__(self):
        return f"{self.rua}, {self.numero} - {self.cidade}/{self.estado}"
    
class Paciente(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True, verbose_name="CPF") # cpf não obrigatório
    telefone = models.CharField(max_length=15, unique=True, null=True, blank=True, verbose_name="Telefone") # tem que ser único
    email = models.EmailField(null=True, blank=True, verbose_name="E-mail")
    endereco = models.ForeignKey('Endereco', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Endereço")
    data_nascimento = models.DateField(null=True, blank=True, verbose_name="Data de Nascimento")
    genero = models.CharField(max_length=10, choices=[
        ('M', 'Masculino'),
        ('F', 'Feminino'),
        ('O', 'Outro'),
    ], null=True, blank=True, verbose_name="Gênero")
    anamnese = models.TextField(null=True, blank=True, verbose_name="Anamnese")

    class Meta:
        db_table = 'sistema_pulse"."paciente'
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"

    def __str__(self):
        return self.nome
    
class Especialidade(models.Model):
    nome = models.CharField(max_length=255, unique=True, verbose_name="Nome")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")

    class Meta:
        db_table = 'sistema_pulse"."especialidade'
        verbose_name = "Especialidade"
        verbose_name_plural = "Especialidades"

    def __str__(self):
        return self.nome
    
class Tipo(models.Model):
    nome = models.CharField(max_length=50, unique=True, verbose_name="Nome")

    class Meta:
        db_table = 'sistema_pulse"."tipo'
        verbose_name = "Tipo"
        verbose_name_plural = "Tipos"

    def __str__(self):
        return self.nome

class Subtipo(models.Model):
    nome = models.CharField(max_length=50, unique=True, verbose_name="Nome")
    tipo = models.ForeignKey('Tipo', on_delete=models.CASCADE, verbose_name="Tipo")

    class Meta:
        db_table = 'sistema_pulse"."subtipo'
        verbose_name = "Subtipo"
        verbose_name_plural = "Subtipos"

    def __str__(self):
        return self.nome

class Parceiro(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    cpf_cnpj = models.CharField(max_length=18, unique=True, verbose_name="CPF", null=True)
    telefone = models.CharField(max_length=15, null=True, blank=True, verbose_name="Telefone")
    email = models.EmailField(null=True, blank=True, verbose_name="E-mail")
    endereco = models.ForeignKey('Endereco', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Endereço")
    tipo = models.ForeignKey('Tipo', on_delete=models.SET_NULL, null=True, verbose_name="Tipo")
    subtipo = models.ForeignKey('Subtipo', on_delete=models.SET_NULL, null=True, verbose_name="Subtipo")
    especialidade = models.ForeignKey('Especialidade', on_delete=models.SET_NULL, null=True, verbose_name="Especialidade")

    class Meta:
        db_table = 'sistema_pulse"."parceiro'
        verbose_name = "Parceiro"
        verbose_name_plural = "Parceiros"

    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")

    class Meta:
        db_table = 'sistema_pulse"."produto'
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"

    def __str__(self):
        return self.nome
    
class Procedimento(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    especialidade = models.ForeignKey('Especialidade', on_delete=models.SET_NULL, null=True, verbose_name="Especialidade")

    class Meta:
        db_table = 'sistema_pulse"."procedimento'
        verbose_name = "Procedimento"
        verbose_name_plural = "Procedimentos"

    def __str__(self):
        return self.nome
    
class ProcedimentoProdutos(models.Model):
    procedimento = models.ForeignKey('Procedimento', on_delete=models.SET_NULL, null=True, verbose_name="Procedimento")
    produto = models.ForeignKey('Produto', on_delete=models.SET_NULL, null=True, verbose_name="Produto")

    class Meta:
        db_table = 'sistema_pulse"."procedimento_produtos'
        verbose_name = "Procedimento - Produto"

    def __str__(self):
        return self.procedimento.nome

class OrcamentoProcedimentos(models.Model):
    orcamento = models.ForeignKey('Orcamento', on_delete=models.SET_NULL, null=True, verbose_name="Orçamento")
    procedimento = models.ForeignKey('Procedimento', on_delete=models.SET_NULL, null=True, verbose_name="Procedimento")

    class Meta:
        db_table = 'sistema_pulse"."orcamento_procedimentos'
        verbose_name = "Orçamento - Procedimentos"

    def __str__(self):
        return self.procedimento.nome

class Status(models.Model):
    nome = models.CharField(max_length=50, unique=True, verbose_name="Nome")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")

    class Meta:
        db_table = 'sistema_pulse"."status'
        verbose_name = "Status"
        verbose_name_plural = "Status"

    def __str__(self):
        return self.nome
    
class ParceiroProdutos(models.Model):
    parceiro = models.ForeignKey('Parceiro', on_delete=models.CASCADE, verbose_name="Parceiro")
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE, verbose_name="Produto")
    valor_particular = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Particular")
    valor_repasse = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor de Repasse")
    valor_venda = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor de Venda")

    class Meta:
        db_table = 'sistema_pulse"."parceiro_produtos'
        verbose_name = "Parceiro - Produto"
        verbose_name_plural = "Parceiros - Produtos"
        unique_together = ('parceiro', 'produto')

    def __str__(self):
        return f"{self.parceiro.nome} - {self.produto.nome}"

class Orcamento(models.Model):
    status = models.ForeignKey('Status', on_delete=models.CASCADE, verbose_name="Status")
    data_criacao = models.DateField(null=True, blank=True, verbose_name="Data de Criação")
    data_aprovacao = models.DateField(null=True, blank=True, verbose_name="Data de Aprovação")
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Valor Total")
    data_cirurgia = models.DateField(null=True, blank=True, verbose_name="Data da Cirurgia")
    custo_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Custo Total")
    lucro_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Lucro Total")
    # coluna = models.ForeignKey('Coluna', null=True, blank=True, on_delete=models.SET_NULL, related_name='orcamentos')
    
    class Meta:
        db_table = 'sistema_pulse"."orcamento'
        verbose_name = "Orçamento"
        verbose_name_plural = "Orçamentos"

    def __str__(self):
        return f"Orçamento {self.id}"
    
class OrcamentoParceiros(models.Model):
    orcamento = models.ForeignKey('Orcamento', on_delete=models.CASCADE, verbose_name="Orçamento", related_name='orcamento_parceiros')
    parceiro = models.ForeignKey('Parceiro', on_delete=models.CASCADE, verbose_name="Parceiro")
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE, verbose_name="Produto", default=2)
    valor_venda = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor da venda")
    valor_repasse = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor da repasse")
    custos = models.ForeignKey('Custos', on_delete=models.CASCADE, verbose_name="Custos")
    margem_lucro = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Margem de lucro")

    class Meta:
        db_table = 'sistema_pulse"."orcamento_parceiros'
        verbose_name = "Orçamento - Parceiro"
        verbose_name_plural = "Orçamentos - Parceiros"
        unique_together = ('orcamento', 'parceiro', 'produto')

    def __str__(self):
        return f"{self.orcamento} - {self.parceiro.nome}"
    
class SolicitacaoOrcamento(models.Model):
    data_solicitacao = models.DateTimeField(auto_now_add=True, verbose_name="Data da Solicitação")
    paciente = models.ForeignKey('Paciente', on_delete=models.CASCADE, verbose_name="Paciente")
    orcamento = models.OneToOneField('Orcamento', null=True, blank=True, on_delete=models.SET_NULL, verbose_name="Orçamento", related_name='solicitacao_orcamento')
    status = models.ForeignKey('Status', on_delete=models.CASCADE, verbose_name="Status")

    class Meta:
        db_table = 'sistema_pulse"."solicitacao_orcamento'
        verbose_name = "Solicitação de Orçamento"
        verbose_name_plural = "Solicitações de Orçamento"

    def __str__(self):
        return f"Solicitação {self.id} - Paciente: {self.paciente.nome}"
    
class Pacote(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")
    valor_base = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Base")

    class Meta:
        db_table = 'sistema_pulse"."pacote'
        verbose_name = "Pacote"
        verbose_name_plural = "Pacotes"

    def __str__(self):
        return self.nome

class PacoteProcedimentos(models.Model):
    pacote = models.ForeignKey('Pacote', on_delete=models.CASCADE, verbose_name="Pacote")
    procedimento = models.ForeignKey('Procedimento', on_delete=models.CASCADE, verbose_name="Procedimento")

    class Meta:
        db_table = 'sistema_pulse"."pacote_procedimentos'
        verbose_name = "Pacote - Procedimento"
        verbose_name_plural = "Pacotes - Procedimentos"
        unique_together = ('pacote', 'procedimento')

    def __str__(self):
        return f"{self.pacote.nome} - {self.procedimento.nome}"
    
class OrcamentoPacotes(models.Model):
    orcamento = models.ForeignKey('Orcamento', on_delete=models.CASCADE, verbose_name="Orçamento")
    pacote = models.ForeignKey('Pacote', on_delete=models.CASCADE, verbose_name="Pacote")
    parceiro = models.ForeignKey('Parceiro', on_delete=models.CASCADE, verbose_name="Parceiro")
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Total do Pacote")

    class Meta:
        db_table = 'sistema_pulse"."orcamento_pacotes'
        verbose_name = "Orçamento - Pacote"
        verbose_name_plural = "Orçamentos - Pacotes"

    def __str__(self):
        return f"Orçamento {self.orcamento.id} - Pacote {self.pacote.nome}"
    
class Custos(models.Model):
    comissao_indicacao = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Comissão Indicação", default = 0)
    comissao_venda = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Comissão Venda", default = 0)
    brindes = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Brindes")
    imposto = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Imposto")
    cartao = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cartão")

    class Meta:
        db_table = 'sistema_pulse"."custos'
        verbose_name = "Custos"
    
    def __str__(self):
        return f"Comissão {self.comissao}"
    
# ===========================================================================================
class Coluna(models.Model):
    titulo = models.CharField(max_length=100)
    ordem = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'sistema_pulse"."coluna'

    def __str__(self):
        return self.titulo

class Card(models.Model):
    orcamento = models.ForeignKey('Orcamento', on_delete=models.CASCADE, null=True, blank=True)
    coluna = models.ForeignKey(Coluna, on_delete=models.CASCADE, related_name='cards', null=True, blank=True)
    cor = models.CharField(max_length=20, blank=True, null=True)
    prioridade = models.CharField(max_length=50, blank=True, null=True)
    anotacao = models.TextField(blank=True, null=True)
    data_movimentacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'sistema_pulse"."card'

    def __str__(self):
        return f'Card - {self.orcamento}'