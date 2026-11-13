"""
Rotas de montagem do MontaAqui.

    GET  /api/jogos/          lista de jogos do questionário          (público)
    GET  /api/programas/      lista de programas do questionário      (público)
    POST /api/setups/gerar/   respostas do questionário -> até 3 setups (público)
    GET  /api/setups/         setups salvos da pessoa logada          (exige login)
    POST /api/setups/         salva um setup gerado                   (exige login)

Visitantes geram setups sem conta; só quem está logado salva (RF08).
"""

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Jogo, Programa, Setup
from .motor import gerar_setups, resumir
from .serializers import (
    JogoSerializer,
    ProgramaSerializer,
    QuestionarioSerializer,
    SalvarSetupSerializer,
    TIPOS_DE_PECA,
    pecas_para_json,
    setup_salvo_para_json,
)


class ListaJogosView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Jogo.objects.all()
    serializer_class = JogoSerializer


class ListaProgramasView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Programa.objects.all()
    serializer_class = ProgramaSerializer


class GerarSetupsView(APIView):
    """Guarda o questionário (sem ligar a usuário) e devolve os setups recomendados."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuestionarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        jogos = serializer.validated_data["jogos"]
        programas = serializer.validated_data["programas"]
        questionario = serializer.save()

        resultado = gerar_setups(
            finalidade=questionario.finalidade,
            orcamento=questionario.orcamento,
            prioridade=questionario.prioridade_desempenho,
            preferencia_cpu=questionario.preferencia_cpu,
            jogos=jogos,
            programas=programas,
            resolucao=questionario.resolucao_alvo,
            fps=questionario.fps_alvo,
        )

        referencias = jogos or programas
        setups = [
            {
                "categoria": setup["categoria"],
                "preco": float(setup["preco"]),
                "pecas": pecas_para_json(setup["pecas"]),
                "resumo": resumir(setup, questionario.orcamento, referencias),
                # Ids das peças, para o front pedir o salvamento depois.
                "ids": {tipo: setup["pecas"][tipo].id for tipo, _, _ in TIPOS_DE_PECA},
            }
            for setup in resultado["setups"]
        ]
        preco_minimo = resultado["preco_minimo"]
        return Response({
            "questionario": questionario.id,
            "setups": setups,
            "preco_minimo": float(preco_minimo) if preco_minimo is not None else None,
        })


class SetupsDoUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        setups = (
            Setup.objects.filter(usuario=request.user)
            .select_related("questionario", *[tipo for tipo, _, _ in TIPOS_DE_PECA])
            .order_by("-data_criacao")
        )
        return Response([setup_salvo_para_json(setup) for setup in setups])

    def post(self, request):
        serializer = SalvarSetupSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        setup = serializer.save()
        return Response(setup_salvo_para_json(setup), status=status.HTTP_201_CREATED)
