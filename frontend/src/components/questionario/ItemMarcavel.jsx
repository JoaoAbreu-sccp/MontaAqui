import { IconeCheck } from '../Icones'

// Opção compacta com caixinha de marcar, usada nas listas de jogos e programas,
// onde a pessoa pode escolher vários itens. Por baixo é um input checkbox de verdade.
// A legenda opcional (ex.: categoria do programa) aparece embaixo do nome.
export default function ItemMarcavel({ nome, valor, titulo, legenda, marcado, aoMudar }) {
  return (
    <label className="group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 border-linha bg-white px-4 py-3 transition-colors hover:border-esmeralda/50 hover:bg-menta has-checked:border-esmeralda has-checked:bg-menta has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-tinta">
      <input
        type="checkbox"
        name={nome}
        value={valor}
        checked={marcado}
        onChange={aoMudar}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-[7px] border-2 border-menta-borda bg-white text-white transition-colors group-has-checked:border-esmeralda group-has-checked:bg-esmeralda"
      >
        <IconeCheck tamanho={15} className="hidden group-has-checked:block" />
      </span>
      <span className="flex flex-col">
        <span className="leading-snug font-semibold">{titulo}</span>
        {legenda && <span className="text-sm text-tinta-suave">{legenda}</span>}
      </span>
    </label>
  )
}
