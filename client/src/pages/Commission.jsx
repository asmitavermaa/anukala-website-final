import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../SiteContext.jsx';
import { asset, img } from '../api.js';
import ReachOut from '../components/ReachOut.jsx';

const STEPS = [
  ['01', 'Conversation', 'Tell us about the piece you have in mind: the name or text, the wall or door, the colours and the mood.'],
  ['02', 'Concept', 'We share ideas and a direction, and agree on size, finish and details before anything is made.'],
  ['03', 'Creation', 'Your piece is made by hand in our Pune studio. We share progress so you can see it take shape.'],
  ['04', 'Delivery', 'Once finished it is carefully packed and sent to you, or collected from us in Pune.'],
];
const MAKES = [
  ['nameplates', 'Custom nameplates', 'Names, house numbers and family signs in the style, colours and language you choose.'],
  ['paintings', 'Original paintings', 'Palette-knife, textured, abstract and devotional works made to suit your space.'],
  ['home-decor', 'Decor and gifts', 'Clocks, trays, key holders and personalised gifts for weddings, housewarmings and milestones.'],
];
const DETAILS = [
  ['What you would like', 'A nameplate, a painting, a gift or decor piece.'],
  ['Names or text', 'Exactly what should be written, and in which language.'],
  ['Size and place', 'Where it will hang and roughly how big, or the size of the wall or door.'],
  ['Colours and inspiration', 'Colours you love, a style, or photos and links that show the feel you want.'],
  ['Needed by', 'A date or occasion, so we can plan the time it needs.'],
];

const MESSAGE = "Hi Anukala! I'd like to commission a piece.\n\nWhat I'm looking for:\nNames / text:\nSize and place:\nColours / inspiration:\nNeeded by:";

export default function Commission() {
  const { categories } = useSite();
  useEffect(() => { document.title = 'Commission a Piece | Anukala'; }, []);
  const cover = (slug) => categories.find((c) => c.slug === slug)?.cover;

  return (
    <div className="commission">
      <section className="c-hero">
        <span className="eyebrow">Made to Order</span>
        <h1>Commission a Piece</h1>
        <p>Every Anukala piece can be made around you. Tell us what you are imagining and we will bring it to life by hand.</p>
        <a className="text-link" href="#start">How to begin</a>
      </section>

      <section className="section c-steps">
        <div className="section-head center"><h2>How it works</h2></div>
        <ol className="steps">
          {STEPS.map(([n, t, d]) => (
            <li key={n} className="step"><span className="step-n">{n}</span><h3>{t}</h3><p className="muted">{d}</p></li>
          ))}
        </ol>
        <p className="center muted small-note">Every piece is made to order, so timelines vary. We confirm them with you after our first conversation.</p>
      </section>

      <section className="c-banner" style={{ backgroundImage: `url(${asset('hero/paintings.webp')})` }}>
        <div className="c-banner-shade" />
        <div className="c-banner-text">
          <h2>Every piece begins with a conversation</h2>
          <p>Tell us about your space and we will make something that belongs in it.</p>
        </div>
      </section>

      <section className="section c-makes">
        <div className="section-head center"><h2>What we create</h2></div>
        <div className="make-grid with-photos">
          {MAKES.map(([slug, t, d]) => (
            <Link key={slug} to={`/collections/${slug}`} className="make-card">
              <span className="make-photo">{cover(slug) && <img src={img(cover(slug), 'thumb')} alt={t} loading="lazy" />}</span>
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section c-start" id="start">
        <div className="c-start-inner">
          <div>
            <span className="eyebrow">Begin</span>
            <h2>Start your commission</h2>
            <p className="muted">
              Send us the details below on any of our channels. Share as much or as little as you like. We will reply
              personally and take it from there.
            </p>
            <ul className="detail-list">
              {DETAILS.map(([t, d]) => (<li key={t}><strong>{t}</strong><span className="muted">{d}</span></li>))}
            </ul>
          </div>
          <div>
            <h3 className="reach-title">Send them to us on</h3>
            <ReachOut message={MESSAGE} subject="Commission enquiry" />
            <p className="muted form-note">Tag or message <strong>@anukala.home</strong> on Instagram, or send us a note on WhatsApp or email. Whichever you prefer.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
