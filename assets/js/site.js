/* Site do ForBarber: links para o sistema, endereço de exemplo, planos, menu e o fade ao rolar */
(function () {
  'use strict';
  const CFG = window.FORBARBER_SITE;
  const app = CFG.appUrl.replace(/\/?$/, '/');
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const team = (n) => (n >= 99 ? 'Barbeiros ilimitados' : n === 1 ? '1 barbeiro' : `Até ${n} barbeiros`);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  $$('[data-app]').forEach((a) => { a.href = app + a.dataset.app; });
  $$('[data-host]').forEach((el) => { el.textContent = app.replace(/^https?:\/\//, '').replace(/\/$/, ''); });
  $$('[data-sales]').forEach((a) => {
    a.href = `https://wa.me/${CFG.salesWhatsapp}?text=${encodeURIComponent('Olá! Quero saber mais sobre o ForBarber.')}`;
  });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Planos */
  const plans = document.getElementById('plans');
  if (plans) {
    plans.innerHTML = CFG.plans.map((p) => {
      const main = p.id === 'equipe';
      const per = p.barbers >= 99 ? 'Sem limite de barbeiros' : p.barbers === 1 ? 'Para quem atende sozinho' : `${money(p.price / p.barbers)} por barbeiro`;
      return `<article class="plan-card ${main ? 'is-featured' : ''}" data-reveal>
        <h3 class="plan-name">${esc(p.name)}</h3>
        <span class="plan-team">${team(p.barbers)}</span>
        <div class="plan-price"><strong>${money(p.price)}</strong><span>/mês</span></div>
        <p class="p-plan-per">${esc(per)}</p>
        <a class="btn ${main ? 'btn-primary' : 'btn-quiet'} btn-block" href="${app}criar.html">Testar 14 dias grátis</a>
      </article>`;
    }).join('');
  }

  /* Cabeçalho: fundo ao rolar e menu do celular */
  const header = document.querySelector('[data-header]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const sheet = document.querySelector('[data-menu]');
  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Fade ao rolar */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
    el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 4) * 80}ms`;
    io.observe(el);
  });
})();
