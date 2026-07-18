/* EnhanceBiz — shared UI behavior (nav shadow, mobile menu, scroll reveal) */
(function () {
  var nav = document.getElementById('ebNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    });
  }
  var burger = document.getElementById('ebBurger');
  var mobile = document.getElementById('ebMobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      mobile.classList.toggle('open');
      burger.innerHTML = mobile.classList.contains('open')
        ? '<i class="fa fa-times"></i>' : '<i class="fa fa-bars"></i>';
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('open');
        burger.innerHTML = '<i class="fa fa-bars"></i>';
      });
    });
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });

  // FAQ accordion
  document.querySelectorAll('.eb-faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentNode;
      var isOpen = item.classList.contains('open');
      // close siblings for a clean single-open accordion
      var parent = item.parentNode;
      parent.querySelectorAll('.eb-faq__item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // Animated counters (count up when scrolled into view)
  function ebCount(el){
    var raw = el.getAttribute('data-to'); var to = parseFloat(raw);
    var dec = (raw.split('.')[1] || '').length;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent = to.toFixed(dec); return; }
    var dur = 1300, t0 = null;
    requestAnimationFrame(function step(ts){
      if(!t0) t0 = ts; var p = Math.min((ts - t0)/dur, 1);
      el.textContent = (to * (0.5 - Math.cos(Math.PI*p)/2)).toFixed(dec);
      if(p < 1) requestAnimationFrame(step); else el.textContent = to.toFixed(dec);
    });
  }
  var ebCio = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ ebCount(e.target); ebCio.unobserve(e.target); } }); }, { threshold: 0.5 });
  document.querySelectorAll('.eb-count').forEach(function(el){ ebCio.observe(el); });
})();
