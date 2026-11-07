import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthProvider'
import Layout from './layouts/Layout'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'
import Perfil from './pages/Perfil'
import Questionario from './pages/Questionario'
import RecuperarSenha from './pages/RecuperarSenha'
import Setups from './pages/Setups'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'recuperar-senha', element: <RecuperarSenha /> },
      { path: 'questionario', element: <Questionario /> },
      { path: 'setups', element: <Setups /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
])

export default function App() {
  // O AuthProvider fica por fora das rotas para a sessão valer em todas as páginas.
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
