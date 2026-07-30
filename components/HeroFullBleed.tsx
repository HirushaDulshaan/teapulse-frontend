'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

/**
 * Full-bleed cinematic hero.
 *
 * Left half: a slow "rain" of water droplets and fertilizer granules
 *   falling from the sky toward the soil line — the input side.
 * Right half: a tea bush that draws itself in, branch by branch,
 *   leaf by leaf, on a soft continuous loop — the yield side.
 *
 * The two halves are the thesis of the product in one image:
 * precise inputs in, healthy growth out.
 */
export default function HeroFullBleed() {
  // Left column: droplets (water) and granules (fertilizer), raining down.
  const drops = [
    { left: '3%', size: 9, duration: 4.5, delay: 0, kind: 'water' },
    { left: '9%', size: 6, duration: 3.6, delay: 1.1, kind: 'granule' },
    { left: '15%', size: 8, duration: 5.2, delay: 0.4, kind: 'water' },
    { left: '21%', size: 5, duration: 3.2, delay: 2.0, kind: 'granule' },
    { left: '27%', size: 10, duration: 4.8, delay: 0.8, kind: 'water' },
    { left: '33%', size: 6, duration: 3.9, delay: 1.6, kind: 'granule' },
    { left: '6%', size: 6, duration: 3.4, delay: 2.6, kind: 'granule' },
    { left: '18%', size: 7, duration: 4.1, delay: 3.1, kind: 'water' },
    { left: '30%', size: 5, duration: 3.7, delay: 0.2, kind: 'granule' },
    { left: '12%', size: 9, duration: 5.0, delay: 1.9, kind: 'water' },
    { left: '24%', size: 7, duration: 4.3, delay: 2.4, kind: 'water' },
    { left: '36%', size: 6, duration: 3.5, delay: 0.6, kind: 'granule' },
  ];

  return (
    <section className="relative w-full h-[86vh] min-h-[600px] overflow-hidden bg-[#0E2A1D]">
      {/* Base scene */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#1F4D36_0%,#123420_55%,#0B2015_100%)]" />
        <svg viewBox="0 0 1600 800" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full opacity-80">
          <path d="M0,520 Q400,440 800,500 T1600,470 L1600,800 L0,800 Z" fill="#1F4D36" opacity="0.55" />
          <path d="M0,600 Q420,530 820,580 T1600,560 L1600,800 L0,800 Z" fill="#173C29" opacity="0.75" />
          <path d="M0,680 Q440,620 850,660 T1600,650 L1600,800 L0,800 Z" fill="#0F2A1C" />
          {Array.from({ length: 26 }).map((_, i) => (
            <ellipse key={i} cx={10 + i * 62} cy={690 - (i % 3) * 8} rx="34" ry="17" fill="#0B2015" opacity="0.85" />
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B2015] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2015]/70 via-transparent to-[#0B2015]/60" />
      </div>

      {/* LEFT: rain of water + fertilizer, falling onto the soil line */}
      <div className="absolute inset-y-0 left-0 w-[38%] pointer-events-none" aria-hidden="true">
        {drops.map((d, i) => (
          <span
            key={i}
            className={`rain-drop rain-${d.kind}`}
            style={{
              left: d.left,
              width: d.size,
              height: d.kind === 'water' ? d.size * 1.6 : d.size,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
        {/* absorption pulses where the rain meets the ground */}
        {[10, 22, 33, 6, 28, 17].map((left, i) => (
          <span
            key={`pulse-${i}`}
            className="ground-pulse"
            style={{ left: `${left}%`, animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </div>

      {/* RIGHT: a tea bush that grows itself in, on a slow loop */}
      <div className="absolute inset-y-0 right-0 w-[46%] pointer-events-none opacity-90" aria-hidden="true">
        <svg
          viewBox="0 0 500 700"
          preserveAspectRatio="xMidYMax meet"
          className="absolute bottom-0 right-0 w-full h-full"
        >
          {/* trunk + branches, drawn via animated stroke-dashoffset */}
          <g fill="none" stroke="#B68D40" strokeWidth="3.5" strokeLinecap="round">
            <path className="grow-path grow-1" d="M250,620 C246,540 252,470 240,420" />
            <path className="grow-path grow-2" d="M240,470 C210,440 180,430 155,400" />
            <path className="grow-path grow-3" d="M244,430 C270,405 300,398 330,375" />
            <path className="grow-path grow-4" d="M242,505 C215,485 190,478 165,460" />
            <path className="grow-path grow-5" d="M248,500 C275,485 300,478 325,462" />
          </g>
          {/* leaf clusters, fading/scaling in after their branch draws */}
          <g>
            <TeaLeafCluster cx={240} cy={415} delayClass="leaf-1" />
            <TeaLeafCluster cx={150} cy={396} delayClass="leaf-2" scale={0.85} />
            <TeaLeafCluster cx={332} cy={372} delayClass="leaf-3" scale={0.9} />
            <TeaLeafCluster cx={160} cy={456} delayClass="leaf-4" scale={0.8} />
            <TeaLeafCluster cx={328} cy={458} delayClass="leaf-5" scale={0.85} />
            <TeaLeafCluster cx={246} cy={415} delayClass="leaf-1" scale={0.7} dx={18} dy={-10} />
          </g>
        </svg>
      </div>

      {/* Headline content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <span className="text-[#B68D40] text-xs tracking-[0.25em] uppercase font-semibold mb-5">
          Precision Agriculture &middot; Sri Lanka
        </span>
        <h1 className="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] max-w-3xl">
          Every leaf,<br />measured to perfection.
        </h1>
        <p className="text-[#E8E4D6]/85 text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
          TeaPulse AI reads your estate's soil the way a master planter reads a leaf —
          block by block, nutrient by nutrient — so nothing is wasted and nothing is left behind.
        </p>
        <div className="mt-9">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 bg-[#F4EEDD] hover:bg-white text-[#0E2A1D] font-semibold px-8 py-4 rounded-full text-sm transition shadow-xl shadow-black/20"
          >
            Launch Precision Engine <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[#E8E4D6]/70">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

      <style jsx>{`
        /* --- Left rain: water drops + fertilizer granules --- */
        .rain-drop {
          position: absolute;
          top: -30px;
          border-radius: 40% 40% 50% 50%;
          animation-name: rainFall;
          animation-timing-function: cubic-bezier(0.4, 0, 0.7, 1);
          animation-iteration-count: infinite;
        }
        .rain-water {
          background: linear-gradient(180deg, #cfe8dc 0%, #6fb3a0 100%);
          box-shadow: 0 0 4px rgba(207, 232, 220, 0.5);
        }
        .rain-granule {
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #f4dfa8, #b68d40);
        }
        @keyframes rainFall {
          0% { transform: translateY(-30px); opacity: 0; }
          10% { opacity: 1; }
          78% { opacity: 1; }
          88% { transform: translateY(58vh); opacity: 0; }
          100% { transform: translateY(58vh); opacity: 0; }
        }
        .ground-pulse {
          position: absolute;
          bottom: 22%;
          width: 10px;
          height: 10px;
          margin-left: -5px;
          border-radius: 50%;
          border: 1.5px solid rgba(180, 217, 197, 0.55);
          animation: pulseRing 3.4s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(0.3); opacity: 0; }
          15% { opacity: 0.7; }
          60% { transform: scale(2.2); opacity: 0; }
          100% { opacity: 0; }
        }

        /* --- Right side: bush growing in on a loop --- */
        .grow-path {
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          animation: drawBranch 7s ease-in-out infinite;
        }
        .grow-1 { animation-delay: 0s; }
        .grow-2 { animation-delay: 0.5s; }
        .grow-3 { animation-delay: 0.7s; }
        .grow-4 { animation-delay: 0.9s; }
        .grow-5 { animation-delay: 1.1s; }
        @keyframes drawBranch {
          0% { stroke-dashoffset: 140; opacity: 0.4; }
          18% { stroke-dashoffset: 0; opacity: 1; }
          78% { stroke-dashoffset: 0; opacity: 1; }
          92% { stroke-dashoffset: 0; opacity: 0.5; }
          100% { stroke-dashoffset: 140; opacity: 0.4; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rain-drop, .ground-pulse, .grow-path {
            animation: none !important;
            opacity: 0.6;
          }
          .grow-path { stroke-dashoffset: 0; opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}

/** A small cluster of two leaves that fades/scales in, used to dress each branch tip. */
function TeaLeafCluster({
  cx,
  cy,
  delayClass,
  scale = 1,
  dx = 0,
  dy = 0,
}: {
  cx: number;
  cy: number;
  delayClass: string;
  scale?: number;
  dx?: number;
  dy?: number;
}) {
  return (
    // Outer group: static SVG position (never touched by the CSS animation).
    <g transform={`translate(${cx + dx}, ${cy + dy}) scale(${scale})`}>
      {/* Inner group: only opacity/scale are animated, around its own center. */}
      <g className={`leaf-cluster ${delayClass}`}>
        <path d="M0,0 C10,-4 16,-14 6,-22 C-4,-14 -10,-4 0,0 Z" fill="#3E7A57" transform="rotate(-18)" />
        <path d="M0,0 C-10,-3 -15,-13 -5,-20 C5,-13 10,-3 0,0 Z" fill="#F4EEDD" opacity="0.9" transform="rotate(22)" />
      </g>
      <style jsx>{`
        .leaf-cluster {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: leafBloom 7s ease-in-out infinite;
        }
        .leaf-1 { animation-delay: 1.3s; }
        .leaf-2 { animation-delay: 1.8s; }
        .leaf-3 { animation-delay: 2.0s; }
        .leaf-4 { animation-delay: 2.2s; }
        .leaf-5 { animation-delay: 2.4s; }
        @keyframes leafBloom {
          0% { opacity: 0; transform: scale(0.3); }
          22% { opacity: 0; }
          30% { opacity: 1; transform: scale(1); }
          78% { opacity: 1; transform: scale(1); }
          92% { opacity: 0.4; }
          100% { opacity: 0; transform: scale(0.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .leaf-cluster { animation: none; opacity: 0.95; transform: scale(1); }
        }
      `}</style>
    </g>
  );
}