// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Leaf, ArrowLeft, Layers } from "lucide-react";

// Dynamic Imports with Compact Height Loading
const EstateMap = dynamic(() => import("@/components/EstateMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full bg-[#F3EFE3] border border-[#E3DCC6] rounded-2xl flex items-center justify-center text-[#8A836E] text-xs animate-pulse">
      Loading Satellite Map Engine...
    </div>
  ),
});

const Estate3DView = dynamic(() => import("@/components/Estate3DView"), {
  ssr: false,
  loading: () => (
    <div className="h-[620px] w-full bg-[#F3EFE3] border border-[#E3DCC6] rounded-3xl flex items-center justify-center text-[#8A836E] text-xs animate-pulse">
      Loading 3D Land Renderer...
    </div>
  ),
});

export default function DashboardPage() {
  const [isLandSaved, setIsLandSaved] = useState<boolean>(false);
  const [savedPoints, setSavedPoints] = useState<[number, number][]>([]);

  const handleBoundarySave = (points: [number, number][]) => {
    setSavedPoints(points);
    setIsLandSaved(true);
  };

  return (
    <div className="h-screen w-screen bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:px-8 md:py-5 overflow-hidden flex flex-col justify-between">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }
      `}</style>

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between border-b border-[#E3DCC6] pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="bg-white p-2 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#54503F]" />
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#2F6B4A]" />
            <h1 className="font-display text-lg font-semibold tracking-tight text-[#163C2C]">
              TeaPulse <span className="text-[#B68D40]">3D Land Studio</span>
            </h1>
          </div>
        </div>
        <span className="bg-[#2F6B4A]/10 text-[#2F6B4A] px-3 py-1 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> 3D Spatial Division v1.0
        </span>
      </header>

      {/* Main Single Screen Grid */}
      <main className="max-w-7xl w-full mx-auto flex-1 py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center h-full">
          {/* Left Side: Map Container */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-[#E3DCC6] shadow-sm h-full flex flex-col justify-center">
            <EstateMap onBoundarySave={handleBoundarySave} />
          </div>

          {/* Right Side: 3D Land Model */}
          <div className="lg:col-span-7 h-full flex flex-col justify-center">
            <Estate3DView isSaved={isLandSaved} points={savedPoints} />
          </div>
        </div>
      </main>
    </div>
  );
}