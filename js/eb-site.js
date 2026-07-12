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
})();
