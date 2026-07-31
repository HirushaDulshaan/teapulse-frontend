'use client';

import Image from 'next/image';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface SectionCardProps {
    title: string;
    tagline: string;
    gradient: string;
    Icon: LucideIcon;
    image?: string;
    tall?: boolean;
}

export default function SectionCard({
                                        title,
                                        tagline,
                                        gradient,
                                        Icon,
                                        image,
                                        tall = false,
                                    }: SectionCardProps) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-white/10 flex flex-col justify-end p-6 transition-all duration-300 hover:border-white/20 ${
                tall ? 'min-h-[340px]' : 'min-h-[220px]'
            }`}
        >
            {/* Background image, if provided — kept bright, no color wash on top of it */}
            {image && (
                <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center opacity-95 group-hover:scale-105 transition-transform duration-500"
                />
            )}

            {/* Color gradient wash — only used as the card background when there's no photo */}
            {!image && (
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
            )}

            {/* Darken only the lower portion so the title/tagline stay readable,
          while the top of the photo stays bright and clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            {/* Icon */}
            <div className="relative z-10 absolute top-6 left-6 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 text-[#E8E4D6] w-fit">
                <Icon className="w-5 h-5" />
            </div>

            {/* Arrow, appears on hover */}
            <div className="relative z-10 absolute top-6 right-6 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300 bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/10 text-[#00E68A]">
                <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Text */}
            <div className="relative z-10">
                <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                <p className="text-xs text-[#C9C6B8] mt-1.5 leading-relaxed max-w-[85%]">
                    {tagline}
                </p>
            </div>
        </div>
    );
}