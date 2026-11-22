// Iniciais do nome para a foto padrão: "Maria Souza Lima" vira "ML".
// Usada no cabeçalho e no perfil enquanto o cadastro não tem foto.
export default function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes.at(-1)[0] : ''
  return (primeira + ultima).toUpperCase()
}
