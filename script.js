const root = document;

const whatsappCallout = root.querySelector('.whatsapp-callout');
if (whatsappCallout) {
  const storeClock = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  function updateWhatsappCallout() {
    const parts = Object.fromEntries(storeClock.formatToParts(new Date()).map(({ type, value }) => [type, value]));
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    const sunday = parts.weekday === 'Sun';
    // Published hours: Mon–Sat 07:30–19:30; Sunday 08:00–18:00.
    const isOpen = minutes >= (sunday ? 480 : 450) && minutes < (sunday ? 1080 : 1170);
    const message = isOpen ? 'Faça seu pedido pelo WhatsApp.' : 'Faça sua encomenda pelo WhatsApp.';
    whatsappCallout.querySelector('strong').textContent = isOpen ? 'Estamos online!' : 'Encomende por aqui!';
    whatsappCallout.querySelector('small').textContent = message;
    whatsappCallout.classList.toggle('is-closed', !isOpen);
    whatsappCallout.closest('a').setAttribute('aria-label', message);
  }
  updateWhatsappCallout();
  setInterval(updateWhatsappCallout, 15000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateWhatsappCallout();
  });
}

const ownerCarousel = root.querySelector('.owner-carousel');
if (ownerCarousel) {
  const photos = ownerCarousel.querySelectorAll('img');
  let photoIndex = 0;
  const changePhoto = (step) => {
    photoIndex = Math.max(0, Math.min(photos.length - 1, photoIndex + step));
    const next = ownerCarousel.querySelector('.owner-next');
    next.disabled = photoIndex >= photos.length - 1;
    next.classList.toggle('is-at-end', next.disabled);
    photos.forEach((photo, index) => { photo.hidden = index !== photoIndex; });
  };
  ownerCarousel.querySelector('.owner-prev').addEventListener('click', () => changePhoto(-1));
  ownerCarousel.querySelector('.owner-next').addEventListener('click', () => changePhoto(1));
}

