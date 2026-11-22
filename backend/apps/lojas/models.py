"""
Lojas parceiras e a disponibilidade de cada peça em cada loja.

As tabelas loja_has_* usam chave primária composta (loja + peça), igual ao
modelo físico. Isso exige Django 5.2 ou superior (CompositePrimaryKey).

Link final de compra = loja.url_base + caminho_produto + código de afiliado.
"""

from django.db import models

from apps.componentes.models import (
    Armazenamento,
    Cpu,
    Fonte,
    Gabinete,
    Gpu,
    PlacaMae,
    Ram,
)


class Loja(models.Model):
    id = models.AutoField(primary_key=True, db_column="id_loja")
    nome = models.CharField(max_length=100)
    url_base = models.CharField(max_length=255)
    codigo_afiliado = models.CharField(max_length=100, db_column="codigoAfiliado")

    class Meta:
        db_table = "loja"
        verbose_name = "loja"
        verbose_name_plural = "lojas"

    def __str__(self):
        return self.nome

    def gerar_link_afiliado(self, caminho_produto):
        separador = "&" if "?" in caminho_produto else "?"
        return f"{self.url_base}{caminho_produto}{separador}afiliado={self.codigo_afiliado}"


class LojaCpu(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "cpu_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_cpu")
    cpu = models.ForeignKey(Cpu, on_delete=models.CASCADE, db_column="cpu_id_cpu",
                            related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_cpu"


class LojaPlacaMae(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "placamae_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_placamae")
    placamae = models.ForeignKey(PlacaMae, on_delete=models.CASCADE,
                                 db_column="placamae_id_placamae", related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_placamae"


class LojaRam(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "ram_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_ram")
    ram = models.ForeignKey(Ram, on_delete=models.CASCADE, db_column="ram_id_ram",
                            related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_ram"


class LojaGpu(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "gpu_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_gpu")
    gpu = models.ForeignKey(Gpu, on_delete=models.CASCADE, db_column="gpu_id_gpu",
                            related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_gpu"


class LojaFonte(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "fonte_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_fonte")
    fonte = models.ForeignKey(Fonte, on_delete=models.CASCADE, db_column="fonte_id_fonte",
                              related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_fonte"


class LojaArmazenamento(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "armazenamento_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_armazenamento")
    armazenamento = models.ForeignKey(Armazenamento, on_delete=models.CASCADE,
                                      db_column="armazenamento_id_armazenamento",
                                      related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_armazenamento"


class LojaGabinete(models.Model):
    pk = models.CompositePrimaryKey("loja_id", "gabinete_id")
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, db_column="loja_id_loja",
                             related_name="ofertas_gabinete")
    gabinete = models.ForeignKey(Gabinete, on_delete=models.CASCADE,
                                 db_column="gabinete_id_gabinete", related_name="ofertas")
    caminho_produto = models.CharField(max_length=255)

    class Meta:
        db_table = "loja_has_gabinete"
