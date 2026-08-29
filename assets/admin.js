
const REQ_KEY='mmInspectionRequests', TEXT_KEY='mmCmsTexts', IMAGE_KEY='mmCmsImages', SESSION='mmAdminLoggedIn';
const USER='admin', PASS='MM@2026';
const $=id=>document.getElementById(id);
const parse=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch{return f}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
let activeContentPage='index.html', activeImagePage='index.html';

function login(e){
 if(e)e.preventDefault();
 const user=($('adminUser').value||'').trim().toLowerCase(),pass=($('adminPass').value||'').trim();
 if(user===USER && pass===PASS){sessionStorage.setItem(SESSION,'1');$('loginMsg').textContent='';showApp()}
 else {$('loginMsg').textContent='Login failed. Use admin / MM@2026';$('adminPass').focus()}
}
function showApp(){$('loginView').classList.add('hidden');$('appView').classList.remove('hidden');renderEnquiries();renderContentTabs();renderImageTabs()}
function logout(){sessionStorage.removeItem(SESSION);location.reload()}

document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
 const tab=b.dataset.tab; document.querySelectorAll('main > section').forEach(s=>s.classList.add('hidden')); $('tab-'+tab).classList.remove('hidden');
 $('sectionTitle').textContent={enquiries:'Enquiries',content:'Website Content',products:'Added Products',images:'Photos & Logo',settings:'Settings'}[tab]||'Website Admin';
 if(tab==='content')renderContentEditors(); if(tab==='products')renderAdminProducts(); if(tab==='images')renderImages();
}));

