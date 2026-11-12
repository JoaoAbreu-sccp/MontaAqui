"""
Peças de hardware do MontaAqui.

Herança mapeada por Concrete Table Inheritance: cada tipo de peça tem a sua
tabela completa, sem tabela "componente". Os campos comuns (marca, modelo,
preco) ficam numa classe abstrata, que não vira tabela no banco.

Campos com mais de um valor (ex.: PlacaMae.geracao_cpu) guardam a lista
separada por vírgula, sem espaço: "Ryzen 3000,Ryzen 5000". Use os métodos
auxiliares (geracoes_cpu_suportadas, interfaces_suportadas) em vez de
quebrar a string na mão.
"""

from django.db import models

# Hierarquia de tamanho de placa-mãe/gabinete: um gabinete aceita placas do
# seu formato ou menores (Mini-ITX < Micro-ATX < ATX).
HIERARQUIA_FORMATO = {"Mini-ITX": 1, "Micro-ATX": 2, "ATX": 3}


def _lista(valor):
    return [item.strip() for item in valor.split(",") if item.strip()]


class Componente(models.Model):
    """Campos comuns a todas as peças (classe abstrata, sem tabela)."""

    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        abstract = True
        ordering = ["preco"]

    def __str__(self):
        return f"{self.marca} {self.modelo}"


class Cpu(Componente):
    id = models.AutoField(primary_key=True, db_column="id_cpu")
    socket = models.CharField(max_length=20, help_text="Ex.: AM4, AM5, LGA1700")
    geracao = models.CharField(max_length=30, help_text="Ex.: Ryzen 5000, Intel 13")
    consumo_watts = models.IntegerField()
    nucleos = models.IntegerField()
    pontuacao_desempenho = models.IntegerField(
        help_text="Escala 0–100, a mesma de Jogo/Programa.desempenho_*"
    )

    class Meta(Componente.Meta):
        db_table = "cpu"
        verbose_name = "CPU"
        verbose_name_plural = "CPUs"


class PlacaMae(Componente):
    id = models.AutoField(primary_key=True, db_column="id_placamae")
    socket = models.CharField(max_length=20)
    geracao_ddr = models.CharField(max_length=10, help_text="DDR4 ou DDR5")
    formato = models.CharField(max_length=20, help_text="Mini-ITX, Micro-ATX ou ATX")
    geracao_cpu = models.CharField(
        max_length=100, help_text="Lista separada por vírgula. Ex.: Ryzen 3000,Ryzen 5000"
    )
    velocidade_maxima_ram = models.IntegerField(help_text="Em MHz")
    interface_armazenamento = models.CharField(
        max_length=50, help_text="Lista separada por vírgula. Ex.: SATA,M.2 NVMe"
    )

    class Meta(Componente.Meta):
        db_table = "placamae"
        verbose_name = "placa-mãe"
        verbose_name_plural = "placas-mãe"

    def geracoes_cpu_suportadas(self):
        return _lista(self.geracao_cpu)

    def interfaces_suportadas(self):
        return _lista(self.interface_armazenamento)


class Ram(Componente):
    id = models.AutoField(primary_key=True, db_column="id_ram")
    capacidade_gb = models.IntegerField(help_text="Capacidade total do kit")
    geracao_ddr = models.CharField(max_length=10)
    frequencia_mhz = models.IntegerField()

    class Meta(Componente.Meta):
        db_table = "ram"
        verbose_name = "memória RAM"
        verbose_name_plural = "memórias RAM"


class Gpu(Componente):
    id = models.AutoField(primary_key=True, db_column="id_gpu")
    vram = models.IntegerField(help_text="Em GB")
    comprimento_mm = models.IntegerField()
    consumo_watts = models.IntegerField()
    conectores_necessarios = models.CharField(
        max_length=50, help_text="Ex.: 1x 8 pinos, 1x 12V-2x6, Nenhum"
    )
    # Adicionada para o motor comparar placas de vídeo pela força, e não só pela
    # VRAM e pelo preço. Escala própria 0–100 (RTX 5080 = 100), como a da CPU.
    pontuacao_desempenho = models.IntegerField(
        help_text="Escala 0–100 (RTX 5080 = 100). Usada pelo motor de recomendação"
    )

    class Meta(Componente.Meta):
        db_table = "gpu"
        verbose_name = "placa de vídeo"
        verbose_name_plural = "placas de vídeo"


class Fonte(Componente):
    id = models.AutoField(primary_key=True, db_column="id_fonte")
    capacidade_watts = models.IntegerField()
    formato = models.CharField(max_length=10, help_text="ATX ou SFX")
    conectores_pcie = models.CharField(max_length=50)

    class Meta(Componente.Meta):
        db_table = "fonte"
        verbose_name = "fonte"
        verbose_name_plural = "fontes"


class Armazenamento(Componente):
    id = models.AutoField(primary_key=True, db_column="id_armazenamento")
    tipo = models.CharField(max_length=20, help_text="SSD NVMe, SSD SATA ou HD")
    unidade_medida = models.CharField(max_length=5, help_text="GB ou TB")
    capacidade = models.IntegerField()
    interface = models.CharField(max_length=20, help_text="SATA ou M.2 NVMe")

    class Meta(Componente.Meta):
        db_table = "armazenamento"
        verbose_name = "armazenamento"
        verbose_name_plural = "armazenamentos"


class Gabinete(Componente):
    id = models.AutoField(primary_key=True, db_column="id_gabinete")
    formato = models.CharField(
        max_length=20, help_text="Maior placa-mãe suportada: Mini-ITX < Micro-ATX < ATX"
    )
    comprimento_max_gpu = models.IntegerField(help_text="Em mm")
    formato_fonte = models.CharField(max_length=10, help_text="ATX ou SFX")

    class Meta(Componente.Meta):
        db_table = "gabinete"
        verbose_name = "gabinete"
        verbose_name_plural = "gabinetes"

    def comporta_placa(self, placa):
        """True se a placa-mãe cabe neste gabinete (comparação por hierarquia)."""
        return HIERARQUIA_FORMATO[placa.formato] <= HIERARQUIA_FORMATO[self.formato]
