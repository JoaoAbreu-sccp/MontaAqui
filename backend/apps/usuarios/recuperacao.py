"""
Recuperação de senha (RF03).

Passo a passo:
1. A pessoa informa o e-mail em /recuperar-senha (front).
   POST /api/auth/recuperar-senha/ { email }
   Se existir conta, mandamos um e-mail com um link para o front:
       http://localhost:5173/redefinir-senha?uid=...&token=...
   A resposta é sempre a mesma, exista a conta ou não, para ninguém descobrir
   quais e-mails estão cadastrados.
2. A pessoa abre o link e escolhe a nova senha.
   POST /api/auth/redefinir-senha/ { uid, token, password }

O token é o gerador de tokens do próprio Django (o mesmo do painel admin):
- não fica guardado no banco;
- vale por PASSWORD_RESET_TIMEOUT (2 horas, ver settings/base.py);
- deixa de valer assim que a senha muda, então o link só funciona uma vez.

Em desenvolvimento o e-mail não sai de verdade: ele aparece no terminal onde o
Django está rodando (EMAIL_BACKEND de console, ver settings/dev.py).
"""

from django.conf import settings
from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as ErroDjango
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers

from .models import Usuario

LINK_INVALIDO = "Este link não vale mais. Peça um novo link de recuperação de senha."


def link_de_redefinicao(usuario):
    uid = urlsafe_base64_encode(force_bytes(usuario.pk))
    token = default_token_generator.make_token(usuario)
    return f"{settings.FRONTEND_URL}/redefinir-senha?uid={uid}&token={token}"


def enviar_email_de_recuperacao(usuario):
    horas = settings.PASSWORD_RESET_TIMEOUT // 3600
    mensagem = (
        f"Olá, {usuario.nome}!\n\n"
        "Recebemos um pedido para criar uma nova senha na sua conta do MontaAqui.\n"
        "Para escolher a nova senha, abra o link abaixo:\n\n"
        f"{link_de_redefinicao(usuario)}\n\n"
        f"O link vale por {horas} horas e só pode ser usado uma vez.\n"
        "Se não foi você que pediu, ignore este e-mail: sua senha continua a mesma.\n\n"
        "Equipe MontaAqui"
    )
    send_mail("MontaAqui: crie uma nova senha", mensagem, None, [usuario.email])


class PedidoDeRecuperacaoSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={
        "blank": "Informe seu e-mail.",
        "invalid": "Informe um e-mail válido.",
    })

    def enviar(self):
        email = self.validated_data["email"].strip().lower()
        usuario = Usuario.objects.filter(email__iexact=email, is_active=True).first()
        if usuario is not None:
            enviar_email_de_recuperacao(usuario)


class RedefinicaoDeSenhaSerializer(serializers.Serializer):
    uid = serializers.CharField(error_messages={"blank": LINK_INVALIDO})
    token = serializers.CharField(error_messages={"blank": LINK_INVALIDO})
    password = serializers.CharField(write_only=True, error_messages={"blank": "Crie uma senha."})

    def validate(self, dados):
        try:
            id_usuario = force_str(urlsafe_base64_decode(dados["uid"]))
            usuario = Usuario.objects.get(pk=id_usuario, is_active=True)
        except (ValueError, TypeError, OverflowError, Usuario.DoesNotExist):
            raise serializers.ValidationError(LINK_INVALIDO)

        if not default_token_generator.check_token(usuario, dados["token"]):
            raise serializers.ValidationError(LINK_INVALIDO)

        # Mesmas regras de senha do cadastro (mínimo de 8 caracteres etc.).
        try:
            password_validation.validate_password(dados["password"], usuario)
        except ErroDjango as erro:
            raise serializers.ValidationError({"password": erro.messages})

        dados["usuario"] = usuario
        return dados

    def save(self):
        usuario = self.validated_data["usuario"]
        usuario.set_password(self.validated_data["password"])  # grava só o hash
        usuario.save(update_fields=["password"])
        return usuario
