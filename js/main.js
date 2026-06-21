/* SUAS website — main.js (single file, no imports needed) */
(function () {
  'use strict';

  function initNav() {
    const header    = document.querySelector('.site-header');
    const hamburger = document.querySelector('.nav__hamburger');
    const menu      = document.querySelector('.nav__menu');

    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    if (hamburger && menu) {
      hamburger.addEventListener('click', function () {
        var expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        hamburger.classList.toggle('open', !expanded);
        menu.classList.toggle('open', !expanded);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('open');
          menu.classList.remove('open');
          hamburger.focus();
        }
      });

      menu.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('open');
          menu.classList.remove('open');
        });
      });
    }
  }

  function initAnimations() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  function initUtils() {
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initVehicle() {
    var fills = document.querySelectorAll('.perf-bar__fill');
    if (!fills.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target;
          fill.style.width = (fill.dataset.pct || '0') + '%';
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(function (fill) {
      fill.style.width = '0%';
      observer.observe(fill);
    });
  }

  function initBlog() {
    var filterBtns = document.querySelectorAll('[data-filter]');
    var posts      = document.querySelectorAll('[data-category]');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        var filter = btn.dataset.filter;
        posts.forEach(function (post) {
          post.style.display = (filter === 'all' || post.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initAnimations();
    initUtils();

    var page = document.body.dataset.page;
    if (page === 'vehicle')                            initVehicle();
    if (page === 'blog' || page === 'blog-post')       initBlog();
  });
}());
