"""Testes da API de conta. Rodar com: python manage.py test"""

from django.core import mail
from rest_framework.test import APITestCase

from .models import Usuario


class AutenticacaoTests(APITestCase):
    def cadastrar(self, **extras):
        dados = {"nome": "Maria Souza", "email": "maria@exemplo.com", "password": "pc-novo-2026", **extras}
        return self.client.post("/api/auth/cadastro/", dados, format="json")

    def test_cadastro_devolve_token_e_usuario(self):
        resposta = self.cadastrar()
        self.assertEqual(resposta.status_code, 201)
        self.assertIn("token", resposta.data)
        self.assertEqual(resposta.data["usuario"]["nome"], "Maria Souza")
        self.assertEqual(resposta.data["usuario"]["email"], "maria@exemplo.com")

    def test_senha_fica_com_hash(self):
        self.cadastrar()
        usuario = Usuario.objects.get(email="maria@exemplo.com")
        self.assertNotEqual(usuario.password, "pc-novo-2026")
        self.assertTrue(usuario.check_password("pc-novo-2026"))

    def test_email_repetido_da_erro_com_detail(self):
        self.cadastrar()
        resposta = self.cadastrar(email="MARIA@exemplo.com")
        self.assertEqual(resposta.status_code, 400)
        self.assertEqual(resposta.data, {"detail": "Já existe uma conta com este e-mail. Tente entrar."})

    def test_senha_fraca_da_erro_com_detail(self):
        resposta = self.cadastrar(password="123")
        self.assertEqual(resposta.status_code, 400)
        self.assertEqual(list(resposta.data), ["detail"])

    def test_login_certo_e_errado(self):
        self.cadastrar()
        certo = self.client.post("/api/auth/login/",
                                 {"email": "maria@exemplo.com", "password": "pc-novo-2026"}, format="json")
        self.assertEqual(certo.status_code, 200)
        self.assertIn("token", certo.data)

        errado = self.client.post("/api/auth/login/",
                                  {"email": "maria@exemplo.com", "password": "outra"}, format="json")
        self.assertEqual(errado.status_code, 400)
        self.assertEqual(errado.data, {"detail": "E-mail ou senha incorretos."})


class RecuperacaoDeSenhaTests(APITestCase):
    """RF03. Nos testes o Django guarda os e-mails em mail.outbox, sem enviar nada."""

    def setUp(self):
        self.client.post("/api/auth/cadastro/", {"nome": "Maria", "email": "maria@exemplo.com",
                                                 "password": "pc-novo-2026"}, format="json")

    def pedir_link(self, email="maria@exemplo.com"):
        return self.client.post("/api/auth/recuperar-senha/", {"email": email}, format="json")

    def dados_do_link(self):
        from urllib.parse import parse_qs, urlparse

        link = next(linha for linha in mail.outbox[-1].body.splitlines() if "redefinir-senha" in linha)
        parametros = parse_qs(urlparse(link).query)
        return {"uid": parametros["uid"][0], "token": parametros["token"][0]}

    def redefinir(self, senha="senha-nova-2026", **extras):
        return self.client.post("/api/auth/redefinir-senha/",
                                {**self.dados_do_link(), "password": senha, **extras}, format="json")

    def test_envia_link_para_quem_tem_conta(self):
        self.assertEqual(self.pedir_link().status_code, 204)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["maria@exemplo.com"])
        self.assertIn("http://localhost:5173/redefinir-senha?uid=", mail.outbox[0].body)

    def test_mesma_resposta_para_email_sem_conta(self):
        resposta = self.pedir_link("ninguem@exemplo.com")
        self.assertEqual(resposta.status_code, 204)
        self.assertEqual(len(mail.outbox), 0)

    def test_redefine_entra_e_senha_antiga_para_de_funcionar(self):
        self.pedir_link()
        resposta = self.redefinir()
        self.assertEqual(resposta.status_code, 200)
        self.assertIn("token", resposta.data)

        def login(senha):
            return self.client.post("/api/auth/login/", {"email": "maria@exemplo.com", "password": senha},
                                    format="json").status_code

        self.assertEqual(login("senha-nova-2026"), 200)
        self.assertEqual(login("pc-novo-2026"), 400)

    def test_link_so_funciona_uma_vez(self):
        self.pedir_link()
        self.assertEqual(self.redefinir().status_code, 200)
        segunda = self.redefinir(senha="mais-uma-senha-2026")
        self.assertEqual(segunda.status_code, 400)
        self.assertIn("link não vale mais", segunda.data["detail"])

    def test_token_adulterado_e_recusado(self):
        self.pedir_link()
        resposta = self.redefinir(token="token-falso")
        self.assertEqual(resposta.status_code, 400)
        self.assertIn("link não vale mais", resposta.data["detail"])

    def test_senha_fraca_e_recusada(self):
        self.pedir_link()
        resposta = self.redefinir(senha="123")
        self.assertEqual(resposta.status_code, 400)
        self.assertEqual(list(resposta.data), ["detail"])
