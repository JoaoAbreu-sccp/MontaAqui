import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CampoTexto from '../components/CampoTexto'
import FormularioConta from '../components/FormularioConta'
import useAuth from '../hooks/useAuth'

const classesLink = 'font-semibold text-esmeralda-escuro underline underline-offset-4'

export default function Login() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)

    setErro('')
    setEnviando(true)
    try {
      await entrar(dados.get('email').trim(), dados.get('senha'))
      navigate(location.state?.voltarPara ?? '/', { replace: true })
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <FormularioConta
      titulo="Entrar"
      explicacao="Entre para salvar setups e ver os que você já salvou. Para receber recomendações, não precisa de conta."
      erro={erro}
      enviando={enviando}
      textoBotao="Entrar"
      textoEnviando="Entrando..."
      aoEnviar={aoEnviar}
      rodape={
        <>
          <p>
            <Link to="/recuperar-senha" className={classesLink}>
              Esqueci minha senha
            </Link>
          </p>
          <p>
            Ainda não tem conta?{' '}
            <Link to="/cadastro" state={location.state} className={classesLink}>
              Criar conta
            </Link>
          </p>
        </>
      }
    >
      <CampoTexto id="email" rotulo="E-mail" type="email" autoComplete="email" required />
      <CampoTexto id="senha" rotulo="Senha" type="password" autoComplete="current-password" required />
    </FormularioConta>
  )
}
