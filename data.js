/* ============ MontaAqui — Catálogo de peças + gerador de montagens ============ */
(function(){
  "use strict";

  const BRL = n => 'R$ ' + n.toLocaleString('pt-BR');
  const STORES = ['Kabum','Pichau','Terabyte'];

  // perf = nota relativa de desempenho (1–10). Cada peça traz "o que é" e "porquê".
  const CATALOG = {
    cpu: [
      {id:'cpu1', name:'AMD Ryzen 5 5600G', brand:'AMD', price:760, perf:4, igpu:true,
        what:'Processador com vídeo integrado — roda o sistema e jogos leves sem placa de vídeo.',
        why:'Ótimo ponto de partida econômico: dispensa placa dedicada em usos básicos.'},
      {id:'cpu2', name:'AMD Ryzen 5 7600', brand:'AMD', price:1180, perf:6, igpu:true,
        what:'Processador de 6 núcleos da geração atual (soquete AM5).',
        why:'Equilíbrio ideal de preço e desempenho para jogos e trabalho do dia a dia.'},
      {id:'cpu3', name:'Intel Core i5-14600KF', brand:'Intel', price:1650, perf:7, igpu:false,
        what:'Processador de 14 núcleos focado em desempenho.',
        why:'Forte em multitarefa e edição, com bom custo por núcleo.'},
      {id:'cpu4', name:'AMD Ryzen 7 7800X3D', brand:'AMD', price:2750, perf:9, igpu:true,
        what:'Processador com cache 3D — referência para jogos de alto FPS.',
        why:'O melhor para gamers exigentes que querem máximo desempenho em jogos.'},
      {id:'cpu5', name:'AMD Ryzen 9 7900X', brand:'AMD', price:3200, perf:9.5, igpu:true,
        what:'Processador de 12 núcleos para cargas pesadas.',
        why:'Renderização, edição 4K e streaming sem gargalos.'},
    ],
    gpu: [
      {id:'gpu0', name:'Vídeo integrado (sem placa dedicada)', brand:'—', price:0, perf:2,
        what:'Usa o vídeo embutido no processador.',
        why:'Suficiente para escritório, estudos e vídeos — economiza no orçamento.'},
      {id:'gpuA', name:'NVIDIA RTX 3050', brand:'NVIDIA', price:1100, perf:4.5,
        what:'Placa dedicada de entrada para jogos leves em 1080p.',
        why:'Primeira placa ideal para quem quer jogar gastando pouco.'},
      {id:'gpuB', name:'AMD Radeon RX 6600', brand:'AMD', price:1400, perf:5.3,
        what:'Placa de entrada com ótimo custo por quadro.',
        why:'Roda a maioria dos jogos em Full HD com bom desempenho.'},
      {id:'gpu1', name:'NVIDIA RTX 4060', brand:'NVIDIA', price:1850, perf:6,
        what:'Placa de vídeo de entrada para jogos em 1080p.',
        why:'Roda os jogos atuais em Full HD com folga e baixo consumo.'},
      {id:'gpu2', name:'AMD Radeon RX 7700 XT', brand:'AMD', price:2700, perf:7.5,
        what:'Placa intermediária para 1440p.',
        why:'Mais memória de vídeo — boa para jogar em alta resolução e editar.'},
      {id:'gpu3', name:'NVIDIA RTX 4070 Super', brand:'NVIDIA', price:3900, perf:8.5,
        what:'Placa de alto desempenho para 1440p e 4K.',
        why:'Excelente para jogos pesados, ray tracing e criação de conteúdo.'},
      {id:'gpu4', name:'NVIDIA RTX 4080 Super', brand:'NVIDIA', price:6900, perf:9.7,
        what:'Placa topo de linha para 4K com tudo no máximo.',
        why:'Para quem não abre mão de desempenho máximo em jogos e renderização.'},
    ],
    ram: [
      {id:'ram1', name:'16GB DDR5 5600MHz (2x8GB)', brand:'Kingston', price:330, perf:5,
        what:'Memória que segura programas e jogos abertos ao mesmo tempo.',
        why:'O mínimo recomendado hoje para uma experiência fluida.'},
      {id:'ram2', name:'32GB DDR5 6000MHz (2x16GB)', brand:'Corsair', price:680, perf:8,
        what:'Dobro de memória, ideal para multitarefa pesada.',
        why:'Edição de vídeo, muitas abas e jogos exigentes sem travar.'},
      {id:'ram3', name:'64GB DDR5 6000MHz (2x32GB)', brand:'Corsair', price:1350, perf:9.5,
        what:'Memória abundante para cargas profissionais.',
        why:'Renderização 3D, máquinas virtuais e projetos grandes.'},
    ],
    storage: [
      {id:'ssd1', name:'SSD NVMe 500GB', brand:'Kingston', price:230, perf:4,
        what:'Armazenamento rápido para o sistema e programas.',
        why:'Liga o PC em segundos; espaço suficiente para começar.'},
      {id:'ssd2', name:'SSD NVMe 1TB', brand:'WD Black', price:430, perf:6,
        what:'O dobro de espaço, mantendo a alta velocidade.',
        why:'Espaço confortável para jogos e arquivos do dia a dia.'},
      {id:'ssd3', name:'SSD NVMe 2TB Gen4', brand:'Samsung', price:880, perf:8.5,
        what:'Muito espaço e velocidade de ponta.',
        why:'Para bibliotecas grandes de jogos e projetos de vídeo.'},
    ],
    mb: [
      {id:'mb1', name:'Placa-mãe A620M (AM5)', brand:'ASRock', price:560, perf:4,
        what:'Base que conecta todas as peças.',
        why:'Confiável e econômica para montagens de entrada.'},
      {id:'mb2', name:'Placa-mãe B650M (AM5)', brand:'Gigabyte', price:880, perf:6.5,
        what:'Placa intermediária com mais conexões e melhor estabilidade.',
        why:'Espaço para upgrades futuros e overclock leve.'},
      {id:'mb3', name:'Placa-mãe X670 (AM5)', brand:'ASUS', price:1500, perf:8.5,
        what:'Placa avançada para componentes de alto desempenho.',
        why:'Máxima conectividade e robustez para configurações fortes.'},
    ],
    psu: [
      {id:'psu1', name:'Fonte 550W 80+ Bronze', brand:'Corsair', price:320, perf:4,
        what:'Fornece energia estável para o computador.',
        why:'Potência adequada e segura para montagens básicas.'},
      {id:'psu2', name:'Fonte 750W 80+ Gold', brand:'XPG', price:560, perf:7,
        what:'Fonte eficiente com folga de potência.',
        why:'Suporta placas de vídeo médias com margem para upgrade.'},
      {id:'psu3', name:'Fonte 1000W 80+ Gold', brand:'Corsair', price:980, perf:9,
        what:'Fonte robusta para sistemas de alto consumo.',
        why:'Garante estabilidade com as placas de vídeo mais fortes.'},
    ],
    cooler: [
      {id:'cl1', name:'Cooler de ar (incluso/torre)', brand:'DeepCool', price:160, perf:4,
        what:'Mantém o processador em temperatura segura.',
        why:'Silencioso e suficiente para a maioria dos processadores.'},
      {id:'cl2', name:'Water cooler 240mm', brand:'DeepCool', price:480, perf:8,
        what:'Refrigeração líquida para processadores potentes.',
        why:'Temperaturas baixas e operação silenciosa sob carga.'},
    ],
    pcCase: [
      {id:'cs1', name:'Gabinete Mid-Tower com 3 fans', brand:'Gamemax', price:320, perf:5,
        what:'A "casa" das peças, com boa ventilação.',
        why:'Fluxo de ar adequado e visual limpo a um bom preço.'},
      {id:'cs2', name:'Gabinete Airflow vidro temperado', brand:'Lian Li', price:620, perf:8,
        what:'Gabinete premium com excelente refrigeração.',
        why:'Mantém tudo frio e mostra a montagem com elegância.'},
    ],
  };

  const CAT_ORDER = ['cpu','gpu','mb','ram','storage','cooler','psu','pcCase'];
  const CAT_LABEL = {cpu:'Processador',gpu:'Placa de vídeo',mb:'Placa-mãe',ram:'Memória RAM',storage:'Armazenamento',cooler:'Refrigeração',psu:'Fonte',pcCase:'Gabinete'};
  const CAT_ICON = {cpu:'cpu',gpu:'gpu',mb:'board',ram:'ram',storage:'ssd',cooler:'fan',psu:'plug',pcCase:'case'};

  // alocação alvo (% do orçamento) por finalidade
  const ALLOC = {
    jogos:     {cpu:.18,gpu:.34,mb:.09,ram:.08,storage:.08,cooler:.05,psu:.08,pcCase:.10},
    edicao:    {cpu:.24,gpu:.24,mb:.10,ram:.14,storage:.12,cooler:.05,psu:.06,pcCase:.05},
    trabalho:  {cpu:.26,gpu:.18,mb:.12,ram:.12,storage:.12,cooler:.05,psu:.07,pcCase:.08},
    estudos:   {cpu:.28,gpu:.14,mb:.13,ram:.12,storage:.13,cooler:.05,psu:.07,pcCase:.08},
    streaming: {cpu:.22,gpu:.30,mb:.10,ram:.12,storage:.08,cooler:.05,psu:.07,pcCase:.06},
  };
  const USE_LABEL = {jogos:'Jogos',edicao:'Edição & Criação',trabalho:'Trabalho & Escritório',estudos:'Estudos & Uso geral',streaming:'Streaming & Lives'};

  const catKeyToCatalog = {cpu:'cpu',gpu:'gpu',mb:'mb',ram:'ram',storage:'storage',cooler:'cooler',psu:'psu',pcCase:'pcCase'};

  // ordem de prioridade de upgrade por uso (peça "herói" primeiro)
  const PRIORITY = {
    jogos:     ['gpu','cpu','ram','storage','mb','psu','cooler','pcCase'],
    streaming: ['gpu','cpu','ram','storage','psu','mb','cooler','pcCase'],
    edicao:    ['cpu','ram','gpu','storage','mb','psu','cooler','pcCase'],
    trabalho:  ['cpu','ram','storage','mb','psu','gpu','cooler','pcCase'],
    estudos:   ['cpu','ram','storage','mb','psu','cooler','pcCase','gpu'],
  };

  // gera 3 montagens. Parte do mínimo e sobe peças na ordem de prioridade
  // do uso enquanto couber no teto — a peça que mais importa cresce primeiro.
  function generateBuilds(useCase, budget, brandPref, extra){
    extra = extra || {};
    const usesDedicated = ['jogos','streaming','edicao'].includes(useCase);
    const order = PRIORITY[useCase] || PRIORITY.trabalho;
    // exigência extra de GPU vinda de resolução / FPS / jogos pesados
    let gpuBoost = 0;
    if(extra.resolution==='1440p') gpuBoost = Math.max(gpuBoost,1);
    if(extra.resolution==='2160p') gpuBoost = Math.max(gpuBoost,2);
    if(extra.fps==='144') gpuBoost = Math.max(gpuBoost,1);
    const heavyGames = (extra.games||[]).filter(g=>['warzone','cyberpunk','elden','rdr2','bg3','starfield','forza'].includes(g)).length;
    if(heavyGames>=2) gpuBoost = Math.max(gpuBoost,1);
    const philosophies = [
      {key:'cb', name:'Custo-Benefício', factor:0.80, tag:'Economize',  desc:'O máximo de valor pelo menor preço.'},
      {key:'eq', name:'Equilibrada',     factor:1.00, tag:'Recomendada', desc:'O melhor equilíbrio entre preço e desempenho.'},
      {key:'hi', name:'Alto Desempenho', factor:1.20, tag:'Potência',    desc:'Sem economizar onde importa para o seu uso.'},
    ];

    // piso da GPU por filosofia (índice no catálogo de GPU)
    function gpuFloor(phKey){
      if(useCase==='trabalho' && budget<4000) return 0;
      if(useCase==='estudos') return 0;
      if(!usesDedicated) return 0;
      // jogos/streaming/edição: placa dedicada; orçamento muito baixo -> APU só no CB
      let base = (budget < 3400) ? (phKey==='cb' ? 0 : 1) : 1;
      if(base>0){ base += gpuBoost; if(phKey==='cb' && gpuBoost>0) base -= 0; }
      const maxIdx = CATALOG.gpu.length-1;
      return Math.min(base, maxIdx);
    }

    function buildOne(ph){
      const cap = Math.round(budget * ph.factor);
      const alloc = ALLOC[useCase] || ALLOC.trabalho;
      const idx = {};
      const floorOf = cat => cat==='gpu' ? gpuFloor(ph.key) : 0;
      const priceOf = ()=> CAT_ORDER.reduce((a,c)=>a+CATALOG[catKeyToCatalog[c]][idx[c]].price,0);

      // 1) alocação: cada categoria recebe sua fatia do teto e pega o melhor tier que cabe
      for(const cat of CAT_ORDER){
        const list=CATALOG[catKeyToCatalog[cat]];
        const share=cap*(alloc[cat]||0.08);
        const fl=floorOf(cat);
        let pick=fl;
        list.forEach((p,i)=>{ if(i>=fl && p.price<=share) pick=i; });
        idx[cat]=pick;
      }
      // 2) se passou do teto, reduz peças menos prioritárias primeiro
      const rev=[...order].reverse();
      let g=0;
      while(priceOf()>cap && g++<60){
        let done=false;
        for(const cat of rev){ if(idx[cat]>floorOf(cat)){ idx[cat]--; done=true; break; } }
        if(!done) break;
      }
      // 3) sobra: sobe peças na ordem de prioridade enquanto couber
      g=0;
      while(g++<120){
        let did=false;
        for(const cat of order){
          const list=CATALOG[catKeyToCatalog[cat]];
          const nxt=list[idx[cat]+1];
          if(nxt && priceOf()-list[idx[cat]].price+nxt.price<=cap){ idx[cat]++; did=true; break; }
        }
        if(!did) break;
      }

      // preferência de marca no processador
      if(brandPref && brandPref!=='tanto'){
        const want = brandPref==='intel'?'Intel':'AMD';
        const list=CATALOG.cpu, cur=list[idx.cpu];
        if(cur.brand!==want){
          let pick=null, bestDiff=1e9;
          list.forEach((p,i)=>{
            if(p.brand!==want) return;
            if(priceOf()-cur.price+p.price <= cap+60 && Math.abs(p.price-cur.price)<bestDiff){ bestDiff=Math.abs(p.price-cur.price); pick=i; }
          });
          if(pick!=null) idx.cpu=pick;
        }
      }
      return {idx};
    }

    let raw = philosophies.map(ph=>({ph, ...buildOne(ph)}));

    // ordena por preço para garantir CB < EQ < HI (rótulo segue o preço)
    const totalOf = o => CAT_ORDER.reduce((a,c)=>a+CATALOG[catKeyToCatalog[c]][o.idx[c]].price,0);
    raw.sort((a,b)=>totalOf(a)-totalOf(b));
    raw = raw.map((o,i)=>({ph:philosophies[i], idx:o.idx}));

    // garante 3 montagens distintas: se repete a anterior, sobe um herói
    const sig = o => CAT_ORDER.map(c=>o.idx[c]).join('-');
    for(let i=1;i<raw.length;i++){
      let tries=0;
      while(sig(raw[i])===sig(raw[i-1]) && tries++<10){
        for(const cat of order){
          const list=CATALOG[catKeyToCatalog[cat]];
          if(raw[i].idx[cat] < list.length-1){ raw[i].idx[cat]++; break; }
        }
      }
    }

    // re-ordena por preço após a distinção para manter CB < EQ < HI
    raw.sort((a,b)=>totalOf(a)-totalOf(b));
    raw = raw.map((o,i)=>({ph:philosophies[i], idx:o.idx}));

    return raw.map(({ph,idx})=>{
      const parts = CAT_ORDER.map(cat=>({cat, ...CATALOG[catKeyToCatalog[cat]][idx[cat]]}));
      const cpuPart = parts.find(p=>p.cat==='cpu');
      const gpuPart = parts.find(p=>p.cat==='gpu');
      const sum = parts.reduce((a,p)=>a+p.price,0);
      const perfScore = Math.round(parts.reduce((a,p)=>a+p.perf,0)/parts.length*10);
      // FPS estimado (baseado na GPU + CPU) — ilustrativo
      const fps = Math.round((gpuPart.perf*9 + cpuPart.perf*4) + 18);
      const compat = perfScore>=70 ? 'Excelente' : perfScore>=50 ? 'Ótima' : 'Boa';

      return {
        id: ph.key,
        philosophy: ph.name,
        tag: ph.tag,
        desc: ph.desc,
        recommended: ph.key==='eq',
        parts,
        total: sum,
        budget,
        perfScore,
        fps,
        compat,
        useCase,
      };
    });
  }

  window.MA = {
    CATALOG, CAT_ORDER, CAT_LABEL, CAT_ICON, USE_LABEL, ALLOC, STORES, BRL,
    generateBuilds,
  };
})();
