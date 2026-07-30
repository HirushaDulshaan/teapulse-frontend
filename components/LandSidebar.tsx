// components/LandSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Settings,
  Leaf,
  ShieldCheck,
  ChevronRight,
  Database,
  CloudSun,
  Sprout,
  Scale,
} from 'lucide-react';

export default function LandSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: '3D Land Studio', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Registered Estate', href: '/my-land', icon: MapPin },
    { name: 'Soil & Yield Analytics', href: '/yield-analytics', icon: BarChart3 },
    { name: 'Field Work Schedule', href: '/harvest-tracker', icon: Sprout },
    { name: 'Green Leaf Yield Log', href: '/green-leaf-harvest', icon: Scale }, // 👈 NEW DEDICATED PAGE
    { name: 'Daily Telemetry Audit', href: '/telemetry', icon: Database }, // 👈 LINKED TO YOUR TELEMETRY PAGE
    { name: 'Weather Forecast', href: '/weather', icon: CloudSun }, // 👈 UPDATED HERE
    { name: 'Estate Settings', href: '#', icon: Settings },
  ];

  return (
    <>
      {/* Navigation Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 right-6 z-40 bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold transition-all hover:scale-105"
      >
        <Menu className="w-5 h-5 text-emerald-400" />
        <span className="hidden sm:inline">Navigation</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sliding Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-slate-950/95 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-400" />
              <span className="font-black text-lg text-white tracking-wider">
                Tea<span className="text-emerald-400">Pulse</span> GIS
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3">
              Core Applications
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-4 space-y-3">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[11px] font-bold text-white">System Status</p>
              <p className="text-[10px] text-slate-400">Precision IoT Grid Connected</p>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-600">
            TeaPulse 3D Spatial Platform v2.4
          </p>
        </div>
      </aside>
    </>
  );
}