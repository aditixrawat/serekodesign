(function(){
'use strict';
var D = window.SK_DATA, STEP_PRODUCT = window.SK_STEP_PRODUCT_MAP, STEP_DESC = window.SK_STEP_DESC, ICONS = window.SK_ICONS;
var FREE_SHIP = 599;
var PRICES = {}; D.bundle.forEach(function(b){ PRICES[b.id]=b.price; });
var cart = { items: [], count: 0, total: 0 };

function svg(paths, w, h, sw){
  w=w||20; h=h||20; sw=sw||1.8;
  var s='<svg width="'+w+'" height="'+h+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round">';
  paths.forEach(function(d){ s+='<path d="'+d+'"/>'; });
  return s+'</svg>';
}
function starsHtml(value, size){
  size=size||15;
  var full=Math.floor(value), out='';
  for(var i=0;i<5;i++){
    var fill = i<full?1:(i<value?value-full:0);
    out += '<span style="position:relative;width:'+size+'px;height:'+size+'px;display:inline-block">'+
      '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="var(--sk-line)" style="position:absolute;inset:0"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>'+
      '<span style="position:absolute;inset:0;overflow:hidden;width:'+(fill*100)+'%">'+
      '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="var(--sk-star)" style="position:absolute;inset:0"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg></span></span>';
  }
  return out;
}
document.querySelectorAll('.stars').forEach(function(el){ el.innerHTML = starsHtml(parseFloat(el.dataset.stars)); });

/* ---- Loader ---- */
setTimeout(function(){ document.getElementById('loader').classList.add('done'); }, 2100);

/* ---- Reveal on scroll ---- */
function initReveal(){
  var els = document.querySelectorAll('.sk-reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){
    var r = el.getBoundingClientRect();
    if(r.top < (window.innerHeight||800)*0.94 && r.bottom>0){ el.classList.add('in'); }
    else io.observe(el);
  });
}

/* ---- Header + progress ---- */
function initScrollChrome(){
  var header = document.getElementById('header'), bar = document.getElementById('progressbar');
  function on(){
    header.classList.toggle('scrolled', window.scrollY>40);
    var max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (max>0 ? window.scrollY/max*100 : 0) + '%';
  }
  window.addEventListener('scroll', on, {passive:true}); on();
}

/* ---- Ripple + scroll-to buttons ---- */
document.addEventListener('click', function(e){
  var btn = e.target.closest('.btn'); if(!btn) return;
  var r = btn.getBoundingClientRect();
  var rip = document.createElement('span'); rip.className='ripple';
  rip.style.left=(e.clientX-r.left)+'px'; rip.style.top=(e.clientY-r.top)+'px';
  btn.appendChild(rip); setTimeout(function(){ rip.remove(); }, 650);
  var target = btn.dataset.scroll;
  if(target){ document.querySelector(target).scrollIntoView({behavior:'smooth'}); }
});

/* ---- Hero marquee ---- */
function initMarquee(){
  var svgEl = document.getElementById('marquee'), path = document.getElementById('loopPath'), tp = document.getElementById('loopTextPath');
  var LOOP_TXT = Array(6).fill('Patented NeuroCalm®  •  India’s 1st Psychodermatology Brand  •  ').join('');
  tp.textContent = LOOP_TXT;
  function layout(){
    var mobile = window.innerWidth < 560;
    svgEl.setAttribute('viewBox', mobile ? '0 0 700 900' : '0 0 1400 480');
    svgEl.setAttribute('preserveAspectRatio', mobile ? 'xMidYMid slice' : 'xMidYMid meet');
    path.setAttribute('d', mobile
      ? 'M -80 560 C 100 780, 260 780, 380 600 C 500 420, 660 420, 780 600'
      : 'M -100 180 C 150 380, 350 380, 500 220 C 650 60, 850 60, 1000 240 C 1150 400, 1350 400, 1500 220');
    svgEl.querySelector('text').style.fontSize = mobile ? '15px' : '26px';
  }
  layout(); window.addEventListener('resize', layout);
  var anim = document.createElementNS('http://www.w3.org/2000/svg','animate');
  anim.setAttribute('attributeName','startOffset'); anim.setAttribute('from','0%'); anim.setAttribute('to','-100%');
  anim.setAttribute('dur','34s'); anim.setAttribute('repeatCount','indefinite'); anim.setAttribute('fill','freeze');
  tp.appendChild(anim);
}

/* ---- Gallery ---- */
function initGallery(){
  var main = document.getElementById('galleryMain'), thumbs = document.getElementById('galleryThumbs');
  D.product.gallery.forEach(function(src,i){
    var img = document.createElement('img'); img.src=src; img.alt=''; if(i===0) img.className='active';
    main.appendChild(img);
    var b = document.createElement('button'); if(i===0) b.className='active';
    b.innerHTML = '<img src="'+src+'" alt="">';
    b.addEventListener('click', function(){
      main.querySelectorAll('img').forEach(function(im,k){ im.classList.toggle('active', k===i); });
      thumbs.querySelectorAll('button').forEach(function(tb,k){ tb.classList.toggle('active', k===i); });
    });
    thumbs.appendChild(b);
  });
}

/* ---- Buy info ---- */
function initBuyInfo(){
  var sizeChips = document.getElementById('sizeChips');
  ['50 ml','15 ml'].forEach(function(s,i){
    var c = document.createElement('button'); c.className='chip'+(i===0?' active':''); c.textContent=s;
    c.addEventListener('click', function(){ sizeChips.querySelectorAll('.chip').forEach(function(x){x.classList.remove('active');}); c.classList.add('active'); });
    sizeChips.appendChild(c);
  });
  var treatChips = document.getElementById('treatChips');
  D.treats.forEach(function(t){ var c=document.createElement('span'); c.className='chip small'; c.textContent=t; treatChips.appendChild(c); });
  var offersGrid = document.getElementById('offersGrid');
  D.offers.forEach(function(o){
    var d = document.createElement('div'); d.className='sk-offer';
    d.innerHTML = '<span class="tag">🏷️</span><span class="txt">'+o+'</span>';
    offersGrid.appendChild(d);
  });
  var promisesRow = document.getElementById('promisesRow');
  D.promises.forEach(function(p){
    var d = document.createElement('div'); d.className='sk-promise';
    d.innerHTML = '<div class="ic">'+svg([ICONS[p.icon]],16,16,1.4)+'</div><span class="lb">'+p.label+'</span>';
    promisesRow.appendChild(d);
  });
  document.getElementById('addToCartMain').addEventListener('click', function(){ addToCart('creme'); });
}

/* ---- Journey ---- */
function initJourney(){
  var track = document.getElementById('journeyTrack'), fill = document.getElementById('journeyFillLine'), lineEl = document.getElementById('journeyTrackLine');
  var items = [];
  D.journey.forEach(function(j,i){
    var row = document.createElement('div'); row.className='sk-journey-item'; row.style.marginLeft='0';
    row.innerHTML =
      '<div class="sk-journey-dot" data-i="'+i+'">'+svg(['M5 12l5 5L20 7'],20,20,3)+'</div>'+
      '<div class="sk-journey-card"><div class="t">'+j.t+'</div><div class="bar"></div><div class="d">'+j.k+' — '+j.d+'</div></div>';
    track.appendChild(row); items.push(row.querySelector('.sk-journey-dot'));
  });
  function measure(){
    var a = track.getBoundingClientRect(), b = items[items.length-1].getBoundingClientRect();
    lineEl.style.height = (b.top-a.top)+'px';
  }
  measure(); setTimeout(measure,50); window.addEventListener('resize', measure);
  var target=0, prog=0, raf;
  function onScroll(){
    var rect = track.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh*0.85-rect.top)/(rect.height*0.7);
    target = Math.max(0, Math.min(1,p));
  }
  function tick(){
    var d = target-prog; prog += Math.abs(d)<0.001?0:d*0.14; if(Math.abs(d)<0.001) prog=target;
    var h = parseFloat(lineEl.style.height)||0;
    fill.style.height = (h*prog)+'px';
    items.forEach(function(dot,i){ dot.classList.toggle('hit', prog*items.length>i); });
    raf = requestAnimationFrame(tick);
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); raf=requestAnimationFrame(tick);
}

