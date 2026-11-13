// Chamadas de conta: cadastro, login e recuperação de senha.
//
// Rotas do backend (backend/apps/usuarios/views.py):
//   POST /api/auth/cadastro/        { nome, email, password } -> { token, usuario }
//   POST /api/auth/login/           { email, password }       -> { token, usuario }
//   POST /api/auth/recuperar-senha/ { email }                 -> ainda não existe (RF03 é opcional)
//
// usuario = { id, nome, email }. O token é um JWT válido por 1 dia. O envio e o tratamento de erros ficam em cliente.js.

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
