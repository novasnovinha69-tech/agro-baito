/* ==========================================================
   HIGH LINE ESTÉTICA AUTOMOTIVA — SCRIPT
   - Menu mobile, header scroll, scrollspy
   - Máscara de telefone
   - Painel de disponibilidade ao vivo (horários ocupados)
   - Validações (datas passadas + horário no dia atual + ocupados)
   - Pré-seleção de serviço via cards
   - Envio WhatsApp + redirecionamento p/ página de confirmação
   ========================================================== */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5547999661257';
  const HORARIOS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];

  /* ---------- DETECTA SE BACKEND ESTÁ CONFIGURADO ---------- */
  const SUPA_URL = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
  const SUPA_KEY = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || '';
  const USE_BACKEND = SUPA_URL && SUPA_KEY;
  const SUPA_HEADERS = USE_BACKEND ? {
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + SUPA_KEY,
    'Content-Type': 'application/json'
  } : {};

  // Horários ocupados (vindo do backend ou do arquivo manual)
  let OCUPADOS = (window.HORARIOS_OCUPADOS || []).map(s => s.trim());

  /* ---------- CARREGA HORÁRIOS OCUPADOS DO BACKEND ---------- */
  async function carregarOcupados() {
    if (!USE_BACKEND) return;
    try {
      const hoje = todayISO();
      const r = await fetch(`${SUPA_URL}/rest/v1/agendamentos?select=data,horario&status=neq.cancelado&data=gte.${hoje}`, {
        headers: SUPA_HEADERS
      });
      const arr = await r.json();
      if (Array.isArray(arr)) {
        OCUPADOS = arr.map(a => `${a.data} ${a.horario}`);
      }
    } catch (e) { console.warn('Erro ao carregar ocupados:', e); }
  }

  /* ---------- SALVA AGENDAMENTO NO BACKEND ---------- */
  async function salvarAgendamento(data) {
    if (!USE_BACKEND) {
      // Modo local: salva no localStorage (painel admin só neste navegador)
      const KEY = 'highline_agendamentos';
      const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      arr.push({ ...data, status: 'pendente', criadoEm: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(arr));
      return true;
    }
    // Modo backend: salva no Supabase (todos veem)
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/agendamentos`, {
        method: 'POST',
        headers: { ...SUPA_HEADERS, 'Prefer': 'return=representation' },
        body: JSON.stringify({
          nome: data.nome,
          telefone: data.telefone,
          veiculo: data.veiculo,
          servico: data.servico,
          preco: data.preco,
          data: data.data,
          horario: data.horario,
          observacoes: data.obs,
          status: 'pendente'
        })
      });
      if (!r.ok) {
        const err = await r.json();
        // Se já existe (constraint unique), sinaliza
        if (err.code === '23505') return { erro: 'Este horário acabou de ser reservado. Escolha outro.' };
        throw new Error('Falha ao salvar');
      }
      return true;
    } catch (e) {
      console.error('Erro ao salvar agendamento:', e);
      return { erro: 'Não foi possível registrar. Tente novamente.' };
    }
  }

  function isOcupado(dataISO, horario) {
    return OCUPADOS.includes(`${dataISO} ${horario}`);
  }

  /* ---------- HEADER SCROLL ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MENU MOBILE ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const openMenu = () => { nav.classList.add('open'); navToggle.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
  const closeMenu = () => { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
  navToggle.addEventListener('click', openMenu);
  navClose.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- HELPERS DE DATA ---------- */
  const dataInput = document.getElementById('data');
  const todayISO = () => {
    const d = new Date();
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().split('T')[0];
  };
  if (dataInput) dataInput.min = todayISO();

  /* ---------- MÁSCARA TELEFONE BR ---------- */
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10)      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      else if (v.length > 6)  v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 2)  v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
      else if (v.length > 0)  v = v.replace(/^(\d{0,2}).*/, '($1');
      e.target.value = v;
    });
  }

  /* ==========================================================
     PAINEL DE DISPONIBILIDADE
     ========================================================== */
  const availGrid = document.getElementById('availGrid');
  const availDateLabel = document.getElementById('availDateLabel');
  const horarioSelect = document.getElementById('horario');

  function formatarDataExtenso(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    return `${dias[dt.getDay()]}, ${d} de ${meses[m-1]} de ${y}`;
  }

  function renderPainel(dataISO) {
    if (!availGrid) return;
    availGrid.innerHTML = '';

    if (!dataISO) {
      availDateLabel.textContent = 'Selecione uma data no formulário abaixo';
      availGrid.innerHTML = '<p class="availability__empty"><i class="fa-regular fa-calendar"></i> Escolha uma data para ver os horários</p>';
      return;
    }

    availDateLabel.textContent = formatarDataExtenso(dataISO);

    const isHoje = dataISO === todayISO();
    const horaAtual = new Date().getHours();

    HORARIOS.forEach(h => {
      const horaNum = parseInt(h.split(':')[0], 10);
      const passado = isHoje && horaNum <= horaAtual;
      const ocupado = isOcupado(dataISO, h);

      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'slot' + (passado ? ' slot--past' : ocupado ? ' slot--busy' : ' slot--free');
      slot.innerHTML = `
        <span class="slot__time">${h}</span>
        <span class="slot__status">
          ${passado ? 'Indisponível' : ocupado ? 'Ocupado' : 'Livre'}
        </span>
      `;
      slot.setAttribute('data-horario', h);

      if (!passado && !ocupado) {
        // Clicável: preenche o select e rola o formulário
        slot.addEventListener('click', () => {
          if (horarioSelect) {
            horarioSelect.value = h;
            horarioSelect.dispatchEvent(new Event('change'));
            document.getElementById('nome').focus();
          }
        });
      } else {
        slot.disabled = true;
      }

      availGrid.appendChild(slot);
    });
  }

  // Render inicial + carrega ocupados do backend
  renderPainel('');
  carregarOcupados().then(() => {
    atualizarSelectHorarios();
    if (dataInput.value) renderPainel(dataInput.value);
  });

  // Quando muda a data, atualiza painel + select
  if (dataInput) {
    dataInput.addEventListener('change', () => {
      renderPainel(dataInput.value);
      atualizarSelectHorarios();
      validateField('horario');
    });
  }

  /* ---------- ATUALIZAR SELECT DE HORÁRIOS (desabilita ocupados/passados) ---------- */
  function atualizarSelectHorarios() {
    if (!horarioSelect || !dataInput) return;
    const dataISO = dataInput.value;
    const isHoje = dataISO === todayISO();
    const horaAtual = new Date().getHours();
    const valorAtual = horarioSelect.value;

    let valorAtualValido = false;

    Array.from(horarioSelect.options).forEach(opt => {
      if (!opt.value) return; // placeholder
      const h = parseInt(opt.value.split(':')[0], 10);
      const passado = isHoje && h <= horaAtual;
      const ocupado = isOcupado(dataISO, opt.value);
      const indisponivel = passado || ocupado;

      opt.disabled = indisponivel;
      opt.textContent = opt.value + (ocupado ? ' (ocupado)' : passado ? ' (passado)' : '');

      if (opt.value === valorAtual && indisponivel) {
        valorAtualValido = false;
      } else if (opt.value === valorAtual) {
        valorAtualValido = true;
      }
    });

    if (!valorAtualValido) horarioSelect.value = '';
  }
  atualizarSelectHorarios();

  /* ---------- PRÉ-SELEÇÃO DE SERVIÇO (cards) ---------- */
  const servicoSelect = document.getElementById('servico');
  function preSelectService(name) {
    if (!servicoSelect) return;
    for (const opt of servicoSelect.options) {
      if (opt.value === name) { opt.selected = true; break; }
    }
  }
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', function () {
      preSelectService(this.getAttribute('data-service'));
      document.getElementById('agendar').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- VALIDAÇÃO ---------- */
  const form = document.getElementById('bookingForm');
  const fields = ['nome','telefone','veiculo','servico','data','horario'];

  function setError(field, msg) {
    const el = document.getElementById(field);
    const err = document.querySelector(`[data-error="${field}"]`);
    if (msg) { el.classList.add('invalid'); if (err) err.textContent = msg; }
    else { el.classList.remove('invalid'); if (err) err.textContent = ''; }
  }

  function validateField(field) {
    const el = document.getElementById(field);
    const val = (el.value || '').trim();
    if (!val) { setError(field, 'Campo obrigatório'); return false; }
    if (field === 'telefone' && val.replace(/\D/g, '').length < 10) {
      setError(field, 'WhatsApp inválido'); return false;
    }
    if (field === 'data') {
      const today = new Date(); today.setHours(0,0,0,0);
      const chosen = new Date(val + 'T00:00:00');
      if (chosen < today) { setError(field, 'Escolha uma data futura'); return false; }
    }
    if (field === 'horario') {
      const dataISO = document.getElementById('data').value;
      const isHoje = dataISO === todayISO();
      if (isHoje && val) {
        const h = parseInt(val.split(':')[0], 10);
        const horaAtual = new Date().getHours();
        if (h <= horaAtual) { setError(field, 'Horário já passado para hoje'); return false; }
      }
      if (dataISO && isOcupado(dataISO, val)) {
        setError(field, 'Este horário já está reservado. Escolha outro.'); return false;
      }
    }
    setError(field, '');
    return true;
  }

  fields.forEach(f => {
    const el = document.getElementById(f);
    if (!el) return;
    el.addEventListener('blur', () => validateField(f));
    el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateField(f); });
    el.addEventListener('change', () => { if (el.classList.contains('invalid')) validateField(f); });
  });

  /* ---------- FORMATADORES ---------- */
  function formatarDataBR(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }
  function getServicoPreco() {
    const sel = servicoSelect.options[servicoSelect.selectedIndex];
    return sel ? sel.getAttribute('data-price') : '';
  }

  /* ---------- MENSAGEM WHATSAPP ---------- */
  function buildWhatsAppMessage(d) {
    return `NOVO AGENDAMENTO - High Line Estética Automotiva
👤 Nome: ${d.nome}
📱 WhatsApp do cliente: ${d.telefone}
🚗 Veículo: ${d.veiculo}
🛠️ Serviço: ${d.servico} - R$ ${d.preco}
📅 Data: ${formatarDataBR(d.data)}
⏰ Horário: ${d.horario}
📝 Observações: ${d.obs || '—'}
Responda CONFIRMADO para confirmar o agendamento.`;
  }

  /* ---------- SUBMIT ---------- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    atualizarSelectHorarios();

    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Botão mostra "Agendando..." enquanto salva
    const btn = form.querySelector('button[type="submit"]');
    const btnOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Agendando...';

    const data = {
      nome: document.getElementById('nome').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      veiculo: document.getElementById('veiculo').value.trim(),
      servico: servicoSelect.value,
      preco: getServicoPreco(),
      data: document.getElementById('data').value,
      horario: document.getElementById('horario').value,
      obs: document.getElementById('obs').value.trim()
    };

    // Salva no backend (ou localStorage) - AGORA É AUTOMÁTICO
    const resultado = await salvarAgendamento(data);

    if (resultado && resultado.erro) {
      // Horário acabou de ser ocupado por outro cliente
      btn.disabled = false;
      btn.innerHTML = btnOriginal;
      setError('horario', resultado.erro);
      await carregarOcupados();
      renderPainel(data.data);
      atualizarSelectHorarios();
      document.getElementById('horario').focus();
      return;
    }

    const msg = buildWhatsAppMessage(data);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank');

    const params = new URLSearchParams({
      nome: data.nome, telefone: data.telefone, veiculo: data.veiculo,
      servico: data.servico, preco: data.preco,
      data: data.data, horario: data.horario, obs: data.obs, wa: waUrl
    });
    window.location.href = 'confirmacao.html?' + params.toString();
  });

  /* ---------- ANIMAÇÕES REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));

  /* ---------- SCROLLSPY ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spy.observe(s));

  /* ---------- ANO RODAPÉ ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
