"""
Formato que a IA é obrigada a devolver (saída estruturada).

O Gemini recebe este esquema junto com o pedido e responde um JSON exatamente
nesse formato. O pydantic confere o JSON: se vier faltando campo ou com tipo
errado, a resposta é descartada e o motor em Python assume.

A IA devolve só IDs de peças do catálogo, nunca nomes ou preços: assim ela não
consegue inventar componentes. Nomes, preços e links saem sempre do banco.
"""

from typing import Literal

from pydantic import BaseModel, Field

Categoria = Literal["Abaixo do Orçamento", "Equilíbrio", "Acima do Orçamento"]


class SetupEscolhido(BaseModel):
    categoria: Categoria
    id_cpu: int
    id_placamae: int
    id_ram: int
    id_gpu: int
    id_armazenamento: int
    id_fonte: int
    id_gabinete: int
    explicacao: str = Field(
        description=(
            "Até 3 frases curtas, em português do Brasil, para quem não entende de hardware, "
            "dizendo por que esse conjunto atende ao pedido. Sem preços e sem citar peças "
            "que não estão neste setup."
        )
    )


class RespostaAssistente(BaseModel):
    setups: list[SetupEscolhido]
