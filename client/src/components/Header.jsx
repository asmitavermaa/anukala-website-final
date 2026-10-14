import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSite } from '../SiteContext.jsx';
import { asset } from '../api.js';
import { SearchIcon, MenuIcon, CloseIcon, ChevronDown, InstagramIcon, FacebookIcon } from './Icons.jsx';

export default function Header() {
  const { site, categories } = useSite();
  const [mobile, setMobile] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const headerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setMobile(false); setSearching(false); setQ(''); }, [loc.pathname]);
  useEffect(() => {
    if (!site?.announcements?.length) return undefined;
    const t = setInterval(() => setMsg((m) => (m + 1) % site.announcements.length), 4000);
    return () => clearInterval(t);
  }, [site]);

  // The header is fixed, so shrinking it can never move the page. A same-height spacer holds its place in the
  // layout, and its height is only ever measured while the header is full size (at the top of the page).
  const [shellH, setShellH] = useState(null);
  const scrolledRef = useRef(false);
  const toggledAt = useRef(0);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    let timer;
    const measure = () => {
      if (scrolledRef.current) return; // never measure the shrunk header
      // while the header is animating between sizes, wait until it has settled, then measure the final size
      const since = Date.now() - toggledAt.current;
      if (since < 700) {
        clearTimeout(timer);
        timer = setTimeout(measure, 720 - since);
        return;
      }
      const h = el.offsetHeight;
      setShellH(h);
      document.documentElement.style.setProperty('--header-h', h + 'px'); // the home hero fills the rest of the screen
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { ro.disconnect(); clearTimeout(timer); };
  }, []);

  // two thresholds (shrink past 90px, grow back under 30px) so it can't flicker around a single line
  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      const next = scrolledRef.current ? y > 30 : y > 90;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        toggledAt.current = Date.now();
        setScrolled(next);
      }
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => { if (searching && inputRef.current) inputRef.current.focus(); }, [searching]);

  const go = () => { if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`); };
  const submit = (e) => { e.preventDefault(); go(); };

  return (
    <div className="header-shell" style={shellH ? { height: shellH } : undefined}>
    <header className={'site-header' + (scrolled ? ' scrolled' : '')} ref={headerRef}>
      <div className="announce">{site?.announcements?.[msg] || 'Handcrafted in Pune'}</div>

      <div className="header-top">
        <div className="brand">
          <button className="icon-btn only-mobile" aria-label="Menu" onClick={() => setMobile(true)}><MenuIcon /></button>
          <Link to="/" className="logo" aria-label="Anukala home"><img src={asset('logo.png')} alt="Anukala" /></Link>
        </div>

        <nav className="main-nav" aria-label="Main">
          {categories.map((c) => (
            <div className="nav-item" key={c.slug}>
              <NavLink to={`/collections/${c.slug}`}>{c.name} <ChevronDown /></NavLink>
              <div className={'dropdown' + (c.subcategories.length > 6 ? ' cols' : '')}>
                <Link to={`/collections/${c.slug}`}>All {c.name}</Link>
                {c.subcategories.map((s) => (
                  <Link key={s.slug} to={`/collections/${c.slug}/${s.slug}`}>{s.name}</Link>
                ))}
              </div>
            </div>
          ))}
          <div className="nav-item"><NavLink to="/commission">Commissions</NavLink></div>
        <div className="nav-item"><NavLink to="/about">About Us</NavLink></div>
          <div className="nav-item"><NavLink to="/contact">Contact Us</NavLink></div>
        </nav>

        <div className="ht-right">
          <form className={'search-inline' + (searching ? ' open' : '')} onSubmit={submit} role="search">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setSearching(false)}
              onBlur={() => !q && setSearching(false)}
              placeholder="Search…"
              aria-label="Search products"
              tabIndex={searching ? 0 : -1}
            />
          </form>
          <button
            className="icon-btn"
            aria-label="Search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (searching && q.trim() ? go() : setSearching((s) => !s))}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {mobile && (
        <div className="drawer-wrap" onClick={() => setMobile(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn drawer-close" aria-label="Close" onClick={() => setMobile(false)}><CloseIcon /></button>
            {categories.map((c) => (
              <details key={c.slug}>
                <summary>{c.name}</summary>
                <Link to={`/collections/${c.slug}`}>All {c.name}</Link>
                {c.subcategories.map((s) => <Link key={s.slug} to={`/collections/${c.slug}/${s.slug}`}>{s.name}</Link>)}
              </details>
            ))}
            <Link className="drawer-link" to="/commission">Commissions</Link>
            <Link className="drawer-link" to="/about">About Us</Link>
            <Link className="drawer-link" to="/contact">Contact Us</Link>
            <div className="drawer-social">
              {site?.socials?.instagram && <a href={site.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>}
              {site?.socials?.facebook && <a href={site.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>}
            </div>
          </aside>
        </div>
      )}
    </header>
    </div>
  );
}
