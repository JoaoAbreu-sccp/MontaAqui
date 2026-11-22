import { FABRICANTES_CPU } from '../../dados/opcoesQuestionario'
import Escolha from './Escolha'

// Fabricante do processador. Já começa em "Tanto faz", que é o recomendado
// para quem não entende de peças: a pessoa pode só seguir.
export default function EtapaProcessador({ respostas, atualizar, idDoTitulo }) {
  return (
    <div role="radiogroup" aria-labelledby={idDoTitulo} className="grid gap-3.5 sm:grid-cols-3">
      {FABRICANTES_CPU.map((opcao) => (
        <Escolha
          key={opcao.valor}
          nome="preferencia_cpu"
          valor={opcao.valor}
          titulo={opcao.titulo}
          descricao={opcao.descricao}
          recomendado={opcao.recomendado}
          marcado={respostas.preferencia_cpu === opcao.valor}
          aoMudar={() => atualizar('preferencia_cpu', opcao.valor)}
        />
      ))}
    </div>
  )
}
