import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/questionario', label: 'Questionário' },
  { to: '/setups', label: 'Setups' },
  { to: '/perfil', label: 'Perfil' },
  { to: '/login', label: 'Login' },
  { to: '/cadastro', label: 'Cadastro' },
]

// O NavLink informa se a rota está ativa, e usamos isso para destacar a página atual.
// A altura mínima (min-h-11) deixa os links fáceis de tocar no celular.
function classesDoLink({ isActive }) {
  const base = 'inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-menta'
  return isActive ? `${base} font-semibold text-esmeralda-escuro` : base
}

export default function Header() {
  return (
    <header className="border-b border-menta-borda bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 sm:px-6">
        <Link to="/" className="text-2xl font-bold">
          Monta<span className="text-esmeralda-escuro">Aqui</span>
        </Link>
        <nav aria-label="Navegação principal" className="-mx-3 flex flex-wrap sm:mx-0">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={classesDoLink}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
