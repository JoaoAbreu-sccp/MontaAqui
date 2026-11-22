"""
Padroniza os erros da API no formato { "detail": "mensagem" }.

O Django REST Framework devolve erros de validação como um dicionário por campo,
por exemplo { "email": ["Informe um e-mail válido."] }. O front (cliente.js) só lê
"detail", então aqui pegamos a primeira mensagem e colocamos nesse campo.
"""

from rest_framework.views import exception_handler


def _primeira_mensagem(dados):
    if isinstance(dados, dict):
        for valor in dados.values():
            mensagem = _primeira_mensagem(valor)
            if mensagem:
                return mensagem
    elif isinstance(dados, (list, tuple)):
        for item in dados:
            mensagem = _primeira_mensagem(item)
            if mensagem:
                return mensagem
    elif dados:
        return str(dados)
    return ""


def tratar_erro(excecao, contexto):
    resposta = exception_handler(excecao, contexto)
    if resposta is not None:
        if isinstance(resposta.data, dict) and "detail" in resposta.data:
            mensagem = str(resposta.data["detail"])
        else:
            mensagem = _primeira_mensagem(resposta.data)
        resposta.data = {"detail": mensagem or "Algo deu errado. Confira os dados e tente novamente."}
    return resposta
