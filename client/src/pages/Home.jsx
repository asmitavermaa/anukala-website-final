import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, img, asset } from '../api.js';
import { useSite } from '../SiteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reels from '../components/Reels.jsx';
import ReviewStars from '../components/ReviewStars.jsx';
import { ArrowRight, BrushIcon, SlidersIcon, PaletteIcon, SparkleIcon, PinIcon } from '../components/Icons.jsx';

const SLIDES = [
  { img: 'hero/nameplates.webp', pos: '50% 45%', kicker: 'Nameplates', title: 'Where every entrance begins', text: 'Handcrafted nameplates in floral, ethnic, clay and modern styles, customised with your name.', to: '/collections/nameplates', cta: 'View Nameplates' },
  { img: 'hero/paintings.webp', pos: '50% 50%', kicker: 'Paintings', title: 'Original art, painted by hand', text: 'Palette-knife, textured, abstract and traditional paintings, made by hand in Pune.', to: '/collections/paintings', cta: 'View Paintings' },
  { img: 'hero/home-decor.webp', pos: '50% 50%', kicker: 'Home Decor', title: 'Details that make a home', text: 'Clocks, trays, coasters, key holders and gifts, hand-finished for everyday living.', to: '/collections/home-decor', cta: 'View Home Decor' },
  { img: 'hero/devotional.webp', pos: '50% 40%', kicker: 'Devotional Art', title: 'Art that brings calm', text: 'Buddha, Ganesha and Radha Krishna paintings for living rooms and prayer corners.', to: '/collections/paintings/devotionals', cta: 'View Devotional Art' },
];

// Full-screen slideshow: fills everything below the header
function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured collections" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {SLIDES.map((s, n) => (
        <div key={s.to} className={'slide' + (n === i ? ' active' : '')} aria-hidden={n !== i}>
          <img className="slide-bg" src={asset(s.img)} alt="" style={{ objectPosition: s.pos }} loading={n === 0 ? 'eager' : 'lazy'} />
          <div className="slide-shade" />
          <div className="slide-text">
            <span className="eyebrow">{s.kicker}</span>
            <h1>{s.title}</h1>
            <Link className="hero-cta" to={s.to} tabIndex={n === i ? 0 : -1}>{s.cta} <ArrowRight /></Link>
          </div>
        </div>
      ))}
      <div className="dots">
        {SLIDES.map((s, n) => <button key={s.to} className={n === i ? 'on' : ''} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} />)}
      </div>
    </section>
  );
}

function Row({ title, link, items }) {
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {link && <Link to={link} className="view-all">View all <ArrowRight /></Link>}
      </div>
      <div className="grid four featured-grid">{items.map((p) => <ProductCard key={p.id} p={p} uniform />)}</div>
    </section>
  );
}

