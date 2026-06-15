/* ============ MontaAqui — App principal ============ */
const { useState:uS, useEffect:uE } = React;
const LS = 'montaaqui_v1';

function loadState(){
  try{ return JSON.parse(localStorage.getItem(LS)) || {}; }catch(e){ return {}; }
}
function saveState(s){ try{ localStorage.setItem(LS, JSON.stringify(s)); }catch(e){} }

function TopNav({user, screen, go, onLogout}){
  const [menu,setMenu] = uS(false);
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Logo onClick={()=>go('dash')}/>
        <div className="nav-links">
          <button className={'nav-link '+(screen==='dash'?'active':'')} onClick={()=>go('dash')}>Meu painel</button>
        </div>
        <div className="nav-right">
          <div style={{position:'relative'}}>
            <button onClick={()=>setMenu(m=>!m)} style={{display:'flex'}}><Avatar name={user.name} size={40}/></button>
            {menu && (
              <>
                <div style={{position:'fixed',inset:0,zIndex:60}} onClick={()=>setMenu(false)}/>
                <div className="usermenu">
                  <div className="usermenu-head">
                    <Avatar name={user.name} size={38}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14.5}}>{user.name}</div>
                      <div className="faint" style={{fontSize:12.5,overflow:'hidden',textOverflow:'ellipsis'}}>{user.email}</div>
                    </div>
                  </div>
                  <button className="usermenu-item" onClick={()=>{setMenu(false);go('dash');}}><Ic.user/> Meu painel</button>
                  <button className="usermenu-item danger" onClick={onLogout}><Ic.back/> Sair</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .usermenu{position:absolute;right:0;top:52px;width:248px;background:#fff;border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-lg);padding:8px;z-index:61;animation:pop .16s both}
        .usermenu-head{display:flex;align-items:center;gap:11px;padding:10px 10px 12px;border-bottom:1px solid var(--line);margin-bottom:6px}
        .usermenu-item{width:100%;display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:11px;font-weight:600;font-size:14px;color:var(--ink-soft);text-align:left;transition:.14s}
        .usermenu-item:hover{background:var(--lime-50);color:var(--ink)}
        .usermenu-item.danger:hover{background:#FBEDE9;color:var(--danger)}
        @media(max-width:680px){.nav-links{display:none}}
      `}</style>
    </nav>
  );
}

function App(){
  const init = loadState();
  const [user, setUser] = uS(init.user || null);
  const [screen, setScreen] = uS(init.user ? 'dash' : 'auth');
  const [prefs, setPrefs] = uS(null);
  const [builds, setBuilds] = uS([]);
  const [active, setActive] = uS(null);
  const [saved, setSaved] = uS(init.saved || []);

  uE(()=>{ saveState({user, saved}); }, [user, saved]);
  uE(()=>{ window.scrollTo(0,0); }, [screen, active]);

  function go(s){ setScreen(s); }
  function auth(u){ setUser(u); setScreen('dash'); }
  function logout(){ setUser(null); setSaved([]); saveState({}); setScreen('auth'); }

  function completeWizard(p){
    setPrefs(p);
    const b = MA.generateBuilds(p.useCase, p.budget, p.brand, {resolution:p.resolution, fps:p.fps, games:p.games});
    // prioridade reordena destaque
    setBuilds(b);
    setScreen('generating');
  }

  const savedIds = builds.map(b=> saved.find(s=>s.id===b.id && s.useCase===b.useCase && s.total===b.total) ? b.id : null).filter(Boolean);

  function saveBuild(b){
    const exists = saved.find(s=>s.id===b.id && s.useCase===b.useCase && s.total===b.total);
    if(exists){ setSaved(saved.filter(s=>s!==exists)); }
    else { setSaved([{...b, savedAt:Date.now()}, ...saved]); }
  }
  const isSaved = (b)=> b && !!saved.find(s=>s.id===b.id && s.useCase===b.useCase && s.total===b.total);
  function removeSaved(savedAt){ setSaved(saved.filter(s=>s.savedAt!==savedAt)); }
  function openBuild(b){ setActive(b); setScreen('detail'); }

  const showNav = user && ['dash','results','detail'].includes(screen);

  return (
    <div className="app">
      {showNav && <TopNav user={user} screen={screen} go={go} onLogout={logout}/>}

      {screen==='auth' && <AuthScreen onAuth={auth}/>}

      {screen==='wizard' && <Wizard user={user} onBack={()=>go('dash')} onComplete={completeWizard}/>}

      {screen==='generating' && <Generating onDone={()=>setScreen('results')}/>}

      {screen==='results' && (
        <ResultsScreen builds={builds} prefs={prefs} savedIds={savedIds}
          onOpen={openBuild} onSave={saveBuild} onRestart={()=>go('wizard')}/>
      )}

      {screen==='detail' && active && (
        <DetailScreen build={active} saved={isSaved(active)} onBack={()=>go(builds.includes(active)?'results':'dash')} onSave={()=>saveBuild(active)}/>
      )}

      {screen==='dash' && user && (
        <Dashboard user={user} saved={saved} onNew={()=>go('wizard')} onOpen={openBuild} onRemove={removeSaved}/>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
