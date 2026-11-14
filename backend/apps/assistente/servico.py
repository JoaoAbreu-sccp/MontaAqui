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

import json
import logging

from django.conf import settings

from apps.montagens.models import Setup
from apps.montagens.motor import preco_total, resumir

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


def catalogo_para_ia(catalogo):
    """As peças do banco em JSON simples: ID, campos técnicos e preço."""
    saida = {}
    for tipo, campos in CAMPOS_PARA_IA.items():
        saida[tipo] = [
            {"id": peca.id, **{c: (float(getattr(peca, c)) if c == "preco" else getattr(peca, c))
                               for c in campos}}
            for peca in catalogo.todas(tipo)
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
        "catalogo": catalogo_para_ia(catalogo),
    }
    return json.dumps(dados, ensure_ascii=False)


def chamar_gemini(pedido):
    """Envia o pedido e devolve a RespostaAssistente já validada pelo pydantic."""
    # Import aqui dentro: quem não usa a IA (ex.: testes) não precisa carregar o SDK.
    from google import genai
    from google.genai import types

    cliente = genai.Client(
        api_key=settings.GEMINI_API_KEY,
        http_options=types.HttpOptions(timeout=settings.GEMINI_TEMPO_LIMITE_SEGUNDOS * 1000),
    )
    resposta = cliente.models.generate_content(
        model=settings.GEMINI_MODELO,
        contents=pedido,
        config=types.GenerateContentConfig(
            system_instruction=INSTRUCOES,
            response_mime_type="application/json",
            response_schema=RespostaAssistente,
            temperature=0.2,  # respostas mais estáveis: o mesmo pedido dá setups parecidos
            # Limita o "raciocínio" do modelo para responder em poucos segundos.
            thinking_config=types.ThinkingConfig(thinking_budget=2048),
        ),
    )
    if isinstance(resposta.parsed, RespostaAssistente):
        return resposta.parsed
    return RespostaAssistente.model_validate_json(resposta.text)


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
        resposta = chamar_gemini(montar_pedido(questionario, referencias, alvos, catalogo))
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
