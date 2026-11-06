import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function Layout() {
  return (
    // min-h-svh + flex-1 no main: mantém o Footer no fim da tela em páginas curtas.
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
