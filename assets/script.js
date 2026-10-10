/* ============================================
   SEO Expert In Bangladesh - Main JavaScript
   Author: Rojob Ali
   ============================================ */

(function() {
  'use strict';

  /* ==========================================
     1. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================
     2. ANIMATED COUNTERS (with IntersectionObserver)
     ========================================== */
  var counters = document.querySelectorAll('.counter-number');

  function startCounter(counter) {
    var target = +counter.getAttribute('data-target');
    var count = 0;
    var duration = 1600; // ms
    var steps = 80;
    var inc = target / steps;
    var stepTime = duration / steps;

    var timer = setInterval(function(){
      count += inc;
      if (count >= target) {
        count = target;
        clearInterval(timer);
        counter.innerText = target + (target >= 10 ? '+' : '');
      } else {
        counter.innerText = Math.floor(count);
      }
    }, stepTime);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          startCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function(c){ counterObserver.observe(c); });
  } else {
    counters.forEach(startCounter);
  }

  /* ==========================================
     3. FAQ ACCORDION
     ========================================== */
  window.toggleFaq = function(btn) {
    var answer = btn.nextElementSibling;
    var isActive = btn.classList.contains('active');

    document.querySelectorAll('.faq-question').forEach(function(q){ q.classList.remove('active'); });
    document.querySelectorAll('.faq-answer').forEach(function(a){ a.classList.remove('active'); });

    if (!isActive) {
      btn.classList.add('active');
      answer.classList.add('active');
    }
  };

  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click', function(){ window.toggleFaq(this); });
  });

  /* ==========================================
     4. MOBILE NAV TOGGLE
     ========================================== */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(){
      navMenu.classList.toggle('open');
    });
  }

  /* Close mobile menu on link click */
  document.querySelectorAll('.nav-menu a').forEach(function(link){
    link.addEventListener('click', function(){
      if (navMenu) navMenu.classList.remove('open');
    });
  });

  /* ==========================================
     5. AUTO-SLIDING CAROUSEL (3s interval)
     - Case Study carousel
     - Testimonial carousel
     ========================================== */
  function initCarousel(config) {
    var wrap = document.querySelector('[data-carousel="' + config.name + '"]');
    if (!wrap) return;

    var track = wrap.querySelector('.carousel-track');
    var slides = wrap.querySelectorAll('.carousel-slide');
    var dots = wrap.querySelectorAll('.carousel-dot');
    var total = slides.length;
    if (total <= 1) return;

    var interval = parseInt(wrap.getAttribute('data-interval') || config.interval || 3000, 10);
    var current = 0;
    var timer = null;
    var isPaused = false;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function(dot, i){
        dot.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current + 1); }

    function start() {
      stop();
      timer = setInterval(function(){
        if (!isPaused) next();
      }, interval);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    /* Dot navigation */
    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(){
        goTo(i);
        start(); // restart timer
      });
    });

    /* Pause on hover (desktop) */
    wrap.addEventListener('mouseenter', function(){ isPaused = true; });
    wrap.addEventListener('mouseleave', function(){ isPaused = false; });

    /* Pause when tab hidden — saves CPU */
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) stop();
      else start();
    });

    /* Touch swipe support */
    var touchStartX = 0;
    var touchEndX = 0;
    wrap.addEventListener('touchstart', function(e){
      touchStartX = e.changedTouches[0].screenX;
      isPaused = true;
    }, { passive: true });

    wrap.addEventListener('touchend', function(e){
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      isPaused = false;
    }, { passive: true });

    function handleSwipe() {
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else goTo(current - 1);
        start();
      }
    }

    /* Initialize */
    goTo(0);
    start();
  }

  /* Wait for DOM ready */
  function bootCarousels() {
    initCarousel({ name: 'case', interval: 3000 });
    initCarousel({ name: 'testimonial', interval: 3000 });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCarousels);
  } else {
    bootCarousels();
  }

  /* ==========================================
     6. BLOGGER ?m=1 CLEAN URL FIX
     ========================================== */
  try {
    var loc = window.location;
    var s = loc.search || '';
    if (/(^|[?&])m=1(&|$)/.test(s)) {
      var cleanUrl = loc.pathname + loc.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (e) {}

})();