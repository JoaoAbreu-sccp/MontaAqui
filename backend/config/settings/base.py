"""
Configurações comuns a todos os ambientes.

O que muda por ambiente fica em dev.py e prod.py.
"""

from pathlib import Path

import environ

# backend/config/settings/base.py -> backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "apps.usuarios",
    "apps.componentes",
    "apps.montagens",
    "apps.assistente",
    "apps.lojas",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Internationalization

LANGUAGE_CODE = "pt-br"

TIME_ZONE = "America/Bahia"

USE_I18N = True

USE_TZ = True


# Arquivos estáticos e uploads

STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "usuarios.Usuario"


# API (Django REST Framework)
# Por padrão, toda rota exige login. As rotas públicas (cadastro, login, listas e
# geração de setups) liberam o acesso com permission_classes = [AllowAny].
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    # Todo erro sai no formato { "detail": "mensagem" }, que o front espera.
    "EXCEPTION_HANDLER": "config.erros_api.tratar_erro",
}

# Login com token JWT (djangorestframework-simplejwt)
# O front guarda só o token de acesso, sem renovação automática. Por isso ele dura
# 1 dia: depois disso a pessoa entra de novo. Simples para o escopo do projeto.
from datetime import timedelta  # noqa: E402

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "id_usuario",
}


# Assistente de IA (Gemini). A chave fica só no .env, nunca no código.
# Sem chave, o assistente não é chamado e os setups saem do motor em Python.
GEMINI_API_KEY = env("GEMINI_API_KEY", default="")
# O gemini-2.5-flash do pedido original não está mais disponível para contas novas.
# Testamos em 19/11/2026: o 3.5-flash respondeu ao pedido completo em ~9 s, enquanto
# o 3.7 e o 3.8 viviam sobrecarregados. Para trocar, basta GEMINI_MODELO no .env.
GEMINI_MODELO = env("GEMINI_MODELO", default="gemini-3.5-flash")
# Nos testes a IA de verdade nunca é chamada (ver config/test_runner.py).
TEST_RUNNER = "config.test_runner.ExecutorSemIA"
# Tempo máximo esperando cada tentativa da IA. Passou disso, usamos o motor em Python.
# Com a nova tentativa (ver servico.py), a espera total fica em pouco mais de 1 minuto no pior caso.
GEMINI_TEMPO_LIMITE_SEGUNDOS = env.int("GEMINI_TEMPO_LIMITE_SEGUNDOS", default=30)


# Recuperação de senha (RF03), ver apps/usuarios/recuperacao.py
# Endereço do front: o link do e-mail aponta para a página /redefinir-senha dele.
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173").rstrip("/")
# O link de nova senha vale por 2 horas (o padrão do Django é 3 dias).
PASSWORD_RESET_TIMEOUT = 2 * 60 * 60
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="MontaAqui <nao-responda@montaaqui.local>")
