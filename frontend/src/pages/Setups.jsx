import { Link } from 'react-router-dom'
import ConviteLogin from '../components/ConviteLogin'
import { IconeSeta } from '../components/Icones'
import useAuth from '../hooks/useAuth'

// Histórico de setups salvos (RF08). Só quem tem conta salva setups.
export default function Setups() {
  const { estaLogado } = useAuth()

  if (!estaLogado) {
    return (
      <ConviteLogin
        titulo="Meus setups"
        explicacao="Entre na sua conta para ver os setups que você salvou. Para receber recomendações, não precisa de conta."
      />
    )
  }

  // Por enquanto a lista está sempre vazia: salvar setups depende da API.
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-10 text-center">
      <h1>Meus setups</h1>
      <p className="font-lora text-lg leading-relaxed text-tinta-suave">
        Você ainda não salvou nenhum setup. Responda ao questionário e salve as montagens de que gostar.
      </p>
      <Link
        to="/questionario"
        className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-full bg-esmeralda px-7 text-[1.1rem] font-bold text-white shadow-marca hover:bg-esmeralda-escuro"
      >
        Montar meu PC <IconeSeta tamanho={20} />
      </Link>
    </div>
  )
}
