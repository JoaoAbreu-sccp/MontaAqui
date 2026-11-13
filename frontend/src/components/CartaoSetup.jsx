import formatarReais from '../utils/formatarReais'

// Explicação curta de cada nível, para quem não sabe o que "Equilíbrio" quer dizer.
const EXPLICACAO_DO_NIVEL = {
  'Abaixo do Orçamento': 'Gasta menos e ainda dá conta do que você pediu.',
  Equilíbrio: 'O melhor conjunto que cabe no seu orçamento.',
  'Acima do Orçamento': 'Passa um pouco do orçamento, mas entrega mais desempenho.',
}

// Mostra um setup: nível, preço total, frases de resumo, as 7 peças e os links das lojas.
// Usado na página de resultado e em "Meus setups".
// acao: espaço livre no rodapé do cartão (ex.: botão "Salvar setup").
export default function CartaoSetup({ setup, destaque = false, acao }) {
  return (
    <article
      className={`flex flex-col rounded-[18px] border bg-white p-5 shadow-suave sm:p-6 ${
        destaque ? 'border-esmeralda ring-2 ring-esmeralda/30' : 'border-linha'
      }`}
    >
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl">{setup.categoria}</h2>
          {destaque && (
            <span className="rounded-full bg-esmeralda px-2.5 py-0.5 text-xs font-bold text-white">
              Recomendado
            </span>
          )}
        </div>
        <p className="mt-1 font-lora text-tinta-suave">{EXPLICACAO_DO_NIVEL[setup.categoria]}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-esmeralda-escuro">
          {formatarReais(setup.preco)}
        </p>
      </header>

      {setup.resumo?.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5 rounded-xl bg-menta p-4 text-sm leading-relaxed">
          {setup.resumo.map((frase) => (
            <li key={frase}>{frase}</li>
          ))}
        </ul>
      )}

      <ul className="mt-4 flex-1 divide-y divide-linha">
        {setup.pecas.map((peca) => (
          <li key={peca.tipo} className="py-3">
            <p className="text-xs font-semibold tracking-wide text-tinta-suave uppercase">{peca.rotulo}</p>
            <div className="mt-0.5 flex items-start justify-between gap-3">
              <p className="font-semibold leading-snug">{peca.nome}</p>
              <p className="shrink-0 font-semibold">{formatarReais(peca.preco)}</p>
            </div>
            <p className="text-sm text-tinta-suave">{peca.detalhe}</p>
            {/* Links de compra (RF07). Abrem em outra aba para a pessoa não perder o resultado. */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {peca.links.map((link) => (
                <a
                  key={link.loja}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${peca.nome} na ${link.loja} (abre em outra aba)`}
                  className="rounded-full border border-menta-borda px-2.5 py-1 text-xs font-semibold text-esmeralda-escuro hover:border-esmeralda hover:bg-menta"
                >
                  {link.loja}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {acao && <div className="mt-4">{acao}</div>}
    </article>
  )
}
