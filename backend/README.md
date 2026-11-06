# MontaAqui - backend

API Django do MontaAqui.

## Como rodar em desenvolvimento

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements/dev.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

O `manage.py` usa `config.settings.dev`; `wsgi.py` e `asgi.py` usam `config.settings.prod`.

## Apps

- `apps/usuarios`: usuário customizado, perfil, autenticação
- `apps/componentes`: catálogo de CPU, GPU, placa-mãe, RAM, fonte...
- `apps/montagens`: builds, orçamento, regras de compatibilidade
- `apps/assistente`: integração com a IA de recomendação
- `apps/lojas`: lojas
