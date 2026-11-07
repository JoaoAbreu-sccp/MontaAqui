import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// Iniciais do nome para a foto padrão: "Maria Souza Lima" vira "ML".
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes.at(-1)[0] : ''
  return (primeira + ultima).toUpperCase()
}

export default function Perfil() {
  const { usuario, estaLogado } = useAuth()

  // O link Perfil só aparece para quem está logado, mas alguém pode abrir /perfil
  // pelo endereço. Nesse caso, mostramos um convite para entrar.
  // O state faz o Login voltar para cá depois de entrar.
  if (!estaLogado) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1>Perfil</h1>
        <p className="mt-2 font-lora text-lg leading-relaxed">Entre na sua conta para ver seu perfil.</p>
        <Link
          to="/login"
          state={{ voltarPara: '/perfil' }}
          className="mt-6 inline-flex min-h-12 items-center rounded-md bg-tinta px-6 font-semibold text-white hover:bg-esmeralda-escuro"
        >
          Entrar
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* O cadastro ainda não tem foto. Se a API passar a enviar usuario.foto (endereço
          da imagem), ela aparece aqui; até lá, mostramos as iniciais do nome. */}
      {usuario.foto ? (
        <img
          src={usuario.foto}
          alt={`Foto de ${usuario.nome}`}
          className="size-28 rounded-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`Foto de ${usuario.nome}`}
          className="flex size-28 items-center justify-center rounded-full bg-esmeralda-escuro text-4xl font-bold text-white"
        >
          {iniciais(usuario.nome)}
        </div>
      )}
      <h1 className="break-words">{usuario.nome}</h1>
    </div>
  )
}
