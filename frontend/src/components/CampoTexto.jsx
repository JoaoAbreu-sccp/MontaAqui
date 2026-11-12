// Campo de formulário com rótulo e dica opcional, usado nas páginas de conta.
// O htmlFor do rótulo aponta para o id do campo: clicar no texto foca o campo,
// e leitores de tela anunciam o rótulo junto.
export default function CampoTexto({ id, rotulo, dica, ...propsDoInput }) {
  const idDaDica = dica ? `${id}-dica` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        aria-describedby={idDaDica}
        className="min-h-12 rounded-md border-2 border-menta-borda bg-white px-3 text-base focus:border-esmeralda-escuro focus:outline-none"
        {...propsDoInput}
      />
      {dica && (
        <p id={idDaDica} className="text-sm">
          {dica}
        </p>
      )}
    </div>
  )
}
