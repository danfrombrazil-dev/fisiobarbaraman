/**
 * main.js — Fisio Barbara Man
 *
 * 1. Nav com estado "scrolled" (fundo canvas + borda aparecem após 60px)
 * 2. Scroll reveal via IntersectionObserver — sem scroll hijacking,
 *    sem bibliotecas externas, respeitando prefers-reduced-motion.
 */
(function () {
  'use strict';

  /* ── 1. Nav scrolled ───────────────────────────── */
  const nav = document.getElementById('site-nav');

  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. Scroll reveal ──────────────────────────── */
  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll('[data-reveal]');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    // Revela imediatamente: usuários com sensibilidade vestibular
    // ativam prefers-reduced-motion — ironicamente essencial para este site
    revealEls.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // revela uma única vez
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));

})();
