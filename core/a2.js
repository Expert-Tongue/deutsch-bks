// Shared code for every language's A2 page. Language content comes from the page's data.js (loaded first).
(function(){
const $ = s=>document.querySelector(s);
const el = (t,a={},h='')=>{const e=document.createElement(t);for(const k in a){if(k==='class')e.className=a[k];else e.setAttribute(k,a[k]);}if(h)e.innerHTML=h;return e;};
const store = {get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const ICON_SPK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
const ICON_CHK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>';
let deVoice=null,deVoices=[];
const VPREF=[/natural|neural|online/i,/google/i,/(anna|petra|markus|yannick|helena|katja|conrad|hedda|stefan|florian|amala|seraphina|vicki|marlene|hans)/i];
function vScore(v){let s=0;if(/^de[-_]DE/i.test(v.lang))s+=50;else if(/^de/i.test(v.lang))s+=30;VPREF.forEach((r,i)=>{if(r.test(v.name))s+=12-i*3});return s}
function loadVoices(){let all=[];try{all=speechSynthesis.getVoices()}catch(e){}deVoices=all.filter(v=>/^de([-_]|$)/i.test(v.lang)||/deutsch|german/i.test(v.name)).sort((a,b)=>vScore(b)-vScore(a));const saved=store.get('etbks-voice',null);deVoice=deVoices.find(v=>v.name===saved)||deVoices[0]||null;renderVoiceBar()}
function renderVoiceBar(){const sel=document.getElementById('voiceSel');if(!sel)return;sel.innerHTML='';deVoices.forEach(v=>{const o=document.createElement('option');o.value=v.name;o.textContent=v.name.replace(/Microsoft |Google /,'')+' ('+v.lang+')';if(deVoice&&v.name===deVoice.name)o.selected=true;sel.appendChild(o)});sel.hidden=!deVoices.length;document.getElementById('voiceMissing').hidden=!!deVoices.length;document.getElementById('voiceOk').hidden=!deVoices.length}
try{speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
[0,300,1000,2500].forEach(t=>setTimeout(loadVoices,t));
function speak(t,rate){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/…|___|\(Pl\.\)|\(PLZ\)|\+ (Akk|Dat)\.?/g,' '));if(deVoice){u.voice=deVoice;u.lang=deVoice.lang}else{u.lang='de-DE'}u.rate=rate||0.9;speechSynthesis.speak(u)}catch(e){}}
document.getElementById('voiceSel').onchange=e=>{deVoice=deVoices.find(v=>v.name===e.target.value)||deVoice;store.set('etbks-voice',deVoice&&deVoice.name);speak('Guten Tag! Ich spreche Deutsch.')};
document.getElementById('voiceTest').onclick=()=>speak('Guten Tag! Ich spreche Deutsch. Wie geht es Ihnen?');



const learned = new Set(store.get(T.k+'-learned',[]));
let state={cat:'all',show:T.show||'all',variant:store.get(T.vk+'-variant','ALL'),flash:false,q:''};
const total = V.reduce((n,g)=>n+g.w.length,0);
const key=(g,i)=>g.id+':'+i;
function parseBks(s){return s.split('|').map(p=>{p=p.trim();const m=p.match(TAGRE);return m?{tags:m[1].split('/'),t:m[2]}:{tags:null,t:p}})}
function bksHtml(s){let parts=parseBks(s);if(state.variant!=='ALL'){const f=parts.filter(p=>!p.tags||p.tags.includes(state.variant));if(f.length)parts=f.map(p=>({tags:null,t:p.t}));}return parts.map(p=>`<span class="var">${p.tags?`<i>${p.tags.join('/')}</i>`:''}${p.t}</span>`).join('')}
function deHtml(d){let m=d.match(/^(der|die|das)\s(.*)$/);if(m)return `<span class="art g-${m[1]}">${m[1]}</span> ${m[2]}`;m=d.match(/^(hat|ist)\s(\S+)\s?(.*)$/);if(m)return `<span class="art g-aux">${m[1]}</span> ${m[2]} <small class="inf">${m[3]}</small>`;return d}
function sayText(d){const m=d.match(/^(hat|ist)\s(\S+)/);return m?(m[1]==='hat'?'er hat ':'er ist ')+m[2]:d.replace(/\(.*?\)/g,'')}

function renderCats(){const c=$('#cats');c.innerHTML='';const mk=(id,label,n)=>{const b=el('button',{class:'cat','aria-pressed':String(state.cat===id)},`${label}<em>${n}</em>`);b.onclick=()=>{state.cat=id;renderCats();renderVocab()};c.appendChild(b)};mk('all',T.all,total);V.forEach(g=>mk(g.id,g.de,g.w.length))}
function renderProgress(){const n=learned.size;$('#pbar').style.width=(n/total*100)+'%';$('#ptext').textContent=`${n} ${T.learned} · ${total} total · ${Math.round(n/total*100)}%`}
function renderVocab(){
  const box=$('#vocab');box.innerHTML='';box.className=state.flash?'flash':'';const q=state.q.toLowerCase();let any=false;
  V.filter(g=>state.cat==='all'||g.id===state.cat).forEach(g=>{
    const items=g.w.map((w,i)=>({w,i})).filter(({w})=>!q||w.join(' ').toLowerCase().includes(q));if(!items.length)return;any=true;
    const left=g.w.filter((w,i)=>!learned.has(key(g,i))).length;const sec=el('section',{class:'group'});
    sec.appendChild(el('div',{class:'group-head'},`<h2>${g.de}<small>${g.bks}</small></h2><span>${left} ${T.left}</span>`));
    if(!q)sec.appendChild(el('div',{class:'tip'},`<b>${T.tip}</b><span>${g.tip}</span>`));
    const grid=el('div',{class:'grid'});
    items.forEach(({w,i})=>{const k=key(g,i);const c=el('div',{class:'card'+(learned.has(k)?' learned':'')});let m='';if(state.show!=='bks')m+=`<div class="en">${w[1]}</div>`;if(state.show!=='en')m+=`<div class="bks${T.bkscls}">${bksHtml(w[2])}</div>`;
      c.innerHTML=`<div class="de">${deHtml(w[0])}</div><div class="meaning">${m}</div><div class="acts"><button class="icon spk" aria-label="Listen">${ICON_SPK}</button><button class="icon chk" aria-pressed="${learned.has(k)}" aria-label="Mark as learned">${ICON_CHK}</button></div>`;
      c.querySelector('.spk').onclick=e=>{e.stopPropagation();speak(sayText(w[0]))};
      c.querySelector('.chk').onclick=e=>{e.stopPropagation();if(learned.has(k))learned.delete(k);else learned.add(k);store.set(T.k+'-learned',[...learned]);c.classList.toggle('learned');e.currentTarget.setAttribute('aria-pressed',learned.has(k));renderProgress();sec.querySelector('.group-head span').textContent=g.w.filter((x,j)=>!learned.has(key(g,j))).length+' '+T.left};
      if(state.flash)c.onclick=()=>c.classList.toggle('open');grid.appendChild(c)});
    sec.appendChild(grid);box.appendChild(sec)});
  if(!any)box.appendChild(el('div',{class:'empty'},T.empty));
}
function seg(id,prop,after){const s=$(id);s.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.v===state[prop]));b.onclick=()=>{state[prop]=b.dataset.v;s.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(after)after();renderVocab()}})}
seg('#showSeg','show');seg('#varSeg','variant',()=>store.set(T.vk+'-variant',state.variant));
$('#flashBtn').onclick=e=>{state.flash=!state.flash;e.currentTarget.setAttribute('aria-pressed',state.flash);renderVocab()};
$('#q').oninput=e=>{state.q=e.target.value.trim();renderVocab()};
$('#resetBtn').onclick=()=>{$('#resetConfirm').hidden=false};$('#resetNo').onclick=()=>{$('#resetConfirm').hidden=true};
$('#resetYes').onclick=()=>{learned.clear();store.set(T.k+'-learned',[]);$('#resetConfirm').hidden=true;renderProgress();renderVocab()};
renderCats();renderProgress();renderVocab();

