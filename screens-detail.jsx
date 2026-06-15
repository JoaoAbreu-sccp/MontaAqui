/* ============ MontaAqui — Detalhe da montagem ============ */
function DetailScreen({build, onBack, onSave, saved}){
  const [openPart, setOpenPart] = useState(build.parts[0].cat);
  const storeUrl = (store)=> 'https://www.google.com/search?q='+encodeURIComponent(store+' '+'comprar');

  return (
    <div className="container" style={{padding:'26px 28px 90px'}}>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginBottom:22}}><Ic.back/> Voltar às opções</button>

      <div className="detail-grid">
        {/* Coluna principal — peças */}
        <div className="rise">
          <div className="detail-hero">
            <div>
              <span className="tag" style={{background:'var(--lime-100)',color:'var(--lime-700)'}}>{build.tag}</span>
              <h1 style={{fontSize:33,marginTop:12}}>Montagem {build.philosophy}</h1>
              <p className="muted" style={{fontSize:16,marginTop:6}}>Otimizada para <b style={{color:'var(--ink)'}}>{MA.USE_LABEL[build.useCase]}</b>. Toque em cada peça para entender a escolha.</p>
            </div>
          </div>

          <div className="parts-list">
            {build.parts.map(p=>(
              <div key={p.cat} className={'part-row '+(openPart===p.cat?'open':'')}>
                <button className="part-head" onClick={()=>setOpenPart(openPart===p.cat?null:p.cat)}>
                  <span className="part-ic"><PartIcon type={p.cat}/></span>
                  <span className="part-info">
                    <span className="part-cat">{MA.CAT_LABEL[p.cat]}</span>
                    <span className="part-name">{p.name}</span>
                  </span>
                  <span className="part-right">
                    <span className="part-price mono-num">{p.price>0?('R$ '+p.price.toLocaleString('pt-BR')):'Incluso'}</span>
                    <span className={'part-chev '+(openPart===p.cat?'up':'')}><Ic.arrow/></span>
                  </span>
                </button>
                {openPart===p.cat && (
                  <div className="part-body fade-in">
                    <div className="part-explain">
                      <div className="pe-block">
                        <span className="pe-label"><Ic.info/> O que é</span>
                        <p>{p.what}</p>
                      </div>
                      <div className="pe-block">
                        <span className="pe-label" style={{color:'var(--lime-700)'}}><Ic.spark/> Por que escolhemos</span>
                        <p>{p.why}</p>
                      </div>
                    </div>
                    {p.price>0 && (
                      <div className="part-stores">
                        <span className="faint" style={{fontSize:12.5,fontWeight:700}}>Onde comprar:</span>
                        <div className="store-btns">
                          {MA.STORES.map(s=>(
                            <a key={s} className="store-btn" href={storeUrl(s+' '+p.name)} target="_blank" rel="noreferrer">
                              <Ic.store/> {s} <Ic.ext/>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coluna lateral — resumo */}
        <aside className="detail-side rise">
          <div className="side-card">
            <div className="side-total">
              <span className="faint" style={{fontSize:13.5,fontWeight:700}}>Total da montagem</span>
              <div className="side-price">
                <span className="faint" style={{fontSize:16,fontWeight:700}}>R$</span>
                <span className="mono-num">{build.total.toLocaleString('pt-BR')}</span>
              </div>
              <div className={'build-budget '+(build.total<=build.budget?'ok':'over')} style={{marginTop:4}}>
                {build.total<=build.budget?<><Ic.check/> Dentro do seu orçamento</>:<><Ic.info/> Acima do orçamento</>}
              </div>
            </div>

            <div className="side-stats">
              <PerfBar label="Desempenho" value={build.perfScore}/>
              <div className="side-row"><span className="faint"><Ic.check/> Compatibilidade</span><b>{build.compat}</b></div>
              <div className="side-row"><span className="faint"><Ic.bolt/> FPS estimado</span><b>{build.fps} fps</b></div>
              <div className="side-row"><span className="faint"><Ic.cpu/> Total de peças</span><b>{build.parts.length} itens</b></div>
            </div>

            <button className="btn btn-primary btn-block btn-lg" onClick={onSave}>
              <Ic.heart fill={saved?'currentColor':'none'}/> {saved?'Salva no painel':'Salvar montagem'}
            </button>
            <a className="btn btn-dark btn-block" href={storeUrl('montar pc '+build.philosophy)} target="_blank" rel="noreferrer" style={{marginTop:10}}>
              <Ic.store/> Comprar tudo nas lojas <Ic.ext/>
            </a>
            <p className="faint center" style={{fontSize:11.5,marginTop:14,lineHeight:1.5}}>
              Os preços são estimativas e podem variar nas lojas. O MontaAqui direciona você até os parceiros.
            </p>
          </div>
        </aside>
      </div>

      <style>{`
        .detail-grid{display:grid;grid-template-columns:1fr 360px;gap:28px;align-items:start}
        .detail-hero{margin-bottom:24px}
        .parts-list{display:flex;flex-direction:column;gap:11px}
        .part-row{background:#fff;border:1.5px solid var(--line);border-radius:var(--radius);overflow:hidden;transition:.18s}
        .part-row.open{border-color:var(--lime-300);box-shadow:var(--shadow)}
        .part-head{width:100%;display:flex;align-items:center;gap:15px;padding:17px 20px;text-align:left}
        .part-ic{width:46px;height:46px;flex:none;border-radius:13px;background:var(--lime-50);color:var(--lime-700);display:flex;align-items:center;justify-content:center}
        .part-info{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
        .part-cat{font-size:12px;font-weight:700;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em}
        .part-name{font-family:var(--font-head);font-weight:600;font-size:15.5px;color:var(--ink)}
        .part-right{display:flex;align-items:center;gap:14px}
        .part-price{font-family:var(--font-head);font-weight:700;font-size:15px;color:var(--ink);white-space:nowrap}
        .part-chev{color:var(--ink-faint);transform:rotate(90deg);transition:.2s}
        .part-chev.up{transform:rotate(-90deg);color:var(--lime-600)}
        .part-body{padding:0 20px 20px 81px;border-top:1px solid var(--line);margin-top:2px;padding-top:18px}
        .part-explain{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .pe-block{display:flex;flex-direction:column;gap:6px}
        .pe-label{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:var(--ink-soft)}
        .pe-block p{font-size:14px;color:var(--ink-soft);line-height:1.5}
        .part-stores{margin-top:18px;padding-top:16px;border-top:1px dashed var(--line-strong);display:flex;flex-direction:column;gap:10px}
        .store-btns{display:flex;gap:9px;flex-wrap:wrap}
        .store-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:99px;background:var(--lime-50);border:1px solid var(--lime-200);color:var(--lime-700);font-weight:700;font-size:13.5px;transition:.16s}
        .store-btn:hover{background:var(--lime-100);transform:translateY(-1px)}
        .detail-side{position:sticky;top:92px}
        .side-card{background:#fff;border:1.5px solid var(--line);border-radius:var(--radius-lg);padding:26px;box-shadow:var(--shadow)}
        .side-total{padding-bottom:20px;border-bottom:1px solid var(--line)}
        .side-price{display:flex;align-items:baseline;gap:6px;margin-top:4px;font-family:var(--font-head);font-weight:800;font-size:40px;letter-spacing:-.02em}
        .side-stats{display:flex;flex-direction:column;gap:13px;padding:20px 0}
        .side-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .side-row .faint{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;white-space:nowrap}
        .side-row b{font-family:var(--font-head);font-size:15px;white-space:nowrap}
        @media(max-width:880px){.detail-grid{grid-template-columns:1fr}.detail-side{position:static}.part-explain{grid-template-columns:1fr}.part-body{padding-left:20px}}
      `}</style>
    </div>
  );
}
Object.assign(window, { DetailScreen });
