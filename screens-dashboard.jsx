/* ============ MontaAqui — Painel do usuário (montagens salvas) ============ */
function Dashboard({user, saved, onNew, onOpen, onRemove}){
  const totalInvest = saved.reduce((a,b)=>a+b.total,0);
  return (
    <div className="container" style={{padding:'34px 28px 90px'}}>
      <div className="dash-head rise">
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <Avatar name={user.name} size={56}/>
          <div>
            <h1 style={{fontSize:30}}>Olá, {user.name.split(' ')[0]}!</h1>
            <p className="muted" style={{fontSize:15.5,marginTop:3}}>Aqui ficam suas montagens salvas, prontas para revisar ou comprar.</p>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onNew}><Ic.plus/> Nova montagem</button>
      </div>

      <div className="dash-stats rise">
        <div className="dstat"><span className="dstat-num mono-num">{saved.length}</span><span className="dstat-lbl">Montagens salvas</span></div>
        <div className="dstat"><span className="dstat-num mono-num">{saved.length?('R$ '+Math.round(totalInvest/saved.length).toLocaleString('pt-BR')):'—'}</span><span className="dstat-lbl">Investimento médio</span></div>
        <div className="dstat"><span className="dstat-num mono-num">{saved.length?MA.USE_LABEL[saved[0].useCase].split(' ')[0]:'—'}</span><span className="dstat-lbl">Último objetivo</span></div>
      </div>

      <h2 style={{fontSize:21,margin:'34px 0 18px'}}>Suas montagens</h2>

      {saved.length===0 ? (
        <div className="empty rise">
          <div className="empty-ic"><LogoMark size={44}/></div>
          <h3 style={{fontSize:20,marginTop:18}}>Você ainda não salvou nenhuma montagem</h3>
          <p className="muted" style={{fontSize:15,marginTop:6,maxWidth:420,textAlign:'center'}}>Responda algumas perguntas e o MontaAqui cria a configuração ideal pra você em segundos.</p>
          <button className="btn btn-primary btn-lg" onClick={onNew} style={{marginTop:22}}><Ic.spark/> Montar meu PC</button>
        </div>
      ) : (
        <div className="saved-grid stagger">
          {saved.map(b=>(
            <article key={b.savedAt} className="saved-card">
              <div className="saved-top">
                <span className="tag" style={{background:'var(--lime-100)',color:'var(--lime-700)'}}>{MA.USE_LABEL[b.useCase]}</span>
                <button className="saved-del" title="Remover" onClick={()=>onRemove(b.savedAt)}><Ic.trash/></button>
              </div>
              <h3 style={{fontSize:18,marginTop:12}}>Montagem {b.philosophy}</h3>
              <div className="saved-price"><span className="faint" style={{fontSize:13,fontWeight:700}}>R$</span><span className="mono-num">{b.total.toLocaleString('pt-BR')}</span></div>
              <div className="saved-parts">
                {b.parts.slice(0,3).map(p=>(
                  <span key={p.cat} className="saved-chip"><PartIcon type={p.cat}/> {p.name.split(' ').slice(0,2).join(' ')}</span>
                ))}
              </div>
              <div className="saved-meta">
                <span className="faint"><Ic.bolt/> {b.fps} fps</span>
                <span className="faint"><Ic.check/> {b.compat}</span>
              </div>
              <button className="btn btn-soft btn-block" onClick={()=>onOpen(b)} style={{marginTop:16}}>Abrir detalhes <Ic.arrow/></button>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .dash-head{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:28px;flex-wrap:wrap}
        .dash-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .dstat{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:22px 24px;box-shadow:var(--shadow-sm)}
        .dstat-num{display:block;font-family:var(--font-head);font-weight:800;font-size:30px;color:var(--ink);letter-spacing:-.02em}
        .dstat-lbl{font-size:13.5px;font-weight:600;color:var(--ink-soft);margin-top:2px;display:block}
        .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 30px;background:#fff;border:1.5px dashed var(--line-strong);border-radius:var(--radius-lg)}
        .empty-ic{width:84px;height:84px;border-radius:24px;background:var(--lime-50);display:flex;align-items:center;justify-content:center;border:1px solid var(--lime-200)}
        .saved-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .saved-card{background:#fff;border:1.5px solid var(--line);border-radius:var(--radius-lg);padding:22px;transition:.2s}
        .saved-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--lime-200)}
        .saved-top{display:flex;justify-content:space-between;align-items:center}
        .saved-del{width:34px;height:34px;border-radius:50%;color:var(--ink-faint);display:flex;align-items:center;justify-content:center;transition:.16s}
        .saved-del:hover{background:#FBEDE9;color:var(--danger)}
        .saved-price{display:flex;align-items:baseline;gap:5px;margin-top:6px;font-family:var(--font-head);font-weight:800;font-size:27px;letter-spacing:-.02em}
        .saved-parts{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}
        .saved-chip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:var(--ink-soft);background:var(--lime-50);padding:5px 10px;border-radius:99px}
        .saved-chip svg{width:13px;height:13px;color:var(--lime-600)}
        .saved-meta{display:flex;gap:16px;margin-top:14px}
        .saved-meta .faint{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700}
        .saved-meta svg{color:var(--lime-600)}
        @media(max-width:880px){.dash-stats,.saved-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
Object.assign(window, { Dashboard });
