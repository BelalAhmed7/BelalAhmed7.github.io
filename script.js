(() => {
  const canvas = document.getElementById('eye');
  const ctx = canvas.getContext('2d');
  const toggle = document.getElementById('vision-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches, w=1, h=1, time=0, pointerX=0, pointerY=0;
  const resize=()=>{const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);draw();};
  const draw=()=>{
    ctx.clearRect(0,0,w,h);
    const cx=w/2+pointerX*9,cy=h*.49+pointerY*6,scale=Math.min(w/470,h/310);
    ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
    for(let ring=0;ring<27;ring++){
      const t=ring/26;
      const rw=25+t*184,rh=10+t*89;
      for(let i=0;i<100;i++){
        const a=i/100*Math.PI*2;
        const edge=Math.pow(Math.abs(Math.sin(a)),.66);
        const pulse=Math.sin(a*3+time*.45+t*4)*3;
        const x=Math.cos(a)*rw;
        const y=Math.sin(a)*rh*(.8+edge*.2)+pulse*t;
        const iris=Math.sqrt(x*x+(y*1.15)*(y*1.15));
        const depth=Math.cos(a+time*.15)*.25+.7;
        ctx.fillStyle=iris<62?'rgba(212,246,114,'+(depth*.85)+')':'rgba(179,210,139,'+(.23+t*.53)*depth+')';
        ctx.beginPath();ctx.arc(x,y,ring%4===0?1.15:.7,0,Math.PI*2);ctx.fill();
      }
    }
    for(let j=0;j<160;j++){
      const a=j/160*Math.PI*2+time*.04;
      const r=59+Math.sin(j*9)*4;
      ctx.strokeStyle='rgba(211,246,91,.5)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+10),Math.sin(a)*(r+10));ctx.stroke();
    }
    const gradient=ctx.createRadialGradient(0,0,1,0,0,43);gradient.addColorStop(0,'#13271c');gradient.addColorStop(.7,'#1c3020');gradient.addColorStop(1,'#8aab55');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(0,0,39,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(215,239,160,.5)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(-15,0);ctx.lineTo(15,0);ctx.moveTo(0,-15);ctx.lineTo(0,15);ctx.stroke();
    ctx.strokeStyle='rgba(215,239,160,.22)';ctx.setLineDash([3,6]);ctx.strokeRect(-224,-123,448,246);ctx.setLineDash([]);
    for(const x of [-224,224])for(const y of [-123,123]){ctx.strokeStyle='#cce686';ctx.beginPath();ctx.moveTo(x,y+(y<0?14:-14));ctx.lineTo(x,y);ctx.lineTo(x+(x<0?14:-14),y);ctx.stroke();}
    ctx.restore();
  };
  const updateButton=()=>{toggle.textContent=paused?'▶':'Ⅱ';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Play illustration':'Pause illustration');};
  toggle.addEventListener('click',()=>{paused=!paused;updateButton();draw();});
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointerX=(e.clientX-r.left)/w*2-1;pointerY=(e.clientY-r.top)/h*2-1;if(paused)draw();});
  canvas.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;if(paused)draw();});
  canvas.addEventListener('click',()=>{time+=2;draw();});
  motion.addEventListener('change',e=>{paused=e.matches;updateButton();});
  new ResizeObserver(resize).observe(canvas);
  let last=0;
  function animate(now){if(!paused&&!document.hidden&&now-last>33){time+=.023;draw();last=now;}requestAnimationFrame(animate);}
  updateButton();resize();requestAnimationFrame(animate);
})();

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
  const nodes = document.querySelectorAll('.section-head, .project, .team-project, .about, .timeline-row, .credential, .education, .contact .wrap');
  nodes.forEach(node => node.classList.add('reveal-item'));
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -25px 0px' });
  nodes.forEach(node => observer.observe(node));
  reduceMotion.addEventListener('change', event => {
    if (event.matches) {
      document.documentElement.classList.remove('motion-ready');
      observer.disconnect();
    }
  });
})();

(() => {
 const mq=matchMedia('(prefers-reduced-motion: reduce)');
 if(mq.matches)return;
 document.documentElement.classList.add('rich-motion');
 const bar=document.createElement('div');bar.className='scroll-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
 const glow=document.createElement('div');glow.className='pointer-glow';glow.setAttribute('aria-hidden','true');document.body.append(glow);
 const groups=['.credential','.timeline-row','.tags span','.toolkit>div>span','.skill-groups>div'];
 groups.forEach(sel=>document.querySelectorAll(sel).forEach((el,i)=>el.style.setProperty('--stagger',`${(i%4)*85}ms`)));
 let queued=false;
 const progress=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{bar.style.transform=`scaleX(${scrollY/(document.documentElement.scrollHeight-innerHeight)||0})`;queued=false;});};
 addEventListener('scroll',progress,{passive:true});progress();
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 let x=-600,y=-600,scheduled=false;
 addEventListener('pointermove',e=>{x=e.clientX-220;y=e.clientY-220;if(scheduled||mq.matches)return;scheduled=true;requestAnimationFrame(()=>{glow.style.transform=`translate3d(${x}px,${y}px,0)`;glow.style.opacity='1';scheduled=false;});},{passive:true});
 document.addEventListener('pointerleave',()=>glow.style.opacity='0');
 document.querySelectorAll('.project-art,.credential').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(mq.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--tilt-x',`${-(e.clientY-r.top-r.height/2)/r.height*5}deg`);el.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/r.width*5}deg`);},{passive:true});
 el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});});
 }
 mq.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('rich-motion');glow.remove();bar.remove();}});
})();
