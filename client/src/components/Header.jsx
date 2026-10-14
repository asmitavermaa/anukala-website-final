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

  // publish the header height so the home hero can fill the rest of the screen
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const set = () => {
      if (window.scrollY < 10) document.documentElement.style.setProperty('--header-h', el.offsetHeight + 'px');
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => { if (searching && inputRef.current) inputRef.current.focus(); }, [searching]);

  const go = () => { if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`); };
  const submit = (e) => { e.preventDefault(); go(); };

  return (
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
  );
}
