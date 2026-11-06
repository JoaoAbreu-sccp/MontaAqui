import { Link } from 'react-router-dom'
import PlacaMae from '../components/PlacaMae'

// Os níveis ficam em ordem de valor, em uma régua: é a relação com o orçamento que importa.
const niveis = [
  {
    nome: 'Abaixo do Orçamento',
    descricao: 'Você gasta menos e ainda atende ao que precisa.',
  },
  {
    nome: 'Equilíbrio',
    descricao: 'Você aproveita bem o valor que definiu.',
    marcaOrcamento: true,
  },
  {
    nome: 'Acima do Orçamento',
    descricao: 'Você investe um pouco mais para ganhar desempenho.',
  },
]

const passos = [
  {
    titulo: 'Responda às perguntas',
    descricao: 'Informe seu orçamento, o uso do PC e suas preferências.',
  },
  {
    titulo: 'Veja até 3 setups',
    descricao: 'Cada opção passa por uma verificação de compatibilidade antes de aparecer.',
  },
  {
    titulo: 'Compre as peças',
    descricao: 'Use os links das lojas parceiras. Com uma conta, você também salva seus setups.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* No celular fica uma coluna; a partir de telas lg (1024px), são duas. */}
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Diga quanto quer gastar. A gente escolhe as peças.
          </h1>
          <p className="max-w-prose font-lora text-lg leading-relaxed">
            Responda a algumas perguntas sobre como você vai usar o computador e veja até
            3 configurações com peças que funcionam juntas.
          </p>
          {/* Link, e não botão, porque a ação leva para outra página.
              A sombra sólida e o movimento ao clicar lembram uma peça sendo encaixada. */}
          <Link
            to="/questionario"
            className="w-full rounded-md bg-esmeralda px-8 py-4 text-center text-xl font-bold text-white shadow-[0_5px_0_var(--color-esmeralda-escuro)] transition-[translate,box-shadow] hover:shadow-[0_5px_0_var(--color-tinta)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-tinta)] sm:w-auto"
          >
            Começar questionário
          </Link>
          <p className="text-sm">Sem cadastro. Você só precisa de uma conta para salvar um setup.</p>
        </div>

        <PlacaMae />
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl">Até três opções para o seu bolso</h2>
        <p className="mt-2 max-w-prose font-lora text-lg leading-relaxed">
          As opções partem do valor que você informar, da mais barata para a mais cara.
        </p>
        {/* A régua é vertical no celular e horizontal a partir de telas md (768px). */}
        <ul className="mt-8 grid md:mt-14 md:grid-cols-3">
          {niveis.map((nivel) => (
            <li
              key={nivel.nome}
              className="relative border-l-2 border-tinta pb-8 pl-6 last:pb-0 md:border-t-2 md:border-l-0 md:pt-6 md:pr-8 md:pb-0 md:pl-0"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 -left-[9px] size-4 rounded-full border-2 border-tinta md:-top-[9px] md:left-0 ${
                  nivel.marcaOrcamento ? 'bg-esmeralda' : 'bg-menta'
                }`}
              />
              {nivel.marcaOrcamento && (
                // No desktop, o rótulo fica acima da linha para não desalinhar os três níveis.
                <p className="mb-1 text-sm font-semibold text-esmeralda-escuro md:absolute md:-top-9 md:left-0 md:mb-0">
                  Seu orçamento
                </p>
              )}
              <h3 className="text-lg font-semibold">{nivel.nome}</h3>
              <p className="mt-1 max-w-xs font-lora leading-relaxed">{nivel.descricao}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl">Como funciona</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {passos.map((passo, indice) => (
            <li key={passo.titulo} className="flex gap-4">
              <span aria-hidden="true" className="text-4xl leading-none font-bold text-esmeralda-escuro">
                {indice + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{passo.titulo}</h3>
                <p className="mt-1 font-lora leading-relaxed">{passo.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
