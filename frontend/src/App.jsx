import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/Layout'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'
import Perfil from './pages/Perfil'
import Questionario from './pages/Questionario'
import Resultado from './pages/Resultado'
import Setups from './pages/Setups'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'resultado', element: <Resultado /> },
      { path: 'setups', element: <Setups /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
  // O questionário fica fora do Layout: ocupa a tela inteira, sem Header e Footer,
  // para a pessoa focar só nas perguntas. Ele tem seus próprios botões de voltar.
  { path: '/questionario', element: <Questionario /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
