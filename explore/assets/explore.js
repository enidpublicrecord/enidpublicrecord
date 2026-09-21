
(()=>{'use strict';
const BUILD='explore-enid-v1.1-branding-20260921';let promptEvent=null;
const $=s=>document.querySelector(s);
function open(){reset();$('#sheet').classList.add('open');$('#sheet').setAttribute('aria-hidden','false');setTimeout(()=>$('#close').focus(),0)}
function close(){reset();$('#sheet').classList.remove('open');$('#sheet').setAttribute('aria-hidden','true')}
function reset(){$('#mainRows').classList.remove('hidden');$('#sub').classList.add('hidden');$('#sub').innerHTML='';$('#sheetTitle').textContent='More'}
function sub(title,html){$('#mainRows').classList.add('hidden');$('#sub').classList.remove('hidden');$('#sheetTitle').textContent=title;$('#sub').innerHTML=`<button class="row" id="back"><div><b>← Back</b><span>Return to More</span></div></button><div class="copy">${html}</div>`;$('#back').onclick=reset}
$('#more').onclick=open;$('#close').onclick=close;$('#sheet').onclick=e=>{if(e.target.id==='sheet')close()};document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
document.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{const k=b.dataset.sub;const c={
about:'<p><b>Explore Enid</b> is the front door to EPR’s civic tools. The tools remain independent applications so one module can be updated without destabilizing another.</p>',
privacy:'<p>No login is required. Explore Enid is designed to avoid unnecessary collection of personal data. Individual EPR pages may use the site’s ordinary audience measurement tools.</p>',
access:'<p>EPR designs civic tools for keyboard, touch, screen readers, zoom/reflow and reduced motion. Accessibility regressions are treated as release defects.</p>',
legal:'<p>Explore Enid is an independent EPR product, not an official City of Enid application. Public records and third-party works retain their own legal status and rights.</p><p>© 2026 Enid Public Record. All rights reserved in original EPR material.</p>',
version:`<p>${BUILD}</p><p>Production release.</p>`
};sub(b.textContent.trim(),c[k]||'')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e});
async function installExplore(){if(promptEvent){promptEvent.prompt();await promptEvent.userChoice;promptEvent=null}else{sub('Install Explore Enid','<p>On supported browsers, use the browser’s Install app or Add to Home screen option. Explore Enid is served over HTTPS and is configured as an installable web app.</p>')}};$('#install').onclick=installExplore;const ih=$('#installHero');if(ih)ih.onclick=installExplore;
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
})();
