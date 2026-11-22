// Barra de progresso do questionário, com o texto "Passo X de Y" ao lado.
// O total de passos muda com a finalidade (Jogos e Edição ganham perguntas a mais).
// role="progressbar" faz o leitor de tela anunciar o andamento.
export default function Progresso({ passoAtual, totalDePassos }) {
  const porcentagem = (passoAtual / totalDePassos) * 100

  return (
    <div className="flex flex-1 items-center gap-3.5">
      <div
        role="progressbar"
        aria-label="Andamento do questionário"
        aria-valuemin={1}
        aria-valuemax={totalDePassos}
        aria-valuenow={passoAtual}
        aria-valuetext={`Passo ${passoAtual} de ${totalDePassos}`}
        className="h-2 flex-1 overflow-hidden rounded-full bg-menta-forte"
      >
        <div
          className="h-full rounded-full bg-esmeralda transition-[width] duration-500 ease-out"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
      <span aria-hidden="true" className="text-sm font-semibold whitespace-nowrap text-tinta-suave">
        Passo {passoAtual} de {totalDePassos}
      </span>
    </div>
  )
}
