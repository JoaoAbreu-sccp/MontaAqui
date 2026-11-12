import { IconeRefazer } from '../Icones'

// Mostra o que acontece com uma lista que vem da API:
// carregando, erro (com botão para tentar de novo), vazia ou pronta (children).
export default function EstadoDaLista({ carregando, erro, vazia, tentarDeNovo, children }) {
  if (carregando) {
    return (
      <p role="status" className="font-lora text-tinta-suave">
        Carregando a lista...
      </p>
    )
  }

  if (erro) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-[18px] border border-linha bg-white p-6 shadow-suave"
      >
        <p className="font-lora leading-relaxed">{erro}</p>
        <button
          type="button"
          onClick={tentarDeNovo}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-menta-borda bg-white px-5 font-semibold hover:border-esmeralda hover:bg-menta"
        >
          <IconeRefazer tamanho={17} />
          Tentar de novo
        </button>
      </div>
    )
  }

  if (vazia) {
    // Para a equipe: a lista fica vazia se o comando carregar_requisitos não rodou.
    return <p className="font-lora text-tinta-suave">A lista ainda está vazia.</p>
  }

  return children
}