const tabs=document.querySelectorAll('.tab');
function showTab(id){tabs.forEach(t=>t.setAttribute('aria-selected',String(t.dataset.tab===id)));document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!=='p-'+id)}
tabs.forEach(t=>t.onclick=()=>{showTab(t.dataset.tab);try{history.replaceState(null,'','#'+t.dataset.tab)}catch(e){location.hash=t.dataset.tab}});
const h=location.hash.slice(1);if([...tabs].some(t=>t.dataset.tab===h))showTab(h);
window.addEventListener('hashchange',()=>{const x=location.hash.slice(1);if([...tabs].some(t=>t.dataset.tab===x))showTab(x)});

// Grammatik extras

const ft=$('#falseTable tbody');FALSE.forEach(r=>ft.appendChild(el('tr',{},`<td><b>${deHtml(r[0])}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td>`)));

const lw=$('#loanwords');LOAN.forEach(l=>{const b=el('button',{class:'flip'},`<span class="front"><small>Deutsch</small>${deHtml(l[0])}</span><span class="back">${l[1]}<span>Tap again to hear it</span></span>`);b.onclick=()=>{if(b.classList.contains('open'))speak(l[0]);b.classList.add('open')};lw.appendChild(b)});

// Prüfung
let ans={};const EX=[];
function addQ(container,q){
  EX.push(q);const d=el('div',{class:'q'});if(q.teil)container.appendChild(el('div',{class:'teil'},q.teil));
  if(q.audio){const L=el('div',{class:'listen'});const p=el('button',{class:'btn primary'},ICON_SPK.replace('<svg','<svg style="width:15px;height:15px"')+' Anhören');p.onclick=()=>speak(q.audio,.92);const t=el('button',{class:'btn','aria-pressed':'false'},'Text');const tx=el('div',{class:'text'},q.audio);tx.hidden=true;t.onclick=()=>{tx.hidden=!tx.hidden;t.setAttribute('aria-pressed',String(!tx.hidden))};L.append(p,t);d.append(L,tx)}
  if(q.text)d.appendChild(el('div',{class:'text'},q.text));
  if(q.board)d.appendChild(el('div',{class:'sign board'},q.board));
  d.appendChild(el('div',{class:'prompt'},q.p));
  const o=el('div',{class:'opts'});const ex=el('div',{class:'explain'},q.ex);ex.hidden=true;
  const opts=q.rf?[['R',T.r],['F',T.f]]:q.o;
  opts.forEach(([v,label])=>{const b=el('button',{class:'opt'},label);b.onclick=()=>{if(ans[q.id])return;ans[q.id]=v===q.a?'ok':'no';o.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add(v===q.a?'right':'wrong');if(v!==q.a)o.querySelectorAll('button')[opts.findIndex(x=>x[0]===q.a)].classList.add('right');ex.hidden=false;upd()};o.appendChild(b)});
  d.append(o,ex);container.appendChild(d)}