// Enquiries
function getReq(){return parse(REQ_KEY,[])}
function fmt(d){try{return new Date(d).toLocaleString()}catch{return d||''}}
function renderEnquiries(){
 let all=getReq(), q=($('searchInput')?.value||'').toLowerCase(), st=$('statusFilter')?.value||'';
 $('statTotal').textContent=all.length;$('statNew').textContent=all.filter(x=>x.status==='New').length;$('statContacted').textContent=all.filter(x=>x.status==='Contacted').length;$('statCompleted').textContent=all.filter(x=>x.status==='Completed').length;
 let rows=all.filter(x=>(!st||x.status===st)&&(!q||Object.values(x).join(' ').toLowerCase().includes(q)));
 $('requestRows').innerHTML=rows.map(x=>`<tr><td>${esc(fmt(x.createdAt))}</td><td><b>${esc(x.name)}</b></td><td>${esc(x.company)}</td><td>${esc(x.email)}</td><td>${esc(x.phone)}</td><td>${esc(x.service)}</td><td>${esc(x.requirement)}</td><td><select class="status" onchange="changeStatus(${x.id},this.value)"><option ${x.status==='New'?'selected':''}>New</option><option ${x.status==='Contacted'?'selected':''}>Contacted</option><option ${x.status==='Completed'?'selected':''}>Completed</option></select></td><td class="actions-cell"><div class="action-group"><a class="action-btn whatsapp" target="_blank" rel="noopener" href="https://wa.me/${String(x.phone||'').replace(/\D/g,'')}">WhatsApp</a><button class="action-btn delete" onclick="delReq(${x.id})">Delete</button></div></td></tr>`).join('');
 $('emptyState').classList.toggle('hidden',!!rows.length);
}
window.changeStatus=(id,status)=>{let d=getReq(),x=d.find(v=>v.id===id);if(x)x.status=status;save(REQ_KEY,d);renderEnquiries()}
window.delReq=id=>{if(confirm('Delete this request?')){save(REQ_KEY,getReq().filter(x=>x.id!==id));renderEnquiries()}}
function exportCsv(){let d=getReq(),r=[['Date','Name','Company','Email','Phone','Service','Requirement','Status'],...d.map(x=>[fmt(x.createdAt),x.name,x.company,x.email,x.phone,x.service,x.requirement,x.status])];let csv=r.map(a=>a.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');let b=new Blob([csv],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='inspection-requests.csv';a.click()}

// Content CMS
const pages=['index.html','about.html','services.html','industries.html','contact.html'];
function prettyPage(p){return p.replace('.html','').replace(/^./,c=>c.toUpperCase())}
function renderContentTabs(){
 $('contentPageTabs').innerHTML=pages.map(p=>`<button class="${p===activeContentPage?'active':''}" onclick="setContentPage('${p}')">${prettyPage(p)}</button>`).join('');
 renderContentEditors();
}
window.setContentPage=p=>{activeContentPage=p;renderContentTabs()}
function renderContentEditors(){
 const edits=parse(TEXT_KEY,{});
 const items=(window.MM_CMS_MANIFEST?.texts||[]).filter(x=>x.page===activeContentPage);
 $('contentEditors').innerHTML=items.map((x,i)=>`<div class="editor-row"><div class="editor-meta"><small>${esc(x.tag.toUpperCase())} • ${esc(x.page)}</small><span>${esc(x.key)}</span></div><textarea data-edit-key="${esc(x.key)}" data-default="${esc(x.default)}">${esc(Object.prototype.hasOwnProperty.call(edits,x.key)?edits[x.key]:x.default)}</textarea><button class="btn" onclick="resetOneText('${x.key}')">Original</button></div>`).join('');
}
function saveContent(){
 const edits=parse(TEXT_KEY,{});
 document.querySelectorAll('[data-edit-key]').forEach(el=>edits[el.dataset.editKey]=el.value);
 save(TEXT_KEY,edits); alert('Website content saved. Refresh/open the website page to see changes.');
}
window.resetOneText=key=>{let d=parse(TEXT_KEY,{});delete d[key];save(TEXT_KEY,d);renderContentEditors()}
function resetCurrentContent(){if(!confirm('Reset all edited text on this page?'))return;let d=parse(TEXT_KEY,{});(window.MM_CMS_MANIFEST.texts||[]).filter(x=>x.page===activeContentPage).forEach(x=>delete d[x.key]);save(TEXT_KEY,d);renderContentEditors()}

// Images CMS
function renderImageTabs(){
 $('imagePageTabs').innerHTML=pages.map(p=>`<button class="${p===activeImagePage?'active':''}" onclick="setImagePage('${p}')">${prettyPage(p)}</button>`).join('');renderImages()
}
window.setImagePage=p=>{activeImagePage=p;renderImageTabs()}
function currentImageValue(x){const d=parse(IMAGE_KEY,{});return d[x.key]||x.default}
function renderImages(){
 const items=(window.MM_CMS_MANIFEST?.images||[]).filter(x=>x.page===activeImagePage);
 $('imageGrid').innerHTML=items.map((x,i)=>{
   const val=currentImageValue(x);
   return `<div class="image-item"><div class="image-preview"><img src="${esc(val)}" alt=""></div><div class="image-info"><h3>${esc(x.label)}</h3><p>${esc(x.key)}</p><div class="image-actions"><input class="file" id="file-${i}" type="file" accept="image/png,image/jpeg,image/webp"><button class="btn gold" onclick="document.getElementById('file-${i}').click()">Change Photo</button><button class="btn" onclick="resetImage('${x.key}')">Original</button></div></div></div>`
 }).join('');
 items.forEach((x,i)=>document.getElementById('file-'+i)?.addEventListener('change',e=>uploadImage(x.key,e.target.files[0])));
}
function uploadImage(key,file){
 if(!file)return;
 if(file.size>2.5*1024*1024){alert('Please choose an image below 2.5 MB for this local demo.');return}
 const reader=new FileReader();reader.onload=()=>{let d=parse(IMAGE_KEY,{});d[key]=reader.result;try{save(IMAGE_KEY,d);renderImages();alert('Photo updated. Refresh the website page to see it.')}catch(e){alert('Browser storage is full. Use a smaller/compressed image.')}};reader.readAsDataURL(file)
}
window.resetImage=key=>{let d=parse(IMAGE_KEY,{});delete d[key];save(IMAGE_KEY,d);renderImages()}
function resetCurrentImages(){if(!confirm('Reset all images on this page?'))return;let d=parse(IMAGE_KEY,{});(window.MM_CMS_MANIFEST.images||[]).filter(x=>x.page===activeImagePage).forEach(x=>delete d[x.key]);save(IMAGE_KEY,d);renderImages()}

// Backup / restore
function backupCms(){const payload={version:1,exportedAt:new Date().toISOString(),texts:parse(TEXT_KEY,{}),images:parse(IMAGE_KEY,{})};let b=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mm-website-cms-backup.json';a.click()}
function restoreCms(file){if(!file)return;let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);save(TEXT_KEY,d.texts||{});save(IMAGE_KEY,d.images||{});alert('CMS backup restored.');renderContentEditors();renderImages()}catch{alert('Invalid backup file.')}};r.readAsText(file)}
function resetCms(){if(confirm('Reset ALL website text and photo changes?')){localStorage.removeItem(TEXT_KEY);localStorage.removeItem(IMAGE_KEY);alert('Website CMS reset to original.');renderContentEditors();renderImages()}}

// Events
document.addEventListener('DOMContentLoaded',()=>{
 $('adminLoginForm').addEventListener('submit',login);$('logoutBtn').addEventListener('click',logout);
 $('searchInput').addEventListener('input',renderEnquiries);$('statusFilter').addEventListener('change',renderEnquiries);$('exportBtn').addEventListener('click',exportCsv);
 $('saveContentBtn').addEventListener('click',saveContent);$('resetContentBtn').addEventListener('click',resetCurrentContent);
 $('resetImagesBtn').addEventListener('click',resetCurrentImages);$('backupBtn').addEventListener('click',backupCms);$('restoreBtn').addEventListener('click',()=>$('restoreFile').click());$('restoreFile').addEventListener('change',e=>restoreCms(e.target.files[0]));$('resetCmsBtn').addEventListener('click',resetCms);
 if(sessionStorage.getItem(SESSION)==='1')showApp();
});


// ================= Product Management =================
const PRODUCTS_KEY='mmProducts';
let editingProductId=null;
let pendingProductImage='';

