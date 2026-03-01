/* ============================================================
   ING. MEDINA — SCRIPTS
   Archivo: main.js
   ============================================================ */


/* ----------------------------------------------------------
   1. SCROLL REVEAL
   Anima elementos con clase .reveal cuando entran al viewport.
   ---------------------------------------------------------- */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1 }
  );

  reveals.forEach(el => observer.observe(el));
})();


/* ----------------------------------------------------------
   2. NAV — SOMBRA Y ENLACE ACTIVO AL HACER SCROLL
   ---------------------------------------------------------- */
(function initNav() {
  const nav      = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    /* Sombra */
    nav.classList.toggle('scrolled', window.scrollY > 40);

    /* Enlace activo */
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      const active = a.getAttribute('href') === '#' + current;
      a.style.color = active ? 'var(--forest)' : '';
      // forzar la línea inferior cuando está activo
      a.style.setProperty('--active', active ? '100%' : '0%');
    });
  }, { passive: true });
})();


/* ----------------------------------------------------------
   3. ANIMACIÓN DE CONTADORES EN EL HERO
   Anima los números de estadísticas al cargar la página.
   ---------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('.hstat-num');

  counters.forEach(counter => {
    const raw     = counter.textContent.trim();          // "12+"
    const suffix  = raw.replace(/[0-9]/g, '');           // "+"
    const target  = parseInt(raw.replace(/\D/g, ''), 10);// 12
    const duration = 1600;
    const step    = Math.max(1, Math.ceil(target / (duration / 16)));
    let current   = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      counter.textContent = current + suffix;
      if (current < target) requestAnimationFrame(tick);
    };

    setTimeout(tick, 900);
  });
})();


/* ----------------------------------------------------------
   4. FORMULARIO — FEEDBACK VISUAL
   Simula envío con retroalimentación visual.
   Para producción: reemplazar setTimeout por fetch() o EmailJS.
   ---------------------------------------------------------- */
(function initForm() {
  // Cargar EmailJS
  emailjs.init('utopcVYzgjKGSga27'); // 🔴 reemplaza esto

  const btn = document.getElementById('form-submit-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const original = btn.textContent;

    // Recoger datos del formulario
    const params = {
      nombre:   document.getElementById('nombre').value,
      empresa:  document.getElementById('empresa').value,
      email:    document.getElementById('email').value,
      servicio: document.getElementById('servicio').value,
      mensaje:  document.getElementById('mensaje').value,
    };

    // Validación básica
    if (!params.nombre || !params.email || !params.mensaje) {
      btn.textContent = '⚠️ Completa los campos obligatorios';
      setTimeout(() => btn.textContent = original, 2500);
      return;
    }

    // Enviar
    btn.textContent  = 'Enviando...';
    btn.disabled     = true;
    btn.style.opacity = '0.75';

    emailjs.send(
      'service_ea3s7ps',   // ✅ ya lo tienes
      'template_uyx1y15',    // 🔴 reemplaza esto
      params
    )
    .then(() => {
      btn.textContent      = '✓ Mensaje enviado correctamente';
      btn.style.background = 'var(--fern)';
      btn.style.opacity    = '1';
      setTimeout(() => {
        btn.textContent      = original;
        btn.style.background = '';
        btn.disabled         = false;
      }, 3500);
    })
    .catch(() => {
      btn.textContent  = '❌ Error al enviar, intenta de nuevo';
      btn.style.background = '#c0392b';
      btn.style.opacity = '1';
      setTimeout(() => {
        btn.textContent      = original;
        btn.style.background = '';
        btn.disabled         = false;
      }, 3500);
    });
  });
})();


/* ----------------------------------------------------------
   5. HOVER SUAVE EN TARJETAS DE SERVICIO
   Agrega una sutil interacción de inclinación (tilt) al pasar
   el cursor sobre las tarjetas de servicio.
   ---------------------------------------------------------- */
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .plan-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const y      = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
