import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { listarSetups, removerSetup } from '../services/setups'
import CartaoSetup from './CartaoSetup'
import { IconeSeta } from './Icones'
import EstadoDaLista from './questionario/EstadoDaLista'

const formatadorDeData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })

// Histórico de setups salvos (RF08), mostrado no Perfil.
// Só deve ser usado quando a pessoa está logada: a busca precisa do token.
export default function MeusSetups() {
  const { token, sair } = useAuth()
  const [setups, setSetups] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  // Busca a lista ao abrir a página e a cada "Tentar de novo" (tentativa muda).
  useEffect(() => {
    let ativo = true // evita atualizar a tela se a pessoa já saiu da página
    listarSetups(token)
      .then((lista) => {
        if (ativo) setSetups(lista)
      })
      .catch((falha) => {
        if (!ativo) return
        // 401: o login venceu (o token dura 1 dia). Saindo da conta, aparece o convite para entrar.
        if (falha.status === 401) sair()
        else setErro(falha.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [token, tentativa, sair])

  // Depois que a API confirma, o setup some da tela sem precisar buscar a lista de novo.
  function tirarDaLista(idDoSetup) {
    setSetups((atual) => atual.filter((setup) => setup.id !== idDoSetup))
  }

  function tentarDeNovo() {
    setErro('')
    setCarregando(true)
    setTentativa(tentativa + 1)
  }

  return (
    <section aria-labelledby="titulo-meus-setups" className="flex flex-col gap-5">
      <h2 id="titulo-meus-setups" className="text-2xl">
        Meus setups salvos
      </h2>

      <EstadoDaLista carregando={carregando} erro={erro} vazia={false} tentarDeNovo={tentarDeNovo}>
        {setups.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-[18px] border border-linha bg-white p-6 shadow-suave">
            <p className="font-lora text-lg leading-relaxed text-tinta-suave">
              Você ainda não salvou nenhum setup. Responda ao questionário e salve as montagens de que gostar.
            </p>
            <Link
              to="/questionario"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-esmeralda px-7 text-[1.1rem] font-bold text-white shadow-marca hover:bg-esmeralda-escuro"
            >
              Montar meu PC <IconeSeta tamanho={20} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-3">
            {setups.map((setup) => (
              <CartaoSetup
                key={setup.id}
                setup={setup}
                acao={
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-tinta-suave">
                      {setup.finalidade} · salvo em {formatadorDeData.format(new Date(setup.data_criacao))}
                    </p>
                    <BotaoRemover setup={setup} aoRemover={tirarDaLista} />
                  </div>
                }
              />
            ))}
          </div>
        )}
      </EstadoDaLista>
    </section>
  )
}

// Remove um setup salvo, pedindo confirmação antes, porque não tem como desfazer.
function BotaoRemover({ setup, aoRemover }) {
  const { token, sair } = useAuth()
  const [removendo, setRemovendo] = useState(false)
  const [erro, setErro] = useState('')

  async function remover() {
    if (!window.confirm(`Remover o setup "${setup.categoria}"? Essa ação não pode ser desfeita.`)) return

    setErro('')
    setRemovendo(true)
    try {
      await removerSetup(setup.id, token)
      aoRemover(setup.id)
    } catch (falha) {
      setRemovendo(false)
      // 401: o login venceu. Saindo da conta, aparece o convite para entrar de novo.
      if (falha.status === 401) sair()
      // 404: o setup já não existe (ex.: removido em outra aba). Basta tirá-lo da tela.
      else if (falha.status === 404) aoRemover(setup.id)
      else setErro(falha.message)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={remover}
        disabled={removendo}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-linha px-5 font-bold text-tinta-suave hover:border-tinta-suave disabled:opacity-60"
      >
        {removendo ? 'Removendo...' : 'Remover setup'}
      </button>
      {erro && (
        <p role="alert" className="text-sm font-semibold">
          {erro}
        </p>
      )}
    </div>
  )
}