function upd(){const v=Object.values(ans);const ok=v.filter(x=>x==='ok').length;$('#scoreVal').textContent=`${ok} / ${EX.length}`;$('#okVal').textContent=ok;$('#noVal').textContent=v.length-ok}


HQ.forEach(q=>addQ($('#hoeren'),q));LQ.forEach(q=>addQ($('#lesen'),q));upd();
$('#examReset').onclick=()=>{ans={};document.querySelectorAll('.opt').forEach(b=>{b.disabled=false;b.classList.remove('right','wrong')});document.querySelectorAll('.q .explain').forEach(e=>e.hidden=true);upd()};

// Schreiben
function writer(boxId,cfg){
  const box=$(boxId);
  box.insertAdjacentHTML('beforeend',`<label for="${cfg.id}" class="note">${T.yourtext}</label><textarea id="${cfg.id}" placeholder="${cfg.ph}"></textarea><div class="controls"><span class="counter" id="${cfg.id}-wc"></span><button class="btn" id="${cfg.id}-mb">Show model answer</button></div><div class="pairs" id="${cfg.id}-cl"></div><div class="model" id="${cfg.id}-m" hidden>${cfg.model}</div>`);
  const ta=$('#'+cfg.id);
  function check(){const t=ta.value.trim();const w=t?t.split(/\s+/).length:0;$('#'+cfg.id+'-wc').textContent=`${w} ${T.words}${w>=cfg.min&&w<=cfg.max+8?' ✓ good length':' (aim for '+cfg.min+'–'+cfg.max+')'}`;const cl=$('#'+cfg.id+'-cl');cl.innerHTML='';cfg.check.forEach(c=>{const ok=c[1].test(t);cl.appendChild(el('div',{},`<b style="color:${ok?'var(--ok)':'var(--muted)'}">${ok?'✓':'○'} ${c[0]}</b><span>${ok?'done':'missing'}</span>`))})}
  ta.oninput=check;check();
  $('#'+cfg.id+'-mb').onclick=e=>{const m=$('#'+cfg.id+'-m');m.hidden=!m.hidden;e.currentTarget.textContent=m.hidden?'Show model answer':'Hide model answer'};
}


