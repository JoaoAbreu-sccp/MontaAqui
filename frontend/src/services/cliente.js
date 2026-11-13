// Cliente único para falar com a API do Django.
// Todos os serviços (api.js, requisitos.js, setups.js) usam esta função, para que o
// tratamento de erros e a leitura das respostas fiquem em um lugar só.
//
// As chamadas vão para /api/... e o proxy do Vite repassa ao Django (ver vite.config.js).
// Em caso de erro, a API responde { detail: "mensagem" }.

export const MENSAGEM_SEM_CONEXAO =
  'Não foi possível conectar ao servidor. Tente novamente em instantes.'
const MENSAGEM_ERRO_GERAL = 'Algo deu errado. Confira os dados e tente novamente.'

// metodo: 'GET' (padrão) ou 'POST'. dados: objeto enviado como JSON no POST.
// token: o JWT da pessoa logada (vem do useAuth). Só as rotas que exigem login precisam dele.
export async function chamarApi(caminho, { metodo = 'GET', dados, token } = {}) {
  const cabecalhos = {}
  if (dados) cabecalhos['Content-Type'] = 'application/json'
  if (token) cabecalhos.Authorization = `Bearer ${token}`

  let resposta
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: dados ? JSON.stringify(dados) : undefined,
    })
  } catch {
    // fetch só falha sozinho quando não há conexão com o servidor.
    throw new Error(MENSAGEM_SEM_CONEXAO)
  }

  // Lê o corpo da resposta, se houver. Respostas vazias ou que não são JSON viram {}.
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
    const erro = new Error(corpo.detail || MENSAGEM_ERRO_GERAL)
    // O código (ex.: 401 = login vencido) ajuda a página a decidir o que fazer.
    erro.status = resposta.status
    throw erro
  }
  return corpo
}
