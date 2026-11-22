from django.contrib import admin

from .models import Armazenamento, Cpu, Fonte, Gabinete, Gpu, PlacaMae, Ram


class ComponenteAdmin(admin.ModelAdmin):
    list_display = ("marca", "modelo", "preco")
    search_fields = ("marca", "modelo")
    list_filter = ("marca",)


@admin.register(Cpu)
class CpuAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "socket", "geracao", "pontuacao_desempenho", "preco")
    list_filter = ("marca", "socket")


@admin.register(PlacaMae)
class PlacaMaeAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "socket", "geracao_ddr", "formato", "preco")
    list_filter = ("socket", "geracao_ddr", "formato")


@admin.register(Ram)
class RamAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "capacidade_gb", "geracao_ddr", "frequencia_mhz", "preco")
    list_filter = ("geracao_ddr",)


@admin.register(Gpu)
class GpuAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "vram", "comprimento_mm", "consumo_watts", "preco")


@admin.register(Fonte)
class FonteAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "capacidade_watts", "formato", "preco")
    list_filter = ("formato",)


@admin.register(Armazenamento)
class ArmazenamentoAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "tipo", "capacidade", "unidade_medida", "preco")
    list_filter = ("tipo", "interface")


@admin.register(Gabinete)
class GabineteAdmin(ComponenteAdmin):
    list_display = ("marca", "modelo", "formato", "comprimento_max_gpu", "preco")
    list_filter = ("formato",)
