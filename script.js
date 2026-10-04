const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

function setMenuState(open) {
  menu?.classList.toggle('open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

menuButton?.addEventListener('click', () => {
  setMenuState(!menu?.classList.contains('open'));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    setMenuState(false);
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.classList.contains('open')) {
    setMenuState(false);
    menuButton?.focus();
  }
});

document.addEventListener('click', event => {
  if (menu?.classList.contains('open') && !menu.contains(event.target) && !menuButton?.contains(event.target)) {
    setMenuState(false);
  }
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

const heroVideo = document.querySelector('.hero-background');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasDataSaver = navigator.connection?.saveData === true;
const canUseBackgroundVideo = window.matchMedia('(min-width: 981px)').matches && !prefersReducedMotion && !hasDataSaver;

if (heroVideo && canUseBackgroundVideo) {
  const sources = heroVideo.querySelectorAll('source[data-src]');
  if (sources.length) {
    sources.forEach(source => {
      source.src = source.dataset.src;
    });
    heroVideo.load();
    heroVideo.play().catch(() => {
      // O poster permanece visível quando o navegador bloqueia a reprodução automática.
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      heroVideo.pause();
    } else {
      heroVideo.play().catch(() => {});
    }
  });
}

document.querySelectorAll('[data-cta]').forEach(link => {
  link.addEventListener('click', () => {
    const cta = link.dataset.cta;
    window.dispatchEvent(new CustomEvent('cola-aqui:cta-click', { detail: { cta } }));

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'cta',
        event_label: cta,
        transport_type: 'beacon'
      });
    }
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
