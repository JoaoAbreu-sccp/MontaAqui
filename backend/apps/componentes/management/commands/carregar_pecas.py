"""
Carrega no banco o catálogo inicial: 9 peças por componente (3 low end,
3 mid end, 3 high end), as 3 lojas e a disponibilidade de cada peça.

Uso:  python manage.py carregar_pecas

Pode rodar quantas vezes quiser: os IDs são fixos (1–3 low, 4–6 mid,
7–9 high) e o comando atualiza o que já existe em vez de duplicar.

ATENÇÃO
- Preços em R$ são referências aproximadas; atualizar antes da apresentação.
- pontuacao_desempenho da CPU usa escala própria 0–100 (Ryzen 7 9800X3D = 100).
- pontuacao_desempenho da GPU usa escala própria 0–100 (RTX 5080 = 100), estimada
  pela média de desempenho em jogos (rasterização) em reviews; revisar se mudar o catálogo.
- caminho_produto aponta para a BUSCA da loja pelo nome da peça, não para a
  página exata do produto. O código de afiliado é provisório.
"""

from decimal import Decimal
from urllib.parse import quote_plus
import re

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.componentes.models import Armazenamento, Cpu, Fonte, Gabinete, Gpu, PlacaMae, Ram
from apps.lojas.models import (
    Loja, LojaArmazenamento, LojaCpu, LojaFonte, LojaGabinete, LojaGpu, LojaPlacaMae, LojaRam,
)


