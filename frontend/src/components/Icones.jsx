// Ícones de traço usados no site, desenhados em SVG (os mesmos do protótipo).
// Todos usam currentColor: herdam a cor do texto em volta (ex.: text-white).
// São decorativos (aria-hidden): o texto ao lado já diz o que o ícone representa.

function Icone({ tamanho = 20, children, ...props }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconeSeta(props) {
  return (
    <Icone {...props} strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icone>
  )
}

export function IconeVoltar(props) {
  return (
    <Icone {...props} strokeWidth="2">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </Icone>
  )
}

export function IconeCheck(props) {
  return (
    <Icone {...props} strokeWidth="2.4">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Icone>
  )
}

export function IconeBrilho(props) {
  return (
    <Icone {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    </Icone>
  )
}

export function IconeRefazer(props) {
  return (
    <Icone {...props}>
      <path d="M20 11a8 8 0 1 0-.5 4M20 4v5h-5" />
    </Icone>
  )
}

export function IconeInfo(props) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Icone>
  )
}

export function IconeUsuario(props) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </Icone>
  )
}

// Ícones das finalidades de uso.
export function IconeJogo(props) {
  return (
    <Icone {...props}>
      <path d="M7 8h10a4 4 0 0 1 4 4v.5a3.5 3.5 0 0 1-6.3 2.1l-.4-.6h-4.6l-.4.6A3.5 3.5 0 0 1 3 12.5V12a4 4 0 0 1 4-4Z" />
      <path d="M7.5 11v2M6.5 12h2M15.5 11.5h.01M17.5 13h.01" />
    </Icone>
  )
}

export function IconeTrabalho(props) {
  return (
    <Icone {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" />
    </Icone>
  )
}

export function IconeEstudos(props) {
  return (
    <Icone {...props}>
      <path d="M12 6.5C10.5 5 8 4.5 4 4.8V18c4-.3 6.5.2 8 1.7 1.5-1.5 4-2 8-1.7V4.8c-4-.3-6.5.2-8 1.7Z" />
      <path d="M12 6.5v13" />
    </Icone>
  )
}

export function IconeEdicao(props) {
  return (
    <Icone {...props}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18M8 6v4M14 6v4M7 14l4 2.3L7 18.6V14Z" />
    </Icone>
  )
}
