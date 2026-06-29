/* ═══════════════════════════════════════════════
   MLestudia ENURM — script.js v3.0
   Sistema de bancos por especialidad
═══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   EXAMS — Agrega aquí cada nuevo banco
   
   Campos:
   · id        → identificador único (sin espacios)
   · label     → nombre visible en pantalla
   · group     → especialidad (ver GROUP_LABELS abajo)
   · avail     → true = activo, false = próximamente
   · color/bg  → color del badge
   · qs        → función que retorna el arreglo de preguntas
══════════════════════════════════════════════ */
var EXAMS = [
  // ── VARIADOS ──────────────────────────────
  {id:'variado1', label:'Variado 1',    group:'variado',         avail:true,  color:'#F4845F', bg:'#FEF0EB', qs:()=>ENURM_VARIADO1},
  {id:'variado2', label:'Variado 2',    group:'variado',         avail:false, color:'#F9A98E', bg:'#FEF0EB', qs:()=>typeof ENURM_VARIADO2!=='undefined'?ENURM_VARIADO2:[]},

  // ── GINECOLOGÍA ───────────────────────────
  {id:'gineco1',  label:'Ginecología 1',group:'ginecologia',     avail:true, color:'#B07CFF', bg:'#F5EEFF', qs:()=>typeof ENURM_GINECO1!=='undefined'?ENURM_GINECO1:[]},
  {id:'gineco2',  label:'Ginecología 2',group:'ginecologia',     avail:true, color:'#9A60E8', bg:'#F0E8FF', qs:()=>typeof ENURM_GINECO2!=='undefined'?ENURM_GINECO2:[]},

  // ── CIRUGÍA ───────────────────────────────
  {id:'cirugia1', label:'Cirugía 1',    group:'cirugia',         avail:false, color:'#E05C5C', bg:'#FFF0F0', qs:()=>typeof ENURM_CIRUGIA1!=='undefined'?ENURM_CIRUGIA1:[]},
  {id:'cirugia2', label:'Cirugía 2',    group:'cirugia',         avail:false, color:'#C04040', bg:'#FFE8E8', qs:()=>typeof ENURM_CIRUGIA2!=='undefined'?ENURM_CIRUGIA2:[]},

  // ── PEDIATRÍA ─────────────────────────────
  {id:'pediatria1',label:'Pediatría 1', group:'pediatria',       avail:false, color:'#5BBF8A', bg:'#E8F4EE', qs:()=>typeof ENURM_PEDIATRIA1!=='undefined'?ENURM_PEDIATRIA1:[]},
  {id:'pediatria2',label:'Pediatría 2', group:'pediatria',       avail:false, color:'#3d9469', bg:'#D8EEE4', qs:()=>typeof ENURM_PEDIATRIA2!=='undefined'?ENURM_PEDIATRIA2:[]},

  // ── MEDICINA INTERNA ──────────────────────
  {id:'interna1', label:'Interna 1',    group:'interna',         avail:false, color:'#5A9BD4', bg:'#E8F4FF', qs:()=>typeof ENURM_INTERNA1!=='undefined'?ENURM_INTERNA1:[]},
  {id:'interna2', label:'Interna 2',    group:'interna',         avail:false, color:'#3A7AB4', bg:'#D8EAFF', qs:()=>typeof ENURM_INTERNA2!=='undefined'?ENURM_INTERNA2:[]},

  // ── CIENCIAS BÁSICAS ──────────────────────
  {id:'basicas1', label:'C. Básicas 1', group:'ciencias_basicas',avail:false, color:'#F5B942', bg:'#FFF8E8', qs:()=>typeof ENURM_BASICAS1!=='undefined'?ENURM_BASICAS1:[]},

  // ── SALUD PÚBLICA ─────────────────────────
  {id:'salud1',   label:'Salud Pública 1',group:'salud_publica', avail:false, color:'#5A9BD4', bg:'#E8F4FF', qs:()=>typeof ENURM_SALUD1!=='undefined'?ENURM_SALUD1:[]},

  // ── FARMACOLOGÍA ──────────────────────────
  {id:'farma1',   label:'Farmacología 1',group:'farmacologia',   avail:false, color:'#7DAF94', bg:'#E8F4EE', qs:()=>typeof ENURM_FARMA1!=='undefined'?ENURM_FARMA1:[]},
];

