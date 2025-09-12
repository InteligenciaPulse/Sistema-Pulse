import csv
import re
from decimal import Decimal, InvalidOperation
from contextlib import contextmanager
from unidecode import unidecode

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models import Q

from cadastro.models import Parceiro, Especialidade, Produto, ParceiroProdutos
# docker exec -it djangoapp python manage.py import_parceiro_produtos /djangoapp/cadastro/management/commands/neuroc.csv
# ---------- helpers ----------
def norm_key(s: str) -> str:
    return unidecode((s or "").strip()).lower()

def cap_first_lower_rest(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s*/\s*", "/", s)
    s = re.sub(r"\s+", " ", s)
    if not s:
        return s
    return s[0].upper() + s[1:]

def br_money_to_decimal(s: str):
    if not s or not str(s).strip():
        return None
    s = str(s)
    s = s.replace("R$", "").replace("r$", "")
    s = s.replace(" ", "")
    s = s.replace(".", "")
    s = s.replace(",", ".")
    try:
        return Decimal(s)
    except InvalidOperation:
        raise ValueError(f"Valor monetário inválido: {s}")

@contextmanager
def nullcontext():
    yield

# ---------- comando ----------
class Command(BaseCommand):
    help = "Importa Produto(s) por Parceiro a partir de CSV e atualiza tabela ParceiroProdutos"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Caminho do CSV")
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Processa sem gravar (somente relatório).",
        )

    def handle(self, *args, **opts):
        csv_path = opts["csv_path"]
        dry_run = opts["dry_run"]

        expected = {
            "PARCEIRO", "ESPECIALIDADE", "PRODUTOS",
            "VALOR PARTICULAR", "VALOR REPASSE", "VALOR VENDA"
        }

        # mapas cacheados p/ resolver rápido
        parceiro_map = {norm_key(p.nome): p for p in Parceiro.objects.all().only("id", "nome")}
        esp_map = {norm_key(e.nome): e for e in Especialidade.objects.all().only("id", "nome")}
        prod_map = {norm_key(p.nome): p for p in Produto.objects.all().only("id", "nome")}

        created_esps = created_prods = 0
        upserts = 0
        skipped = []

        try:
            with open(csv_path, "r", newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                cols = set(reader.fieldnames or [])
                miss = expected - cols
                if miss:
                    raise CommandError(f"CSV faltando colunas: {', '.join(sorted(miss))}")

                ctx = nullcontext() if dry_run else transaction.atomic()
                with ctx:
                    for idx, row in enumerate(reader, start=2):
                        try:
                            parceiro_raw = (row["PARCEIRO"] or "").strip()
                            esp_raw = (row["ESPECIALIDADE"] or "").strip()
                            prod_raw = (row["PRODUTOS"] or "").strip()

                            v_part_raw = row["VALOR PARTICULAR"]
                            v_rep_raw  = row["VALOR REPASSE"]
                            v_vend_raw = row["VALOR VENDA"]

                            parceiro = parceiro_map.get(norm_key(parceiro_raw))
                            if not parceiro:
                                skipped.append((idx, parceiro_raw, "Parceiro não encontrado"))
                                continue

                            esp_name = cap_first_lower_rest(esp_raw)
                            if esp_name:
                                esp_key = norm_key(esp_name)
                                esp = esp_map.get(esp_key)
                                if not esp:
                                    if dry_run:
                                        created_esps += 1
                                    else:
                                        esp = Especialidade.objects.create(nome=esp_name)
                                        esp_map[esp_key] = esp
                                        created_esps += 1
                            # Observação: Especialidade não é FK de ParceiroProdutos; só garantimos cadastro.

                            prod_name = cap_first_lower_rest(prod_raw)
                            if not prod_name:
                                skipped.append((idx, parceiro_raw, "Produto em branco"))
                                continue

                            prod_key = norm_key(prod_name)
                            prod = prod_map.get(prod_key)
                            if not prod:
                                if dry_run:
                                    created_prods += 1
                                    class _Tmp: 
                                        def __init__(self, nome): self.nome, self.id = nome, None
                                    prod = _Tmp(prod_name)
                                else:
                                    prod = Produto.objects.create(nome=prod_name)
                                    prod_map[prod_key] = prod
                                    created_prods += 1

                            v_part = br_money_to_decimal(v_part_raw)
                            v_rep  = br_money_to_decimal(v_rep_raw)
                            v_vend = br_money_to_decimal(v_vend_raw)

                            if dry_run:
                                upserts += 1
                            else:
                                obj, _created = ParceiroProdutos.objects.update_or_create(
                                    parceiro=parceiro, produto_id=getattr(prod, "id", None),
                                    defaults=dict(
                                        valor_particular=v_part,
                                        valor_repasse=v_rep,
                                        valor_venda=v_vend,
                                    )
                                )
                                upserts += 1

                        except Exception as e:
                            skipped.append((idx, row.get("PARCEIRO",""), f"Erro: {e}"))
                            continue

        except FileNotFoundError:
            raise CommandError(f"Arquivo não encontrado: {csv_path}")

        tag = "[DRY-RUN] " if dry_run else ""
        self.stdout.write(self.style.SUCCESS(
            f"{tag}Especialidades criadas: {created_esps} | Produtos criados: {created_prods} | Registros em ParceiroProdutos upsertados: {upserts}"
        ))
        if skipped:
            self.stdout.write(self.style.WARNING(f"\n{tag}Linhas puladas:"))
            for (lineno, parceiro, motivo) in skipped:
                self.stdout.write(f"  - Linha {lineno} | Parceiro: {parceiro} | {motivo}")
