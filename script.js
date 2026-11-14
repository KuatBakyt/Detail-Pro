'use strict';
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
function closeMenu(focus=false){const wasOpen=nav.classList.contains('open');nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Открыть меню');if(focus&&wasOpen)menuBtn.focus();}
menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu(true);});document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menuBtn.contains(e.target))closeMenu();});window.matchMedia('(min-width:801px)').addEventListener('change',()=>closeMenu());
const cards=[...document.querySelectorAll('.service-card')],grid=document.getElementById('serviceGrid'),counter=document.getElementById('serviceCount');let serviceIndex=0;
function showService(n){serviceIndex=(n+cards.length)%cards.length;cards.forEach((c,i)=>c.classList.toggle('selected',i===serviceIndex));grid.scrollTo({left:cards[serviceIndex].offsetLeft-cards[0].offsetLeft,behavior:reducedMotion.matches?'auto':'smooth'});counter.textContent=`${serviceIndex+1} / ${cards.length}`;}
document.getElementById('servicePrev').onclick=()=>showService(serviceIndex-1);document.getElementById('serviceNext').onclick=()=>showService(serviceIndex+1);
let scrollDebounce;grid.addEventListener('scroll',()=>{clearTimeout(scrollDebounce);scrollDebounce=setTimeout(()=>{const rect=grid.getBoundingClientRect();let best=Infinity;cards.forEach((c,i)=>{const dist=Math.abs(c.getBoundingClientRect().left-rect.left);if(dist<best){best=dist;serviceIndex=i;}});counter.textContent=`${serviceIndex+1} / ${cards.length}`;cards.forEach((c,i)=>c.classList.toggle('selected',i===serviceIndex));},100);},{passive:true});
document.querySelectorAll('.filter').forEach(button=>button.onclick=()=>{const category=button.dataset.filter;document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('.work').forEach(item=>{item.hidden=category!=='all'&&item.dataset.category!==category;});});
const range=document.getElementById('compareRange');range.oninput=()=>document.getElementById('comparison').style.setProperty('--split',range.value+'%');
const lightbox=document.getElementById('lightbox');document.querySelectorAll('.work').forEach(work=>{const image=work.querySelector('img'),caption=work.querySelector('figcaption');const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Открыть фото: '+caption.textContent);image.before(button);button.append(image);button.onclick=()=>{document.getElementById('lightboxImage').src=image.src;document.getElementById('lightboxImage').alt=image.alt;document.getElementById('lightboxCaption').textContent=caption.textContent+' · Иллюстрация проекта';lightbox.showModal();};});document.getElementById('closeLightbox').onclick=()=>lightbox.close();lightbox.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close();}});
// Set both values to the studio's real numbers before enabling live booking.
const studioPhone = '';
const studioWhatsApp = '';
const contactStatus = document.getElementById('contactStatus');

function wireStudioLinks(selector, number, href) {
  document.querySelectorAll(selector).forEach(link => {
    if (number) {
      link.href = href;
      return;
    }
    link.addEventListener('click', () => {
      contactStatus.textContent = 'Демо: номер студии пока не указан.';
    });
  });
}
wireStudioLinks('[data-studio-call]', studioPhone, 'tel:' + studioPhone);
wireStudioLinks('[data-studio-chat]', studioWhatsApp, 'https://wa.me/' + studioWhatsApp);

const form = document.getElementById('bookingForm');
const status = document.getElementById('formStatus');
const { name, phone, service, comment } = form.elements;
const submit = form.querySelector('[type="submit"]');

function setFormStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

document.querySelectorAll('.price-list > div').forEach(row => {
  row.querySelector('a').addEventListener('click', () => {
    service.value = row.querySelector('strong').textContent;
    service.removeAttribute('aria-invalid');
  });
});
form.addEventListener('input', event => event.target.removeAttribute('aria-invalid'));
form.addEventListener('submit', event => {
  event.preventDefault();
  const digits = phone.value.replace(/\D/g, '');
  const fields = [
    [name, Boolean(name.value.trim()), 'Укажите имя.'],
    [phone, digits.length >= 10 && digits.length <= 15, 'Введите телефон из 10–15 цифр.'],
    [service, Boolean(service.value), 'Выберите услугу.']
  ];
  fields.forEach(([field, valid]) => field.setAttribute('aria-invalid', String(!valid)));
  const invalid = fields.find(([, valid]) => !valid);
  if (invalid) {
    setFormStatus('error', invalid[2]);
    invalid[0].focus();
    return;
  }
  const message = [
    'Здравствуйте! Хочу записаться в Detail Pro.',
    'Имя: ' + name.value.trim(),
    'Телефон: ' + phone.value.trim(),
    'Услуга: ' + service.value,
    comment.value.trim() && 'Комментарий: ' + comment.value.trim()
  ].filter(Boolean).join('\n');
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  setFormStatus('pending', 'Подготавливаем заявку…');
  window.setTimeout(() => {
    form.removeAttribute('aria-busy');
    submit.disabled = false;
    if (!studioWhatsApp) {
      setFormStatus('success', 'Заявка подготовлена. В демо номер студии не указан.');
      return;
    }
    setFormStatus('success', 'Заявка подготовлена, открываем WhatsApp…');
    window.setTimeout(() => {
      window.location.assign('https://wa.me/' + studioWhatsApp + '?text=' + encodeURIComponent(message));
    }, 350);
  }, 200);
});

grid.addEventListener('keydown', event => {
  const destination = {
    ArrowLeft: serviceIndex - 1,
    ArrowRight: serviceIndex + 1,
    Home: 0,
    End: cards.length - 1
  }[event.key];
  if (typeof destination !== 'number' || event.target !== grid) return;
  event.preventDefault();
  showService(destination);
});

if(!reducedMotion.matches&&'IntersectionObserver' in window){const nodes=[...document.querySelectorAll('.reveal')];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});nodes.forEach(el=>{el.classList.add('pending');observer.observe(el);});document.documentElement.classList.add('motion-ready');}
