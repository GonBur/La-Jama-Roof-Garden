/* =========================================================================
   LA JAMA ROOF GARDEN — Interacciones y animaciones
   Patrón IIFE (sin módulos). GSAP + ScrollTrigger si cargan desde la CDN;
   si no, todo funciona con IntersectionObserver + CSS.
   ========================================================================= */
(function () {
  'use strict';

  var D = window.LAJAMA;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia(q).matches; };
  var REDUCED = mq('(prefers-reduced-motion: reduce)');
  var FINE = mq('(hover: hover) and (pointer: fine)');
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  var DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn('[LaJama] ' + name + ':', e); } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function waUrl(msg) { return 'https://wa.me/' + D.business.whatsapp + '?text=' + encodeURIComponent(msg); }
  function img(name) { return 'assets/img/' + name; }
  function money(n) { return 'S/ ' + (n % 1 ? n.toFixed(2) : n); }

  /* Hora local de Perú, independiente del dispositivo */
  function limaNow() {
    var d = new Date();
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + D.business.timezoneOffset * 3600000);
  }
  function toMin(hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt12(hhmm) { var m = toMin(hhmm), h = Math.floor(m / 60), mm = m % 60; return (h % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm; }

  /* ---------------- Montajes desde data.js ---------------- */
  function mountWa(root) {
    $$('[data-wa]', root).forEach(function (a) {
      a.href = waUrl(a.getAttribute('data-wa'));
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  function mountFiltersAndMenu() {
    var f = $('[data-mount="filters"]'), list = $('[data-mount="menu"]');
    if (!f || !list || list.children.length) return;
    f.innerHTML = D.categories.map(function (c, i) {
      var n = c.id === 'todo' ? D.menu.length : D.menu.filter(function (m) { return m.cat === c.id; }).length;
      return '<button class="chip" role="tab" type="button" data-cat="' + c.id + '" aria-selected="' + (i === 0) + '" aria-controls="lista-carta">' + esc(c.label) + '<sup>' + n + '</sup></button>';
    }).join('');
    list.id = 'lista-carta';
    var catLabel = {}; D.categories.forEach(function (c) { catLabel[c.id] = c.label; });
    list.innerHTML = D.menu.map(function (m) {
      var price = m.price != null
        ? '<span class="dish__price">' + money(m.price) + '</span>'
        : '<span class="dish__price dish__price--ask">Consultar</span>';
      return '<li class="dish" data-cat="' + m.cat + '">' +
        '<div class="dish__img"><img src="' + img(m.img) + '" alt="' + esc(m.name) + ' — La Jama Roof Garden" width="412" height="412" loading="lazy" decoding="async"><span class="dish__tag">' + esc(catLabel[m.cat] || '') + '</span></div>' +
        '<div class="dish__body"><div class="dish__top"><h3 class="dish__name">' + esc(m.name) + '</h3>' + price + '</div>' +
        '<p class="dish__desc">' + esc(m.desc) + '</p>' +
        (m.priceNote ? '<p class="dish__note">' + esc(m.priceNote) + ' · consulta vigencia</p>' : '') +
        '<a class="dish__cta" data-wa="Hola La Jama, quisiera consultar por: ' + esc(m.name) + '" href="#reservas">Consultar por WhatsApp <span aria-hidden="true">→</span></a></div></li>';
    }).join('');
    mountWa(list);

    f.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', f).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      filterMenu(list, b.getAttribute('data-cat'));
    });
    f.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var chips = $$('.chip', f), i = chips.indexOf(document.activeElement);
      var n = chips[(i + (e.key === 'ArrowRight' ? 1 : -1) + chips.length) % chips.length];
      n.focus(); n.click();
    });
  }

  function filterMenu(list, cat) {
    var items = $$('.dish', list);
    var show = function () {
      items.forEach(function (el) { el.hidden = !(cat === 'todo' || el.getAttribute('data-cat') === cat); });
      if (REDUCED || !list.animate) return;
      items.filter(function (el) { return !el.hidden; }).forEach(function (el, i) {
        el.animate([{ opacity: 0, transform: 'translateY(24px) scale(.97)' }, { opacity: 1, transform: 'none' }],
          { duration: 600, delay: i * 50, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
    };
    if (REDUCED || !list.animate) return show();
    var visible = items.filter(function (el) { return !el.hidden; });
    var anim = visible.map(function (el) { return el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }); });
    setTimeout(function () { anim.forEach(function (a) { a.cancel(); }); show(); }, 210);
  }

  function mountSpecials() {
    var t = $('[data-mount="specials"]'); if (!t || t.children.length) return;
    t.innerHTML = D.menu.filter(function (m) { return m.featured; }).map(function (m, i) {
      return '<li class="sp"><div class="sp__img"><img src="' + img(m.img) + '" alt="' + esc(m.name) + '" width="412" height="412" loading="lazy" decoding="async"></div>' +
        '<div class="sp__body"><span class="sp__n">' + (i < 9 ? '0' : '') + (i + 1) + '</span><h3 class="sp__name">' + esc(m.name) + '</h3><p class="sp__desc">' + esc(m.desc) + '</p>' +
        '<a class="sp__link" data-wa="Hola La Jama, quisiera pedir / consultar: ' + esc(m.name) + '" href="#reservas">Pedir por WhatsApp <span aria-hidden="true">→</span></a></div></li>';
    }).join('');
    mountWa(t);
    $$('[data-rail]').forEach(function (b) {
      b.addEventListener('click', function () {
        var rail = $('.spec__rail'), card = $('.sp', rail);
        rail.scrollBy({ left: (+b.getAttribute('data-rail')) * (card.offsetWidth + 20), behavior: REDUCED ? 'auto' : 'smooth' });
      });
    });
  }

  function mountPromos() {
    var m = $('[data-mount="promos"]'); if (!m || m.children.length) return;
    var today = limaNow().toISOString().slice(0, 10);
    var live = (D.promos || []).filter(function (p) { return !p.until || p.until >= today; });
    if (live.length) {
      m.innerHTML = live.map(function (p) {
        return '<div class="promo-live" data-reveal>' + (p.img ? '<img src="' + img(p.img) + '" alt="" width="84" height="84" loading="lazy">' : '') +
          '<div><b>' + esc(p.title) + '</b><br><span>' + esc(p.text) + '</span></div></div>';
      }).join('');
    } else {
      m.innerHTML = '<p data-reveal>Publicamos nuestras promos y novedades en Facebook, Instagram y TikTok. Aquí tienes las publicaciones más recientes; escríbenos para saber qué está vigente hoy.</p>';
    }
  }

  function mountPosts() {
    var box = $('[data-mount="posts"]'); if (!box || box.children.length) return;
    var posts = D.posts, cur = 0, timer;
    box.innerHTML = posts.map(function (p, i) {
      return '<button type="button" class="post" data-i="' + i + '" aria-label="Ver publicación: ' + esc(p.alt) + '"><img src="' + img(p.img) + '" alt="' + esc(p.alt) + '" width="412" height="412" loading="lazy" decoding="async"></button>';
    }).join('') + '<p class="posts__caption">Publicaciones oficiales · Toca para ver</p>';
    var els = $$('.post', box);
    function layout() {
      els.forEach(function (el, i) {
        var d = i - cur, n = posts.length;
        if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        var v = Math.max(-2, Math.min(2, d));
        el.style.setProperty('--i', v); el.style.setProperty('--abs', Math.abs(v));
        el.style.visibility = Math.abs(d) > 2 ? 'hidden' : 'visible';
        el.tabIndex = d === 0 ? 0 : -1;
      });
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.post'); if (!b) return;
      var i = +b.getAttribute('data-i');
      if (i === cur) openLightbox(posts.map(function (p) { return { img: p.img, alt: p.alt }; }), i);
      else { cur = i; layout(); }
    });
    function auto() { clearInterval(timer); if (!REDUCED) timer = setInterval(function () { cur = (cur + 1) % posts.length; layout(); }, 4200); }
    box.addEventListener('pointerenter', function () { clearInterval(timer); });
    box.addEventListener('pointerleave', auto);
    box.addEventListener('focusin', function () { clearInterval(timer); });
    layout(); auto();
  }

  function mountGallery() {
    var g = $('[data-mount="gallery"]'); if (!g || g.children.length) return;
    g.innerHTML = D.gallery.map(function (p, i) {
      return '<li data-reveal style="--d:' + (i % 4) * 0.06 + 's"><button type="button" class="tile" data-i="' + i + '" data-tag="' + esc(p.tag) + '" aria-label="Ampliar: ' + esc(p.alt) + '"><img src="' + img(p.img) + '" alt="' + esc(p.alt) + '" width="412" height="412" loading="lazy" decoding="async"></button></li>';
    }).join('');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.tile'); if (b) openLightbox(D.gallery, +b.getAttribute('data-i'));
    });
  }

  var ICONS = {
    facebook: '<path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z"/>',
    instagram: '<path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8.3c0-1.5-.4-2.9-1.5-3.9C18.4 3.4 17.1 3 15.6 3H8.4C6.9 3 5.6 3.4 4.5 4.4 3.4 5.5 3 6.8 3 8.3v7.4c0 1.5.4 2.9 1.5 3.9 1.1 1 2.4 1.4 3.9 1.4h7.2c1.5 0 2.9-.4 3.9-1.4 1-1 1.5-2.4 1.5-3.9V8.3zm-2 7.6c0 .9-.4 1.7-1 2.3-.6.6-1.4.9-2.3.9H8.3c-.9 0-1.7-.3-2.3-.9-.6-.6-1-1.4-1-2.3V8.1c0-.9.4-1.7 1-2.3.6-.6 1.4-.9 2.3-.9h7.4c.9 0 1.7.3 2.3.9.6.6 1 1.4 1 2.3v7.8z"/>',
    tiktok: '<path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.8 5.8 0 1 0 5 5.7V9.1a7.3 7.3 0 0 0 4.2 1.3V7.3s-1.9.1-3.2-1.5z"/>'
  };
  function mountSocials() {
    var s = $('[data-mount="socials"]'); if (!s || s.children.length) return;
    s.innerHTML = D.social.map(function (x) {
      return '<li><a href="' + esc(x.url) + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[x.id] || '') + '</svg>' + esc(x.label) + '</a></li>';
    }).join('');
  }

  function mountHours() {
    var tb = $('[data-mount="hours"]'); if (!tb) return;
    var today = limaNow().getDay();
    tb.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
      var h = D.business.hours[d];
      return '<tr class="' + (h ? '' : 'off') + (d === today ? ' is-today' : '') + '"><th scope="row">' + DAYS[d] + (d === today ? ' · hoy' : '') + '</th><td>' +
        (h ? fmt12(h[0]) + ' – ' + fmt12(h[1]) + ' p. m.' : 'Descanso') + '</td></tr>';
    }).join('');
  }

  function initStatus() {
    var el = $('[data-status]'); if (!el) return;
    var now = limaNow(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
    var h = D.business.hours[d];
    if (h && m >= toMin(h[0]) && m < toMin(h[1])) {
      el.textContent = 'Abierto ahora · hasta las ' + fmt12(h[1]) + ' p. m.'; el.classList.add('is-open');
    } else if (h && m < toMin(h[0])) {
      el.textContent = 'Hoy abrimos a las ' + fmt12(h[0]) + ' p. m.';
    } else {
      var n = (d + 1) % 7, k = 0; while (!D.business.hours[n] && k++ < 7) n = (n + 1) % 7;
      el.textContent = 'Cerrado · abrimos ' + (n === (d + 1) % 7 ? 'mañana' : 'el ' + DAYS[n].toLowerCase()) + ' 6:30 p. m.';
    }
  }

  /* ---------------- Texto partido ---------------- */
  function initSplit() {
    $$('[data-split]').forEach(function (block) {
      if (block.querySelector('.w')) return;
      var idx = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
          if (ch.nodeType === 3) {
            var parts = ch.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var inner = document.createElement('span'); inner.textContent = p; inner.style.setProperty('--wi', idx++);
              w.appendChild(inner); frag.appendChild(w);
            });
            ch.parentNode.replaceChild(frag, ch);
          } else if (ch.nodeType === 1 && !ch.classList.contains('sr-only')) walk(ch);
        });
      })(block);
      block.setAttribute('aria-label', block.textContent.replace(/\s+/g, ' ').trim());
    });
    // Las tres líneas del hero comparten una sola secuencia
    var i = 0; $$('.hero__title .w > span').forEach(function (s) { s.style.setProperty('--wi', i++); });
  }

  /* ---------------- Revelados ---------------- */
  function revealAll() { $$('[data-reveal],[data-reveal-img],[data-split]').forEach(function (el) { el.classList.add('is-in'); }); }

  function initReveals() {
    var targets = $$('[data-reveal],[data-reveal-img],[data-split]').filter(function (el) { return !el.closest('.hero'); });
    if (HAS_GSAP) {
      ScrollTrigger.batch(targets, { start: 'top 90%', once: true, interval: 0.08, onEnter: function (b) { b.forEach(function (el, i) { el.style.setProperty('--d', (i * 0.08) + 's'); el.classList.add('is-in'); }); } });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
      targets.forEach(function (el) { io.observe(el); });
    } else revealAll();
    setTimeout(revealAll, 6000); // red de seguridad
  }

  function heroIn() {
    $$('.hero__title .line, .hero [data-reveal]').forEach(function (el, i) {
      el.style.setProperty('--d', (0.35 + i * 0.1) + 's'); el.classList.add('is-in');
    });
    if (HAS_GSAP && !REDUCED) {
      $$('.pola').forEach(function (p) { p.style.transition = 'none'; });
      gsap.from('.pola', { y: 120, opacity: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', delay: 0.2, clearProps: 'opacity,transition' });
    }
  }

  function initIntro() {
    var intro = $('.intro'), done = false;
    function finish() { if (done) return; done = true; if (intro) intro.classList.add('is-done'); heroIn(); }
    var seen = false; try { seen = sessionStorage.getItem('lj-intro') === '1'; sessionStorage.setItem('lj-intro', '1'); } catch (e) {}
    if (seen || REDUCED) return finish();
    var t0 = Date.now();
    function go() { setTimeout(finish, Math.max(0, 1300 - (Date.now() - t0))); }
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    setTimeout(finish, 2600);
  }

  /* ---------------- Scroll: header, progreso, parallax ---------------- */
  function initScroll() {
    var header = $('.header'), bar = $('.progress span'), dock = $('.dock'), footer = $('.footer');
    var lastY = window.scrollY, ticking = false;
    var par = REDUCED || HAS_GSAP ? [] : $$('[data-speed]');
    function update() {
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      header.classList.toggle('is-solid', y > 40);
      header.classList.toggle('is-hidden', y > 500 && y > lastY && !document.body.classList.contains('menu-open'));
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      if (dock && footer) dock.classList.toggle('is-hidden', footer.getBoundingClientRect().top < innerHeight - 40);
      par.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        el.style.translate = '0 ' + ((r.top + r.height / 2 - innerHeight / 2) * +el.getAttribute('data-speed') * -1).toFixed(1) + 'px';
      });
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // Enlace activo en navegación
    if ('IntersectionObserver' in window) {
      var links = $$('.nav a');
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main section[id]').forEach(function (s) { io.observe(s); });
    }
  }

  function initGsapScenes() {
    if (!HAS_GSAP || REDUCED) return;
    gsap.registerPlugin(ScrollTrigger);
    $$('[data-speed]').forEach(function (el) {
      var s = +el.getAttribute('data-speed');
      gsap.to(el, { yPercent: s * 40, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.to('.hero__stack', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { opacity: 0.15, yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
    gsap.fromTo('.marquee__track', { xPercent: 0 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Especialidades: scroll horizontal fijado en escritorio
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', function () {
      var rail = $('.spec__rail'), track = $('.spec__track');
      rail.style.overflow = 'visible';
      var dist = function () { return Math.max(0, track.scrollWidth - rail.clientWidth + parseFloat(getComputedStyle(rail).paddingLeft) * 2); };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.spec', pin: '.spec__pin', start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.6, invalidateOnRefresh: true } });
      $('.spec__nav').style.visibility = 'hidden';
      return function () { rail.style.overflow = ''; $('.spec__nav').style.visibility = ''; tw.kill(); };
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------------- Menú móvil ---------------- */
  function initMobileMenu() {
    var btn = $('.burger'), nav = $('#menu-movil'); if (!btn || !nav) return;
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);
      if (open) { nav.hidden = false; requestAnimationFrame(function () { nav.classList.add('is-open'); }); setTimeout(function () { var a = $('a', nav); if (a) a.focus(); }, 350); }
      else { nav.classList.remove('is-open'); setTimeout(function () { if (!nav.classList.contains('is-open')) nav.hidden = true; }, 800); }
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (btn.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') { set(false); btn.focus(); }
      if (e.key === 'Tab') {
        var f = [btn].concat($$('a', nav)), i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', function () { if (innerWidth >= 900 && btn.getAttribute('aria-expanded') === 'true') set(false); });
  }

  /* ---------------- Microinteracciones (puntero fino) ---------------- */
  function initPointerFx() {
    if (!FINE) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    var hero = $('.hero'), polas = $$('.pola');
    if (hero && !REDUCED) hero.addEventListener('pointermove', function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      polas.forEach(function (p) { var k = +p.getAttribute('data-depth'); p.style.transform = 'translate(' + (x * k).toFixed(1) + 'px,' + (y * k).toFixed(1) + 'px)'; });
    });
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.dish');
      $$('.dish.is-tilt').forEach(function (d) { if (d !== card) { d.classList.remove('is-tilt'); d.style.removeProperty('--rx'); d.style.removeProperty('--ry'); } });
      if (!card || REDUCED) return;
      var r = card.getBoundingClientRect();
      card.classList.add('is-tilt');
      card.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -6).toFixed(2) + 'deg');
    }, { passive: true });
  }

  /* ---------------- Lightbox ---------------- */
  var LB = { list: [], i: 0 };
  function openLightbox(list, i) {
    var dlg = $('.lightbox'); if (!dlg) return;
    LB.list = list; LB.i = i; LB.opener = document.activeElement; showLb();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function showLb() {
    var p = LB.list[LB.i], dlg = $('.lightbox'), im = $('img', dlg);
    im.src = img(p.img); im.alt = p.alt; $('figcaption', dlg).textContent = p.alt + '  ·  ' + (LB.i + 1) + ' / ' + LB.list.length;
    if (!REDUCED && im.animate) im.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  function stepLb(d) { LB.i = (LB.i + d + LB.list.length) % LB.list.length; showLb(); }
  function initLightbox() {
    var dlg = $('.lightbox'); if (!dlg) return;
    var close = function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); };
    dlg.addEventListener('close', function () { document.body.style.overflow = ''; if (LB.opener) LB.opener.focus(); });
    $('.lightbox__close', dlg).addEventListener('click', close);
    $('.lightbox__prev', dlg).addEventListener('click', function () { stepLb(-1); });
    $('.lightbox__next', dlg).addEventListener('click', function () { stepLb(1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') stepLb(1); if (e.key === 'ArrowLeft') stepLb(-1); });
    var x0 = null;
    dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); x0 = null; });
  }

  /* ---------------- Formulario → WhatsApp ---------------- */
  function initForm() {
    var form = $('#form-reserva'); if (!form) return;
    var err = $('.form__error', form), date = $('#f-fecha', form);
    var today = limaNow(); var iso = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
    date.min = iso(today);
    var first = new Date(today); if (!D.business.hours[first.getDay()]) first.setDate(first.getDate() + 1);
    date.value = iso(first);
    function mode() { return form.querySelector('[name="tipo"]:checked').value; }
    form.addEventListener('change', function () { form.setAttribute('data-mode', mode()); });
    form.setAttribute('data-mode', mode());

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      $$('[aria-invalid]', form).forEach(function (x) { x.removeAttribute('aria-invalid'); });
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var fail = function (field, msg) { err.textContent = msg; form.elements[field].setAttribute('aria-invalid', 'true'); form.elements[field].focus(); };
      if (!v('nombre')) return fail('nombre', 'Escribe tu nombre, por favor.');
      var msg;
      if (mode() === 'reserva') {
        if (!v('fecha') || v('fecha') < date.min) return fail('fecha', 'Elige una fecha desde hoy.');
        var dd = new Date(v('fecha') + 'T12:00:00');
        var h = D.business.hours[dd.getDay()];
        if (!h) return fail('fecha', 'Ese día descansamos (martes). Elige otra fecha.');
        var hm = toMin(v('hora') || '0:0');
        if (!v('hora') || hm < toMin(h[0]) || hm > toMin(h[1]) - 30) return fail('hora', 'Atendemos de ' + fmt12(h[0]) + ' a ' + fmt12(h[1]) + ' p. m. Elige una hora en ese rango.');
        var n = +v('personas'); if (!(n >= 1 && n <= 40)) return fail('personas', 'Indica cuántas personas (1 a 40).');
        var nice = DAYS[dd.getDay()] + ' ' + v('fecha').split('-').reverse().join('/');
        msg = 'Hola La Jama Roof Garden, quisiera solicitar una reserva:\n• Nombre: ' + v('nombre') + '\n• Fecha: ' + nice + '\n• Hora: ' + v('hora') + '\n• Personas: ' + n +
          (v('mensaje') ? '\n• Comentario: ' + v('mensaje') : '') + '\n¿Me confirman disponibilidad? Gracias.';
      } else {
        if (!v('mensaje')) return fail('mensaje', 'Cuéntanos qué quieres consultar o pedir.');
        msg = 'Hola La Jama Roof Garden, soy ' + v('nombre') + '. Quisiera consultar: ' + v('mensaje');
      }
      err.textContent = '';
      var w = window.open(waUrl(msg), '_blank');
      if (w) { try { w.opener = null; } catch (x) {} } else window.location.href = waUrl(msg);
    });
  }

  function initMap() {
    var b = $('[data-map-load]'); if (!b) return;
    b.addEventListener('click', function () {
      var box = b.closest('.map'), f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(D.business.mapsEmbedQuery) + '&output=embed';
      f.title = 'Mapa de ubicación de La Jama Roof Garden'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f); $('.map__facade', box).remove();
    });
  }

  /* ---------------- Arranque ---------------- */
  function boot() {
    if (!D) { document.documentElement.classList.remove('js'); return; }
    safe(function () { var y = $('[data-year]'); if (y) y.textContent = limaNow().getFullYear(); }, 'year');
    safe(mountFiltersAndMenu, 'menu');
    safe(mountSpecials, 'specials');
    safe(mountPromos, 'promos');
    safe(mountPosts, 'posts');
    safe(mountGallery, 'gallery');
    safe(mountSocials, 'socials');
    safe(mountHours, 'hours');
    safe(function () { mountWa(document); }, 'wa');
    safe(initStatus, 'status');
    safe(initSplit, 'split');
    safe(initGsapScenes, 'gsap');
    safe(initReveals, 'reveals');
    safe(initIntro, 'intro');
    safe(initScroll, 'scroll');
    safe(initMobileMenu, 'mobileMenu');
    safe(initPointerFx, 'pointer');
    safe(initLightbox, 'lightbox');
    safe(initForm, 'form');
    safe(initMap, 'map');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
