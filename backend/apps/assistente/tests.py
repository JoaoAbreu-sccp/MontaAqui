"""
Testes do assistente de IA. O Gemini é simulado (mock): nenhum teste usa a internet
nem a chave de verdade. Rodar com: python manage.py test apps
"""

from decimal import Decimal
from unittest.mock import patch

from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework.test import APITestCase

from apps.montagens.compatibilidade import verificar_compatibilidade
from apps.montagens.models import Jogo, Questionario
from apps.montagens.motor import gerar_setups

from .esquemas import RespostaAssistente, SetupEscolhido
from .servico import recomendar_setups

# IDs do catálogo de carregar_pecas. Este setup é compatível e custa R$ 7.709,30:
# Ryzen 7 5700X3D + A520M (AM4, DDR4) + 16 GB DDR4 + RTX 5070 + NV3 1TB + 550 W + Q300L.
EQUILIBRIO_CERTO = dict(id_cpu=6, id_placamae=2, id_ram=2, id_gpu=7, id_armazenamento=4,
                        id_fonte=1, id_gabinete=1)


def escolha(categoria="Equilíbrio", explicacao="Roda bem o seu jogo.", **ids):
    return SetupEscolhido(categoria=categoria, explicacao=explicacao, **{**EQUILIBRIO_CERTO, **ids})


@override_settings(GEMINI_API_KEY="chave-de-teste")
class AssistenteTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("carregar_pecas", verbosity=0)
        call_command("carregar_requisitos", verbosity=0)
        cls.jogo = Jogo.objects.get(nome="Cyberpunk 2077")
        cls.questionario = Questionario.objects.create(
            finalidade="Jogos", orcamento=Decimal("8000"), preferencia_cpu="Sem preferência",
            prioridade_desempenho="Custo-benefício", resolucao_alvo="1440p", fps_alvo=60)

    def recomendar(self, resposta_da_ia=None, erro=None):
        motor = gerar_setups(finalidade="Jogos", orcamento=Decimal("8000"), prioridade="Custo-benefício",
                             preferencia_cpu="Sem preferência", jogos=[self.jogo],
                             resolucao="1440p", fps=60)
        with patch("apps.assistente.servico.chamar_gemini") as falso:
            if erro:
                falso.side_effect = erro
            else:
                falso.return_value = RespostaAssistente(setups=resposta_da_ia)
            setups = recomendar_setups(self.questionario, [self.jogo], motor)
        self.chamou_ia = falso.called
        for setup in setups:
            self.assertEqual(verificar_compatibilidade(setup["pecas"]), [])
        return {s["categoria"]: s for s in setups}

    def test_setup_certo_da_ia_e_mantido(self):
        setups = self.recomendar([escolha()])
        equilibrio = setups["Equilíbrio"]
        self.assertEqual(equilibrio["origem"], "ia")
        self.assertEqual(equilibrio["explicacao"], "Roda bem o seu jogo.")
        self.assertEqual(equilibrio["ajustes"], [])
        self.assertEqual(equilibrio["preco"], Decimal("7709.30"))
        # Níveis que a IA não mandou vêm do motor.
        self.assertEqual(setups["Abaixo do Orçamento"]["origem"], "motor")

    def test_memoria_errada_e_trocada(self):
        setups = self.recomendar([escolha(id_ram=6)])  # 16 GB DDR5 numa placa DDR4
        equilibrio = setups["Equilíbrio"]
        self.assertEqual(equilibrio["origem"], "ia_ajustada")
        self.assertEqual(equilibrio["pecas"]["ram"].geracao_ddr, "DDR4")
        self.assertEqual(equilibrio["pecas"]["ram"].capacidade_gb, 16)  # manteve a capacidade
        self.assertIn("DDR4", equilibrio["ajustes"][0])
        self.assertEqual(equilibrio["explicacao"], "")  # o texto da IA citava a peça antiga

    def test_gabinete_e_fonte_errados_sao_trocados(self):
        # Placa ATX num gabinete Micro-ATX, e fonte SFX num gabinete para ATX.
        # RX 9060 XT (id 5) para o total continuar dentro do orçamento depois dos ajustes.
        setups = self.recomendar([escolha(id_placamae=6, id_fonte=7, id_gpu=5)])
        self.assertEqual(setups["Equilíbrio"]["origem"], "ia_ajustada")
        pecas = setups["Equilíbrio"]["pecas"]
        self.assertEqual(pecas["placamae"].id, 6)  # a placa escolhida pela IA foi mantida
        self.assertTrue(pecas["gabinete"].comporta_placa(pecas["placamae"]))
        self.assertEqual(pecas["fonte"].formato, pecas["gabinete"].formato_fonte)

    def test_processador_inexistente_usa_o_motor(self):
        setups = self.recomendar([escolha(id_cpu=999)])
        self.assertEqual(setups["Equilíbrio"]["origem"], "motor")

    def test_equilibrio_acima_do_orcamento_usa_o_motor(self):
        setups = self.recomendar([escolha(id_gpu=9, id_fonte=6, id_gabinete=4)])  # RTX 5080
        self.assertEqual(setups["Equilíbrio"]["origem"], "motor")
        self.assertLessEqual(setups["Equilíbrio"]["preco"], 8000)

    def test_falha_da_ia_usa_o_motor(self):
        setups = self.recomendar(erro=TimeoutError("demorou"))
        self.assertEqual({s["origem"] for s in setups.values()}, {"motor"})
        self.assertEqual(len(setups), 3)

    @override_settings(GEMINI_API_KEY="")
    def test_sem_chave_nem_chama_a_ia(self):
        setups = self.recomendar([escolha()])
        self.assertFalse(self.chamou_ia)
        self.assertEqual({s["origem"] for s in setups.values()}, {"motor"})


@override_settings(GEMINI_API_KEY="chave-de-teste")
class EndpointComIaTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("carregar_pecas", verbosity=0)
        call_command("carregar_requisitos", verbosity=0)

    def test_gerar_devolve_campos_da_ia(self):
        dados = {"finalidade": "Jogos", "orcamento": 8000, "resolucao_alvo": "1440p", "fps_alvo": 60,
                 "jogos": [Jogo.objects.get(nome="Cyberpunk 2077").id]}
        with patch("apps.assistente.servico.chamar_gemini",
                   return_value=RespostaAssistente(setups=[escolha()])):
            resposta = self.client.post("/api/setups/gerar/", dados, format="json")
        self.assertEqual(resposta.status_code, 200)
        equilibrio = next(s for s in resposta.data["setups"] if s["categoria"] == "Equilíbrio")
        self.assertEqual(equilibrio["origem"], "ia")
        self.assertEqual(equilibrio["explicacao"], "Roda bem o seu jogo.")
        self.assertTrue(equilibrio["compatibilidade_verificada"])

    @override_settings(GEMINI_API_KEY="")
    def test_aceita_edicao_criacao(self):
        from apps.montagens.models import Programa

        dados = {"finalidade": "Edição/Criação", "orcamento": 7000,
                 "programas": [Programa.objects.first().id]}
        resposta = self.client.post("/api/setups/gerar/", dados, format="json")
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(Questionario.objects.get(id=resposta.data["questionario"]).finalidade, "Edição")
