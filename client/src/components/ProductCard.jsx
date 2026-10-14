import React from 'react';
import { Link } from 'react-router-dom';
import { img } from '../api.js';

// Photo with the name and subcategory underneath. The description and Contact Us button
// live on the product page. `uniform` gives every card the same square frame (home page rows).
export default function ProductCard({ p, uniform = false }) {
  return (
    <Link to={`/product/${p.id}`} className={'tile' + (uniform ? ' uniform' : '')} aria-label={p.name}>
      <span className="tile-img">
        <img src={img(p.images[0], 'thumb')} alt={p.name} loading="lazy" />
      </span>
      <span className="tile-info">
        <span className="tile-name">{p.name}</span>
        <span className="tile-sub">{p.subcategoryLabel}</span>
      </span>
    </Link>
  );
}
