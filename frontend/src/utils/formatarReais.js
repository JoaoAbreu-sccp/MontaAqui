// Formata um número como dinheiro brasileiro, sem centavos: 5000 -> "R$ 5.000".
const formatador = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export default function formatarReais(valor) {
  return formatador.format(valor)
}
