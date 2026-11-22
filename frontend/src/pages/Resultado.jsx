import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CartaoSetup from '../components/CartaoSetup'
import { IconeBrilho, IconeCheck, IconeInfo, IconeRefazer, IconeSeta } from '../components/Icones'
import ModalLogin from '../components/ModalLogin'
import useAuth from '../hooks/useAuth'
import { salvarSetup } from '../services/setups'
import formatarReais from '../utils/formatarReais'

const classesBotaoSecundario =
  'inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border-[1.5px] border-menta-borda bg-white px-5 font-semibold hover:border-esmeralda hover:bg-menta'

// O resultado chega pelo state da navegação, que se perde quando a pessoa sai da página
// (por exemplo, para entrar na conta e salvar um setup). Por isso guardamos uma cópia
// no sessionStorage: ao voltar do login, o resultado continua aqui.
const CHAVE_RESULTADO = 'montaaqui:ultimoResultado'

function lembrarResultado(state) {
  try {
    if (state?.gerado) {
      sessionStorage.setItem(CHAVE_RESULTADO, JSON.stringify(state))
      return state
    }
    return JSON.parse(sessionStorage.getItem(CHAVE_RESULTADO))
  } catch {
    return state ?? null
  }
}

// Mostra os até 3 setups gerados pela API para as respostas do questionário.
export default function Resultado() {
  const { state } = useLocation()
  const [resultado] = useState(() => lembrarResultado(state))

  // Quem abre /resultado direto, sem responder o questionário, não tem respostas.
  if (!resultado?.gerado) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-10 text-center motion-safe:animate-subir">
        <h1>Nenhum questionário respondido</h1>
        <p className="font-lora text-lg leading-relaxed text-tinta-suave">
          Responda a algumas perguntas para ver as montagens recomendadas.
        </p>
        <Link
          to="/questionario"
          className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-full bg-esmeralda px-7 text-[1.2rem] font-bold text-white shadow-marca hover:bg-esmeralda-escuro"
        >
          Começar questionário <IconeSeta tamanho={20} />
        </Link>
      </div>
    )
  }

  const { questionario, nomesDosJogos, nomesDosProgramas, gerado } = resultado
  const { setups, preco_minimo: precoMinimo } = gerado
  const orcamentoNaoCobre = precoMinimo !== null && precoMinimo > questionario.orcamento

  // Cada linha do resumo: rótulo e valor. Linhas sem valor não aparecem.
  const linhas = [
    ['Uso', questionario.finalidade],
    ['Jogos', nomesDosJogos.join(', ')],
    ['Resolução', questionario.resolucao_alvo],
    ['FPS desejado', questionario.fps_alvo && `${questionario.fps_alvo} FPS`],
    ['Programas', nomesDosProgramas.join(', ')],
    ['Orçamento', formatarReais(questionario.orcamento)],
    ['Processador', questionario.preferencia_cpu],
    ['Prioridade', questionario.prioridade_desempenho],
  ].filter(([, valor]) => valor)

  return (
    <div className="flex flex-col gap-8 motion-safe:animate-subir">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          {/* Selo com o resumo do pedido, como no protótipo. */}
          <p className="inline-flex items-center gap-2 rounded-full border border-menta-borda bg-white px-3.5 py-1.5 text-sm font-semibold text-esmeralda-escuro">
            <IconeBrilho tamanho={16} />
            {questionario.finalidade} · até {formatarReais(questionario.orcamento)}
          </p>
          <h1 className="mt-4 text-3xl leading-tight tracking-tight sm:text-4xl">Suas montagens</h1>
          <p className="mt-2 max-w-2xl font-lora text-lg leading-relaxed text-tinta-suave">
            Todas as peças de cada opção foram conferidas: elas se encaixam e funcionam juntas.
          </p>
        </div>
        <Link to="/questionario" className={classesBotaoSecundario}>
          <IconeRefazer tamanho={17} />
          Refazer
        </Link>
      </div>

      {(orcamentoNaoCobre || setups.length === 0) && (
        <Aviso>
          {setups.length === 0
            ? 'Não encontramos peças no catálogo que atendam a esse pedido. Tente outro processador ou um orçamento maior.'
            : `Com ${formatarReais(questionario.orcamento)} ainda não dá para montar um PC completo que atenda ao que você pediu. A opção abaixo é a mais barata que encontramos.`}
        </Aviso>
      )}

      {setups.length > 0 && (
        <div className="grid items-start gap-5 lg:grid-cols-3">
          {setups.map((setup) => (
            <CartaoSetup
              key={setup.categoria}
              setup={setup}
              destaque={setup.categoria === 'Equilíbrio'}
              acao={<BotaoSalvar idDoQuestionario={gerado.questionario} setup={setup} />}
            />
          ))}
        </div>
      )}

      <section aria-labelledby="titulo-respostas" className="rounded-[18px] border border-linha bg-white p-6 shadow-suave sm:p-8">
        <h2 id="titulo-respostas" className="text-xl">
          Suas respostas
        </h2>
        <dl className="mt-5 divide-y divide-linha">
          {linhas.map(([rotulo, valor]) => (
            <div key={rotulo} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-tinta-suave">{rotulo}</dt>
              <dd className="font-semibold">{valor}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

function Aviso({ children }) {
  return (
    <div role="status" className="flex gap-4 rounded-[18px] border border-menta-borda bg-white p-5 sm:p-6">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-menta-forte text-esmeralda-escuro"
      >
        <IconeInfo tamanho={20} />
      </span>
      <p className="self-center font-lora leading-relaxed">{children}</p>
    </div>
  )
}

// Salvar exige conta (RF08). Para visitante, o botão abre uma janela convidando a entrar
// ou criar conta; depois do login, a pessoa volta para este mesmo resultado.
function BotaoSalvar({ idDoQuestionario, setup }) {
  const { estaLogado, token, sair } = useAuth()
  const [situacao, setSituacao] = useState('parado') // parado | salvando | salvo
  const [erro, setErro] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  if (situacao === 'salvo') {
    return (
      <p role="status" className="flex min-h-11 items-center justify-center gap-2 font-semibold text-esmeralda-escuro">
        <IconeCheck tamanho={18} />
        Salvo no <Link to="/perfil" className="underline underline-offset-4">seu perfil</Link>
      </p>
    )
  }

  async function salvar() {
    if (!estaLogado) {
      setModalAberto(true)
      return
    }
    setSituacao('salvando')
    setErro('')
    try {
      await salvarSetup(idDoQuestionario, setup, token)
      setSituacao('salvo')
    } catch (falha) {
      // 401: o login venceu (o token dura 1 dia). Sai da conta para a pessoa entrar de novo.
      if (falha.status === 401) sair()
      setErro(falha.status === 401 ? 'Sua sessão expirou. Entre de novo para salvar.' : falha.message)
      setSituacao('parado')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={salvar}
        disabled={situacao === 'salvando'}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-esmeralda px-5 font-bold text-white hover:bg-esmeralda-escuro disabled:opacity-60"
      >
        {situacao === 'salvando' ? 'Salvando...' : 'Salvar setup'}
      </button>
      {erro && (
        <p role="alert" className="text-sm font-semibold">
          {erro}
        </p>
      )}
      <ModalLogin
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        voltarPara="/resultado"
        titulo="Entre para salvar este setup"
        explicacao="Com uma conta grátis, seus setups ficam guardados no seu perfil, com os links das lojas."
      />
    </div>
  )
}
