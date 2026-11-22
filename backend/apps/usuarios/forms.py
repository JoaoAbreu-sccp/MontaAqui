from django.contrib.auth.forms import BaseUserCreationForm, UserChangeForm

from .models import Usuario


class UsuarioCreationForm(BaseUserCreationForm):
    class Meta:
        model = Usuario
        fields = ("email", "nome")


class UsuarioChangeForm(UserChangeForm):
    class Meta:
        model = Usuario
        fields = ("email", "nome")