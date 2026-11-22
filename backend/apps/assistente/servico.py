"""
Assistente de IA do MontaAqui (Gemini).

Fluxo de recomendar_setups():
1. O motor em Python roda primeiro (é rápido). Ele calcula os alvos de desempenho
   e deixa pronto um setup de reserva para cada nível.
2. Se houver GEMINI_API_KEY, mandamos para o Gemini o catálogo do banco (63 peças,
   só com os campos técnicos e o preço), as respostas do questionário e os alvos.
   A resposta é obrigatoriamente um JSON com os IDs das peças de cada nível
   (ver esquemas.py).
3. Cada setup da IA passa pela auditoria em Python (auditoria.py): IDs, regras de
   compatibilidade, ajuste de peças e regras do nível.
4. Qualquer falha (sem chave, sem internet, demora, JSON inválido ou setup que não
   dá para corrigir) usa o setup de reserva do motor. O site nunca fica sem resposta.

Cada setup devolvido diz de onde veio, no campo "origem":
    "ia"          escolhido pela IA e aprovado sem mudanças
    "ia_ajustada" escolhido pela IA, com peças trocadas pela auditoria
    "motor"       escolhido pelo motor em Python
"""

import hashlib
import json
import logging

from django.conf import settings
from django.core.cache import cache

from apps.montagens.models import Setup
from apps.montagens.motor import LIMITE_ACIMA, preco_total, resumir

from .auditoria import Catalogo, ajustar_setup, atende_regras_do_nivel
from .esquemas import RespostaAssistente

logger = logging.getLogger(__name__)

ORDEM_DOS_NIVEIS = [c.value for c in Setup.Categoria]

INSTRUCOES = """\
Você é o assistente do MontaAqui, um site que monta PCs para pessoas leigas em hardware.
Escolha peças APENAS do catálogo enviado, usando os IDs dele. Nunca invente peças.

Monte até 3 setups, um por nível:
- "Abaixo do Orçamento": mais barato que o Equilíbrio e sem passar do orçamento.
- "Equilíbrio": o melhor conjunto que cabe no orçamento.
- "Acima do Orçamento": até 20% acima do orçamento, só se trouxer ganho real de desempenho.

Cada setup precisa ter exatamente: 1 CPU, 1 placa-mãe, 1 RAM, 1 GPU, 1 armazenamento,
1 fonte e 1 gabinete. Regras obrigatórias de compatibilidade:
- socket da CPU igual ao da placa-mãe, e a geração da CPU listada em "geracao_cpu" da placa;
- "geracao_ddr" da RAM igual à da placa-mãe;
- "interface" do armazenamento listada em "interface_armazenamento" da placa;
- fonte com pelo menos (consumo da CPU + consumo da GPU + 100 W) x 1,2;
- "formato" da fonte igual ao "formato_fonte" do gabinete;
- placa-mãe cabe no gabinete pela hierarquia Mini-ITX < Micro-ATX < ATX
  (gabinete ATX aceita as três; Micro-ATX aceita Micro-ATX e Mini-ITX);
- "comprimento_mm" da GPU menor ou igual a "comprimento_max_gpu" do gabinete.

PREÇO: o preço de um setup é a SOMA do "preco" das 7 peças. Ele precisa ficar dentro de
"limites_de_preco_por_nivel". Antes de responder, some os 7 preços de cada setup; se passar
do máximo, troque peças por outras mais baratas até caber. Setup fora da faixa é descartado.

Use os "alvos" como referência: nada abaixo dos mínimos (cpu_min, vram_min, ram_min);
o recomendado (cpu_rec, gpu_rec, vram_rec, ram_rec) é o ideal. A pontuação de CPU e de
GPU vai de 0 a 100. Respeite a preferência de processador (AMD/Intel), se houver, e a
prioridade: "Desempenho" gasta mais para render mais, "Economia" prefere gastar menos,
"Custo-benefício" busca o melhor desempenho por real.

Na explicação, fale como para um amigo que não entende de computador: frases curtas,
sem siglas sem explicar, sem preços.
"""

CAMPOS_PARA_IA = {
    "cpu": ["marca", "modelo", "preco", "socket", "geracao", "consumo_watts", "nucleos",
            "pontuacao_desempenho"],
    "placamae": ["marca", "modelo", "preco", "socket", "geracao_ddr", "formato", "geracao_cpu",
                 "interface_armazenamento"],
    "ram": ["marca", "modelo", "preco", "capacidade_gb", "geracao_ddr", "frequencia_mhz"],
    "gpu": ["marca", "modelo", "preco", "vram", "comprimento_mm", "consumo_watts",
            "pontuacao_desempenho"],
    "armazenamento": ["marca", "modelo", "preco", "tipo", "capacidade", "unidade_medida", "interface"],
    "fonte": ["marca", "modelo", "preco", "capacidade_watts", "formato"],
    "gabinete": ["marca", "modelo", "preco", "formato", "comprimento_max_gpu", "formato_fonte"],
}


