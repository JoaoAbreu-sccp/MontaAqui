import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

// Atalho para ler a sessão: const { usuario, estaLogado, entrar, sair } = useAuth()
export default function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro do AuthProvider (ver App.jsx).')
  }
  return contexto
}
