import React, { useEffect, useRef, useState } from 'react';
import { api, asset } from '../api.js';
import { ArrowRight } from './Icons.jsx';

// Pull the shortcode out of any instagram.com/reel/<code>/, /reels/<code>/ or /p/<code>/ link
const shortcode = (url) => (String(url).match(/instagram\.com\/(?:[\w.]+\/)?(?:reels?|p|tv)\/([\w-]+)/i) || [])[1];

// A reel with a `video` file plays on a muted loop (only while on screen). Without one it falls back to
// Instagram's embed, which cannot autoplay. Either way, a click opens the reel on Instagram.
function Reel({ item }) {
  const url = typeof item === 'string' ? item : item.url;
  const video = typeof item === 'string' ? null : item.video;
  const poster = typeof item === 'string' ? undefined : item.poster;
  const code = shortcode(url);
  const box = useRef(null);
  const vid = useRef(null);

  useEffect(() => {
    if (!video || !vid.current) return undefined;
    const v = vid.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [video]);

  if (!code) return null;
  return (
    <div className={'reel' + (video ? ' has-video' : '')} ref={box}>
      {video ? (
        <video ref={vid} src={asset(video)} poster={poster ? asset(poster) : undefined} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      ) : (
        <iframe
          title={`Instagram reel ${code}`}
          src={`https://www.instagram.com/reel/${code}/embed`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          scrolling="no"
          tabIndex={-1}
        />
      )}
      <a className="reel-link" href={`https://www.instagram.com/reel/${code}/`} target="_blank" rel="noreferrer" aria-label="Watch this reel on Instagram" />
    </div>
  );
}

export default function Reels() {
  const [data, setData] = useState(null);
  const track = useRef(null);
  useEffect(() => { api('/reels').then(setData).catch(() => setData({ reels: [] })); }, []);
  if (!data) return null;
  const reels = (data.reels || []).filter((r) => shortcode(typeof r === 'string' ? r : r.url));
  if (!reels.length) return null;
  const scroll = (dir) => track.current && track.current.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="section reels">
      <div className="reels-head">
        <span className="eyebrow">On Instagram</span>
        <h2>Watch Us Create</h2>
        <p className="muted">Behind the scenes, finished pieces and a peek into the studio.</p>
      </div>
      <div className="reels-wrap">
        <button className="reel-arrow left" aria-label="Previous reels" onClick={() => scroll(-1)}><ArrowRight style={{ transform: 'rotate(180deg)' }} /></button>
        <div className="reels-track" ref={track}>
          {reels.map((r, i) => <Reel key={i} item={r} />)}
        </div>
        <button className="reel-arrow right" aria-label="Next reels" onClick={() => scroll(1)}><ArrowRight /></button>
      </div>
    </section>
  );
}