const categories = [
  { id: 'bolos-personalizados', title: 'Bolos Personalizados', folder: 'BoloPersonalizado', basePath: '', files: ['BoloPersonalizado20.jpeg', 'BoloPersonalizado1.jpeg', 'BoloPersonalizado3.jpeg', 'BoloPersonalizado4.jpeg', 'BoloPersonalizado5.jpeg', 'BoloPersonalizado6.jpeg', 'BoloPersonalizado7.jpeg', 'BoloPersonalizado8.jpeg', 'BoloPersonalizado9.jpeg', 'BoloPersonalizado10.jpeg', 'BoloPersonalizado11.jpeg', 'BoloPersonalizado12.jpeg', 'BoloPersonalizado13.jpeg', 'BoloPersonalizado14.jpeg', 'BoloPersonalizado15.jpeg', 'BoloPersonalizado16.jpeg', 'BoloPersonalizado17.jpeg', 'BoloPersonalizado18.jpeg', 'BoloPersonalizado19.jpeg'], description: 'Do seu jeito, para tornar cada celebração única.' },
  { id: 'bolo-no-pote', title: 'Mini bolos', folder: 'BoloNoPote', prefix: 'BoloNoPote', files: ['BoloNoPote1.JPG', 'BoloNoPote2.JPG', 'BoloNoPote3.JPG', 'BoloNoPote4.jpg', 'BoloNoPote5.JPG'], description: 'Camadas de carinho para levar com você.' },
  { id: 'bolos-caseiros', title: 'Bolos caseiros', folder: 'BolosCaseiros', prefix: 'BoloCaseiro', files: ['BoloCaseiro1.JPG', 'BoloCaseiro2.JPG', 'BoloCaseiro3.JPG', 'BoloCaseiro4.JPG', 'BoloCaseiro5.JPG', 'BoloCaseiro6.JPG', 'BoloCaseiro7.JPG', 'BoloCaseiro8.JPG', 'BoloCaseiro9.JPG', 'BoloCaseiro10.JPG', 'BoloCaseiro11.JPG', 'BoloCaseiro12.JPG', 'BoloCaseiro13.JPG', 'BoloCaseiro14.JPG', 'BoloCaseiro15.JPG'], description: 'Receitas que perfumam a casa inteira.' },
  { id: 'bolos-confeitados', title: 'Bolos confeitados', folder: 'BolosConfeitados', basePath: '', prefix: 'BoloConfeitado', files: ['BoloConfeitado1.png', 'BoloConfeitado2.JPG', 'BoloConfeitado3.png', 'BoloConfeitado5.png', 'BoloConfeitado9.png', 'BoloConfeitado10.png', 'BoloConfeitado11.png', 'BoloConfeitado12.png', 'BoloConfeitado13.png', 'BoloConfeitado14.png', 'BoloConfeitado15.png', 'BoloConfeitado16.jpg', 'BoloConfeitado7.JPG', 'BoloConfeitado17.png', 'BoloConfeitado6.JPG', 'BoloConfeitado8.JPG', 'BoloConfeitado1.1.jpeg', 'BoloConfeitado2.2.jpeg', 'BoloConfeitado3.3.jpeg', 'BoloConfeitado4.4.jpeg', 'BoloConfeitado5.5.jpeg', 'BoloConfeitado6.6.jpeg'], description: 'Para celebrar em grande estilo.' },
  { id: 'fatias', title: 'Fatias de bolo', folder: 'FatiasBolo', files: ['FatiaBolo1.JPG', 'FatiaBolo2.JPG', 'FatiaBolo3.JPG', 'FatiaBolo4.JPG', 'FatiaBolo6.JPG', 'FatiaBolo7.jpg'], description: 'Uma pausa doce no meio do dia.' },
  { id: 'lanche', title: 'Lanche da tarde', folder: 'LancheTarde', originalFiles: ['MilhoCremosoNaPalha.jpeg'], files: ['LancheTarde1.JPG', 'LancheTarde2.JPG', 'LancheTarde3.JPG', 'LancheTarde4.JPG', 'LancheTarde5.JPG', 'MilhoCremosoNaPalha.jpeg'], description: 'Café passado e mesa cheia.' },
  { id: 'doces', title: 'Doces', folder: 'Doces', originalFiles: ['DocesBandeja1.jpeg', 'DocesBandeija2.jpeg', 'DocesBandeija3.jpeg', 'DocesBandeija4.jpeg', 'DocesBandeija5.jpeg', 'DocesBandeija6.jpeg'], files: ['DocesBandeja1.jpeg', 'DocesBandeija2.jpeg', 'DocesBandeija3.jpeg', 'DocesBandeija4.jpeg', 'DocesBandeija5.jpeg', 'DocesBandeija6.jpeg', 'Doce1.JPG', 'Doce2.JPG', 'Doce3.JPG', 'Doce4.JPG', 'Doce5.JPG', 'Doce6.JPG', 'Doce7.JPG', 'Doce8.JPG', 'Doce9.jpg', 'Doce10.jpg', 'Doce11.jpg', 'Doce12.jpg', 'Doce13.JPG', 'Doce14.JPG', 'Doce15.jpg', 'Doce16.JPG'], description: 'Pequenos detalhes, grandes suspiros.' },
  { id: 'tacas', title: 'Taças', folder: 'Taças', files: ['Taca1.JPG', 'Taça1.JPG', 'Taça2.JPG', 'Taça3.JPG', 'Taça4.JPG', 'Taça5.JPG', 'Taça6.JPG', 'Taça7.JPG'], description: 'Sobremesas para comer com os olhos.' },
];

const categoryOrder = ['bolos-personalizados', 'bolos-confeitados', 'bolos-caseiros', 'fatias', 'doces', 'tacas', 'bolo-no-pote', 'lanche'];
categories.sort((first, second) => categoryOrder.indexOf(first.id) - categoryOrder.indexOf(second.id));

