import { useId, type ReactElement } from 'react';

/** Scalable, curved shoulders and a fine metallic rim, like the broadcast graphics. */
function BroadcastFrame({ variant }: { variant: 'question' | 'answer' }): ReactElement {
  const id = useId();
  const contour = variant === 'question'
    ? 'M 0 50 C 40 50 45 5 92 5 H 908 C 955 5 960 50 1000 50 C 960 50 955 95 908 95 H 92 C 45 95 40 50 0 50 Z'
    : 'M 0 50 C 34 50 38 5 78 5 H 922 C 962 5 966 50 1000 50 C 966 50 962 95 922 95 H 78 C 38 95 34 50 0 50 Z';

  return (
    <svg
      className="mil-broadcast-frame"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="0.65">
          <stop offset="0%" className="mil-frame-fill-start" />
          <stop offset="56%" className="mil-frame-fill-middle" />
          <stop offset="100%" className="mil-frame-fill-end" />
        </linearGradient>
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fcfcff" />
          <stop offset="18%" stopColor="#9b9caa" />
          <stop offset="34%" stopColor="#f5f4f8" />
          <stop offset="52%" stopColor="#8a8c9b" />
          <stop offset="73%" stopColor="#f5f6ff" />
          <stop offset="100%" stopColor="#b0aebf" />
        </linearGradient>
      </defs>
      <path
        d={contour}
        fill={`url(#${id}-fill)`}
        stroke="#545468"
        strokeWidth="5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="mil-frame-rim"
        d={contour}
        fill="none"
        stroke={`url(#${id}-chrome)`}
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default BroadcastFrame;
