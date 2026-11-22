// Ilustração principal da Home: uma placa-mãe feita com HTML e Tailwind.
// Usamos texto de verdade, e não uma imagem, para ele continuar legível no celular.
// As classes col-span definem o tamanho de cada peça em uma grade de 6 colunas.
const pecas = [
  { nome: 'Processador', funcao: 'faz as contas do computador', tamanho: 'col-span-3' },
  { nome: 'Memória', funcao: 'guarda o que está aberto agora', tamanho: 'col-span-3' },
  { nome: 'Placa de vídeo', funcao: 'cria as imagens de jogos e vídeos', tamanho: 'col-span-6' },
  { nome: 'Armazenamento', funcao: 'guarda seus arquivos', tamanho: 'col-span-4' },
  { nome: 'Fonte', funcao: 'leva energia às peças', tamanho: 'col-span-2' },
]

// Os furos de fixação nos cantos deixam a ilustração com cara de placa real.
const furos = ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2']

export default function PlacaMae() {
  return (
    <figure>
      <div className="relative overflow-hidden rounded-lg bg-esmeralda p-4 sm:p-7">
        {/* Trilhas de circuito: apenas decoração, por isso ficam escondidas de leitores de tela. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 22H18V48H52V12H100M0 72H34V52H78V88H100M64 0V30H90V62H100M12 100V80H58V100"
            fill="none"
            vectorEffect="non-scaling-stroke"
            className="stroke-esmeralda-escuro stroke-2"
          />
        </svg>

        {furos.map((posicao) => (
          <span
            key={posicao}
            aria-hidden="true"
            className={`absolute size-2.5 rounded-full bg-menta ${posicao}`}
          />
        ))}

        <ul className="relative grid grid-cols-6 gap-2 sm:gap-4">
          {pecas.map((peca, indice) => (
            <li
              key={peca.nome}
              // O atraso faz as peças encaixarem uma de cada vez ao abrir a página.
              style={{ animationDelay: `${indice * 90}ms` }}
              className={`relative rounded-sm bg-white p-2.5 pb-5 motion-safe:animate-encaixar sm:p-4 sm:pb-6 ${peca.tamanho}`}
            >
              <p className="text-[13px] font-semibold sm:text-base">{peca.nome}</p>
              <p className="mt-0.5 font-lora text-[13px] leading-snug sm:text-sm">{peca.funcao}</p>
              <span aria-hidden="true" className="contatos absolute inset-x-2.5 bottom-1.5 h-1.5 sm:inset-x-4" />
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 font-lora text-sm">
        A placa-mãe, em verde, conecta as peças principais do PC.
      </figcaption>
    </figure>
  )
}
