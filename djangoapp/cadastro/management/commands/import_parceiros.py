import csv
import re
from unidecode import unidecode
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from cadastro.models import Endereco, Parceiro, Tipo, Subtipo, Especialidade

# -------- Helpers de normalização --------
only_digits = lambda s: re.sub(r"\D", "", s or "")

def norm_text(s: str) -> str:
    if s is None:
        return ""
    return unidecode(str(s)).strip()

def norm_key(s: str) -> str:
    # chave para comparação sem acento e case-insensitive
    return norm_text(s).lower()

def norm_email(s: str) -> str:
    return (s or "").strip().lower()

def norm_uf(s: str) -> str:
    return (s or "").strip().upper()

class Command(BaseCommand):
    help = "Importa Parceiros + Enderecos a partir de um CSV"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Caminho do arquivo CSV com as colunas esperadas")

    def handle(self, *args, **options):
        csv_path = options["csv_path"]

        # Campos esperados no CSV (respeite exatamente esses rótulos)
        expected_cols = {
            "Nome", "Telefone", "Email", "Rua", "Número", "Bairro", "Cidade", "Estado",
            "CEP", "Complemento", "Ponto de referência", "Tipo", "Subtipo",
            "Especialidade", "CNPJ/CPF"
        }

        # Carregar uma vez os mapas das dimensões
        tipo_map = {norm_key(t.nome): t.id for t in Tipo.objects.all()}
        subtipo_map = {norm_key(s.nome): s.id for s in Subtipo.objects.all()}
        esp_map = {norm_key(e.nome): e.id for e in Especialidade.objects.all()}

        inserted = 0
        updated = 0
        skipped = []

        try:
            with open(csv_path, "r", newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                cols = set(reader.fieldnames or [])
                missing_cols = expected_cols - cols
                if missing_cols:
                    raise CommandError(
                        f"CSV faltando colunas: {', '.join(sorted(missing_cols))}"
                    )

                with transaction.atomic():
                    for idx, row in enumerate(reader, start=2):  # start=2 para contar a partir da 2ª linha (após header)
                        # -------- Normalização dos campos --------
                        nome = norm_text(row["Nome"])
                        telefone = only_digits(row["Telefone"])
                        email = norm_email(row["Email"])

                        rua = norm_text(row["Rua"])
                        numero = norm_text(row["Número"]) or None
                        bairro = norm_text(row["Bairro"]) or None
                        cidade = norm_text(row["Cidade"])
                        estado = norm_uf(row["Estado"])
                        cep = only_digits(row["CEP"]) or None
                        complemento = norm_text(row["Complemento"]) or None
                        referencia = norm_text(row["Ponto de referência"]) or None

                        tipo_nome = norm_text(row["Tipo"])
                        subtipo_nome = norm_text(row["Subtipo"])
                        esp_nome = norm_text(row["Especialidade"])

                        documento = only_digits(row["CNPJ/CPF"])  # armazene só dígitos p/ consistência

                        # -------- Validar FKs --------
                        tipo_id = tipo_map.get(norm_key(tipo_nome))
                        subtipo_id = subtipo_map.get(norm_key(subtipo_nome))
                        esp_id = esp_map.get(norm_key(esp_nome))

                        if not tipo_id or not subtipo_id or not esp_id:
                            motivos = []
                            if not tipo_id: motivos.append(f"Tipo='{tipo_nome}'")
                            if not subtipo_id: motivos.append(f"Subtipo='{subtipo_nome}'")
                            if not esp_id: motivos.append(f"Especialidade='{esp_nome}'")
                            skipped.append((idx, nome, " ; ".join(motivos)))
                            continue

                        # -------- Endereco: get_or_create por chave natural --------
                        end_kwargs_key = dict(
                            rua=rua, numero=numero, bairro=bairro, cidade=cidade, estado=estado, cep=cep
                        )
                        end_defaults = dict(
                            complemento=complemento, referencia=referencia
                        )

                        endereco, created_end = Endereco.objects.get_or_create(
                            **end_kwargs_key, defaults=end_defaults
                        )
                        # Se já existia, atualiza complemento/referencia se vierem agora
                        changed_end = False
                        if not created_end:
                            if complemento and not endereco.complemento:
                                endereco.complemento = complemento
                                changed_end = True
                            if referencia and not endereco.referencia:
                                endereco.referencia = referencia
                                changed_end = True
                            if changed_end:
                                endereco.save(update_fields=["complemento", "referencia"])

                        # -------- Parceiro: update_or_create pela chave única cpf_cnpj --------
                        parceiro_vals = dict(
                            nome=nome,
                            telefone=telefone or None,
                            email=email or None,
                            endereco=endereco,
                            tipo_id=tipo_id,
                            subtipo_id=subtipo_id,
                            especialidade_id=esp_id,
                        )
                        parceiro, created_parc = Parceiro.objects.update_or_create(
                            cpf_cnpj=documento or None, defaults=parceiro_vals
                        )
                        if created_parc:
                            inserted += 1
                        else:
                            updated += 1

        except FileNotFoundError:
            raise CommandError(f"Arquivo não encontrado: {csv_path}")

        # -------- Relatório final --------
        self.stdout.write(self.style.SUCCESS(f"Inseridos: {inserted} | Atualizados: {updated}"))
        if skipped:
            self.stdout.write(self.style.WARNING("\nLinhas puladas (cadastre/ajuste as FKs ou o CSV):"))
            for (lineno, nome, motivo) in skipped:
                self.stdout.write(f"  - Linha {lineno} | {nome} | {motivo}")
