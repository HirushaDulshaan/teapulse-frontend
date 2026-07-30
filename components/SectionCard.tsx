// components/SectionCard.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';

type SectionCardProps = {
  href: string;
  title: string;
  tagline: string;
  gradient: string; // tailwind "from-x to-y" classes, one per card for variety
  Icon: LucideIcon;
  tall?: boolean;
};

/**
 * Full-bleed, image-led link card — the same grammar pureceylontea.com
 * uses for "Story / Production / Diversity / Where to buy": a large
 * photographic block, a dark gradient for legibility, and a short
 * title + tagline pinned to the bottom.
 */
export default function SectionCard({ href, title, tagline, gradient, Icon, tall }: SectionCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl ${tall ? 'h-[420px]' : 'h-[280px]'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 ease-out group-hover:scale-110`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <Icon className="absolute top-5 left-5 w-6 h-6 text-white/80" strokeWidth={1.5} />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-white leading-snug">
          {title}
        </h3>
        <p className="text-white/75 text-xs sm:text-sm mt-1.5 max-w-xs">{tagline}</p>
        <span className="inline-flex items-center gap-1.5 text-[#F4EEDD] text-xs font-semibold mt-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}