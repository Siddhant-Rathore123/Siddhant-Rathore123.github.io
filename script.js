// ── Particles ──
const cvs=document.getElementById('particles'),ctx=cvs.getContext('2d');
let W,H,pts=[];
function resizePts(){W=cvs.width=window.innerWidth;H=cvs.height=window.innerHeight;pts=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.5}))}
resizePts();window.addEventListener('resize',resizePts);
function animPts(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(201,168,76,0.35)';ctx.fill()});
for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(201,168,76,${0.12*(1-d/120)})`;ctx.lineWidth=0.5;ctx.stroke()}}requestAnimationFrame(animPts)}
animPts();

// ── Custom cursor ──
const dot=document.getElementById('cdot'),ring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
document.querySelectorAll('a,button,.proj-card,.skill-group,.cert-card').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hovered'));el.addEventListener('mouseleave',()=>ring.classList.remove('hovered'))});
function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)}animRing();

// ── Scroll progress ──
const prog=document.getElementById('progress');
window.addEventListener('scroll',()=>{const pct=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;prog.style.width=pct+'%'});

// ── Active nav ──
const sections=document.querySelectorAll('section[id]');
const navAs=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{let cur='';sections.forEach(s=>{if(window.scrollY>=s.offsetTop-200)cur=s.id});navAs.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+cur)})},{ passive:true });

// ── Typing ──
const roles=['Backend Developer','Java Engineer','Spring Boot Dev','API Architect','Problem Solver'];
let ri=0,ci=0,del=false;
const tel=document.getElementById('typed');
function type(){
  const w=roles[ri];
  if(!del){tel.textContent=w.slice(0,ci+1);ci++;if(ci===w.length){del=true;setTimeout(type,1600);return}}
  else{tel.textContent=w.slice(0,ci-1);ci--;if(ci===0){del=false;ri=(ri+1)%roles.length}}
  setTimeout(type,del?55:85)
}type();

// ── Terminal animation ──
const lines=[
  {t:'comment',tx:'// Developer profile — loaded'},
  {t:'blank'},
  {t:'key',tx:'public class ',extra:{t:'str',tx:'SiddhantRathod'},after:' {'},
  {t:'indent',key:'role',val:'"Backend Developer"'},
  {t:'indent',key:'exp',val:'2 // years'},
  {t:'indent',key:'stack',val:'["Java","Spring Boot","MySQL","PyTorch"]'},
  {t:'indent',key:'apiSpeedGain',val:'"+30%"'},
  {t:'indent',key:'cgpa',val:'8.1'},
  {t:'indent',key:'available',val:'true'},
  {t:'close'},
];
const tb=document.getElementById('termBody');
let li=0;
function termLine(){
  if(li>=lines.length)return;
  const l=lines[li++];const sp=document.createElement('span');sp.classList.add('t-line');
  if(l.t==='comment'){sp.innerHTML=`<span class="t-comment">// Developer profile — loaded</span>`}
  else if(l.t==='blank'){sp.innerHTML=' '}
  else if(l.t==='key'){sp.innerHTML=`<span class="t-key">public class </span><span class="t-str">SiddhantRathod</span> {`}
  else if(l.t==='indent'){sp.innerHTML=`<span class="t-indent"><span class="t-key">${l.key}</span> = <span class="t-str">${l.val}</span>;</span>`}
  else if(l.t==='close'){sp.textContent='}'}
  tb.appendChild(sp);setTimeout(termLine,li===1?200:280)}
setTimeout(termLine,600);

// ── Counter animation ──
function countUp(el,target){let n=0;const step=Math.ceil(target/40);const iv=setInterval(()=>{n=Math.min(n+step,target);el.childNodes[0].textContent=n;if(n>=target)clearInterval(iv)},40)}

// ── Experience tabs ──
document.querySelectorAll('.exp-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.exp-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  })
});

// ── Project card mouse glow ──
document.querySelectorAll('.proj-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  })
});

// ── Project card click → GitHub ──
document.querySelectorAll('.proj-card[data-github]').forEach(card=>{
  card.style.cursor='pointer';
  card.setAttribute('role','link');
  card.setAttribute('tabindex','0');
  const go=()=>window.open(card.dataset.github,'_blank','noopener');
  card.addEventListener('click',e=>{ if(!e.target.closest('a,button,.proj-arch')) go(); });
  card.addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
});

// ── Intersection Observer ──
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    // skill bars
    e.target.querySelectorAll('.sb-fill').forEach(b=>{b.style.width=b.dataset.w+'%'});
    // counters
    e.target.querySelectorAll('.stat-n[data-target]').forEach(el=>{countUp(el,+el.dataset.target)});
    io.unobserve(e.target);
  })
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ── LeetCode: animate difficulty bars on scroll ──
(function(){
  const sec=document.getElementById('leetcode');
  if(sec){
    const o=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){sec.querySelectorAll('.lc-fill').forEach(f=>f.style.width=f.dataset.w+'%');o.disconnect();}})},{threshold:0.15});
    o.observe(sec);
  }
})();


// ── Project architecture toggle ──
document.querySelectorAll('.proj-arch-toggle').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const panel=btn.nextElementSibling, hidden=panel.hasAttribute('hidden');
    if(hidden){panel.removeAttribute('hidden');btn.setAttribute('aria-expanded','true');btn.querySelector('span').textContent='Hide architecture';}
    else{panel.setAttribute('hidden','');btn.setAttribute('aria-expanded','false');btn.querySelector('span').textContent='View architecture';}
  });
});

setTimeout(()=>{document.querySelectorAll('.stat-n[data-target]').forEach(el=>{if(el.closest('.reveal.in'))countUp(el,+el.dataset.target)})},800);
