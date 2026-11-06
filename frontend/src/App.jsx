import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/Layout'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'
import Perfil from './pages/Perfil'
import Questionario from './pages/Questionario'
import Setups from './pages/Setups'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'questionario', element: <Questionario /> },
      { path: 'setups', element: <Setups /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