/* ---- Ingredient lab ---- */
function initIngredientLab(){
  var strip = document.getElementById('ingStrip'), detail = document.getElementById('ingDetail');
  var idx = 0;
  function renderDetail(){
    var a = D.ingredients[idx];
    detail.innerHTML = '<div class="role">'+a.role+'</div><p>'+a.b+'</p>';
  }
  D.ingredients.forEach(function(x,i){
    var el = document.createElement('div'); el.className='sk-ing-item'+(i===0?' active':'');
    el.innerHTML = '<div class="img"><img src="'+x.img+'" alt="'+x.name+'"></div><div class="name">'+x.name+'</div>';
    el.addEventListener('click', function(){
      idx=i; strip.querySelectorAll('.sk-ing-item').forEach(function(n,k){ n.classList.toggle('active', k===i); });
      el.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
      renderDetail();
    });
    strip.appendChild(el);
  });
  renderDetail();
  var scrollTimer;
  strip.addEventListener('scroll', function(){
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function(){
      var items = strip.querySelectorAll('.sk-ing-item'); var mid = strip.scrollLeft + strip.clientWidth/2;
      var best=0, bestD=Infinity;
      items.forEach(function(it,i){ var c=it.offsetLeft+it.offsetWidth/2; var d=Math.abs(c-mid); if(d<bestD){bestD=d;best=i;} });
      if(best!==idx){ idx=best; items.forEach(function(n,k){ n.classList.toggle('active', k===idx); }); renderDetail(); }
    }, 120);
  });
}

