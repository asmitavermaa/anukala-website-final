import React from 'react';
import { useSite } from '../SiteContext.jsx';
import { InstagramIcon, FacebookIcon, WhatsAppIcon, PhoneIcon, MailIcon } from './Icons.jsx';

// The four ways to reach Anukala. Pure links, so the site stays fully static.
export default function ReachOut({ message = "Hi Anukala! I'd like to know more about your handcrafted pieces.", subject = 'Enquiry from the Anukala website', phone = true }) {
  const { site } = useSite();
  if (!site) return null;
  const c = site.contact || {};
  const wa = c.whatsapp && `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(message)}`;
  const mail = c.email && `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  return (
    <div className="contact-list">
      {wa && <a className="contact-btn wa" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp</a>}
      {site.socials?.instagram && <a className="contact-btn" href={site.socials.instagram} target="_blank" rel="noreferrer"><InstagramIcon /> Instagram · @anukala.home</a>}
      {site.socials?.facebook && <a className="contact-btn" href={site.socials.facebook} target="_blank" rel="noreferrer"><FacebookIcon /> Facebook · Anukala</a>}
      {mail && <a className="contact-btn" href={mail}><MailIcon /> {c.email}</a>}
      {phone && c.phone && <a className="contact-btn" href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}><PhoneIcon /> {c.phone}</a>}
    </div>
  );
}