PI.forEach(p=>$('#phInf').appendChild(el('div',{},`<b>${p[0]}</b><span>${p[1]}</span>`)));PF.forEach(p=>$('#phForm').appendChild(el('div',{},`<b>${p[0]}</b><span>${p[1]}</span>`)));

// Sprechen
function flipSet(target,items,front,back){const t=$(target);items.forEach(it=>{const b=el('button',{class:'flip'},`<span class="front">${front(it)}</span><span class="back">${back(it)}</span>`);b.onclick=()=>{if(b.classList.contains('open'))speak(it.say);else b.classList.add('open')};t.appendChild(b)})}

flipSet('#t1cards',T1,i=>`<small>Thema: Persönliches</small>${i.k}`,i=>`<b>A:</b> ${i.q}<br><b>B:</b> ${i.a}<span>${i.bks}</span>`);

const t2s=$('#t2seg');let t2i=0;
function renderT2(){t2s.innerHTML='';T2.forEach((c,i)=>{const b=el('button',{'aria-pressed':String(i===t2i)},c.k);b.onclick=()=>{t2i=i;renderT2()};t2s.appendChild(b)});const c=T2[t2i];$('#t2card').innerHTML=`<div class="topic"><div class="topic-card"><small>Thema</small><b>${c.q}</b><div class="prompts">${c.prompts.map(p=>`<span>${p}</span>`).join('')}</div></div><div class="model">${c.model}<span class="note" style="display:block;margin-top:8px">${c.bks}</span></div><div class="controls"><button class="btn primary" id="t2play">${ICON_SPK.replace('<svg','<svg style="width:15px;height:15px"')} Listen to the model</button></div></div>`;$('#t2play').onclick=()=>speak(c.model,.92)}
renderT2();
// Teil 3 calendar
const HOURS=['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
WRITERS.forEach(x=>writer(x[0],x[1]));
const B={'9:00':'Deutschkurs','10:00':'Deutschkurs','11:00':'Deutschkurs','12:00':'Mittagessen','13:00':'Friseur','16:00':'Wohnung putzen','17:00':'Geburtstagsparty','18:00':'Geburtstagsparty'};
const cal=$('#cal');cal.appendChild(el('div',{class:'ch'},'Uhrzeit'));cal.appendChild(el('div',{class:'ch'},'Sie'));cal.appendChild(el('div',{class:'ch'},'Ihr Partner'));
HOURS.forEach(hh=>{const b=el('button',{class:'hr'},hh);b.onclick=()=>{cal.querySelectorAll('.hr').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');const r=$('#calResult');if(!A[hh]&&!B[hh]){r.innerHTML=`<b style="color:var(--ok)">✓ Um ${hh} Uhr haben Sie beide Zeit.</b> Super, das passt!${T.both}`}else{const who=[A[hh]?`Sie: ${A[hh]}`:'',B[hh]?`Partner: ${B[hh]}`:''].filter(Boolean).join(' · ');r.innerHTML=`<b style="color:var(--bad)">✗ Um ${hh} Uhr geht es leider nicht.</b> ${who}`}};cal.appendChild(b);cal.appendChild(el('div',{class:'slot'+(A[hh]?' busy':'')},A[hh]||'frei'));cal.appendChild(el('div',{class:'slot'+(B[hh]?' busy':'')},B[hh]||'frei'))});
PLAN.forEach(p=>$('#planPhr').appendChild(el('div',{},`<b>${p[0]}</b><span>${p[1]}</span>`)));
$('#planModel').textContent=T.planModel;
})();
