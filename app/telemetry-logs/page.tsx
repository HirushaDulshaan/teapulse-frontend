// app/telemetry-logs/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Database,
  Search,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  Layers,
  Sprout,
  Activity,
  CheckCircle2,
  Filter,
  Download,
  TestTube,
  Zap,
  Users,
  Scale,
} from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';

export default function TelemetryLogsPage() {
  const [profile, setProfile] = useState<any>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'soil' | 'harvest'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('userLandProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const totalAcres = profile?.acres ? parseFloat(profile.acres) : 18.67;
  const totalBlocks = Math.max(4, Math.round(totalAcres * 4));

  // Initial Master Telemetry Logs List
  const [logsList, setLogsList] = useState<any[]>([]);

  // Auto Generate Sample Master Logs for All Micro-Blocks
  useEffect(() => {
    const initialLogs: any[] = [];
    const now = new Date();

    for (let i = 1; i <= Math.min(20, totalBlocks); i++) {
      const padded = String(i).padStart(2, '0');
      const timeStr = new Date(now.getTime() - i * 3600000).toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      });

      // Soil Sensor Log Entry
      initialLogs.push({
        id: `LOG-S-${1000 + i}`,
        timestamp: timeStr,
        blockName: `Block ${padded}`,
        category: 'soil',
        type: 'Soil NPK & Telemetry',
        nitrogen: `${110 + (i % 20)} ppm`,
        ph: `${(4.5 + (i % 7) * 0.1).toFixed(1)} pH`,
        harvestKg: '-',
        harvesters: '-',
        status: 'Auto Sensor',
      });

      // Harvest & Labor Log Entry
      initialLogs.push({
        id: `LOG-H-${2000 + i}`,
        timestamp: timeStr,
        blockName: `Block ${padded}`,
        category: 'harvest',
        type: 'Green Leaf Harvest Log',
        nitrogen: '-',
        ph: '-',
        harvestKg: `${180 + (i % 12) * 15} kg`,
        harvesters: `${8 + (i % 4)} Pluckers`,
        status: 'Field Manual Entry',
      });
    }

    setLogsList(initialLogs);
  }, [totalBlocks]);

  // Form State
  const [formData, setFormData] = useState({
    blockNumber: 1,
    logCategory: 'harvest', // 'harvest' or 'soil'
    nitrogen: '120',
    ph: '4.8',
    harvestKg: '190',
    harvesters: '9',
  });

  const [isSavedNotification, setIsSavedNotification] = useState(false);

  // Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const padded = String(formData.blockNumber).padStart(2, '0');
    const newLogEntry = {
      id: `LOG-M-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      blockName: `Block ${padded}`,
      category: formData.logCategory,
      type: formData.logCategory === 'harvest' ? 'Green Leaf Harvest Log' : 'Soil NPK & Telemetry',
      nitrogen: formData.logCategory === 'soil' ? `${formData.nitrogen} ppm` : '-',
      ph: formData.logCategory === 'soil' ? `${formData.ph} pH` : '-',
      harvestKg: formData.logCategory === 'harvest' ? `${formData.harvestKg} kg` : '-',
      harvesters: formData.logCategory === 'harvest' ? `${formData.harvesters} Pluckers` : '-',
      status: 'Manual Insert',
    };

    setLogsList((prev) => [newLogEntry, ...prev]);
    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 3000);
  };

  // Filter Logs based on Search Query & Category Filter
  const filteredLogs = useMemo(() => {
    return logsList.filter((log) => {
      const matchesSearch =
        log.blockName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesCategory =
        selectedCategory === 'all' || log.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [logsList, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 overflow-x-hidden relative">
      {/* 🧭 Sidebar Navigation */}
      <LandSidebar />

      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800 pb-4 mb-6 pr-28">
        <div className="flex items-center gap-3">
          <Link href="/my-land" className="bg-slate-900 p-2 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">
              Telemetry & Field <span className="text-emerald-400">Data Logger</span>
            </h1>
          </div>
        </div>
        <span className="hidden md:flex bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20 items-center gap-1.5">
          <Activity className="w-4 h-4" /> Live System Audit Trail
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-6">

        {/* 1️⃣ TOP METRICS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Log Entries</span>
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{logsList.length} <span className="text-xs text-emerald-400 font-medium">Logs</span></p>
            <p className="text-[11px] text-slate-500">Real-time IoT & Field Audit</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harvest Records</span>
              <div className="bg-sky-500/10 p-2 rounded-xl text-sky-400 border border-sky-500/20">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-sky-400">
              {logsList.filter((l) => l.category === 'harvest').length} <span className="text-xs text-slate-400 font-medium">Entries</span>
            </p>
            <p className="text-[11px] text-slate-500">Green Leaf Yield Logged</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Soil Telemetry Logs</span>
              <div className="bg-purple-500/10 p-2 rounded-xl text-purple-400 border border-purple-500/20">
                <TestTube className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-400">
              {logsList.filter((l) => l.category === 'soil').length} <span className="text-xs text-slate-400 font-medium">Entries</span>
            </p>
            <p className="text-[11px] text-slate-500">IoT Sensor Readings</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Micro-Blocks</span>
              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 border border-amber-500/20">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{totalBlocks} <span className="text-xs text-amber-400 font-medium">Blocks</span></p>
            <p className="text-[11px] text-slate-500">Estate Area: <strong className="text-slate-200">{totalAcres} Acres</strong></p>
          </div>
        </div>

        {/* 2️⃣ 📝 MASTER DATA ENTRY FORM (HARVEST & SOIL LOGGING) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Field Data or Soil Sensor Telemetry</h3>
                <p className="text-xs text-slate-400">Record green leaf harvest, plucker headcount, or soil NPK parameters per block</p>
              </div>
            </div>

            {isSavedNotification && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Data Logged Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            
            {/* 1. SELECT BLOCK */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Block</label>
              <select
                value={formData.blockNumber}
                onChange={(e) => setFormData({ ...formData, blockNumber: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
              >
                {Array.from({ length: totalBlocks }, (_, i) => i + 1).map((num) => {
                  const padded = String(num).padStart(2, '0');
                  return (
                    <option key={num} value={num}>
                      Block {padded}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. CATEGORY SELECTOR */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Log Type</label>
              <select
                value={formData.logCategory}
                onChange={(e) => setFormData({ ...formData, logCategory: e.target.value as 'harvest' | 'soil' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="harvest">🍃 Green Leaf Harvest</option>
                <option value="soil">🧪 Soil Sensor Reading</option>
              </select>
            </div>

            {/* DYNAMIC FIELDS ACCORDING TO CATEGORY */}
            {formData.logCategory === 'harvest' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" /> Leaf Harvest (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.harvestKg}
                    onChange={(e) => setFormData({ ...formData, harvestKg: e.target.value })}
                    placeholder="190"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sky-400" /> Pluckers Count
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.harvesters}
                    onChange={(e) => setFormData({ ...formData, harvesters: e.target.value })}
                    placeholder="9"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> Nitrogen (ppm)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                    placeholder="120"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <TestTube className="w-3.5 h-3.5 text-purple-400" /> Soil pH
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                    placeholder="4.8"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            {/* DUMMY COL SPAN FILLER */}
            <div className="hidden md:block"></div>

            {/* SUBMIT BUTTON */}
            <div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" /> Save Data Log
              </button>
            </div>

          </form>
        </motion.div>

        {/* 3️⃣ MASTER LOGS TABLE WITH SEARCH & CATEGORY FILTERS */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" /> System Telemetry Audit Records
              </h3>
              <p className="text-xs text-slate-400">All recorded field harvest data and IoT soil readings</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Category Filter Buttons */}
              <div className="bg-slate-950 border border-slate-800 p-1 rounded-2xl flex items-center gap-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedCategory === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  All Logs
                </button>
                <button
                  onClick={() => setSelectedCategory('harvest')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedCategory === 'harvest' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Harvest
                </button>
                <button
                  onClick={() => setSelectedCategory('soil')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedCategory === 'soil' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Soil IoT
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search log e.g. Block 05..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Log ID</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Micro-Block</th>
                  <th className="py-3 px-3">Category / Type</th>
                  <th className="py-3 px-3">Green Leaf Harvest</th>
                  <th className="py-3 px-3">Harvesters</th>
                  <th className="py-3 px-3">Soil Nitrogen</th>
                  <th className="py-3 px-3">Soil pH</th>
                  <th className="py-3 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition text-slate-300">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-400">{log.id}</td>
                    <td className="py-3.5 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> {log.blockName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          log.category === 'harvest'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400">{log.harvestKg}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-300">{log.harvesters}</td>
                    <td className="py-3.5 px-3 text-emerald-400">{log.nitrogen}</td>
                    <td className="py-3.5 px-3 text-purple-400">{log.ph}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
}