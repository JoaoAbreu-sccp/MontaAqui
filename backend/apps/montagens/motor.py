"""
Motor de recomendação: monta até 3 setups compatíveis a partir do questionário (RF05).

Esta versão usa só regras em Python, sem IA. Quando a IA entrar, ela poderá
ajudar a escolher e a explicar as peças, mas o resultado continua passando por
verificar_compatibilidade() antes de chegar ao usuário (RF06).

COMO FUNCIONA (resumo para a equipe)
1. Alvos: a partir da finalidade, dos jogos/programas, da resolução e do FPS,
   calculamos o que o PC precisa ter: pontuação mínima e recomendada da CPU,
   pontuação recomendada da GPU, VRAM e RAM mínimas e recomendadas.
2. Candidatos: geramos as combinações compatíveis do catálogo. Para cada
   CPU + placa-mãe + RAM + GPU + armazenamento, escolhemos a fonte e o gabinete
   mais baratos que servem. Peças abaixo do MÍNIMO dos jogos/programas são descartadas.
3. Nota: cada candidato recebe uma nota de desempenho (quanto chega perto do
   RECOMENDADO) menos um peso pelo preço. O peso do preço depende da prioridade
   escolhida (Desempenho, Custo-benefício ou Economia).
4. Níveis:
   - Equilíbrio: a melhor nota sem passar do orçamento.
   - Abaixo do Orçamento: a melhor nota custando no máximo 85% do Equilíbrio,
     para ser uma economia de verdade, e não quase o mesmo PC.
   - Acima do Orçamento: até 20% acima do orçamento, escolhendo pelo desempenho.
     Só aparece se for bem mais forte que o Equilíbrio.
   Se o orçamento não paga nem o PC mais barato, sobra só a opção acima dele.

Os números (pesos, folgas, tabela de resolução) são decisões da equipe e
ficam em constantes no topo, para facilitar ajustes depois de testar.
"""

from decimal import Decimal

from apps.componentes.models import Armazenamento, Cpu, Fonte, Gabinete, Gpu, PlacaMae, Ram

from .compatibilidade import (
    REGRAS_DA_BASE,
    potencia_minima_da_fonte,
    verificar_compatibilidade,
)
from .models import Setup

# Faixas de preço de cada nível, em relação ao orçamento ou ao Equilíbrio.
LIMITE_ACIMA = Decimal("1.20")          # Acima: até 20% além do orçamento
FRACAO_ABAIXO = Decimal("0.85")         # Abaixo: no máximo 85% do preço do Equilíbrio

# Quanto o preço pesa na nota, conforme a prioridade escolhida no questionário.
PESO_DO_PRECO = {"Desempenho": 0.15, "Custo-benefício": 0.4, "Economia": 0.9}
PESO_DO_PRECO_ACIMA = 0.15              # no nível Acima, o que importa é ganhar desempenho
# O Acima só aparece se a nota de desempenho subir pelo menos isto em relação ao Equilíbrio.
# Sem isso, ele poderia ser o mesmo PC só com um SSD maior, pagando acima do orçamento à toa.
MELHORA_MINIMA_ACIMA = 0.05

# Quanto CPU e GPU contam na nota de desempenho, por finalidade.
PESOS_CPU_GPU = {
    "Jogos": (0.35, 0.65),
    "Edição": (0.5, 0.5),
    "Trabalho": (0.7, 0.3),
    "Estudos": (0.7, 0.3),
}

# Passar do recomendado ainda ajuda um pouco, mas só até 25% acima dele.
TETO_DA_PROPORCAO = 1.25

# Pontuação de GPU recomendada (escala 0–100, RTX 5080 = 100) por resolução e FPS.
GPU_POR_RESOLUCAO_E_FPS = {
    "1080p": {60: 30, 120: 45, 144: 55},
    "1440p": {60: 50, 120: 68, 144: 80},
    "4K": {60: 82, 120: 100, 144: 100},
}
# Jogos leves (VRAM recomendada até 4 GB, ex.: Valorant, LoL, CS2) pedem menos da GPU.
VRAM_DE_JOGO_LEVE = 4
FATOR_JOGO_LEVE = 0.6

