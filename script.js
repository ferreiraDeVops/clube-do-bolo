const root = document;

const ownerCarousel = root.querySelector('.owner-carousel');
if (ownerCarousel) {
  const photos = ownerCarousel.querySelectorAll('img');
  let photoIndex = 0;
  const changePhoto = (step) => {
    photoIndex = (photoIndex + step + photos.length) % photos.length;
    photos.forEach((photo, index) => { photo.hidden = index !== photoIndex; });
  };
  ownerCarousel.querySelector('.owner-prev').addEventListener('click', () => changePhoto(-1));
  ownerCarousel.querySelector('.owner-next').addEventListener('click', () => changePhoto(1));
}

const categories = [
  { id: 'bolo-no-pote', title: 'Bolo no pote', folder: 'BoloNoPote', prefix: 'BoloNoPote', files: ['BoloNoPote1.JPG', 'BoloNoPote2.JPG', 'BoloNoPote3.JPG', 'BoloNoPote4.jpg', 'BoloNoPote5.JPG'], description: 'Camadas de carinho para levar com você.' },
  { id: 'bolos-caseiros', title: 'Bolos caseiros', folder: 'BolosCaseiros', prefix: 'BoloCaseiro', files: ['BoloCaseiro1.JPG', 'BoloCaseiro2.JPG', 'BoloCaseiro3.JPG', 'BoloCaseiro4.JPG', 'BoloCaseiro5.JPG', 'BoloCaseiro6.JPG', 'BoloCaseiro7.JPG', 'BoloCaseiro8.JPG', 'BoloCaseiro9.JPG', 'BoloCaseiro10.JPG', 'BoloCaseiro11.JPG', 'BoloCaseiro12.JPG', 'BoloCaseiro13.JPG', 'BoloCaseiro14.JPG', 'BoloCaseiro15.JPG'], description: 'Receitas que perfumam a casa inteira.' },
  { id: 'bolos-confeitados', title: 'Bolos confeitados', folder: 'BolosConfeitados', prefix: 'BoloConfeitado', files: ['BoloConfeitado1.JPG', 'BoloConfeitado2.JPG', 'BoloConfeitado3.JPG', 'BoloConfeitado4.JPG', 'BoloConfeitado5.JPG', 'BoloConfeitado6.JPG', 'BoloConfeitado7.JPG', 'BoloConfeitado8.JPG', 'BoloConfeitado9.JPG', 'BoloConfeitado10.jpg', 'BoloConfeitado11.jpg', 'BoloConfeitado12.jpg', 'BoloConfeitado13.jpg', 'BoloConfeitado14.JPG', 'BoloConfeitado15.JPG', 'BoloConfeitado16.jpg', 'BoloConfeitado17.jpg'], description: 'Para celebrar em grande estilo.' },
  { id: 'fatias', title: 'Fatias de bolo', folder: 'FatiasBolo', files: ['FatiaBolo1.JPG', 'FatiaBolo2.JPG', 'FatiaBolo3.JPG', 'FatiaBolo4.JPG', 'FatiaBolo6.JPG', 'FatiaBolo7.jpg'], description: 'Uma pausa doce no meio do dia.' },
  { id: 'lanche', title: 'Lanche da tarde', folder: 'LancheTarde', files: ['LancheTarde1.JPG', 'LancheTarde2.JPG', 'LancheTarde3.JPG', 'LancheTarde4.JPG', 'LancheTarde5.JPG'], description: 'Café passado e mesa cheia.' },
  { id: 'doces', title: 'Doces', folder: 'Doces', files: ['Doce1.JPG', 'Doce2.JPG', 'Doce3.JPG', 'Doce4.JPG', 'Doce5.JPG', 'Doce6.JPG', 'Doce7.JPG', 'Doce8.JPG', 'Doce9.jpg', 'Doce10.jpg', 'Doce11.jpg', 'Doce12.jpg', 'Doce13.JPG', 'Doce14.JPG', 'Doce15.jpg', 'Doce16.JPG'], description: 'Pequenos detalhes, grandes suspiros.' },
  { id: 'tacas', title: 'Taças', folder: 'Taças', files: ['Taca1.JPG', 'Taça1.JPG', 'Taça2.JPG', 'Taça3.JPG', 'Taça4.JPG', 'Taça5.JPG', 'Taça6.JPG', 'Taça7.JPG'], description: 'Sobremesas para comer com os olhos.' },
];