const pills = root.querySelector('#category-pills');
const gallery = root.querySelector('#gallery-sections');
categories.forEach((category, categoryIndex) => {
  const pill = document.createElement('a');
  pill.href = `#${category.id}`;
  pill.textContent = category.title;
  pills.appendChild(pill);
  const section = document.createElement('section');
  section.className = 'display-section';
  const isShowcase = categoryOrder.includes(category.id);
  if (isShowcase) section.classList.add('confected-showcase');
  section.id = category.id;
  const kicker = isShowcase ? '' : `<div class="section-kicker">${String(categoryIndex + 1).padStart(2, '0')} / vitrine</div>`;
  section.innerHTML = `<div class="section-heading"><div>${kicker}<h2>${category.title}</h2></div><p>${category.description}</p></div><div class="product-grid"></div>${isShowcase ? '<button class="carousel-arrow carousel-arrow-prev" type="button" aria-label="Imagem anterior">←</button><button class="carousel-arrow carousel-arrow-next" type="button" aria-label="Próxima imagem">→</button>' : ''}`;
  const grid = section.querySelector('.product-grid');
  category.files.forEach((file, index) => {
    const figure = document.createElement('figure');
    figure.className = 'product-card';
    const caption = isShowcase ? 'clube do bolo' : category.title;
    figure.innerHTML = `<img src="${category.originalFiles?.includes(file) ? '' : (category.basePath ?? 'optimized/')}${category.folder}/${file}" alt="${category.title} clube do bolo ${index + 1}" loading="lazy" decoding="async"><figcaption>${caption}</figcaption>`;
    grid.appendChild(figure);
  });
  gallery.appendChild(section);
  if (isShowcase) {
    const previous = section.querySelector('.carousel-arrow-prev');
    const next = section.querySelector('.carousel-arrow-next');
    const scrollAmount = () => section.querySelector('.product-card').getBoundingClientRect().width + 18;
    previous.addEventListener('click', () => section.querySelector('.product-grid').scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    next.addEventListener('click', () => section.querySelector('.product-grid').scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    const updateNextArrow = () => {
      const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
      next.disabled = atEnd;
      next.classList.toggle('is-at-end', atEnd);
    };
    let arrowFramePending = false;
    const scheduleArrowUpdate = () => {
      if (arrowFramePending) return;
      arrowFramePending = true;
      requestAnimationFrame(() => {
        updateNextArrow();
        arrowFramePending = false;
      });
    };
    grid.addEventListener('scroll', scheduleArrowUpdate, { passive: true });
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(scheduleArrowUpdate);
      resizeObserver.observe(grid);
      resizeObserver.observe(grid.querySelector('.product-card'));
    } else {
      window.addEventListener('resize', scheduleArrowUpdate);
    }
    scheduleArrowUpdate();
  }
});

const menuButton = root.querySelector('.menu-toggle');
const mobileNav = root.querySelector('.mobile-nav');
function setMenuOpen(open) {
  mobileNav.classList.toggle('open', open);
  mobileNav.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menuButton.addEventListener('click', () => setMenuOpen(!mobileNav.classList.contains('open')));
root.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
    setMenuOpen(false);
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) setMenuOpen(false);
});
window.matchMedia('(max-width: 1100px)').addEventListener('change', () => setMenuOpen(false));

const reviewSection = root.querySelector('#depoimentos');
const reviewButtons = root.querySelectorAll('.quote-dots button');
const reviewSlides = root.querySelectorAll('.quote-slide');
let currentReview = 0;
let reviewTimer;
let reviewsVisible = true;

function showReview(index) {
  currentReview = index;
  reviewSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
  reviewButtons.forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index);
    button.setAttribute('aria-current', String(buttonIndex === index));
  });
}

function stopReviews() {
  clearInterval(reviewTimer);
}

function startReviews() {
  stopReviews();
  if (!reviewsVisible || reviewSlides.length < 2 || document.hidden || reviewSection.matches(':hover') || reviewSection.contains(document.activeElement)) return;
  reviewTimer = setInterval(() => showReview((currentReview + 1) % reviewSlides.length), 6000);
}

reviewButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showReview(index);
    startReviews();
  });
});
if (reviewSection && reviewSlides.length) {
  showReview(0);
  reviewSection.addEventListener('mouseenter', stopReviews);
  reviewSection.addEventListener('mouseleave', startReviews);
  reviewSection.addEventListener('focusin', stopReviews);
  reviewSection.addEventListener('focusout', () => setTimeout(startReviews, 0));
  document.addEventListener('visibilitychange', startReviews);
  startReviews();
}

// Update only the compositor-friendly progress bar, at most once per frame.
const progressBar = root.querySelector('.scroll-progress');
let progressPending = false;
function updateProgress() {
  const distance = root.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
  progressPending = false;
}
window.addEventListener('scroll', () => {
  if (!progressPending) {
    progressPending = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const hero = root.querySelector('.hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroCardImage = root.querySelector('.hero-art-card img');
const heroCardSlides = [
  { src: 'BoloPersonalizado/BoloPersonalizado20.jpeg', alt: 'Bolo personalizado do Flamengo' },
  { src: 'BolosConfeitados/BoloConfeitado17.png', alt: 'Bolo confeitado do clube do bolo' },
  { src: 'optimized/BolosCaseiros/BoloCaseiro1.JPG', alt: 'Bolo caseiro do clube do bolo' },
  { src: 'optimized/FatiasBolo/FatiaBolo3.JPG', alt: 'Fatia de bolo do clube do bolo' },
  { src: 'optimized/Doces/Doce8.JPG', alt: 'Doces do clube do bolo' },
];
let heroCardIndex = 0;
let heroCardLoading = false;
if (heroCardImage) {
  setInterval(async () => {
    if (heroCardLoading || document.hidden || reducedMotion.matches || !heroCardImage.getClientRects().length) return;
    heroCardLoading = true;
    const nextIndex = (heroCardIndex + 1) % heroCardSlides.length;
    const slide = heroCardSlides[nextIndex];
    try {
      const nextImage = new Image();
      nextImage.src = slide.src;
      await nextImage.decode();
      heroCardImage.src = slide.src;
      heroCardImage.alt = slide.alt;
      heroCardIndex = nextIndex;
    } catch {
      // Preserve the current photo if the next image cannot load.
    } finally {
      heroCardLoading = false;
    }
  }, 2000);
}
let backgroundsLoading = false;
async function prepareHeroBackgrounds() {
  if (backgroundsLoading || reducedMotion.matches) return;
  backgroundsLoading = true;
  try {
    // Decode one optimized image at a time without blocking the initial render.
    for (const number of [1, 2, 3]) {
      const photo = new Image();
      photo.decoding = 'async';
      photo.fetchPriority = 'low';
      await new Promise((resolve, reject) => {
        photo.onload = resolve;
        photo.onerror = reject;
        photo.src = `optimized/Diversos/BoloFatiaPote${number}.JPG`;
      });
      if (photo.decode) await photo.decode();
    }
    hero.classList.add('backgrounds-ready');
  } catch {
    // Keep the first background visible if a later image cannot load.
    backgroundsLoading = false;
  }
}
function scheduleHeroBackgrounds() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prepareHeroBackgrounds, { timeout: 1500 });
  } else {
    setTimeout(prepareHeroBackgrounds, 250);
  }
}
if (document.readyState === 'complete') scheduleHeroBackgrounds();
else window.addEventListener('load', scheduleHeroBackgrounds, { once: true });
reducedMotion.addEventListener('change', scheduleHeroBackgrounds);
let heroVisible = true;
function syncVisibility() {
  hero.classList.toggle('animations-paused', !heroVisible || document.hidden);
  if (reviewsVisible && !document.hidden) startReviews();
  else stopReviews();
}
if ('IntersectionObserver' in window) {
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === reviewSection) reviewsVisible = entry.isIntersecting;
    });
    syncVisibility();
  });
  visibilityObserver.observe(hero);
  visibilityObserver.observe(reviewSection);
}
document.addEventListener('visibilitychange', syncVisibility);
