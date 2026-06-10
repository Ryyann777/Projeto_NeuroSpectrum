/* ================ NeuroSpectrum — app.js ================ */

// 1) Toggle de senha (login)
document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.querySelector(btn.dataset.togglePassword);
    if (!input) return;
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    btn.querySelector('.eye-on')?.classList.toggle('hidden', !isPwd);
    btn.querySelector('.eye-off')?.classList.toggle('hidden', isPwd);
  });
});

// 2) Navegação por botões com data-goto="pagina.html"
document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener('click', (e) => {
    if (el.tagName === 'A') return; // links já navegam
    e.preventDefault();
    window.location.href = el.dataset.goto;
  });
});

// 3) Marca o link ativo da sidebar conforme o arquivo atual
(function highlightSidebar() {
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href === file) a.classList.add('active');
  });
})();

// 4) Submissão de formulários de exemplo (sem backend) → redireciona
document.querySelectorAll('form[data-redirect]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = form.dataset.redirect;
  });
});

// 5) Tabs (Dia / Semana / Mês) — visual apenas
document.querySelectorAll('[data-tabs]').forEach((group) => {
  group.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

// 6) Calendário (mês inteiro, 42 células)
function renderCalendar(containerId, year, month) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const dows = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  el.innerHTML = dows.map((d) => `<div class="dow">${d}</div>`).join('');

  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: prevDays - i, out: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, out: false });
  while (cells.length < 42) cells.push({ day: cells.length - daysInMonth - startOffset + 1, out: true });

  cells.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'cell' + (c.out ? ' out' : '');
    div.textContent = c.day;
    el.appendChild(div);
  });

  const label = document.getElementById(containerId + '-label');
  if (label) {
    label.textContent = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
}

// Estado do calendário da página de consultas
window.__cal = { year: 2026, month: 4 }; // Maio/2026
if (document.getElementById('calendar')) {
  renderCalendar('calendar', window.__cal.year, window.__cal.month);
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    let { year, month } = window.__cal;
    month--; if (month < 0) { month = 11; year--; }
    window.__cal = { year, month };
    renderCalendar('calendar', year, month);
  });
  document.getElementById('cal-next')?.addEventListener('click', () => {
    let { year, month } = window.__cal;
    month++; if (month > 11) { month = 0; year++; }
    window.__cal = { year, month };
    renderCalendar('calendar', year, month);
  });
}