export default function Home() {
  const { categories, site, openEnquiry } = useSite();
  const [featured, setFeatured] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    ['nameplates', 'paintings', 'home-decor'].forEach((c) =>
      api(`/products?category=${c}&featured=1&limit=4`).then((r) => setFeatured((f) => ({ ...f, [c]: r.items }))).catch(() => {})
    );
    api('/reviews').then(setReviews).catch(() => {});
  }, []);

  const subCard = (cat, sub) => {
    const c = categories.find((x) => x.slug === cat);
    const s = c?.subcategories.find((x) => x.slug === sub);
    return s ? { to: `/collections/${cat}/${sub}`, name: `${s.name} ${cat === 'nameplates' ? 'Nameplates' : ''}`.trim(), img: s.cover, text: '' } : null;
  };
  const cards = [
    ...categories.map((c) => ({ to: `/collections/${c.slug}`, name: c.name, img: c.cover, text: c.blurb })),
    subCard('nameplates', 'floral'), subCard('nameplates', 'kids'), subCard('paintings', 'devotionals'),
    subCard('home-decor', 'clock'), subCard('home-decor', 'keyholder'),
  ].filter(Boolean);

  const paintingFeature = (featured.paintings || [])[0];
  const popular = [
    ['Floral Nameplates', '/collections/nameplates/floral'], ['Ethnic Nameplates', '/collections/nameplates/ethnic'],
    ['Kids Nameplates', '/collections/nameplates/kids'], ['Devotional Paintings', '/collections/paintings/devotionals'],
    ['Palette Knife Paintings', '/collections/paintings/palette'], ['Wall Clocks', '/collections/home-decor/clock'],
  ];

  return (
    <>
      <Hero />

      <section className="section intro">
        <span className="eyebrow">Anukala &middot; Pune</span>
        <h2>Handcrafted Home Decor</h2>
        <p>
          Nameplates, paintings and decor made slowly, by hand, in our Pune studio. Each piece is shaped around your name,
          your wall and your taste.
        </p>
      </section>

      <Reels />

      <section className="section">
        <div className="section-head center"><h2>The Collections</h2></div>
        <div className="grid collections">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="coll-card">
              <div className="coll-img">{c.img && <img src={img(c.img, 'thumb')} alt={c.name} loading="lazy" />}</div>
              <h3>{c.name}</h3>
              {c.text && <p className="muted">{c.text}</p>}
            </Link>
          ))}
        </div>
      </section>

      {paintingFeature && (
        <section className="feature-banner">
          <div className="fb-img"><img src={img(paintingFeature.images[0])} alt={paintingFeature.name} loading="lazy" /></div>
          <div className="fb-text">
            <span className="eyebrow">The Studio</span>
            <h2>Art, made one piece at a time</h2>
            <p>
              Palette-knife landscapes, textured florals, abstract compositions and devotional art, each painted by hand.
              Choose a finished piece, or commission one made for your space.
            </p>
            <div className="fb-links">
              <Link className="btn" to="/collections/paintings">View Paintings</Link>
              <Link className="text-link" to="/commission">Commission a piece <ArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="section reviews">
          <div className="section-head center"><h2>Kind Words</h2></div>
          <div className="review-grid">
            {reviews.map((r, n) => (
              <figure key={n} className="review">
                <ReviewStars n={r.rating || 5} />
                <blockquote>{r.text}</blockquote>
                <figcaption><strong>{r.name}</strong>{r.date && <span className="muted"> · {r.date}</span>}</figcaption>
              </figure>
            ))}
          </div>
          {site?.socials?.facebook && (
            <p className="center muted small-note">Reviews from our <a href={site.socials.facebook} target="_blank" rel="noreferrer">Facebook page</a>.</p>
          )}
        </section>
      )}

      <Row title="Selected Nameplates" link="/collections/nameplates" items={featured.nameplates || []} />

      <section className="section why">
        <div className="section-head center"><h2>The Anukala Difference</h2></div>
        <div className="why-grid">
          {[
            [BrushIcon, 'Handcrafted by in-house artists', 'Every piece is made by hand in our Pune studio.'],
            [SlidersIcon, 'Made just for you', 'Names, sizes and colours can be customised.'],
            [PaletteIcon, 'Original artworks', 'Paintings are created by hand, not mass produced.'],
            [SparkleIcon, 'Exclusive & unique designs', 'Many designs are one of a kind.'],
            [PinIcon, 'Made in Pune', 'Proudly local, crafted in Wakad and Pimple Saudagar.'],
          ].map(([Icon, t, d]) => (
            <div key={t} className="why-item"><span className="why-icon"><Icon /></span><h4>{t}</h4><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <Row title="Selected Paintings" link="/collections/paintings" items={featured.paintings || []} />
      <Row title="Selected Home Decor" link="/collections/home-decor" items={featured['home-decor'] || []} />

      <section className="section">
        <div className="section-head center"><h2>Browse by Style</h2></div>
        <div className="pill-row">{popular.map(([n, to]) => <Link key={to} to={to} className="pill">{n}</Link>)}</div>
      </section>

      <section className="section contact-block">
        <span className="eyebrow">Made to Order</span>
        <h2>Have something in mind?</h2>
        <p className="muted">Tell us about your wall, your name and your colours, and we will craft something just for you.</p>
        <div className="cta-pair">
          <Link className="btn" to="/commission">Start a Commission</Link>
          <button className="btn outline" onClick={() => openEnquiry(null)}>Contact Us</button>
        </div>
      </section>
    </>
  );
}
