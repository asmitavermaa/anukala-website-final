import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../SiteContext.jsx';
import { asset } from '../api.js';

export default function About() {
  const { site, openEnquiry } = useSite();
  useEffect(() => { document.title = 'About Us | Anukala'; }, []);
  const founders = site?.founders || [];
  const names = founders.map((f) => f.name).join(' & ');

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-text">
          <span className="eyebrow">About Anukala</span>
          <h1>Art made by hand, made for your home</h1>
          <p className="lead">
            Anukala is a Pune-based art and decor studio. We create nameplates, paintings and home decor entirely by hand,
            and every piece can be shaped around your name, your wall and your taste.
          </p>
          <button className="btn" onClick={() => openEnquiry(null)}>Contact Us</button>
        </div>
        <figure className="about-hero-photo">
          <img src={asset('founders.webp')} alt={names ? `${names} holding a hand-painted Buddha canvas` : 'The Anukala founders with a hand-painted canvas'} />
        </figure>
      </section>

      <section className="section about-story">
        <h2>Our story</h2>
        <p>
          Anukala began with a simple idea: the things around us should feel personal.
          What started with hand-painted nameplates has grown into a collection that celebrates traditional and
          contemporary art, from floral and ethnic nameplates to palette-knife paintings, clocks, key holders, trays,
          coasters and gifts.
        </p>
        <p>
          Each piece is crafted to suit your needs and to match the colours of your wall or door. Customisation is part of
          how we work, not an add-on. We are proudly <strong>made in Pune</strong> and vocal for local.
        </p>
      </section>

      <section className="about-values">
        <div className="values-grid">
          <div><h3>Handmade</h3><p className="muted">Every nameplate, painting and decor piece is painted and finished by hand in our studio.</p></div>
          <div><h3>Customised</h3><p className="muted">Names, sizes, colours and themes can be adapted so your piece is truly yours.</p></div>
          <div><h3>Rooted in tradition</h3><p className="muted">Madhubani, Warli, lippan and devotional art sit alongside modern, minimal designs.</p></div>
          <div><h3>Made in Pune</h3><p className="muted">A local brand, based in Wakad and Pimple Saudagar, shipping our love for art to your door.</p></div>
        </div>
      </section>

      <section className="section about-make">
        <h2>What we make</h2>
        <div className="make-grid">
          <Link to="/collections/nameplates" className="make-card"><h3>Nameplates</h3><p className="muted">Ethnic, floral, clay, acrylic, modern, resin, devotional and kids designs.</p></Link>
          <Link to="/collections/paintings" className="make-card"><h3>Paintings</h3><p className="muted">Palette knife, textured, abstract, traditional and devotional artworks.</p></Link>
          <Link to="/collections/home-decor" className="make-card"><h3>Home Decor</h3><p className="muted">Coasters, trays, clocks, key holders, gifts and more.</p></Link>
        </div>
      </section>

      <section className="section about-founders">
        <h2>Meet the founders</h2>
        <div className="founder-names">
          {founders.map((f) => (
            <div key={f.name}><h3>{f.name}</h3><p className="muted">{f.role}</p></div>
          ))}
        </div>
        <p className="center muted">
          Anukala is run by two artists who turned a shared love of colour and craft into a studio. Every piece you see here
          passes through their hands.
        </p>
      </section>

      <section className="section contact-block">
        <h2>Let's create something together</h2>
        <p className="muted">Based in {site?.location || 'Pune'}. Tell us what you have in mind and we'll bring it to life.</p>
        <button className="btn" onClick={() => openEnquiry(null)}>Contact Us</button>
      </section>
    </div>
  );
}
