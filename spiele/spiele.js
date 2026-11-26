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

  // Language of the translations: bks (Bosnian/Croatian/Serbian) or fa (Persian)
  (function(){try{const q=new URLSearchParams(location.search).get('lang');if(self.LANGS&&self.LANGS.some(x=>x.code===q))store.set('spiele-lang',q)}catch(e){}})();
  function lang(){return store.get('spiele-lang','bks')}
  document.documentElement.dataset.lang=lang();
  const TXT={
    bks:{name:'BKS',ok:'Točno!',no:'Noch nicht. Ovako je točno (tačno):',mix:'Mix · sve teme',review:'Review these · ponovite ove riječi:',again:'Look at these again · pogledajte ponovno:',allok:'All correct. Sve točno!',nomist:'No mistakes. Bez greške!',best:'New best! Novi rekord!'},
    fa:{name:'فارسی',ok:'<span class="fa">درسته!</span>',no:'Noch nicht. <span class="fa">جواب درست:</span>',mix:'Mix · همه موضوع'+'\u200c'+'ها',review:'Review these · <span class="fa">این کلمات را مرور کنید:</span>',again:'Look at these again · <span class="fa">دوباره نگاه کنید:</span>',allok:'All correct. <span class="fa">همه درست!</span>',nomist:'No mistakes. <span class="fa">بدون اشتباه!</span>',best:'New best! رکورد جدید!'},
    tr:{name:'Türkçe',ok:'Doğru!',no:'Noch nicht. Doğrusu:',mix:'Mix · tüm konular',review:'Review these · bu kelimeleri tekrar edin:',again:'Look at these again · tekrar bakın:',allok:'All correct. Hepsi doğru!',nomist:'No mistakes. Hatasız!',best:'New best! Yeni rekor!'},
    ur:{name:'اردو',ok:'صحیح!',no:'Noch nicht. صحیح جواب:',mix:'Mix · تمام موضوعات',review:'Review these · ان الفاظ کو دہرائیں:',again:'Look at these again · انہیں پھر دیکھیں:',allok:'All correct. سب صحیح!',nomist:'No mistakes. کوئی غلطی نہیں!',best:'New best! نیا ریکارڈ!'},
    hi:{name:'हिंदी',ok:'सही!',no:'Noch nicht. सही जवाब:',mix:'Mix · सभी विषय',review:'Review these · इन शब्दों को दोहराएँ:',again:'Look at these again · इन्हें फिर देखें:',allok:'All correct. सब सही!',nomist:'No mistakes. कोई ग़लती नहीं!',best:'New best! नया रिकॉर्ड!'},
    es:{name:'Español',ok:'¡Correcto!',no:'Noch nicht. La respuesta correcta:',mix:'Mix · todos los temas',review:'Review these · repasa estas palabras:',again:'Look at these again · mira estas otra vez:',allok:'All correct. ¡Todo correcto!',nomist:'No mistakes. ¡Sin errores!',best:'New best! ¡Nuevo récord!'},
    pt:{name:'Português',ok:'Certo!',no:'Noch nicht. A resposta certa:',mix:'Mix · todos os temas',review:'Review these · revê / revise estas palavras:',again:'Look at these again · vê / veja estas outra vez:',allok:'All correct. Tudo certo!',nomist:'No mistakes. Sem erros!',best:'New best! Novo recorde!'},
    pl:{name:'Polski',ok:'Dobrze!',no:'Noch nicht. Prawidłowa odpowiedź:',mix:'Mix · wszystkie tematy',review:'Review these · powtórz te słowa:',again:'Look at these again · zobacz je jeszcze raz:',allok:'All correct. Wszystko dobrze!',nomist:'No mistakes. Bez błędów!',best:'New best! Nowy rekord!'},
    ar:{name:'العربية',ok:'صحيح!',no:'Noch nicht. الإجابة الصحيحة:',mix:'Mix · كل المواضيع',review:'Review these · راجع هذه الكلمات:',again:'Look at these again · انظر إليها مرة أخرى:',allok:'All correct. كله صحيح!',nomist:'No mistakes. بلا أخطاء!',best:'New best! رقم قياسي جديد!'},
    ru:{name:'Русский',ok:'Правильно!',no:'Noch nicht. Правильный ответ:',mix:'Mix · все темы',review:'Review these · повтори эти слова:',again:'Look at these again · посмотри на них ещё раз:',allok:'All correct. Всё правильно!',nomist:'No mistakes. Без ошибок!',best:'New best! Новый рекорд!'},
    fr:{name:'Français',ok:'Juste !',no:'Noch nicht. La bonne réponse :',mix:'Mix · tous les thèmes',review:'Review these · révise ces mots :',again:'Look at these again · regarde-les encore une fois :',allok:'All correct. Tout est juste !',nomist:'No mistakes. Aucune faute !',best:'New best! Nouveau record !'},
    it:{name:'Italiano',ok:'Giusto!',no:'Noch nicht. La risposta giusta:',mix:'Mix · tutti i temi',review:'Review these · ripassa queste parole:',again:'Look at these again · guardale ancora una volta:',allok:'All correct. Tutto giusto!',nomist:'No mistakes. Nessun errore!',best:'New best! Nuovo record!'},
    uk:{name:'Українська',ok:'Правильно!',no:'Noch nicht. Правильна відповідь:',mix:'Mix · усі теми',review:'Review these · повтори ці слова:',again:'Look at these again · подивись на них ще раз:',allok:'All correct. Усе правильно!',nomist:'No mistakes. Без помилок!',best:'New best! Новий рекорд!'},
    en:{name:'English',ok:'Correct!',no:'Noch nicht. The right answer:',mix:'Mix · all topics',review:'Review these words:',again:'Look at these again:',allok:'All correct!',nomist:'No mistakes!',best:'New best!'},
    vi:{name:'Tiếng Việt',ok:'Đúng rồi!',no:'Noch nicht. Đáp án đúng:',mix:'Mix · tất cả chủ đề',review:'Ôn lại những từ này:',again:'Xem lại những từ này:',allok:'Đúng hết!',nomist:'Không sai lỗi nào!',best:'Kỷ lục mới!'},
    zh:{name:'中文',ok:'对了！',no:'Noch nicht. 正确答案：',mix:'Mix · 全部主题',review:'复习这些词：',again:'再看看这些词：',allok:'全对！',nomist:'没有错误！',best:'新纪录！'},
    tl:{name:'Tagalog',ok:'Tama!',no:'Noch nicht. Ang tamang sagot:',mix:'Mix · lahat ng paksa',review:'Balikan ang mga salitang ito:',again:'Tingnan ulit ang mga ito:',allok:'Lahat tama!',nomist:'Walang mali!',best:'Bagong record!'},
    ml:{name:'മലയാളം',ok:'ശരി!',no:'Noch nicht. ശരിയായ ഉത്തരം:',mix:'Mix · എല്ലാ വിഷയങ്ങളും',review:'ഈ വാക്കുകൾ ആവർത്തിക്കുക:',again:'ഇവ വീണ്ടും നോക്കുക:',allok:'എല്ലാം ശരി!',nomist:'തെറ്റുകളില്ല!',best:'പുതിയ റെക്കോർഡ്!'},
    ku:{name:'Kurdî',ok:'Rast e!',no:'Noch nicht. Bersiva rast:',mix:'Mix · hemû mijar',review:'Van peyvan dubare bike:',again:'Li van dîsa binêre:',allok:'Hemû rast in!',nomist:'Tu şaşî tune!',best:'Rekora nû!'},
    th:{name:'ไทย',ok:'ถูกต้อง!',no:'Noch nicht. คำตอบที่ถูกคือ:',mix:'Mix · ทุกหัวข้อ',review:'ทบทวนคำเหล่านี้:',again:'ดูคำเหล่านี้อีกครั้ง:',allok:'ถูกทั้งหมด!',nomist:'ไม่มีผิดเลย!',best:'สถิติใหม่!'},
    ko:{name:'한국어',ok:'정답!',no:'Noch nicht. 정답은:',mix:'Mix · 모든 주제',review:'이 단어들을 복습하세요:',again:'이 단어들을 다시 보세요:',allok:'모두 정답!',nomist:'틀린 게 없어요!',best:'새 기록!'},
    bn:{name:'বাংলা',ok:'ঠিক!',no:'Noch nicht. সঠিক উত্তর:',mix:'Mix · সব বিষয়',review:'এই শব্দগুলো আবার দেখুন:',again:'এগুলো আবার দেখুন:',allok:'সব ঠিক!',nomist:'কোনো ভুল নেই!',best:'নতুন রেকর্ড!'},
    sq:{name:'Shqip',ok:'Saktë!',no:'Noch nicht. Përgjigjja e saktë:',mix:'Mix · të gjitha temat',review:'Përsërit këto fjalë:',again:'Shikoji këto përsëri:',allok:'Të gjitha saktë!',nomist:'Asnjë gabim!',best:'Rekord i ri!'},
    bg:{name:'Български',ok:'Вярно!',no:'Noch nicht. Верният отговор е:',mix:'Mix · всички теми',review:'Преговори тези думи:',again:'Виж ги пак:',allok:'Всичко е вярно!',nomist:'Няма грешки!',best:'Нов рекорд!'},
    el:{name:'Ελληνικά',ok:'Σωστά!',no:'Noch nicht. Η σωστή απάντηση:',mix:'Mix · όλα τα θέματα',review:'Επανάλαβε αυτές τις λέξεις:',again:'Δες τες ξανά:',allok:'Όλα σωστά!',nomist:'Κανένα λάθος!',best:'Νέο ρεκόρ!'},
    hu:{name:'Magyar',ok:'Helyes!',no:'Noch nicht. A helyes válasz:',mix:'Mix · minden téma',review:'Ismételd át ezeket a szavakat:',again:'Nézd meg ezeket újra:',allok:'Minden helyes!',nomist:'Egy hiba sincs!',best:'Új rekord!'},
    ro:{name:'Română',ok:'Corect!',no:'Noch nicht. Răspunsul corect:',mix:'Mix · toate temele',review:'Review these · repetă aceste cuvinte:',again:'Look at these again · uită-te din nou la ele:',allok:'All correct. Totul corect!',nomist:'No mistakes. Nicio greșeală!',best:'New best! Record nou!'}
  };
  function T(k){return (TXT[lang()]||TXT.bks)[k]}
  // Translation with variants (BKS: BS/HR/SR, Persian: IR/AF), as chosen on the A1/A2 pages
  function bks(s){
    const variant=store.get('et'+lang()+'-variant','ALL');
    let parts=s.split('|').map(p=>{p=p.trim();const m=p.match(/^((?:HR|BS|SR|IR|AF|ES|LA|BR|PT|UK|US|HN|SG)(?:\/(?:HR|BS|SR|IR|AF|ES|LA|BR|PT|UK|US|HN|SG))*)\s+(.*)$/);return m?{tags:m[1].split('/'),t:m[2]}:{tags:null,t:p}});
    if(variant!=='ALL'){const f=parts.filter(p=>!p.tags||p.tags.includes(variant));if(f.length)parts=f}
    return parts.map(p=>p.t).join(' / ');
  }
  function esc(t){return String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
  function trHtml(s){const t=esc(bks(s));return (lang()==='fa'||lang()==='ar'||lang()==='ur')?`<span class="fa" dir="rtl">${t}</span>`:t}
  function langSeg(el,onChange){
    el.innerHTML='';el.className='seg';el.setAttribute('role','group');el.setAttribute('aria-label','Translation language');
    (self.LANGS||[]).map(x=>[x.code,x.short]).forEach(([v,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-pressed',String(lang()===v));
      b.onclick=()=>{store.set('spiele-lang',v);document.documentElement.dataset.lang=v;[...el.children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)));needWords(v,()=>onChange&&onChange(v))};el.appendChild(b)});
  }
  // Word lists load on demand: only the chosen language is downloaded
  function needWords(v,cb){
    if(v==='bks'||window['WORDS_'+v.toUpperCase()]){cb();return}
    const s=document.createElement('script');s.src='words-'+v+'.js';s.onload=s.onerror=()=>cb();document.head.appendChild(s);
  }

  // Level: a1, a2 or both, remembered across games
  function level(){return store.get('spiele-level','a2')}
  function groups(lvl){lvl=lvl||level();const W=(lang()==='bks'?window.WORDS:window['WORDS_'+lang().toUpperCase()])||window.WORDS||{};return lvl==='both'?[...W.a1,...W.a2]:(W[lvl]||[])}
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

  window.Spiele={store,speak,tone,bks,trHtml,lang,langSeg,T,level,groups,levelSeg,soundToggle,shuffle,streak,currentStreak,SPK};
  if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('../sw.js').catch(()=>{})})}
})();
