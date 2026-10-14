import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, img } from '../api.js';
import { useSite } from '../SiteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Masonry from '../components/Masonry.jsx';

export default function Product() {
  const { id } = useParams();
  const { categories, openEnquiry } = useSite();
  const [p, setP] = useState(null);
  const [err, setErr] = useState(false);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    setP(null); setErr(false); setCur(0);
    api(`/products/${id}`).then(setP).catch(() => setErr(true));
  }, [id]);
  useEffect(() => { if (p) document.title = `${p.name} | Anukala`; }, [p]);

  if (err) return <div className="page narrow"><h1>Product not found</h1><Link to="/">Back to home</Link></div>;
  if (!p) return <div className="page"><div className="skeleton tall" /></div>;
  const cat = categories.find((c) => c.slug === p.category);

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/">Home</Link> / <Link to={`/collections/${p.category}`}>{cat?.name || p.category}</Link> /{' '}
        <Link to={`/collections/${p.category}/${p.subcategory}`}>{p.subcategoryLabel}</Link>
      </nav>
      <div className="product">
        <div className="gallery">
          <div className="main-img"><img src={img(p.images[cur])} alt={p.name} /></div>
          {p.images.length > 1 && (
            <div className="thumbs">
              {p.images.map((h, n) => (
                <button key={h} className={n === cur ? 'on' : ''} onClick={() => setCur(n)} aria-label={`Photo ${n + 1}`}>
                  <img src={img(h, 'thumb')} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="info">
          <span className="eyebrow">{p.subcategoryLabel}</span>
          <h1>{p.name}</h1>
          <div className="desc">{p.description.split(/\n\n/).map((t, i) => <p key={i}>{t}</p>)}</div>
          <button className="btn wide" onClick={() => openEnquiry(p)}>Contact Us</button>
          <ul className="notes">
            <li>Handcrafted by hand in Pune</li>
            <li>Customisable on request</li>
            <li>Message us on WhatsApp or Instagram to enquire</li>
          </ul>
        </div>
      </div>
      {p.related?.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>You may also like</h2></div>
          <Masonry items={p.related} render={(r) => <ProductCard p={r} />} />
        </section>
      )}
    </div>
  );
}
