// Símbolo do MontaAqui: uma peça de quebra-cabeça, porque as peças do PC
// precisam se encaixar. Usado no Header e como "avatar" do assistente no questionário.
export default function LogoMarca({ tamanho = 36, className = '' }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M14 10h13.2a2 2 0 0 0 1.9-2.6 6 6 0 1 1 11.4 0A2 2 0 0 0 42.3 10H54a2 2 0 0 1 2 2v11.7a2 2 0 0 0 2.6 1.9 6 6 0 1 1 0 11.4 2 2 0 0 0-2.6 1.9V52a2 2 0 0 1-2 2H42.3a2 2 0 0 1-1.9-2.6 6 6 0 1 0-11.4 0A2 2 0 0 1 27.1 54H14a4 4 0 0 1-4-4V37.6a2 2 0 0 1 2.6-1.9 6 6 0 1 0 0-11.4A2 2 0 0 1 10 22.4V14a4 4 0 0 1 4-4Z"
        className="fill-esmeralda"
      />
      <circle cx="42" cy="46" r="3.4" className="fill-esmeralda-escuro" opacity="0.55" />
    </svg>
  )
}
