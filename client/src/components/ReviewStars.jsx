import React from 'react';
import { StarIcon } from './Icons.jsx';

export default function ReviewStars({ n = 5 }) {
  return <span className="stars" aria-label={`${n} out of 5`}>{Array.from({ length: n }, (_, i) => <StarIcon key={i} />)}</span>;
}