/* ---- Benefits ---- */
function initBenefits(){
  var grid = document.getElementById('benefitsGrid');
  D.benefits.forEach(function(b){
    var el = document.createElement('div'); el.className='sk-ben-card sk-reveal';
    el.innerHTML = '<img src="'+b.img+'" alt="'+b.t+'"><div class="grad"></div><div class="t">'+b.t+'</div>';
    grid.appendChild(el);
  });
}

/* ---- Results ---- */
function initResults(){
  var AFTER_IMG = {7:'assets/results-after-14.png', 14:'assets/results-after-42.png'};
  var tabs = document.getElementById('dayTabs'), afterImg = document.getElementById('afterImg'), dayTag = document.getElementById('dayTag');
  var box = document.getElementById('compareBox'), wrap = document.getElementById('beforeWrap'), handle = document.getElementById('handle');
  var days = 7;
  [7,14].forEach(function(n){
    var b = document.createElement('button'); b.textContent = n+' Days'; if(n===7) b.className='active';
    b.addEventListener('click', function(){
      days=n; tabs.querySelectorAll('button').forEach(function(x){x.classList.remove('active');}); b.classList.add('active');
      afterImg.src = AFTER_IMG[n]; dayTag.textContent = 'DAY '+n;
    });
    tabs.appendChild(b);
  });
  var dragging=false;
  function setPos(clientX){
    var r = box.getBoundingClientRect();
    var pos = Math.max(0, Math.min(100, (clientX-r.left)/r.width*100));
    wrap.style.width = pos+'%'; handle.style.left = pos+'%';
  }
  box.addEventListener('mousedown', function(e){ dragging=true; setPos(e.clientX); });
  box.addEventListener('touchstart', function(e){ dragging=true; setPos(e.touches[0].clientX); });
  window.addEventListener('mousemove', function(e){ if(dragging) setPos(e.clientX); });
  window.addEventListener('touchmove', function(e){ if(dragging) setPos(e.touches[0].clientX); });
  window.addEventListener('mouseup', function(){ dragging=false; });
  window.addEventListener('touchend', function(){ dragging=false; });

  var statsCol = document.getElementById('statsCol');
  D.stats.forEach(function(st){
    var row = document.createElement('div'); row.className='sk-stat sk-reveal';
    row.innerHTML = '<b data-target="'+st.n+'">0</b><span>'+st.s+'</span>';
    statsCol.appendChild(row);
  });
  var note = document.createElement('span'); note.className='sk-stats-note'; note.textContent='*Based on a consumer perception study.'; statsCol.appendChild(note);
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var elB = e.target.querySelector('b'); var tgt = parseFloat(elB.dataset.target); var t0=performance.now(); var dur=1600;
        function tick(t){ var p=Math.min(1,(t-t0)/dur); elB.textContent = Math.round((1-Math.pow(1-p,3))*tgt)+'%'; if(p<1) requestAnimationFrame(tick); }
        requestAnimationFrame(tick); io.unobserve(e.target);
      }
    });
  }, {threshold:0.5});
  statsCol.querySelectorAll('.sk-stat').forEach(function(el){ io.observe(el); });
}

