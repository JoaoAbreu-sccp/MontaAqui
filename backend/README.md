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

No `.env`, `DATABASE_URL` aponta para o MySQL local (veja `.env.example`). Sem ela, o Django usa SQLite.
Os scripts para criar o banco direto no MySQL ficam em `../database/`.

Testes (compatibilidade, motor e API):

```bash
python manage.py test apps
```

## Rotas da API

| Método e rota | Login? | O que faz |
|---|---|---|
| `POST /api/auth/cadastro/` | não | `{ nome, email, password }` → `{ token, usuario }` |
| `POST /api/auth/login/` | não | `{ email, password }` → `{ token, usuario }` |
| `GET /api/jogos/` | não | Jogos do questionário |
| `GET /api/programas/` | não | Programas do questionário |
| `POST /api/setups/gerar/` | não | Respostas do questionário → até 3 setups compatíveis |
| `GET /api/setups/` | sim | Setups salvos da pessoa logada |
| `POST /api/setups/` | sim | Salva um setup (as peças são conferidas de novo) |

Erros sempre saem como `{ "detail": "mensagem" }`. Nas rotas com login, o front manda o
cabeçalho `Authorization: Bearer <token>`. O token (JWT) vale 1 dia.

- Regras de compatibilidade: `apps/montagens/compatibilidade.py`
- Motor de recomendação (sem IA, por enquanto): `apps/montagens/motor.py`. Os pesos e faixas
  ficam em constantes no topo do arquivo, com a explicação de cada decisão.

## Apps

- `apps/usuarios`: usuário customizado, perfil, autenticação
- `apps/componentes`: catálogo de CPU, GPU, placa-mãe, RAM, fonte...
- `apps/montagens`: builds, orçamento, regras de compatibilidade
- `apps/assistente`: integração com a IA de recomendação
- `apps/lojas`: lojas
