// app/articles/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';

export default function ArticlesPage() {
  const router = useRouter();

  const articles = [
    {
      id: 1,
      title: 'Optimizing Nitrogen & Soil pH for High-Yield Tea Harvests',
      category: 'Agronomy & Soil',
      readTime: '4 min read',
      date: 'Jul 28, 2026',
      excerpt: 'Discover how maintaining precise soil pH levels between 4.5 and 5.5 and managing nitrogen targets directly boosts Grade A fine tender leaf production.',
      imageBg: 'from-[#2F6B4A] to-[#163C2C]',
    },
    {
      id: 2,
      title: 'The Future of Smart Tea Estates: IoT Sensors & Precision Farming',
      category: 'Smart Agriculture',
      readTime: '6 min read',
      date: 'Jul 20, 2026',
      excerpt: 'How real-time telemetry and IoT soil moisture sensors are transforming traditional 30-acre tea plantations into automated, high-efficiency estates.',
      imageBg: 'from-[#B68D40] to-[#8C6A2F]',
    },
    {
      id: 3,
      title: 'Grade A vs Grade B Leaf Collection: Maximizing Factory Bonuses',
      category: 'Harvest Quality',
      readTime: '5 min read',
      date: 'Jul 15, 2026',
      excerpt: 'A comprehensive guide for estate managers on reducing coarse bulk leaves and maximizing tender bud collection to qualify for premium factory pricing.',
      imageBg: 'from-[#7C5AA6] to-[#553878]',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:p-8 space-y-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }
      `}</style>


      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-4 pr-28">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition text-[#54503F] shadow-sm flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-semibold text-[#163C2C] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2F6B4A]" /> Tea Cultivation & Smart Agri Knowledge Base
            </h1>
            <p className="text-xs text-[#8A836E]">
              Expert insights, agronomy guides, and modern estate management articles
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Updated Daily
        </span>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto pt-2">
        {articles.map((art) => (
          <div key={art.id} className="bg-white border border-[#E3DCC6] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              {/* Gradient Banner representing article theme */}
              <div className={`h-40 w-full bg-gradient-to-br ${art.imageBg} p-6 flex flex-col justify-between text-white relative`}>
                <span className="self-start bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  {art.category}
                </span>
                <div className="flex items-center gap-3 text-[11px] text-white/80">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {art.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {art.readTime}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="font-display font-semibold text-base text-[#163C2C] leading-snug hover:text-[#2F6B4A] transition cursor-pointer">
                  {art.title}
                </h3>
                <p className="text-xs text-[#8A836E] leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button className="w-full bg-[#F3EFE3] hover:bg-[#2F6B4A] hover:text-white text-[#163C2C] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
                Read Full Article <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}