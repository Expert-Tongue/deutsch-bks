// Shared helpers for the games: storage, German voice, BKS variant, level, sounds.
(function(){
  const store={
    get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
    set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  };

  // German voice: same choice as on the A1/A2 pages (saved as etbks-voice)
  let voices=[],voice=null;
  function loadVoices(){
    try{voices=speechSynthesis.getVoices().filter(v=>/^de([-_]|$)/i.test(v.lang))}catch(e){voices=[]}
    const saved=store.get('etbks-voice',null);
    voice=voices.find(v=>v.name===saved)||voices.find(v=>/natural|neural|online|google/i.test(v.name)&&/^de[-_]DE/i.test(v.lang))||voices.find(v=>/^de[-_]DE/i.test(v.lang))||voices[0]||null;
  }
  try{speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
  [0,400,1500].forEach(t=>setTimeout(loadVoices,t));
  function speak(text,rate){
    if(!store.get('spiele-sound',true))return;
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replace(/…|\(Pl\.\)|\+ (Akk|Dat)\.?/g,' '));
      if(voice){u.voice=voice;u.lang=voice.lang}else u.lang='de-DE';u.rate=rate||0.95;speechSynthesis.speak(u)}catch(e){}
  }

  // Short feedback tones
  let ctx=null;
  function tone(ok){
    if(!store.get('spiele-sound',true))return;
    try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
      const t=ctx.currentTime;o.type='sine';
      if(ok){o.frequency.setValueAtTime(660,t);o.frequency.setValueAtTime(880,t+.08)}else{o.frequency.setValueAtTime(220,t)}
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+(ok?.22:.3));
      o.start(t);o.stop(t+.32)}catch(e){}
  }

  // BKS variant (set on the A1/A2 pages: ALL, BS, HR, SR)
  function bks(s){
    const variant=store.get('etbks-variant','ALL');
    let parts=s.split('|').map(p=>{p=p.trim();const m=p.match(/^((?:HR|BS|SR)(?:\/(?:HR|BS|SR))*)\s+(.*)$/);return m?{tags:m[1].split('/'),t:m[2]}:{tags:null,t:p}});
    if(variant!=='ALL'){const f=parts.filter(p=>!p.tags||p.tags.includes(variant));if(f.length)parts=f}
    return parts.map(p=>p.t).join(' / ');
  }

  // Level: a1, a2 or both, remembered across games
  function level(){return store.get('spiele-level','a2')}
  function groups(lvl){lvl=lvl||level();const W=window.WORDS||{};return lvl==='both'?[...W.a1,...W.a2]:(W[lvl]||[])}
  function levelSeg(el,onChange){
    const opts=[['a1','A1'],['a2','A2'],['both','A1 + A2']];
    el.innerHTML='';el.className='seg';el.setAttribute('role','group');el.setAttribute('aria-label','Level');
    opts.forEach(([v,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-pressed',String(level()===v));
      b.onclick=()=>{store.set('spiele-level',v);[...el.children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)));onChange&&onChange(v)};el.appendChild(b)});
  }
  const SPK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
  const MUTE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
  function soundToggle(btn){
    const draw=()=>{const on=store.get('spiele-sound',true);btn.innerHTML=on?SPK:MUTE;btn.setAttribute('aria-label',on?'Sound off':'Sound on');btn.setAttribute('aria-pressed',String(on))};
    btn.onclick=()=>{store.set('spiele-sound',!store.get('spiele-sound',true));draw()};draw();
  }
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function streak(){ // days in a row with at least one finished game
    const today=new Date().toISOString().slice(0,10);const s=store.get('spiele-streak',{last:null,n:0});
    if(s.last===today)return s.n;
    const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
    const n=s.last===y?s.n+1:1;store.set('spiele-streak',{last:today,n});return n;
  }
  function currentStreak(){const s=store.get('spiele-streak',{last:null,n:0});const today=new Date().toISOString().slice(0,10);const y=new Date(Date.now()-864e5).toISOString().slice(0,10);return (s.last===today||s.last===y)?s.n:0}

  window.Spiele={store,speak,tone,bks,level,groups,levelSeg,soundToggle,shuffle,streak,currentStreak,SPK};
  if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('../sw.js').catch(()=>{})})}
})();
