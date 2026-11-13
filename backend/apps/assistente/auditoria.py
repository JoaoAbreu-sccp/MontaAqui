"""
Auditoria dos setups escolhidos pela IA (RF06).

A IA pode errar. Por isso, antes de qualquer setup chegar ao usuário:
1. Conferimos se todos os IDs existem no banco.
2. Passamos as peças pelas regras de compatibilidade (montagens/compatibilidade.py).
3. Se alguma combinação estiver errada, trocamos só a peça problemática pela
   opção compatível de preço mais parecido (ajuste em Python, determinístico).
4. Conferimos as regras de negócio: atender ao mínimo dos jogos/programas e
   respeitar a faixa de preço do nível.
Se nada disso der certo, o nível inteiro vem do motor em Python.

Processador e placa de vídeo são as escolhas principais da IA: não trocamos
essas duas. Se uma delas for inválida, o nível vai para o motor.
"""

from decimal import Decimal

from apps.componentes.models import Armazenamento, Cpu, Fonte, Gabinete, Gpu, PlacaMae, Ram
from apps.montagens.compatibilidade import (
    potencia_minima_da_fonte,
    regra_armazenamento,
    regra_geracao_cpu,
    regra_memoria,
    regra_socket,
    verificar_compatibilidade,
)
from apps.montagens.motor import LIMITE_ACIMA, escolher_fonte_e_gabinete, preco_total

MODELOS = {
    "cpu": Cpu, "placamae": PlacaMae, "ram": Ram, "gpu": Gpu,
    "armazenamento": Armazenamento, "fonte": Fonte, "gabinete": Gabinete,
}


class Catalogo:
    """As peças do banco em memória, separadas por tipo e indexadas pelo ID."""

    def __init__(self):
        self.pecas = {tipo: {p.id: p for p in modelo.objects.all()} for tipo, modelo in MODELOS.items()}

    def todas(self, tipo):
        return list(self.pecas[tipo].values())

    def buscar(self, tipo, id_peca):
        return self.pecas[tipo].get(id_peca)


def _mais_parecida(opcoes, referencia):
    """A opção com preço mais próximo da peça original (ou a mais barata, sem original)."""
    if not opcoes:
        return None
    if referencia is None:
        return min(opcoes, key=lambda p: p.preco)
    return min(opcoes, key=lambda p: (abs(p.preco - referencia.preco), p.preco))