/* ══════════════════════════════════════════════
   GROUP_LABELS — Nombres e íconos de grupos
══════════════════════════════════════════════ */
var GROUP_LABELS = {
  variado:         {icon:'📋', name:'Variado'},
  ginecologia:     {icon:'🤰', name:'Ginecología y Obstetricia'},
  cirugia:         {icon:'🔪', name:'Cirugía'},
  pediatria:       {icon:'🍼', name:'Pediatría'},
  interna:         {icon:'🫀', name:'Medicina Interna'},
  ciencias_basicas:{icon:'🔬', name:'Ciencias Básicas'},
  salud_publica:   {icon:'🏥', name:'Salud Pública'},
  farmacologia:    {icon:'💊', name:'Farmacología'},
};

var SUBS = {
  interna:'🫀 Medicina Interna', cirugia:'🔪 Cirugía',
  pediatria:'🍼 Pediatría', ginecologia:'🤰 Ginecología y Obstetricia',
  ciencias_basicas:'🔬 Ciencias Básicas', salud_publica:'🏥 Salud Pública',
  farmacologia:'💊 Farmacología'
};

var LEVELS=[
  {name:'Pasante',xp:0,icon:'🌱'},{name:'Interno',xp:200,icon:'⚡'},
  {name:'Residente',xp:600,icon:'🔬'},{name:'Especialista',xp:1200,icon:'🧠'},
  {name:'Attending',xp:2500,icon:'👑'}
];
var CONF_COLORS=['#F4845F','#F5B942','#5BBF8A','#5A9BD4','#B07CFF','#F9A98E'];
var DIFF_C={easy:'var(--green)',medium:'var(--yellow)',hard:'var(--red)'};
var DIFF_L={easy:'Fácil',medium:'Intermedio',hard:'Difícil'};

/* ══ STATE ══ */
var curExam=null,curBlock=0,curQ=0;
var sesXP=0,sesStr=0,sesMaxStr=0,sesCor=0,sesTot=0;
var queue=[],answered=false,hintsLeft=2;
var isRev=false,soundOn=true,libTab='todos';

/* ══ STORAGE ══ */
function lp(){try{return JSON.parse(localStorage.getItem('ml_v5')||'{}')}catch{return{}}}
function sp(d){localStorage.setItem('ml_v5',JSON.stringify(d))}
function gep(id){
  var a=lp();
  if(!a[id]){
    var b={};for(var i=1;i<=10;i++)b[i]={st:i===1?'avail':'lock',wrong:[],cor:0,tot:0};
    a[id]={b,xp:0,cor:0,ans:0,maxStr:0};sp(a);
  }return a[id];
}
function sep(id,d){var a=lp();a[id]=d;sp(a)}
function gStats(){
  var a=lp(),xp=0,c=0,n=0,ms=0;
  Object.values(a).forEach(e=>{xp+=(e.xp||0);c+=(e.cor||0);n+=(e.ans||0);ms=Math.max(ms,e.maxStr||0)});
  return{xp,c,n,ms};
}

