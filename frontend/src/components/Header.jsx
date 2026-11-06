import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/questionario', label: 'Questionário' },
  { to: '/setups', label: 'Setups' },
  { to: '/perfil', label: 'Perfil' },
  { to: '/login', label: 'Login' },
  { to: '/cadastro', label: 'Cadastro' },
]

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        MontaAqui
      </Link>
      <nav className="site-nav" aria-label="Navegação principal">
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