# FPS alto depende muito do processador: soma pontos à CPU recomendada.
CPU_EXTRA_POR_FPS = {60: 0, 120: 10, 144: 20}

# VRAM recomendada mínima para resoluções altas, em GB.
VRAM_POR_RESOLUCAO = {"1080p": 0, "1440p": 10, "4K": 12}

# Alvos fixos para finalidades sem jogos/programas.
ALVOS_FIXOS = {
    "Trabalho": {"cpu_min": 10, "cpu_rec": 30, "gpu_rec": 15, "vram_min": 2, "vram_rec": 4,
                 "ram_min": 8, "ram_rec": 16},
    "Estudos": {"cpu_min": 8, "cpu_rec": 20, "gpu_rec": 10, "vram_min": 2, "vram_rec": 4,
                "ram_min": 8, "ram_rec": 16},
}
GPU_REC_EDICAO = 40

# 16 GB é o padrão de um PC novo hoje; recomendamos isso mesmo para jogos leves.
RAM_RECOMENDADA_MINIMA = 16

# Bônus pequenos para o armazenamento: SSD deixa o PC bem mais rápido no dia a dia.
BONUS_ARMAZENAMENTO = {"SSD NVMe": 0.06, "SSD SATA": 0.03, "HD": 0.0}
BONUS_1TB_OU_MAIS = 0.03


# --------------------------------------------------------------------------- alvos

def calcular_alvos(finalidade, jogos=(), programas=(), resolucao=None, fps=None):
    """O que o PC precisa ter, a partir das respostas do questionário."""
    if finalidade in ALVOS_FIXOS:
        return dict(ALVOS_FIXOS[finalidade])

    referencias = list(jogos) if finalidade == "Jogos" else list(programas)
    alvos = {
        "cpu_min": max(r.desempenho_minimo for r in referencias),
        "cpu_rec": max(r.desempenho_recomendado for r in referencias),
        "vram_min": max(r.vram_minima for r in referencias),
        "vram_rec": max(r.vram_recomendada for r in referencias),
        "ram_min": max(r.ram_minima for r in referencias),
        "ram_rec": max(r.ram_recomendada for r in referencias),
    }

    if finalidade == "Jogos":
        gpu_rec = GPU_POR_RESOLUCAO_E_FPS[resolucao][fps]
        if alvos["vram_rec"] <= VRAM_DE_JOGO_LEVE:
            gpu_rec *= FATOR_JOGO_LEVE
        alvos["gpu_rec"] = gpu_rec
        alvos["cpu_rec"] = min(100, alvos["cpu_rec"] + CPU_EXTRA_POR_FPS[fps])
        alvos["vram_rec"] = max(alvos["vram_rec"], VRAM_POR_RESOLUCAO[resolucao])
    else:
        alvos["gpu_rec"] = GPU_REC_EDICAO
    alvos["ram_rec"] = max(alvos["ram_rec"], RAM_RECOMENDADA_MINIMA)
    return alvos


# --------------------------------------------------------------------------- candidatos

