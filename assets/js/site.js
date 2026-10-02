/* Site do ForBarber: links para o sistema, endereço de exemplo e planos */
(function () {
  'use strict';
  const CFG = window.FORBARBER_SITE;
  const app = CFG.appUrl.replace(/\/?$/, '/');
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const team = (n) => (n >= 99 ? 'Barbeiros ilimitados' : n === 1 ? '1 barbeiro' : `Até ${n} barbeiros`);

  document.querySelectorAll('[data-app]').forEach((a) => { a.href = app + a.dataset.app; });
  document.querySelectorAll('[data-host]').forEach((el) => { el.textContent = app.replace(/^https?:\/\//, '').replace(/\/$/, ''); });
  document.querySelectorAll('[data-sales]').forEach((a) => {
    a.href = `https://wa.me/${CFG.salesWhatsapp}?text=${encodeURIComponent('Olá! Quero saber mais sobre o ForBarber.')}`;
  });

  const plans = document.getElementById('plans');
  if (plans) {
    plans.innerHTML = CFG.plans.map((p) => {
      const main = p.id === 'equipe';
      return `<article class="plan-card ${main ? 'is-featured' : ''}">
        <div class="stack-sm">
          <h3 class="plan-name">${esc(p.name)}</h3>
          <span class="plan-team"><i class="bi bi-people"></i>${team(p.barbers)}</span>
        </div>
        <div class="plan-price"><strong>${money(p.price)}</strong><span>/mês</span></div>
        <a class="btn ${main ? 'btn-primary' : 'btn-outline'} btn-block" href="${app}criar.html">Testar 14 dias grátis</a>
      </article>`;
    }).join('');
  }
})();
