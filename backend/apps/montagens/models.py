"""
Fluxo de montagem: questionário → jogos/programas escolhidos → setup gerado.

Regras de negócio refletidas aqui:
- O questionário não é ligado a usuário (visitantes também preenchem).
- Só usuário cadastrado salva setup (FK obrigatória para usuario).
- Peça usada em algum setup não pode ser apagada (PROTECT); o preço do
  setup fica registrado mesmo que o preço da peça mude depois.
"""

from django.conf import settings
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


class RequisitoDesempenho(models.Model):
    """Campos comuns de Jogo e Programa (classe abstrata, sem tabela)."""

    nome = models.CharField(max_length=100)
    desempenho_minimo = models.IntegerField(help_text="Mesma escala de Cpu.pontuacao_desempenho (0–100)")
    desempenho_recomendado = models.IntegerField()
    vram_minima = models.IntegerField(help_text="Em GB")
    vram_recomendada = models.IntegerField(help_text="Em GB")
    ram_minima = models.IntegerField(help_text="Em GB")
    ram_recomendada = models.IntegerField(help_text="Em GB")

    class Meta:
        abstract = True
        ordering = ["nome"]

    def __str__(self):
        return self.nome


class Jogo(RequisitoDesempenho):
    id = models.AutoField(primary_key=True, db_column="id_jogo")

    class Meta(RequisitoDesempenho.Meta):
        db_table = "jogo"
        verbose_name = "jogo"
        verbose_name_plural = "jogos"


class Programa(RequisitoDesempenho):
    id = models.AutoField(primary_key=True, db_column="id_programa")
    categoria = models.CharField(max_length=50)

    class Meta(RequisitoDesempenho.Meta):
        db_table = "programa"
        verbose_name = "programa"
        verbose_name_plural = "programas"


class Questionario(models.Model):
    id = models.AutoField(primary_key=True, db_column="id_questionario")
    finalidade = models.CharField(max_length=50, help_text="Ex.: Jogos, Trabalho, Estudos, Edição")
    orcamento = models.DecimalField(max_digits=10, decimal_places=2)
    preferencia_cpu = models.CharField(max_length=20, null=True, blank=True,
                                       help_text="Intel, AMD ou Sem preferência")
    prioridade_desempenho = models.CharField(max_length=30, null=True, blank=True)
    fps_alvo = models.IntegerField(null=True, blank=True,
                                   help_text="Só quando a finalidade é Jogos")
    resolucao_alvo = models.CharField(max_length=20, null=True, blank=True,
                                      help_text="Ex.: 1080p, 1440p, 4K")
    data_preenchimento = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "questionario"
        verbose_name = "questionário"
        verbose_name_plural = "questionários"

    def __str__(self):
        return f"Questionário #{self.id} — {self.finalidade}"


class QuestionarioJogo(models.Model):
    pk = models.CompositePrimaryKey("questionario_id", "jogo_id")
    questionario = models.ForeignKey(Questionario, on_delete=models.CASCADE,
                                     db_column="questionario_id_questionario",
                                     related_name="jogos_escolhidos")
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, db_column="jogo_id_jogo",
                             related_name="questionarios")

    class Meta:
        db_table = "questionario_has_jogo"


class QuestionarioPrograma(models.Model):
    pk = models.CompositePrimaryKey("questionario_id", "programa_id")
    questionario = models.ForeignKey(Questionario, on_delete=models.CASCADE,
                                     db_column="questionario_id_questionario",
                                     related_name="programas_escolhidos")
    programa = models.ForeignKey(Programa, on_delete=models.CASCADE,
                                 db_column="programa_id_programa",
                                 related_name="questionarios")

    class Meta:
        db_table = "questionario_has_programa"


class Setup(models.Model):
    class Categoria(models.TextChoices):
        ABAIXO = "Abaixo do Orçamento", "Abaixo do Orçamento"
        EQUILIBRIO = "Equilíbrio", "Equilíbrio"
        ACIMA = "Acima do Orçamento", "Acima do Orçamento"

    id = models.AutoField(primary_key=True, db_column="id_setup")
    preco = models.DecimalField(max_digits=10, decimal_places=2,
                                help_text="Valor total no momento da geração")
    data_criacao = models.DateTimeField(auto_now_add=True)
    categoria = models.CharField(max_length=30, choices=Categoria.choices)

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                db_column="usuario_id_usuario", related_name="setups")
    questionario = models.ForeignKey(Questionario, on_delete=models.PROTECT,
                                     db_column="questionario_id_questionario",
                                     related_name="setups")
    cpu = models.ForeignKey(Cpu, on_delete=models.PROTECT, db_column="cpu_id_cpu")
    placamae = models.ForeignKey(PlacaMae, on_delete=models.PROTECT,
                                 db_column="placamae_id_placamae")
    ram = models.ForeignKey(Ram, on_delete=models.PROTECT, db_column="ram_id_ram")
    gpu = models.ForeignKey(Gpu, on_delete=models.PROTECT, db_column="gpu_id_gpu")
    fonte = models.ForeignKey(Fonte, on_delete=models.PROTECT, db_column="fonte_id_fonte")
    armazenamento = models.ForeignKey(Armazenamento, on_delete=models.PROTECT,
                                      db_column="armazenamento_id_armazenamento")
    gabinete = models.ForeignKey(Gabinete, on_delete=models.PROTECT,
                                 db_column="gabinete_id_gabinete")

    class Meta:
        db_table = "setup"
        verbose_name = "setup"
        verbose_name_plural = "setups"

    def __str__(self):
        return f"Setup #{self.id} ({self.categoria}) — {self.usuario}"
