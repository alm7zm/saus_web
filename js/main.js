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

  function initSearch() {
    var searchInput = document.getElementById('search');
    var resultsContainer = document.getElementById('search-results');

    if(!searchInput || !resultsContainer) return;

    var searchData = [];
    var currentMatches = [];

    fetch('/data/index-search.json')
      .then(function (response) {
        if(!response.ok) throw new Error('Search data file not found');
        return response.json();
      })
      .then(function(data) {
        console.log('Search data loaded:', data);
        searchData = data;
      })
      .catch(function(err) {
        console.error('Error loading search index', err)
      })

  function createSnippet(content, query) {
    var words = content.split(/\s+/);

    var matchIndex = words.findIndex(function(word) {
      return word.toLowerCase().includes(query.toLowerCase());
    });

    if (matchIndex === -1) {
      return '';
    }

    var start = Math.max(0, matchIndex - 3);
    var end = Math.min(words.length, matchIndex + 4);

    var snippet = words
      .slice(start, end)
      .map(function(word) {
        if (word.toLowerCase().includes(query.toLowerCase())) {
          return '<mark>' + word + '</mark>';
        }
        return word;
      })
      .join(' ');

      return '...' + snippet + '...';
  }

      searchInput.addEventListener('input', function(e) {
        var query = e.target.value.toLowerCase().trim();

        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('is-visible');

        if(query.length < 2) {
          currentMatches = [];
          return;
        }

        currentMatches = searchData.filter(function(page) {
          return (page.title.toLowerCase().includes(query) || page.content.toLowerCase().includes(query));
        });

        if(currentMatches.length > 0) {
          currentMatches.forEach(function(item) {
            var resultItem = document.createElement('a');

            resultItem.href = item.url + '?search=' + encodeURIComponent(query);
            resultItem.className = 'search-results__link';

            var snippet = createSnippet(item.content, query);

            resultItem.innerHTML = '<strong class="search-results__title">' + item.title + '</strong>' + '<small class="search-results__snippet">' + snippet + '</small>';

            resultsContainer.appendChild(resultItem);
          });

          resultsContainer.classList.add('is-visible');
        } else {
          resultsContainer.innerHTML = '<p class="search-results__empty">No results found</p>';
          resultsContainer.classList.add('is-visible');
        }
      });

      searchInput.addEventListener('keydown', function (e) {
        if(e.key == 'Enter') {
          e.preventDefault();

          if(currentMatches.length > 0){
            var query = searchInput.value.trim();

            window.location.href = currentMatches[0].url + '?search=' + encodeURIComponent(query);
          }
        }
      })

      document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
          resultsContainer.classList.remove('is-visible');
        }
      });
  }

  function highlightSearchResult() {
  var params = new URLSearchParams(window.location.search);
  var search = params.get('search');

  if (!search) return;

  search = search.trim().toLowerCase();

  var elements = document.querySelectorAll(
    'main h1, main h2, main h3, main h4, main h5, main h6, main p, main li, main td, main th, main span, main div'
  );

  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];

    // Ignore empty elements or elements containing other block elements
    if (el.children.length > 0 && !['SPAN', 'STRONG', 'EM', 'MARK'].includes(el.children[0].tagName)) {
      continue;
    }

    var text = el.textContent;

    if (!text) continue;

    var index = text.toLowerCase().indexOf(search);

    if (index !== -1) {
      var before = text.substring(0, index);
      var match = text.substring(index, index + search.length);
      var after = text.substring(index + search.length);

      el.innerHTML =
        before +
        '<mark class="page-search-highlight">' +
        match +
        '</mark>' +
        after;

      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      return;
    }
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
    initSearch();
    highlightSearchResult();
    initAnimations();
    initUtils();

    var page = document.body.dataset.page;
    if (page === 'vehicle')                            initVehicle();
    if (page === 'blog' || page === 'blog-post')       initBlog();
  });
}());
