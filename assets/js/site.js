/* Site do ForBarber: links para o sistema, endereço de exemplo, planos e as interações da página */
(function () {
  'use strict';
  const CFG = window.FORBARBER_SITE;
  const app = CFG.appUrl.replace(/\/?$/, '/');
  const host = app.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const team = (n) => (n >= 99 ? 'Barbeiros ilimitados' : n === 1 ? '1 barbeiro' : `Até ${n} barbeiros`);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  /* ---------- Links para o sistema ---------- */
  $$('[data-app]').forEach((a) => { a.href = app + a.dataset.app; });
  $$('[data-host]').forEach((el) => { el.textContent = host; });
  $$('[data-sales]').forEach((a) => {
    a.href = `https://wa.me/${CFG.salesWhatsapp}?text=${encodeURIComponent('Olá! Quero saber mais sobre o ForBarber.')}`;
  });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Planos ---------- */
  const plans = document.getElementById('plans');
  if (plans) {
    plans.innerHTML = CFG.plans.map((p) => {
      const main = p.id === 'equipe';
      const int = Math.floor(p.price).toLocaleString('pt-BR');
      const cents = String(Math.round((p.price % 1) * 100)).padStart(2, '0');
      const per = p.barbers >= 99 ? 'Sem limite de barbeiros na equipe' : p.barbers === 1 ? 'Para quem atende sozinho' : `${money(p.price / p.barbers)} por barbeiro, com ${p.barbers}`;
      return `<article class="plan-card ${main ? 'is-featured' : ''}" data-reveal>
        <div class="stack-sm">
          <h3 class="plan-name">${esc(p.name)}</h3>
          <span class="plan-team"><i class="bi bi-people" aria-hidden="true"></i>${team(p.barbers)}</span>
        </div>
        <div class="plan-price" aria-label="${esc(money(p.price))} por mês"><span class="cur" aria-hidden="true">R$</span><strong aria-hidden="true">${int}</strong><span class="cents" aria-hidden="true">,${cents}<small>/mês</small></span></div>
        <p class="p-plan-per">${esc(per)}</p>
        <a class="btn ${main ? 'btn-primary' : 'btn-outline'} btn-block btn-lg" href="${app}criar.html">Testar 14 dias grátis</a>
      </article>`;
    }).join('');
  }

  /* ---------- Cabeçalho: estado ao rolar, progresso e menu ---------- */
  const header = $('[data-header]');
  const progress = $('[data-progress]');
  const menuBtn = $('[data-menu-toggle]');
  const sheet = $('[data-menu]');
  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.sr-only', menuBtn).textContent = open ? 'Fechar menu' : 'Abrir menu';
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 1000px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Título: a fonte estica e a navalha corta ---------- */
  const title = $('[data-stretch]');
  const cut = $('.p-cut');
  if (cut) {
    cut.insertAdjacentHTML('beforeend', '<svg class="p-blade" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="63.9" x2="100" y2="40.1" pathLength="100"/></svg>');
  }
  const startHero = () => {
    if (root.classList.contains('fonts-ready')) return;
    root.classList.add('fonts-ready');
    setTimeout(() => title && title.classList.add('is-cut'), reduced ? 0 : 1300);
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(startHero);
  setTimeout(startHero, 1600);

  /* ---------- Fundo do hero: folha de agenda com a linha do horário atual ---------- */
  const hours = $('[data-hours]');
  const nowLine = $('[data-now]');
  const nowTime = $('[data-now-time]');
  const pad = (n) => String(n).padStart(2, '0');
  const drawSheet = () => {
    if (!hours) return;
    const row = innerWidth < 700 ? 64 : 88;
    const d = new Date();
    const first = (d.getHours() + 21) % 24; // três horas antes de agora
    hours.innerHTML = Array.from({ length: 22 }, (_, i) => `<div class="p-hour" style="top:${i * row}px;--row:${row}px"><span>${pad((first + i) % 24)}:00</span></div>`).join('');
    nowLine.style.setProperty('--now', `${(3 + d.getMinutes() / 60) * row}px`);
    nowTime.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  drawSheet();
  setInterval(drawSheet, 30000);
  addEventListener('resize', drawSheet);

  /* ---------- Endereço digitando nomes de barbearia ---------- */
  const slugEl = $('[data-slug]');
  if (slugEl && !reduced) {
    const slugs = ['suabarbearia', 'navalha-de-ouro', 'barbearia-do-ze', 'corte-fino', 'dom-bigode'];
    let s = 0;
    let text = slugs[0];
    const type = (target, done) => {
      if (text === target) return done();
      text = target.startsWith(text) ? target.slice(0, text.length + 1) : text.slice(0, -1);
      slugEl.textContent = text;
      setTimeout(() => type(target, done), target.startsWith(text) ? 70 : 35);
    };
    const next = () => setTimeout(() => { s = (s + 1) % slugs.length; type(slugs[s], next); }, 2200);
    next();
  }

  /* ---------- Notificações ao vivo no hero ---------- */
  const toasts = $('[data-toasts]');
  if (toasts) {
    const items = [
      { i: 'calendar2-check', tone: '#dc2f36', t: 'Novo agendamento', s: 'Carlos Silva · Corte · hoje, 15:00' },
      { i: 'arrow-repeat', tone: '#3f6ef0', t: 'Remarcado pelo cliente', s: 'Samuel Vieira · qui, 16:30' },
      { i: 'whatsapp', tone: '#1f9e55', t: 'Lembrete pronto no WhatsApp', s: 'Breno Tavares · Corte + Barba' },
      { i: 'award', tone: '#b7791f', t: 'Carimbo no cartão fidelidade', s: 'Hugo Pacheco · 7 de 10' },
      { i: 'calendar2-check', tone: '#dc2f36', t: 'Novo agendamento', s: 'Wagner Santana · Barba · hoje, 17:00' },
    ];
    let k = 0;
    let visible = true;
    const push = () => {
      const it = items[k++ % items.length];
      const el = document.createElement('div');
      el.className = 'p-toast';
      el.style.setProperty('--tone', it.tone);
      el.innerHTML = `<i class="bi bi-${it.i}"></i><div><b>${it.t}</b><small>${it.s}</small></div>`;
      toasts.appendChild(el);
      const all = $$('.p-toast:not(.is-out)', toasts);
      all.forEach((t, n) => t.classList.toggle('is-old', n < all.length - 1));
      if (all.length > 3) {
        all[0].classList.add('is-out');
        setTimeout(() => all[0].remove(), 500);
      }
    };
    push();
    setTimeout(push, 900);
    if (!reduced) {
      setInterval(() => { if (visible && !document.hidden) push(); }, 2800);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(toasts);
    }
  }

  /* ---------- Faixas: repete o conteúdo até cobrir a tela ---------- */
  $$('[data-marquee]').forEach((track) => {
    const items = Array.from(track.children);
    const setW = track.scrollWidth;
    const bandW = track.parentElement.offsetWidth;
    const n = Math.max(1, Math.ceil(bandW / Math.max(setW, 1)));
    for (let c = 1; c < n * 2; c++) {
      items.forEach((node) => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
    track.style.setProperty('--dur', `${Math.round((track.scrollWidth / 2) / (track.closest('.is-back') ? 55 : 75))}s`);
  });

  /* ---------- Revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  $$('[data-reveal]').forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 90}ms`);
    io.observe(el);
  });

  /* ---------- Capítulos: o palco troca de tela conforme o texto ---------- */
  const chapters = $$('[data-chapter]');
  const frames = $$('[data-frame]');
  const dots = $$('.p-stage-dots span');
  const stageEl = $('[data-stage]');
  const setChapter = (i) => {
    if (stageEl) { stageEl.dataset.active = i; stageEl.dataset.n = `0${i + 1}`; }
    chapters.forEach((c, k) => c.classList.toggle('is-active', k === i));
    frames.forEach((f, k) => { f.classList.toggle('is-active', k === i); f.classList.toggle('is-past', k < i); });
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  setChapter(0);
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setChapter(Number(e.target.dataset.chapter)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  chapters.forEach((c) => cio.observe(c));

  /* ---------- Assinatura do rodapé: ocupa a largura toda da tela ---------- */
  const wordmark = $('.p-wordmark');
  const fitWordmark = () => {
    if (!wordmark) return;
    const ws = wordmark.style.getPropertyValue('--ws');
    wordmark.style.setProperty('--ws', '125%');
    wordmark.style.fontSize = '100px';
    const range = document.createRange();
    range.selectNodeContents(wordmark);
    const w = range.getBoundingClientRect().width;
    wordmark.style.fontSize = `${(100 * (root.clientWidth * 0.96)) / w}px`;
    wordmark.style.setProperty('--ws', ws || '125%');
  };
  fitWordmark();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
  addEventListener('resize', fitWordmark);

  /* ---------- Movimento ligado à rolagem ---------- */
  const stage = $('[data-tilt]');
  const how = $('[data-how]');
  const steps = $$('.p-step');
  const onScroll = () => {
    const y = scrollY;
    const vh = innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    const max = root.scrollHeight - vh;
    progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    if (reduced) return;

    if (stage) {
      const r = stage.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = clamp((vh - r.top) / (vh * 0.8), 0, 1);
        const e = 1 - (1 - p) * (1 - p);
        stage.style.setProperty('--rx', `${((1 - e) * 24).toFixed(2)}deg`);
        stage.style.setProperty('--sc', (0.9 + 0.1 * e).toFixed(4));
      }
    }
    if (how) {
      const r = how.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = clamp((vh * 0.7 - r.top) / (r.height * 0.75), 0, 1);
        how.style.setProperty('--p', p.toFixed(4));
        steps.forEach((s, i) => s.classList.toggle('is-lit', p > (i + 0.6) / steps.length));
      }
    }
    if (wordmark) {
      const r = wordmark.getBoundingClientRect();
      if (r.top < vh) {
        const p = clamp((vh - r.top) / (r.height * 1.6), 0, 1);
        wordmark.style.setProperty('--ws', `${(62 + 63 * (1 - (1 - p) ** 3)).toFixed(1)}%`);
      }
    }
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Toques finos para mouse: paralaxe e botões magnéticos ---------- */
  if (finePointer && !reduced) {
    const hero = $('.p-hero');
    if (hero && stage) {
      hero.addEventListener('pointermove', (e) => {
        stage.style.setProperty('--mx', ((e.clientX / innerWidth) - 0.5).toFixed(3) * 2);
        stage.style.setProperty('--my', ((e.clientY / innerHeight) - 0.5).toFixed(3) * 2);
      });
    }
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const yy = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = `translate(${(x * 12).toFixed(1)}px, ${(yy * 10).toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ==========================================================================
     EXPERIMENTE: o celular de demonstração
     Horários ocupados são sorteados (sempre iguais para o mesmo dia) e um
     horário marcado aqui some da lista, como no sistema de verdade.
     ========================================================================== */
  const mock = $('[data-mock]');
  if (!mock) return;

  const SERVICES = [
    { name: 'Corte', min: 30, price: 40 },
    { name: 'Barba', min: 30, price: 30 },
    { name: 'Corte + Barba', min: 60, price: 60 },
  ];
  const BARBERS = [
    { id: 'any', name: 'o primeiro disponível', short: 'Qualquer', ini: '<i class="bi bi-shuffle"></i>' },
    { id: 'ze', name: 'Zé Carlos', short: 'Zé', ini: 'ZC', av: '#3f6ef0' },
    { id: 'ra', name: 'Rodrigo Alves', short: 'Rodrigo', ini: 'RA', av: '#e0592a' },
    { id: 'ml', name: 'Mateus Lima', short: 'Mateus', ini: 'ML', av: '#1f9e55' },
  ];
  const OPEN = 9;
  const SLOTS = 20; // 09:00 às 18:30, de 30 em 30 minutos
  const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const WD_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const time = (i) => `${pad(OPEN + Math.floor(i / 2))}:${i % 2 ? '30' : '00'}`;
  const dur = (m) => (m >= 60 ? `${m / 60}h` : `${m} min`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 6 }, (_, k) => {
    const d = new Date(today);
    d.setDate(d.getDate() + k);
    return { date: d, key: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, closed: d.getDay() === 0, today: k === 0 };
  });

  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const busyCache = new Map();
  const booked = new Set();
  const busy = (day, b) => {
    const k = `${day.key}|${b}`;
    if (!busyCache.has(k)) {
      const r = rng(hash(k));
      busyCache.set(k, Array.from({ length: SLOTS }, () => r() < 0.52));
    }
    return busyCache.get(k);
  };
  const firstIndex = (day) => {
    if (!day.today) return 0;
    const n = new Date();
    return Math.max(0, Math.ceil((n.getHours() * 60 + n.getMinutes() + 30 - OPEN * 60) / 30));
  };
  const freeFor = (day, b, i, len) => {
    if (i < firstIndex(day) || i + len > SLOTS) return false;
    for (let j = i; j < i + len; j++) if (busy(day, b)[j] || booked.has(`${day.key}|${b}|${j}`)) return false;
    return true;
  };
  // Para "qualquer um", vale o primeiro barbeiro livre naquele horário
  const who = (day, barber, i, len) => {
    if (day.closed) return null;
    if (barber.id !== 'any') return freeFor(day, barber.id, i, len) ? barber : null;
    return BARBERS.slice(1).find((b) => freeFor(day, b.id, i, len)) || null;
  };

  const st = { svc: 0, barber: 0, day: 0, slot: null, shop: 'Barbearia do Zé' };
  const len = () => SERVICES[st.svc].min / 30;
  const starts = (day) => Array.from({ length: SLOTS }, (_, i) => i).filter((i) => who(day, BARBERS[st.barber], i, len()));

  const el = {
    services: $('[data-mock-services]'),
    barbers: $('[data-mock-barbers]'),
    days: $('[data-mock-days]'),
    slots: $('[data-mock-slots]'),
    free: $('[data-mock-free]'),
    sum: $('[data-mock-sum]'),
    confirm: $('[data-mock-confirm]'),
    done: $('[data-mock-done]'),
    doneText: $('[data-mock-done-text]'),
    again: $('[data-mock-again]'),
    body: $('[data-mock-body]'),
  };

  const renderServices = () => {
    el.services.innerHTML = SERVICES.map((s, i) => `<button type="button" class="p-mock-svc" data-i="${i}" aria-pressed="${i === st.svc}"><b>${s.name}</b><small>${dur(s.min)}</small><span>${money(s.price)}</span></button>`).join('');
  };
  const renderBarbers = () => {
    el.barbers.innerHTML = BARBERS.map((b, i) => `<button type="button" class="p-mock-barber" data-i="${i}" aria-pressed="${i === st.barber}" aria-label="${b.id === 'any' ? 'Primeiro disponível' : b.name}"><span style="${b.av ? `--av:${b.av}` : ''}">${b.ini}</span>${b.short}</button>`).join('');
  };
  const renderDays = () => {
    el.days.innerHTML = days.map((d, i) => {
      const free = d.closed ? 0 : starts(d).length;
      const top = d.today ? 'hoje' : WD[d.date.getDay()];
      const note = d.closed ? 'fechado' : free ? `${free} livres` : 'lotado';
      const label = `${WD_LONG[d.date.getDay()]}, ${d.date.getDate()} de ${MONTHS[d.date.getMonth()]}: ${note}`;
      return `<button type="button" class="p-mock-day" data-i="${i}" aria-pressed="${i === st.day}" aria-label="${label}" ${free ? '' : 'disabled'}>${top}<b>${d.date.getDate()}</b><small>${note}</small></button>`;
    }).join('');
  };
  const renderSlots = (gone) => {
    const day = days[st.day];
    const open = new Set(starts(day));
    const from = firstIndex(day);
    const list = Array.from({ length: SLOTS - from }, (_, k) => k + from);
    el.slots.innerHTML = list.length
      ? list.map((i) => `<button type="button" class="p-mock-slot${gone === i && !open.has(i) ? ' is-gone' : ''}" data-i="${i}" aria-pressed="${i === st.slot}" ${open.has(i) ? '' : 'disabled'}>${time(i)}</button>`).join('')
      : '<p class="p-mock-empty">Sem horários hoje. Escolha outro dia.</p>';
    el.free.textContent = open.size ? `${open.size} livres` : '';
  };
  const renderSum = () => {
    const s = SERVICES[st.svc];
    const day = days[st.day];
    let text = `<b>${s.name}</b> · ${dur(s.min)} · ${money(s.price)}`;
    if (st.slot != null) text += ` · ${day.today ? 'hoje' : WD[day.date.getDay()]} ${time(st.slot)}`;
    el.sum.innerHTML = text;
    el.confirm.disabled = st.slot == null;
    el.confirm.textContent = st.slot == null ? 'Escolha um horário' : `Confirmar ${time(st.slot)}`;
  };
  const pickDay = () => {
    if (days[st.day].closed || !starts(days[st.day]).length) {
      const i = days.findIndex((d) => !d.closed && starts(d).length);
      st.day = i < 0 ? 0 : i;
    }
  };
  const render = (gone) => {
    pickDay();
    if (st.slot != null && !starts(days[st.day]).includes(st.slot)) st.slot = null;
    renderServices();
    renderBarbers();
    renderDays();
    renderSlots(gone);
    renderSum();
  };

  const keepFocus = (group, i) => { const b = $(`[data-i="${i}"]`, group); if (b && !b.disabled) b.focus(); };
  el.services.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    st.svc = Number(b.dataset.i); render(); keepFocus(el.services, st.svc);
  });
  el.barbers.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    st.barber = Number(b.dataset.i); render(); keepFocus(el.barbers, st.barber);
  });
  el.days.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    st.day = Number(b.dataset.i); st.slot = null; render(); keepFocus(el.days, st.day);
  });
  el.slots.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const i = Number(b.dataset.i);
    st.slot = st.slot === i ? null : i;
    renderSlots(); renderSum(); keepFocus(el.slots, i);
  });
  el.confirm.addEventListener('click', () => {
    if (st.slot == null) return;
    const day = days[st.day];
    const s = SERVICES[st.svc];
    const b = who(day, BARBERS[st.barber], st.slot, len());
    if (!b) return render();
    for (let j = st.slot; j < st.slot + len(); j++) booked.add(`${day.key}|${b.id}|${j}`);
    el.doneText.innerHTML = `<b>${WD_LONG[day.date.getDay()]}, ${day.date.getDate()} de ${MONTHS[day.date.getMonth()]}, às ${time(st.slot)}</b><br>${esc(s.name)} com ${esc(b.name)}. Te esperamos na ${esc(st.shop)}.`;
    el.done.hidden = false;
    el.again.focus({ preventScroll: true });
  });
  el.again.addEventListener('click', () => {
    const gone = st.slot;
    st.slot = null;
    el.done.hidden = true;
    render(gone);
    const g = $(`[data-i="${gone}"]`, el.slots);
    if (g) g.scrollIntoView({ block: 'nearest' });
    el.confirm.focus({ preventScroll: true });
  });

  /* Nome e cor da barbearia */
  const nameIn = $('[data-try-name]');
  const STOP = new Set(['da', 'de', 'do', 'das', 'dos', 'e', 'a', 'o']);
  const initials = (name) => {
    const words = name.split(/\s+/).filter((w) => w && !STOP.has(w.toLowerCase()));
    return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || 'B').slice(0, 2)).toUpperCase();
  };
  const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const applyName = () => {
    const name = nameIn.value.trim() || 'Sua Barbearia';
    st.shop = name;
    $$('[data-mock-name]').forEach((n) => { n.textContent = name; });
    $$('[data-mock-initials]').forEach((n) => { n.textContent = initials(name); });
    $$('[data-try-slug]').forEach((n) => { n.textContent = slugify(name) || 'sua-barbearia'; });
    $$('[data-try-label]').forEach((n) => { n.textContent = `“${name}”`; });
  };
  const lum = (hex) => {
    const c = hex.replace('#', '').match(/../g).map((x) => {
      const v = parseInt(x, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const applyColor = (hex) => {
    const L = lum(hex);
    const ink = (L + 0.05) / 0.0563 >= 1.05 / (L + 0.05) ? '#14110d' : '#ffffff';
    [mock, document.body].forEach((n) => { n.style.setProperty('--shop', hex); n.style.setProperty('--shop-ink', ink); });
  };
  nameIn.addEventListener('input', applyName);
  $('[data-try-colors]').addEventListener('change', (e) => { if (e.target.name === 'cor') applyColor(e.target.value); });

  applyName();
  applyColor($('[data-try-colors] input:checked').value);
  render();
})();
