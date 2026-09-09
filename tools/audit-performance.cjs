const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const ext = path.extname(file).toLowerCase();
  res.setHeader('Content-Type', ({ '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png' })[ext] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await new Promise(r => server.listen(8766, '127.0.0.1', r));
  const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9224', '--remote-allow-origins=*', '--user-data-dir=' + path.join(root, 'tools/.browser-audit-2'), 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let socket;
  try {
    let target;
    for (let i=0;i<40;i++) {
      try { target = (await (await fetch('http://127.0.0.1:9224/json',{signal:AbortSignal.timeout(1000)})).json()).find(t=>t.type==='page'); if(target) break; } catch {}
      await sleep(250);
    }
    if (!target) throw Error('Headless browser did not start');
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r=>socket.addEventListener('open',r,{once:true}));
    let seq=0; const pending=new Map(); const errors=[];
    socket.addEventListener('message', ({data})=> {
      const msg=JSON.parse(data);
      if(msg.id) { const p=pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(Error(JSON.stringify(msg.error))) : p.resolve(msg.result); }
      if(msg.method==='Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text + ': ' + msg.params.exceptionDetails.exception?.description);
    });
    const call=(method,params={})=>new Promise((resolve,reject)=>{ const id=++seq; pending.set(id,{resolve,reject}); socket.send(JSON.stringify({id,method,params})); });
    const evaluate=async expression=> { const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
    await call('Runtime.enable'); await call('Page.enable');
    const results=[];
    for(const width of [390,1440]) {
      await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
      await call('Page.navigate',{url:'http://127.0.0.1:8766/'});
      await sleep(3500);
      const heroRatio = await evaluate(`(()=>{const r=document.querySelector('.hero-art-card img').getBoundingClientRect();return r.height/r.width})()`);
      if(Math.abs(heroRatio-1.08)>.03) throw Error('Hero frame changed size: '+heroRatio);
      const screenshot = await call('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(path.join(__dirname,`audit-${width}.png`),Buffer.from(screenshot.data,'base64'));
      const initial=await evaluate(`({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,sections:document.querySelectorAll('.display-section').length,loadedProducts:document.querySelectorAll('.product-card img[src]').length,totalProducts:document.querySelectorAll('.product-card img').length,imageBytes:performance.getEntriesByType('resource').filter(r=>/\\.(jpg|jpeg|png)(?:$|\\?)/i.test(r.name)).reduce((s,r)=>s+r.encodedBodySize,0),broken:Array.from(document.images).filter(i=>i.hasAttribute('src')&&i.complete&&!i.naturalWidth).map(i=>i.src)})`);
      await evaluate(`document.querySelector('.display-section').scrollIntoView();`); await sleep(500);
      await evaluate(`document.querySelector('.display-section .carousel-dots button:nth-child(2)').click()`); await sleep(700);
      initial.clickScroll=await evaluate(`document.querySelector('.product-grid').scrollLeft`);
      await evaluate(`document.querySelector('.display-section .carousel-dots button.active').dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true}))`); await sleep(500);
      initial.keyboardEnd=await evaluate(`Math.abs(document.querySelector('.product-grid').scrollLeft-(document.querySelector('.product-grid').scrollWidth-document.querySelector('.product-grid').clientWidth))<3`);
      await evaluate(`document.querySelector('#depoimentos').scrollIntoView();document.querySelector('.quote-dots button:nth-child(2)').click()`);
      initial.reviewClick=await evaluate(`document.querySelectorAll('.quote-slide')[1].classList.contains('active')`);
      await evaluate(`document.querySelector('.quote-dots button.active').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}))`);
      initial.reviewKeyboard=await evaluate(`document.querySelectorAll('.quote-slide')[2].classList.contains('active')`);
      await evaluate(`document.activeElement.blur()`);
      await sleep(6500);
      initial.reviewAutomatic=await evaluate(`!document.querySelectorAll('.quote-slide')[2].classList.contains('active')`);
      await evaluate(`document.querySelector('.founder-details').open=true`);
      initial.details=await evaluate(`document.querySelector('.founder-details').open`);
      // Audit every gallery URL without forcing every photo into the viewport.
      initial.missingAssets=await evaluate(`Promise.all(Array.from(document.querySelectorAll('.product-card img')).map(async i=>{const a=imageAssets[i.dataset.source];const src=a?a.src:i.src;return (await fetch(src,{method:'HEAD'})).ok?null:src})).then(a=>a.filter(Boolean))`);
      results.push(initial);
      if(initial.overflow||initial.broken.length||initial.sections!==8||!initial.clickScroll||!initial.keyboardEnd||!initial.reviewClick||!initial.reviewKeyboard||!initial.reviewAutomatic||initial.missingAssets.length) throw Error(JSON.stringify(initial));
    }
    if(errors.length) throw Error(errors.join('\n'));
    fs.writeFileSync(path.join(__dirname,'browser-report.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
    await call('Browser.close');
  } finally { socket?.close(); edge.kill(); server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
