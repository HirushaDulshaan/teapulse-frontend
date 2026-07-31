// app/my-land/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Leaf,
  CloudRain,
  CloudFog,
  Thermometer,
  Zap,
  ShieldCheck,
  ArrowLeft,
  TestTube,
  Layers,
  Navigation,
} from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';

// Dynamic import for 3D View
const Partitioned3DView = dynamic(() => import('@/components/Partitioned3DView'), {
  ssr: false,
  loading: () => (
      <div className="h-[620px] w-full bg-[#F3EFE3] border border-[#E3DCC6] rounded-3xl flex items-center justify-center text-[#8A836E] text-xs animate-pulse">
        Loading Dynamic 100+ Block Partition Engine...
      </div>
  ),
});

// Dynamic import for Live GPS Map to avoid SSR window errors
const EstateNavigatorMap = dynamic(() => import('@/components/EstateNavigatorMap'), {
  ssr: false,
  loading: () => (
      <div className="h-72 w-full bg-[#F3EFE3] border border-[#E3DCC6] rounded-3xl flex items-center justify-center text-[#8A836E] text-xs animate-pulse">
        Initializing Live GPS & OpenStreetMap...
      </div>
  ),
});

// 🧭 Splits the land boundary into a grid and returns the real lat/lng center
// of block `index` (1-based) out of `total` blocks. Falls back to a default
// coordinate (Colombo) if no boundary points were saved for this land.
function getBlockLatLng(
    points: any[] | undefined,
    index: number,
    total: number
): { lat: number; lng: number } {
  if (!points || points.length === 0) {
    return { lat: 6.9271, lng: 79.8612 };
  }

  const coords = points
      .map((p: any) => {
        if (Array.isArray(p)) return { lat: p[0], lng: p[1] };
        if (p && typeof p === 'object') {
          const lat = p.lat ?? p.latitude;
          const lng = p.lng ?? p.longitude;
          if (typeof lat === 'number' && typeof lng === 'number') return { lat, lng };
        }
        return null;
      })
      .filter((c): c is { lat: number; lng: number } => c !== null);

  if (coords.length === 0) {
    return { lat: 6.9271, lng: 79.8612 };
  }

  const lats = coords.map((c) => c.lat);
  const lngs = coords.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const cols = Math.max(1, Math.ceil(Math.sqrt(total)));
  const rows = Math.max(1, Math.ceil(total / cols));

  const col = (index - 1) % cols;
  const row = Math.floor((index - 1) / cols);

  // Guard against a degenerate boundary (all points identical / a single point)
  const latSpan = maxLat - minLat || 0.001;
  const lngSpan = maxLng - minLng || 0.001;

  const lat = minLat + ((row + 0.5) / rows) * latSpan;
  const lng = minLng + ((col + 0.5) / cols) * lngSpan;

  return { lat, lng };
}

