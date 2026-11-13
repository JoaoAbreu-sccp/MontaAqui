"""Testes da compatibilidade, do motor e da API de setups. Rodar com: python manage.py test"""

from decimal import Decimal

from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APITestCase

from apps.componentes.models import Armazenamento, Cpu, Fonte, Gabinete, Gpu, PlacaMae, Ram

from .compatibilidade import verificar_compatibilidade
from .models import Jogo, Programa
from .motor import LIMITE_ACIMA, gerar_setups


def pecas_compativeis():
    """Um setup compatível montado em memória (sem gravar no banco)."""
    return {
        "cpu": Cpu(marca="AMD", modelo="Ryzen 5 5600", preco=700, socket="AM4", geracao="Ryzen 5000",
                   consumo_watts=65, nucleos=6, pontuacao_desempenho=40),
        "placamae": PlacaMae(marca="ASUS", modelo="A520M", preco=450, socket="AM4", geracao_ddr="DDR4",
                             formato="Micro-ATX", geracao_cpu="Ryzen 3000,Ryzen 5000",
                             velocidade_maxima_ram=4600, interface_armazenamento="SATA,M.2 NVMe"),
        "ram": Ram(marca="Kingston", modelo="16GB", preco=280, capacidade_gb=16, geracao_ddr="DDR4",
                   frequencia_mhz=3200),
        "gpu": Gpu(marca="AMD", modelo="RX 6600", preco=1400, vram=8, comprimento_mm=200,
                   consumo_watts=132, conectores_necessarios="1x 8 pinos", pontuacao_desempenho=30),
        "fonte": Fonte(marca="MSI", modelo="550W", preco=350, capacidade_watts=550, formato="ATX",
                       conectores_pcie="2x 6+2 pinos"),
        "armazenamento": Armazenamento(marca="Kingston", modelo="NV3", preco=220, tipo="SSD NVMe",
                                       unidade_medida="GB", capacidade=500, interface="M.2 NVMe"),
        "gabinete": Gabinete(marca="Montech", modelo="AIR 100", preco=350, formato="Micro-ATX",
                             comprimento_max_gpu=330, formato_fonte="ATX"),
    }


class CompatibilidadeTests(TestCase):
    def test_setup_compativel_nao_tem_problemas(self):
        self.assertEqual(verificar_compatibilidade(pecas_compativeis()), [])

    def assertUmProblema(self, pecas, trecho):
        problemas = verificar_compatibilidade(pecas)
        self.assertEqual(len(problemas), 1, problemas)
        self.assertIn(trecho, problemas[0])

    def test_socket_diferente(self):
        pecas = pecas_compativeis()
        pecas["placamae"].socket = "AM5"
        self.assertUmProblema(pecas, "encaixe")

    def test_geracao_de_cpu_nao_reconhecida(self):
        pecas = pecas_compativeis()
        pecas["placamae"].geracao_cpu = "Ryzen 3000"
        self.assertUmProblema(pecas, "Ryzen 5000")

    def test_memoria_de_outra_geracao(self):
        pecas = pecas_compativeis()
        pecas["ram"].geracao_ddr = "DDR5"
        self.assertUmProblema(pecas, "DDR5")

    def test_armazenamento_sem_entrada(self):
        pecas = pecas_compativeis()
        pecas["placamae"].interface_armazenamento = "SATA"
        self.assertUmProblema(pecas, "M.2 NVMe")

    def test_fonte_fraca(self):
        pecas = pecas_compativeis()
        pecas["fonte"].capacidade_watts = 300  # consumo 65 + 132 + 100 = 297 W, pede 356 W
        self.assertUmProblema(pecas, "356 W")

    def test_gabinete_atx_aceita_placa_menor(self):
        pecas = pecas_compativeis()
        pecas["gabinete"].formato = "ATX"
        self.assertEqual(verificar_compatibilidade(pecas), [])

    def test_placa_maior_que_o_gabinete(self):
        pecas = pecas_compativeis()
        pecas["placamae"].formato = "ATX"
        self.assertUmProblema(pecas, "não cabe no gabinete")

    def test_formato_da_fonte(self):
        pecas = pecas_compativeis()
        pecas["fonte"].formato = "SFX"
        self.assertUmProblema(pecas, "SFX")

    def test_gpu_comprida_demais(self):
        pecas = pecas_compativeis()
        pecas["gpu"].comprimento_mm = 340
        self.assertUmProblema(pecas, "340 mm")


class MotorTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("carregar_pecas", verbosity=0)
        call_command("carregar_requisitos", verbosity=0)

    def gerar(self, **extras):
        dados = {"finalidade": "Trabalho", "orcamento": Decimal("5000"), "prioridade": "Custo-benefício",
                 "preferencia_cpu": "Sem preferência", **extras}
        return gerar_setups(**dados)

    def test_tres_niveis_compativeis_e_nas_faixas(self):
        jogos = [Jogo.objects.get(nome="Cyberpunk 2077")]
        resultado = self.gerar(finalidade="Jogos", orcamento=Decimal("8000"), jogos=jogos,
                               resolucao="1440p", fps=60)
        setups = {s["categoria"]: s for s in resultado["setups"]}
        self.assertEqual(list(setups), ["Abaixo do Orçamento", "Equilíbrio", "Acima do Orçamento"])
        for setup in setups.values():
            self.assertEqual(verificar_compatibilidade(setup["pecas"]), [])
        self.assertLessEqual(setups["Equilíbrio"]["preco"], 8000)
        self.assertLess(setups["Abaixo do Orçamento"]["preco"], setups["Equilíbrio"]["preco"])
        self.assertGreater(setups["Acima do Orçamento"]["preco"], 8000)
        self.assertLessEqual(setups["Acima do Orçamento"]["preco"], 8000 * LIMITE_ACIMA)

    def test_respeita_minimo_do_jogo(self):
        jogo = Jogo.objects.get(nome="Cyberpunk 2077")
        for setup in self.gerar(finalidade="Jogos", jogos=[jogo], resolucao="1080p", fps=60)["setups"]:
            self.assertGreaterEqual(setup["pecas"]["cpu"].pontuacao_desempenho, jogo.desempenho_minimo)
            self.assertGreaterEqual(setup["pecas"]["gpu"].vram, jogo.vram_minima)

    def test_preferencia_de_processador(self):
        for setup in self.gerar(preferencia_cpu="Intel")["setups"]:
            self.assertEqual(setup["pecas"]["cpu"].marca, "Intel")

    def test_orcamento_baixo_mostra_o_mais_barato(self):
        resultado = self.gerar(orcamento=Decimal("1500"))
        self.assertEqual(len(resultado["setups"]), 1)
        self.assertEqual(resultado["setups"][0]["categoria"], "Acima do Orçamento")
        self.assertEqual(resultado["setups"][0]["preco"], resultado["preco_minimo"])

    def test_edicao_usa_programas(self):
        programas = list(Programa.objects.all()[:2])
        self.assertTrue(self.gerar(finalidade="Edição", programas=programas)["setups"])


class ApiSetupsTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("carregar_pecas", verbosity=0)
        call_command("carregar_requisitos", verbosity=0)

    def gerar(self):
        dados = {"finalidade": "Jogos", "orcamento": 6000, "preferencia_cpu": "Sem preferência",
                 "prioridade_desempenho": "Custo-benefício", "resolucao_alvo": "1080p", "fps_alvo": 144,
                 "jogos": [Jogo.objects.get(nome="Valorant").id], "programas": []}
        return self.client.post("/api/setups/gerar/", dados, format="json")

    def entrar(self, email):
        resposta = self.client.post("/api/auth/cadastro/",
                                    {"nome": "Teste", "email": email, "password": "pc-novo-2026"},
                                    format="json")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {resposta.data['token']}")

    def test_listas_publicas(self):
        self.assertEqual(len(self.client.get("/api/jogos/").data), Jogo.objects.count())
        self.assertEqual(len(self.client.get("/api/programas/").data), Programa.objects.count())

    def test_visitante_gera_mas_nao_salva(self):
        resposta = self.gerar()
        self.assertEqual(resposta.status_code, 200)
        self.assertTrue(resposta.data["setups"])
        setup = resposta.data["setups"][0]
        self.assertEqual(len(setup["pecas"]), 7)
        self.assertEqual(len(setup["pecas"][0]["links"]), 3)

        salvar = {"questionario": resposta.data["questionario"], "categoria": setup["categoria"], **setup["ids"]}
        sem_login = self.client.post("/api/setups/", salvar, format="json")
        self.assertEqual(sem_login.status_code, 401)
        self.assertIn("detail", sem_login.data)

    def test_usuario_logado_salva_e_lista(self):
        self.entrar("joao@exemplo.com")
        resposta = self.gerar()
        setup = resposta.data["setups"][0]

        salvar = {"questionario": resposta.data["questionario"], "categoria": setup["categoria"], **setup["ids"]}
        salvo = self.client.post("/api/setups/", salvar, format="json")
        self.assertEqual(salvo.status_code, 201)
        self.assertEqual(salvo.data["preco"], setup["preco"])

        lista = self.client.get("/api/setups/")
        self.assertEqual([s["id"] for s in lista.data], [salvo.data["id"]])

    def test_salvar_setup_incompativel_e_recusado(self):
        self.entrar("ana@exemplo.com")
        resposta = self.gerar()
        setup = resposta.data["setups"][0]
        ddr_certa = Ram.objects.get(id=setup["ids"]["ram"]).geracao_ddr
        ram_errada = Ram.objects.exclude(geracao_ddr=ddr_certa).first()

        dados = {"questionario": resposta.data["questionario"], "categoria": setup["categoria"],
                 **setup["ids"], "ram": ram_errada.id}
        recusado = self.client.post("/api/setups/", dados, format="json")
        self.assertEqual(recusado.status_code, 400)
        self.assertIn("memória", recusado.data["detail"])

    def test_jogos_sem_jogo_marcado(self):
        resposta = self.client.post("/api/setups/gerar/", {"finalidade": "Jogos", "orcamento": 5000},
                                    format="json")
        self.assertEqual(resposta.status_code, 400)
        self.assertEqual(resposta.data, {"detail": "Marque pelo menos um jogo."})
