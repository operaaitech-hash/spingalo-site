/* Spingalo website: wheel, parallax, reveals, live app preview, systems chart. No frameworks. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol === 'file:';
  var APP = local ? 'app/' : 'app/';

  // ---- nav
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var onScrollNav = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
  window.addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
  toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
  document.querySelectorAll('#navLinks a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });

  // ---- hero wheel: 37 pockets in real wheel order, drawn once, rotated by scroll and time
  var ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  var RED = {1:1,3:1,5:1,7:1,9:1,12:1,14:1,16:1,18:1,19:1,21:1,23:1,25:1,27:1,30:1,32:1,34:1,36:1};
  var wheel = document.getElementById('heroWheel');
  if (wheel) {
    var n = ORDER.length, step = Math.PI * 2 / n, cx = 200, cy = 200;
    function P(r, a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); }
    function wedge(r1, r2, a0, a1) { return 'M' + P(r2, a0) + ' A' + r2 + ' ' + r2 + ' 0 0 1 ' + P(r2, a1) + ' L' + P(r1, a1) + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + P(r1, a0) + ' Z'; }
    var s = '<defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFE9A3"/><stop offset=".5" stop-color="#E3B341"/><stop offset="1" stop-color="#8E6612"/></linearGradient>' +
      '<radialGradient id="wf" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#124F37"/><stop offset="1" stop-color="#041A11"/></radialGradient>' +
      '<linearGradient id="wr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E8323D"/><stop offset="1" stop-color="#8E1119"/></linearGradient>' +
      '<linearGradient id="wb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2E2E2E"/><stop offset="1" stop-color="#070707"/></linearGradient></defs>';
    s += '<circle cx="200" cy="200" r="194" fill="url(#wf)" stroke="url(#wg)" stroke-width="10"/>';
    for (var i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + (i - 0.5) * step, a1 = a0 + step, mid = (a0 + a1) / 2;
      var num = ORDER[i], fill = num === 0 ? '#1F7A4B' : RED[num] ? 'url(#wr)' : 'url(#wb)';
      var tx = cx + 165 * Math.cos(mid), ty = cy + 165 * Math.sin(mid), deg = mid * 180 / Math.PI + 90;
      s += '<path d="' + wedge(122, 188, a0, a1) + '" fill="' + fill + '" stroke="#C9971E" stroke-width="1.2"/>';
      s += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle" dominant-baseline="middle" transform="rotate(' + deg.toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')">' + num + '</text>';
    }
    s += '<circle cx="200" cy="200" r="122" fill="none" stroke="url(#wg)" stroke-width="6"/><circle cx="200" cy="200" r="114" fill="url(#wf)"/>';
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; s += '<path d="M' + P(30, a) + ' L' + P(110, a) + '" stroke="url(#wg)" stroke-width="5" stroke-linecap="round"/>'; }
    s += '<circle cx="200" cy="200" r="30" fill="url(#wg)"/><circle cx="200" cy="200" r="12" fill="#0B3A28"/>';
    wheel.innerHTML = s;
    var rot = 0, last = 0;
    function spin(ts) {
      if (!reduce) {
        var dt = last ? Math.min(50, ts - last) : 16; last = ts;
        rot += dt * 0.004 + 0; // slow idle spin
        wheel.style.transform = 'rotate(' + (rot + window.scrollY * 0.12).toFixed(2) + 'deg)';
      }
      requestAnimationFrame(spin);
    }
    requestAnimationFrame(spin);
  }
  // pocket ring in the first card illustration
  var pk = document.getElementById('pk');
  if (pk) {
    var ss = '';
    for (var j = 0; j < 18; j++) { var b0 = -Math.PI / 2 + (j + 0.5) * (Math.PI * 2 / 18), b1 = b0 + Math.PI * 2 / 18; var P2 = function (r, a) { return (r * Math.cos(a)).toFixed(1) + ' ' + (r * Math.sin(a)).toFixed(1); }; ss += '<path d="M' + P2(58, b0) + ' A58 58 0 0 1 ' + P2(58, b1) + ' L' + P2(40, b1) + ' A40 40 0 0 0 ' + P2(40, b0) + ' Z" fill="' + (j % 2 ? '#1A1A1A' : '#C8202B') + '" stroke="#F6DC8E" stroke-width="1"/>'; }
    pk.innerHTML = ss;
  }

  // ---- reveals
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // ---- parallax
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) { return { el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0 }; });
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    items.forEach(function (it) {
      var r = it.el.getBoundingClientRect();
      var centre = r.top + r.height / 2 - vh / 2;
      if (centre > vh * 1.5 || centre < -vh * 1.5) return;
      it.el.style.transform = 'translate3d(0,' + (centre * it.speed).toFixed(1) + 'px,0)';
    });
  }
  if (!reduce) { window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true }); window.addEventListener('resize', frame); frame(); }

  // ---- phone tilt follows the pointer
  var phone = document.getElementById('phone');
  if (phone && !reduce && window.matchMedia('(hover: hover)').matches) {
    var stage = phone.parentElement;
    stage.addEventListener('mousemove', function (e) {
      var r = phone.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width, y = (e.clientY - (r.top + r.height / 2)) / r.height;
      phone.style.transform = 'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg)';
    });
    stage.addEventListener('mouseleave', function () { phone.style.transform = ''; });
  }

  // ---- counters
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; cio.unobserve(el);
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10), suffix = el.getAttribute('data-suffix') || '';
      var fmt = function (v) { return v.toFixed(dec) + suffix; };
      var start = null;
      function stepFn(ts) { if (!start) start = ts; var p = Math.min(1, (ts - start) / 1500); var v = target * (1 - Math.pow(1 - p, 3)); el.textContent = fmt(v); if (p < 1) requestAnimationFrame(stepFn); }
      if (reduce) el.textContent = fmt(target); else requestAnimationFrame(stepFn);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // ---- live app preview in the phone, with a tap-through fallback
  var frameEl = document.getElementById('appFrame'), loading = document.getElementById('phoneLoading');
  var loaded = false;
  function goOffline() { phone.classList.add('offline'); loading.classList.add('hide'); startTour(); }
  function loadApp() {
    if (loaded) return; loaded = true;
    var timer = setTimeout(goOffline, 12000);
    frameEl.addEventListener('load', function () { clearTimeout(timer); setTimeout(function () { loading.classList.add('hide'); }, 800); });
    frameEl.addEventListener('error', function () { clearTimeout(timer); goOffline(); });
    frameEl.src = APP + '?seed=1';
  }
  var pio = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { loadApp(); pio.disconnect(); } }); }, { rootMargin: '300px' });
  if (phone) pio.observe(phone);
  var tourIndex = 0, tourTimer = null;
  function startTour() {
    var track = document.getElementById('tourTrack'); var slides = track.children.length;
    function go(i) { tourIndex = (i + slides) % slides; track.style.transform = 'translateX(-' + tourIndex * 100 + '%)'; }
    document.getElementById('tourPrev').addEventListener('click', function () { go(tourIndex - 1); clearInterval(tourTimer); });
    document.getElementById('tourNext').addEventListener('click', function () { go(tourIndex + 1); clearInterval(tourTimer); });
    tourTimer = setInterval(function () { go(tourIndex + 1); }, 3200);
  }

  // ---- systems chart (numbers from the app's own simulator, 5,000 sessions each)
  var DATA = {
    martingale: { t: 'Martingale', hit: 80.9, bust: 19.1, live: 0, foot: 'Most nights end a little up. Roughly one night in five ends with the whole £500 gone, when a losing run meets the table limit. The average, over all of them, is the house edge.' },
    paroli: { t: 'Paroli', hit: 22.4, bust: 2.1, live: 75.5, foot: 'Small losses most nights and the occasional lovely run. You only ever risk a chip or two of your own money, so busting is rare and so is hitting the target.' },
    dalembert: { t: "d'Alembert", hit: 61.8, bust: 7.6, live: 30.6, foot: 'Gentle. Bets climb one chip at a time, so bad runs hurt slowly. Hits the target more often than flat betting and busts more often too.' },
    fibonacci: { t: 'Fibonacci', hit: 72.3, bust: 12.9, live: 14.8, foot: 'Slower to climb than Martingale, so it survives longer losing runs, but it still climbs without a ceiling until the bankroll or the table says stop.' },
    flat: { t: 'Flat betting', hit: 38.2, bust: 1.4, live: 60.4, foot: 'The same £10 every spin. Your money lasts longest this way and there are no nasty surprises, which is exactly why it is the safest.' }
  };
  function showSys(key) {
    var d = DATA[key]; if (!d) return;
    document.getElementById('chartTitle').textContent = d.t; document.getElementById('chartFoot').textContent = d.foot;
    [['Hit', d.hit], ['Bust', d.bust], ['Live', d.live]].forEach(function (p) { document.getElementById('b' + p[0]).style.width = p[1] + '%'; document.getElementById('v' + p[0]).textContent = p[1].toFixed(1) + '%'; });
    document.querySelectorAll('#sysChips .chip').forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-sys') === key); });
  }
  document.querySelectorAll('#sysChips .chip').forEach(function (c) { c.addEventListener('click', function () { showSys(c.getAttribute('data-sys')); }); });
  var chart = document.getElementById('chart');
  var chio = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { showSys('martingale'); chio.disconnect(); } }); }, { threshold: 0.4 });
  if (chart) chio.observe(chart);
})();