function getProducts(){
  try{
    const d=JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'null');
    if(Array.isArray(d)) return d;
  }catch(e){}
  return [];
}
function saveProducts(d){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(d))}
function renderAdminProducts(){
  if(!$('adminProductsGrid'))return;
  const q=($('productAdminSearch')?.value||'').toLowerCase().trim();
  const all=getProducts().sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0));
  const rows=all.filter(p=>!q||[p.name,p.category,p.description,...(p.specs||[])].join(' ').toLowerCase().includes(q));
  $('adminProductsGrid').innerHTML=rows.map(p=>`
    <div class="admin-product-card">
      <div class="admin-product-photo"><img src="${esc(p.image||'assets/mm-logo-mark.svg')}" alt="${esc(p.name)}"></div>
      <div class="admin-product-info">
        <div class="cat">${esc(p.category||'Product')}</div>
        <h3>${esc(p.name||'Untitled Product')}</h3>
        <p>${esc(p.description||'')}</p>
        <div class="admin-product-meta">
          ${(p.specs||[]).map(s=>`<span>${esc(s)}</span>`).join('')}
          ${p.featured?'<span>Featured</span>':''}
          <span>${p.visible!==false?'Visible':'Hidden'}</span>
          <span>Order: ${Number(p.order)||0}</span>
        </div>
        <div class="admin-product-actions">
          <button class="btn gold" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn" onclick="duplicateProduct(${p.id})">Duplicate</button>
          <button class="btn danger" onclick="removeProduct(${p.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
  $('adminProductsEmpty').classList.toggle('hidden',!!rows.length);
}
function openProductModal(product=null){
  editingProductId=product?.id??null;
  pendingProductImage=product?.image||'assets/mm-logo-mark.svg';
  $('productModalTitle').textContent=product?'Edit Product':'Add Product';
  $('productName').value=product?.name||'';
  $('productCategory').value=product?.category||'';
  $('productDescription').value=product?.description||'';
  $('productSpecs').value=(product?.specs||[]).join(', ');
  $('productOrder').value=product?.order??getProducts().length+1;
  $('productFeatured').checked=!!product?.featured;
  $('productVisible').checked=product ? product.visible!==false : true;
  $('productImagePreview').src=pendingProductImage;
  $('productImageFile').value='';
  $('productModal').classList.remove('hidden');
}
function closeProductModal(){$('productModal').classList.add('hidden')}
window.editProduct=id=>{const p=getProducts().find(x=>x.id===id);if(p)openProductModal(p)}
window.removeProduct=id=>{
  if(!confirm('Remove this product from website?'))return;
  saveProducts(getProducts().filter(x=>x.id!==id));renderAdminProducts()
}
window.duplicateProduct=id=>{
  const d=getProducts(),p=d.find(x=>x.id===id);if(!p)return;
  const copy={...p,id:Date.now(),name:p.name+' Copy',order:d.length+1};
  d.push(copy);saveProducts(d);renderAdminProducts()
}
function saveProductFromModal(){
  const name=$('productName').value.trim();
  if(!name){alert('Product name is required.');return}
  const product={
    id:editingProductId??Date.now(),
    name,
    category:$('productCategory').value.trim()||'Product',
    description:$('productDescription').value.trim(),
    specs:$('productSpecs').value.split(',').map(x=>x.trim()).filter(Boolean),
    image:pendingProductImage||'assets/mm-logo-mark.svg',
    featured:$('productFeatured').checked,
    visible:$('productVisible').checked,
    order:Number($('productOrder').value)||0
  };
  let d=getProducts();
  const i=d.findIndex(x=>x.id===product.id);
  if(i>=0)d[i]=product;else d.push(product);
  saveProducts(d);closeProductModal();renderAdminProducts();alert('Product saved.');
}
function handleProductImage(file){
  if(!file)return;
  if(file.size>2.5*1024*1024){alert('Please choose an image below 2.5 MB for this local demo.');return}
  const r=new FileReader();
  r.onload=()=>{pendingProductImage=r.result;$('productImagePreview').src=pendingProductImage};
  r.readAsDataURL(file)
}
function clearAddedProducts(){
  if(!confirm('Remove all products added from Admin? The 50 official catalogue products will remain unchanged.'))return;
  saveProducts([]);renderAdminProducts()
}


document.addEventListener('DOMContentLoaded',()=>{
  if($('addProductBtn'))$('addProductBtn').addEventListener('click',()=>openProductModal());
  if($('cancelProductBtn'))$('cancelProductBtn').addEventListener('click',closeProductModal);
  if($('saveProductBtn'))$('saveProductBtn').addEventListener('click',saveProductFromModal);
  if($('productImageFile'))$('productImageFile').addEventListener('change',e=>handleProductImage(e.target.files[0]));
  if($('productAdminSearch'))$('productAdminSearch').addEventListener('input',renderAdminProducts);
  if($('resetProductsBtn'))$('resetProductsBtn').addEventListener('click',clearAddedProducts);
  if($('productModal'))$('productModal').addEventListener('click',e=>{if(e.target===$('productModal'))closeProductModal()});
  renderAdminProducts();
});
