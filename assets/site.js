(function(){
  'use strict';

  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const links=[['index.html','Home'],['about.html','About'],['products.html','Products'],['services.html','Capabilities'],['industries.html','Industries'],['contact.html','Contact']];
  const nav=document.querySelector('[data-site-nav]');
  const footer=document.querySelector('[data-site-footer]');

  if(nav){
    nav.innerHTML='<nav class="nav" aria-label="Primary navigation"><div class="container nav-inner"><a class="brand" href="index.html" aria-label="M&M Innovations home"><img class="brand-logo" src="assets/mm-logo.png" alt=""><span class="brand-copy"><strong>M&M INNOVATIONS PVT. LTD.</strong><small>Engineering • Hydraulics • Silicone</small></span></a><div class="nav-links" id="primaryNav">'+links.map(function(item){return '<a class="'+(page===item[0]?'active':'')+'" '+(page===item[0]?'aria-current="page" ':'')+'href="'+item[0]+'">'+item[1]+'</a>'}).join('')+'</div><a class="nav-cta" href="contact.html">Request a quote ↗</a><button class="menu-btn" type="button" aria-label="Open navigation" aria-controls="primaryNav" aria-expanded="false">☰</button></div></nav>';
  }

  if(footer){
    footer.innerHTML='<footer class="footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="index.html"><img class="brand-logo" src="assets/mm-logo.png" alt=""><span class="brand-copy"><strong>M&M INNOVATIONS PVT. LTD.</strong><small>Every step on the way</small></span></a><p>Custom-engineered hydraulics, precision components, rubber moulding presses and high-performance silicone solutions from Ahmedabad, India.</p></div><div><h4>Explore</h4><div class="footer-links"><a href="products.html">Product catalogue</a><a href="services.html">Capabilities</a><a href="industries.html">Industries</a><a href="contact.html">Technical enquiry</a></div></div><div><h4>Contact</h4><a href="tel:+919879778389">+91 9879778389</a><br><a href="mailto:info@mminnovation.in">info@mminnovation.in</a><p>Ahmedabad, Gujarat, India</p></div></div><div class="footer-bottom"><span>© '+new Date().getFullYear()+' M&M Innovations Private Limited.</span><span>Final V1.4.0 • Unique product photography edition</span></div></div></footer>';
  }

  const menu=document.querySelector('.menu-btn');
  const navLinks=document.querySelector('.nav-links');
  function setMenu(open){
    if(!menu||!navLinks)return;
    navLinks.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu.textContent=open?'×':'☰';
  }
  if(menu&&navLinks){
    menu.addEventListener('click',function(){setMenu(!navLinks.classList.contains('open'))});
    navLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
    document.addEventListener('click',function(e){if(navLinks.classList.contains('open')&&!nav.contains(e.target))setMenu(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&navLinks.classList.contains('open')){setMenu(false);menu.focus()}});
    addEventListener('resize',function(){if(innerWidth>820)setMenu(false)},{passive:true});
  }

  function safeParse(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch(e){return fallback}}
  function applyCms(){
    const texts=safeParse('mmCmsTexts',{}),images=safeParse('mmCmsImages',{});
    document.querySelectorAll('[data-cms-text]').forEach(function(el){const key=el.dataset.cmsText;if(Object.prototype.hasOwnProperty.call(texts,key))el.textContent=texts[key]});
    document.querySelectorAll('img[data-cms-image]').forEach(function(el){const key=el.dataset.cmsImage;if(images[key])el.src=images[key]});
  }
  applyCms();
  addEventListener('storage',applyCms);
  addEventListener('pageshow',applyCms);

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -24px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('visible')});
  }

  if(!reduced&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.division-card,.service-card,.industry').forEach(function(el){
      el.addEventListener('pointermove',function(e){const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(900px) rotateX('+(-y*2.2)+'deg) rotateY('+(x*2.2)+'deg) translateY(-6px)'});
      el.addEventListener('pointerleave',function(){el.style.transform=''});
    });
  }

  const form=document.getElementById('inspectionForm');
  if(form){
    const wanted=new URLSearchParams(location.search).get('product');
    if(wanted){const box=document.getElementById('requirement');if(box&&!box.value)box.value='Product enquiry: '+wanted+'\n\n'}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.reportValidity())return;
      const button=form.querySelector('[type="submit"]');
      const msg=document.getElementById('formMessage');
      const data=Object.fromEntries(new FormData(form));
      const requests=safeParse('mmInspectionRequests',[]);
      requests.unshift(Object.assign({id:Date.now(),createdAt:new Date().toISOString(),status:'New'},data));
      try{
        localStorage.setItem('mmInspectionRequests',JSON.stringify(requests));
        if(msg){msg.textContent='Thank you. Your enquiry has been recorded successfully.';msg.className='form-message success';msg.style.display='block'}
        form.reset();
        if(button){button.textContent='Enquiry submitted ✓';button.disabled=true;setTimeout(function(){button.textContent='Submit enquiry →';button.disabled=false},1800)}
      }catch(err){
        if(msg){msg.textContent='The enquiry could not be saved. Please call or email our team.';msg.className='form-message error';msg.style.display='block'}
      }
    });
  }
})();
