from .base import *  # noqa: F403
from .base import BASE_DIR, env

DEBUG = True

# Usa DATABASE_URL do .env quando definida (ex.: MySQL local); senão, SQLite.
DATABASES = {
    "default": env.db("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
}

CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]

# Em desenvolvimento os e-mails não são enviados: aparecem no terminal do Django.
# Assim dá para testar a recuperação de senha sem configurar Gmail nem servidor de e-mail.
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
