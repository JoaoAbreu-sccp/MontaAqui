// Listas de jogos e programas usadas no questionário, vindas da API do Django.
//
// Contrato proposto (os endpoints ainda não existem no backend):
//   GET /api/jogos/      -> [{ id, nome }]
//   GET /api/programas/  -> [{ id, nome, categoria }]
//
// Os dados saem das tabelas jogo e programa, preenchidas pelo comando
// carregar_requisitos. Se o backend usar outros caminhos ou campos, basta
// ajustar este arquivo. O envio e o tratamento de erros ficam em cliente.js.

import { chamarApi } from './cliente'

const MENSAGEM_LISTA_INDISPONIVEL =
  'Não foi possível carregar a lista. Confira se o servidor está rodando e tente de novo.'

async function buscarLista(caminho) {
  let corpo
  try {
    corpo = await chamarApi(caminho)
  } catch {
    // Qualquer falha (sem servidor ou endpoint inexistente) vira a mesma mensagem,
    // que fica na própria etapa do questionário com o botão "Tentar de novo".
    throw new Error(MENSAGEM_LISTA_INDISPONIVEL)
  }

  // Se o Django REST Framework paginar a resposta, a lista vem dentro de "results".
  return Array.isArray(corpo) ? corpo : (corpo.results ?? [])
}

export function buscarJogos() {
  return buscarLista('/jogos/')
}

export function buscarProgramas() {
  return buscarLista('/programas/')
}
