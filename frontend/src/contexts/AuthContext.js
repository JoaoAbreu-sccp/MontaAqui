import { createContext } from 'react'

// O contexto fica em um arquivo separado do AuthProvider para o recarregamento
// automático do Vite funcionar (ele exige arquivos que exportem só componentes).
export const AuthContext = createContext(null)
