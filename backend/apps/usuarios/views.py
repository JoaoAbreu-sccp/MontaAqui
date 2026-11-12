"""
Rotas de conta do MontaAqui.

    POST /api/auth/cadastro/  { nome, email, password } -> { token, usuario }
    POST /api/auth/login/     { email, password }       -> { token, usuario }

Erros saem como { detail: "mensagem" } (ver config/erros_api.py).
O token é um JWT de acesso; o front manda ele no cabeçalho
"Authorization: Bearer <token>" nas rotas que exigem login (ex.: salvar setup).
"""

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CadastroSerializer, LoginSerializer, UsuarioSerializer


def resposta_com_token(usuario, codigo=status.HTTP_200_OK):
    token = str(RefreshToken.for_user(usuario).access_token)
    return Response({"token": token, "usuario": UsuarioSerializer(usuario).data}, status=codigo)


class CadastroView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CadastroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        # A pessoa já sai do cadastro logada.
        return resposta_com_token(usuario, status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return resposta_com_token(serializer.validated_data["usuario"])
