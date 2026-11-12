// Chamadas de conta: cadastro, login e recuperação de senha.
//
// Contrato proposto (os endpoints ainda não existem no backend):
//   POST /api/auth/cadastro/        { nome, email, password } -> { token, usuario }
//   POST /api/auth/login/           { email, password }       -> { token, usuario }
//   POST /api/auth/recuperar-senha/ { email }                 -> resposta sem conteúdo
//
// usuario = { id, nome, email }. Se o backend usar outros caminhos ou campos,
// basta ajustar este arquivo. O envio e o tratamento de erros ficam em cliente.js.

import { chamarApi } from './cliente'

export function cadastrarUsuario(nome, email, password) {
  return chamarApi('/auth/cadastro/', { metodo: 'POST', dados: { nome, email, password } })
}

export function entrarNaConta(email, password) {
  return chamarApi('/auth/login/', { metodo: 'POST', dados: { email, password } })
}

export function pedirRecuperacaoDeSenha(email) {
  return chamarApi('/auth/recuperar-senha/', { metodo: 'POST', dados: { email } })
}
