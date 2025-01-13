from django.db import models

# Create your models here.

from django.db import models

class Solicitation(models.Model):
    cliente_nome = models.CharField(max_length=255)
    cliente_email = models.EmailField()
    procedimento = models.CharField(max_length=255)
    hospital = models.CharField(max_length=255)
    valor_estimado = models.DecimalField(max_digits=10, decimal_places=2)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente_nome} - {self.procedimento}"
