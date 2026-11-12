import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconeBrilho, IconeSeta, IconeVoltar } from '../components/Icones'
import LogoMarca from '../components/LogoMarca'
import EtapaFinalidade from '../components/questionario/EtapaFinalidade'
import EtapaJogos from '../components/questionario/EtapaJogos'
import EtapaOrcamento from '../components/questionario/EtapaOrcamento'
import EtapaPrioridade from '../components/questionario/EtapaPrioridade'
import EtapaProcessador from '../components/questionario/EtapaProcessador'
import EtapaProgramas from '../components/questionario/EtapaProgramas'
import EtapaQualidade from '../components/questionario/EtapaQualidade'
import Progresso from '../components/questionario/Progresso'
import TelaCarregando, { DURACAO_MINIMA } from '../components/questionario/TelaCarregando'
import { ORCAMENTO_INICIAL } from '../dados/opcoesQuestionario'

// Os nomes dos campos seguem o model Questionario do Django (branch banco-de-dados).
// Processador e prioridade já começam com a opção recomendada marcada.
const RESPOSTAS_INICIAIS = {
  finalidade: '',
  jogos: [],
  resolucao_alvo: '',
  fps_alvo: null,
  programas: [],
  orcamento: ORCAMENTO_INICIAL,
  preferencia_cpu: 'Sem preferência',
  prioridade_desempenho: 'Custo-benefício',
}

// Cada etapa tem a pergunta (titulo), uma explicação curta (subtitulo), o componente
// que desenha as opções e uma validação que devolve a mensagem de erro, ou '' se estiver tudo certo.
const ETAPAS = {
  finalidade: {
    titulo: 'Para que você vai usar o PC?',
    subtitulo: 'Isso define quais peças pesam mais na sua montagem.',
    Componente: EtapaFinalidade,
    validar: (r) => (r.finalidade ? '' : 'Escolha um uso para continuar.'),
  },
  jogos: {
    titulo: 'Quais jogos você quer rodar?',
    subtitulo: 'Marque um ou mais. Usamos o mais pesado para calibrar a montagem.',
    Componente: EtapaJogos,
    validar: (r) => (r.jogos.length > 0 ? '' : 'Marque pelo menos um jogo.'),
  },
  qualidade: {
    titulo: 'Como você quer que os jogos rodem?',
    subtitulo: 'Mais resolução e mais FPS pedem uma placa de vídeo mais forte.',
    Componente: EtapaQualidade,
    validar: (r) => {
      if (!r.resolucao_alvo) return 'Escolha uma resolução.'
      if (!r.fps_alvo) return 'Escolha quantos FPS você quer.'
      return ''
    },
  },
  programas: {
    titulo: 'Quais programas você vai usar?',
    subtitulo: 'Marque um ou mais. Usamos o mais exigente para calibrar a montagem.',
    Componente: EtapaProgramas,
    validar: (r) => (r.programas.length > 0 ? '' : 'Marque pelo menos um programa.'),
  },
  orcamento: {
    titulo: 'Quanto você quer gastar?',
    subtitulo: 'Valor total do computador. Mostramos opções abaixo e um pouco acima dele.',
    Componente: EtapaOrcamento,
    validar: () => '',
  },
  processador: {
    titulo: 'Tem preferência de processador?',
    subtitulo: 'Se não souber, deixe em "Tanto faz". A gente escolhe por você.',
    Componente: EtapaProcessador,
    validar: () => '',
  },
  prioridade: {
    titulo: 'O que pesa mais na sua escolha?',
    subtitulo: 'Você recebe até 3 opções de qualquer jeito. A prioridade muda as peças escolhidas em cada uma.',
    Componente: EtapaPrioridade,
    validar: () => '',
  },
}

// Primeiro o que a pessoa quer fazer com o PC, depois quanto quer gastar:
// assim ela decide o orçamento já sabendo o que pediu.
// Jogos e Edição ganham perguntas a mais; Trabalho e Estudos vão direto ao orçamento.
function etapasPara(finalidade) {
  const extras = { Jogos: ['jogos', 'qualidade'], Edição: ['programas'] }[finalidade] ?? []
  return ['finalidade', ...extras, 'orcamento', 'processador', 'prioridade']
}

// Monta o que vai para a página de resultado.
// Jogos e programas só entram se combinarem com a finalidade final: se a pessoa
// marcou jogos e depois voltou e trocou para Trabalho, eles são descartados.
function montarResultado(respostas) {
  const ehJogos = respostas.finalidade === 'Jogos'
  const jogos = ehJogos ? respostas.jogos : []
  const programas = respostas.finalidade === 'Edição' ? respostas.programas : []

  return {
    // Formato pensado para o envio à API, com os campos do model Questionario.
    questionario: {
      finalidade: respostas.finalidade,
      orcamento: respostas.orcamento,
      preferencia_cpu: respostas.preferencia_cpu,
      prioridade_desempenho: respostas.prioridade_desempenho,
      fps_alvo: ehJogos ? respostas.fps_alvo : null,
      resolucao_alvo: ehJogos ? respostas.resolucao_alvo : null,
      jogos: jogos.map((jogo) => jogo.id),
      programas: programas.map((programa) => programa.id),
    },
    // Só para mostrar o resumo na tela.
    nomesDosJogos: jogos.map((jogo) => jogo.nome),
    nomesDosProgramas: programas.map((programa) => programa.nome),
  }
}