def _gerar_candidatos(alvos, preferencia_cpu):
    """Todas as combinações compatíveis que atendem ao mínimo, com fonte e gabinete mais baratos."""
    cpus = [c for c in Cpu.objects.all() if c.pontuacao_desempenho >= alvos["cpu_min"]]
    if preferencia_cpu in ("AMD", "Intel"):
        cpus = [c for c in cpus if c.marca == preferencia_cpu]
    placas = list(PlacaMae.objects.all())
    rams = [r for r in Ram.objects.all() if r.capacidade_gb >= alvos["ram_min"]]
    gpus = [g for g in Gpu.objects.all() if g.vram >= alvos["vram_min"]]
    discos = list(Armazenamento.objects.all())
    fontes = sorted(Fonte.objects.all(), key=lambda f: f.preco)
    gabinetes = sorted(Gabinete.objects.all(), key=lambda g: g.preco)

    # Base: CPU + placa-mãe + RAM que se encaixam entre si.
    bases = []
    for cpu in cpus:
        for placa in placas:
            for ram in rams:
                pecas = {"cpu": cpu, "placamae": placa, "ram": ram}
                if not verificar_compatibilidade(pecas, REGRAS_DA_BASE):
                    bases.append(pecas)

    candidatos = []
    for base in bases:
        for gpu in gpus:
            fonte_e_gabinete = escolher_fonte_e_gabinete(base, gpu, fontes, gabinetes)
            if fonte_e_gabinete is None:
                continue
            for disco in discos:
                pecas = {**base, "gpu": gpu, "armazenamento": disco, **fonte_e_gabinete}
                if verificar_compatibilidade(pecas):
                    continue
                candidatos.append(pecas)
    return candidatos


def escolher_fonte_e_gabinete(base, gpu, fontes, gabinetes):
    """Fonte e gabinete mais baratos que servem para estas peças (ou None)."""
    pecas = {**base, "gpu": gpu}
    potencia_minima = potencia_minima_da_fonte(pecas)
    melhor = None
    for fonte in fontes:
        if fonte.capacidade_watts < potencia_minima:
            continue
        for gabinete in gabinetes:
            cabe = (gabinete.comporta_placa(base["placamae"])
                    and gabinete.formato_fonte == fonte.formato
                    and gabinete.comprimento_max_gpu >= gpu.comprimento_mm)
            if cabe:
                if melhor is None or fonte.preco + gabinete.preco < melhor[0]:
                    melhor = (fonte.preco + gabinete.preco, {"fonte": fonte, "gabinete": gabinete})
                break  # gabinetes estão em ordem de preço: o primeiro que cabe é o mais barato
    return melhor[1] if melhor else None


# --------------------------------------------------------------------------- nota

def preco_total(pecas):
    return sum((peca.preco for peca in pecas.values()), Decimal("0"))


def _proporcao(valor, alvo):
    return min(valor / max(alvo, 1), TETO_DA_PROPORCAO)


def nota_de_desempenho(pecas, alvos, finalidade):
    """Quanto o setup chega perto do recomendado (por volta de 1,0 = atende)."""
    peso_cpu, peso_gpu = PESOS_CPU_GPU[finalidade]
    nota = (peso_cpu * _proporcao(pecas["cpu"].pontuacao_desempenho, alvos["cpu_rec"])
            + peso_gpu * _proporcao(pecas["gpu"].pontuacao_desempenho, alvos["gpu_rec"]))
    nota += 0.15 * min(pecas["ram"].capacidade_gb / alvos["ram_rec"], 1)
    nota += 0.05 * min(pecas["gpu"].vram / max(alvos["vram_rec"], 1), 1)

    disco = pecas["armazenamento"]
    nota += BONUS_ARMAZENAMENTO.get(disco.tipo, 0)
    if disco.unidade_medida == "TB":
        nota += BONUS_1TB_OU_MAIS
    return nota


def _nota_final(candidato, peso_preco, orcamento):
    return candidato["desempenho"] - peso_preco * float(candidato["preco"] / orcamento)


def _melhor(candidatos, peso_preco, orcamento):
    if not candidatos:
        return None
    return max(candidatos, key=lambda c: _nota_final(c, peso_preco, orcamento))


# --------------------------------------------------------------------------- níveis

