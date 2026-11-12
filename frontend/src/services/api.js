// Comunicação com a API do Django.
//
// Contrato proposto (os endpoints ainda não existem no backend):
//   POST /api/auth/cadastro/        { nome, email, password } -> { token, usuario }
//   POST /api/auth/login/           { email, password }       -> { token, usuario }
//   POST /api/auth/recuperar-senha/ { email }                 -> resposta sem conteúdo
//
// usuario = { id, nome, email }. Em caso de erro, a API responde { detail: "mensagem" }.
// Se o backend usar outros caminhos ou campos, basta ajustar este arquivo.

const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
const MENSAGEM_ERRO_GERAL = 'Algo deu errado. Confira os dados e tente novamente.'

async function enviar(caminho, dados) {
  let resposta
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
  } catch {
    // fetch só falha sozinho quando não há conexão com o servidor.
    throw new Error(MENSAGEM_SEM_CONEXAO)
  }

  // Lê o corpo da resposta, se houver. Respostas vazias viram um objeto vazio.
  const texto = await resposta.text()
  let corpo
  try {
    corpo = texto ? JSON.parse(texto) : {}
  } catch {
    corpo = {}
  }

  if (!resposta.ok) {
    // O proxy do Vite responde 5xx quando o Django não está rodando.
    if (resposta.status >= 500) throw new Error(MENSAGEM_SEM_CONEXAO)
    throw new Error(corpo.detail || MENSAGEM_ERRO_GERAL)
  }
  return corpo
}

export function cadastrarUsuario(nome, email, password) {
  return enviar('/auth/cadastro/', { nome, email, password })
}

export function entrarNaConta(email, password) {
  return enviar('/auth/login/', { email, password })
}

export function pedirRecuperacaoDeSenha(email) {
  return enviar('/auth/recuperar-senha/', { email })
}
