# Banco de dados do MontaAqui (MySQL 8)

| Arquivo | Conteúdo |
|---|---|
| `montaaqui_estrutura.sql` | Cria o banco `montaaqui` com as 31 tabelas, chaves e índices, e registra as migrations do Django |
| `montaaqui_dados.sql` | Catálogo inicial: 63 peças, 3 lojas, 189 links de compra, 16 jogos e 12 programas |

Os dois arquivos foram gerados a partir das migrations e dos comandos de carga do Django.
Por isso, o banco criado por eles é **idêntico** ao criado pelo `python manage.py migrate`.

## Como usar

### Opção 1: pelo MySQL Workbench
1. Abra `montaaqui_estrutura.sql` (File > Open SQL Script) e execute (ícone do raio).
2. Faça o mesmo com `montaaqui_dados.sql`.
3. No arquivo `backend/.env`, aponte para o banco:
   ```
   DATABASE_URL=mysql://usuario:senha@localhost:3306/montaaqui
   ```
4. No terminal, dentro de `backend/`, rode uma vez:
   ```
   .venv\Scripts\python.exe manage.py migrate
   ```
   Ele vai dizer "No migrations to apply" e só cria as permissões do painel admin.

### Opção 2: só pelo Django
Crie o banco vazio no MySQL e deixe o Django fazer o resto:
```sql
CREATE DATABASE montaaqui CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```
```
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py carregar_pecas
.venv\Scripts\python.exe manage.py carregar_requisitos
```

As duas opções chegam ao mesmo banco. Use a que a equipe preferir, mas não as duas no mesmo banco.

## Cuidados
- **Os scripts são para um banco vazio.** Se as tabelas já existirem, a estrutura para com erro, e os dados dão erro de chave duplicada.
- **Mudanças no banco começam nos models do Django**, e não no SQL. Altere o `models.py`, rode `python manage.py makemigrations` e depois `migrate`. Se o banco for alterado direto no MySQL, o código e o banco ficam diferentes.
- **Se os models mudarem, estes arquivos ficam desatualizados** e precisam ser gerados de novo.
- **Usuários e senhas nunca entram nestes arquivos.** Contas são criadas pelo site ou por `python manage.py createsuperuser`.
- Os preços são aproximados, os links apontam para a busca de cada loja e o código de afiliado é provisório.
