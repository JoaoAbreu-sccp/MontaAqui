import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthProvider'
import Layout from './layouts/Layout'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'
import Perfil from './pages/Perfil'
import Questionario from './pages/Questionario'
import RecuperarSenha from './pages/RecuperarSenha'
import Resultado from './pages/Resultado'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'recuperar-senha', element: <RecuperarSenha /> },
      { path: 'resultado', element: <Resultado /> },
      // Os setups salvos agora ficam no Perfil; o endereço antigo leva para lá.
      { path: 'setups', element: <Navigate to="/perfil" replace /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
  // O questionário fica fora do Layout: ocupa a tela inteira, sem Header e Footer,
  // para a pessoa focar só nas perguntas. Ele tem seus próprios botões de voltar.
  { path: '/questionario', element: <Questionario /> },
])

export default function App() {
  // O AuthProvider fica por fora das rotas para a sessão valer em todas as páginas.
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
