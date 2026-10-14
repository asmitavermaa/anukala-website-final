// Static data layer: the site has no backend. Everything the pages need is read from the JSON files in
// /public/data (products, categories, site details, reels, reviews) and filtered here in the browser.
// The function keeps the same call shape the pages already use, e.g. api('/products?category=paintings&page=2').

const BASE = import.meta.env.BASE_URL; // '/' on anukala.com
export const asset = (p) => BASE + String(p).replace(/^\//, '');
export const img = (hash, size = 'full') => `${BASE}images/${size}/${hash}.webp`;

const cache = {};
const load = (name) => {
  if (!cache[name]) {
    cache[name] = fetch(`${BASE}data/${name}.json`).then((r) => {
      if (!r.ok) throw new Error(`${name}: ${r.status}`);
      return r.json();
    });
  }
  return cache[name];
};

const categoriesWithCounts = async () => {
  const [cats, products] = await Promise.all([load('categories'), load('products')]);
  const labels = {};
  const counts = {};
  products.forEach((p) => {
    labels[p.subcategory] = p.subcategoryLabel;
    counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
  });
  return cats.map((c) => {
    const items = products.filter((p) => p.category === c.slug);
    return {
      ...c,
      count: items.length,
      cover: (items.find((p) => p.featured) || items[0] || {}).images?.[0] || null,
      subcategories: c.subcategories
        .filter((s) => counts[s])
        .map((s) => {
          const it = items.find((p) => p.subcategory === s);
          return { slug: s, name: labels[s] || s, count: counts[s], cover: it ? it.images[0] : null };
        }),
    };
  });
};

export async function api(path) {
  const [route, qs = ''] = path.split('?');
  const q = Object.fromEntries(new URLSearchParams(qs));

  if (route === '/site') return load('site');
  if (route === '/reels') return load('reels');
  if (route === '/reviews') return load('reviews');
  if (route === '/categories') return categoriesWithCounts();

  const products = await load('products');

  if (route === '/products') {
    const page = Math.max(parseInt(q.page, 10) || 1, 1);
    const limit = Math.min(parseInt(q.limit, 10) || 24, 100);
    let list = products;
    if (q.category) list = list.filter((p) => p.category === q.category);
    if (q.sub) list = list.filter((p) => p.subcategory === q.sub);
    if (q.featured) list = list.filter((p) => p.featured);
    if (q.q) {
      const t = q.q.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.description} ${p.subcategoryLabel} ${p.category}`.toLowerCase().includes(t));
    }
    const total = list.length;
    return { total, page, pages: Math.ceil(total / limit), items: list.slice((page - 1) * limit, page * limit) };
  }

  if (route.startsWith('/products/')) {
    const id = decodeURIComponent(route.slice('/products/'.length));
    const p = products.find((x) => x.id === id);
    if (!p) throw new Error('404');
    const related = products.filter((x) => x.id !== p.id && x.subcategory === p.subcategory).slice(0, 4);
    return { ...p, related };
  }

  throw new Error(`Unknown route ${route}`);
}
