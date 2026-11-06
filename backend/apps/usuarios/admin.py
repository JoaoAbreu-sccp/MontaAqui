from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UsuarioChangeForm, UsuarioCreationForm
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    add_form = UsuarioCreationForm
    form = UsuarioChangeForm
    model = Usuario

    list_display = ("email", "nome", "is_staff", "data_cadastro")
    search_fields = ("email", "nome")
    ordering = ("email",)
    readonly_fields = ("last_login", "data_cadastro")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Dados pessoais", {"fields": ("nome",)}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Datas", {"fields": ("last_login", "data_cadastro")}),
    )

    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "nome", "password1", "password2")}),
    )