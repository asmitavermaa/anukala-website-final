import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../SiteContext.jsx';
import { InstagramIcon, FacebookIcon } from './Icons.jsx';
import { asset } from '../api.js';

export default function Footer() {
  const { site, categories, openEnquiry } = useSite();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="f-brand">
          <img className="footer-logo" src={asset('logo.png')} alt="Anukala" />
          <p>Handcrafted nameplates, paintings and home decor, made by hand in Pune and shaped around you.</p>
          <div className="social-row">
            {site?.socials?.instagram && <a href={site.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>}
            {site?.socials?.facebook && <a href={site.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>}
          </div>
        </div>
        <div>
          <h4>Collections</h4>
          {categories.map((c) => <Link key={c.slug} to={`/collections/${c.slug}`}>{c.name}</Link>)}
          <Link to="/search">Search</Link>
        </div>
        <div>
          <h4>The Studio</h4>
          <Link to="/about">About Us</Link>
          <Link to="/commission">Commissions</Link>
          <Link to="/contact">Contact Us</Link>
          <button className="link-btn" onClick={() => openEnquiry(null)}>Quick enquiry</button>
        </div>
        <div>
          <h4>Visit &amp; Contact</h4>
          {site?.location && <p>{site.location}</p>}
          {site?.contact?.phone && <p><a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>{site.contact.phone}</a></p>}
          {site?.contact?.email && <p><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>}
          <p className="f-note">Customisation available on every piece.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Anukala. All rights reserved.</span>
        <span>Handcrafted in Pune</span>
      </div>
    </footer>
  );
}