/* ══ UTILS ══ */
function shuf(a){var r=[...a];for(var i=r.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
function bq(exam,bn){var all=exam.qs();if(!all.length)return[];return all.slice((bn-1)*10,bn*10)}
function getLvl(xp){
  var l=0;for(var i=LEVELS.length-1;i>=0;i--)if(xp>=LEVELS[i].xp){l=i;break}
  var c=LEVELS[l],n=LEVELS[l+1],p=n?Math.round((xp-c.xp)/(n.xp-c.xp)*100):100;
  return{name:c.name,icon:c.icon,pct:Math.min(p,100)}
}

/* ══ SOUND ══ */
var actx=null;
function getCtx(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();return actx}
function beep(f,t,d,v,dl=0){
  if(!soundOn)return;
  try{var c=getCtx(),o=c.createOscillator(),g=c.createGain();
  o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f||440;
  g.gain.setValueAtTime(v||.3,c.currentTime+dl);
  g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dl+d);
  o.start(c.currentTime+dl);o.stop(c.currentTime+dl+d+.01)}catch(e){}
}
function playS(n){
  if(!soundOn)return;
  if(n==='ok'){beep(523,.35,.1,.3);beep(659,.35,.1,.3,.12);beep(784,.35,.2,.3,.25)}
  else if(n==='err'){beep(300,'sawtooth',.15,.2);beep(220,'sawtooth',.2,.2,.18)}
  else if(n==='lvl'){[523,659,784,1047].forEach((f,i)=>beep(f,'sine',.15,.4,i*.12))}
  else if(n==='str'){beep(880,'sine',.08,.25);beep(1108,'sine',.12,.3,.1)}
  else if(n==='clk'){beep(600,'sine',.05,.15)}
}

/* ══ THEME / SOUND ══ */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  var b=document.getElementById('themeBtn'),tg=document.getElementById('themeTog');
  if(b)b.textContent=t==='dark'?'☀️':'🌙';
  if(tg)tg.className='tog'+(t==='dark'?' on':'');
  localStorage.setItem('ml_th',t);
}
function toggleTheme(){var c=document.documentElement.getAttribute('data-theme')||'light';applyTheme(c==='dark'?'light':'dark');playS('clk')}
function toggleSound(){
  soundOn=!soundOn;
  var b=document.getElementById('soundBtn'),tg=document.getElementById('soundTog');
  if(b)b.textContent=soundOn?'🔊':'🔇';
  if(tg)tg.className='tog'+(soundOn?' on':'');
  localStorage.setItem('ml_snd',soundOn?'1':'0');
}

/* ══ SCREENS ══ */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  var el=document.getElementById(id);if(el)el.classList.add('active');
  window.scrollTo({top:0});
  var isQ=id==='quizScreen';
  var pb=document.getElementById('topProgBar'),xc=document.getElementById('xpChip');
  if(pb)pb.style.display=isQ?'flex':'none';
  if(xc)xc.style.display=isQ?'flex':'none';
}
function navTo(tab){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  var nb=document.getElementById('nav'+tab[0].toUpperCase()+tab.slice(1));
  if(nb)nb.classList.add('active');
  closeModal();
  if(tab==='aprender'){showScreen('aprenderScreen');buildHome()}
  else if(tab==='examenes'){showScreen('examenesScreen');buildLib()}
  else if(tab==='perfil'){showScreen('perfilScreen');buildPerfil()}
  playS('clk');
}

/* ══ HOME — agrupado por especialidad ══ */
function buildHome(){
  var st=gStats(),lv=getLvl(st.xp);
  var set=(id,v,t)=>{var e=document.getElementById(id);if(!e)return;t==='st'?e.style.width=v:e.textContent=v};
  set('bannerLevel',lv.icon+' '+lv.name,'tx');
  set('bannerXP','⚡ '+st.xp+' XP acumulados','tx');
  set('bannerBar',lv.pct+'%','st');
  set('sDone',st.n,'tx');
  set('sAcc',st.n>0?Math.round(st.c/st.n*100)+'%':'—','tx');
  set('sXP',st.xp,'tx');

  var grid=document.getElementById('yearsGrid');if(!grid)return;grid.innerHTML='';

  // Agrupar exámenes
  var groups={};
  EXAMS.forEach(exam=>{
    var g=exam.group||'variado';
    if(!groups[g])groups[g]=[];
    groups[g].push(exam);
  });

  Object.entries(groups).forEach(([groupKey,exams])=>{
    var gl=GROUP_LABELS[groupKey]||{icon:'📁',name:groupKey};

    // Encabezado de grupo
    var hdr=document.createElement('div');
    hdr.className='group-header';
    hdr.innerHTML=`<span>${gl.icon}</span><span>${gl.name}</span><div class="group-line"></div>`;
    grid.appendChild(hdr);

    exams.forEach(exam=>{
      var p=exam.avail?gep(exam.id):null;
      var done=0;if(p)Object.values(p.b).forEach(b=>{if(b.st==='done')done++});
      var bHTML='';
      for(var i=1;i<=10;i++){
        var s=p?(p.b[i]?.st||'lock'):'lock';
        var lbl=s==='done'?'✓':s==='avail'?'▶':'🔒';
        bHTML+=`<div class="bsq ${s==='avail'?'available':s==='done'?'done':'locked'}"
          onclick="event.stopPropagation();${exam.avail?'startBlock(\''+exam.id+'\','+i+')':''}"
          title="Bloque ${i}">${lbl}</div>`;
      }
      var card=document.createElement('div');
      card.className='year-card'+(exam.avail?'':' locked');
      card.innerHTML=`
        <div class="year-header">
          <div class="year-badge" style="background:${exam.bg};color:${exam.color}">${exam.avail?'📝':'🔒'}</div>
          <div class="year-info">
            <h3>${exam.label}</h3>
            <p>${exam.avail?(p?done+'/10 bloques · '+p.ans+' preguntas respondidas':'Disponible — ¡Empieza ya!'):'Próximamente disponible'}</p>
          </div>
          ${exam.avail?'<span style="font-size:20px;color:var(--text-l)">›</span>':''}
        </div>
        <div class="blocks-row">${bHTML}</div>`;
      if(exam.avail)card.addEventListener('click',()=>{playS('clk');openExamModal(exam)});
      grid.appendChild(card);
    });
  });
}

