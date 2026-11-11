import { useEffect, useState } from 'react'
import { IconeCheck } from '../Icones'
import LogoMarca from '../LogoMarca'

// Etapas mostradas enquanto as montagens são geradas, uma de cada vez.
const MENSAGENS = [
  'Analisando o seu uso',
  'Escolhendo as peças',
  'Verificando a compatibilidade',
  'Comparando os preços',
]

// Tempo de cada mensagem, em milissegundos. O Questionario usa o total
// (MENSAGENS.length × TEMPO_POR_MENSAGEM) como espera mínima antes de mudar de página.
export const TEMPO_POR_MENSAGEM = 650
export const DURACAO_MINIMA = MENSAGENS.length * TEMPO_POR_MENSAGEM + 300

// Tela cheia de "Carregando", depois do último passo do questionário.
// Os passos vão sendo marcados com o tempo; o último fica girando até a página mudar.
export default function TelaCarregando() {
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    const relogio = setInterval(() => {
      // Para no último passo: ele fica "em andamento" até a resposta chegar.
      setAtual((anterior) => Math.min(anterior + 1, MENSAGENS.length - 1))
    }, TEMPO_POR_MENSAGEM)
    return () => clearInterval(relogio)
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-10">
      {/* Anéis girando em volta da peça. Ficam parados se a pessoa pediu menos movimento. */}
      <div aria-hidden="true" className="relative flex size-30 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-3 border-menta-forte border-t-esmeralda motion-safe:animate-spin" />
        <span className="absolute inset-3.5 rounded-full border-3 border-menta border-t-esmeralda/60 [animation-direction:reverse] [animation-duration:1.6s] motion-safe:animate-spin" />
        <LogoMarca tamanho={52} />
      </div>

      <h1 className="mt-8 text-2xl">Montando para você...</h1>

      {/* role="status": o leitor de tela anuncia cada passo novo. */}
      <ol role="status" className="mt-7 flex w-full max-w-xs flex-col gap-3.5">
        {MENSAGENS.map((mensagem, indice) => {
          const feito = indice < atual
          const emAndamento = indice === atual
          return (
            <li
              key={mensagem}
              className={`flex items-center gap-3 font-semibold transition-colors duration-300 ${
                feito ? 'text-esmeralda-escuro' : emAndamento ? 'text-tinta' : 'text-tinta-suave/50'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                  feito ? 'bg-esmeralda text-white' : 'bg-menta-forte'
                }`}
              >
                {feito && <IconeCheck tamanho={14} />}
                {emAndamento && (
                  <span className="size-3 rounded-full border-2 border-menta-borda border-t-esmeralda-escuro motion-safe:animate-spin" />
                )}
              </span>
              {mensagem}
              {feito && <span className="sr-only">(concluído)</span>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
