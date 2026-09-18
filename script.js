/* ============================================================
   HYDROLIX — Interactions
   ============================================================ */
(function () {
  'use strict';

  // --- Loader ---
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loader-progress');
  let loaded = false;

  function hideLoader() {
    if (loaded) return;
    loaded = true;
    progress.style.width = '100%';
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initReveal();
    }, 500);
  }

  document.body.style.overflow = 'hidden';
  progress.style.width = '30%';

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hideLoader, 300);
    });
  }

  // Fallback
  setTimeout(hideLoader, 3000);

  // --- Mobile Nav ---
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navBackdrop = document.getElementById('navBackdrop');

  function openNav() {
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeNav);
    }

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  // --- Navbar scroll ---
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.pageYOffset > 60);
  }, { passive: true });

  // --- Active link ---
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    var pos = window.pageYOffset + 150;
    sections.forEach(function (s) {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        var id = s.getAttribute('id');
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Reveal on scroll ---
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    els.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      observer.observe(el);
    });
  }

  // --- Counter animation ---
  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function step(time) {
          if (!startTime) startTime = time;
          var progress = Math.min((time - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { counterObserver.observe(c); });

  // --- Portfolio Filter ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');

      workCards.forEach(function (card) {
        var cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Form Validation ---
  var form = document.getElementById('contactForm');
  if (form) {
    var fields = {
      name: {
        el: document.getElementById('name'),
        err: document.getElementById('nameError'),
        validate: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; }
      },
      email: {
        el: document.getElementById('email'),
        err: document.getElementById('emailError'),
        validate: function (v) {
          if (!v.trim()) return 'Email is required.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email.';
          return '';
        }
      },
      message: {
        el: document.getElementById('message'),
        err: document.getElementById('messageError'),
        validate: function (v) { return v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'; }
      }
    };

    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      f.el.addEventListener('blur', function () {
        var msg = f.validate(f.el.value);
        f.err.textContent = msg;
        f.el.classList.toggle('error', !!msg);
      });
      f.el.addEventListener('input', function () {
        if (f.err.textContent) {
          var msg = f.validate(f.el.value);
          f.err.textContent = msg;
          f.el.classList.toggle('error', !!msg);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstErr = null;
      Object.keys(fields).forEach(function (key) {
        var f = fields[key];
        var msg = f.validate(f.el.value);
        f.err.textContent = msg;
        f.el.classList.toggle('error', !!msg);
        if (msg && !firstErr) firstErr = f.el;
      });
      if (firstErr) { firstErr.focus(); return; }

      var btn = form.querySelector('.btn-submit');
      btn.classList.add('loading');
      btn.disabled = true;

      setTimeout(function () {
        btn.classList.remove('loading');
        btn.disabled = false;
        form.reset();
        var success = document.getElementById('formSuccess');
        success.classList.add('show');
        setTimeout(function () { success.classList.remove('show'); }, 5000);
      }, 1500);
    });
  }

  // --- Keyboard trap for mobile nav ---
  document.addEventListener('keydown', function (e) {
    if (!navMenu || !navMenu.classList.contains('open')) return;
    var focusable = navMenu.querySelectorAll('a, button');
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

})();