/* ══ EXAM MODAL ══ */
function openExamModal(exam){
  var p=gep(exam.id);
  var nextB=1;
  for(var i=1;i<=10;i++){
    var s=p.b[i]?.st||'lock';
    if(s==='avail'){nextB=i;break}
    if(s==='done'&&i<10&&(p.b[i+1]?.st==='avail')){nextB=i+1;break}
  }
  var bg='';
  for(var b=1;b<=10;b++){
    var st=p.b[b]?.st||'lock';
    var ic=st==='done'?'✅':st==='avail'?'▶️':'🔒';
    var acc='';if(st==='done'&&p.b[b].tot>0)acc=Math.round(p.b[b].cor/p.b[b].tot*100)+'%';
    bg+=`<div onclick="closeModal();startBlock('${exam.id}',${b})" style="
      background:var(--card2);border:2px solid ${st==='done'?'var(--green)':st==='avail'?'var(--orange)':'var(--border)'};
      border-radius:10px;padding:12px 8px;text-align:center;cursor:${st!=='lock'?'pointer':'default'};
      opacity:${st==='lock'?.45:1};transition:all .2s;min-height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">
      <div style="font-size:18px">${ic}</div>
      <div style="font-family:Nunito,sans-serif;font-weight:800;font-size:12px">B${b}</div>
      ${acc?`<div style="font-size:10px;color:var(--green);font-weight:700">${acc}</div>`:''}
    </div>`;
  }
  var ov=document.createElement('div');ov.className='mo';ov.id='mainModal';
  ov.innerHTML=`<div class="mb" style="max-width:420px">
    <div style="font-size:40px;margin-bottom:8px">📝</div>
    <h3>${exam.label}</h3>
    <p>${exam.qs().length} preguntas · 10 bloques de 10 cada uno</p>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:20px">${bg}</div>
    <div class="mbtns">
      <button class="mbtn orange" onclick="closeModal();startBlock('${exam.id}',${nextB})">🚀 Continuar — Bloque ${nextB}</button>
      <button class="mbtn ghost" onclick="closeModal()">✕ Cerrar</button>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)closeModal()});
}
function closeModal(){var m=document.getElementById('mainModal');if(m)m.remove()}

/* ══ START BLOCK ══ */
function startBlock(examId,bn){
  closeModal();
  var exam=EXAMS.find(e=>e.id===examId);if(!exam)return;
  var p=gep(examId);
  if((p.b[bn]?.st||'lock')==='lock'){showToast('🔒 Completa el bloque anterior primero');return}
  curExam=exam;curBlock=bn;curQ=0;
  sesXP=0;sesStr=0;sesMaxStr=0;sesCor=0;sesTot=0;answered=false;hintsLeft=2;isRev=false;
  var qs=bq(exam,bn);
  if(!qs.length){showToast('⚠️ Sin preguntas disponibles');return}
  queue=shuf(qs);
  p.b[bn].st='active';sep(examId,p);
  showScreen('quizScreen');renderQ();
}

/* ══ QUIZ ══ */
function updTopBar(){
  var fill=document.getElementById('topProgFill'),xpc=document.getElementById('xpCount');
  if(fill)fill.style.width=(queue.length?(curQ/queue.length*100):0)+'%';
  if(xpc)xpc.textContent=sesXP;
  var cnt=document.getElementById('quizCounter');
  if(cnt)cnt.textContent=(curQ+1)+' / '+queue.length;
}

function renderQ(){
  answered=false;hintsLeft=2;
  var q=queue[curQ];if(!q){showBlockDone();return}
  var c=document.getElementById('mainContainer');if(!c)return;c.innerHTML='';

  var tag=document.getElementById('quizTag');
  if(tag){tag.textContent=isRev?'🔄 REPASO':curExam.label;
    tag.className='mode-tag '+(isRev?'mode-review':'mode-year')}
  updTopBar();

  var card=document.createElement('div');card.className='q-card';
  card.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span class="q-sub-badge">${SUBS[q.sub]||q.sub}</span>
      <span class="q-sub-badge" style="background:${DIFF_C[q.diff]||'var(--beige)'};color:${q.diff==='medium'?'#3D2B1F':'#fff'}">${DIFF_L[q.diff]||''}</span>
    </div>
    <div class="mascot-row">
      <div class="mascot-icon">🩺</div>
      <div class="speech-bubble">${q.text}</div>
    </div>`;
  c.appendChild(card);

  var ow=document.createElement('div');ow.className='options';
  q.opts.forEach((o,i)=>{
    var b=document.createElement('button');b.className='opt-btn';b.id='opt'+i;
    b.innerHTML=`<div class="opt-letter">${'ABCD'[i]}</div><span>${o}</span>`;
    b.addEventListener('click',()=>doAns(i,q));
    ow.appendChild(b);
  });
  c.appendChild(ow);

  var hb=document.createElement('button');hb.className='hint-btn';hb.id='hintBtn';
  hb.textContent='💡 Usar pista ('+hintsLeft+'/2 disponibles)';
  hb.addEventListener('click',()=>doHint(q,hb));
  c.appendChild(hb);

  var fb=document.createElement('div');fb.className='feedback';fb.id='fb';
  fb.innerHTML='<div id="fbt" class="fb-title"></div><div id="fbx" class="fb-explain"></div>';
  c.appendChild(fb);

  var cb=document.createElement('button');cb.className='cont-btn';cb.id='contBtn';
  cb.addEventListener('click',nextQ);
  c.appendChild(cb);
}

