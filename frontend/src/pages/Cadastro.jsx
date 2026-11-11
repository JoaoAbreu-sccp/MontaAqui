import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CampoTexto from '../components/CampoTexto'
import FormularioConta from '../components/FormularioConta'
import useAuth from '../hooks/useAuth'

const classesLink = 'font-semibold text-esmeralda-escuro underline underline-offset-4'

export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento) {
    // Impede o navegador de recarregar a página ao enviar o formulário.
    evento.preventDefault()
    // FormData lê os campos pelo atributo name, sem precisar de um useState para cada um.
    const dados = new FormData(evento.currentTarget)

    setErro('')
    setEnviando(true)
    try {
      await cadastrar(dados.get('nome').trim(), dados.get('email').trim(), dados.get('senha'))
      // Volta para a página de onde a pessoa veio, se houver; senão, para a Home.
      navigate(location.state?.voltarPara ?? '/', { replace: true })
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <FormularioConta
      titulo="Criar conta"
      explicacao="Com uma conta, você salva os setups recomendados para ver depois. Para receber recomendações, não precisa de conta."
      erro={erro}
      enviando={enviando}
      textoBotao="Criar conta"
      textoEnviando="Criando conta..."
      aoEnviar={aoEnviar}
      rodape={
        <p>
          Já tem uma conta?{' '}
          <Link to="/login" state={location.state} className={classesLink}>
            Entrar
          </Link>
        </p>
      }
    >
      <CampoTexto id="nome" rotulo="Nome" type="text" autoComplete="name" maxLength={150} required />
      <CampoTexto id="email" rotulo="E-mail" type="email" autoComplete="email" required />
      <CampoTexto
        id="senha"
        rotulo="Senha"
        type="password"
        autoComplete="new-password"
        minLength={8}
        dica="Use pelo menos 8 caracteres."
        required
      />
    </FormularioConta>
  )
}
