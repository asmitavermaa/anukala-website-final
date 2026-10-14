import React, { useEffect, useState } from 'react';

const cols = () => {
  const w = window.innerWidth;
  return w < 600 ? 2 : w < 1000 ? 3 : 4;
};

// Masonry layout: items are dealt into columns in order, so appending more items
// never moves the ones already on screen.
export default function Masonry({ items, render }) {
  const [n, setN] = useState(cols());
  useEffect(() => {
    const on = () => setN(cols());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const columns = Array.from({ length: n }, () => []);
  items.forEach((it, i) => columns[i % n].push(it));
  return (
    <div className="masonry-grid">
      {columns.map((col, c) => (
        <div className="masonry-col" key={c}>
          {col.map((it) => <div className="masonry-item" key={it.id}>{render(it)}</div>)}
        </div>
      ))}
    </div>
  );
}
