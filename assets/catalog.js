(function(){
  'use strict';
  function safeArray(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch(e){return []}}
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function specsOf(p){return Array.isArray(p.specs)?p.specs.filter(Boolean):[]}

  const products=(window.MM_PRODUCTS||[]).concat(safeArray('mmProducts').filter(function(p){return p&&p.visible!==false}));
  const allowed=['All'].concat(Array.from(new Set(products.map(function(p){return p.category}).filter(Boolean))));
  let category=new URLSearchParams(location.search).get('category')||'All';
  if(!allowed.includes(category))category='All';

  const grid=document.getElementById('productGrid');
  const empty=document.getElementById('productsEmpty');
  const search=document.getElementById('productSearch');
  const filters=document.getElementById('productFilters');
  const count=document.getElementById('productCount');
  const modal=document.getElementById('productModal');
  let previousFocus=null;

  function photo(p){
    const source=p.image||'assets/mm-logo-mark.svg';
    return source.indexOf('assets/product-photos/')===0
      ?source.replace('assets/product-photos/','assets/catalog-products/')
      :source;
  }
  // One authoritative image per product. The same file is used on the card
  // and inside View Details, preventing mismatches and repeated generic covers.
  function cover(p){return photo(p)}
  function drawFilters(){
    filters.innerHTML=allowed.map(function(c){const active=c===category;return '<button type="button" class="filter-btn '+(active?'active':'')+'" data-filter="'+esc(c)+'" aria-pressed="'+active+'">'+esc(c)+'</button>'}).join('');
    filters.querySelectorAll('button').forEach(function(button){button.addEventListener('click',function(){category=button.dataset.filter;drawFilters();draw()})});
  }
  function draw(){
    const q=(search.value||'').trim().toLowerCase();
    const rows=products.filter(function(p){const hay=[p.name,p.category,p.description].concat(specsOf(p)).join(' ').toLowerCase();return(category==='All'||p.category===category)&&(!q||hay.includes(q))});
    grid.innerHTML=rows.map(function(p){return '<article class="product-card reveal visible"><div class="product-media"><img loading="lazy" decoding="async" width="1200" height="900" src="'+esc(cover(p))+'" alt="'+esc(p.name)+'"><span class="product-badge">'+esc(p.category||'Product')+'</span></div><div class="product-body"><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p><div class="spec-chips">'+specsOf(p).slice(0,3).map(function(s){return '<span>'+esc(s)+'</span>'}).join('')+'</div><div class="product-actions"><button type="button" class="btn btn-secondary" data-view="'+esc(p.id)+'">View details</button><a class="btn btn-primary" href="contact.html?product='+encodeURIComponent(p.name)+'">Enquire</a></div></div></article>'}).join('');
    empty.hidden=rows.length!==0;
    if(count)count.textContent=rows.length+' product'+(rows.length===1?'':'s')+' shown';
    grid.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){img.src='assets/mm-logo-mark.svg';img.classList.add('image-fallback')},{once:true})});
    grid.querySelectorAll('[data-view]').forEach(function(button){button.addEventListener('click',function(){openProduct(button.dataset.view)})});
  }
  function openProduct(id){
    const p=products.find(function(item){return String(item.id)===String(id)});if(!p)return;
    previousFocus=document.activeElement;
    const image=modal.querySelector('[data-modal-image]');image.src=photo(p);image.alt=p.name;image.onerror=function(){image.src='assets/mm-logo-mark.svg';image.onerror=null};
    modal.querySelector('[data-modal-category]').textContent=p.category||'Product';
    modal.querySelector('[data-modal-title]').textContent=p.name||'Product';
    modal.querySelector('[data-modal-description]').textContent=p.description||'';
    modal.querySelector('[data-modal-specs]').innerHTML=specsOf(p).map(function(s){return '<div>'+esc(s)+'</div>'}).join('');
    modal.querySelector('[data-modal-enquire]').href='contact.html?product='+encodeURIComponent(p.name||'Product');
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
  }
  function closeModal(){
    if(!modal.classList.contains('open'))return;
    modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');
    if(previousFocus&&typeof previousFocus.focus==='function')previousFocus.focus();
  }
  function trapFocus(e){
    if(e.key!=='Tab'||!modal.classList.contains('open'))return;
    const items=Array.from(modal.querySelectorAll('button,a[href]')).filter(function(el){return !el.disabled});if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }

  search.addEventListener('input',draw);
  modal.querySelector('.modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();trapFocus(e)});
  drawFilters();draw();
})();