def ajustar_setup(pecas, catalogo):
    """
    Corrige as peças incompatíveis, uma de cada vez, na ordem em que uma depende da outra.

    Devolve (pecas_ajustadas, lista_de_ajustes) ou (None, ajustes) se não der para corrigir.
    "pecas" pode ter None no lugar de uma peça cujo ID não existe.
    """
    pecas = dict(pecas)
    ajustes = []

    if pecas["cpu"] is None or pecas["gpu"] is None:
        return None, ["A IA escolheu um processador ou uma placa de vídeo que não existe no catálogo."]

    def trocar(tipo, nova, motivo):
        if nova is None:
            return False
        antiga = pecas[tipo]
        pecas[tipo] = nova
        if antiga is None:
            ajustes.append(f"Escolhemos {nova} ({motivo}).")
        else:
            ajustes.append(f"Trocamos {antiga} por {nova} ({motivo}).")
        return True

    # 1. Placa-mãe: precisa do mesmo encaixe e reconhecer a geração do processador.
    def placa_ok(placa):
        teste = {"cpu": pecas["cpu"], "placamae": placa}
        return not regra_socket(teste) and not regra_geracao_cpu(teste)

    if pecas["placamae"] is None or not placa_ok(pecas["placamae"]):
        opcoes = [p for p in catalogo.todas("placamae") if placa_ok(p)]
        if not trocar("placamae", _mais_parecida(opcoes, pecas["placamae"]),
                      f"a placa-mãe precisa ser compatível com o {pecas['cpu']}"):
            return None, ajustes

    # 2. Memória: mesma geração (DDR4/DDR5) da placa-mãe. Tenta manter a capacidade.
    if pecas["ram"] is None or regra_memoria(pecas):
        ddr = pecas["placamae"].geracao_ddr
        opcoes = [r for r in catalogo.todas("ram") if r.geracao_ddr == ddr]
        if pecas["ram"] is not None:
            mesma_capacidade = [r for r in opcoes if r.capacidade_gb == pecas["ram"].capacidade_gb]
            opcoes = mesma_capacidade or opcoes
        if not trocar("ram", _mais_parecida(opcoes, pecas["ram"]), f"a placa-mãe usa memória {ddr}"):
            return None, ajustes

    # 3. Armazenamento: a placa-mãe precisa ter a entrada certa.
    if pecas["armazenamento"] is None or regra_armazenamento(pecas):
        entradas = pecas["placamae"].interfaces_suportadas()
        opcoes = [a for a in catalogo.todas("armazenamento") if a.interface in entradas]
        if not trocar("armazenamento", _mais_parecida(opcoes, pecas["armazenamento"]),
                      "precisa encaixar numa entrada da placa-mãe"):
            return None, ajustes

    # 4. Gabinete e fonte: o gabinete precisa caber a placa-mãe e a placa de vídeo;
    #    a fonte precisa ter potência suficiente e o formato que o gabinete aceita.
    def gabinete_ok(gabinete):
        return (gabinete is not None
                and gabinete.comporta_placa(pecas["placamae"])
                and gabinete.comprimento_max_gpu >= pecas["gpu"].comprimento_mm)

    def fonte_ok(fonte):
        return (fonte is not None
                and fonte.capacidade_watts >= potencia_minima_da_fonte(pecas)
                and fonte.formato == pecas["gabinete"].formato_fonte)

    if not gabinete_ok(pecas["gabinete"]):
        opcoes = [g for g in catalogo.todas("gabinete") if gabinete_ok(g)]
        if not trocar("gabinete", _mais_parecida(opcoes, pecas["gabinete"]),
                      "precisa caber a placa-mãe e a placa de vídeo"):
            return None, ajustes

    if not fonte_ok(pecas["fonte"]):
        opcoes = [f for f in catalogo.todas("fonte") if fonte_ok(f)]
        if opcoes:
            # Fonte: a mais barata que dá conta, já que mais potência não deixa o PC mais rápido.
            trocar("fonte", min(opcoes, key=lambda f: f.preco),
                   f"o PC precisa de pelo menos {potencia_minima_da_fonte(pecas)} W")
        else:
            # Nenhuma fonte serve neste gabinete: escolhe o par fonte + gabinete mais barato.
            par = escolher_fonte_e_gabinete(
                {k: pecas[k] for k in ("cpu", "placamae", "ram")}, pecas["gpu"],
                sorted(catalogo.todas("fonte"), key=lambda f: f.preco),
                sorted(catalogo.todas("gabinete"), key=lambda g: g.preco),
            )
            if par is None:
                return None, ajustes
            trocar("gabinete", par["gabinete"], "o gabinete anterior não aceita uma fonte adequada")
            trocar("fonte", par["fonte"], f"o PC precisa de pelo menos {potencia_minima_da_fonte(pecas)} W")

    # Conferência final com todas as regras. Se ainda houver problema, desiste do ajuste.
    if verificar_compatibilidade(pecas):
        return None, ajustes
    return pecas, ajustes


def atende_regras_do_nivel(categoria, pecas, alvos, orcamento):
    """Regras de negócio que a IA também precisa seguir. Devolve o motivo da recusa, ou None."""
    if pecas["cpu"].pontuacao_desempenho < alvos["cpu_min"]:
        return "processador abaixo do mínimo pedido"
    if pecas["gpu"].vram < alvos["vram_min"]:
        return "placa de vídeo com menos memória que o mínimo"
    if pecas["ram"].capacidade_gb < alvos["ram_min"]:
        return "memória RAM abaixo do mínimo"

    preco = preco_total(pecas)
    orcamento = Decimal(orcamento)
    if categoria in ("Abaixo do Orçamento", "Equilíbrio") and preco > orcamento:
        return "passou do orçamento"
    if categoria == "Acima do Orçamento" and preco > orcamento * LIMITE_ACIMA:
        return "passou mais de 20% do orçamento"
    return None
