import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import iniciais from '../utils/iniciais'
import { IconeUsuario, IconeVoltar } from './Icones'
import LogoMarca from './LogoMarca'

// O site funciona sem conta: a conta só serve para salvar setups.
// Por isso a navegação é curta e a parte da conta fica separada, no canto direito.
// somenteLogado: o link só aparece para quem entrou na conta.
const links = [
  { to: '/', label: 'Início', fim: true },
  { to: '/questionario', label: 'Montar meu PC' },
  // Os setups salvos ficam no Perfil, logo abaixo do nome.
  { to: '/perfil', label: 'Meus setups', somenteLogado: true },
]

// Links em formato de pílula; o da página atual ganha fundo verde-claro.
// A altura mínima (min-h-11) deixa os links fáceis de tocar no celular.
function classesDoLink({ isActive }) {
  const base = 'inline-flex min-h-11 items-center rounded-full px-4 text-[0.92rem] font-semibold transition-colors'
  return isActive
    ? `${base} bg-menta-forte text-esmeralda-escuro`
    : `${base} text-tinta-suave hover:bg-menta hover:text-tinta`
}

const classesBotaoConta =
  'inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-[0.92rem] font-semibold transition-colors'

export default function Header() {
  const { usuario, estaLogado, sair } = useAuth()
  const navigate = useNavigate()
  const primeiroNome = usuario?.nome?.split(' ')[0]

  function aoSair() {
    sair()
    navigate('/')
  }

  return (
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
          {links
            .filter((link) => estaLogado || !link.somenteLogado)
            .map(({ to, label, fim }) => (
              <NavLink key={to} to={to} end={fim} className={classesDoLink}>
                {label}
              </NavLink>
            ))}
        </nav>

        {estaLogado ? (
          <div className="flex items-center gap-2">
            {/* Círculo com as iniciais leva ao perfil. O nome some no celular para caber. */}
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center gap-2 rounded-full pr-1 pl-1 font-semibold sm:pr-3 ${
                  isActive ? 'bg-menta-forte' : 'hover:bg-menta'
                }`
              }
            >
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-menta-forte text-sm font-bold text-esmeralda-escuro"
              >
                {iniciais(usuario?.nome)}
              </span>
              <span className="sr-only sm:not-sr-only sm:max-w-32 sm:truncate sm:text-[0.92rem]">
                Olá, {primeiroNome}
              </span>
            </NavLink>
            <button
              type="button"
              onClick={aoSair}
              className={`${classesBotaoConta} border-menta-borda bg-white hover:border-esmeralda hover:bg-menta`}
            >
              <IconeVoltar tamanho={18} />
              Sair
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${classesBotaoConta} ${
                isActive
                  ? 'border-esmeralda bg-menta'
                  : 'border-menta-borda bg-white hover:border-esmeralda hover:bg-menta'
              }`
            }
          >
            <IconeUsuario tamanho={18} />
            Entrar
          </NavLink>
        )}
      </div>
    </header>
  )
}