def _serve_para_o_pedido(tipo, peca, alvos, preferencia_cpu):
    """
    Tira do catálogo enviado à IA as peças que ela nunca poderia escolher.
    Menos texto para ler deixa a resposta mais rápida e com menos chance de erro.
    """
    if alvos is None:
        return True
    if tipo == "cpu":
        marca_ok = preferencia_cpu not in ("AMD", "Intel") or peca.marca == preferencia_cpu
        return marca_ok and peca.pontuacao_desempenho >= alvos["cpu_min"]
    if tipo == "gpu":
        return peca.vram >= alvos["vram_min"]
    if tipo == "ram":
        return peca.capacidade_gb >= alvos["ram_min"]
    return True


def catalogo_para_ia(catalogo, alvos=None, preferencia_cpu=None):
    """As peças do banco em JSON simples: ID, campos técnicos e preço."""
    saida = {}
    for tipo, campos in CAMPOS_PARA_IA.items():
        saida[tipo] = [
            {"id": peca.id, **{c: (float(getattr(peca, c)) if c == "preco" else getattr(peca, c))
                               for c in campos}}
            for peca in catalogo.todas(tipo)
            if _serve_para_o_pedido(tipo, peca, alvos, preferencia_cpu)
        ]
    return saida


def montar_pedido(questionario, referencias, alvos, catalogo):
    """Texto enviado ao Gemini: questionário, requisitos, alvos e catálogo."""
    dados = {
        "questionario": {
            "finalidade": questionario.finalidade,
            "orcamento": float(questionario.orcamento),
            "preferencia_cpu": questionario.preferencia_cpu,
            "prioridade": questionario.prioridade_desempenho,
            "resolucao_alvo": questionario.resolucao_alvo,
            "fps_alvo": questionario.fps_alvo,
            "jogos_ou_programas": [
                {"nome": r.nome, "cpu_minima": r.desempenho_minimo,
                 "cpu_recomendada": r.desempenho_recomendado, "vram_minima": r.vram_minima,
                 "vram_recomendada": r.vram_recomendada, "ram_minima": r.ram_minima,
                 "ram_recomendada": r.ram_recomendada}
                for r in referencias
            ],
        },
        "alvos": {chave: round(valor) for chave, valor in alvos.items()},
        # Limites já calculados em reais: nos testes, a IA errava a conta de "20% acima".
        "limites_de_preco_por_nivel": _limites_de_preco(questionario.orcamento),
        "catalogo": catalogo_para_ia(catalogo, alvos, questionario.preferencia_cpu),
    }
    return json.dumps(dados, ensure_ascii=False)


def _limites_de_preco(orcamento):
    """Faixa de preço total (soma das 7 peças) aceita em cada nível, em reais."""
    orcamento = float(orcamento)
    return {
        "Abaixo do Orçamento": {"maximo": round(orcamento, 2),
                                "observacao": "precisa custar menos que o Equilíbrio"},
        "Equilíbrio": {"maximo": round(orcamento, 2)},
        "Acima do Orçamento": {"minimo": round(orcamento, 2),
                               "maximo": round(orcamento * float(LIMITE_ACIMA), 2)},
    }


def chamar_gemini(pedido):
    """Envia o pedido e devolve a RespostaAssistente já validada pelo pydantic."""
    # Import aqui dentro: quem não usa a IA (ex.: testes) não precisa carregar o SDK.
    from google import genai
    from google.genai import types

    cliente = genai.Client(
        api_key=settings.GEMINI_API_KEY,
        http_options=types.HttpOptions(
            timeout=settings.GEMINI_TEMPO_LIMITE_SEGUNDOS * 1000,
            # O Google às vezes responde "alta demanda" (503) ou "muitos pedidos" (429).
            # Esses erros passam rápido: tentamos mais uma vez, 2 segundos depois.
            retry_options=types.HttpRetryOptions(
                attempts=2, initial_delay=2.0, max_delay=4.0, http_status_codes=[429, 500, 503],
            ),
        ),
    )
    resposta = cliente.models.generate_content(
        model=settings.GEMINI_MODELO,
        contents=pedido,
        config=types.GenerateContentConfig(
            system_instruction=INSTRUCOES,
            response_mime_type="application/json",
            response_schema=RespostaAssistente,
            temperature=0.2,  # respostas mais estáveis: o mesmo pedido dá setups parecidos
            # Limita o "raciocínio" do modelo: mais raciocínio erra menos, mas demora mais.
            thinking_config=types.ThinkingConfig(thinking_budget=settings.GEMINI_RACIOCINIO),
        ),
    )
    if isinstance(resposta.parsed, RespostaAssistente):
        return resposta.parsed
    return RespostaAssistente.model_validate_json(resposta.text)