function doHint(q,btn){
  if(hintsLeft<=0||answered)return;
  hintsLeft--;playS('clk');
  var fb=document.getElementById('fb');
  if(fb){fb.className='feedback show';fb.style.cssText='display:block;background:var(--beige);border:2px solid var(--beige-d);border-radius:var(--rs);padding:16px;margin-bottom:14px';
    document.getElementById('fbt').textContent='';
    document.getElementById('fbx').innerHTML='💡 La respuesta correcta es la opción <strong>'+'ABCD'[q.ans]+'</strong>';}
  if(btn)btn.textContent='💡 Usar pista ('+(hintsLeft)+'/2 disponibles)';
}

function doAns(idx,q){
  if(answered)return;answered=true;sesTot++;
  var ok=idx===q.ans;
  document.querySelectorAll('.opt-btn').forEach((b,i)=>{
    b.disabled=true;
    if(i===q.ans)b.classList.add('correct');
    else if(i===idx&&!ok)b.classList.add('wrong');
  });
  showFB(ok,q);
}

function showFB(ok,q){
  var fb=document.getElementById('fb'),fbt=document.getElementById('fbt'),
      fbx=document.getElementById('fbx'),cb=document.getElementById('contBtn');
  if(ok){
    sesCor++;sesStr++;if(sesStr>sesMaxStr)sesMaxStr=sesStr;
    var gain=10+(sesStr>1?(sesStr-1)*3:0);sesXP+=gain;updTopBar();
    if(fb)fb.className='feedback ok show';
    if(fbt)fbt.innerHTML='✅ ¡Correcto! <small style="font-size:13px;color:var(--green)">+'+gain+' XP</small>';
    if(fbx)fbx.innerHTML=q.exp||'';
    if(cb){cb.className='cont-btn ok-c show';cb.textContent='Siguiente ➜'}
    playS('ok');
    if(sesStr>=3){showFlash({3:'🔥 ¡Racha x3!',4:'⚡ ¡Racha x4!',5:'🚀 ¡Imparable!',6:'💥 ¡Leyenda!'}[sesStr]||'🔥 Racha x'+sesStr);playS('str')}
    rmWrong(curExam.id,curBlock,q);
  }else{
    sesStr=0;
    if(fb)fb.className='feedback err show';
    if(fbt)fbt.textContent='❌ Incorrecto';
    if(fbx)fbx.innerHTML=q.exp||'';
    if(cb){cb.className='cont-btn err-c show';cb.textContent='📖 Continuar'}
    playS('err');addWrong(curExam.id,curBlock,q);
  }
}

