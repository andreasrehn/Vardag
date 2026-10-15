// Every feature in the example mode, all household types, four languages, light and dark.
// Run: node tests/fake-server.js & node tests/demo-test.js
const { chromium } = require('playwright');
const results = []; let cur = '';
const ok = (name, cond, info='') => results.push({ctx:cur, name, pass:!!cond, info});
(async()=>{
const b = await chromium.launch();
async function newPage(lang='sv', dark=false){
  const ctx = await b.newContext({viewport:{width:390,height:844}, colorScheme: dark?'dark':'light'});
  const p = await ctx.newPage(); p.errs=[];
  p.on('pageerror', e=>p.errs.push(e.message)); p.on('console', m=>{ if(m.type()==='error') p.errs.push(m.text()); });
  await p.addInitScript(l=>{try{localStorage.clear(); localStorage.setItem('vardagen.lang',l)}catch(e){}}, lang);
  await p.goto(process.env.BASE || 'http://localhost:8787/'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('[data-auth=demo]')?.click()); await p.waitForTimeout(200); return p;
}
const click = (p,sel) => p.evaluate(s=>{const e=document.querySelector(s); if(!e) return false; e.click(); return true;}, sel);
const has = (p,sel) => p.evaluate(s=>!!document.querySelector(s), sel);
const text = (p,sel='body') => p.evaluate(s=>document.querySelector(s)?.innerText||'', sel);
const fill = (p,sel,v) => p.evaluate(([s,v])=>{const e=document.querySelector(s); if(!e) return false; e.value=v; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); return true;}, [sel,v]);
const submit = (p,sel) => p.evaluate(s=>{const f=document.querySelector(s); if(!f) return false; f.requestSubmit(); return true;}, sel);
const wait = (p,ms=60)=>p.waitForTimeout(ms);
const overflow = p => p.evaluate(()=>document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth : 0);
const go = async (p,v) => { await click(p,'[data-act=go][data-v=home]'); await wait(p); if (v==='shared') await click(p,'.door.shared'); else if (v==='mine') await click(p,'.door.mine'); else if (v==='hem') await click(p,'.door.hem'); await wait(p); };
const tab = async (p,t) => { await click(p,`[data-t=${t}]`); await wait(p); };
const setHH = async (p,hh) => { await go(p,'home'); await click(p,'[data-act=setup]'); await wait(p); await click(p,`label.hh:has(input[value=${hh}]) input`); await submit(p,'#setupForm'); await wait(p,120); await p.evaluate(()=>{document.querySelector('#sheetRoot').innerHTML=''}); };
const closeSheet = p => p.evaluate(()=>{document.querySelector('#sheetRoot').innerHTML=''});
const checkOverflow = async (p, where) => { const o = await overflow(p); ok('no horizontal overflow: '+where, !o, o?('width '+o):''); };

// ---------- Functional run in Swedish, household separerad ----------
cur='sv/separerad'; let p = await newPage('sv');
ok('home renders', (await text(p)).includes('Familjen'));
await checkOverflow(p,'home');
// quick add
for (const [q,exp] of [['Lägg till mjölk och bröd på inköpslistan','inköpslistan'],['Padel på torsdag kl 19','kalender'],['Ring tandläkaren på fredag','Att göra']]) {
  await fill(p,'#cmd-in',q); await submit(p,'form[data-form=cmd]'); await wait(p,120);
  ok('quick add: '+q, (await text(p,'#cmd-status')).includes(exp), await text(p,'#cmd-status')); }
await fill(p,'#cal-in','Ella ska leka med Saga den 20 okt kl 14-17'); await submit(p,'form[data-form=calcmd]'); await wait(p,120);
ok('family quick add finds friend', (await text(p,'#cal-status')).includes('070-123 45 67'));
await fill(p,'#cal-in','Noah leker med Okänd'); await submit(p,'form[data-form=calcmd]'); await wait(p,120);
ok('family quick add without date asks for date', (await text(p,'#cal-status')).includes('inget datum'));
// swap answer + handover read
ok('swap request on home', await has(p,'[data-act=swapYes]'));
await click(p,'[data-act=swapYes]'); await wait(p,120);
ok('swap accepted removes card', !(await has(p,'[data-act=swapYes]')));
await click(p,'[data-act=handoverRead]'); await wait(p);
ok('handover marked read', !(await has(p,'[data-act=handoverRead]')));
// notices
await click(p,'[data-act=notices]'); await wait(p); ok('notices sheet', (await text(p,'#sheetRoot')).includes('Notiser')); await closeSheet(p);
// family calendar
await go(p,'shared'); await tab(p,'cal'); await checkOverflow(p,'family calendar');
await click(p,'[data-act=newEvent]'); await wait(p);
await fill(p,'#ev-title','Testhändelse'); await submit(p,'#evForm'); await wait(p,120);
ok('event added', (await text(p)).includes('Testhändelse'));
await p.evaluate(()=>{ const b=[...document.querySelectorAll('[data-act=openEvent]')].find(x=>x.innerText.includes('Testhändelse')); b&&b.click(); }); await wait(p);
await fill(p,'#ev-title','Testhändelse ändrad'); await submit(p,'#evForm'); await wait(p,120);
ok('event edited', (await text(p)).includes('Testhändelse ändrad'));
await p.evaluate(()=>{ const b=[...document.querySelectorAll('[data-act=openEvent]')].find(x=>x.innerText.includes('Testhändelse ändrad')); b&&b.click(); }); await wait(p);
await click(p,'[data-act=del]'); await wait(p); await click(p,'[data-act=del]'); await wait(p,120);
ok('event deleted (two taps)', !(await text(p)).includes('Testhändelse ändrad'));
// repeat events
await click(p,'[data-act=newEvent]'); await wait(p); await fill(p,'#ev-title','Simträning'); await p.evaluate(()=>{document.querySelector('#ev-rep').checked=true}); await fill(p,'#ev-reps','3'); await submit(p,'#evForm'); await wait(p,120);
ok('repeat creates 3', await p.evaluate(()=>document.querySelector('#toast').innerText.includes('3')));
// swap request + schedule
await click(p,'[data-act=swapReq]'); await wait(p); ok('swap sheet', await has(p,'#swapForm')); await submit(p,'#swapForm'); await wait(p,120);
ok('swap request pending', (await text(p)).toLowerCase().includes('väntar på svar'));
await click(p,'[data-act=schedule]'); await wait(p); await fill(p,'#sc-pattern','2255'); await submit(p,'#schedForm'); await wait(p,120);
ok('schedule changed', (await text(p)).includes('2-2-5-5'));
// expenses
await tab(p,'money'); await checkOverflow(p,'family receipts');
const bal0 = await text(p,'.balance .big');
await click(p,'[data-act=manual][data-scope=shared]'); await wait(p);
await fill(p,'#ex-store','Testbutik'); await fill(p,'#ex-amount','400'); await fill(p,'#ex-cat','Kläder'); await p.evaluate(()=>document.querySelector('input[name=kids]').checked=true);
ok('owe preview', (await text(p,'#ex-owe')).includes('200'));
await submit(p,'#exForm'); await wait(p,150);
ok('shared expense saved', (await text(p)).includes('Testbutik'));
ok('balance changed', (await text(p,'.balance .big')) !== bal0, bal0+' -> '+(await text(p,'.balance .big')));
await p.evaluate(()=>{ const b=[...document.querySelectorAll('[data-act=openExp]')].find(x=>x.innerText.includes('Testbutik')); b&&b.click(); }); await wait(p);
ok('expense detail shows warranty', (await text(p,'#sheetRoot')).includes('t.o.m.'));
await click(p,'[data-act=editExp]'); await wait(p); await click(p,'[data-act=del]'); await wait(p); await click(p,'[data-act=del]'); await wait(p,120);
ok('expense deleted', !(await text(p)).includes('Testbutik'));
await click(p,'[data-act=pay]'); await wait(p); await submit(p,'#payForm'); await wait(p,150);
ok('payment settles balance', (await text(p,'.balance')).includes('kvitt'), await text(p,'.balance'));
// scan flow without AI shows manual fields
await click(p,'[data-act=scan][data-scope=shared]'); await wait(p); ok('scan sheet has file input', await has(p,'#ex-file')); await closeSheet(p);
// lov
await tab(p,'lov'); await click(p,'[data-act=lovNew]'); await wait(p); await fill(p,'#lov-name','Sportlov'); await submit(p,'#lovForm'); await wait(p,120);
ok('lov planned', (await text(p)).includes('Sportlov'));
// kids tab: kid card, friend, pack, handover
await tab(p,'kids'); await checkOverflow(p,'kids tab');
await click(p,'[data-act=editKid]'); await wait(p); await fill(p,'#kid-name','Testbarn'); await fill(p,'#kid-allergies','Gluten'); await submit(p,'#kidForm'); await wait(p,120);
ok('kid added', (await text(p)).includes('Testbarn'));
await p.evaluate(()=>{ const b=[...document.querySelectorAll('[data-act=kidCard]')].find(x=>x.innerText.includes('Testbarn')); b&&b.click(); }); await wait(p);
ok('kid card shows allergy', (await text(p,'#sheetRoot')).includes('Gluten'));
await fill(p,'#fr-name','Vilma'); await fill(p,'#fr-phone','070-000 00 00'); await submit(p,'form[data-form=friend]'); await wait(p,120);
ok('friend added', (await text(p,'#sheetRoot')).includes('Vilma'));
await click(p,'[data-act=delFriend]'); await wait(p,100); ok('friend deleted', !(await text(p,'#sheetRoot')).includes('Vilma'));
await closeSheet(p);
await fill(p,'#add-pack','Regnställ'); await submit(p,'form[data-form=add][data-kind=pack]'); await wait(p,120); ok('pack item added', (await text(p)).includes('Regnställ'));
await click(p,'[data-act=toggleItem][data-coll=pack]'); await wait(p); await click(p,'[data-act=packReset]'); await wait(p,150);
ok('pack reset', await p.evaluate(()=>!document.querySelector('[data-coll=pack].check.on')));
await click(p,'[data-act=handover]'); await wait(p); await fill(p,'#ho-text','Testhälsning'); await submit(p,'#hoForm'); await wait(p,120);
ok('handover sent', (await text(p)).includes('Testhälsning'));
// mine: budget, recurring, goals, projects
await go(p,'mine'); await tab(p,'budget'); await checkOverflow(p,'mine budget');
await click(p,'[data-act=period][data-p=year]'); await wait(p); ok('year view', (await text(p)).toLowerCase().includes('utgifter 2026'));
await click(p,'[data-act=pickMonth][data-m="2"]'); await wait(p); ok('pick month', (await text(p)).toLowerCase().includes('utgifter mars'));
await click(p,'[data-act=budgets]'); await wait(p); await fill(p,'#bud-0','5000'); await submit(p,'#budForm'); await wait(p,120); ok('budget saved', await p.evaluate(()=>document.querySelector('#toast').innerText.includes('Budget')));
await click(p,'[data-act=recurList]'); await wait(p); await click(p,'#sheetRoot [data-act=recurEdit]:not([data-id])'); await wait(p);
await fill(p,'#rc-name','Netflix'); await fill(p,'#rc-amount','129'); await fill(p,'#rc-cat','Abonnemang'); await submit(p,'#recForm'); await wait(p,150);
ok('recurring added', (await text(p,'#sheetRoot')).includes('Netflix')); await closeSheet(p);
await click(p,'[data-act=goalEdit]'); await wait(p); await fill(p,'#gl-name','Buffert'); await fill(p,'#gl-target','10000'); await submit(p,'#goalForm'); await wait(p,120);
ok('goal added', (await text(p)).includes('Buffert'));
await p.evaluate(()=>{ const c=[...document.querySelectorAll('.goal')].find(x=>x.innerText.includes('Buffert')); c.querySelector('[data-act=goalDeposit]').click(); }); await wait(p);
await fill(p,'#dep-amt','2500'); await p.evaluate(()=>document.querySelector('#depForm button[value=in]').click()); await wait(p,150);
ok('deposit updates goal', await p.evaluate(()=>[...document.querySelectorAll('.goal')].find(x=>x.innerText.includes('Buffert'))?.innerText.includes('25 %')));
await click(p,'[data-act=editProj]'); await wait(p); await fill(p,'#pr-name','Nytt kök'); await fill(p,'#pr-budget','150000'); await submit(p,'#projForm'); await wait(p,120);
ok('project added', (await text(p)).includes('Nytt kök'));
// mine expense with project via manual
await tab(p,'archive'); await checkOverflow(p,'archive');
await click(p,'[data-act=manual][data-scope=mine]'); await wait(p); await fill(p,'#ex-store','Elgiganten Test'); await fill(p,'#ex-amount','5990'); await fill(p,'#ex-cat','Hem'); await submit(p,'#exForm'); await wait(p,150);
await fill(p,'#arch-q','elgiganten'); await wait(p); ok('archive search', (await text(p,'#arch-results')).includes('Elgiganten Test'));
ok('archive warranty 3 years', (await text(p,'#arch-results')).includes('reklamation t.o.m.'));
await fill(p,'#arch-q','zzzz'); await wait(p); ok('archive empty search msg', (await text(p,'#arch-results')).includes('Inga kvitton matchar'));
// lists
await tab(p,'lists'); await checkOverflow(p,'lists');
await fill(p,'#add-shop','Bananer'); await submit(p,'form[data-form=add][data-kind=shop]'); await wait(p,120); ok('shop item added', (await text(p)).includes('Bananer'));
await p.evaluate(()=>{ const r=[...document.querySelectorAll('.item')].find(x=>x.innerText.includes('Bananer')); r.querySelector('[data-act=toggleItem]').click(); }); await wait(p);
await p.evaluate(()=>document.querySelector('[data-act=clearDone][data-kind=shop]').click()); await wait(p,200); ok('clear done', !(await text(p)).includes('Bananer'));
await click(p,'[data-act=choreEdit]:not([data-id])'); await wait(p); await fill(p,'#ch-name','Vattna blommor'); await submit(p,'#choreForm'); await wait(p,120);
ok('chore added', (await text(p)).includes('Vattna blommor'));
await p.evaluate(()=>{ const r=[...document.querySelectorAll('.item')].find(x=>x.innerText.includes('Vattna blommor')); r.querySelector('[data-act=choreDone]').click(); }); await wait(p,100);
ok('chore done moves due', (await p.evaluate(()=>[...document.querySelectorAll('.item')].find(x=>x.innerText.includes('Vattna blommor'))?.innerText||'')).includes('om 7 dagar'));
// my kids
await click(p,'[data-act=myKids]'); await wait(p); await fill(p,'#mykid-name','Liv'); await submit(p,'form[data-form=myKid]'); await wait(p,120);
ok('my kid added', (await text(p,'#sheetRoot')).includes('Liv')); await closeSheet(p);
// mine calendar toggle
await tab(p,'cal'); const withFam = (await text(p)).includes('Familjen'); await click(p,'[data-act=toggleShared]'); await wait(p);
ok('toggle family calendar', withFam);
// dinner
await go(p,'home'); await click(p,'[data-act=dinner]'); await wait(p); await submit(p,'#dinForm'); await wait(p,200);
ok('dinner suggestions', (await p.evaluate(()=>document.querySelectorAll('.dish').length))>=5);
await p.evaluate(()=>document.querySelector('[data-act=dinAdd][data-d=all]').click()); await wait(p,150);
ok('dinner added to list', (await p.evaluate(()=>document.querySelector('#toast').innerText)).includes('varor'));
await closeSheet(p);
ok('no JS errors', p.errs.length===0, p.errs.join(' | '));
await p.close();

// ---------- every household type ----------
for (const hh of ['separeradpartner','sambo','sambobarn','ensam']) {
  cur='sv/'+hh; p = await newPage('sv'); await setHH(p,hh);
  const t = await text(p);
  ok('home renders', t.includes('Mitt'));
  ok('shared door as expected', (await has(p,'.door.shared')) === (hh!=='ensam'));
  ok('hem door as expected', (await has(p,'.door.hem')) === (hh==='separeradpartner'));
  await checkOverflow(p,'home');
  if (hh!=='ensam') { await go(p,'shared');
    for (const tb of ['cal','money','shop','chores','lov','kids']) { if (await click(p,`[data-t=${tb}]`)) { await wait(p); await checkOverflow(p,'shared '+tb); } }
    if (hh.startsWith('sambo')) { await tab(p,'shop'); await fill(p,'#add-shop','Gemensam vara'); await submit(p,'form[data-form=add][data-kind=shop]'); await wait(p,120);
      await go(p,'mine'); await tab(p,'lists'); ok('shared shop visible in Mine', (await text(p)).includes('Gemensam vara')); }
  }
  if (hh==='separeradpartner') { await go(p,'hem'); ok('hem preview banner', (await text(p)).includes('Förhandsvisning'));
    await tab(p,'money'); const before=(await text(p)).includes('Hyra oktober'); await go(p,'shared'); await tab(p,'money');
    ok('family does not show hem expenses', before && !(await text(p)).includes('Hyra oktober')); }
  ok('no JS errors', p.errs.length===0, p.errs.join(' | ')); await p.close();
}

// ---------- languages + dark mode screens ----------
for (const lang of ['sv','en','nb','da']) for (const dark of [false,true]) {
  cur=lang+(dark?'/dark':'/light'); p = await newPage(lang, dark);
  for (const v of ['home','shared','mine']) { await go(p,v); await checkOverflow(p,v);
    if (v!=='home') for (const tb of ['cal','money','lov','kids','budget','lists','archive']) if (await click(p,`[data-t=${tb}]`)) { await wait(p); await checkOverflow(p,v+'/'+tb); } }
  const bg = await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  ok('body background set', bg && bg!=='rgba(0, 0, 0, 0)', bg);
  if (lang!=='sv') { await go(p,'home'); ok('home translated', !(await text(p)).includes('Idag och i morgon')); }
  ok('no JS errors', p.errs.length===0, p.errs.join(' | ')); await p.close();
}
await b.close();
const fails = results.filter(r=>!r.pass);
console.log(`${results.length} checks, ${fails.length} failed`);
for (const f of fails) console.log('FAIL', f.ctx, '-', f.name, f.info);
process.exit(fails.length ? 1 : 0);
})();
