/* ============ MontaAqui — Assistente inteligente (questionário) ============ */
function Wizard({onComplete, onBack, user}){
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ useCase:null, budget:6000, brand:'tanto', priority:null,
    resolution:null, fps:null, games:[], programs:[] });

  const set = (k,v)=> setData(d=>({...d,[k]:v}));
  const toggle = (k,v)=> setData(d=>{ const a=d[k]||[]; return {...d,[k]:a.includes(v)?a.filter(x=>x!==v):[...a,v]}; });

  const useOptions = [
    {k:'jogos', label:'Jogos', desc:'Rodar games atuais com bom FPS', icon:'game'},
    {k:'trabalho', label:'Trabalho & Escritório', desc:'Tarefas do dia a dia, reuniões, navegador', icon:'work'},
    {k:'edicao', label:'Edição & Criação', desc:'Vídeo, foto, 3D e design', icon:'film'},
    {k:'estudos', label:'Estudos & Uso geral', desc:'Estudar, pesquisar, uso doméstico', icon:'book'},
    {k:'streaming', label:'Streaming & Lives', desc:'Transmitir e gravar com qualidade', icon:'signal'},
  ];
  const resOptions = [
    {k:'1080p', label:'Full HD', sub:'1920 × 1080 — o mais comum'},
    {k:'1440p', label:'Quad HD', sub:'2560 × 1440 — mais nitidez'},
    {k:'2160p', label:'4K Ultra HD', sub:'3840 × 2160 — máxima resolução'},
  ];
  const fpsOptions = [
    {k:'60', label:'60 FPS', sub:'Fluido para a maioria dos jogos'},
    {k:'120', label:'120 FPS', sub:'Bem suave, ótimo para ação'},
    {k:'144', label:'144+ FPS', sub:'Competitivo, máxima resposta'},
  ];
  const gamesList = [
    {k:'valorant', label:'Valorant', w:1}, {k:'lol', label:'League of Legends', w:1},
    {k:'cs2', label:'Counter-Strike 2', w:1}, {k:'fortnite', label:'Fortnite', w:2},
    {k:'minecraft', label:'Minecraft', w:1}, {k:'gta5', label:'GTA V', w:2},
    {k:'fc25', label:'EA FC 25', w:2}, {k:'rocket', label:'Rocket League', w:1},
    {k:'warzone', label:'COD: Warzone', w:3}, {k:'cyberpunk', label:'Cyberpunk 2077', w:3},
    {k:'elden', label:'Elden Ring', w:3}, {k:'rdr2', label:'Red Dead 2', w:3},
    {k:'bg3', label:"Baldur's Gate 3", w:3}, {k:'forza', label:'Forza Horizon 5', w:2},
    {k:'witcher', label:'The Witcher 3', w:2}, {k:'starfield', label:'Starfield', w:3},
  ];
  const programsList = [
    {k:'photoshop', label:'Photoshop'}, {k:'illustrator', label:'Illustrator'},
    {k:'lightroom', label:'Lightroom'}, {k:'premiere', label:'Premiere Pro'},
    {k:'afterfx', label:'After Effects'}, {k:'davinci', label:'DaVinci Resolve'},
    {k:'vegas', label:'Sony Vegas'}, {k:'blender', label:'Blender'},
    {k:'c4d', label:'Cinema 4D'}, {k:'autocad', label:'AutoCAD'},
    {k:'maya', label:'Maya'}, {k:'obs', label:'OBS Studio'},
  ];
  const priorityOptions = [
    {k:'desempenho', label:'Máximo desempenho', desc:'Quero potência, mesmo gastando mais'},
    {k:'equilibrio', label:'Equilíbrio', desc:'Bom desempenho por um preço justo'},
    {k:'economia', label:'Economia', desc:'O essencial pelo menor custo'},
  ];

  const budgetLabels = [[1500,'Básico'],[3500,'Intermediário'],[6000,'Avançado'],[9000,'Entusiasta'],[15000,'Top de linha']];
  function budgetTier(v){ let t='Básico'; for(const [p,l] of budgetLabels){ if(v>=p) t=l; } return t; }

  /* ---- montagem dinâmica dos passos conforme o uso ---- */
  function SelGrid({options, sel, onPick, cols=3}){
    return (
      <div className={'wiz-grid '+(cols===3?'wiz-grid-3':'')}>
        {options.map(o=>(
          <button key={o.k} className={'opt-card '+(sel===o.k?'sel':'')} onClick={()=>onPick(o.k)}>
            <span className="opt-label" style={{fontSize:o.sub?19:17,marginTop:o.sub?2:0}}>{o.label}</span>
            <span className="opt-desc">{o.sub||o.desc}</span>
            {sel===o.k && <span className="opt-check"><Ic.check/></span>}
          </button>
        ))}
      </div>
    );
  }
  function CheckGrid({options, sel, onToggle}){
    return (
      <div className="check-grid">
        {options.map(o=>{
          const on = sel.includes(o.k);
          return (
            <button key={o.k} className={'check-item '+(on?'on':'')} onClick={()=>onToggle(o.k)}>
              <span className="check-box">{on && <Ic.check/>}</span>
              <span className="check-label">{o.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const steps = [];
  steps.push({
    title:'Pra que você vai usar o PC?', subtitle:'Isso define quais peças são mais importantes pra você.',
    valid:()=>!!data.useCase,
    body:()=> (
      <div className="wiz-grid stagger">
        {useOptions.map(o=>{ const Icon = Ic[o.icon]; return (
          <button key={o.k} className={'opt-card '+(data.useCase===o.k?'sel':'')} onClick={()=>set('useCase',o.k)}>
            <span className="opt-ic-badge"><Icon/></span>
            <span className="opt-label">{o.label}</span>
            <span className="opt-desc">{o.desc}</span>
            {data.useCase===o.k && <span className="opt-check"><Ic.check/></span>}
          </button>
        );})}
      </div>
    ),
  });

  if(data.useCase==='jogos'){
    steps.push({ title:'Em qual resolução você quer jogar?', subtitle:'Quanto maior a resolução, mais potente precisa ser a placa de vídeo.',
      valid:()=>!!data.resolution, body:()=> <SelGrid options={resOptions} sel={data.resolution} onPick={v=>set('resolution',v)}/> });
    steps.push({ title:'Quantos FPS você deseja?', subtitle:'FPS é a fluidez da imagem. Mais FPS pede mais desempenho.',
      valid:()=>!!data.fps, body:()=> <SelGrid options={fpsOptions} sel={data.fps} onPick={v=>set('fps',v)}/> });
    steps.push({ title:'Quais jogos você quer rodar?', subtitle:'Marque os que pretende jogar — usamos os mais pesados para calibrar a montagem.',
      valid:()=>data.games.length>0, body:()=> <CheckGrid options={gamesList} sel={data.games} onToggle={v=>toggle('games',v)}/> });
  }
  if(data.useCase==='edicao'){
    steps.push({ title:'Quais programas você vai usar?', subtitle:'Marque os softwares de edição e criação que fazem parte do seu fluxo.',
      valid:()=>data.programs.length>0, body:()=> <CheckGrid options={programsList} sel={data.programs} onToggle={v=>toggle('programs',v)}/> });
  }

  steps.push({
    title:'Qual é o seu orçamento?', subtitle:'Arraste para definir quanto pretende investir. Você pode ajustar depois.',
    valid:()=>data.budget>=1500,
    body:()=> (
      <div className="budget-box">
        <div className="budget-value">
          <span className="faint" style={{fontSize:15,fontWeight:700}}>R$</span>
          <span className="budget-num mono-num">{data.budget.toLocaleString('pt-BR')}</span>
          <span className="budget-tier">{budgetTier(data.budget)}</span>
        </div>
        <input type="range" min="1500" max="15000" step="250" value={data.budget}
          onChange={e=>set('budget',+e.target.value)} className="slider"
          style={{'--p':((data.budget-1500)/(15000-1500)*100)+'%'}}/>
        <div className="budget-scale"><span>R$ 1.500</span><span>R$ 8.000</span><span>R$ 15.000</span></div>
        <div className="budget-quick">
          {[3000,5000,7500,10000].map(v=>(
            <button key={v} className={'btn btn-sm '+(data.budget===v?'btn-soft':'btn-ghost')} onClick={()=>set('budget',v)}>R$ {v.toLocaleString('pt-BR')}</button>
          ))}
        </div>
      </div>
    ),
  });

  steps.push({
    title:'Tem preferência de processador?', subtitle:'Sem problema se você não souber — deixe no automático.',
    valid:()=>!!data.brand,
    body:()=> (
      <div className="wiz-grid wiz-grid-3">
        {[{k:'amd',label:'AMD',desc:'Forte em jogos e custo-benefício'},{k:'intel',label:'Intel',desc:'Ótimo em produtividade'},{k:'tanto',label:'Tanto faz',desc:'Deixe o MontaAqui decidir',rec:true}].map(o=>(
          <button key={o.k} className={'opt-card '+(data.brand===o.k?'sel':'')} onClick={()=>set('brand',o.k)}>
            {o.rec && <span className="opt-rec">Recomendado</span>}
            <span className="opt-label" style={{fontSize:20,marginTop:4}}>{o.label}</span>
            <span className="opt-desc">{o.desc}</span>
            {data.brand===o.k && <span className="opt-check"><Ic.check/></span>}
          </button>
        ))}
      </div>
    ),
  });

  steps.push({
    title:'O que pesa mais na sua escolha?', subtitle:'Vamos calibrar as montagens de acordo com sua prioridade.',
    valid:()=>!!data.priority,
    body:()=> <SelGrid options={priorityOptions} sel={data.priority} onPick={v=>set('priority',v)}/>,
  });

  const safeStep = Math.min(step, steps.length-1);
  const cur = steps[safeStep];
  const progress = ((safeStep+1)/steps.length)*100;
  const isLast = safeStep===steps.length-1;

  function next(){ if(!isLast) setStep(safeStep+1); else onComplete(data); }
  function back(){ if(safeStep===0) onBack(); else setStep(safeStep-1); }

  return (
    <div className="wiz">
      <div className="wiz-head">
        <button className="btn btn-ghost btn-sm" onClick={back}>
          <Ic.back/> {safeStep===0?'Início':'Voltar'}
        </button>
        <div className="wiz-prog">
          <div className="wiz-prog-bar"><div style={{width:progress+'%'}}/></div>
          <span className="faint" style={{fontSize:12.5,fontWeight:700,whiteSpace:'nowrap'}}>Passo {safeStep+1} de {steps.length}</span>
        </div>
        <div style={{width:96}}/>
      </div>

      <div className="wiz-body">
        <div className="wiz-assistant fade-in" key={'a'+safeStep}>
          <div className="wiz-avatar"><LogoMark size={30}/></div>
          <div>
            <h2 style={{fontSize:30}}>{cur.title}</h2>
            <p className="muted" style={{fontSize:16,marginTop:7}}>{cur.subtitle}</p>
          </div>
        </div>
        <div className="wiz-content rise" key={'c'+safeStep}>{cur.body()}</div>
      </div>

      <div className="wiz-foot">
        <div className="container" style={{display:'flex',justifyContent:'flex-end'}}>
          <button className="btn btn-primary btn-lg" disabled={!cur.valid()} onClick={next}>
            {isLast ? <>Gerar minhas montagens <Ic.spark/></> : <>Continuar <Ic.arrow/></>}
          </button>
        </div>
      </div>

      <style>{`
        .wiz{min-height:100vh;display:flex;flex-direction:column;background:var(--bg)}
        .wiz-head{display:flex;align-items:center;gap:20px;padding:20px 28px;max-width:var(--maxw);margin:0 auto;width:100%}
        .wiz-prog{flex:1;display:flex;align-items:center;gap:14px}
        .wiz-prog-bar{flex:1;height:8px;background:var(--lime-100);border-radius:99px;overflow:hidden}
        .wiz-prog-bar>div{height:100%;background:linear-gradient(90deg,var(--lime-500),var(--lime-400));border-radius:99px;transition:width .5s cubic-bezier(.2,.7,.2,1)}
        .wiz-body{flex:1;max-width:920px;margin:0 auto;width:100%;padding:24px 28px 120px;display:flex;flex-direction:column}
        .wiz-assistant{display:flex;gap:16px;align-items:flex-start;margin:18px 0 30px}
        .wiz-avatar{width:52px;height:52px;flex:none;border-radius:16px;background:var(--lime-100);display:flex;align-items:center;justify-content:center;border:1px solid var(--lime-200)}
        .wiz-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        .wiz-grid-3{grid-template-columns:repeat(3,1fr)}
        .opt-card{position:relative;text-align:left;background:#fff;border:2px solid var(--line);border-radius:var(--radius);padding:22px;display:flex;flex-direction:column;gap:5px;transition:.18s;cursor:pointer}
        .opt-card:hover{border-color:var(--lime-300);transform:translateY(-2px);box-shadow:var(--shadow)}
        .opt-card.sel{border-color:var(--lime-400);background:var(--lime-50);box-shadow:var(--shadow-lime)}
        .opt-ic-badge{width:48px;height:48px;border-radius:14px;background:var(--lime-50);color:var(--lime-600);display:flex;align-items:center;justify-content:center;margin-bottom:4px;border:1px solid var(--lime-100)}
        .opt-card.sel .opt-ic-badge{background:var(--lime-400);color:#fff;border-color:var(--lime-400)}
        .opt-label{font-family:var(--font-head);font-weight:700;font-size:17px;color:var(--ink)}
        .opt-desc{font-size:13.5px;color:var(--ink-soft);line-height:1.4}
        .opt-check{position:absolute;top:16px;right:16px;width:26px;height:26px;border-radius:50%;background:var(--lime-400);color:#fff;display:flex;align-items:center;justify-content:center;animation:pop .25s both}
        .opt-rec{position:absolute;top:14px;right:14px;background:var(--lime-200);color:var(--lime-700);font-size:11px;font-weight:800;padding:4px 9px;border-radius:99px}
        .check-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}
        .check-item{display:flex;align-items:center;gap:12px;text-align:left;background:#fff;border:2px solid var(--line);border-radius:var(--radius-sm);padding:14px 16px;transition:.16s;cursor:pointer}
        .check-item:hover{border-color:var(--lime-300);background:var(--lime-50)}
        .check-item.on{border-color:var(--lime-400);background:var(--lime-50)}
        .check-box{width:24px;height:24px;flex:none;border-radius:7px;border:2px solid var(--line-strong);background:#fff;display:flex;align-items:center;justify-content:center;color:#fff;transition:.16s}
        .check-item.on .check-box{background:var(--lime-400);border-color:var(--lime-400)}
        .check-box svg{width:15px;height:15px}
        .check-label{font-family:var(--font-head);font-weight:600;font-size:14.5px;color:var(--ink)}
        .budget-box{background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg);padding:38px;box-shadow:var(--shadow-sm)}
        .budget-value{display:flex;align-items:baseline;gap:12px;justify-content:center;margin-bottom:30px}
        .budget-num{font-family:var(--font-head);font-weight:800;font-size:56px;color:var(--ink);letter-spacing:-.02em}
        .budget-tier{background:var(--lime-100);color:var(--lime-700);font-weight:800;font-size:13px;padding:6px 13px;border-radius:99px;align-self:center}
        .slider{-webkit-appearance:none;width:100%;height:10px;border-radius:99px;background:linear-gradient(90deg,var(--lime-400) var(--p),var(--lime-100) var(--p));outline:none}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:#fff;border:4px solid var(--lime-500);box-shadow:var(--shadow);cursor:grab}
        .slider::-webkit-slider-thumb:active{cursor:grabbing;transform:scale(1.08)}
        .slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:#fff;border:4px solid var(--lime-500);cursor:grab}
        .budget-scale{display:flex;justify-content:space-between;margin-top:12px;color:var(--ink-faint);font-size:12.5px;font-weight:600}
        .budget-quick{display:flex;gap:9px;justify-content:center;margin-top:26px;flex-wrap:wrap}
        .wiz-foot{position:fixed;bottom:0;left:0;right:0;padding:16px 0;background:linear-gradient(transparent,var(--bg) 30%)}
        @media(max-width:720px){.wiz-grid,.wiz-grid-3,.check-grid{grid-template-columns:1fr}.budget-num{font-size:42px}}
      `}</style>
    </div>
  );
}
Object.assign(window, { Wizard });
