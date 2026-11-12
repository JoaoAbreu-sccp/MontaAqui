import ConviteLogin from '../components/ConviteLogin'
import useAuth from '../hooks/useAuth'
import iniciais from '../utils/iniciais'

export default function Perfil() {
  const { usuario, estaLogado } = useAuth()

  if (!estaLogado) {
    return <ConviteLogin titulo="Perfil" explicacao="Entre na sua conta para ver seu perfil." />
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