const categoryOrder = ['bolos-confeitados', 'bolos-caseiros', 'fatias', 'doces', 'tacas', 'bolo-no-pote', 'lanche'];
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
  const isShowcase = ['bolos-confeitados', 'bolos-caseiros', 'fatias', 'doces', 'tacas', 'bolo-no-pote', 'lanche'].includes(category.id);
  if (isShowcase) section.classList.add('confected-showcase');
  section.id = category.id;
  const kicker = isShowcase ? '' : `<div class="section-kicker">${String(categoryIndex + 1).padStart(2, '0')} / vitrine</div>`;
  section.innerHTML = `<div class="section-heading"><div>${kicker}<h2>${category.title}</h2></div><p>${category.description}</p></div><div class="product-grid"></div>${isShowcase ? '<button class="carousel-arrow carousel-arrow-prev" type="button" aria-label="Imagem anterior">←</button><button class="carousel-arrow carousel-arrow-next" type="button" aria-label="Próxima imagem">→</button>' : ''}`;
  const grid = section.querySelector('.product-grid');
  category.files.forEach((file, index) => {
    const figure = document.createElement('figure');
    figure.className = 'product-card';
    const caption = isShowcase ? 'Bom bolo' : category.title;
    figure.innerHTML = `<img src="${category.folder}/${file}" alt="${category.title} Bom bolo ${index + 1}" loading="lazy"><figcaption>${caption}</figcaption>`;
    grid.appendChild(figure);
  });
  gallery.appendChild(section);
  if (isShowcase) {
    const previous = section.querySelector('.carousel-arrow-prev');
    const next = section.querySelector('.carousel-arrow-next');
    const scrollAmount = () => section.querySelector('.product-card').getBoundingClientRect().width + 18;
    previous.addEventListener('click', () => section.querySelector('.product-grid').scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    next.addEventListener('click', () => section.querySelector('.product-grid').scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }
});

const menuButton = root.querySelector('.menu-toggle');
const mobileNav = root.querySelector('.mobile-nav');
menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
root.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => mobileNav.classList.remove('open')));

const reviewSection = root.querySelector('#depoimentos');
const reviewButtons = root.querySelectorAll('.quote-dots button');
const reviewSlides = root.querySelectorAll('.quote-slide');
let currentReview = 0;
let reviewTimer;

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
  if (reviewSlides.length < 2 || document.hidden || reviewSection.matches(':hover') || reviewSection.contains(document.activeElement)) return;
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

// Start without waiting for images or the map.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupGsapAnimations, { once: true });
} else {
  setupGsapAnimations();
}
window.addEventListener('load', () => {
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
}, { once: true });
function setupGsapAnimations() {
  if (!window.gsap) return;
  const { gsap } = window;
  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  gsap.from('.site-header', { y: -24, opacity: 0, duration: .7, delay: .35 });
  gsap.from('.hero-copy > *, .hero-actions', { y: 30, opacity: 0, stagger: .1, delay: .4 });
  gsap.from('.hero-art', { scale: 1.08, opacity: 0, duration: 1.1, delay: .3 });
  if (!ScrollTrigger) return;
  gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .25 } });
  gsap.to('.site-header', { y: -4, boxShadow: '0 14px 42px rgba(55,27,12,.18)', scrollTrigger: { trigger: document.documentElement, start: '120 top', end: '260 top', scrub: .35 } });
  gsap.to('.hero-copy', { yPercent: -12, opacity: .45, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  gsap.utils.toArray('.button, .fab').forEach((button) => { button.addEventListener('mouseenter', () => gsap.to(button, { scale: 1.05, duration: .2 })); button.addEventListener('mouseleave', () => gsap.to(button, { scale: 1, duration: .2 })); });
  ScrollTrigger.refresh();
}