const ID_DO_TITULO = 'pergunta-atual'

// O questionário ocupa a tela inteira, sem o Header: assim a pessoa foca só na pergunta.
// "Início" (no primeiro passo) e "Voltar" ficam no topo, junto da barra de progresso.
export default function Questionario() {
  const navigate = useNavigate()
  const [respostas, setRespostas] = useState(RESPOSTAS_INICIAIS)
  const [indice, setIndice] = useState(0)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Se a pessoa sair da página durante o "Carregando", a mudança para /resultado é cancelada.
  const espera = useRef(null)
  useEffect(() => () => clearTimeout(espera.current), [])

  const etapas = etapasPara(respostas.finalidade)
  const etapaAtual = ETAPAS[etapas[indice]]
  const ehUltimaEtapa = indice === etapas.length - 1
  const podeContinuar = etapaAtual.validar(respostas) === ''
  const { Componente } = etapaAtual

  // Ao trocar de etapa, a página volta ao topo e o foco vai para a pergunta nova.
  // Assim quem usa teclado ou leitor de tela começa a pergunta do início.
  const pergunta = useRef(null)
  const indiceAnterior = useRef(indice)
  useEffect(() => {
    if (indiceAnterior.current !== indice) {
      indiceAnterior.current = indice
      window.scrollTo({ top: 0 })
      pergunta.current?.focus()
    }
  }, [indice])

  function atualizar(campo, valor) {
    setRespostas((anteriores) => ({ ...anteriores, [campo]: valor }))
    setErro('')
  }

  function aoEnviar(evento) {
    evento.preventDefault()

    // O botão não fica desabilitado: se faltar algo, ele explica o que é.
    const problema = etapaAtual.validar(respostas)
    if (problema) {
      setErro(problema)
      return
    }

    if (!ehUltimaEtapa) {
      setIndice(indice + 1)
      return
    }

    // Último passo: junta as respostas num objeto e mostra a tela de "Carregando".
    // Por enquanto ela só espera o tempo das animações e leva as respostas para /resultado.
    // Quando a API existir, a chamada entra aqui, e a página muda quando a resposta chegar
    // (usando Promise.all com a espera mínima, para a animação não sumir de repente).
    const resultado = montarResultado(respostas)
    setEnviando(true)
    espera.current = setTimeout(() => {
      navigate('/resultado', { state: resultado })
    }, DURACAO_MINIMA)
  }

  function voltar() {
    if (indice === 0) {
      navigate('/')
      return
    }
    setErro('')
    setIndice(indice - 1)
  }

  if (enviando) return <TelaCarregando />

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-5 sm:gap-5 sm:px-6">
        <button
          type="button"
          onClick={voltar}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] border-menta-borda bg-white px-4 text-sm font-semibold hover:border-esmeralda hover:bg-menta"
        >
          <IconeVoltar tamanho={18} />
          {indice === 0 ? 'Início' : 'Voltar'}
        </button>
        <Progresso passoAtual={indice + 1} totalDePassos={etapas.length} />
      </header>

      {/* noValidate: a validação é feita pelo React, com mensagens em português.
          pb-40: espaço para o rodapé fixo não cobrir as últimas opções. */}
      <form noValidate onSubmit={aoEnviar} className="mx-auto w-full max-w-4xl flex-1 px-4 pt-4 pb-40 sm:px-6 sm:pt-8">
        {/* key={indice}: o React recria o bloco a cada etapa, e a animação de entrada roda de novo. */}
        <div key={indice} className="motion-safe:animate-subir">
          <div className="mb-8 flex items-start gap-4">
            <span
              aria-hidden="true"
              className="hidden size-13 shrink-0 items-center justify-center rounded-2xl border border-menta-forte bg-menta-forte sm:flex"
            >
              <LogoMarca tamanho={30} />
            </span>
            <div>
              <h1
                id={ID_DO_TITULO}
                ref={pergunta}
                tabIndex={-1}
                className="text-[1.75rem] leading-tight tracking-tight focus:outline-none sm:text-3xl"
              >
                {etapaAtual.titulo}
              </h1>
              <p className="mt-2 font-lora text-lg leading-relaxed text-tinta-suave">{etapaAtual.subtitulo}</p>
            </div>
          </div>

          <Componente respostas={respostas} atualizar={atualizar} idDoTitulo={ID_DO_TITULO} />
        </div>

        {/* Rodapé fixo: o botão de continuar fica sempre à mão, mesmo em listas longas.
            O degradê esconde o conteúdo que passa por baixo. */}
        <div className="fixed inset-x-0 bottom-0 bg-linear-to-b from-transparent to-menta to-30% pt-8 pb-5">
          <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            {erro && (
              <p role="alert" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-suave sm:mr-auto">
                {erro}
              </p>
            )}
            {/* Fica mais claro enquanto falta resposta, mas continua clicável para mostrar o aviso. */}
            <button
              type="submit"
              className={`inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-esmeralda px-8 text-[1.2rem] font-bold text-white shadow-marca transition-[opacity,translate,background-color] hover:-translate-y-0.5 hover:bg-esmeralda-escuro active:translate-y-0 ${
                podeContinuar ? '' : 'opacity-50'
              }`}
            >
              {ehUltimaEtapa ? (
                <>
                  Ver minhas montagens <IconeBrilho tamanho={20} />
                </>
              ) : (
                <>
                  Continuar <IconeSeta tamanho={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
