
(()=>{
'use strict';
const BUILD='water-v9.4-approved-production-20260921';
const DATA_BASE='../data/water/';
const FILES=['rights.public.json','storage.public.json','use.public.json','system.public.json','sources.public.json'];
const state={tab:'rights',rightsMode:'kaw',year:2024,data:null,sources:new Map(),installPrompt:null};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmt=n=>n==null?'—':Number(n).toLocaleString(undefined,{maximumFractionDigits:1});

async function loadData(){
  const res=await Promise.all(FILES.map(async f=>{
    const r=await fetch(DATA_BASE+f,{cache:'no-store'});
    if(!r.ok)throw new Error(`${f} returned HTTP ${r.status}`);
    return r.json();
  }));
  state.data={rights:res[0],storage:res[1],use:res[2],system:res[3],sources:res[4]};
  (state.data.sources.records||[]).forEach(s=>state.sources.set(s.id,s));
}
function safeTab(v){return ['rights','storage','use','flow'].includes(v)?v:'rights'}
function query(){
  const p=new URLSearchParams(location.search);
  return {tab:safeTab(p.get('mode')),view:p.get('view')==='basin'?'basin':'kaw',record:(p.get('record')||'').slice(0,72),search:(p.get('q')||'').slice(0,80)};
}
function updateURL(changes={}){
  const p=new URLSearchParams(location.search);
  const tab=changes.tab??state.tab; p.set('mode',safeTab(tab));
  const view=changes.view??state.rightsMode; view==='basin'?p.set('view','basin'):p.delete('view');
  if(changes.record!==undefined){changes.record?p.set('record',changes.record):p.delete('record')}
  if(changes.search!==undefined){changes.search?p.set('q',changes.search):p.delete('q')}
  history.replaceState(null,'','?'+p.toString());
}
function toast(msg){
  const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200);
}
function setTab(id,{url=true,scroll=false}={}){
  state.tab=safeTab(id);
  $$('.tab').forEach(b=>{const on=b.dataset.tab===state.tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
  $$('.panel').forEach(p=>p.classList.toggle('hidden',p.id!==state.tab));
  $$('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===state.tab));
  if(url)updateURL({tab:state.tab,record:''});
  if(scroll){const target=matchMedia('(min-width:700px)').matches?document.querySelector('.tabswrap'):document.querySelector('.statusbar');target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
}
function statusLabel(r){
  const s=(r.public_status||'Source-linked public data');
  const verify=/verify/i.test(s);
  return `<span class="tag ${verify?'verify':'source'}">${esc(s)}</span>`;
}
function clsTag(r){
  const c=(r.permit_class||'').toLowerCase();
  const k=c.includes('term')?'term':c.includes('vested')?'vested':c.includes('pending')?'pending':'';
  return r.permit_class?`<span class="tag ${k}">${esc(r.permit_class)}</span>`:'';
}
function recordButton(r){
  return `<button class="record ${r.local_highlight?'enid':''}" data-record="${esc(r.id)}" data-year="${Number(r.year)||0}" aria-label="${esc((r.holder||r.name)+' — '+(r.permit||r.id))}">
   <span class="yr">${esc(r.year||'—')}</span>
   <span class="rec"><b>${esc(r.holder||r.name)}</b><small>${esc(r.permit||r.id)}${r.use?' · '+esc(r.use):''}</small><span class="tags">${clsTag(r)}${statusLabel(r)}</span></span>
   <span class="qty"><b>${fmt(r.quantity)}</b><span>${esc(r.unit||'')}</span></span>
  </button>`;
}
function renderRights(){
  const d=state.data.rights;
  $('#kawRecords').innerHTML=(d.records||[]).map(recordButton).join('');
  $('#basinRecords').innerHTML=(d.broader_stream_system||[]).map(recordButton).join('');
  const years=(d.records||[]).map(r=>Number(r.year)).filter(Boolean);
  $('#yearRange').min=Math.min(...years);$('#yearRange').max=Math.max(...years);$('#yearRange').value=state.year;updateYear();
}
function updateYear(){
  const y=Number($('#yearRange').value);state.year=y;$('#yearLabel').textContent=y;
  let n=0; $$('#kawRecords .record').forEach(el=>{const show=Number(el.dataset.year)<=y;el.classList.toggle('dim',!show);if(show)n++});
  $('#visibleCount').textContent=`${n} visible`;$('#timelineStatus').textContent=`Showing ${n} current Kaw-coded records filed by ${y}.`;
}
function renderStorage(){
  $('#storageStats').innerHTML=(state.data.storage.records||[]).map(r=>`<div class="stat ${r.local_highlight?'local':''}"><div class="who">${esc(r.holder)}</div><div class="num">${fmt(r.quantity)}</div><div class="unit">${esc(r.unit)} storage</div><div class="note">${esc(r.public_status||'')}</div></div>`).join('');
}
function renderUse(){
  $('#useStats').innerHTML=(state.data.use.records||[]).map(r=>`<div class="stat ${r.holder==='City of Enid'?'local':''}"><div class="who">${esc(r.holder)}</div><div class="num">${fmt(r.quantity)}</div><div class="unit">${esc(r.unit)} · ${esc(r.year)}</div><div class="note">${esc(r.public_caution||r.public_status||r.status||'')}</div></div>`).join('');
}
function renderFlow(){
  const rs=(state.data.system.records||[]).sort((a,b)=>a.order-b.order);
  $('#flowButtons').innerHTML=rs.map((r,i)=>`<button class="flowbtn ${i===0?'active':''}" data-flow="${esc(r.id)}">${esc(r.name)}</button>`).join('');
  if(rs[0])showFlow(rs[0].id);
}
function showFlow(id){
  const r=(state.data.system.records||[]).find(x=>x.id===id);if(!r)return;
  $$('.flowbtn').forEach(b=>b.classList.toggle('active',b.dataset.flow===id));
  $('#flowTitle').textContent=r.name;$('#flowDesc').textContent=r.description+(r.public_caution?' '+r.public_caution:'');
  $('#flowStatus').textContent=`Selected ${r.name}. ${r.description}`;
}
function sourceCards(ids=[]){
  return ids.map(id=>state.sources.get(id)).filter(Boolean).map(s=>`<div class="sourcecard"><div class="authority">${esc(s.authority)}</div><b>${esc(s.title)}</b><p>This public source supports the record information shown above.</p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Open public source ↗</a></div>`).join('');
}
function allRecords(){
  return [...(state.data.rights.records||[]),...(state.data.rights.broader_stream_system||[]),...(state.data.storage.records||[]),...(state.data.use.records||[]),...(state.data.system.records||[])];
}
function openRecord(id,{url=true}={}){
  const r=allRecords().find(x=>x.id===id);if(!r)return false;
  $('#detailTitle').textContent=r.holder||r.name||r.id;
  const rows=[['Public ID',r.id],['Permit / record',r.permit],['Filed',r.filed],['Issued',r.issued],['Class',r.permit_class],['Status',r.status],['Quantity',r.quantity==null?null:`${r.quantity} ${r.unit||''}`],['Use / kind',r.use||r.kind]].filter(x=>x[1]!=null&&x[1]!=='');
  $('#detailBody').innerHTML=`<div class="trust">Source-linked public data</div>
   <div class="detailgrid">${rows.map(([k,v])=>`<div class="detail"><label>${esc(k)}</label><b>${esc(v)}</b></div>`).join('')}</div>
   <div class="bodycopy">${r.description?`<h3>What it is</h3><p>${esc(r.description)}</p>`:''}<h3>Record status</h3><p>${esc(r.public_status||'Public record')}</p>${r.public_caution?`<h3>Important qualifier</h3><p>${esc(r.public_caution)}</p>`:''}</div>
   ${sourceCards(r.source_ids||[])}
   <div class="sheetactions"><button class="sheetaction primary" data-share-record="${esc(r.id)}">Share this record</button></div>`;
  openSheet('detailSheet');if(url)updateURL({record:id});return true;
}
function openSheet(id){const e=$('#'+id);e.classList.add('open');e.setAttribute('aria-hidden','false');const f=e.querySelector('button,input,a');if(f)setTimeout(()=>f.focus(),0)}
function closeSheet(id){
  const e=$('#'+id);
  e.classList.remove('open');
  e.setAttribute('aria-hidden','true');
  if(id==='detailSheet')updateURL({record:''});
  if(id==='moreSheet')resetMore();
}
async function shareURL(url,title){
  try{
    if(navigator.share){await navigator.share({title,url});return}
  }catch(e){if(e.name==='AbortError')return}
  window.prompt('Copy this link:',url);
}
function shareCurrent(){
  const u=new URL(location.href);u.searchParams.delete('source');shareURL(u.toString(),'EPR Water Explorer');
}
function modeForRecord(id){
  if(id.startsWith('STOR-'))return 'storage';
  if(id.startsWith('USE-'))return 'use';
  if(id.startsWith('SYS-')||id.startsWith('PIPE-'))return 'flow';
  return 'rights';
}
function shareRecord(id){
  const u=new URL(location.href);u.searchParams.delete('source');u.searchParams.set('record',id);u.searchParams.set('mode',modeForRecord(id));shareURL(u.toString(),'EPR Water Explorer record');
}
function renderDataStatus(){
  const updated=state.data.rights.updated;
  const rights=(state.data.rights.records||[]).length;
  const sources=(state.data.sources.records||[]).length;
  $('#statusDate').textContent=`Updated ${updated}`;
  $('#statusCounts').textContent=`${rights} Kaw records · ${sources} public sources`;
}
function doSearch(q){
  q=q.trim().toLowerCase();const box=$('#searchResults');updateURL({search:q});
  if(!q){box.innerHTML='<div class="empty">Type a holder, permit number, place or topic.</div>';return}
  const hits=allRecords().filter(r=>[r.id,r.holder,r.name,r.permit,r.use,r.kind,r.status,r.public_status].filter(Boolean).join(' ').toLowerCase().includes(q)).slice(0,30);
  if(!hits.length){box.innerHTML='<div class="empty">No public match found. Search only covers records currently published in Water Explorer.</div>';return}
  box.innerHTML=hits.map(r=>`<button class="searchresult" data-record="${esc(r.id)}"><b>${esc(r.holder||r.name)}</b><span>${esc(r.permit||r.id)} · ${esc(r.public_status||'Public record')}</span></button>`).join('');
}
function resetMore(){
  $('#utilitySub').classList.add('hidden');
  $('#utilitySub').innerHTML='';
  $('#utilityHome').classList.remove('hidden');
  $('#utilityTitle').textContent='More';
}
function showSub(title,html){
  $('#utilityTitle').textContent=title;$('#utilityHome').classList.add('hidden');$('#utilitySub').classList.remove('hidden');$('#utilitySub').innerHTML=`<button class="sheetaction" id="backMore">← Back</button><div class="bodycopy">${html}</div>`;
  $('#backMore').addEventListener('click',resetMore);
}
function installStateText(){
  if(matchMedia('(display-mode: standalone)').matches)return 'Installed';
  if(state.installPrompt)return 'Ready to install';
  if(location.protocol==='https:')return 'Install option appears when your browser makes it available';
  return 'Install is available when Water Explorer is served over HTTPS';
}
async function installApp(){
  if(state.installPrompt){state.installPrompt.prompt();const choice=await state.installPrompt.userChoice;state.installPrompt=null;toast(choice.outcome==='accepted'?'Install accepted':'Install dismissed');return}
  showSub('Install Water Explorer',`<h3>Install status</h3><p>${esc(installStateText())}</p><h3>Why install?</h3><p>Installation adds a Water Explorer icon and launches the standalone app. It does not combine Water with Atlas or Explore Enid.</p>`);
}
function maybeFirstRun(){
  try{
    if(localStorage.getItem('epr-water-intro-v1')==='seen')return;
    openSheet('introSheet');
  }catch(e){}
}
function finishIntro(){
  try{localStorage.setItem('epr-water-intro-v1','seen')}catch(e){}
  closeSheet('introSheet');
}
function registerSW(){
  if(!('serviceWorker'in navigator)||location.protocol!=='https:')return;
  navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
}
function setupInstall(){
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e;$('#installLabel').textContent='Install Water Explorer'});
  window.addEventListener('appinstalled',()=>{state.installPrompt=null;toast('Water Explorer installed')});
}
function fail(msg){
  $('#loading').classList.add('hidden');$('#fatal').classList.remove('hidden');$('#fatal').textContent='Water Explorer could not load its public data. '+msg+' Try reloading the page. If the problem continues, use the EPR homepage link in More.';
}

async function init(){
 try{
  await loadData();
  $('#loading').classList.add('hidden');$('#appContent').classList.remove('hidden');
  renderRights();renderStorage();renderUse();renderFlow();renderDataStatus();
  const q=query();state.rightsMode=q.view;
  $('#kawView').classList.toggle('hidden',q.view!=='kaw');$('#basinView').classList.toggle('hidden',q.view!=='basin');$('#kawBtn').classList.toggle('active',q.view==='kaw');$('#basinBtn').classList.toggle('active',q.view==='basin');
  setTab(q.tab,{url:false});if(q.record)openRecord(q.record,{url:false});
  if(q.search){openSheet('searchSheet');$('#searchInput').value=q.search;doSearch(q.search)}
  $('#build').textContent=BUILD;registerSW();maybeFirstRun();
 }catch(e){fail(e.message)}
}
$$('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab,{scroll:true})));
$$('[data-nav]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.nav)));
$('#yearRange').addEventListener('input',updateYear);
$('#kawBtn').addEventListener('click',()=>{state.rightsMode='kaw';$('#kawBtn').classList.add('active');$('#basinBtn').classList.remove('active');$('#kawView').classList.remove('hidden');$('#basinView').classList.add('hidden');updateURL({view:'kaw'})});
$('#basinBtn').addEventListener('click',()=>{state.rightsMode='basin';$('#basinBtn').classList.add('active');$('#kawBtn').classList.remove('active');$('#basinView').classList.remove('hidden');$('#kawView').classList.add('hidden');updateURL({view:'basin'})});
$('#rulesBtn').addEventListener('click',()=>openSheet('rulesSheet'));$('#moreBtn').addEventListener('click',()=>{resetMore();openSheet('moreSheet')});$('#searchBtn').addEventListener('click',()=>openSheet('searchSheet'));$('#shareBtn').addEventListener('click',shareCurrent);$('#statusInfo').addEventListener('click',()=>openSheet('dataSheet'));
$('#searchInput').addEventListener('input',e=>doSearch(e.target.value));
$('#installRow').addEventListener('click',installApp);$('#introDone').addEventListener('click',finishIntro);$('#introSkip').addEventListener('click',finishIntro);
document.addEventListener('click',e=>{
 const r=e.target.closest('[data-record]');if(r)openRecord(r.dataset.record);
 const f=e.target.closest('[data-flow]');if(f)showFlow(f.dataset.flow);
 const c=e.target.closest('[data-close]');if(c)closeSheet(c.dataset.close);
 const sr=e.target.closest('[data-share-record]');if(sr)shareRecord(sr.dataset.shareRecord);
 const sub=e.target.closest('[data-more]');
 if(sub){
  const key=sub.dataset.more;
  const content={
   help:`<h3>Rights</h3><p>Who has a state water-right record, what class is it, and when was it filed?</p><h3>Storage</h3><p>Who has federal physical storage space in Kaw Lake? Storage is AF, not AFY.</p><h3>Use</h3><p>What annual use has actually been documented for a reporting year?</p><h3>Flow</h3><p>How does Enid’s physical system move water?</p>`,
   about:`<h3>Public records, made useful.</h3><p>Enid Public Record is an independent public-information project focused on making local public records easier to inspect and understand. Water Explorer is not an official City of Enid, OWRB or U.S. Army Corps application.</p>`,
   privacy:`<h3>Reader privacy</h3><p>Water Explorer does not require a login. The app is designed to avoid collecting names, precise location, device fingerprints or other unnecessary personal information. Search is performed in the browser against publication-safe public records.</p>`,
   legal:`<h3>Public-record reporting</h3><p>Legal explanations summarize public records for journalism and civic understanding. They are not legal advice or a binding adjudication of any water right.</p><h3>Source control</h3><p>If an EPR summary conflicts with the underlying official public record, the source record controls.</p>`,
   copyright:`<h3>Copyright</h3><p>© 2026 Enid Public Record. All rights reserved.</p><p>EPR’s original writing, interface design, original graphics, visualizations and editorial/data organization may be protected by copyright. Government/public records and third-party works retain their own legal status, licenses and rights holders. EPR does not claim ownership merely by linking to or summarizing a public record.</p>`,
   changelog:`<h3>v1.1 · Sep. 21, 2026</h3><p>Standardized Water Explorer on the approved Enid Public Record logo for app chrome and install icons.</p><h3>v0.8 · Sep. 19, 2026</h3><p>Connected Water Explorer to the Kaw water-right investigation and made Rights, Storage, Use and Flow equally accessible from the bottom navigation.</p><h3>v0.7.1 · Sep. 19, 2026</h3><p>Fixed More-menu navigation state.</p><h3>v0.7 · Sep. 19, 2026</h3><p>Added publication-safe data status, search, record sharing, PWA install foundation, copyright/privacy/legal panels, first-run education, changelog, accessible status messaging and professional provenance cards.</p><h3>v0.6</h3><p>Separated public data from the interface and established stable IDs and deep-link architecture.</p>`,
   accessibility:`<h3>Accessibility</h3><p>EPR designs civic tools for keyboard, touch, screen readers, zoom/reflow and reduced motion. If something blocks access, use Feedback & Corrections so EPR can address it.</p>`
  };
  showSub(key[0].toUpperCase()+key.slice(1),content[key]||'');
 }
});
['detailSheet','rulesSheet','moreSheet','searchSheet','dataSheet','introSheet'].forEach(id=>$('#'+id).addEventListener('click',e=>{if(e.target.id===id&&id!=='introSheet')closeSheet(id)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=$$('.sheet.open').at(-1);if(open&&open.id!=='introSheet')closeSheet(open.id)}});
document.querySelector('.tabs')?.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('.tab')];const i=tabs.indexOf(document.activeElement);if(i<0)return;let n=null;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==null){e.preventDefault();tabs[n].focus();tabs[n].click();}});
setupInstall();init();
})();
