"""Testes da API de conta. Rodar com: python manage.py test"""

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
