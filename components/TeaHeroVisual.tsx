// components/TeaHeroVisual.tsx
'use client';

/**
 * Left-side hero visual for TeaPulse AI.
 * A flat-illustration tea plucker among hillside bushes,
 * with a slow, staggered rain of green + cream tea leaves drifting past.
 */
export default function TeaHeroVisual() {
  // Each leaf: horizontal start position, size, tone, duration, delay, sway amount
  const leaves = [
    { left: '6%',  size: 22, tone: 'dark',  duration: 9,  delay: 0,   sway: 18 },
    { left: '18%', size: 14, tone: 'cream', duration: 7,  delay: 1.4, sway: 26 },
    { left: '30%', size: 26, tone: 'mid',   duration: 11, delay: 0.6, sway: 14 },
    { left: '42%', size: 16, tone: 'cream', duration: 8,  delay: 2.2, sway: 30 },
    { left: '54%', size: 20, tone: 'dark',  duration: 10, delay: 0.2, sway: 20 },
    { left: '65%', size: 15, tone: 'mid',   duration: 7.5,delay: 1.8, sway: 24 },
    { left: '76%', size: 24, tone: 'cream', duration: 12, delay: 0.9, sway: 16 },
    { left: '88%', size: 18, tone: 'dark',  duration: 8.5,delay: 2.6, sway: 22 },
    { left: '95%', size: 13, tone: 'mid',   duration: 6.5,delay: 0.4, sway: 28 },
  ];

  const toneFill: Record<string, string> = {
    dark: '#163C2C',
    mid: '#3E7A57',
    cream: '#F4EEDD',
  };

  return (
    <div className="relative w-full h-[440px] sm:h-[520px] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#F7F4EA] to-[#EDEADC] border border-[#E3DCC6]">
      {/* soft radial glow, premium hint of gold */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#B68D40]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#2F6B4A]/10 blur-3xl" />

      {/* Hillside terraces */}
      <svg
        viewBox="0 0 600 700"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A9C9AF" />
            <stop offset="100%" stopColor="#8FB89A" />
          </linearGradient>
          <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F6B4A" />
            <stop offset="100%" stopColor="#163C2C" />
          </linearGradient>
        </defs>

        {/* far terrace */}
        <path d="M0,430 Q150,390 300,420 T600,410 L600,700 L0,700 Z" fill="url(#hillFar)" opacity="0.55" />
        {/* mid terrace */}
        <path d="M0,500 Q160,455 320,485 T600,470 L600,700 L0,700 Z" fill="url(#hillFar)" opacity="0.8" />
        {/* near terrace with bush texture */}
        <path d="M0,585 Q180,540 300,565 T600,555 L600,700 L0,700 Z" fill="url(#hillNear)" />

        {/* rows of clipped tea-bush bumps on the near terrace */}
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse
            key={i}
            cx={20 + i * 44}
            cy={575 - (i % 2 === 0 ? 6 : 0)}
            rx="26"
            ry="14"
            fill="#1F4D36"
            opacity="0.9"
          />
        ))}

        {/* Plucker silhouette (flat, minimal, premium editorial style) */}
        <g transform="translate(255,430)">
          {/* basket strap + basket on back */}
          <path d="M40,60 Q70,20 60,-10" stroke="#B68D40" strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="63" cy="-16" rx="20" ry="26" fill="#8A6A2E" />
          <ellipse cx="63" cy="-16" rx="20" ry="26" fill="none" stroke="#6B4F1E" strokeWidth="2" />

          {/* saree-draped body, bending forward to pluck */}
          <path
            d="M0,140 
               C-6,95 2,55 22,30
               C34,15 50,6 46,-14
               C44,-24 34,-30 24,-26
               C14,-22 12,-10 18,-2
               C26,8 12,18 -2,26
               C-22,38 -34,60 -30,90
               C-28,110 -18,128 0,140 Z"
            fill="#163C2C"
          />
          {/* under-layer of saree, cream accent for contrast/premium feel */}
          <path
            d="M-2,80 C-10,100 -6,122 8,138 C0,130 -4,110 0,90 Z"
            fill="#F4EEDD"
            opacity="0.85"
          />

          {/* head, tilted down toward the bush */}
          <circle cx="30" cy="-32" r="11" fill="#5A3A22" />
          {/* head-cover fold */}
          <path d="M20,-40 Q30,-52 42,-40 Q40,-28 30,-28 Q20,-30 20,-40 Z" fill="#3E7A57" />

          {/* arm reaching to pluck a leaf */}
          <path
            d="M40,-16 C56,-20 68,-16 74,-4"
            stroke="#5A3A22"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="76" cy="-3" r="5" fill="#5A3A22" />
        </g>

        {/* a few nearby bush clusters, foreground, slightly larger for depth */}
        <ellipse cx="120" cy="610" rx="46" ry="22" fill="#1F4D36" />
        <ellipse cx="180" cy="600" rx="40" ry="20" fill="#245A3F" />
        <ellipse cx="430" cy="605" rx="50" ry="24" fill="#1F4D36" />
        <ellipse cx="500" cy="595" rx="36" ry="18" fill="#245A3F" />
      </svg>

      {/* Falling tea leaves */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {leaves.map((leaf, i) => (
          <span
            key={i}
            className="tea-leaf"
            style={{
              left: leaf.left,
              width: leaf.size,
              height: leaf.size * 0.7,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              // custom property consumed by the sway keyframes
              // @ts-ignore
              '--sway': `${leaf.sway}px`,
            }}
          >
            <svg viewBox="0 0 24 16" width="100%" height="100%">
              <path
                d="M12,0 C20,2 24,8 12,16 C0,8 4,2 12,0 Z"
                fill={toneFill[leaf.tone]}
              />
              <path d="M12,1 L12,15" stroke="#00000022" strokeWidth="0.6" />
            </svg>
          </span>
        ))}
      </div>

      {/* subtle premium frame line */}
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-[#163C2C]/10 pointer-events-none" />

      <style jsx>{`
        .tea-leaf {
          position: absolute;
          top: -40px;
          display: block;
          animation-name: leafFall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes leafFall {
          0% {
            transform: translateY(-40px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          50% {
            transform: translateY(240px) translateX(var(--sway)) rotate(180deg);
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translateY(540px) translateX(0) rotate(360deg);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tea-leaf {
            animation: none;
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}