function addWrong(eid,bn,q){var p=gep(eid);if(!p.b[bn])return;if(!p.b[bn].wrong)p.b[bn].wrong=[];if(!p.b[bn].wrong.some(w=>w.id===q.id))p.b[bn].wrong.push(q);sep(eid,p)}
function rmWrong(eid,bn,q){var p=gep(eid);if(!p.b[bn]?.wrong)return;p.b[bn].wrong=p.b[bn].wrong.filter(w=>w.id!==q.id);sep(eid,p)}

function nextQ(){curQ++;if(curQ>=queue.length)showBlockDone();else renderQ()}

function quitQuiz(){
  if(curExam){var p=gep(curExam.id);if(p.b[curBlock]?.st==='active')p.b[curBlock].st='avail';sep(curExam.id,p)}
  navTo('aprender');
}

/* ══ BLOCK DONE ══ */
function showBlockDone(){
  playS('lvl');showScreen('lvlCompleteScreen');
  var acc=sesTot?Math.round(sesCor/sesTot*100):0;
  document.getElementById('lcXP').textContent=sesXP;
  document.getElementById('lcAcc').textContent=acc+'%';
  document.getElementById('lcStr').textContent=sesMaxStr;
  document.getElementById('topProgFill').style.width='100%';

  if(curExam){
    var p=gep(curExam.id);
    p.b[curBlock].st='done';p.b[curBlock].cor=sesCor;p.b[curBlock].tot=sesTot;
    p.xp=(p.xp||0)+sesXP;p.cor=(p.cor||0)+sesCor;p.ans=(p.ans||0)+sesTot;
    p.maxStr=Math.max(p.maxStr||0,sesMaxStr);
    if(curBlock<10)p.b[curBlock+1].st='avail';
    sep(curExam.id,p);
    var wl=(p.b[curBlock]?.wrong||[]).length;
    var ra=document.getElementById('revAlert'),wc=document.getElementById('wrongCount');
    if(ra)ra.style.display=wl?'flex':'none';if(wc)wc.textContent=wl;
    var nb=document.getElementById('nextBlockBtn'),rb=document.getElementById('revBtn');
    if(nb)nb.style.display=curBlock<10?'block':'none';
    if(rb)rb.style.display=wl?'block':'none';
  }

  var tr,ti,sb;
  if(acc===100){tr='🥇';ti='¡PERFECTO!';sb='100% de precisión. ¡Dominas este bloque!';confetti();setTimeout(confetti,500)}
  else if(acc>=80){tr='🏆';ti='¡Excelente!';sb=sesCor+'/'+sesTot+' correctas. ¡Muy bien!';confetti()}
  else if(acc>=60){tr='🎯';ti='¡Buen trabajo!';sb=sesCor+'/'+sesTot+' correctas. Repasa lo fallido.'}
  else{tr='📚';ti='¡Sigue adelante!';sb=sesCor+'/'+sesTot+' correctas. ¡Puedes mejorar!'}
  document.getElementById('lcTrophy').textContent=tr;
  document.getElementById('lcTitle').textContent=ti;
  document.getElementById('lcSub').textContent=sb;
}

