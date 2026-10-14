import { useEffect } from 'react';

// Quiet scroll-in effect. Anything already on screen is left alone (no flicker); things further down
// start slightly lowered and transparent, then settle into place as they come into view.
const SEL = '.section, .about-hero, .tile, .coll-card, .review, .why-item, .make-card, .step, .c-form-inner';

export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const vh = () => window.innerHeight || 800;

    const tag = (el) => {
      if (el.dataset.rv) return;
      el.dataset.rv = '1';
      if (el.getBoundingClientRect().top < vh() * 0.95) return;
      el.classList.add('reveal');
    };
    const scan = (root) => {
      if (root.matches && root.matches(SEL)) tag(root);
      if (root.querySelectorAll) root.querySelectorAll(SEL).forEach(tag);
    };
    let queued = false;
    const check = () => {
      queued = false;
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < vh() * 0.92) el.classList.add('in');
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };

    scan(document.body);
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && scan(n)));
      queue();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    queue();
    return () => {
      mo.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);
  return null;
}
