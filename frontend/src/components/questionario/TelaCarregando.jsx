import { useEffect, useState } from 'react'
import { IconeCheck } from '../Icones'

// Peças que vão "encaixando" na placa enquanto a IA monta os setups.
// A ordem é a mesma de quem monta um PC de verdade.
const PECAS = [
  { nome: 'Processador', frase: 'Escolhendo o processador' },
  { nome: 'Memória RAM', frase: 'Separando a memória RAM' },
  { nome: 'Placa de vídeo', frase: 'Escolhendo a placa de vídeo' },
  { nome: 'Armazenamento', frase: 'Escolhendo onde guardar seus arquivos' },
  { nome: 'Fonte', frase: 'Calculando a energia necessária' },
  { nome: 'Gabinete', frase: 'Conferindo se tudo cabe no gabinete' },
]
const FRASE_FINAL = 'Verificando a compatibilidade e os preços'

// Curiosidades para quem não entende de hardware. Aparecem enquanto a pessoa espera.
const DICAS = [
  'O processador é o "cérebro" do PC: ele faz as contas de tudo o que você usa.',
  'A memória RAM guarda o que está aberto agora. Mais RAM, mais abas e programas ao mesmo tempo.',
  'A placa de vídeo cria as imagens. Ela é a peça que mais pesa nos jogos.',
  'Um SSD deixa o computador ligar e abrir programas muito mais rápido que um HD.',
  'A fonte precisa de folga: trabalhar no limite esquenta e encurta a vida dela.',
  'Nem toda peça encaixa em toda placa-mãe. Por isso conferimos cada combinação.',
]

// Tempo entre uma peça e a próxima, em milissegundos.
const TEMPO_POR_PECA = 1300
// A dica muda a cada 5 segundos.
const TEMPO_POR_DICA = 5000
// Depois de 15 segundos, avisamos que a IA está levando mais tempo.
const TEMPO_PARA_AVISO = 15000

// Espera mínima antes de mudar de página, usada pelo Questionario. Quando a resposta
// é muito rápida (ex.: sem IA), a tela ainda aparece tempo suficiente para ser vista.
export const DURACAO_MINIMA = 2600
// Depois que a resposta chega, a animação de "tudo encaixado" dura isto.
export const DURACAO_FINAL = 800

// Tela cheia de "Carregando", depois do último passo do questionário.
// terminou: true quando a resposta da API chegou; aí as peças restantes encaixam de uma vez.
export default function TelaCarregando({ terminou = false }) {
  const [decimos, setDecimos] = useState(0) // tempo de espera, em décimos de segundo
  const passo = terminou ? PECAS.length : Math.min(Math.floor((decimos * 100) / TEMPO_POR_PECA), PECAS.length)
  const dica = DICAS[Math.floor((decimos * 100) / TEMPO_POR_DICA) % DICAS.length]
  const demorando = !terminou && decimos * 100 >= TEMPO_PARA_AVISO

  // Um único relógio, de 100 em 100 ms. Tudo na tela é calculado a partir dele.
  useEffect(() => {
    const relogio = setInterval(() => setDecimos((anterior) => anterior + 1), 100)
    return () => clearInterval(relogio)
  }, [])

  // A barra anda rápido no começo e cada vez mais devagar, sem nunca parar nem chegar
  // a 100% sozinha: assim ela continua se mexendo mesmo se a IA demorar 30 segundos.
  const progresso = terminou ? 100 : Math.round(94 * (1 - Math.exp(-decimos / 90)))
  const frase = passo < PECAS.length ? PECAS[passo].frase : FRASE_FINAL

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl sm:text-3xl">{terminou ? 'Prontinho!' : 'Montando para você...'}</h1>

        {/* A placa: cada peça encaixa quando chega a vez dela. É só decoração; o texto
            abaixo (role="status") é o que o leitor de tela anuncia. */}
        <div aria-hidden="true" className="relative mt-7 overflow-hidden rounded-xl bg-esmeralda p-4 shadow-marca sm:p-5">
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0 30H20V62H55V18H100M0 84H38V70H80V100M70 0V40H100"
              fill="none"
              vectorEffect="non-scaling-stroke"
              className="stroke-esmeralda-escuro stroke-2"
            />
          </svg>

          <ul className="relative grid grid-cols-3 gap-2.5 sm:gap-3">
            {PECAS.map((peca, indice) => {
              const encaixada = indice < passo
              const montando = indice === passo && !terminou
              return (
                <li
                  key={peca.nome}
                  // No final, as peças que faltavam encaixam uma logo depois da outra.
                  style={terminou ? { animationDelay: `${indice * 70}ms` } : undefined}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-md px-1.5 py-2.5 text-center text-xs font-semibold transition-colors duration-300 sm:min-h-18 sm:text-sm ${
                    encaixada
                      ? 'bg-white text-tinta motion-safe:animate-encaixar'
                      : montando
                        ? 'border-2 border-dashed border-white/80 bg-white/25 text-white motion-safe:animate-pulse'
                        : 'border-2 border-dashed border-white/35 text-white/60'
                  }`}
                >
                  {encaixada && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-esmeralda text-white">
                      <IconeCheck tamanho={12} />
                    </span>
                  )}
                  {peca.nome}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Barra de progresso. */}
        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-menta-forte">
          <div
            className="h-full rounded-full bg-esmeralda transition-[width] duration-500 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* role="status": o leitor de tela anuncia cada frase nova. */}
        <p role="status" className="mt-3 flex min-h-6 items-center justify-center gap-2 text-center font-semibold">
          {!terminou && (
            <span
              aria-hidden="true"
              className="size-3.5 shrink-0 rounded-full border-2 border-menta-borda border-t-esmeralda-escuro motion-safe:animate-spin"
            />
          )}
          {terminou ? 'Suas montagens estão prontas.' : `${frase}...`}
        </p>

        {demorando && (
          <p className="mt-2 text-center text-sm text-tinta-suave motion-safe:animate-subir">
            A inteligência artificial está caprichando nas escolhas. Pode levar até meio minuto.
          </p>
        )}

        {/* Dica: o key faz a animação de entrada rodar de novo a cada dica nova. */}
        <div className="mt-8 rounded-[18px] border border-menta-borda bg-white p-5 shadow-suave">
          <p className="text-xs font-semibold tracking-wide text-esmeralda-escuro uppercase">Você sabia?</p>
          <p key={dica} className="mt-1.5 font-lora leading-relaxed motion-safe:animate-subir">
            {dica}
          </p>
        </div>
      </div>
    </div>
  )
}
