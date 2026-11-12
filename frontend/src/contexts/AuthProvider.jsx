import { useState } from 'react'
import { cadastrarUsuario, entrarNaConta } from '../services/api'
import { AuthContext } from './AuthContext'

// Chaves usadas no localStorage. O prefixo evita conflito com outros sites em localhost.
const CHAVE_TOKEN = 'montaaqui:token'
const CHAVE_USUARIO = 'montaaqui:usuario'

// Lê a sessão salva. Se o navegador bloquear o localStorage ou o dado estiver
// corrompido, a pessoa apenas começa deslogada, sem quebrar o site.
function lerSessaoSalva() {
  try {
    const token = localStorage.getItem(CHAVE_TOKEN)
    const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO))
    if (token && usuario) return { token, usuario }
  } catch {
    // Ignora e segue sem sessão.
  }
  return { token: null, usuario: null }
}

function salvarSessao(token, usuario) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token)
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
  } catch {
    // Sem localStorage, a sessão dura até a página ser recarregada.
  }
}

function apagarSessao() {
  try {
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_USUARIO)
  } catch {
    // Nada a fazer.
  }
}

// Envolve o site inteiro (ver App.jsx). Qualquer componente lê a sessão com useAuth().
export default function AuthProvider({ children }) {
  // A função passada ao useState só roda na primeira renderização.
  const [sessao, setSessao] = useState(lerSessaoSalva)

  function iniciarSessao({ token, usuario }) {
    salvarSessao(token, usuario)
    setSessao({ token, usuario })
  }

  async function entrar(email, password) {
    iniciarSessao(await entrarNaConta(email, password))
  }

  // Depois do cadastro a pessoa já fica logada, sem precisar entrar de novo.
  async function cadastrar(nome, email, password) {
    iniciarSessao(await cadastrarUsuario(nome, email, password))
  }

  function sair() {
    apagarSessao()
    setSessao({ token: null, usuario: null })
  }

  const valor = {
    usuario: sessao.usuario,
    token: sessao.token,
    estaLogado: Boolean(sessao.token),
    entrar,
    cadastrar,
    sair,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
