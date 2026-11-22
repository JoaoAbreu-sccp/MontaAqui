from django.contrib import admin

from .models import Loja

# As tabelas loja_has_* usam chave primária composta, que o painel admin do
# Django ainda não suporta; por isso só a Loja aparece aqui.


@admin.register(Loja)
class LojaAdmin(admin.ModelAdmin):
    list_display = ("nome", "url_base", "codigo_afiliado")
