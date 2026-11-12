// Opções fixas do questionário.
// O campo "valor" é o que vai para o banco, nos campos do model Questionario
// (branch banco-de-dados). O "titulo" e a "descricao" são só para a tela.

export const FINALIDADES = [
  {
    valor: 'Jogos',
    titulo: 'Jogos',
    descricao: 'Rodar jogos atuais com imagem bonita e fluida.',
  },
  {
    valor: 'Trabalho',
    titulo: 'Trabalho e escritório',
    descricao: 'Planilhas, reuniões online e muitas abas abertas.',
  },
  {
    valor: 'Estudos',
    titulo: 'Estudos e uso geral',
    descricao: 'Aulas online, pesquisas e uso do dia a dia em casa.',
  },
  {
    valor: 'Edição',
    titulo: 'Edição e criação',
    descricao: 'Foto, vídeo, 3D, design e transmissões ao vivo.',
  },
]

// Limites do controle deslizante do orçamento, em reais.
// Abaixo do mínimo não dá para montar um PC novo com peças compatíveis.
// A equipe pode ajustar conforme os preços cadastrados no banco.
export const ORCAMENTO_MINIMO = 1500
export const ORCAMENTO_MAXIMO = 15000
export const ORCAMENTO_PASSO = 250
export const ORCAMENTO_INICIAL = 5000

export const SUGESTOES_DE_ORCAMENTO = [3000, 5000, 8000, 12000]

// Nome da faixa que aparece ao lado do valor, para quem não tem noção de preço.
// Cada faixa vale a partir do valor indicado.
export const FAIXAS_DE_ORCAMENTO = [
  { aPartirDe: 1500, nome: 'Básico' },
  { aPartirDe: 3500, nome: 'Intermediário' },
  { aPartirDe: 6000, nome: 'Avançado' },
  { aPartirDe: 9000, nome: 'Entusiasta' },
  { aPartirDe: 13000, nome: 'Top de linha' },
]

export const RESOLUCOES = [
  { valor: '1080p', titulo: 'Full HD', descricao: '1920 × 1080. A mais comum e a mais leve.' },
  { valor: '1440p', titulo: 'Quad HD', descricao: '2560 × 1440. Imagem mais nítida.' },
  { valor: '4K', titulo: '4K Ultra HD', descricao: '3840 × 2160. Nitidez máxima, pede peças de ponta.' },
]

export const FPS = [
  { valor: 60, titulo: '60 FPS', descricao: 'Fluido para a maioria dos jogos.' },
  { valor: 120, titulo: '120 FPS', descricao: 'Bem suave, ótimo para jogos de ação.' },
  { valor: 144, titulo: '144 FPS ou mais', descricao: 'Para jogos competitivos e monitores rápidos.' },
]

export const FABRICANTES_CPU = [
  {
    valor: 'Sem preferência',
    titulo: 'Tanto faz',
    descricao: 'O MontaAqui escolhe o que couber melhor no orçamento.',
    recomendado: true,
  },
  { valor: 'AMD', titulo: 'AMD', descricao: 'Forte em jogos e em custo-benefício.' },
  { valor: 'Intel', titulo: 'Intel', descricao: 'Muito usado em trabalho e produtividade.' },
]

// "Custo-benefício", e não "Equilíbrio": Equilíbrio já é o nome de um dos três
// níveis de setup, e a pessoa poderia achar que só receberia esse nível.
export const PRIORIDADES = [
  {
    valor: 'Custo-benefício',
    titulo: 'Custo-benefício',
    descricao: 'Bom desempenho por um preço justo.',
    recomendado: true,
  },
  {
    valor: 'Desempenho',
    titulo: 'Máximo desempenho',
    descricao: 'Peças mais fortes, mesmo chegando ao limite do orçamento.',
  },
  {
    valor: 'Economia',
    titulo: 'Economia',
    descricao: 'O essencial para o seu uso, gastando menos.',
  },
]
