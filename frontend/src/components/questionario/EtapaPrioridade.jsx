import { PRIORIDADES } from '../../dados/opcoesQuestionario'
import Escolha from './Escolha'

// O que pesa mais na escolha das peças. Já começa em "Custo-benefício".
export default function EtapaPrioridade({ respostas, atualizar, idDoTitulo }) {
  return (
    <div role="radiogroup" aria-labelledby={idDoTitulo} className="grid gap-3.5 sm:grid-cols-3">
      {PRIORIDADES.map((opcao) => (
        <Escolha
          key={opcao.valor}
          nome="prioridade_desempenho"
          valor={opcao.valor}
          titulo={opcao.titulo}
          descricao={opcao.descricao}
          recomendado={opcao.recomendado}
          marcado={respostas.prioridade_desempenho === opcao.valor}
          aoMudar={() => atualizar('prioridade_desempenho', opcao.valor)}
        />
      ))}
    </div>
  )
}
