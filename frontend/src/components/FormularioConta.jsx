// Moldura comum das páginas de conta: título, explicação, área de erro e botão.
// Cada página só precisa informar os campos e o que fazer ao enviar.
export default function FormularioConta({
  titulo,
  explicacao,
  erro,
  enviando,
  textoBotao,
  textoEnviando,
  aoEnviar,
  children,
  rodape,
}) {
  return (
    <div className="mx-auto max-w-md">
      <h1>{titulo}</h1>
      <p className="mt-2 font-lora text-lg leading-relaxed">{explicacao}</p>

      <form
        onSubmit={aoEnviar}
        className="mt-6 flex flex-col gap-5 rounded-lg border border-menta-borda bg-white p-5 sm:p-6"
      >
        {children}

        {/* role="alert" faz o leitor de tela anunciar o erro assim que ele aparece. */}
        {erro && (
          <p role="alert" className="rounded-md border-l-4 border-red-700 bg-red-50 p-3 text-sm text-red-900">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="min-h-12 rounded-md bg-tinta px-6 font-semibold text-white hover:bg-esmeralda-escuro disabled:cursor-wait disabled:opacity-70"
        >
          {enviando ? textoEnviando : textoBotao}
        </button>
      </form>

      {rodape && <div className="mt-5 flex flex-col gap-2 text-sm">{rodape}</div>}
    </div>
  )
}
