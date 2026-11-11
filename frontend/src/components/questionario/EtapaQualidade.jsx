import { FPS, RESOLUCOES } from '../../dados/opcoesQuestionario'
import Escolha from './Escolha'

// Só para a finalidade Jogos: resolução e FPS ficam na mesma tela porque
// respondem juntas a uma pergunta só (como a imagem do jogo vai ficar)
// e uma depende da outra na hora de escolher a placa de vídeo.
export default function EtapaQualidade({ respostas, atualizar }) {
  return (
    <div className="flex flex-col gap-10">
      <fieldset>
        <legend className="text-lg font-bold">Resolução</legend>
        <p className="mt-1 font-lora text-tinta-suave">
          Se não souber, escolha Full HD. É a da maioria dos monitores.
        </p>
        <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
          {RESOLUCOES.map((opcao) => (
            <Escolha
              key={opcao.valor}
              nome="resolucao_alvo"
              valor={opcao.valor}
              titulo={opcao.titulo}
              descricao={opcao.descricao}
              marcado={respostas.resolucao_alvo === opcao.valor}
              aoMudar={() => atualizar('resolucao_alvo', opcao.valor)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-bold">Quadros por segundo (FPS)</legend>
        <p className="mt-1 font-lora text-tinta-suave">
          Quanto mais FPS, mais suave fica o movimento na tela.
        </p>
        <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
          {FPS.map((opcao) => (
            <Escolha
              key={opcao.valor}
              nome="fps_alvo"
              valor={opcao.valor}
              titulo={opcao.titulo}
              descricao={opcao.descricao}
              marcado={respostas.fps_alvo === opcao.valor}
              aoMudar={() => atualizar('fps_alvo', opcao.valor)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
