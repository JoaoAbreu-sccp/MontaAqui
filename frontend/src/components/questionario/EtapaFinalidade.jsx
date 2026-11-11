import { FINALIDADES } from '../../dados/opcoesQuestionario'
import { IconeEdicao, IconeEstudos, IconeJogo, IconeTrabalho } from '../Icones'
import Escolha from './Escolha'

// Cada finalidade tem um ícone. Ficam aqui, e não no arquivo de dados, porque são componentes.
const ICONES = {
  Jogos: IconeJogo,
  Trabalho: IconeTrabalho,
  Estudos: IconeEstudos,
  Edição: IconeEdicao,
}

// Para que a pessoa vai usar o computador.
// Todas as etapas recebem as mesmas props: respostas (tudo o que já foi respondido),
// atualizar(campo, valor), que guarda uma resposta, e idDoTitulo, o id da pergunta
// mostrada no topo da página (o grupo de opções usa esse texto como nome).
export default function EtapaFinalidade({ respostas, atualizar, idDoTitulo }) {
  return (
    <div role="radiogroup" aria-labelledby={idDoTitulo} className="grid gap-3.5 sm:grid-cols-2">
      {FINALIDADES.map((opcao) => (
        <Escolha
          key={opcao.valor}
          nome="finalidade"
          valor={opcao.valor}
          titulo={opcao.titulo}
          descricao={opcao.descricao}
          Icone={ICONES[opcao.valor]}
          marcado={respostas.finalidade === opcao.valor}
          aoMudar={() => atualizar('finalidade', opcao.valor)}
        />
      ))}
    </div>
  )
}
