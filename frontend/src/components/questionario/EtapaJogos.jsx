import useLista from '../../hooks/useLista'
import { buscarJogos } from '../../services/requisitos'
import EstadoDaLista from './EstadoDaLista'
import ItemMarcavel from './ItemMarcavel'

// Só para a finalidade Jogos: quais jogos a pessoa quer rodar.
// Os jogos escolhidos ficam guardados como { id, nome }: o id vai para o banco
// e o nome aparece no resumo da página de resultado.
export default function EtapaJogos({ respostas, atualizar, idDoTitulo }) {
  const { itens, carregando, erro, tentarDeNovo } = useLista(buscarJogos)

  function alternarJogo(jogo) {
    const jaEscolhido = respostas.jogos.some((escolhido) => escolhido.id === jogo.id)
    atualizar(
      'jogos',
      jaEscolhido
        ? respostas.jogos.filter((escolhido) => escolhido.id !== jogo.id)
        : [...respostas.jogos, { id: jogo.id, nome: jogo.nome }],
    )
  }

  return (
    <EstadoDaLista carregando={carregando} erro={erro} vazia={itens.length === 0} tentarDeNovo={tentarDeNovo}>
      <div role="group" aria-labelledby={idDoTitulo} className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((jogo) => (
          <ItemMarcavel
            key={jogo.id}
            nome="jogos"
            valor={jogo.id}
            titulo={jogo.nome}
            marcado={respostas.jogos.some((escolhido) => escolhido.id === jogo.id)}
            aoMudar={() => alternarJogo(jogo)}
          />
        ))}
      </div>
    </EstadoDaLista>
  )
}
