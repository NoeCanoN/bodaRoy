/* ═══════════════════════════════════════════════════════════════
   BODA ROY & VANESSA · Lógica de la invitación
   Sobre, música, cuenta regresiva, pétalos, lightbox y GSAP
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) { window.gsap.registerPlugin(window.ScrollTrigger); }

  /* ───────────────────────── MÚSICA ───────────────────────── */
  var audio = document.getElementById('bgMusic');
  var musicToggle = document.getElementById('musicToggle');

  function setMusicUI(playing) {
    musicToggle.classList.toggle('playing', playing);
    musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }

  function playMusic() {
    if (!audio) { return; }
    audio.volume = 0.85;
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () { setMusicUI(true); })
       .catch(function () { setMusicUI(false); });
    } else {
      setMusicUI(true);
    }
  }

  musicToggle.addEventListener('click', function () {
    if (!audio) { return; }
    if (audio.paused) { playMusic(); }
    else { audio.pause(); setMusicUI(false); }
  });
  audio && audio.addEventListener('pause', function () { setMusicUI(false); });
  audio && audio.addEventListener('play',  function () { setMusicUI(true); });

  /* ───────────────────────── SOBRE ───────────────────────── */
  var overlay = document.getElementById('envelopeOverlay');
  var openBtn = document.getElementById('openBtn');
  var opened = false;

  function openEnvelope() {
    if (opened) { return; }
    opened = true;

    function proceed() {
      overlay.classList.add('opened');
      document.body.classList.remove('locked');
      playMusic();
      heroIntro();
      window.setTimeout(function () {
        overlay.style.display = 'none';
      }, 1600);
    }

    var docEl = document.documentElement;
    var requestFS = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
    if (requestFS) {
      var promise = requestFS.call(docEl);
      if (promise && typeof promise.then === 'function') {
        promise.then(function () {
          // Esperamos un instante corto para que se estabilice el redibujado de la pantalla
          window.setTimeout(proceed, 200);
        }).catch(function (err) {
          console.log("Error al intentar activar pantalla completa:", err);
          proceed();
        });
      } else {
        proceed();
      }
    } else {
      proceed();
    }
  }

  openBtn.addEventListener('click', openEnvelope);

  /* ───────────────────── HERO · ENTRADA ───────────────────── */
  function heroIntro() {
    if (!hasGsap || prefersReduced) { return; }
    var tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.garland-top',    { yPercent: -100, duration: 1.1 }, 0)
      .from('.garland-bottom', { yPercent: 100,  duration: 1.1 }, 0)
      .from('#heroFlores', { scale: .55, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)' }, .25)
      .from('#heroKicker', { y: 26, autoAlpha: 0, duration: .8 }, .55)
      .from('.names .name', { y: 44, autoAlpha: 0, duration: 1, stagger: .18 }, .7)
      .from('.names .amp',  { scale: 0, autoAlpha: 0, duration: .7, ease: 'back.out(2.2)' }, 1.15)
      .from('#heroDate',    { y: 24, autoAlpha: 0, duration: .8 }, 1.3)
      .from('#heroDivider', { scaleX: 0, autoAlpha: 0, duration: .8 }, 1.45)
      .from('#heroVerse',   { y: 24, autoAlpha: 0, duration: .9 }, 1.55)
      .from('#scrollCue',   { autoAlpha: 0, duration: .8 }, 2)
      .from('.mariposa',    { autoAlpha: 0, scale: .4, duration: 1, stagger: .15, ease: 'back.out(1.8)' }, 1.6);
  }

  /* ───────────────── MARIPOSAS · VUELO SUAVE ───────────────── */
  if (hasGsap && !prefersReduced) {
    window.gsap.utils.toArray('.mariposa').forEach(function (el) {
      (function drift() {
        window.gsap.to(el, {
          x: window.gsap.utils.random(-46, 46),
          y: window.gsap.utils.random(-34, 34),
          rotation: window.gsap.utils.random(-14, 14),
          duration: window.gsap.utils.random(2.6, 4.2),
          ease: 'sine.inOut',
          onComplete: drift
        });
      })();
    });
  }

  /* ───────────────── SCROLL · REVELADOS ───────────────── */
  if (hasST && !prefersReduced) {
    window.gsap.utils.toArray('.reveal').forEach(function (el) {
      window.gsap.from(el, {
        y: 46,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });
    window.gsap.utils.toArray('.reveal-group').forEach(function (group) {
      window.gsap.from(group.children, {
        y: 40,
        autoAlpha: 0,
        duration: .9,
        stagger: .12,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 86%' }
      });
    });
    // Parallax suave del ramo principal
    window.gsap.to('#heroFlores', {
      y: -34,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }

  /* ───────────────── CUENTA REGRESIVA ───────────────── */
  var target = new Date('2026-10-31T08:00:00-05:00').getTime();
  var elD = document.getElementById('cdDias');
  var elH = document.getElementById('cdHoras');
  var elM = document.getElementById('cdMin');
  var elS = document.getElementById('cdSeg');
  var cdMsg = document.getElementById('cdMsg');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      elD.textContent = '00'; elH.textContent = '00';
      elM.textContent = '00'; elS.textContent = '00';
      cdMsg.textContent = '¡Llegó el gran día! Gracias por acompañarnos.';
      window.clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    elD.textContent = pad(Math.floor(s / 86400));
    elH.textContent = pad(Math.floor((s % 86400) / 3600));
    elM.textContent = pad(Math.floor((s % 3600) / 60));
    elS.textContent = pad(s % 60);
  }
  var timer = window.setInterval(tick, 1000);
  tick();

  /* ───────────────── PÉTALOS DE FLORES ───────────────── */
  if (!prefersReduced) {
    var layer = document.getElementById('petals');
    var colors = ['#C9184A', '#E36414', '#FFB703', '#2A9D8F', '#6D3B8E', '#EE6C4D', '#F4A259'];
    var COUNT = 16;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var size = 9 + Math.random() * 10;
      var c = colors[i % colors.length];
      p.style.width = size + 'px';
      p.style.height = size * 1.25 + 'px';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.background = 'radial-gradient(circle at 30% 30%, ' + c + 'cc, ' + c + ')';
      p.style.setProperty('--sw', (30 + Math.random() * 60) + 'px');
      p.style.setProperty('--d', (9 + Math.random() * 8) + 's');
      p.style.setProperty('--dl', (-Math.random() * 16) + 's');
      p.style.setProperty('--o', (0.35 + Math.random() * 0.4).toFixed(2));
      layer.appendChild(p);
    }
  }

  /* ───────────────── LIGHTBOX ───────────────── */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Imagen ampliada';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    window.setTimeout(function () { lightboxImg.src = ''; }, 380);
  }

  document.querySelectorAll('.lightbox-trigger').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) { closeLightbox(); }
  });
})();
