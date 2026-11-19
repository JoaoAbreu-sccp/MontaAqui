from .base import *  # noqa: F403
from .base import env

DEBUG = False

DATABASES = {"default": env.db("DATABASE_URL")}

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# E-mail de verdade em produção, configurado pelo .env. Exemplo (Gmail com senha de app):
#   EMAIL_URL=smtp+tls://seu.email%40gmail.com:senha-de-app@smtp.gmail.com:587
# Sem EMAIL_URL, os e-mails aparecem no log do servidor.
vars().update(env.email_url("EMAIL_URL", default="consolemail://"))
