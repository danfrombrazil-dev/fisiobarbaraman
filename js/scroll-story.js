/**
 * scroll-story.js — Fisio Barbara Man
 * Interação central: percurso coreografado por scroll.
 *
 * Técnicas:
 *   - GSAP ScrollTrigger: scrub + pin
 *   - stroke-dashoffset para traçado do percurso
 *   - getPointAtLength() para posicionar o dot do paciente
 *   - Ritmos distintos de entrada por seção
 *   - Fallback estático para prefers-reduced-motion
 *
 * Estrutura:
 *   1. Guarda & Detecção
 *   2. Interação Hero: planta baixa com traçado por scroll
 *   3. Seção Serviços: pin + troca de atos
 *   4. Reveals Sobre
 *   5. Reveals Contato
 *   6. Indicador de Progresso Global
 *   7. Init
 */

(function () {
  'use strict';

  /* ── 1. GUARDA & DETECÇÃO ──────────────────────────────── */

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Se prefers-reduced-motion, o CSS já expõe tudo estático.
  // Ainda assim rodamos algumas inicializações não-animadas.
  if (prefersReduced) {
    initNavScroll();
    return;
  }

  // Espera o GSAP estar disponível (carregado via CDN no HTML)
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[scroll-story] GSAP ou ScrollTrigger não encontrados.');
    revealAll(); // fallback: exibe tudo
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Configuração global do GSAP para este site
  gsap.defaults({
    ease: 'power2.out',
    overwrite: 'auto',
  });

  /* ── UTILIDADES ─────────────────────────────────────────── */

  /** Verifica se um elemento existe no DOM */
  const el = (selector) => document.querySelector(selector);
  const els = (selector) => [...document.querySelectorAll(selector)];

  /** Fallback: revela todos os elementos caso algo falhe */
  function revealAll() {
    document.querySelectorAll(
      '.apresentacao__vinco, .apresentacao__lead, .apresentacao__body, ' +
      '.apresentacao__actions, .servicos__intro p, .sobre__photo-col, ' +
      '.sobre__text-col, .sobre__name, .sobre__subtitle, .sobre__quote, ' +
      '.sobre__bio, .sobre__credentials, .contato__statement, ' +
      '.contato__steps-col, .contato__cta-block, .contato__step, ' +
      '.house-journey__caption, .room-label, .journey-dot, .journey-dot-ring'
    ).forEach((node) => {
      node.style.opacity = '1';
      node.style.transform = 'none';
      node.style.clipPath = 'none';
    });
    const path = el('.journey-path');
    if (path) path.style.strokeDashoffset = '0';
  }


  /* ── 2. INTERAÇÃO HERO — PLANTA BAIXA ──────────────────── */
  /**
   * A planta baixa SVG de uma residência é desenhada conforme
   * o scroll avança na seção de apresentação.
   * O percurso: cama → porta do quarto → corredor → escada → porta.
   * Um ponto (dot) caminha pelo percurso usando getPointAtLength().
   */
  function initHeroJourney() {
    const svg      = el('.house-journey__svg');
    const path     = el('.journey-path');
    const dot      = el('.journey-dot');
    const ring     = el('.journey-dot-ring');
    const caption  = el('.house-journey__caption');
    const labels   = els('.room-label');
    const section  = el('#apresentacao');

    if (!svg || !path || !section) return;

    // Calcula o comprimento total do percurso
    const totalLength = path.getTotalLength();
    path.style.setProperty('--path-length', totalLength);
    path.style.strokeDasharray  = totalLength;
    path.style.strokeDashoffset = totalLength;

    // 1. Revelação inicial editorial no Hero ao carregar a página (entrada suave)
    const introTl = gsap.timeline({ delay: 0.2 });
    introTl
      .to('.apresentacao__vinco', { scaleX: 1, duration: 0.8, ease: 'power2.out' })
      .to('.apresentacao__lead', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.out' }, '-=0.4')
      .to('.apresentacao__body', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to('.apresentacao__actions', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .to([dot, ring], { opacity: 1, duration: 0.5 }, '-=0.3')
      .call(() => caption && caption.classList.add('is-ready'));

    // 2. Traçado do percurso ligado ao scroll através do Hero
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom center',
        scrub: 0.8,
        onUpdate: function (self) {
          const progress = self.progress;
          const currentDist = progress * totalLength;
          const pos = path.getPointAtLength(currentDist);
          if (dot) {
            dot.setAttribute('cx', pos.x);
            dot.setAttribute('cy', pos.y);
            ring.setAttribute('cx', pos.x);
            ring.setAttribute('cy', pos.y);
          }
          // Revela etiquetas conforme o progresso do percurso
          labels.forEach((label) => {
            const threshold = parseFloat(label.dataset.threshold || 0);
            if (progress >= threshold) {
              label.classList.add('is-revealed');
            } else {
              label.classList.remove('is-revealed');
            }
          });
        },
      },
    });
  }


  /* ── 3. CENA PINNED — SERVIÇOS ──────────────────────────── */
  /**
   * A seção de serviços é fixada (pinned) enquanto 3 atos se
   * sucedem. Cada ato corresponde a um serviço.
   * No painel esquerdo: texto troca. No direito: ilustração troca.
   * Na parte inferior: indicador de progresso em dots.
   */
  function initServiceScene() {
    const stage   = el('.scene-stage');
    const acts    = els('.scene-act');
    const visuals = els('.scene-visual');
    const dots    = els('.scene-progress__dot');

    if (!stage || acts.length === 0) return;

    const isMobile   = window.innerWidth < 768;
    const numActs    = acts.length;
    const actHeight  = isMobile ? window.innerHeight * 0.7 : window.innerHeight;

    // Estado: qual ato está ativo
    let currentAct = -1;

    function activateAct(index) {
      if (index === currentAct) return;
      currentAct = index;

      acts.forEach((act, i) => {
        if (i === index) {
          act.classList.add('is-active');
        } else {
          act.classList.remove('is-active');
        }
      });

      visuals.forEach((vis, i) => {
        if (i === index) {
          gsap.to(vis, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        } else {
          gsap.to(vis, { opacity: 0, duration: 0.35, ease: 'power1.in' });
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    }

    // Ativa o primeiro ato imediatamente
    activateAct(0);

    // Timeline com ScrollTrigger direto na stage
    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${actHeight * (numActs - 0.5)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 0,
      onUpdate: (self) => {
        const progress = self.progress;
        const actIndex = Math.min(
          Math.floor(progress * numActs),
          numActs - 1
        );
        activateAct(actIndex);
      },
    });

    // Animação interna de cada ato quando é ativado
    // (via MutationObserver nas classes is-active)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList.contains('is-active') && target.classList.contains('scene-act')) {
            // Anima os elementos internos do ato ativo
            const children = target.querySelectorAll('.scene-act__num, .scene-act__title, .scene-act__body, .scene-act__tags');
            gsap.fromTo(children,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', delay: 0.1 }
            );
          }
        }
      });
    });

    acts.forEach((act) => {
      observer.observe(act, { attributes: true, attributeFilter: ['class'] });
    });
  }


  /* ── 4. REVEALS SOBRE ────────────────────────────────────── */
  function initSobre() {
    const section = el('#sobre');
    if (!section) return;

    // Retrato: desliza suavemente da esquerda
    gsap.from('.sobre__photo-col', {
      opacity: 0,
      x: -28,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Coluna de texto: entra da direita
    gsap.from('.sobre__text-col', {
      opacity: 0,
      x: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Cascata dos blocos da biografia
    const cascadeEls = els('.sobre__name, .sobre__subtitle, .sobre__quote, .sobre__bio, .sobre__credentials');
    gsap.from(cascadeEls, {
      opacity: 0,
      y: 14,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el('.sobre__text-col'),
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }


  /* ── 5. REVEALS CONTATO ─────────────────────────────────── */
  function initContato() {
    const section = el('#contato');
    if (!section) return;

    // Statement entra da esquerda
    gsap.from('.contato__statement', {
      opacity: 0,
      x: -24,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Steps entram da direita
    gsap.from('.contato__steps-col', {
      opacity: 0,
      x: 24,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Steps em cascata
    gsap.from(els('.contato__step'), {
      opacity: 0,
      x: 14,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el('.contato__steps-col'),
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // CTA do contato sobe por baixo
    gsap.from('.contato__cta-block', {
      opacity: 0,
      y: 20,
      duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }


  /* ── 6. REVEAL INTRO SERVIÇOS ───────────────────────────── */
  function initServicosIntro() {
    const intro = el('.servicos__intro p');
    const container = el('.servicos__intro-container');
    if (!intro) return;

    // Revelação inicial do texto
    gsap.to(intro, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: intro,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Saída suave e gradual ao rolar em direção aos atos
    if (container) {
      gsap.to(container, {
        opacity: 0,
        y: -24,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: container,
          start: 'bottom 45%',
          end: 'bottom 5%',
          scrub: true,
        },
      });
    }
  }


  /* ── 7. INDICADOR DE PROGRESSO GLOBAL ───────────────────── */
  function initProgressTrack() {
    const track = el('.scroll-progress-track');
    const fill  = el('.scroll-progress-fill');
    if (!track || !fill) return;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;

        // Visível apenas entre 10% e 90% do scroll
        if (progress > 0.05 && progress < 0.95) {
          track.classList.add('is-visible');
        } else {
          track.classList.remove('is-visible');
        }

        fill.style.height = (progress * 100) + '%';
      },
    });
  }


  /* ── NAV SCROLL (da main.js — mantido aqui para centralizar) */
  function initNavScroll() {
    const nav = el('#site-nav');
    if (!nav) return;
    const handle = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', handle, { passive: true });
    handle();
  }


  /* ── INIT ──────────────────────────────────────────────── */
  function init() {
    initNavScroll();
    initHeroJourney();
    initServiceScene();
    initServicosIntro();
    initSobre();
    initContato();
    initProgressTrack();

    // Refresh após carregamento das fontes
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  // Espera o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
