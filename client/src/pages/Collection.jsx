import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useSite } from '../SiteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Masonry from '../components/Masonry.jsx';

export default function Collection() {
  const { category, sub } = useParams();
  const { categories } = useSite();
  const cat = categories.find((c) => c.slug === category);
  const subObj = cat?.subcategories.find((s) => s.slug === sub);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // One effect owns loading. Changing the collection restarts from page 1 and ignores stale responses.
  useEffect(() => {
    let live = true;
    setLoading(true);
    api(`/products?category=${category}${sub ? `&sub=${sub}` : ''}&page=${page}&limit=24`)
      .then((r) => {
        if (!live) return;
        setItems((prev) => (page === 1 ? r.items : [...prev, ...r.items]));
        setPages(r.pages);
        setTotal(r.total);
      })
      .catch(() => {})
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [category, sub, page]);

  useEffect(() => {
    setItems([]);
    setPages(1);
    setTotal(0);
    setPage(1);
  }, [category, sub]);

  useEffect(() => {
    document.title = `${subObj ? subObj.name + ' · ' : ''}${cat?.name || 'Collection'} | Anukala`;
  }, [cat, subObj]);

  return (
    <div className="page">
      <nav className="crumbs"><Link to="/">Home</Link> / <Link to={`/collections/${category}`}>{cat?.name || category}</Link>{subObj && <> / {subObj.name}</>}</nav>
      <h1>{subObj ? `${subObj.name} ${cat.name}` : cat?.name || 'Collection'}</h1>
      {cat && !sub && <p className="muted lead">{cat.blurb}</p>}
      {cat && (
        <div className="pill-row left">
          <Link to={`/collections/${category}`} className={'pill' + (!sub ? ' on' : '')}>All</Link>
          {cat.subcategories.map((s) => (
            <Link key={s.slug} to={`/collections/${category}/${s.slug}`} className={'pill' + (sub === s.slug ? ' on' : '')}>{s.name}</Link>
          ))}
        </div>
      )}
      <p className="muted count">{total} {total === 1 ? 'piece' : 'pieces'}</p>
      <Masonry items={items} render={(p) => <ProductCard p={p} />} />
      {!loading && items.length === 0 && <p className="muted">Nothing here yet. Check back soon.</p>}
      {page < pages && (
        <div className="center more"><button className="btn outline" disabled={loading} onClick={() => setPage((p) => p + 1)}>{loading ? 'Loading…' : 'Load more'}</button></div>
      )}
    </div>
  );
}
