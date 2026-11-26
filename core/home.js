// Fills the "Andere Sprachen" card on each language home page from /languages.js.
(function(){
  var s=document.currentScript,me=s&&s.dataset.lang,L=(self.LANGS||[]).filter(function(x){return x.code!==me});
  if(!L.length)return;
  var c=document.querySelector('[data-other-codes]');
  if(c)c.textContent=L.map(function(x){return x.code.toUpperCase()}).join(' · ');
  var n=document.querySelector('[data-other-names]');
  if(n){var a=L.map(function(x){return x.en});n.textContent='The same course for speakers of '+a.slice(0,-1).join(', ')+' and '+a[a.length-1]+'.'}
})();