def gerar_setups(*, finalidade, orcamento, prioridade, preferencia_cpu,
                 jogos=(), programas=(), resolucao=None, fps=None):
    """
    Devolve {"setups": [...], "alvos": {...}, "preco_minimo": Decimal | None}.

    Cada setup é {"categoria", "pecas", "preco", "desempenho"}, já verificado.
    """
    orcamento = Decimal(orcamento)
    alvos = calcular_alvos(finalidade, jogos, programas, resolucao, fps)
    peso_preco = PESO_DO_PRECO.get(prioridade, PESO_DO_PRECO["Custo-benefício"])

    candidatos = [
        {"pecas": pecas, "preco": preco_total(pecas),
         "desempenho": nota_de_desempenho(pecas, alvos, finalidade)}
        for pecas in _gerar_candidatos(alvos, preferencia_cpu)
    ]
    if not candidatos:
        return {"setups": [], "alvos": alvos, "preco_minimo": None}

    preco_minimo = min(c["preco"] for c in candidatos)

    equilibrio = _melhor([c for c in candidatos if c["preco"] <= orcamento], peso_preco, orcamento)

    abaixo = None
    if equilibrio:
        teto_abaixo = equilibrio["preco"] * FRACAO_ABAIXO
        abaixo = _melhor([c for c in candidatos if c["preco"] <= teto_abaixo], peso_preco, orcamento)

    faixa_acima = [c for c in candidatos if orcamento < c["preco"] <= orcamento * LIMITE_ACIMA]
    if equilibrio:
        faixa_acima = [c for c in faixa_acima if c["desempenho"] >= equilibrio["desempenho"] + MELHORA_MINIMA_ACIMA]
        acima = _melhor(faixa_acima, PESO_DO_PRECO_ACIMA, orcamento)
    else:
        # Orçamento baixo demais: mostramos o PC compatível mais barato que atende ao mínimo,
        # para a pessoa saber quanto precisaria gastar.
        acima = _melhor(faixa_acima, peso_preco, orcamento) or min(candidatos, key=lambda c: c["preco"])

    setups = []
    for categoria, escolhido in (
        (Setup.Categoria.ABAIXO, abaixo),
        (Setup.Categoria.EQUILIBRIO, equilibrio),
        (Setup.Categoria.ACIMA, acima),
    ):
        if escolhido is None:
            continue
        # Garantia final (RF06): nada sai daqui sem passar por todas as regras.
        problemas = verificar_compatibilidade(escolhido["pecas"])
        if problemas:
            raise RuntimeError(f"Motor gerou setup incompatível: {problemas}")
        setups.append({"categoria": categoria.value, **escolhido})

    return {"setups": setups, "alvos": alvos, "preco_minimo": preco_minimo}


# --------------------------------------------------------------------------- resumo

def atende(pecas, requisito, nivel):
    """True se as peças atendem ao requisito 'minimo' ou 'recomendado' de um jogo/programa."""
    sufixo = "minimo" if nivel == "minimo" else "recomendado"
    sufixo_curto = "minima" if nivel == "minimo" else "recomendada"
    return (pecas["cpu"].pontuacao_desempenho >= getattr(requisito, f"desempenho_{sufixo}")
            and pecas["gpu"].vram >= getattr(requisito, f"vram_{sufixo_curto}")
            and pecas["ram"].capacidade_gb >= getattr(requisito, f"ram_{sufixo_curto}"))


def resumir(setup, orcamento, referencias=()):
    """Frases curtas, em linguagem simples, sobre o setup. A IA vai substituir isto depois."""
    frases = []
    diferenca = setup["preco"] - Decimal(orcamento)
    if diferenca <= 0:
        frases.append(f"Fica R$ {_reais(-diferenca)} abaixo do seu orçamento.")
    else:
        frases.append(f"Passa R$ {_reais(diferenca)} do seu orçamento.")

    pecas = setup["pecas"]
    no_recomendado = [r.nome for r in referencias if atende(pecas, r, "recomendado")]
    so_minimo = [r.nome for r in referencias if r.nome not in no_recomendado]
    if no_recomendado:
        frases.append("Atende ao recomendado de: " + ", ".join(no_recomendado) + ".")
    if so_minimo:
        frases.append("Roda, mas abaixo do recomendado: " + ", ".join(so_minimo) + ".")

    if pecas["armazenamento"].tipo.startswith("SSD"):
        frases.append("Tem SSD, então o sistema e os programas abrem rápido.")
    return frases


def _reais(valor):
    return f"{valor:,.0f}".replace(",", ".")