def consultar_ia(pedido):
    """
    chamar_gemini() com cache: o mesmo pedido, dentro de 1 hora, sai da memória na hora.

    A chave do cache é um resumo (hash) do pedido inteiro, que inclui o questionário e o
    catálogo com preços. Se qualquer coisa mudar, o pedido muda e a IA é consultada de novo.
    Ajuda na apresentação (repetir um exemplo é instantâneo) e economiza a cota gratuita.
    """
    if not settings.GEMINI_CACHE_SEGUNDOS:
        return chamar_gemini(pedido)

    chave = "ia:" + hashlib.sha256(f"{settings.GEMINI_MODELO}|{pedido}".encode()).hexdigest()
    guardada = cache.get(chave)
    if guardada is not None:
        return RespostaAssistente.model_validate_json(guardada)

    resposta = chamar_gemini(pedido)
    cache.set(chave, resposta.model_dump_json(), settings.GEMINI_CACHE_SEGUNDOS)
    return resposta


def _setup_do_motor(setup_motor, orcamento, referencias):
    return {
        **setup_motor,
        "origem": "motor",
        "explicacao": "",
        "resumo": resumir(setup_motor, orcamento, referencias),
        "ajustes": [],
    }


def recomendar_setups(questionario, referencias, resultado_motor):
    """
    Junta a escolha da IA com a auditoria e a reserva do motor.

    resultado_motor é o retorno de montagens.motor.gerar_setups() para o mesmo questionário.
    Devolve a lista final de setups, na ordem Abaixo, Equilíbrio, Acima.
    """
    orcamento = questionario.orcamento
    reserva = {s["categoria"]: s for s in resultado_motor["setups"]}
    setups_do_motor = [_setup_do_motor(reserva[c], orcamento, referencias)
                       for c in ORDEM_DOS_NIVEIS if c in reserva]

    if not settings.GEMINI_API_KEY:
        return setups_do_motor

    catalogo = Catalogo()
    alvos = resultado_motor["alvos"]
    try:
        resposta = consultar_ia(montar_pedido(questionario, referencias, alvos, catalogo))
    except Exception:  # sem internet, demora, chave inválida, JSON fora do formato...
        logger.exception("Falha ao consultar a IA; usando o motor em Python.")
        return setups_do_motor

    escolhas_da_ia = {}
    for escolha in resposta.setups:
        escolhas_da_ia.setdefault(escolha.categoria, escolha)  # se repetir o nível, vale a primeira

    finais = []
    for categoria in ORDEM_DOS_NIVEIS:
        setup = _auditar_escolha(escolhas_da_ia.get(categoria), categoria, catalogo, alvos,
                                 orcamento, referencias)
        if setup is None and categoria in reserva:
            setup = _setup_do_motor(reserva[categoria], orcamento, referencias)
        if setup is not None:
            finais.append(setup)

    # O "Abaixo" precisa sair mais barato que o "Equilíbrio"; senão, os dois seriam iguais na prática.
    por_nivel = {s["categoria"]: s for s in finais}
    abaixo, equilibrio = por_nivel.get("Abaixo do Orçamento"), por_nivel.get("Equilíbrio")
    if abaixo and equilibrio and abaixo["preco"] >= equilibrio["preco"]:
        finais.remove(abaixo)
        if abaixo["origem"] != "motor" and "Abaixo do Orçamento" in reserva:
            substituto = _setup_do_motor(reserva["Abaixo do Orçamento"], orcamento, referencias)
            if substituto["preco"] < equilibrio["preco"]:
                finais.insert(0, substituto)
    return finais


def _auditar_escolha(escolha, categoria, catalogo, alvos, orcamento, referencias):
    """Confere e, se preciso, ajusta um setup da IA. Devolve None se ele não puder ser usado."""
    if escolha is None:
        return None

    pecas = {tipo: catalogo.buscar(tipo, getattr(escolha, f"id_{tipo}")) for tipo in CAMPOS_PARA_IA}
    ajustadas, ajustes = ajustar_setup(pecas, catalogo)
    if ajustadas is None:
        logger.warning("IA: setup %s descartado (%s).", categoria, "; ".join(ajustes))
        return None

    motivo = atende_regras_do_nivel(categoria, ajustadas, alvos, orcamento)
    if motivo:
        logger.warning("IA: setup %s descartado (%s).", categoria, motivo)
        return None

    setup = {
        "categoria": categoria,
        "pecas": ajustadas,
        "preco": preco_total(ajustadas),
        "ajustes": ajustes,
    }
    if ajustes:
        # A explicação da IA pode citar uma peça que foi trocada: usamos o resumo em Python.
        setup.update(origem="ia_ajustada", explicacao="")
    else:
        setup.update(origem="ia", explicacao=escolha.explicacao.strip())
    setup["resumo"] = resumir(setup, orcamento, referencias)
    return setup
