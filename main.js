(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.getElementById('menu').addEventListener('click', function () { nav.classList.toggle('open'); });
  document.querySelectorAll('#links a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });

  // wheel: 37 pockets in true order
  var ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  var RED = {1:1,3:1,5:1,7:1,9:1,12:1,14:1,16:1,18:1,19:1,21:1,23:1,25:1,27:1,30:1,32:1,34:1,36:1};
  var svg = document.getElementById('wheelSvg');
  if (svg) {
    var n = 37, st = Math.PI * 2 / n, c = 200;
    var P = function (r, a) { return (c + r * Math.cos(a)).toFixed(2) + ' ' + (c + r * Math.sin(a)).toFixed(2); };
    var W = function (r1, r2, a0, a1) { return 'M' + P(r2, a0) + ' A' + r2 + ' ' + r2 + ' 0 0 1 ' + P(r2, a1) + ' L' + P(r1, a1) + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + P(r1, a0) + ' Z'; };
    var s = '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F1D58C"/><stop offset=".45" stop-color="#B98A2E"/><stop offset="1" stop-color="#6E5216"/></linearGradient>' +
      '<radialGradient id="bowl" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#173F2F"/><stop offset="1" stop-color="#061510"/></radialGradient>' +
      '<radialGradient id="rim" cx="50%" cy="50%" r="50%"><stop offset=".86" stop-color="#1A120A"/><stop offset="1" stop-color="#0B0704"/></radialGradient></defs>';
    s += '<circle cx="200" cy="200" r="198" fill="url(#rim)"/><circle cx="200" cy="200" r="192" fill="none" stroke="url(#g)" stroke-width="2.5"/>';
    for (var i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + (i - .5) * st, a1 = a0 + st, m = (a0 + a1) / 2, num = ORDER[i];
      var fill = num === 0 ? '#14583A' : RED[num] ? '#8E1A21' : '#111312';
      var tx = c + 168 * Math.cos(m), ty = c + 168 * Math.sin(m);
      s += '<path d="' + W(140, 186, a0, a1) + '" fill="' + fill + '" stroke="#B98A2E" stroke-opacity=".55" stroke-width=".8"/>';
      s += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" font-family="Inter,sans-serif" font-weight="500" font-size="10.5" fill="#EDE6D4" text-anchor="middle" dominant-baseline="middle" transform="rotate(' + (m * 180 / Math.PI + 90).toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')">' + num + '</text>';
    }
    s += '<circle cx="200" cy="200" r="140" fill="none" stroke="url(#g)" stroke-width="1.6"/><circle cx="200" cy="200" r="134" fill="url(#bowl)"/>';
    s += '<circle cx="200" cy="200" r="96" fill="none" stroke="rgba(241,213,140,.12)" stroke-width="1"/>';
    for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2 + Math.PI / 4; s += '<path d="M' + P(22, a) + ' L' + P(84, a) + '" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/><circle cx="' + (c + 86 * Math.cos(a)).toFixed(1) + '" cy="' + (c + 86 * Math.sin(a)).toFixed(1) + '" r="4" fill="url(#g)"/>'; }
    s += '<circle cx="200" cy="200" r="24" fill="url(#g)"/><circle cx="200" cy="200" r="9" fill="#0C1F17"/>';
    svg.innerHTML = s;
    var rot = 0, last = 0;
    (function tick(t) {
      if (!reduce) { rot += (last ? Math.min(40, t - last) : 16) * 0.003; last = t; svg.style.transform = 'rotate(' + (rot + window.scrollY * 0.08).toFixed(2) + 'deg)'; }
      requestAnimationFrame(tick);
    })(0);
  }

  // reveals
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  // pinned showcase: active panel drives the phone screen
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  var shots = [].slice.call(document.querySelectorAll('#showDevice img'));
  function setActive(i) { panels.forEach(function (p, j) { p.classList.toggle('on', j === i); }); shots.forEach(function (im, j) { im.classList.toggle('on', j === i); }); }
  var pio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setActive(+e.target.getAttribute('data-i')); }); }, { rootMargin: '-45% 0px -45% 0px' });
  panels.forEach(function (p) { pio.observe(p); });
  setActive(0);

  // live app in the try section
  var frame = document.getElementById('appFrame'), loading = document.getElementById('loading'), started = false;
  var tio = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (!e.isIntersecting || started) return; started = true;
    frame.addEventListener('load', function () { setTimeout(function () { loading.classList.add('hide'); }, 700); });
    frame.src = 'app/play?seed=1';
  }); }, { rootMargin: '400px' });
  tio.observe(document.getElementById('tryDevice'));
})();
