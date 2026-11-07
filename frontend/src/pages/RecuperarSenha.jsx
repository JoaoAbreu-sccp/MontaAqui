import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampoTexto from '../components/CampoTexto'
import FormularioConta from '../components/FormularioConta'
import { pedirRecuperacaoDeSenha } from '../services/api'

const classesLink = 'font-semibold text-esmeralda-escuro underline underline-offset-4'

export default function RecuperarSenha() {
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState('')

  async function aoEnviar(evento) {
    evento.preventDefault()
    const email = new FormData(evento.currentTarget).get('email').trim()

    setErro('')
    setEnviando(true)
    try {
      await pedirRecuperacaoDeSenha(email)
      setEmailEnviado(email)
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setEnviando(false)
    }
  }

  // A mensagem não confirma se o e-mail tem conta, para ninguém descobrir
  // quais e-mails estão cadastrados no site.
  if (emailEnviado) {
    return (
      <div className="mx-auto max-w-md" role="status">
        <h1>Confira seu e-mail</h1>
        <p className="mt-2 font-lora text-lg leading-relaxed">
          Se existir uma conta com o e-mail {emailEnviado}, você vai receber um link para criar uma
          nova senha. Ele pode levar alguns minutos para chegar.
        </p>
        <p className="mt-6 text-sm">
          <Link to="/login" className={classesLink}>
            Voltar para Entrar
          </Link>
        </p>
      </div>
    )
  }

  return (
    <FormularioConta
      titulo="Recuperar senha"
      explicacao="Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha."
      erro={erro}
      enviando={enviando}
      textoBotao="Enviar link"
      textoEnviando="Enviando..."
      aoEnviar={aoEnviar}
      rodape={
        <p>
          Lembrou a senha?{' '}
          <Link to="/login" className={classesLink}>
            Entrar
          </Link>
        </p>
      }
    >
      <CampoTexto id="email" rotulo="E-mail" type="email" autoComplete="email" required />
    </FormularioConta>
  )
}