/* ---- Comparison ---- */
function initComparison(){
  var table = document.getElementById('cmpTable');
  var html = '<div class="sk-cmp-row"><div></div><div class="sk-cmp-head-us"><span class="sk-wordmark" style="font-size:13px;color:var(--sk-ink);font-weight:800">SEREKO</span></div><div class="sk-cmp-head-them">Typical Moisturizer</div></div>';
  D.compare.forEach(function(r){
    function cell(v,us){
      if(typeof v==='string') return '<span class="'+(us?'cmp-strong':'cmp-mute')+'">'+v+'</span>';
      return v ? '<span class="dot-yes">'+svg(['M4 12l5 5L20 6'],14,14,3.4)+'</span>' : '<span class="dot-no">'+svg(['M6 6l12 12M18 6L6 18'],12,12,3.4)+'</span>';
    }
    html += '<div class="sk-cmp-row"><div class="label">'+r.row+'</div><div class="us">'+cell(r.us,true)+'</div><div class="them">'+cell(r.them,false)+'</div></div>';
  });
  table.innerHTML = html;
}

/* ---- Routine builder ---- */
var routineState = { period:'Morning', sel:{} };
function initRoutine(){
  var toggle = document.getElementById('periodToggle'), track = document.getElementById('routineTrack'), section = document.getElementById('routine');
  ['Morning','Night'].forEach(function(t){
    var b = document.createElement('button'); b.className = t===routineState.period?'active':'';
    b.innerHTML = '<span aria-hidden="true" style="font-size:15px;line-height:1">'+(t==='Morning'?'☀':'☾')+'</span>'+t;
    b.addEventListener('click', function(){ routineState.period=t; routineState.sel={}; renderRoutine(); });
    toggle.appendChild(b);
  });
  function renderRoutine(){
    toggle.querySelectorAll('button').forEach(function(b,i){ b.classList.toggle('active', ['Morning','Night'][i]===routineState.period); });
    var night = routineState.period==='Night';
    section.classList.toggle('night', night);
    var steps = D.routine[routineState.period];
    track.innerHTML='';
    steps.forEach(function(s,i){
      if(routineState.sel[s]===undefined) routineState.sel[s]=true;
      var pid = STEP_PRODUCT[s], prod = pid && D.bundle.find(function(b){return b.id===pid;});
      var desc = STEP_DESC[s]||'';
      var active = s==='Hydra-Crème';
      var card = document.createElement('div');
      card.className='sk-routine-card'+(active?' step-active':'')+(routineState.sel[s]===false?' deselected':'');
      card.innerHTML =
        '<div class="thumb">'+(prod?'<img src="'+prod.img+'" alt="'+prod.name+'">':'')+
        '<div class="sk-routine-num">'+(i+1)+'</div>'+
        (!active?'<div class="sk-routine-sel'+(routineState.sel[s]===false?' off':'')+'">'+(routineState.sel[s]!==false?svg(['M5 12l5 5L20 7'],12,12,3):'')+'</div>':'')+
        '</div><div class="sk-routine-body"><div class="name">'+s+'</div><div class="desc">'+desc+'</div>'+
        (prod?'<div class="pricerow"><span class="p">₹'+prod.price+'</span><span class="explore">Explore '+svg(['M5 12h14M13 6l6 6-6 6'],10,10,3)+'</span></div>':'')+
        (active?'<div class="here">You are here</div>':'')+'</div>';
      if(!active) card.addEventListener('click', function(){ routineState.sel[s]=!routineState.sel[s]; renderRoutine(); });
      track.appendChild(card);
      if(i<steps.length-1){ var arrow=document.createElement('div'); arrow.className='sk-arrow'; arrow.innerHTML=svg(['M5 12h14M13 6l6 6-6 6'],22,22,2); track.appendChild(arrow); }
    });
    renderCart(steps);
  }
  function renderCart(steps){
    var chosen = steps.filter(function(s){ return routineState.sel[s]!==false; })
      .map(function(s){ return STEP_PRODUCT[s]; }).filter(Boolean)
      .map(function(id){ return D.bundle.find(function(b){return b.id===id;}); }).filter(Boolean);
    var total = chosen.reduce(function(s,b){return s+b.price;},0);
    var save = Math.round(total*0.12), pay = total-save;
    var card = document.getElementById('cartCard');
    card.innerHTML = '<div class="title">Your bundle · '+chosen.length+' items</div>'+
      chosen.map(function(b){ return '<div class="sk-cart-line"><span>'+b.name+'</span><span>₹'+b.price+'</span></div>'; }).join('')+
      '<div class="sk-cart-totals"><div class="row"><span>Subtotal</span><span>₹'+total+'</span></div>'+
      '<div class="row green"><span>Bundle savings</span><span>− ₹'+save+'</span></div>'+
      '<div class="total"><b>Total</b><b>₹'+pay+'</b></div></div>'+
      '<button class="btn full md" id="addBundleBtn" style="margin-top:12px">Add Bundle · ₹'+pay+'</button>'+
      '<div class="sk-cart-tags"><span>✓ Free shipping</span><span>✓ Subscribe & save 10%</span><span>✓ +'+Math.round(pay/10)+' pts</span></div>';
    document.getElementById('addBundleBtn').addEventListener('click', function(){ chosen.forEach(function(b){ addToCart(b.id); }); });
  }
  renderRoutine();
}

