import useLista from '../../hooks/useLista'
import { buscarProgramas } from '../../services/requisitos'
import EstadoDaLista from './EstadoDaLista'
import ItemMarcavel from './ItemMarcavel'

// Só para a finalidade Edição: quais programas a pessoa vai usar.
// A categoria (ex.: "Edição de vídeo") aparece embaixo do nome para ajudar quem
// não conhece o programa.
export default function EtapaProgramas({ respostas, atualizar, idDoTitulo }) {
  const { itens, carregando, erro, tentarDeNovo } = useLista(buscarProgramas)

  function alternarPrograma(programa) {
    const jaEscolhido = respostas.programas.some((escolhido) => escolhido.id === programa.id)
    atualizar(
      'programas',
      jaEscolhido
        ? respostas.programas.filter((escolhido) => escolhido.id !== programa.id)
        : [...respostas.programas, { id: programa.id, nome: programa.nome }],
    )
  }

  return (
    <EstadoDaLista carregando={carregando} erro={erro} vazia={itens.length === 0} tentarDeNovo={tentarDeNovo}>
      <div role="group" aria-labelledby={idDoTitulo} className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((programa) => (
          <ItemMarcavel
            key={programa.id}
            nome="programas"
            valor={programa.id}
            titulo={programa.nome}
            legenda={programa.categoria}
            marcado={respostas.programas.some((escolhido) => escolhido.id === programa.id)}
            aoMudar={() => alternarPrograma(programa)}
          />
        ))}
      </div>
    </EstadoDaLista>
  )
}