# Cada linha: (tier, valores na ordem dos CAMPOS da tabela). Preço em string para virar Decimal.
PECAS = {
    Cpu: {
        "oferta": (LojaCpu, "cpu"),
        "campos": ('marca', 'modelo', 'preco', 'socket', 'geracao', 'consumo_watts', 'nucleos', 'pontuacao_desempenho'),
        "linhas": [
            ('Low', 'Intel', 'Core i3-12100F', '499.90', 'LGA1700', 'Intel 12', 58, 4, 30),
            ('Low', 'AMD', 'Ryzen 5 5500', '549.90', 'AM4', 'Ryzen 5000', 65, 6, 34),
            ('Low', 'AMD', 'Ryzen 5 5600', '699.90', 'AM4', 'Ryzen 5000', 65, 6, 40),
            ('Mid', 'Intel', 'Core i5-13400F', '1099.90', 'LGA1700', 'Intel 13', 65, 10, 55),
            ('Mid', 'AMD', 'Ryzen 5 7600', '1199.90', 'AM5', 'Ryzen 7000', 65, 6, 60),
            ('Mid', 'AMD', 'Ryzen 7 5700X3D', '1399.90', 'AM4', 'Ryzen 5000', 105, 8, 64),
            ('High', 'Intel', 'Core i7-14700K', '2399.90', 'LGA1700', 'Intel 14', 253, 20, 85),
            ('High', 'AMD', 'Ryzen 7 7800X3D', '2599.90', 'AM5', 'Ryzen 7000', 120, 8, 88),
            ('High', 'AMD', 'Ryzen 7 9800X3D', '3299.90', 'AM5', 'Ryzen 9000', 120, 8, 100),
        ],
    },
    PlacaMae: {
        "oferta": (LojaPlacaMae, "placamae"),
        "campos": ('marca', 'modelo', 'preco', 'socket', 'geracao_ddr', 'formato', 'geracao_cpu', 'velocidade_maxima_ram', 'interface_armazenamento'),
        "linhas": [
            ('Low', 'Gigabyte', 'H610M S2H DDR4', '549.90', 'LGA1700', 'DDR4', 'Micro-ATX', 'Intel 12,Intel 13,Intel 14', 3200, 'SATA,M.2 NVMe'),
            ('Low', 'ASUS', 'Prime A520M-K', '449.90', 'AM4', 'DDR4', 'Micro-ATX', 'Ryzen 3000,Ryzen 5000', 4600, 'SATA,M.2 NVMe'),
            ('Low', 'ASRock', 'B550M-HDV', '649.90', 'AM4', 'DDR4', 'Micro-ATX', 'Ryzen 3000,Ryzen 5000', 4733, 'SATA,M.2 NVMe'),
            ('Mid', 'MSI', 'PRO B760M-P DDR4', '799.90', 'LGA1700', 'DDR4', 'Micro-ATX', 'Intel 12,Intel 13,Intel 14', 4800, 'SATA,M.2 NVMe'),
            ('Mid', 'Gigabyte', 'B650M D3HP', '999.90', 'AM5', 'DDR5', 'Micro-ATX', 'Ryzen 7000,Ryzen 8000,Ryzen 9000', 6400, 'SATA,M.2 NVMe'),
            ('Mid', 'MSI', 'MAG B550 Tomahawk', '1099.90', 'AM4', 'DDR4', 'ATX', 'Ryzen 3000,Ryzen 5000', 5100, 'SATA,M.2 NVMe'),
            ('High', 'ASUS', 'TUF Gaming Z790-Plus WiFi', '2199.90', 'LGA1700', 'DDR5', 'ATX', 'Intel 12,Intel 13,Intel 14', 7200, 'SATA,M.2 NVMe'),
            ('High', 'ASUS', 'TUF Gaming B650-Plus WiFi', '1599.90', 'AM5', 'DDR5', 'ATX', 'Ryzen 7000,Ryzen 8000,Ryzen 9000', 6400, 'SATA,M.2 NVMe'),
            ('High', 'MSI', 'MAG X870 Tomahawk WiFi', '2499.90', 'AM5', 'DDR5', 'ATX', 'Ryzen 7000,Ryzen 8000,Ryzen 9000', 8400, 'SATA,M.2 NVMe'),
        ],
    },
    Ram: {
        "oferta": (LojaRam, "ram"),
        "campos": ('marca', 'modelo', 'preco', 'capacidade_gb', 'geracao_ddr', 'frequencia_mhz'),
        "linhas": [
            ('Low', 'Kingston', 'Fury Beast 8GB DDR4 3200MHz', '129.90', 8, 'DDR4', 3200),
            ('Low', 'Kingston', 'Fury Beast 16GB (2x8GB) DDR4 3200MHz', '279.90', 16, 'DDR4', 3200),
            ('Low', 'XPG', 'Spectrix D35G 16GB (2x8GB) DDR4 3200MHz', '299.90', 16, 'DDR4', 3200),
            ('Mid', 'Corsair', 'Vengeance LPX 16GB (2x8GB) DDR4 3600MHz', '329.90', 16, 'DDR4', 3600),
            ('Mid', 'Kingston', 'Fury Beast 32GB (2x16GB) DDR4 3200MHz', '549.90', 32, 'DDR4', 3200),
            ('Mid', 'Kingston', 'Fury Beast 16GB (2x8GB) DDR5 5600MHz', '499.90', 16, 'DDR5', 5600),
            ('High', 'Kingston', 'Fury Beast 32GB (2x16GB) DDR5 6000MHz', '1099.90', 32, 'DDR5', 6000),
            ('High', 'Corsair', 'Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', '1299.90', 32, 'DDR5', 6000),
            ('High', 'G.Skill', 'Trident Z5 Neo RGB 64GB (2x32GB) DDR5 6000MHz', '2499.90', 64, 'DDR5', 6000),
        ],
    },
    Gpu: {
        "oferta": (LojaGpu, "gpu"),
        "campos": ('marca', 'modelo', 'preco', 'vram', 'comprimento_mm', 'consumo_watts', 'conectores_necessarios', 'pontuacao_desempenho'),
        "linhas": [
            ('Low', 'MSI', 'GeForce RTX 3050 Ventus 2X 6G OC', '1199.90', 6, 189, 70, 'Nenhum', 18),
            ('Low', 'PowerColor', 'Radeon RX 6600 Fighter 8GB', '1399.90', 8, 200, 132, '1x 8 pinos', 30),
            ('Low', 'ASRock', 'Intel Arc B580 Challenger 12GB OC', '1899.90', 12, 270, 190, '1x 8 pinos', 40),
            ('Mid', 'MSI', 'GeForce RTX 5060 Ventus 2X OC 8GB', '2299.90', 8, 197, 145, '1x 8 pinos', 45),
            ('Mid', 'Sapphire', 'Radeon RX 9060 XT Pulse 16GB', '2699.90', 16, 240, 160, '1x 8 pinos', 50),
            ('Mid', 'Gigabyte', 'GeForce RTX 5060 Ti Windforce 16GB', '3299.90', 16, 241, 180, '1x 8 pinos', 52),
            ('High', 'ASUS', 'GeForce RTX 5070 Prime OC 12GB', '4499.90', 12, 304, 250, '1x 12V-2x6', 68),
            ('High', 'Sapphire', 'Radeon RX 9070 XT Pulse 16GB', '4999.90', 16, 320, 304, '2x 8 pinos', 82),
            ('High', 'Gigabyte', 'GeForce RTX 5080 Windforce OC 16GB', '8499.90', 16, 340, 360, '1x 12V-2x6', 100),
        ],
    },
    Fonte: {
        "oferta": (LojaFonte, "fonte"),
        "campos": ('marca', 'modelo', 'preco', 'capacidade_watts', 'formato', 'conectores_pcie'),
        "linhas": [
            ('Low', 'MSI', 'MAG A550BN 550W 80 Plus Bronze', '349.90', 550, 'ATX', '2x 6+2 pinos'),
            ('Low', 'Corsair', 'CV550 550W 80 Plus Bronze', '379.90', 550, 'ATX', '2x 6+2 pinos'),
            ('Low', 'Gigabyte', 'P650G 650W 80 Plus Gold', '449.90', 650, 'ATX', '2x 6+2 pinos'),
            ('Mid', 'MSI', 'MAG A650GL 650W 80 Plus Gold', '549.90', 650, 'ATX', '2x 6+2 pinos'),
            ('Mid', 'Cooler Master', 'MWE Gold 750 V2 750W', '649.90', 750, 'ATX', '4x 6+2 pinos'),
            ('Mid', 'Corsair', 'RM750e 750W 80 Plus Gold', '749.90', 750, 'ATX', '3x 6+2 pinos, 1x 12V-2x6'),
            ('High', 'Corsair', 'SF750 750W 80 Plus Platinum', '1199.90', 750, 'SFX', '4x 6+2 pinos'),
            ('High', 'Corsair', 'RM850x 850W 80 Plus Gold', '999.90', 850, 'ATX', '4x 6+2 pinos, 1x 12V-2x6'),
            ('High', 'MSI', 'MPG A1000GS 1000W 80 Plus Gold', '1299.90', 1000, 'ATX', '4x 6+2 pinos, 1x 12V-2x6'),
        ],
    },
    Armazenamento: {
        "oferta": (LojaArmazenamento, "armazenamento"),
        "campos": ('marca', 'modelo', 'preco', 'tipo', 'unidade_medida', 'capacidade', 'interface'),
        "linhas": [
            ('Low', 'Kingston', 'A400 480GB', '199.90', 'SSD SATA', 'GB', 480, 'SATA'),
            ('Low', 'Kingston', 'NV3 500GB', '219.90', 'SSD NVMe', 'GB', 500, 'M.2 NVMe'),
            ('Low', 'Seagate', 'Barracuda 1TB 7200RPM', '279.90', 'HD', 'TB', 1, 'SATA'),
            ('Mid', 'Kingston', 'NV3 1TB', '379.90', 'SSD NVMe', 'TB', 1, 'M.2 NVMe'),
            ('Mid', 'Crucial', 'P3 Plus 1TB', '419.90', 'SSD NVMe', 'TB', 1, 'M.2 NVMe'),
            ('Mid', 'WD', 'Blue SN580 1TB', '449.90', 'SSD NVMe', 'TB', 1, 'M.2 NVMe'),
            ('High', 'WD', 'Black SN850X 2TB', '1199.90', 'SSD NVMe', 'TB', 2, 'M.2 NVMe'),
            ('High', 'Kingston', 'Fury Renegade 2TB', '1249.90', 'SSD NVMe', 'TB', 2, 'M.2 NVMe'),
            ('High', 'Samsung', '990 Pro 2TB', '1299.90', 'SSD NVMe', 'TB', 2, 'M.2 NVMe'),
        ],
    },
    Gabinete: {
        "oferta": (LojaGabinete, "gabinete"),
        "campos": ('marca', 'modelo', 'preco', 'formato', 'comprimento_max_gpu', 'formato_fonte'),
        "linhas": [
            ('Low', 'Cooler Master', 'MasterBox Q300L', '349.90', 'Micro-ATX', 360, 'ATX'),
            ('Low', 'Montech', 'AIR 100 Lite', '349.90', 'Micro-ATX', 330, 'ATX'),
            ('Low', 'Lian Li', 'Lancool 205M Mesh', '449.90', 'Micro-ATX', 350, 'ATX'),
            ('Mid', 'Montech', 'AIR 903 Max', '649.90', 'ATX', 400, 'ATX'),
            ('Mid', 'NZXT', 'H5 Flow', '649.90', 'ATX', 365, 'ATX'),
            ('Mid', 'Lian Li', 'Lancool 216', '699.90', 'ATX', 392, 'ATX'),
            ('High', 'NZXT', 'H7 Flow', '999.90', 'ATX', 400, 'ATX'),
            ('High', 'Fractal Design', 'North', '1199.90', 'ATX', 355, 'ATX'),
            ('High', 'Lian Li', 'O11 Dynamic EVO', '1199.90', 'ATX', 426, 'ATX'),
        ],
    },
}

