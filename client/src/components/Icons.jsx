import React from 'react';

const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ChevronDown = (p) => (
  <svg {...base} width="12" height="12" {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const InstagramIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>
);
export const FacebookIcon = (p) => (
  <svg {...base} {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z" /></svg>
);
export const WhatsAppIcon = (p) => (
  <svg {...base} {...p}><path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5L3 21Z" /><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.3-1.2-1.8-1-.7.7c-.8-.3-1.6-1.1-1.9-1.9l.7-.7-1-1.8L9 9.5Z" /></svg>
);
export const PhoneIcon = (p) => (
  <svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const ArrowRight = (p) => (
  <svg {...base} width="16" height="16" {...p}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);
export const StarIcon = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2 3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5L9 8.9 12 2Z" /></svg>
);

export const BrushIcon = (p) => (
  <svg {...base} width="34" height="34" {...p}><path d="M18.4 3.6a2 2 0 0 1 2.9 2.9L11 16.8l-3.6-3.6L18.4 3.6Z" /><path d="M7.4 13.2c-2.6.2-3.6 2-3.9 4.3-.1.8-.4 1.6-1.1 2.5 3.3.8 6.3.4 7.9-1.6.8-1 .9-2 .6-2.9" /></svg>
);
export const SlidersIcon = (p) => (
  <svg {...base} width="34" height="34" {...p}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
);
export const PaletteIcon = (p) => (
  <svg {...base} width="34" height="34" {...p}><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.2-1-1.5-1-2.7 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="10" cy="7.2" r="1" fill="currentColor" /><circle cx="14.5" cy="7.2" r="1" fill="currentColor" /></svg>
);
export const SparkleIcon = (p) => (
  <svg {...base} width="34" height="34" {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16Z" /></svg>
);
export const PinIcon = (p) => (
  <svg {...base} width="34" height="34" {...p}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);

export const MailIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
);