export default function MyLandPage() {
  const [profile, setProfile] = useState<any>(null);
  const [landData, setLandData] = useState<any>(null);

  const totalMicroBlocks = useMemo(() => {
    const acreValue = landData?.acres || profile?.acres;
    if (!acreValue) return 4;
    return Math.max(4, Math.round(parseFloat(acreValue) * 4));
  }, [profile, landData]);

  const [blocksDataMap, setBlocksDataMap] = useState<{ [key: string]: any }>({});
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(1);

  const [formData, setFormData] = useState({
    nTarget: '119',
    slope: '19',
    ph: '4.6',
    status: 'Optimal',
  });

  // 🗺️ Toggle to show Live GPS Navigator Map for the selected block
  const [activeNavigatorBlock, setActiveNavigatorBlock] = useState<number | null>(null);

  // 1. Initial Data Fetch
  useEffect(() => {
    const savedProfile = localStorage.getItem('userLandProfile');
    const sessionUser = localStorage.getItem('userSession');
    const sessionLand = localStorage.getItem('userLand');

    let mergedProfile: any = {};

    if (savedProfile) {
      mergedProfile = { ...JSON.parse(savedProfile) };
    }

    if (sessionUser) {
      const u = JSON.parse(sessionUser);
      mergedProfile = { ...mergedProfile, firstName: u.first_name, lastName: u.last_name, email: u.email };
    }

    if (sessionLand) {
      const l = JSON.parse(sessionLand);
      setLandData(l);
      mergedProfile = { ...mergedProfile, acres: l.acres, points: l.boundary_points };
    }

    if (mergedProfile.firstName || mergedProfile.acres) {
      setProfile(mergedProfile);

      const totalCount = Math.max(4, Math.round(parseFloat(mergedProfile.acres || '1') * 4));
      const initialMap: { [key: string]: any } = {};

      for (let i = 1; i <= totalCount; i++) {
        const padded = String(i).padStart(2, '0');
        const { lat, lng } = getBlockLatLng(mergedProfile.points, i, totalCount);

        initialMap[i] = {
          id: i,
          name: `Block ${padded}`,
          acreage: '0.25',
          nTarget: String(110 + (i % 15)),
          slope: String(10 + (i % 12)),
          ph: (4.5 + (i % 8) * 0.1).toFixed(1),
          status: i % 7 === 0 ? 'Needs Fertilizer' : 'Optimal',
          lat,
          lng,
        };
      }

      setBlocksDataMap(initialMap);

      if (initialMap[1]) {
        setFormData({
          nTarget: initialMap[1].nTarget,
          slope: initialMap[1].slope,
          ph: initialMap[1].ph,
          status: initialMap[1].status,
        });
      }
    }
  }, []);

  const handleBlockNumberChange = (num: number) => {
    setSelectedBlockNumber(num);
    const block = blocksDataMap[num];
    if (block) {
      setFormData({
        nTarget: block.nTarget,
        slope: block.slope,
        ph: block.ph,
        status: block.status,
      });
    }
  };

  const handle3DBlockSelect = (blockId: string | null) => {
    if (!blockId) return;
    const num = parseInt(blockId.replace('block-', ''), 10);
    if (!isNaN(num)) {
      handleBlockNumberChange(num);
    }
  };

  if (!profile) {
    return (
        <div className="min-h-screen bg-[#FBFAF6] flex flex-col items-center justify-center text-[#54503F] space-y-4">
          <p>No Registered Land Found.</p>
          <Link href="/dashboard" className="bg-[#163C2C] text-[#F4EEDD] px-4 py-2 rounded-xl text-xs font-bold">
            Go to 3D Land Studio
          </Link>
        </div>
    );
  }

  const previewBlocks = [
    selectedBlockNumber,
    selectedBlockNumber + 1 <= totalMicroBlocks ? selectedBlockNumber + 1 : 1,
    selectedBlockNumber + 2 <= totalMicroBlocks ? selectedBlockNumber + 2 : 2,
    selectedBlockNumber + 3 <= totalMicroBlocks ? selectedBlockNumber + 3 : 3,
  ];

  const activeBlock = activeNavigatorBlock ? blocksDataMap[activeNavigatorBlock] : null;

  return (
      <div className="min-h-screen bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:p-6 overflow-x-hidden relative">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
          .font-display {
            font-family: 'Fraunces', Georgia, serif;
            font-optical-sizing: auto;
          }
        `}</style>

        {/* 🧭 RIGHT-SIDE SLIDING SIDEBAR NAVIGATION COMPONENT */}
        <LandSidebar />

        {/* Header */}
        <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-[#E3DCC6] pb-4 mb-6 pr-28">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="bg-white p-2 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm">
              <ArrowLeft className="w-5 h-5 text-[#54503F]" />
            </Link>
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-[#2F6B4A]" />
              <h1 className="font-display text-xl font-semibold tracking-tight text-[#163C2C]">
                {profile.firstName || 'User'}'s Registered <span className="text-[#B68D40]">3D Estate</span>
              </h1>
            </div>
          </div>
          <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Verified Land Owner ({totalMicroBlocks} Blocks)
        </span>
        </header>

        {/* Main Container */}
        <main className="max-w-7xl mx-auto space-y-6">

          {/* Weather Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-white p-4 rounded-2xl border border-[#E3DCC6] shadow-sm flex items-center gap-3">
              <div className="bg-[#3E7AA8]/10 p-2.5 rounded-xl text-[#3E7AA8] border border-[#3E7AA8]/20"><CloudRain className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-[#8A836E] uppercase font-bold">Rainfall</p><p className="text-base font-black text-[#163C2C]">245 mm<span className="text-[10px] text-[#8A836E] font-normal">/mo</span></p></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="bg-white p-4 rounded-2xl border border-[#E3DCC6] shadow-sm flex items-center gap-3">
              <div className="bg-[#4E9C9C]/10 p-2.5 rounded-xl text-[#4E9C9C] border border-[#4E9C9C]/20"><CloudFog className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-[#8A836E] uppercase font-bold">Fog / Humidity</p><p className="text-base font-black text-[#163C2C]">82%</p></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className="bg-white p-4 rounded-2xl border border-[#E3DCC6] shadow-sm flex items-center gap-3">
              <div className="bg-[#B68D40]/10 p-2.5 rounded-xl text-[#B68D40] border border-[#B68D40]/20"><Thermometer className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-[#8A836E] uppercase font-bold">Temperature</p><p className="text-base font-black text-[#163C2C]">24.5 °C</p></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className="bg-white p-4 rounded-2xl border border-[#E3DCC6] shadow-sm flex items-center gap-3">
              <div className="bg-[#2F6B4A]/10 p-2.5 rounded-xl text-[#2F6B4A] border border-[#2F6B4A]/20"><Zap className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-[#8A836E] uppercase font-bold">Soil Nitrogen</p><p className="text-base font-black text-[#2F6B4A]">{formData.nTarget} ppm</p></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }} className="bg-white p-4 rounded-2xl border border-[#E3DCC6] shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="bg-[#7C5AA6]/10 p-2.5 rounded-xl text-[#7C5AA6] border border-[#7C5AA6]/20"><TestTube className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-[#8A836E] uppercase font-bold">Soil pH Level</p><p className="text-base font-black text-[#7C5AA6]">{formData.ph} pH</p></div>
            </motion.div>
          </div>

          {/* 3D Model Stage */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Partitioned3DView
                points={profile.points}
                selectedBlockId={`block-${selectedBlockNumber}`}
                onSelectBlock={handle3DBlockSelect}
            />
          </motion.div>

          {/* Active Block Live Telemetry Cards with 🧭 Navigate Button */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {previewBlocks.map((bNum) => {
              const block = blocksDataMap[bNum];
              if (!block) return null;
              const isCurrentSelected = bNum === selectedBlockNumber;

              return (
                  <motion.div
                      key={bNum}
                      onClick={() => handleBlockNumberChange(bNum)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                          isCurrentSelected
                              ? 'bg-white border-[#B68D40]/80 shadow-lg shadow-[#B68D40]/15 ring-1 ring-[#B68D40]/40'
                              : 'bg-white/70 border-[#E3DCC6] hover:border-[#B68D40]/30'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-2">
                    <span className="text-xs font-bold text-[#163C2C] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#B68D40]" /> {block.name}
                    </span>
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                block.status === 'Optimal'
                                    ? 'bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/20'
                                    : 'bg-[#B68D40]/10 text-[#B68D40] border border-[#B68D40]/20'
                            }`}
                        >
                      {block.status}
                    </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8A836E] pt-2">
                        <div>
                          Acreage: <strong className="text-[#54503F]">{block.acreage} Ac</strong>
                        </div>
                        <div>
                          N Target: <strong className="text-[#2F6B4A]">{block.nTarget} kg</strong>
                        </div>
                        <div>
                          Slope: <strong className="text-[#54503F]">{block.slope}°</strong>
                        </div>
                        <div>
                          Soil pH: <strong className="text-[#7C5AA6]">{block.ph} pH</strong>
                        </div>
                      </div>
                    </div>

                    {/* 🧭 In-Estate Navigation Action Button for Selected Block */}
                    {isCurrentSelected && (
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveNavigatorBlock(activeNavigatorBlock === bNum ? null : bNum);
                            }}
                            className="mt-3 w-full bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition shadow-sm"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          {activeNavigatorBlock === bNum ? 'Hide Live Map' : `Navigate to ${block.name}`}
                        </button>
                    )}
                  </motion.div>
              );
            })}
          </div>

          {/* 🗺️ Live GPS OpenStreetMap Integration for Selected Block */}
          {activeBlock && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <EstateNavigatorMap
                    targetBlockName={activeBlock.name}
                    targetLat={activeBlock.lat}
                    targetLng={activeBlock.lng}
                />
              </motion.div>
          )}

        </main>
      </div>
  );
}