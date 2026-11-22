import { IconeCheck } from '../Icones'

// Opção em forma de cartão, usada nas perguntas de escolha única.
// Por baixo existe um input radio de verdade: funciona com teclado (setas) e leitor
// de tela sem código extra. O input fica escondido (sr-only) e o cartão inteiro é
// o rótulo, então clicar em qualquer parte dele marca a opção.
// As classes has-checked: e group-has-checked: mudam o visual quando o input está marcado.
export default function Escolha({ nome, valor, titulo, descricao, Icone, recomendado, marcado, aoMudar }) {
  return (
    <label className="group relative flex cursor-pointer flex-col gap-1 rounded-[18px] border-2 border-linha bg-white p-4 transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 hover:border-esmeralda/50 hover:shadow-suave has-checked:border-esmeralda has-checked:bg-menta has-checked:shadow-marca has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-tinta sm:p-6">
      {/* No celular o padding é menor (p-4) para caberem mais opções na tela. */}
      <input
        type="radio"
        name={nome}
        value={valor}
        checked={marcado}
        onChange={aoMudar}
        className="sr-only"
      />

      {Icone && (
        <span
          aria-hidden="true"
          className="mb-1 flex size-10 items-center justify-center rounded-xl sm:mb-1.5 sm:size-12 sm:rounded-[14px] border border-menta-forte bg-menta text-esmeralda-escuro transition-colors group-has-checked:border-esmeralda group-has-checked:bg-esmeralda group-has-checked:text-white"
        >
          <Icone tamanho={22} />
        </span>
      )}

      {recomendado && (
        <span className="mb-1 self-start rounded-full bg-menta-forte px-2.5 py-1 text-xs font-bold text-esmeralda-escuro">
          Recomendado
        </span>
      )}

      {/* pr-8: espaço para a marca de escolhido, que fica no canto. */}
      <span className="pr-8 text-lg leading-snug font-bold">{titulo}</span>
      {descricao && (
        <span className="font-lora text-[0.92rem] leading-relaxed text-tinta-suave">{descricao}</span>
      )}

      <span
        aria-hidden="true"
        className="absolute top-4 right-4 hidden size-7 items-center justify-center rounded-full bg-esmeralda text-white group-has-checked:flex motion-safe:group-has-checked:animate-surgir"
      >
        <IconeCheck tamanho={16} />
      </span>
    </label>
  )
}
