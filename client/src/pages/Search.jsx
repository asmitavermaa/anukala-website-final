import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import Masonry from '../components/Masonry.jsx';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [res, setRes] = useState(null);
  useEffect(() => {
    document.title = 'Search | Anukala';
    if (!q) return setRes({ total: 0, items: [] });
    setRes(null);
    api(`/products?q=${encodeURIComponent(q)}&limit=60`).then(setRes).catch(() => setRes({ total: 0, items: [] }));
  }, [q]);
  return (
    <div className="page">
      <h1>{q ? `Search results for “${q}”` : 'Search'}</h1>
      {res && <p className="muted count">{res.total} {res.total === 1 ? 'result' : 'results'}</p>}
      <Masonry items={res?.items || []} render={(p) => <ProductCard p={p} />} />
    </div>
  );
}
