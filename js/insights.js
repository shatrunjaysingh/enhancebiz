/* Insights: filter the category sections from the filter bar or the nav dropdown
   (e.g. arriving at insights.html#case-studies shows only Case Studies). */
(function () {
  var bar = document.getElementById('ebInsightsFilter');
  if (!bar) return;
  var cats = ['blog', 'case-studies', 'white-papers', 'reports', 'news', 'events'];
  var links = bar.querySelectorAll('a[data-filter]');
  function apply(cat) {
    cats.forEach(function (id) {
      var s = document.getElementById(id);
      if (s) s.style.display = (cat === 'all' || cat === id) ? '' : 'none';
    });
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-filter') === cat); });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var f = a.getAttribute('data-filter');
      if (f === 'all') e.preventDefault();
      apply(f);
    });
  });
  function fromHash() { var h = location.hash.replace('#', ''); apply(cats.indexOf(h) >= 0 ? h : 'all'); }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
