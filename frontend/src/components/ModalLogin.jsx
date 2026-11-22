import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconeUsuario } from './Icones'

// Janela que convida a entrar ou criar conta (ex.: ao tentar salvar um setup sem login).
//
// Usamos o <dialog> do próprio HTML: com showModal() o navegador já escurece o fundo,
// prende o foco do teclado dentro da janela e fecha com a tecla Esc. Não precisa de biblioteca.
//
// aberto: true/false, controlado pela página. aoFechar: chamado quando a janela fecha.
// voltarPara: página para onde o login/cadastro devolve a pessoa depois.
export default function ModalLogin({ aberto, aoFechar, voltarPara, titulo, explicacao }) {
  const janela = useRef(null)

  // Sincroniza o estado do React (aberto) com a janela de verdade.
  useEffect(() => {
    const dialogo = janela.current
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  // Clicar fora da caixa branca (no fundo escuro) também fecha.
  function aoClicar(evento) {
    if (evento.target === janela.current) janela.current.close()
  }

  return (
    <dialog
      ref={janela}
      onClose={aoFechar}
      onClick={aoClicar}
      aria-labelledby="titulo-modal-login"
      className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-[22px] bg-white p-0 text-tinta shadow-suave backdrop:bg-tinta/40"
    >
      <div className="flex flex-col items-center gap-3 p-6 text-center sm:p-8">
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-2xl bg-menta-forte text-esmeralda-escuro"
        >
          <IconeUsuario tamanho={24} />
        </span>
        <h2 id="titulo-modal-login" className="text-xl">
          {titulo}
        </h2>
        <p className="font-lora leading-relaxed text-tinta-suave">{explicacao}</p>

        <Link
          to="/login"
          state={{ voltarPara }}
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-esmeralda px-6 font-bold text-white shadow-marca hover:bg-esmeralda-escuro"
        >
          Entrar
        </Link>
        <Link
          to="/cadastro"
          state={{ voltarPara }}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border-[1.5px] border-menta-borda font-semibold hover:border-esmeralda hover:bg-menta"
        >
          Criar conta grátis
        </Link>
        <button
          type="button"
          onClick={() => janela.current.close()}
          className="min-h-11 px-4 text-sm font-semibold text-tinta-suave underline underline-offset-4 hover:text-tinta"
        >
          Agora não
        </button>
      </div>
    </dialog>
  )
}
