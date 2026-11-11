import { Link, NavLink } from 'react-router-dom'
import { IconeUsuario } from './Icones'
import LogoMarca from './LogoMarca'

// O site funciona sem conta: a conta só serve para salvar setups.
// Por isso a navegação é curta e "Entrar" fica separado, no canto direito.
const links = [
  { to: '/', label: 'Início', fim: true },
  { to: '/questionario', label: 'Montar meu PC' },
  { to: '/setups', label: 'Meus setups' },
]

// Links em formato de pílula; o da página atual ganha fundo verde-claro.
// A altura mínima (min-h-11) deixa os links fáceis de tocar no celular.
function classesDoLink({ isActive }) {
  const base = 'inline-flex min-h-11 items-center rounded-full px-4 text-[0.92rem] font-semibold transition-colors'
  return isActive
    ? `${base} bg-menta-forte text-esmeralda-escuro`
    : `${base} text-tinta-suave hover:bg-menta hover:text-tinta`
}

export default function Header() {
  return (
    // sticky + fundo translúcido com desfoque: o menu acompanha a rolagem sem esconder o conteúdo.
    <header className="sticky top-0 z-50 border-b border-linha bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg">
          <LogoMarca tamanho={36} />
          <span className="text-xl font-bold tracking-tight">
            Monta<span className="text-esmeralda-escuro">Aqui</span>
          </span>
        </Link>

        {/* No celular os links somem: o botão principal da Home já leva ao questionário. */}
        <nav aria-label="Navegação principal" className="hidden gap-1 md:flex">
          {links.map(({ to, label, fim }) => (
            <NavLink key={to} to={to} end={fim} className={classesDoLink}>
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-[0.92rem] font-semibold transition-colors ${
              isActive
                ? 'border-esmeralda bg-menta'
                : 'border-menta-borda bg-white hover:border-esmeralda hover:bg-menta'
            }`
          }
        >
          <IconeUsuario tamanho={18} />
          Entrar
        </NavLink>
      </div>
    </header>
  )
}
