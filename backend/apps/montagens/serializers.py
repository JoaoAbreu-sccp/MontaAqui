"""
Conversão entre JSON e os dados de montagem (questionário, jogos, programas e setups).
"""

from rest_framework import serializers

from apps.componentes.models import Armazenamento, Cpu, Fonte, Gabinete, Gpu, PlacaMae, Ram

from .compatibilidade import verificar_compatibilidade
from .models import Jogo, Programa, Questionario, Setup
from .motor import preco_total

# Valores aceitos, iguais aos do front (frontend/src/dados/opcoesQuestionario.js).
FINALIDADES = ["Jogos", "Trabalho", "Estudos", "Edição"]
PREFERENCIAS_CPU = ["Sem preferência", "AMD", "Intel"]
PRIORIDADES = ["Custo-benefício", "Desempenho", "Economia"]
RESOLUCOES = ["1080p", "1440p", "4K"]
FPS = [60, 120, 144]

# Ordem e nome de cada peça na tela.
TIPOS_DE_PECA = [
    ("cpu", "Processador", Cpu),
    ("placamae", "Placa-mãe", PlacaMae),
    ("ram", "Memória RAM", Ram),
    ("gpu", "Placa de vídeo", Gpu),
    ("armazenamento", "Armazenamento", Armazenamento),
    ("fonte", "Fonte", Fonte),
    ("gabinete", "Gabinete", Gabinete),
]


class JogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jogo
        fields = ["id", "nome"]


class ProgramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programa
        fields = ["id", "nome", "categoria"]


class QuestionarioSerializer(serializers.Serializer):
    """Respostas do questionário, no formato que o front envia."""

    finalidade = serializers.ChoiceField(choices=FINALIDADES, error_messages={
        "invalid_choice": "Escolha para que você vai usar o PC."})
    orcamento = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=500,
                                         max_value=100000, error_messages={
                                             "min_value": "O orçamento precisa ser de pelo menos R$ 500.",
                                             "max_value": "O orçamento pode ser de até R$ 100.000."})
    preferencia_cpu = serializers.ChoiceField(choices=PREFERENCIAS_CPU, default="Sem preferência")
    prioridade_desempenho = serializers.ChoiceField(choices=PRIORIDADES, default="Custo-benefício")
    resolucao_alvo = serializers.ChoiceField(choices=RESOLUCOES, required=False, allow_null=True)
    fps_alvo = serializers.ChoiceField(choices=FPS, required=False, allow_null=True)
    jogos = serializers.PrimaryKeyRelatedField(queryset=Jogo.objects.all(), many=True, required=False)
    programas = serializers.PrimaryKeyRelatedField(queryset=Programa.objects.all(), many=True,
                                                   required=False)

    def validate(self, dados):
        if dados["finalidade"] == "Jogos":
            if not dados.get("jogos"):
                raise serializers.ValidationError("Marque pelo menos um jogo.")
            if not dados.get("resolucao_alvo") or not dados.get("fps_alvo"):
                raise serializers.ValidationError("Escolha a resolução e o FPS.")
        else:
            # Resolução, FPS e jogos só valem para Jogos.
            dados["jogos"], dados["resolucao_alvo"], dados["fps_alvo"] = [], None, None
        if dados["finalidade"] == "Edição":
            if not dados.get("programas"):
                raise serializers.ValidationError("Marque pelo menos um programa.")
        else:
            dados["programas"] = []
        return dados

    def create(self, dados):
        jogos = dados.pop("jogos")
        programas = dados.pop("programas")
        questionario = Questionario.objects.create(**dados)
        for jogo in jogos:
            questionario.jogos_escolhidos.create(jogo=jogo)
        for programa in programas:
            questionario.programas_escolhidos.create(programa=programa)
        return questionario


def peca_para_json(tipo, rotulo, peca):
    """Uma peça com o nome, o preço, um detalhe simples e os links das lojas (RF07)."""
    ofertas = peca.ofertas.select_related("loja").order_by("loja_id")
    return {
        "tipo": tipo,
        "rotulo": rotulo,
        "id": peca.id,
        "nome": str(peca),
        "preco": float(peca.preco),
        "detalhe": _detalhe(tipo, peca),
        "links": [
            {"loja": oferta.loja.nome, "url": oferta.loja.gerar_link_afiliado(oferta.caminho_produto)}
            for oferta in ofertas
        ],
    }


def _detalhe(tipo, peca):
    if tipo == "cpu":
        return f"{peca.nucleos} núcleos · encaixe {peca.socket}"
    if tipo == "placamae":
        return f"{peca.formato} · memória {peca.geracao_ddr}"
    if tipo == "ram":
        return f"{peca.capacidade_gb} GB {peca.geracao_ddr} · {peca.frequencia_mhz} MHz"
    if tipo == "gpu":
        return f"{peca.vram} GB de memória de vídeo"
    if tipo == "armazenamento":
        return f"{peca.tipo} · {peca.capacidade} {peca.unidade_medida}"
    if tipo == "fonte":
        return f"{peca.capacidade_watts} W · formato {peca.formato}"
    return f"Aceita placa-mãe até {peca.formato}"


def pecas_para_json(pecas):
    return [peca_para_json(tipo, rotulo, pecas[tipo]) for tipo, rotulo, _ in TIPOS_DE_PECA]


class SalvarSetupSerializer(serializers.Serializer):
    """Setup que a pessoa escolheu salvar. As peças são conferidas de novo aqui (RF06)."""

    questionario = serializers.PrimaryKeyRelatedField(queryset=Questionario.objects.all())
    categoria = serializers.ChoiceField(choices=Setup.Categoria.choices)
    cpu = serializers.PrimaryKeyRelatedField(queryset=Cpu.objects.all())
    placamae = serializers.PrimaryKeyRelatedField(queryset=PlacaMae.objects.all())
    ram = serializers.PrimaryKeyRelatedField(queryset=Ram.objects.all())
    gpu = serializers.PrimaryKeyRelatedField(queryset=Gpu.objects.all())
    armazenamento = serializers.PrimaryKeyRelatedField(queryset=Armazenamento.objects.all())
    fonte = serializers.PrimaryKeyRelatedField(queryset=Fonte.objects.all())
    gabinete = serializers.PrimaryKeyRelatedField(queryset=Gabinete.objects.all())

    def validate(self, dados):
        pecas = {tipo: dados[tipo] for tipo, _, _ in TIPOS_DE_PECA}
        problemas = verificar_compatibilidade(pecas)
        if problemas:
            raise serializers.ValidationError(problemas[0])
        return dados

    def create(self, dados):
        pecas = {tipo: dados[tipo] for tipo, _, _ in TIPOS_DE_PECA}
        # O preço é calculado aqui, e não recebido do front, para não ser alterado.
        return Setup.objects.create(usuario=self.context["request"].user,
                                    preco=preco_total(pecas), **dados)


def setup_salvo_para_json(setup):
    pecas = {tipo: getattr(setup, tipo) for tipo, _, _ in TIPOS_DE_PECA}
    return {
        "id": setup.id,
        "categoria": setup.categoria,
        "preco": float(setup.preco),
        "data_criacao": setup.data_criacao.isoformat(),
        "finalidade": setup.questionario.finalidade,
        "orcamento": float(setup.questionario.orcamento),
        "pecas": pecas_para_json(pecas),
    }
