// Sereko Hydra-Crème PDP — static build interactions (no frameworks)
(function(){
// reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
// gallery
var slides=document.querySelectorAll('.gallery-main>img,.gallery-main>video');
var thumbs=document.querySelectorAll('.thumbs button');
thumbs.forEach(function(btn,i){btn.addEventListener('click',function(){
  slides.forEach(function(s,k){s.classList.toggle('active',k===i); if(s.tagName==='VIDEO'){k===i?s.play():s.pause();}});
  thumbs.forEach(function(t,k){t.classList.toggle('active',k===i);});
});});
// before/after slider
var ba=document.querySelector('.ba');
if(ba){
  var wrapEl=ba.querySelector('.before-wrap'),handle=ba.querySelector('.handle'),drag=false;
  var setPos=function(x){var r=ba.getBoundingClientRect();var p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));wrapEl.style.width=p+'%';handle.style.left=p+'%';};
  ba.addEventListener('mousedown',function(e){drag=true;setPos(e.clientX);});
  ba.addEventListener('touchstart',function(e){drag=true;setPos(e.touches[0].clientX);},{passive:true});
  window.addEventListener('mousemove',function(e){if(drag)setPos(e.clientX);});
  window.addEventListener('touchmove',function(e){if(drag)setPos(e.touches[0].clientX);},{passive:true});
  window.addEventListener('mouseup',function(){drag=false;});
  window.addEventListener('touchend',function(){drag=false;});
}
// benefits center-focus carousel
(function(){
  var stage=document.getElementById('benStage'); if(!stage) return;
  var slides=[].slice.call(stage.querySelectorAll('.ben-slide'));
  var dots=[].slice.call(document.querySelectorAll('#benDots button'));
  var idx=1;
  function render(){
    slides.forEach(function(s,i){
      var off=i-idx,t=Math.min(2,Math.abs(off));
      var scale=1-t*.09,op=t>2?0:1-t*.42,blur=t*3.2,tx=off*46,rot=off*-6;
      s.style.transform='translate3d('+tx+'px,0,0) scale('+scale+') rotateY('+rot+'deg)';
      s.style.opacity=op;s.style.filter=blur>.1?'blur('+blur+'px)':'none';
      s.style.zIndex=10-Math.round(t*3);
      s.classList.toggle('cur',off===0);
      s.style.pointerEvents=off===0?'auto':'none';
    });
    dots.forEach(function(d,i){d.classList.toggle('active',i===idx);});
  }
  function go(n){idx=Math.max(0,Math.min(slides.length-1,idx+n));render();}
  dots.forEach(function(d,i){d.addEventListener('click',function(){idx=i;render();});});
  var x0=null;
  stage.addEventListener('mousedown',function(e){x0=e.clientX;});
  stage.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  window.addEventListener('mouseup',function(e){if(x0!=null&&Math.abs(e.clientX-x0)>50)go(e.clientX-x0<0?1:-1);x0=null;});
  stage.addEventListener('touchend',function(e){if(x0!=null&&Math.abs(e.changedTouches[0].clientX-x0)>50)go(e.changedTouches[0].clientX-x0<0?1:-1);x0=null;});
  render();
})();
// routine builder — AM/PM + selectable cards + live bundle
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.rt-pill button'));
  var am=document.getElementById('routineAM'),pm=document.getElementById('routinePM');
  if(!am) return;
  var section=document.getElementById('routine');
  function activeList(){return pm.style.display==='none'?am:pm;}
  function refresh(){
    var items=[].slice.call(activeList().querySelectorAll('.r-card')).filter(function(c){return !c.classList.contains('off');});
    var total=items.reduce(function(s,c){return s+ +c.dataset.price;},0);
    var save=Math.round(total*.12),pay=total-save;
    document.getElementById('bCount').textContent=items.length;
    document.getElementById('bItems').innerHTML=items.map(function(c){return '<div class="b-item"><span>'+c.dataset.name+'</span><span>₹'+c.dataset.price+'</span></div>';}).join('');
    document.getElementById('bSub').textContent='₹'+total;
    document.getElementById('bSave').textContent='− ₹'+save;
    document.getElementById('bPay').textContent='₹'+pay;
    document.getElementById('bAdd').textContent='Add Bundle · ₹'+pay;
  }
  tabs.forEach(function(b){b.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.remove('active');});b.classList.add('active');
    var night=b.dataset.mode==='pm';
    am.style.display=night?'none':'flex';pm.style.display=night?'flex':'none';
    section.style.background=night?'linear-gradient(180deg,#211c36,#2c2547)':'transparent';
    section.style.color=night?'#fff':'';
    refresh();
  });});
  document.querySelectorAll('.r-card:not(.hero-step)').forEach(function(c){c.addEventListener('click',function(){
    c.classList.toggle('off');c.querySelector('.r-sel').classList.toggle('on',!c.classList.contains('off'));refresh();
  });});
  refresh();
})();
// sticky ATC after how-to section
var trigger=document.getElementById('waterlock'),bar=document.querySelector('.stickybar');
if(trigger&&bar){window.addEventListener('scroll',function(){bar.classList.toggle('show',window.scrollY>trigger.offsetTop+trigger.offsetHeight);},{passive:true});}
// smooth scroll for buy buttons
document.querySelectorAll('[data-goto]').forEach(function(b){b.addEventListener('click',function(){var t=document.querySelector(b.dataset.goto);if(t)t.scrollIntoView({behavior:'smooth'});});});
})();