/* ---- Reviews ---- */
function initReviews(){
  var filters = ['All','Dry','Sensitive','Monsoon','Festive','Oily'];
  var filterBar = document.getElementById('reviewFilters'), list = document.getElementById('reviewsList'), search = document.getElementById('reviewSearch');
  var f = 'All';
  filters.forEach(function(x){
    var b = document.createElement('button'); b.textContent=x; if(x==='All') b.className='active';
    b.addEventListener('click', function(){ f=x; filterBar.querySelectorAll('button').forEach(function(o){o.classList.remove('active');}); b.classList.add('active'); render(); });
    filterBar.appendChild(b);
  });
  search.addEventListener('input', render);
  function render(){
    var q = search.value.toLowerCase();
    var shown = D.reviews.filter(function(r){
      return (f==='All'||r.tags.indexOf(f)>-1) && (!q || (r.title+r.body+r.name).toLowerCase().indexOf(q)>-1);
    });
    list.innerHTML = shown.map(function(r){
      return '<div class="sk-review-card"><div class="top"><span class="stars">'+starsHtml(r.stars,14)+'</span><span class="verified">✓ Verified</span></div>'+
        '<div class="title">'+r.title+'</div><p class="body">'+r.body+'</p>'+
        '<div class="bottom"><span class="name">'+r.name+'</span><div class="tags">'+r.tags.map(function(t){return '<span>'+t+'</span>';}).join('')+'</div></div></div>';
    }).join('') || '<p style="text-align:center;font-family:var(--sk-font-body);color:var(--sk-grey)">No reviews match that filter.</p>';
  }
  render();
}