function goNextBlock(){playS('clk');if(curExam&&curBlock<10)startBlock(curExam.id,curBlock+1)}
function goReviewWrong(){
  if(!curExam)return;playS('clk');
  var p=gep(curExam.id),wq=p.b[curBlock]?.wrong||[];
  if(!wq.length)return;
  isRev=true;queue=shuf([...wq]);curQ=0;
  sesXP=0;sesStr=0;sesMaxStr=0;sesCor=0;sesTot=0;
  showScreen('quizScreen');renderQ();
}
function backToHome(){navTo('aprender')}

/* ══ LIBRARY ══ */
function buildLib(){
  var tabsEl=document.getElementById('libTabs');if(!tabsEl)return;
  var tabs=[['todos','Todas'],['interna','Interna'],['cirugia','Cirugía'],
    ['pediatria','Pediatría'],['ginecologia','Ginecología'],
    ['ciencias_basicas','C. Básicas'],['salud_publica','Salud Pública'],['farmacologia','Farmacología']];
  tabsEl.innerHTML=tabs.map(([t,l])=>`<button class="tab-btn${libTab===t?' active':''}" onclick="setTab('${t}',this)">${l}</button>`).join('');

  var content=document.getElementById('libContent');if(!content)return;content.innerHTML='';
  var allQ=[];
  EXAMS.forEach(ex=>{if(ex.avail)ex.qs().forEach(q=>allQ.push({...q,examLabel:ex.label}))});
  if(libTab!=='todos')allQ=allQ.filter(q=>q.sub===libTab);
  if(!allQ.length){content.innerHTML='<div class="empty"><div class="ei">📭</div><h3>Sin preguntas</h3><p>No hay preguntas disponibles en esta categoría</p></div>';return}

  var grps={};
  allQ.forEach(q=>{var s=q.sub||'general';if(!grps[s])grps[s]=[];grps[s].push(q)});
  Object.entries(grps).forEach(([sub,qs])=>{
    var sec=document.createElement('div');sec.style.marginBottom='20px';
    var hdr=document.createElement('div');
    hdr.style.cssText='font-family:Nunito,sans-serif;font-weight:800;font-size:15px;padding:8px 0;border-bottom:2px solid var(--border);margin-bottom:10px;color:var(--text)';
    hdr.textContent=(SUBS[sub]||sub)+' ('+qs.length+')';sec.appendChild(hdr);
    var shown=libTab==='todos'?Math.min(4,qs.length):qs.length;
    qs.slice(0,shown).forEach(q=>{
      var item=document.createElement('div');item.className='si';
      item.innerHTML=`<div class="si-l" style="flex:1;min-width:0">
        <div class="si-icon">${{easy:'🟢',medium:'🟡',hard:'🔴'}[q.diff]||'⚪'}</div>
        <div style="flex:1;min-width:0">
          <div class="si-text" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${q.text}</div>
          <div class="si-sub">${q.examLabel} · Resp: <strong>${'ABCD'[q.ans]}</strong></div>
        </div></div>`;
      item.addEventListener('click',()=>showQDetail(q));
      sec.appendChild(item);
    });
    if(libTab==='todos'&&qs.length>shown){
      var mb=document.createElement('button');
      mb.style.cssText='width:100%;padding:10px;background:var(--card2);border:2px dashed var(--border);border-radius:var(--rs);cursor:pointer;font-family:Nunito,sans-serif;font-weight:800;font-size:13px;color:var(--text-m);';
      mb.textContent='Ver las '+(qs.length-shown)+' preguntas más de '+(SUBS[sub]||sub);
      mb.addEventListener('click',()=>{libTab=sub;buildLib()});sec.appendChild(mb);
    }
    content.appendChild(sec);
  });
}

function setTab(t,el){
  libTab=t;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  if(el)el.classList.add('active');buildLib();
}

