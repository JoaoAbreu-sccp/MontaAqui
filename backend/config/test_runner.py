"""
Executor de testes do MontaAqui ("python manage.py test").

Durante os testes, a chave do Gemini é apagada: assim nenhum teste chama a IA de
verdade (o que gastaria a cota, dependeria da internet e deixaria os testes lentos).
Os testes da IA (apps/assistente/tests.py) usam uma chave falsa e simulam a resposta.
"""

from django.test.runner import DiscoverRunner
from django.test.utils import override_settings


class ExecutorSemIA(DiscoverRunner):
    def setup_test_environment(self, **kwargs):
        super().setup_test_environment(**kwargs)
        # Sem cache também: cada teste precisa ver a sua própria resposta simulada.
        self._sem_ia = override_settings(GEMINI_API_KEY="", GEMINI_CACHE_SEGUNDOS=0)
        self._sem_ia.enable()

    def teardown_test_environment(self, **kwargs):
        self._sem_ia.disable()
        super().teardown_test_environment(**kwargs)
