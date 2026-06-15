/* ============ MontaAqui — Login / Cadastro ============ */
function AuthScreen({onAuth}){
  const [mode, setMode] = useState('signup'); // signup | login
  const [form, setForm] = useState({name:'',email:'',pass:''});
  const [errors, setErrors] = useState({});
  const set = (k,v)=>{ setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:null})); };

  function submit(e){
    e.preventDefault();
    const er = {};
    if(mode==='signup' && form.name.trim().length<2) er.name='Digite seu nome';
    if(!/^\S+@\S+\.\S+$/.test(form.email)) er.email='E-mail inválido';
    if(form.pass.length<4) er.pass='Mínimo de 4 caracteres';
    setErrors(er);
    if(Object.keys(er).length) return;
    onAuth({name: form.name.trim()||'Você', email: form.email});
  }

  return (
    <div className="auth-wrap">
      {/* Lado esquerdo — marca */}
      <div className="auth-aside">
        <div className="auth-aside-inner">
          <Logo size={42}/>
          <div style={{marginTop:'auto'}}>
            <div className="chip" style={{background:'rgba(255,255,255,.18)',color:'#fff',border:'1px solid rgba(255,255,255,.3)'}}>
              <Ic.spark/> Montagem inteligente
            </div>
            <h1 style={{color:'#fff',fontSize:42,marginTop:22,lineHeight:1.08}}>O PC ideal pra você,<br/>sem dor de cabeça.</h1>
            <p style={{color:'rgba(255,255,255,.9)',fontSize:17,marginTop:16,maxWidth:380}}>
              Responda algumas perguntas e a gente monta a configuração perfeita pro seu bolso e pro seu uso — peça por peça, tudo explicado.
            </p>
            <div className="auth-steps">
              <div className="auth-step"><span>1</span> Conte seu objetivo e orçamento</div>
              <div className="auth-step"><span>2</span> Receba até 3 montagens compatíveis</div>
              <div className="auth-step"><span>3</span> Compare, entenda e compre nas lojas</div>
            </div>
          </div>
          <div className="auth-blob auth-blob-1"/>
          <div className="auth-blob auth-blob-2"/>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="auth-form-side">
        <div className="auth-card rise">
          <div className="auth-tabs">
            <button className={'auth-tab '+(mode==='signup'?'on':'')} onClick={()=>setMode('signup')}>Criar conta</button>
            <button className={'auth-tab '+(mode==='login'?'on':'')} onClick={()=>setMode('login')}>Entrar</button>
          </div>
          <h2 style={{fontSize:25,marginTop:26}}>{mode==='signup'?'Bem-vindo ao MontaAqui':'Que bom te ver de novo!'}</h2>
          <p className="muted" style={{marginTop:6,fontSize:14.5}}>{mode==='signup'?'É grátis. Crie sua conta para salvar suas montagens.':'Entre para acessar suas montagens salvas.'}</p>

          <form onSubmit={submit} style={{marginTop:24,display:'flex',flexDirection:'column',gap:16}}>
            {mode==='signup' && (
              <div className="field">
                <label>Nome</label>
                <input className="input" placeholder="Como podemos te chamar?" value={form.name} onChange={e=>set('name',e.target.value)}/>
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
            )}
            <div className="field">
              <label>E-mail</label>
              <input className="input" placeholder="voce@email.com" value={form.email} onChange={e=>set('email',e.target.value)}/>
              {errors.email && <span className="err">{errors.email}</span>}
            </div>
            <div className="field">
              <label>Senha</label>
              <input className="input" type="password" placeholder="••••••••" value={form.pass} onChange={e=>set('pass',e.target.value)}/>
              {errors.pass && <span className="err">{errors.pass}</span>}
            </div>
            <button className="btn btn-primary btn-lg btn-block" type="submit" style={{marginTop:6}}>
              {mode==='signup'?'Criar conta e começar':'Entrar'} <Ic.arrow/>
            </button>
          </form>

          <div className="auth-or"><span>ou</span></div>
          <button className="btn btn-ghost btn-block" onClick={()=>onAuth({name:'Visitante', email:'visitante@montaaqui.com'})}>
            Continuar como visitante
          </button>
        </div>
      </div>

      <style>{`
        .auth-wrap{min-height:100vh;display:grid;grid-template-columns:1.05fr 1fr}
        .auth-aside{position:relative;overflow:hidden;background:linear-gradient(150deg,var(--lime-600),var(--lime-500) 55%,var(--lime-400));padding:46px}
        .auth-aside-inner{position:relative;z-index:2;height:100%;display:flex;flex-direction:column}
        .auth-aside .logo-word{color:#fff}
        .auth-aside .logo-word b{color:#eaf6cf}
        .auth-steps{margin-top:30px;display:flex;flex-direction:column;gap:12px}
        .auth-step{display:flex;align-items:center;gap:13px;color:#fff;font-weight:600;font-size:15px}
        .auth-step span{width:28px;height:28px;flex:none;border-radius:50%;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-weight:800;font-size:14px}
        .auth-blob{position:absolute;border-radius:50%;filter:blur(2px);opacity:.5}
        .auth-blob-1{width:340px;height:340px;background:rgba(255,255,255,.16);right:-120px;top:-90px}
        .auth-blob-2{width:240px;height:240px;background:rgba(10,70,52,.45);right:30px;bottom:-110px}
        .auth-form-side{display:flex;align-items:center;justify-content:center;padding:40px;background:var(--bg)}
        .auth-card{width:100%;max-width:430px;background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:38px}
        .auth-tabs{display:flex;gap:6px;background:var(--lime-50);padding:5px;border-radius:999px;border:1px solid var(--line)}
        .auth-tab{flex:1;padding:11px;border-radius:999px;font-family:var(--font-head);font-weight:700;font-size:14.5px;color:var(--ink-soft);transition:.18s}
        .auth-tab.on{background:#fff;color:var(--lime-700);box-shadow:var(--shadow-sm)}
        .err{color:var(--danger);font-size:12.5px;font-weight:600}
        .auth-or{display:flex;align-items:center;gap:14px;margin:22px 0 16px;color:var(--ink-faint);font-size:13px;font-weight:600}
        .auth-or:before,.auth-or:after{content:'';flex:1;height:1px;background:var(--line)}
        @media(max-width:880px){.auth-wrap{grid-template-columns:1fr}.auth-aside{display:none}}
      `}</style>
    </div>
  );
}
Object.assign(window, { AuthScreen });