function showQDetail(q){
  var ov=document.createElement('div');ov.className='mo';ov.id='mainModal';
  var opts=q.opts.map((o,i)=>`<div style="padding:12px;border-radius:8px;border:2px solid ${i===q.ans?'var(--green)':'var(--border)'};background:${i===q.ans?'var(--sage-pale)':'var(--card2)'};margin-bottom:8px;font-size:14px;color:var(--text)"><strong>${'ABCD'[i]}.</strong> ${o}${i===q.ans?' ✅':''}</div>`).join('');
  ov.innerHTML=`<div class="mb" style="max-width:480px;max-height:80vh;overflow-y:auto;text-align:left">
    <div style="font-size:12px;color:var(--text-m);font-weight:700;margin-bottom:12px">${SUBS[q.sub]||q.sub} · ${q.examLabel||''}</div>
    <p style="font-size:15px;line-height:1.65;margin-bottom:16px">${q.text}</p>
    ${opts}
    <div style="background:var(--sage-pale);border:2px solid var(--sage-l);border-radius:10px;padding:14px;margin-top:14px;font-size:13px;line-height:1.65;color:var(--text-m)">${q.exp}</div>
    <button class="mbtn ghost" onclick="closeModal()" style="margin-top:16px;width:100%">✕ Cerrar</button>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)closeModal()});
}

/* ══ PERFIL ══ */
function buildPerfil(){
  var st=gStats(),lv=getLvl(st.xp);
  var s=(id,v,t)=>{var e=document.getElementById(id);if(!e)return;t==='st'?e.style.width=v:e.textContent=v};
  s('pLevel',lv.icon+' '+lv.name+' · Nivel '+(LEVELS.findIndex(l=>l.name===lv.name)+1),'tx');
  s('pBar',lv.pct+'%','st');
  s('pXPlabel','⚡ '+st.xp+' XP','tx');
  s('pTotalQ',st.n+' preguntas respondidas','tx');
  s('pAcc',st.n?Math.round(st.c/st.n*100)+'% de acierto global':'Sin datos aún','tx');
  s('pXP',st.xp+' puntos de experiencia','tx');
  var th=document.documentElement.getAttribute('data-theme')||'light';
  var tt=document.getElementById('themeTog');if(tt)tt.className='tog'+(th==='dark'?' on':'');
  var sg=document.getElementById('soundTog');if(sg)sg.className='tog'+(soundOn?' on':'');
}
function resetConfirm(){
  var ov=document.createElement('div');ov.className='mo';ov.id='mainModal';
  ov.innerHTML=`<div class="mb"><div style="font-size:48px;margin-bottom:12px">⚠️</div>
    <h3>¿Reiniciar todo?</h3>
    <p>Se borrará todo tu progreso, XP y estadísticas. Esta acción no se puede deshacer.</p>
    <div class="mbtns">
      <button class="mbtn" style="background:var(--red);color:#fff" onclick="doReset()">🗑️ Sí, reiniciar</button>
      <button class="mbtn ghost" onclick="closeModal()">Cancelar</button>
    </div></div>`;
  document.body.appendChild(ov);ov.addEventListener('click',e=>{if(e.target===ov)closeModal()});
}
function doReset(){localStorage.removeItem('ml_v5');closeModal();navTo('aprender');showToast('✅ Progreso reiniciado')}

/* ══ EFFECTS ══ */
function showFlash(msg){
  var el=document.getElementById('streakFlash');if(!el)return;
  el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1600);
}
function confetti(){
  var w=document.getElementById('confWrap');if(!w)return;
  for(var i=0;i<60;i++){
    var el=document.createElement('div');el.className='cp';
    el.style.cssText=`left:${Math.random()*100}%;background:${CONF_COLORS[Math.floor(Math.random()*CONF_COLORS.length)]};width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;animation:confFall ${1+Math.random()*1.5}s linear ${Math.random()*.5}s both;border-radius:${Math.random()>.5?'50%':'3px'}`;
    w.appendChild(el);setTimeout(()=>el.remove(),3000);
  }
}
function showToast(msg){
  var t=document.createElement('div');t.className='toast';t.textContent=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}

/* ══ INIT ══ */
window.addEventListener('DOMContentLoaded',()=>{
  applyTheme(localStorage.getItem('ml_th')||'light');
  if(localStorage.getItem('ml_snd')==='0'){soundOn=false;var b=document.getElementById('soundBtn');if(b)b.textContent='🔇'}
  navTo('aprender');
});
