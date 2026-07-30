'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A quiet decorative element pinned to the right edge of the viewport,
 * sitting behind page content. As the person scrolls down, the branch
 * slowly rotates and drifts — a single ambient signature that ties
 * the sections together without competing with the content.
 *
 * Rendered once near the top of the page; it stays fixed while
 * everything else scrolls past it.
 */
export default function ScrollRotatingBranch() {
  const [rotation, setRotation] = useState(0);
  const ticking = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        // One full turn roughly every 2400px of scroll — slow and ambient.
        setRotation((window.scrollY / 2400) * 360);
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-1/2 -right-24 sm:-right-16 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] pointer-events-none z-0 opacity-[0.07]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear' }}
      >
        <g fill="none" stroke="#163C2C" strokeWidth="2.5" strokeLinecap="round">
          <path d="M200,380 C190,300 210,220 195,140 C188,100 205,60 230,20" />
          <path d="M198,240 C160,215 130,205 95,175" />
          <path d="M196,180 C230,155 260,145 300,115" />
          <path d="M199,300 C165,280 140,272 110,250" />
          <path d="M201,300 C235,282 260,275 290,255" />
        </g>
        <g fill="#163C2C">
          <path d="M95,175 C80,165 78,148 92,138 C106,148 104,165 95,175 Z" />
          <path d="M300,115 C285,105 283,88 297,78 C311,88 309,105 300,115 Z" />
          <path d="M110,250 C95,240 93,223 107,213 C121,223 119,240 110,250 Z" />
          <path d="M290,255 C275,245 273,228 287,218 C301,228 299,245 290,255 Z" />
          <path d="M230,20 C215,10 213,-7 227,-17 C241,-7 239,10 230,20 Z" />
        </g>
      </svg>
    </div>
  );
}