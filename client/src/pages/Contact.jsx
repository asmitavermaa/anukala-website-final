import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../SiteContext.jsx';
import ReachOut from '../components/ReachOut.jsx';

export default function Contact() {
  const { site } = useSite();
  useEffect(() => { document.title = 'Contact Us | Anukala'; }, []);
  if (!site) return <div className="page narrow" />;

  return (
    <div className="contact-page">
      <section className="c-hero">
        <span className="eyebrow">Get in Touch</span>
        <h1>Contact Us</h1>
        <p>Questions about a piece, a customisation or a gift? Message us on any of these and we will reply personally.</p>
      </section>

      <section className="section contact-single">
        <ReachOut />
        {site.location && (
          <dl className="studio">
            <dt>Studio</dt><dd>{site.location}</dd>
          </dl>
        )}
        <p className="muted center">
          Looking for something made just for you? <Link className="text-link inline" to="/commission">Commission a piece</Link>
        </p>
      </section>
    </div>
  );
}
