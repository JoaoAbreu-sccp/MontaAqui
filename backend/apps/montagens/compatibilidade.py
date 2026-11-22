"""
Regras de compatibilidade entre as peças de um setup (RF06).

Tudo aqui é determinístico: as mesmas peças sempre dão o mesmo resultado.
Nenhum setup chega ao usuário sem passar por verificar_compatibilidade();
isso vale também para os setups que a IA ajudar a escolher no futuro.

Uso:
    problemas = verificar_compatibilidade(pecas)
    if not problemas:
        ...  # setup compatível

"pecas" é um dicionário com as 7 peças:
    {"cpu": Cpu, "placamae": PlacaMae, "ram": Ram, "gpu": Gpu,
     "fonte": Fonte, "armazenamento": Armazenamento, "gabinete": Gabinete}

A resposta é uma lista de mensagens em linguagem simples. Lista vazia = compatível.
"""

# Placa-mãe, memória, SSD, ventoinhas e periféricos USB não têm consumo cadastrado.
# Somamos uma estimativa fixa para eles.
CONSUMO_OUTRAS_PECAS_WATTS = 100

# A fonte não deve trabalhar no limite: pedimos 20% de folga sobre o consumo estimado.
# Isso cobre picos de energia da placa de vídeo e deixa a fonte mais silenciosa.
FOLGA_DA_FONTE = 1.2

PECAS_OBRIGATORIAS = ("cpu", "placamae", "ram", "gpu", "fonte", "armazenamento", "gabinete")


def consumo_estimado(pecas):
    """Consumo total estimado do PC, em watts."""
    return pecas["cpu"].consumo_watts + pecas["gpu"].consumo_watts + CONSUMO_OUTRAS_PECAS_WATTS


def potencia_minima_da_fonte(pecas):
    """Menor potência de fonte aceita para estas peças (consumo + folga)."""
    return round(consumo_estimado(pecas) * FOLGA_DA_FONTE)


# Cada regra recebe as peças e devolve a mensagem do problema, ou None se estiver tudo certo.
# Elas são separadas para que o motor possa usar só algumas (ex.: montar a base
# CPU + placa-mãe + RAM antes de escolher o resto).

def regra_socket(pecas):
    cpu, placa = pecas["cpu"], pecas["placamae"]
    if cpu.socket != placa.socket:
        return (f"O processador {cpu} usa o encaixe {cpu.socket}, mas a placa-mãe {placa} "
                f"tem o encaixe {placa.socket}.")
    return None


def regra_geracao_cpu(pecas):
    # Mesmo com o encaixe certo, a placa-mãe só reconhece as gerações listadas nela.
    cpu, placa = pecas["cpu"], pecas["placamae"]
    if cpu.geracao not in placa.geracoes_cpu_suportadas():
        return f"A placa-mãe {placa} não reconhece processadores da geração {cpu.geracao}."
    return None


def regra_memoria(pecas):
    ram, placa = pecas["ram"], pecas["placamae"]
    if ram.geracao_ddr != placa.geracao_ddr:
        return (f"A memória {ram} é {ram.geracao_ddr}, mas a placa-mãe {placa} "
                f"só aceita {placa.geracao_ddr}.")
    return None


def regra_armazenamento(pecas):
    disco, placa = pecas["armazenamento"], pecas["placamae"]
    if disco.interface not in placa.interfaces_suportadas():
        return f"A placa-mãe {placa} não tem entrada {disco.interface} para o armazenamento {disco}."
    return None


def regra_energia(pecas):
    fonte = pecas["fonte"]
    minimo = potencia_minima_da_fonte(pecas)
    if fonte.capacidade_watts < minimo:
        return (f"A fonte {fonte} tem {fonte.capacidade_watts} W, mas estas peças pedem "
                f"pelo menos {minimo} W (consumo de {consumo_estimado(pecas)} W + 20% de folga).")
    return None


def regra_placa_no_gabinete(pecas):
    # Comparação por hierarquia (Mini-ITX < Micro-ATX < ATX), nunca por igualdade:
    # um gabinete ATX também aceita placas menores.
    gabinete, placa = pecas["gabinete"], pecas["placamae"]
    if not gabinete.comporta_placa(placa):
        return (f"A placa-mãe {placa} é {placa.formato} e não cabe no gabinete {gabinete}, "
                f"que aceita no máximo {gabinete.formato}.")
    return None


def regra_fonte_no_gabinete(pecas):
    # Igualdade estrita: o cadastro informa um único formato de fonte por gabinete.
    gabinete, fonte = pecas["gabinete"], pecas["fonte"]
    if fonte.formato != gabinete.formato_fonte:
        return (f"A fonte {fonte} é {fonte.formato}, mas o gabinete {gabinete} "
                f"é feito para fontes {gabinete.formato_fonte}.")
    return None


def regra_gpu_no_gabinete(pecas):
    gabinete, gpu = pecas["gabinete"], pecas["gpu"]
    if gpu.comprimento_mm > gabinete.comprimento_max_gpu:
        return (f"A placa de vídeo {gpu} tem {gpu.comprimento_mm} mm e não cabe no gabinete "
                f"{gabinete}, que tem espaço para {gabinete.comprimento_max_gpu} mm.")
    return None


# Regras que só dependem de CPU + placa-mãe + RAM.
REGRAS_DA_BASE = (regra_socket, regra_geracao_cpu, regra_memoria)

TODAS_AS_REGRAS = (
    *REGRAS_DA_BASE,
    regra_armazenamento,
    regra_energia,
    regra_placa_no_gabinete,
    regra_fonte_no_gabinete,
    regra_gpu_no_gabinete,
)


def verificar_compatibilidade(pecas, regras=TODAS_AS_REGRAS):
    """Devolve a lista de problemas encontrados. Lista vazia = setup compatível."""
    faltando = [nome for nome in PECAS_OBRIGATORIAS if pecas.get(nome) is None]
    if faltando and regras is TODAS_AS_REGRAS:
        return [f"Falta escolher: {', '.join(faltando)}."]

    problemas = []
    for regra in regras:
        mensagem = regra(pecas)
        if mensagem:
            problemas.append(mensagem)
    return problemas