LOJAS = [
    # id, nome, url_base, codigo_afiliado
    (1, "KaBuM!", "https://www.kabum.com.br", "MONTAAQUI_KABUM"),
    (2, "Pichau", "https://www.pichau.com.br", "MONTAAQUI_PICHAU"),
    (3, "Terabyte", "https://www.terabyteshop.com.br", "MONTAAQUI_TERABYTE"),
]


def caminho_busca(id_loja, termo):
    """Caminho da página de busca de cada loja para o termo informado."""
    if id_loja == 1:
        return "/busca/" + re.sub(r"[^a-z0-9]+", "-", termo.lower()).strip("-")
    if id_loja == 2:
        return "/search?q=" + quote_plus(termo)
    return "/busca?str=" + quote_plus(termo)


class Command(BaseCommand):
    help = "Carrega as peças, as lojas e a disponibilidade iniciais do catálogo."

    @transaction.atomic
    def handle(self, *args, **options):
        lojas = {}
        for id_loja, nome, url_base, codigo in LOJAS:
            lojas[id_loja], _ = Loja.objects.update_or_create(
                id=id_loja,
                defaults={"nome": nome, "url_base": url_base, "codigo_afiliado": codigo},
            )

        for modelo, dados in PECAS.items():
            oferta_modelo, campo_fk = dados["oferta"]
            for numero, linha in enumerate(dados["linhas"], start=1):
                valores = dict(zip(dados["campos"], linha[1:]))
                valores["preco"] = Decimal(valores["preco"])
                peca, _ = modelo.objects.update_or_create(id=numero, defaults=valores)

                termo = f"{peca.marca} {peca.modelo}"
                for id_loja, loja in lojas.items():
                    oferta_modelo.objects.update_or_create(
                        loja=loja,
                        **{campo_fk: peca},
                        defaults={"caminho_produto": caminho_busca(id_loja, termo)},
                    )
            self.stdout.write(f"  {modelo._meta.verbose_name_plural}: {len(dados['linhas'])}")

        self.stdout.write(self.style.SUCCESS("Catálogo carregado com sucesso."))
