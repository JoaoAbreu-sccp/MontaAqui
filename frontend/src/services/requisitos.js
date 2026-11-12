// Listas de jogos e programas usadas no questionário, vindas da API do Django.
//
// Contrato proposto (os endpoints ainda não existem no backend):
//   GET /api/jogos/      -> [{ id, nome }]
//   GET /api/programas/  -> [{ id, nome, categoria }]
//
// Os dados saem das tabelas jogo e programa, preenchidas pelo comando
// carregar_requisitos (branch banco-de-dados). Se o backend usar outros
// caminhos ou campos, basta ajustar este arquivo.

const MENSAGEM_SEM_CONEXAO =
  'Não foi possível carregar a lista. Confira se o servidor está rodando e tente de novo.'

async function buscar(caminho) {
  let resposta
  try {
    resposta = await fetch(`/api${caminho}`)
  } catch {
    // fetch só falha sozinho quando não há conexão com o servidor.
    throw new Error(MENSAGEM_SEM_CONEXAO)
  }

  // O proxy do Vite responde 5xx quando o Django não está rodando,
  // e o Django responde 404 enquanto o endpoint não existir.
  if (!resposta.ok) throw new Error(MENSAGEM_SEM_CONEXAO)

  let corpo
  try {
    corpo = await resposta.json()
  } catch {
    throw new Error(MENSAGEM_SEM_CONEXAO)
  }

  // Se o Django REST Framework paginar a resposta, a lista vem dentro de "results".
  return Array.isArray(corpo) ? corpo : (corpo.results ?? [])
}

export function buscarJogos() {
  return buscar('/jogos/')
}

export function buscarProgramas() {
  return buscar('/programas/')
}