/* ---- FAQ chat ---- */
function initFaq(){
  var body = document.getElementById('chatBody'), suggest = document.getElementById('chatSuggest');
  var msgs = [{who:'bot', text:'Hi! I’m the Sereko skin concierge. Ask me anything about Hydra-Crème.'}];
  var asked = [];
  function renderMsgs(){
    body.innerHTML = msgs.map(function(m){ return '<div class="sk-msg '+m.who+'"><div class="bubble">'+m.text+'</div></div>'; }).join('');
    body.scrollTop = body.scrollHeight;
  }
  function renderSuggest(){
    var remaining = D.faq.filter(function(f){ return asked.indexOf(f.q)===-1; });
    suggest.innerHTML='';
    remaining.forEach(function(item){
      var b = document.createElement('button'); b.textContent = item.q;
      b.addEventListener('click', function(){
        asked.push(item.q); msgs.push({who:'me', text:item.q}); renderMsgs(); renderSuggest();
        var typing = document.createElement('div'); typing.className='sk-typing'; typing.innerHTML='<span></span><span></span><span></span>';
        body.appendChild(typing); body.scrollTop = body.scrollHeight;
        setTimeout(function(){ typing.remove(); msgs.push({who:'bot', text:item.a}); renderMsgs(); }, 900);
      });
      suggest.appendChild(b);
    });
  }
  renderMsgs(); renderSuggest();
}

/* ---- Cart / sticky bar ---- */
function addToCart(id){ cart.items.push(id); cart.count++; cart.total += PRICES[id]||0; updateStickyBar(); }
function updateStickyBar(){
  document.getElementById('cartCount').textContent = cart.count;
  document.getElementById('cartTotal').textContent = cart.total;
  var away = Math.max(0, FREE_SHIP-cart.total);
  document.getElementById('shipFill').style.width = Math.min(100, cart.total/FREE_SHIP*100)+'%';
  document.getElementById('shipText').textContent = away>0 ? ("You're ₹"+away+" away from FREE shipping") : "You’ve unlocked FREE shipping";
}
function initStickyBar(){
  var bar = document.getElementById('stickybar'), journeyEl = document.getElementById('journey');
  function on(){
    var r = journeyEl.getBoundingClientRect();
    bar.classList.toggle('show', r.bottom<=0);
  }
  window.addEventListener('scroll', on, {passive:true}); on();
  document.getElementById('addToCartSticky').addEventListener('click', function(){ addToCart('creme'); });
  updateStickyBar();
}

/* ---- Footer social icons ---- */
function initFooterSocial(){
  var paths = [
    'M16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zm-4 13a4 4 0 110-8 4 4 0 010 8zm4.7-8.7a1 1 0 110-2 1 1 0 010 2z',
    'M14 9h3l-.5 3H14v9h-3.5v-9H8V9h2.5V7.3C10.5 4.9 11.9 3 14.7 3H17v3h-1.7c-.9 0-1.3.4-1.3 1.3V9z',
    'M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z',
    'M6.5 8.5v12H3v-12h3.5zM4.8 7A2 2 0 114.7 3a2 2 0 01.1 4zM21 20.5h-3.5v-6c0-1.6-.7-2.5-2-2.5-1.5 0-2.3 1-2.3 2.5v6H9.7v-12h3.4v1.5A3.8 3.8 0 0116.4 8c2.6 0 4.6 1.7 4.6 5.2v7.3z'
  ];
  var el = document.getElementById('footSocial');
  paths.forEach(function(p){ var s=document.createElement('span'); s.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sk-lavender-dark)"><path d="'+p+'"/></svg>'; el.appendChild(s); });
}

/* ---- Exit popup ---- */
function initExitPopup(){
  var popup = document.getElementById('exitpopup'); var fired=false;
  document.addEventListener('mouseout', function(e){
    if(e.clientY<=0 && !fired && !sessionStorage.getItem('sk_exit')){
      fired=true; sessionStorage.setItem('sk_exit','1'); popup.classList.add('show');
    }
  });
  function close(){ popup.classList.remove('show'); }
  document.getElementById('popupClose').addEventListener('click', close);
  document.getElementById('popupSkip').addEventListener('click', close);
  document.getElementById('popupBuild').addEventListener('click', function(){ close(); document.getElementById('routine').scrollIntoView({behavior:'smooth'}); });
  popup.addEventListener('click', function(e){ if(e.target===popup) close(); });
}

if('scrollRestoration' in history){ history.scrollRestoration='manual'; }
window.scrollTo(0,0);

initScrollChrome(); initMarquee(); initGallery(); initBuyInfo(); initJourney(); initIngredientLab();
initBenefits(); initResults(); initComparison(); initRoutine(); initReviews(); initFaq();
initFooterSocial(); initStickyBar(); initExitPopup(); initReveal();
})();
