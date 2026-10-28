const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('../../Dino-disco/node_modules/playwright');
const web = 'C:/Users/baese/Documents/DinoTools/Dino Dodo/www';
const server = http.createServer((req,res) => {
 const file = path.join(web, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
 if (!path.resolve(file).startsWith(path.resolve(web) + path.sep)) { res.writeHead(403).end(); return; }
 try { res.setHeader('Content-Type',file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html'); res.end(fs.readFileSync(file)); } catch {res.writeHead(404).end();}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message)}); page.on('console',m=>console.log('BROWSER',m.type(),m.text()));
 await page.addInitScript(()=>{
  window.androidBridge={};
  const methods=['getConfig','listLibraries','getPlaybackState','controlPlayback','getSafetyAlarm','requestSafetyAlarm','dismissSafetyAlarm','confirmSafetyDisabled','saveConfig','stopPlayback','testPlayback'];
  window.mockCalls=[];
  let playback=JSON.parse(localStorage.getItem('test-player') || 'null') || {title:'Le voyage du dinosaure.mp3',trackUri:'content://audio/one',libraryName:'Calme',positionMs:125000,durationMs:600000,playing:true,loading:false,error:''};
  let safety={triggerAt:0,cancelRequested:false};
  window.Capacitor={PluginHeaders:[{name:'RadioAlarm',methods:methods.map(name=>({name,rtype:'promise'}))}],nativePromise:async(plugin,method,options)=>{
   window.mockCalls.push({method,options});
   if(method==='getConfig')return {enabled:true,hour:9,minute:0,libraryUri:'content://calme',libraryName:'Calme',randomStart:false,rootUri:'content://root',rootName:'Mes musiques',nextTriggerAt:Date.now()+3600000,exactAlarmAllowed:true};
   if(method==='listLibraries')return {libraries:[{name:'Calme',uri:'content://calme',audioCount:5}]};
   if(method==='getPlaybackState')return playback;
   if(method==='getSafetyAlarm')return safety;
   if(method==='controlPlayback'){
    if(options.action==='pause')playback.playing=false;
    if(options.action==='resume')playback.playing=true;
    if(options.action==='restart')playback.positionMs=0;
    if(options.action==='forward')playback.positionMs+=60000;
    if(options.action==='next')playback={...playback,title:'Deuxième audio.mp3',positionMs:0};
    localStorage.setItem('test-player',JSON.stringify(playback));
   }
   if(method==='saveConfig')return {scheduled:true,needsExactAlarmPermission:false,nextTriggerAt:Date.now()+3600000};
   if(method==='requestSafetyAlarm')safety={triggerAt:options.triggerAt,cancelRequested:false};
   if(method==='dismissSafetyAlarm')safety.cancelRequested=true;
   if(method==='confirmSafetyDisabled')safety={triggerAt:0,cancelRequested:false};
  }};
 });
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.waitForTimeout(1500); console.log(await page.locator('body').innerText()); await page.screenshot({path:path.join(__dirname,'debug.png'),fullPage:true}); await page.getByRole('heading',{name:'🦕 Dino-Dodo'}).waitFor();
 await page.getByRole('heading',{name:'Le voyage du dinosaure.mp3'}).waitFor();
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.getByRole('button',{name:'Reprendre',exact:true}).waitFor();
 await page.getByRole('button',{name:'+1 min',exact:true}).click();
 await page.getByText('3:05',{exact:true}).waitFor();
 await page.reload();
 await page.getByRole('button',{name:'Reprendre',exact:true}).waitFor();
 await page.getByText('3:05',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Reprendre',exact:true}).click();
 await page.getByRole('button',{name:'Pause',exact:true}).waitFor();
 await page.getByRole('button',{name:'Depuis le début',exact:true}).click();
 await page.getByText('0:00',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Suivant',exact:true}).click();
 await page.getByRole('heading',{name:'Deuxième audio.mp3'}).waitFor();
 await page.getByRole('button',{name:'Enregistrer le réveil'}).click();
 await page.getByRole('button',{name:'Désactiver la sécurité',exact:true}).click();
 await page.getByText('Désactivation demandée · à vérifier dans Horloge.').waitFor();
 await page.getByRole('button',{name:'J’ai vérifié : elle est désactivée'}).click();
 await page.getByRole('heading',{name:'15 minutes après le réveil'}).waitFor();
 const calls=await page.evaluate(()=>window.mockCalls);
 const safetyCall=calls.find(c=>c.method==='requestSafetyAlarm');
 assert.ok(Math.abs(safetyCall.options.triggerAt-Date.now()-4500000)<10000);
 assert.ok(calls.some(c=>c.method==='dismissSafetyAlarm'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(__dirname,'Dino-Dodo-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1024,height:768});
 await page.screenshot({path:path.join(__dirname,'Dino-Dodo-tablette.png'),fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('OK : titre, pause/reprise, +1 min, reprise mémorisée, début, suivant, sécurité +15 min, demande de désactivation, confirmation, affichage mobile/tablette. Pont Android simulé.');
 } finally {await browser.close(); server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});


