import {
  FAIXAS_DE_ORCAMENTO,
  ORCAMENTO_MAXIMO,
  ORCAMENTO_MINIMO,
  ORCAMENTO_PASSO,
  SUGESTOES_DE_ORCAMENTO,
} from '../../dados/opcoesQuestionario'
import formatarReais from '../../utils/formatarReais'

// Nome da faixa de preço (Básico, Intermediário...) para um valor.
function faixaDe(valor) {
  return FAIXAS_DE_ORCAMENTO.findLast((faixa) => valor >= faixa.aPartirDe)?.nome
}

// Quanto a pessoa quer gastar no PC inteiro.
// O valor é escolhido arrastando o controle deslizante ou tocando numa sugestão.
// O controle funciona pelo teclado também: setas mudam de R$ 250 em R$ 250.
export default function EtapaOrcamento({ respostas, atualizar, idDoTitulo }) {
  const valor = respostas.orcamento
  const preenchido = ((valor - ORCAMENTO_MINIMO) / (ORCAMENTO_MAXIMO - ORCAMENTO_MINIMO)) * 100

  return (
    <div className="rounded-[26px] border border-linha bg-white px-5 py-8 shadow-suave sm:p-10">
      {/* O leitor de tela já anuncia o valor pelo próprio controle (aria-valuetext). */}
      <p aria-hidden="true" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">{formatarReais(valor)}</span>
        <span className="rounded-full bg-menta-forte px-3.5 py-1.5 text-sm font-bold text-esmeralda-escuro">
          {faixaDe(valor)}
        </span>
      </p>

      <input
        type="range"
        min={ORCAMENTO_MINIMO}
        max={ORCAMENTO_MAXIMO}
        step={ORCAMENTO_PASSO}
        value={valor}
        aria-labelledby={idDoTitulo}
        aria-valuetext={formatarReais(valor)}
        onChange={(evento) => atualizar('orcamento', Number(evento.target.value))}
        className="deslizante mt-9 w-full"
        style={{ '--preenchido': `${preenchido}%` }}
      />
      <div aria-hidden="true" className="mt-3 flex justify-between text-sm font-semibold text-tinta-suave">
        <span>{formatarReais(ORCAMENTO_MINIMO)}</span>
        <span>{formatarReais(ORCAMENTO_MAXIMO)}</span>
      </div>

      <p className="mt-8 text-center text-sm font-semibold text-tinta-suave">Ou escolha um valor comum:</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {SUGESTOES_DE_ORCAMENTO.map((sugestao) => {
          const escolhido = valor === sugestao
          return (
            <li key={sugestao}>
              {/* aria-pressed avisa ao leitor de tela qual sugestão está ativa. */}
              <button
                type="button"
                aria-pressed={escolhido}
                onClick={() => atualizar('orcamento', sugestao)}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors ${
                  escolhido
                    ? 'bg-menta-forte text-esmeralda-escuro'
                    : 'border-[1.5px] border-menta-borda bg-white hover:border-esmeralda hover:bg-menta'
                }`}
              >
                {formatarReais(sugestao)}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
