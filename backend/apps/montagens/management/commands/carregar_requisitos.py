"""
Carrega no banco os 16 jogos e 12 programas usados como parâmetro pelo
motor de recomendação.

Uso:  python manage.py carregar_requisitos

Pode rodar quantas vezes quiser: os IDs são fixos e o comando atualiza o que
já existe em vez de duplicar.

COMO OS VALORES FORAM DEFINIDOS
- vram_* e ram_*: em GB, tirados dos requisitos mínimo e recomendado
  oficiais de cada título (Steam, sites dos desenvolvedores, Adobe etc.).
  Valores fracionados foram arredondados para cima (1,5 GB -> 2 GB).
- desempenho_*: o processador exigido pelo requisito oficial convertido para
  a escala 0–100 de Cpu.pontuacao_desempenho (i3-12100F = 30,
  Ryzen 5 5600 = 40, Ryzen 7 9800X3D = 100). O processador original está
  anotado ao lado de cada linha, para conferência.
- Quando o desenvolvedor só publica requisito mínimo, o recomendado foi
  estimado pela equipe; isso está marcado como "estimado" no comentário.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.montagens.models import Jogo, Programa

# Escala usada na conversão (referência para a equipe):
#   Core 2 Duo E8400 ≈ 4 | i3-4150 ≈ 8 | i5-2500K / FX-6300 ≈ 9
#   i5-4460 / i5-4690 / FX-8350 ≈ 11 | i7-4770K ≈ 14 | i5-6600 / Ryzen 1000 ≈ 15–17
#   i7-6700 ≈ 18 | i5-8400 / Ryzen 5 2600 ≈ 20 | Ryzen 7 2700X ≈ 21
#   Ryzen 5 3600 / i7-8700K ≈ 26 | i5-10600K ≈ 28 | Intel 11ª ≈ 31
#   8 núcleos modernos (ex. Ryzen 7 5700X) ≈ 45 | i7-12700 ≈ 68

JOGOS = [
    # id, nome,
    # desempenho (mín, rec), vram GB (mín, rec), ram GB (mín, rec)
    (1, "Valorant", 4, 25, 1, 4, 4, 4),
    # mín: Core 2 Duo E8400 + Intel HD 4000 | rec (alto FPS): i5-9400F + GTX 1050 Ti
    (2, "League of Legends", 3, 7, 1, 1, 2, 4),
    # mín: i3-530 + GeForce 9600GT | rec: i5-3300 + GTX 560
    (3, "Counter-Strike 2", 6, 15, 1, 4, 8, 16),
    # mín: CPU de 4 threads (i5-750) + GPU DX11 1 GB | rec: estimado (Valve só publica mínimo)
    (4, "Fortnite", 6, 12, 1, 2, 8, 8),
    # mín: i3-3225 + Intel HD 4000 | rec: i5-7300U / Ryzen 3 3300U + GTX 960
    (5, "Minecraft", 6, 13, 1, 2, 4, 8),
    # Java Edition. mín: i3-3210 + Intel HD 4000 | rec: i5-4690 + GTX 700
    (6, "GTA V", 13, 26, 4, 8, 8, 16),
    # Edição Enhanced. mín: i7-4770 + GTX 1630 4 GB | rec: i5-9600K / Ryzen 5 3600 + RTX 3060 8 GB
    (7, "EA FC 25", 17, 21, 4, 6, 8, 12),
    # mín: Ryzen 5 1600 / i5-6600K + GTX 1050 Ti | rec: Ryzen 7 2700X / i7-6700 + GTX 1660
    (8, "Rocket League", 4, 10, 2, 3, 4, 8),
    # mín: dual-core 2,5 GHz + GTX 760 | rec: quad-core 3,0 GHz + GTX 1060 3 GB
    (9, "COD: Warzone", 15, 18, 3, 8, 8, 12),
    # mín: Ryzen 5 1400 / i5-6600 | rec: Ryzen 5 1600X / i7-6700K + RTX 3060
    (10, "Cyberpunk 2077", 17, 68, 6, 8, 12, 16),
    # Versão 2.0. mín: i7-6700 / Ryzen 5 1600 + GTX 1060 6 GB | rec: i7-12700 / Ryzen 7 7800X3D + RTX 2060 Super
    (11, "Elden Ring", 20, 26, 3, 8, 12, 16),
    # mín: i5-8400 / Ryzen 3 3300X + GTX 1060 3 GB | rec: i7-8700K / Ryzen 5 3600X + GTX 1070
    (12, "Red Dead Redemption 2", 9, 14, 2, 6, 8, 12),
    # mín: i5-2500K / FX-6300 + GTX 770 | rec: i7-4770K / Ryzen 5 1500X + GTX 1060 6 GB
    (13, "Baldur's Gate 3", 11, 26, 4, 8, 8, 16),
    # mín: i5-4690 / FX-8350 + GTX 970 | rec: i7-8700K / Ryzen 5 3600 + RTX 2060 Super
    (14, "Forza Horizon 5", 11, 20, 4, 8, 8, 16),
    # mín: i5-4460 / Ryzen 3 1200 + GTX 970 | rec: i5-8400 / Ryzen 5 1500X + GTX 1070
    (15, "The Witcher 3", 9, 12, 2, 8, 8, 16),
    # Next-gen, sem ray tracing. mín: i5-2500K + GTX 770 | rec: i7-3770 / Ryzen 3 1200 + GTX 1070
    (16, "Starfield", 20, 28, 8, 8, 16, 16),
    # mín: i7-6800K / Ryzen 5 2600X + GTX 1070 Ti | rec: i5-10600K / Ryzen 5 3600X + RTX 2080
]

PROGRAMAS = [
    # id, nome, categoria,
    # desempenho (mín, rec), vram GB (mín, rec), ram GB (mín, rec)
    (1, "Photoshop", "Edição de imagem", 15, 26, 2, 4, 8, 16),
    # mín: CPU com AVX2 + GPU 1,5 GB | rec: estimado + GPU 4 GB (telas 4K)
    (2, "Illustrator", "Design gráfico", 15, 26, 1, 4, 8, 16),
    # mín: CPU com AVX2 + GPU OpenGL 4.x | rec: estimado
    (3, "Lightroom", "Edição de imagem", 15, 26, 2, 8, 8, 16),
    # Lightroom Classic. mín: Intel 6ª / Ryzen 1000 + GPU 2 GB | rec: GPU 8 GB
    (4, "Premiere Pro", "Edição de vídeo", 15, 31, 2, 8, 8, 16),
    # mín: Intel 6ª / Ryzen 1000 | rec: Intel 11ª com Quick Sync / Ryzen 3000; 32 GB para 4K
    (5, "After Effects", "Motion e efeitos visuais", 15, 26, 4, 8, 16, 32),
    # mín: Intel 6ª / Ryzen 1000 (AVX2) + 4 GB VRAM | rec: Intel 11ª / Ryzen 3000 + 8 GB VRAM
    (6, "DaVinci Resolve", "Edição de vídeo", 17, 40, 4, 8, 16, 32),
    # Blackmagic não fixa CPU; mín: 16 GB RAM + 4 GB VRAM | rec: estimado (32 GB com Fusion)
    (7, "Sony Vegas", "Edição de vídeo", 15, 26, 2, 4, 8, 16),
    # VEGAS Pro. mín: Intel 6ª / Ryzen 2000 + GPU 2 GB | rec: GPU 4 GB; 32 GB para 4K
    (8, "Blender", "Modelagem 3D", 12, 45, 2, 8, 8, 32),
    # mín: 4 núcleos com SSE4.2 + 2 GB VRAM | rec: 8 núcleos + 8 GB VRAM
    (9, "Cinema 4D", "Modelagem 3D", 15, 40, 4, 8, 8, 16),
    # mín: CPU com AVX2 | rec: estimado; 8 GB VRAM para renderizar com Redshift
    (10, "AutoCAD", "CAD", 12, 30, 2, 8, 8, 32),
    # mín: 2,5–2,9 GHz + GPU 2 GB | rec: 3+ GHz + GPU 8 GB
    (11, "Maya", "Animação 3D", 15, 40, 4, 8, 8, 16),
    # mín: CPU com SSE4.2 | rec: estimado
    (12, "OBS Studio", "Streaming e gravação", 9, 30, 2, 4, 4, 8),
    # mín: i5-2500K / Ryzen 3 1300X | rec: estimado para transmitir em 1080p 60 FPS
]


class Command(BaseCommand):
    help = "Carrega os jogos e programas usados como parâmetro na recomendação."

    @transaction.atomic
    def handle(self, *args, **options):
        for id_jogo, nome, d_min, d_rec, v_min, v_rec, r_min, r_rec in JOGOS:
            Jogo.objects.update_or_create(
                id=id_jogo,
                defaults={
                    "nome": nome,
                    "desempenho_minimo": d_min,
                    "desempenho_recomendado": d_rec,
                    "vram_minima": v_min,
                    "vram_recomendada": v_rec,
                    "ram_minima": r_min,
                    "ram_recomendada": r_rec,
                },
            )
        self.stdout.write(f"  jogos: {len(JOGOS)}")

        for id_prog, nome, categoria, d_min, d_rec, v_min, v_rec, r_min, r_rec in PROGRAMAS:
            Programa.objects.update_or_create(
                id=id_prog,
                defaults={
                    "nome": nome,
                    "categoria": categoria,
                    "desempenho_minimo": d_min,
                    "desempenho_recomendado": d_rec,
                    "vram_minima": v_min,
                    "vram_recomendada": v_rec,
                    "ram_minima": r_min,
                    "ram_recomendada": r_rec,
                },
            )
        self.stdout.write(f"  programas: {len(PROGRAMAS)}")

        self.stdout.write(self.style.SUCCESS("Jogos e programas carregados com sucesso."))
