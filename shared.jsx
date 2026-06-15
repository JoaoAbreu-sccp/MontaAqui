/* ============ MontaAqui — Componentes compartilhados ============ */
const { useState, useEffect, useRef } = React;

/* ---- Logo: peça de quebra-cabeça chapada, verde da paleta ---- */
function LogoMark({size=38}){
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 10h13.2a2 2 0 0 0 1.9-2.6 6 6 0 1 1 11.4 0A2 2 0 0 0 42.3 10H54a2 2 0 0 1 2 2v11.7a2 2 0 0 0 2.6 1.9 6 6 0 1 1 0 11.4 2 2 0 0 0-2.6 1.9V52a2 2 0 0 1-2 2H42.3a2 2 0 0 1-1.9-2.6 6 6 0 1 0-11.4 0A2 2 0 0 1 27.1 54H14a4 4 0 0 1-4-4V37.6a2 2 0 0 1 2.6-1.9 6 6 0 1 0 0-11.4A2 2 0 0 1 10 22.4V14a4 4 0 0 1 4-4Z"
        fill="var(--lime-400)"/>
      <circle cx="42" cy="46" r="3.4" fill="var(--lime-700)" opacity=".55"/>
    </svg>
  );
}
function Logo({onClick, size}){
  return (
    <div className="logo" onClick={onClick}>
      <LogoMark size={size}/>
      <div className="logo-word">Monta<b>Aqui</b></div>
    </div>
  );
}

/* ---- Ícones (stroke, 1.8) ---- */
const Ic = {
  arrow:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  spark:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  bolt:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  wallet:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M16 12.5h2M3 9h13a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  heart:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.5 3 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3 0 4.7 3 3.2 5.9C19 15.6 12 20 12 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  store:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 9l1-4h14l1 4M5 9v10h14V9M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8"/></svg>,
  user:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  ext:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  info:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  plus:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  trash:(p)=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh:(p)=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" {...p}><path d="M20 11a8 8 0 1 0-.5 4M20 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // peças
  cpu:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="6" y="6" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  gpu:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="2" y="7" width="20" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="9" cy="12.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/><circle cx="16" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M5 18v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  board:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M15 8h3M15 11h3M8 15h8M8 17.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ram:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="8" width="18" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><path d="M7 8v9M11 8v9M15 8v9M5 20v-3M19 20v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ssd:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="3" width="16" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  fan:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M12 10c0-3 1-5 3.5-5.5M14 12c2.5.8 4 2.5 3.5 5M10 14c-2.5-.8-4-2.5-3.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  plug:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 6V4M8 20v-1.5M16 20v-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  case:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M9 6h6M9 9h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.6"/></svg>,
  // usos
  game:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M7 8h10a4 4 0 0 1 4 4v.5a3.5 3.5 0 0 1-6.3 2.1l-.4-.6h-4.6l-.4.6A3.5 3.5 0 0 1 3 12.5V12a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M7.5 11v2M6.5 12h2M15.5 11.5h.01M17.5 13h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  work:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  film:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10h18M8 6v4M14 6v4M7 14l4 2.3L7 18.6V14Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  book:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 6.5C10.5 5 8 4.5 4 4.8V18c4-.3 6.5.2 8 1.7 1.5-1.5 4-2 8-1.7V4.8c-4-.3-6.5.2-8 1.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 6.5v13" stroke="currentColor" strokeWidth="1.8"/></svg>,
  signal:(p)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.8"/><path d="M7.5 7.5a6 6 0 0 0 0 9M16.5 16.5a6 6 0 0 0 0-9M4.8 4.8a10 10 0 0 0 0 14.4M19.2 19.2a10 10 0 0 0 0-14.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  monitor:(p)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  gauge:(p)=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 18l4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
};
function PartIcon({type, ...p}){ const C = Ic[MA.CAT_ICON[type]] || Ic.cpu; return <C {...p}/>; }

/* ---- Barra de desempenho ---- */
function PerfBar({value, label}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      {label && <span style={{fontSize:12.5,fontWeight:700,color:'var(--ink-faint)',width:74}}>{label}</span>}
      <div style={{flex:1,height:8,background:'var(--lime-50)',borderRadius:99,overflow:'hidden',border:'1px solid var(--lime-100)'}}>
        <div style={{height:'100%',width:Math.min(100,value)+'%',background:'linear-gradient(90deg,var(--lime-400),var(--lime-500))',borderRadius:99,transition:'width .8s cubic-bezier(.2,.7,.2,1)'}}/>
      </div>
      <span className="mono-num" style={{fontSize:12.5,fontWeight:800,color:'var(--lime-700)',width:34,textAlign:'right'}}>{value}</span>
    </div>
  );
}

/* ---- Avatar circular ---- */
function Avatar({name, size=36}){
  const initials = (name||'Você').trim().split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  return (
    <div style={{width:size,height:size,borderRadius:'50%',background:'var(--lime-200)',color:'var(--lime-700)',
      display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:size*0.4,fontFamily:'var(--font-head)',flex:'none'}}>
      {initials}
    </div>
  );
}

Object.assign(window, { LogoMark, Logo, Ic, PartIcon, PerfBar, Avatar,
  useState, useEffect, useRef });
