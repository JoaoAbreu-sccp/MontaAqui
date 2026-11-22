"""
Validação dos dados de cadastro e login.

Um serializer do Django REST Framework confere o JSON que chega do front e
converte o usuário em JSON na resposta.
"""

from django.contrib.auth import authenticate, password_validation
from django.core.exceptions import ValidationError as ErroDjango
from rest_framework import serializers

from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    """Formato do usuário que o front recebe: { id, nome, email }."""

    class Meta:
        model = Usuario
        fields = ["id", "nome", "email"]


class CadastroSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=150, error_messages={"blank": "Informe seu nome."})
    email = serializers.EmailField(error_messages={
        "blank": "Informe seu e-mail.",
        "invalid": "Informe um e-mail válido.",
    })
    password = serializers.CharField(write_only=True, error_messages={"blank": "Crie uma senha."})

    def validate_email(self, email):
        email = Usuario.objects.normalize_email(email).lower()
        if Usuario.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Já existe uma conta com este e-mail. Tente entrar.")
        return email

    def validate(self, dados):
        # Usa as regras de senha do settings (mínimo de 8 caracteres, não pode ser
        # parecida com o nome/e-mail, não pode ser comum nem só números).
        usuario_provisorio = Usuario(nome=dados["nome"], email=dados["email"])
        try:
            password_validation.validate_password(dados["password"], usuario_provisorio)
        except ErroDjango as erro:
            raise serializers.ValidationError({"password": erro.messages})
        return dados

    def create(self, dados):
        # create_user grava a senha com hash, nunca em texto puro.
        return Usuario.objects.create_user(
            email=dados["email"], password=dados["password"], nome=dados["nome"].strip()
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={
        "blank": "Informe seu e-mail.",
        "invalid": "Informe um e-mail válido.",
    })
    password = serializers.CharField(write_only=True, error_messages={"blank": "Informe sua senha."})

    def validate(self, dados):
        usuario = authenticate(
            request=self.context.get("request"),
            email=dados["email"].strip().lower(),
            password=dados["password"],
        )
        # Mensagem única de propósito: não revela se o e-mail existe ou não.
        if usuario is None:
            raise serializers.ValidationError("E-mail ou senha incorretos.")
        dados["usuario"] = usuario
        return dados
