import React, { useEffect } from 'react';
import { CloseIcon, InstagramIcon, FacebookIcon, WhatsAppIcon, PhoneIcon, MailIcon } from './Icons.jsx';
import { img } from '../api.js';

export default function EnquireModal({ site, product, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);

  const text = product
    ? `Hi Anukala! I'm interested in "${product.name}" (${product.subcategoryLabel}). Could you share more details?`
    : "Hi Anukala! I'd like to know more about your handcrafted pieces.";
  const wa = site.contact?.whatsapp ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}` : null;
  const mail = site.contact?.email ? `mailto:${site.contact.email}?subject=${encodeURIComponent(product ? `Enquiry: ${product.name}` : 'Enquiry from the Anukala website')}&body=${encodeURIComponent(text)}` : null;
  const tel = site.contact?.phone ? `tel:${site.contact.phone.replace(/[^+\d]/g, '')}` : null;

  return (
    <div className="modal-wrap" onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact us">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" aria-label="Close" onClick={onClose}><CloseIcon /></button>
        <h2>Contact Us</h2>
        {product && (
          <div className="modal-product">
            <img src={img(product.images[0], 'thumb')} alt="" />
            <div>
              <strong>{product.name}</strong>
              <span className="muted">{product.subcategoryLabel}</span>
            </div>
          </div>
        )}
        <p className="muted">Tell us what you'd like, including your name, size and colour preferences, and we'll get back to you with details and a quote.</p>
        <div className="contact-list">
          {wa && <a className="contact-btn wa" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> Message on WhatsApp</a>}
          {site.socials?.instagram && <a className="contact-btn" href={site.socials.instagram} target="_blank" rel="noreferrer"><InstagramIcon /> Instagram · @anukala.home</a>}
          {site.socials?.facebook && <a className="contact-btn" href={site.socials.facebook} target="_blank" rel="noreferrer"><FacebookIcon /> Facebook · Anukala</a>}
          {mail && <a className="contact-btn" href={mail}><MailIcon /> {site.contact.email}</a>}
          {tel && <a className="contact-btn" href={tel}><PhoneIcon /> Call {site.contact.phone}</a>}
        </div>
      </div>
    </div>
  );
}
