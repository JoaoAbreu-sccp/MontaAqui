/* ============ MontaAqui — Geração + Resultados (até 3 montagens) ============ */
function Generating({onDone}){
  const msgs = ['Analisando seu perfil de uso…','Selecionando as peças ideais…','Verificando compatibilidade…','Otimizando custo-benefício…'];
  const [i,setI] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setI(v=>v+1), 620);
    const done = setTimeout(onDone, 620*msgs.length+200);
    return ()=>{clearInterval(t);clearTimeout(done);};
  },[]);
  return (
    <div className="gen">
      <div className="gen-orb">
        <div className="gen-ring"/><div className="gen-ring gen-ring-2"/>
        <LogoMark size={56}/>
      </div>
      <h2 style={{fontSize:26,marginTop:34}}>Montando pra você…</h2>
      <div className="gen-msgs">
        {msgs.map((m,idx)=>(
          <div key={idx} className={'gen-msg '+(idx<i?'done':idx===i?'now':'')}>
            <span className="gen-dot">{idx<i?<Ic.check/>:idx===i?<span className="spin"/>:''}</span>{m}
          </div>
        ))}
      </div>
      <style>{`
        .gen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);padding:40px}
        .gen-orb{position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center}
        .gen-ring{position:absolute;inset:0;border-radius:50%;border:3px solid var(--lime-200);border-top-color:var(--lime-500);animation:spin 1.1s linear infinite}
        .gen-ring-2{inset:14px;border-color:var(--lime-100);border-top-color:var(--lime-400);animation-duration:1.6s;animation-direction:reverse}
        .gen-msgs{margin-top:30px;display:flex;flex-direction:column;gap:13px;width:min(360px,90vw)}
        .gen-msg{display:flex;align-items:center;gap:12px;font-weight:600;font-size:15px;color:var(--ink-faint);opacity:.5;transition:.4s}
        .gen-msg.now{opacity:1;color:var(--ink)}
        .gen-msg.done{opacity:1;color:var(--lime-700)}
        .gen-dot{width:24px;height:24px;flex:none;border-radius:50%;background:var(--lime-50);display:flex;align-items:center;justify-content:center;color:var(--lime-600)}
        .gen-msg.done .gen-dot{background:var(--lime-400);color:#fff}
        .spin{width:13px;height:13px;border-radius:50%;border:2.5px solid var(--lime-200);border-top-color:var(--lime-600);animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}

function ResultsScreen({builds, prefs, onOpen, onSave, onRestart, savedIds}){
  return (
    <div className="container" style={{padding:'30px 28px 80px'}}>
      <div className="res-head rise">
        <div>
          <div className="chip"><Ic.spark/> {MA.USE_LABEL[prefs.useCase]} · até R$ {prefs.budget.toLocaleString('pt-BR')}</div>
          <h1 style={{fontSize:36,marginTop:16}}>Prontinho! Montamos 3 opções pra você</h1>
          <p className="muted" style={{fontSize:16.5,marginTop:8,maxWidth:620}}>
            Todas com peças 100% compatíveis. Compare lado a lado e abra qualquer uma para ver os detalhes e onde comprar.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onRestart}><Ic.refresh/> Refazer</button>
      </div>

      <div className="res-grid stagger">
        {builds.map(b=>(
          <article key={b.id} className={'build-card '+(b.recommended?'rec':'')}>
            {b.recommended && <div className="build-flag"><Ic.spark/> Recomendada</div>}
            <div className="build-top">
              <h3 style={{fontSize:21}}>{b.philosophy}</h3>
              <p className="muted" style={{fontSize:13.5,marginTop:4,minHeight:38}}>{b.desc}</p>
            </div>

            <div className="build-price">
              <span className="faint" style={{fontSize:14,fontWeight:700}}>R$</span>
              <span className="build-price-num mono-num">{b.total.toLocaleString('pt-BR')}</span>
            </div>
            <div className={'build-budget '+(b.total<=b.budget?'ok':'over')}>
              {b.total<=b.budget
                ? <><Ic.check/> Dentro do orçamento</>
                : <><Ic.info/> R$ {(b.total-b.budget).toLocaleString('pt-BR')} acima</>}
            </div>

            <div className="build-stats">
              <PerfBar label="Desempenho" value={b.perfScore}/>
              <div className="build-meta">
                <div><span className="faint">Compatibilidade</span><b>{b.compat}</b></div>
                <div><span className="faint">~FPS em jogos*</span><b>{b.fps} fps</b></div>
              </div>
            </div>

            <div className="build-parts">
              {b.parts.slice(0,4).map(p=>(
                <div key={p.cat} className="build-part">
                  <span className="bp-ic"><PartIcon type={p.cat}/></span>
                  <span className="bp-name">{p.name}</span>
                </div>
              ))}
              <div className="bp-more">+{b.parts.length-4} outras peças</div>
            </div>

            <div className="build-actions">
              <button className="btn btn-primary btn-block" onClick={()=>onOpen(b)}>Ver montagem <Ic.arrow/></button>
              <button className={'btn btn-icon '+(savedIds.includes(b.id)?'saved':'')} title="Salvar" onClick={()=>onSave(b)}>
                <Ic.heart fill={savedIds.includes(b.id)?'currentColor':'none'}/>
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="faint" style={{fontSize:12.5,marginTop:22,textAlign:'center'}}>* FPS estimado, ilustrativo, varia conforme o jogo e a resolução.</p>

      <style>{`
        .res-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:34px}
        .res-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start}
        .build-card{position:relative;background:#fff;border:1.5px solid var(--line);border-radius:var(--radius-lg);padding:26px;display:flex;flex-direction:column;transition:.2s}
        .build-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
        .build-card.rec{border-color:var(--lime-400);box-shadow:0 14px 40px rgba(23,144,108,.16)}
        .build-flag{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--lime-400);color:#fff;font-family:var(--font-head);font-weight:800;font-size:12.5px;padding:7px 16px;border-radius:99px;display:flex;align-items:center;gap:6px;box-shadow:var(--shadow-lime);white-space:nowrap}
        .build-price{display:flex;align-items:baseline;gap:6px;margin-top:18px}
        .build-price-num{font-family:var(--font-head);font-weight:800;font-size:38px;letter-spacing:-.02em}
        .build-budget{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;margin-top:8px;padding:5px 11px;border-radius:99px;width:fit-content}
        .build-budget.ok{background:var(--lime-50);color:var(--lime-700)}
        .build-budget.over{background:#FBEDE9;color:var(--danger)}
        .build-stats{margin:20px 0;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:14px}
        .build-meta{display:flex;gap:10px}
        .build-meta>div{flex:1;display:flex;flex-direction:column;gap:2px}
        .build-meta .faint{font-size:11.5px;font-weight:600}
        .build-meta b{font-family:var(--font-head);font-size:15px}
        .build-parts{display:flex;flex-direction:column;gap:9px;margin-bottom:22px}
        .build-part{display:flex;align-items:center;gap:10px}
        .bp-ic{width:30px;height:30px;flex:none;border-radius:9px;background:var(--lime-50);color:var(--lime-700);display:flex;align-items:center;justify-content:center}
        .bp-ic svg{width:17px;height:17px}
        .bp-name{font-size:13px;font-weight:600;color:var(--ink-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .bp-more{font-size:12.5px;font-weight:700;color:var(--lime-600);padding-left:40px}
        .build-actions{display:flex;gap:9px;margin-top:auto}
        .btn-icon{width:46px;height:46px;flex:none;border-radius:50%;background:var(--lime-50);color:var(--lime-600);display:flex;align-items:center;justify-content:center;transition:.18s}
        .btn-icon:hover{background:var(--lime-100)}
        .btn-icon.saved{background:var(--lime-400);color:#fff}
        @media(max-width:880px){.res-grid{grid-template-columns:1fr}.res-head{flex-direction:column}}
      `}</style>
    </div>
  );
}
Object.assign(window, { Generating, ResultsScreen });
