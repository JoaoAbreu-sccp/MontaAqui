import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const links = [
  { to: '/questionario', label: 'Questionário' },
  { to: '/setups', label: 'Setups' },
  { to: '/perfil', label: 'Perfil' },
]

// O NavLink informa se a rota está ativa, e usamos isso para destacar a página atual.
// A altura mínima (min-h-11) deixa os links fáceis de tocar no celular.
function classesDoLink({ isActive }) {
  const base = 'inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-menta'
  return isActive ? `${base} font-semibold text-esmeralda-escuro` : base
}

// Entrar e Criar conta são ações da conta, não páginas de navegação,
// por isso viram botões e ficam separados dos outros links.
const botaoBase =
  'inline-flex min-h-11 items-center rounded-md border-2 border-tinta px-3 text-sm font-semibold whitespace-nowrap sm:px-4'

function classesEntrar({ isActive }) {
  return `${botaoBase} ${isActive ? 'bg-menta' : 'hover:bg-menta'}`
}

// Verde-escuro, e não o verde da marca: o botão principal de cada página continua sendo o destaque.
function classesCriarConta({ isActive }) {
  return `${botaoBase} bg-tinta text-white ${isActive ? 'underline underline-offset-4' : 'hover:bg-esmeralda-escuro hover:border-esmeralda-escuro'}`
}

export default function Header() {
  const { usuario, estaLogado, sair } = useAuth()
  const navigate = useNavigate()
  const primeiroNome = usuario?.nome?.split(' ')[0]

  function aoSair() {
    sair()
    navigate('/')
  }

  return (
    <header className="border-b border-menta-borda bg-white">
      {/* No celular: logo e botões na primeira linha, links na segunda.
          A partir de md (768px), tudo em uma linha só. A propriedade order troca a posição. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="mr-auto text-xl font-bold sm:text-2xl">
          Monta<span className="text-esmeralda-escuro">Aqui</span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="order-last -mx-3 flex w-full md:order-none md:mx-0 md:w-auto"
        >
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={classesDoLink}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* A borda à esquerda separa visualmente a conta da navegação no desktop. */}
        <div className="flex items-center gap-2 md:border-l md:border-menta-borda md:pl-4">
          {estaLogado ? (
            <>
              <span className="max-w-32 truncate text-sm sm:max-w-48">Olá, {primeiroNome}</span>
              <button type="button" onClick={aoSair} className={`${botaoBase} hover:bg-menta`}>
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={classesEntrar}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className={classesCriarConta}>
                Criar conta
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
