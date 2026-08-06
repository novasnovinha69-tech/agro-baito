/* ==================== HIGH LINE - SCRIPT ==================== */
(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  const WHATSAPP_NUMBER = '5547999661257';

  /* ---------- HEADER SCROLL ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MENU MOBILE ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');

  const openMenu = () => {
    nav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', openMenu);
  navClose.addEventListener('click', closeMenu);

  // Fecha menu ao clicar em link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha menu com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeModal();
    }
  });

  /* ---------- DATA MÍNIMA = HOJE ---------- */
  const dataInput = document.getElementById('data');
  if (dataInput) {
    const today = new Date().toISOString().split('T')[0];
    dataInput.min = today;
  }

  /* ---------- MÁSCARA TELEFONE ---------- */
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2}).*/, '($1');
      }
      e.target.value = v;
    });
  }

  /* ---------- PRE-SELEÇÃO DE SERVIÇO (cards / footer) ---------- */
  const servicoSelect = document.getElementById('servico');

  function preSelectService(name) {
    if (!servicoSelect) return;
    for (const opt of servicoSelect.options) {
      if (opt.value === name) { opt.selected = true; break; }
    }
  }

  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const service = this.getAttribute('data-service');
      preSelectService(service);
      // Se for link, deixa o comportamento padrão (âncora); se for botão, leva ao form
      if (this.tagName !== 'A') {
        e.preventDefault();
        document.getElementById('agendar').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- VALIDAÇÃO + ENVIO WHATSAPP ---------- */
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('thanksModal');
  const modalClose = document.getElementById('modalClose');
  const modalWaLink = document.getElementById('modalWaLink');

  const fields = ['nome', 'telefone', 'veiculo', 'servico', 'data', 'horario'];

  function setError(field, msg) {
    const el = document.getElementById(field);
    const err = document.querySelector(`[data-error="${field}"]`);
    if (msg) {
      el.classList.add('invalid');
      if (err) err.textContent = msg;
    } else {
      el.classList.remove('invalid');
      if (err) err.textContent = '';
    }
  }

  function validateField(field) {
    const el = document.getElementById(field);
    const val = (el.value || '').trim();
    if (!val) {
      setError(field, 'Campo obrigatório');
      return false;
    }
    if (field === 'telefone' && val.replace(/\D/g, '').length < 10) {
      setError(field, 'Telefone inválido');
      return false;
    }
    if (field === 'data') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const chosen = new Date(val + 'T00:00:00');
      if (chosen < today) {
        setError(field, 'Escolha uma data futura');
        return false;
      }
    }
    setError(field, '');
    return true;
  }

  // Validação em tempo real
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) {
      el.addEventListener('blur', () => validateField(f));
      el.addEventListener('input', () => {
        if (el.classList.contains('invalid')) validateField(f);
      });
    }
  });

  function formatarDataBR(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function buildWhatsAppMessage(data) {
    const obs = data.obs || '—';
    const msg =
`Olá High Line! 👋
Gostaria de agendar um serviço:
👤 Nome: ${data.nome}
📱 Telefone: ${data.telefone}
🚗 Veículo: ${data.veiculo}
🛠️ Serviço: ${data.servico}
📅 Data preferida: ${formatarDataBR(data.data)}
⏰ Horário: ${data.horario}
📝 Observações: ${obs}
Aguardo confirmação. Obrigado!`;
    return msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Valida todos
    let valid = true;
    fields.forEach(f => {
      if (!validateField(f)) valid = false;
    });
    if (!valid) {
      // Scroll para o primeiro inválido
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = {
      nome: document.getElementById('nome').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      veiculo: document.getElementById('veiculo').value.trim(),
      servico: document.getElementById('servico').value,
      data: document.getElementById('data').value,
      horario: document.getElementById('horario').value,
      obs: document.getElementById('obs').value.trim()
    };

    const msg = buildWhatsAppMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    // Abre WhatsApp em nova aba
    window.open(url, '_blank');

    // Modal de agradecimento
    modalWaLink.href = url;
    openModal();

    // Limpa o formulário
    form.reset();
  });

  /* ---------- MODAL ---------- */
  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  /* ---------- ANIMAÇÕES REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => io.observe(el));

  /* ---------- ACTIVE NAV LINK (scrollspy) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spyObserver.observe(s));

  /* ---------- ANO RODAPÉ ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
