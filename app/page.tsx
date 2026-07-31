'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Leaf,
  MapPin,
  Boxes,
  TrendingUp,
  FlaskConical,
  ScanLine,
  ArrowRight,
} from 'lucide-react';
import SectionCard from '@/components/SectionCard';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

const HeroFullBleed = dynamic(() => import('@/components/HeroFullBleed'), {
  ssr: false,
  loading: () => <div className="w-full h-[86vh] min-h-[600px] bg-[#0A0F0D]" />,
});

export default function LandingPage() {
  return (
      <div className="relative min-h-screen bg-[#0A0F0D] text-[#E8E4D6]">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
          .font-display {
            font-family: 'Fraunces', Georgia, serif;
            font-optical-sizing: auto;
          }
          body {
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          }
        `}</style>

        <Navbar />

        <HeroFullBleed />

        {/* Trust / credibility section */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
          <span className="text-[#00E68A] text-xs tracking-[0.25em] uppercase font-semibold">
            Built on the science of the soil
          </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-4 leading-snug">
              A century of planter&apos;s instinct, translated into precise,{' '}
              <span className="bg-gradient-to-r from-[#00E68A] to-[#38BDF8] bg-clip-text text-transparent">
              block-by-block data.
            </span>
            </h2>
            <p className="text-[#B9B6A8] text-base leading-relaxed mt-6 max-w-xl">
              For generations, Sri Lanka&apos;s finest estates were shaped by the trained eye of the
              superintendent — reading colour, soil, and slope by hand. TeaPulse AI keeps that same
              judgment, and gives it satellite eyes and a calculator: every division mapped,
              every deficit measured, every bag of fertilizer accounted for.
            </p>
            <Link
                href="/introduction"
                className="inline-flex items-center gap-2 text-white font-semibold text-sm mt-8 border-b-2 border-[#00E68A] pb-1 hover:gap-3 transition-all"
            >
              See how it works <ArrowRight className="w-4 h-4 text-[#00E68A]" />
            </Link>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 col-span-2 flex items-center gap-4">
              <div className="bg-[#00E68A]/10 p-3 rounded-xl text-[#00E68A]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-white">35%</p>
                <p className="text-xs text-[#8A8677] font-medium">Average input cost savings</p>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="font-display text-2xl font-semibold text-white">100%</p>
              <p className="text-xs text-[#8A8677] font-medium mt-1">Estate blocks mapped</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="font-display text-2xl font-semibold text-[#38BDF8]">0</p>
              <p className="text-xs text-[#8A8677] font-medium mt-1">Wasted chemical, by design</p>
            </div>
          </div>
        </section>

        {/* Image-led section grid */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 sm:pb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#00E68A] text-xs tracking-[0.25em] uppercase font-semibold">
            The Precision Engine
          </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-4">
              Engineered for Sri Lankan estates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SectionCard
                title="Satellite Estate Mapping"
                tagline="Draw your land on satellite imagery and get a live 3D model of your estate."
                gradient="from-[#0F3D2A] to-[#0A0F0D]"
                Icon={MapPin}
                image="/images/section-mapping.png"
                tall
            />
            <SectionCard
                title="Smart Block Division"
                tagline="Every acre split into 4 blocks, each with its own route and navigation on the map."
                gradient="from-[#00E68A]/20 to-[#0A0F0D]"
                Icon={Boxes}
                image="/images/section-blocks.png"
                tall
            />
            <SectionCard
                title="Daily Soil Intelligence"
                tagline="pH, nitrogen, oxygen and calcium tracked per block, with AI tasks when levels drift."
                gradient="from-[#0E4A33] to-[#0A0F0D]"
                Icon={FlaskConical}
                image="/images/section-soil.png"
            />
            <SectionCard
                title="Yield Predictions"
                tagline="Complete a task and see the AI's forecast for how your harvest will respond."
                gradient="from-[#38BDF8]/20 to-[#0A0F0D]"
                Icon={TrendingUp}
                image="/images/section-yield.png"
            />
            <SectionCard
                title="AI Agronomy & Plant Doctor"
                tagline="Upload a tea leaf photo to instantly detect disease, pest damage, and get a treatment plan."
                gradient="from-[#0F1F17] to-[#050B08]"
                Icon={ScanLine}
                image="/images/section-plant-doctor.png"
            />
          </div>
        </section>

        {/* Closing band */}
        <section className="relative z-10 bg-[#050B08] py-16 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="font-display text-2xl sm:text-3xl text-white leading-snug">
              &ldquo;What the Rolex is to watches, Ceylon is to tea &mdash; and precision is what
              keeps it that way.&rdquo;
            </p>
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 bg-[#00E68A] hover:bg-[#00E68A]/90 text-[#0A0F0D] font-semibold px-8 py-4 rounded-full text-sm transition shadow-xl shadow-black/30 mt-8"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Footer />

      </div>
  );
}