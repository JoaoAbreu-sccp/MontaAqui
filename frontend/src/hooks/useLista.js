import { useEffect, useState } from 'react'

// Busca uma lista na API e informa se ainda está carregando ou se deu erro.
// Recebe a função de busca (ex.: buscarJogos) e devolve:
//   itens, carregando, erro e tentarDeNovo() para repetir a busca.
export default function useLista(buscar) {
  const [estado, setEstado] = useState({ itens: [], carregando: true, erro: '' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    // Se a pessoa sair da etapa antes de a resposta chegar, o resultado é ignorado.
    let ativo = true

    buscar()
      .then((itens) => {
        if (ativo) setEstado({ itens, carregando: false, erro: '' })
      })
      .catch((falha) => {
        if (ativo) setEstado({ itens: [], carregando: false, erro: falha.message })
      })

    return () => {
      ativo = false
    }
  }, [buscar, tentativa])

  function tentarDeNovo() {
    setEstado({ itens: [], carregando: true, erro: '' })
    setTentativa((anterior) => anterior + 1)
  }

  return { ...estado, tentarDeNovo }
}
