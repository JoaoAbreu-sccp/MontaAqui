from .base import *  # noqa: F403
from .base import BASE_DIR, env

DEBUG = True

# Usa DATABASE_URL do .env quando definida (ex.: MySQL local); senão, SQLite.
DATABASES = {
    "default": env.db("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
}

CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
