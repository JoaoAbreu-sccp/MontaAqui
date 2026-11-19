import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CampoTexto from '../components/CampoTexto'
import FormularioConta from '../components/FormularioConta'
import useAuth from '../hooks/useAuth'

const classesLink = 'font-semibold text-esmeralda-escuro underline underline-offset-4'

// Página aberta pelo link do e-mail de recuperação (RF03):
//   /redefinir-senha?uid=...&token=...
// uid identifica a conta e token prova que o link é verdadeiro. Os dois são
// conferidos pelo Django; aqui só repassamos junto com a senha nova.
export default function RedefinirSenha() {
  const [parametros] = useSearchParams()
  const uid = parametros.get('uid')
  const token = parametros.get('token')

  const { redefinirSenha, usuario } = useAuth()
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [concluido, setConcluido] = useState(false)

  async function aoEnviar(evento) {
    evento.preventDefault()
    const senha = new FormData(evento.currentTarget).get('senha')

    setErro('')
    setEnviando(true)
    try {
      await redefinirSenha(uid, token, senha)
      setConcluido(true)
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setEnviando(false)
    }
  }

  // Endereço aberto sem os dados do link (ex.: digitado à mão ou link cortado).
  if (!uid || !token) {
    return (
      <div className="mx-auto max-w-md" role="status">
        <h1>Link incompleto</h1>
        <p className="mt-2 font-lora text-lg leading-relaxed">
          Abra o link exatamente como chegou no seu e-mail ou peça um novo.
        </p>
        <p className="mt-6 text-sm">
          <Link to="/recuperar-senha" className={classesLink}>
            Pedir um novo link
          </Link>
        </p>
      </div>
    )
  }

  if (concluido) {
    return (
      <div className="mx-auto max-w-md" role="status">
        <h1>Senha alterada!</h1>
        <p className="mt-2 font-lora text-lg leading-relaxed">
          Pronto{usuario?.nome ? `, ${usuario.nome}` : ''}. Você já entrou na sua conta com a senha nova.
        </p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/perfil" className={classesLink}>
            Ir para o meu perfil
          </Link>
          <Link to="/questionario" className={classesLink}>
            Montar meu PC
          </Link>
        </p>
      </div>
    )
  }

  return (
    <FormularioConta
      titulo="Criar nova senha"
      explicacao="Escolha a senha que você vai usar daqui para frente."
      erro={erro}
      enviando={enviando}
      textoBotao="Salvar nova senha"
      textoEnviando="Salvando..."
      aoEnviar={aoEnviar}
      rodape={
        <p>
          O link não funciona mais?{' '}
          <Link to="/recuperar-senha" className={classesLink}>
            Pedir outro
          </Link>
        </p>
      }
    >
      <CampoTexto
        id="senha"
        rotulo="Nova senha"
        type="password"
        autoComplete="new-password"
        minLength={8}
        dica="Use pelo menos 8 caracteres."
        required
      />
    </FormularioConta>
  )
}
