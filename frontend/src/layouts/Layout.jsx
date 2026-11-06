import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import './Layout.css'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
