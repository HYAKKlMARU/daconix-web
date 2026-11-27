(function () {
  var e = window.EMPRESA || {};
  document.querySelectorAll('[data-empresa]').forEach(function (n) {
    var v = (e[n.dataset.empresa] || '').trim();
    if (v) { n.textContent = v; n.classList.remove('dato'); }
  });
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.href = 'https://wa.me/51999707530?text=' + encodeURIComponent(a.dataset.msg || '');
    a.target = '_blank'; a.rel = 'noopener';
  });
})();
