import { Link, useLocation } from 'react-router-dom'
import { IconeUsuario } from './Icones'

// Mostrado nas páginas que exigem conta (Perfil, Meus setups) quando alguém
// abre o endereço sem estar logado. Os links dessas páginas só aparecem
// no cabeçalho para quem entrou, mas o endereço pode ser digitado direto.
// O state faz o Login voltar para a página atual depois de entrar.
export default function ConviteLogin({ titulo, explicacao }) {
  const { pathname } = useLocation()

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-10 text-center">
      <h1>{titulo}</h1>
      <p className="font-lora text-lg leading-relaxed text-tinta-suave">{explicacao}</p>
      <Link
        to="/login"
        state={{ voltarPara: pathname }}
        className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-full bg-esmeralda px-7 text-[1.1rem] font-bold text-white shadow-marca hover:bg-esmeralda-escuro"
      >
        <IconeUsuario tamanho={20} />
        Entrar
      </Link>
      <p className="text-sm text-tinta-suave">
        Ainda não tem conta?{' '}
        <Link
          to="/cadastro"
          state={{ voltarPara: pathname }}
          className="font-semibold text-esmeralda-escuro underline underline-offset-4"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
