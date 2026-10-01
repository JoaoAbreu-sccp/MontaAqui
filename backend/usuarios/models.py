from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UsuarioManager(BaseUserManager):
    """Responsável por criar usuários comuns e administradores."""

    use_in_migrations = True

    def _criar_usuario(self, email, password, **campos_extras):
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        email = self.normalize_email(email)
        usuario = self.model(email=email, **campos_extras)
        usuario.set_password(password)  # grava o hash, nunca a senha pura (RNF05)
        usuario.save(using=self._db)
        return usuario

    def create_user(self, email, password=None, **campos_extras):
        campos_extras.setdefault("is_staff", False)
        campos_extras.setdefault("is_superuser", False)
        return self._criar_usuario(email, password, **campos_extras)

    def create_superuser(self, email, password=None, **campos_extras):
        campos_extras.setdefault("is_staff", True)
        campos_extras.setdefault("is_superuser", True)
        if campos_extras.get("is_staff") is not True:
            raise ValueError("O superusuário precisa ter is_staff=True.")
        if campos_extras.get("is_superuser") is not True:
            raise ValueError("O superusuário precisa ter is_superuser=True.")
        return self._criar_usuario(email, password, **campos_extras)


class Usuario(AbstractBaseUser, PermissionsMixin):
    # Campos do modelo físico (tabela "usuario")
    id = models.BigAutoField(primary_key=True, db_column="id_usuario")
    nome = models.CharField("nome", max_length=150)
    email = models.EmailField("e-mail", unique=True)
    password = models.CharField("senha", max_length=128, db_column="senha")
    data_cadastro = models.DateTimeField("data de cadastro", auto_now_add=True)

    # Campos exigidos pelo sistema de autenticação do Django
    is_active = models.BooleanField("ativo", default=True)
    is_staff = models.BooleanField("acesso ao painel admin", default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "email"      # o login é feito pelo e-mail
    REQUIRED_FIELDS = ["nome"]    # pedido ao criar superusuário pelo terminal

    class Meta:
        db_table = "usuario"
        verbose_name = "usuário"
        verbose_name_plural = "usuários"

    def __str__(self):
        return self.email