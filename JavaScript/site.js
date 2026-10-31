// ---- Отзывы: стрелки и раскрытие текста ----
(function () {
  var track = document.querySelector('.reviews-track');
  if (!track) return;
  var step = function () { var c = track.querySelector('.review'); return c ? c.getBoundingClientRect().width + 20 : 300; };
  var prev = document.getElementById('reviews-prev'), next = document.getElementById('reviews-next');
  if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.querySelectorAll('.review').forEach(function (card) {
    var btn = card.querySelector('.review-more'), text = card.querySelector('.review-text');
    if (!btn) return;
    if (text.scrollHeight <= text.clientHeight + 2) { btn.hidden = true; return; }
    btn.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      btn.textContent = open ? 'Свернуть' : 'Читать полностью';
    });
  });
})();

// ---- Форма: сообщение сразу уходит в WhatsApp ----
(function () {
  var form = document.getElementById('wa-form');
  if (!form) return;
  var NUMBER = '996778264606';
  var T = {
    ru: { hi: 'Здравствуйте!', name: 'Меня зовут', product: 'Продукт:',
          order: 'Хочу заказать', info: 'Хочу узнать о продукте', delivery: 'Хочу узнать о доставке', other: 'У меня есть вопрос' },
    ky: { hi: 'Саламатсызбы!', name: 'Менин атым', product: 'Продукт:',
          order: 'Заказ бергим келет', info: 'Продукт тууралуу билгим келет', delivery: 'Жеткирүү тууралуу билгим келет', other: 'Менин суроом бар' }
  };
  var name = document.getElementById('wa-name'), product = document.getElementById('wa-product'),
      question = document.getElementById('wa-question'), preview = document.getElementById('wa-preview');
  function val(n) { return form.querySelector('input[name="' + n + '"]:checked').value; }
  function build() {
    var t = T[val('lang')];
    var text = t.hi + ' ' + t[val('topic')] + '.';
    if (name.value.trim()) text += ' ' + t.name + ' ' + name.value.trim() + '.';
    if (product.value) text += ' ' + t.product + ' ' + product.value + '.';
    if (question.value.trim()) text += '\n' + question.value.trim();
    return text;
  }
  function update() { preview.textContent = build(); }
  ['input', 'change'].forEach(function (ev) { form.addEventListener(ev, update); });
  update();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.open('https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(build()), '_blank', 'noopener');
  });
})();

// ---- Каталог: показать все продукты ----
(function () {
  var btn = document.getElementById('show-more'), list = document.getElementById('catalog');
  if (!btn || !list) return;
  btn.addEventListener('click', function () {
    var open = list.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.firstChild.textContent = open ? 'Скрыть' : 'Показать все продукты ';
    var sp = btn.querySelector('span'); if (sp) sp.hidden = open;
  });
})();

// ---- Выбор продукта: список с фото ----
(function () {
  var wrap = document.getElementById('wa-picker');
  if (!wrap) return;
  var btn = document.getElementById('picker-btn'), list = document.getElementById('picker-list'),
      cur = document.getElementById('picker-cur'), input = document.getElementById('wa-product');
  var opts = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
  var active = 0;
  function setActive(i) {
    active = Math.max(0, Math.min(opts.length - 1, i));
    opts.forEach(function (o, k) { o.classList.toggle('is-active', k === active); });
    list.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  }
  function open() {
    list.hidden = false; btn.setAttribute('aria-expanded', 'true');
    var sel = opts.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
    setActive(sel < 0 ? 0 : sel); list.focus({ preventScroll: true });
  }
  function close(focusBtn) { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focusBtn) btn.focus(); }
  function choose(i) {
    var o = opts[i];
    opts.forEach(function (x) { x.setAttribute('aria-selected', x === o ? 'true' : 'false'); });
    input.value = o.getAttribute('data-value');
    cur.innerHTML = '';
    if (input.value) {
      var im = o.querySelector('img');
      if (im) { var c = im.cloneNode(); c.removeAttribute('loading'); cur.appendChild(c); }
      var t = document.createElement('span'); t.textContent = input.value; cur.appendChild(t);
    } else {
      var p = document.createElement('span'); p.className = 'picker-ph'; p.textContent = 'Продукт (по желанию)'; cur.appendChild(p);
    }
    input.dispatchEvent(new Event('change', { bubbles: true }));
    close(true);
  }
  btn.addEventListener('click', function () { list.hidden ? open() : close(false); });
  opts.forEach(function (o, i) { o.addEventListener('click', function () { choose(i); }); });
  list.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(opts.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') { close(false); }
  });
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (list.hidden) open(); }
  });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(false); });
})();
