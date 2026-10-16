/* DC City FC — Homepage.js
   Pairs with Homepage.html + Homepage.css.
   Progressive enhancement only — the page is fully usable with this file absent.

   Enqueue in WordPress with defer, e.g.:
     wp_enqueue_script('dcfc-homepage', get_stylesheet_directory_uri().'/Homepage.js', array(), '1.0.0', true);
*/
(function () {
  'use strict';

  var root = document.querySelector('.dcfc-page');
  if (!root) return;

  /* ---------- Next-match countdown ----------
     Kickoff comes from data-kickoff (ISO 8601 with offset) on .dcfc-next__card.
     Update that attribute + the card text after each matchday. */
  var card = root.querySelector('.dcfc-next__card');
  if (card) {
    var kickoff = new Date(card.getAttribute('data-kickoff')).getTime();
    var cells = {};
    ['d', 'h', 'm', 's'].forEach(function (k) { cells[k] = card.querySelector('[data-cd="' + k + '"]'); });
    var box = card.querySelector('.dcfc-countdown');

    var tick = function () {
      var diff = kickoff - Date.now();
      if (isNaN(kickoff)) { box.hidden = true; return true; }
      if (diff <= 0) { box.hidden = true; return true; }
      var s = Math.floor(diff / 1000);
      cells.d.textContent = Math.floor(s / 86400);
      cells.h.textContent = pad(Math.floor(s % 86400 / 3600));
      cells.m.textContent = pad(Math.floor(s % 3600 / 60));
      cells.s.textContent = pad(s % 60);
      return false;
    };
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    if (!tick()) {
      var timer = setInterval(function () { if (tick()) clearInterval(timer); }, 1000);
    }
  }

  /* ---------- Squad search ---------- */
  var input = root.querySelector('#dcfc-search');
  var empty = root.querySelector('#dcfc-empty');
  var players = root.querySelectorAll('#dcfc-players [data-p]');
  if (input && players.length) {
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      players.forEach(function (li) {
        var match = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
        li.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  root.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
