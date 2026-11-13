// Setups: gerar a partir do questionário, salvar e listar os salvos.
//
// Rotas do backend (backend/apps/montagens/views.py):
//   POST /api/setups/gerar/  respostas do questionário -> { questionario, setups, preco_minimo }
//   POST /api/setups/        { questionario, categoria, cpu, placamae, ... } -> setup salvo (exige login)
//   GET  /api/setups/        -> setups salvos da pessoa logada (exige login)
//
// Cada setup traz: categoria, preco, pecas (nome, preço, detalhe e links das lojas) e,
// quando acabou de ser gerado, resumo (frases curtas) e ids (das peças, para salvar).

import { chamarApi } from './cliente'

export function gerarSetups(questionario) {
  return chamarApi('/setups/gerar/', { metodo: 'POST', dados: questionario })
}

// Visitantes geram setups, mas só quem está logado salva (RF08): por isso o token.
export function salvarSetup(idDoQuestionario, setup, token) {
  return chamarApi('/setups/', {
    metodo: 'POST',
    dados: { questionario: idDoQuestionario, categoria: setup.categoria, ...setup.ids },
    token,
  })
}

export function listarSetups(token) {
  return chamarApi('/setups/', { token })
}
