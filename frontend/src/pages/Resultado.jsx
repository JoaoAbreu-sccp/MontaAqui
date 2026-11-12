import { Link, useLocation } from 'react-router-dom'
import { IconeBrilho, IconeInfo, IconeRefazer, IconeSeta } from '../components/Icones'
import formatarReais from '../utils/formatarReais'

const classesBotaoSecundario =
  'inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border-[1.5px] border-menta-borda bg-white px-5 font-semibold hover:border-esmeralda hover:bg-menta'

// Página que vai mostrar os setups recomendados.
// Por enquanto só exibe um aviso e o resumo das respostas, porque a API que gera
// as recomendações ainda não existe. As respostas chegam pelo state da navegação.
export default function Resultado() {
  const { state } = useLocation()

  // Quem abre /resultado direto, sem responder o questionário, não tem respostas.
  if (!state?.questionario) {
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

  const { questionario, nomesDosJogos, nomesDosProgramas } = state

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
            Até 3 opções com peças compatíveis entre si, partindo do seu orçamento.
          </p>
        </div>
        <Link to="/questionario" className={classesBotaoSecundario}>
          <IconeRefazer tamanho={17} />
          Refazer
        </Link>
      </div>

      <div role="status" className="flex gap-4 rounded-[18px] border border-menta-borda bg-white p-5 sm:p-6">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-menta-forte text-esmeralda-escuro"
        >
          <IconeInfo tamanho={20} />
        </span>
        <div>
          <p className="font-semibold">As montagens ainda não estão disponíveis.</p>
          <p className="mt-1 font-lora leading-relaxed text-tinta-suave">
            A ligação com a API que monta os setups ainda está em desenvolvimento. Suas respostas
            foram registradas abaixo.
          </p>
        </div>
      </div>

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
