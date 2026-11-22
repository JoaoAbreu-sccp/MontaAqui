from django.contrib import admin

from .models import Jogo, Programa, Questionario, Setup

# questionario_has_jogo e questionario_has_programa usam chave primária
# composta, que o painel admin do Django ainda não suporta.


@admin.register(Jogo)
class JogoAdmin(admin.ModelAdmin):
    list_display = ("nome", "desempenho_minimo", "desempenho_recomendado", "vram_minima", "ram_minima")
    search_fields = ("nome",)


@admin.register(Programa)
class ProgramaAdmin(admin.ModelAdmin):
    list_display = ("nome", "categoria", "desempenho_minimo", "desempenho_recomendado")
    list_filter = ("categoria",)
    search_fields = ("nome",)


@admin.register(Questionario)
class QuestionarioAdmin(admin.ModelAdmin):
    list_display = ("id", "finalidade", "orcamento", "data_preenchimento")
    list_filter = ("finalidade",)


@admin.register(Setup)
class SetupAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "categoria", "preco", "data_criacao")
    list_filter = ("categoria",)
    raw_id_fields = ("usuario", "questionario")
