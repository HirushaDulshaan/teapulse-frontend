'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Scale,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Loader2,
  Calendar,
  CheckCircle2,
  BarChart3,
  Sprout,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import LandSidebar from '@/components/LandSidebar';
import { authFetch } from '@/lib/auth';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export default function GreenLeafHarvestPage() {
  const [land, setLand] = useState<any>(null);
  const queryClient = useQueryClient();

  // Form States for Grade A & Grade B (Removed quality slider)
  const [gradeAKg, setGradeAKg] = useState<string>('');
  const [gradeBKg, setGradeBKg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter Modes: 'daily' | 'weekly' | 'monthly'
  const [chartMode, setChartMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const todayDateStr = useMemo(() => new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }), []);

  // land comes from localStorage, not the server, so this stays a plain
  // useEffect — React Query is for server data, not reading localStorage.
  useEffect(() => {
    const sessionLand = localStorage.getItem('userLand');
    if (sessionLand) {
      setLand(JSON.parse(sessionLand));
    }
  }, []);

  // 👇 useQuery replaces: fetchHarvestLogs() + harvestLogs state + loading state
  // + the manual useEffect call. It refetches automatically whenever
  // `land.id` changes, caches the result, and gives us isLoading for free.
  const {
    data: harvestLogs = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ['harvest-logs', land?.id],
    queryFn: async () => {
      const res = await authFetch(`${FASTAPI_URL}/api/v1/tea-leaves/get-harvest-logs/${land.id}`);
      const result = await res.json();
      if (!res.ok || result.status !== 'success') {
        throw new Error(result.detail || 'Failed to load harvest logs');
      }
      return result.data || [];
    },
    enabled: !!land?.id, // don't run the query until we actually have a land id
  });

  // Live Total Calculation for UI Preview
  const liveTotalKg = useMemo(() => {
    const a = parseFloat(gradeAKg) || 0;
    const b = parseFloat(gradeBKg) || 0;
    return (a + b).toFixed(1);
  }, [gradeAKg, gradeBKg]);

  // 👇 useMutation replaces: handleSaveHarvest's manual isSubmitting state +
  // try/catch/finally. On success it invalidates the harvest-logs query,
  // which automatically triggers the useQuery above to refetch — no more
  // manually calling fetchHarvestLogs(land.id) after saving.
  const { mutate: saveHarvest, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`${FASTAPI_URL}/api/v1/tea-leaves/record-harvest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          land_id: land.id,
          grade_a_weight_kg: parseFloat(gradeAKg) || 0,
          grade_b_weight_kg: parseFloat(gradeBKg) || 0,
          quality_grade_pct: 75.0, // Default fixed quality value since slider is removed
        }),
      });
      const result = await res.json();
      if (!res.ok || result.status !== 'success') {
        throw new Error(result.detail || 'Failed to save harvest');
      }
      return result;
    },
    onSuccess: (result) => {
      setSuccessMsg(result.message);
      setGradeAKg('');
      setGradeBKg('');
      queryClient.invalidateQueries({ queryKey: ['harvest-logs', land?.id] });
    },
    onError: (err) => {
      console.error('Save harvest error:', err);
    },
  });

  const handleSaveHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!land?.id) return;
    setSuccessMsg(null);
    saveHarvest();
  };

  // Format Chart Data based on Daily, Weekly, Monthly views
  const formattedChartData = useMemo(() => {
    if (harvestLogs.length === 0) return [];

    if (chartMode === 'daily') {
      return harvestLogs.map((log: any) => ({
        date: log.harvest_date.slice(5),
        gradeA: parseFloat(log.grade_a_weight_kg || 0),
        gradeB: parseFloat(log.grade_b_weight_kg || 0),
        total: parseFloat(log.total_weight_kg || 0),
      }));
    }

    const grouped: { [key: string]: { gradeA: number; gradeB: number; total: number } } = {};

    harvestLogs.forEach((log: any) => {
      const dateObj = new Date(log.harvest_date);
      let key = log.harvest_date.slice(5);

      if (chartMode === 'weekly') {
        const weekNum = Math.ceil(dateObj.getDate() / 7);
        key = `W${weekNum} (${dateObj.toLocaleString('default', { month: 'short' })})`;
      } else if (chartMode === 'monthly') {
        key = dateObj.toLocaleString('default', { month: 'short', year: '2-digit' });
      }

      if (!grouped[key]) {
        grouped[key] = { gradeA: 0, gradeB: 0, total: 0 };
      }
      grouped[key].gradeA += parseFloat(log.grade_a_weight_kg || 0);
      grouped[key].gradeB += parseFloat(log.grade_b_weight_kg || 0);
      grouped[key].total += parseFloat(log.total_weight_kg || 0);
    });

    return Object.keys(grouped).map((k) => ({
      date: k,
      gradeA: Math.round(grouped[k].gradeA),
      gradeB: Math.round(grouped[k].gradeB),
      total: Math.round(grouped[k].total),
    }));
  }, [harvestLogs, chartMode]);

  return (
    <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:p-8 space-y-6 overflow-x-hidden relative">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }
      `}</style>

      <LandSidebar />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#E3DCC6] pb-4 pr-28">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-[#54503F]" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-[#163C2C] flex items-center gap-2">
              <Scale className="w-6 h-6 text-[#2F6B4A]" />
              Green Leaf Yield & <span className="text-[#2F6B4A]">Quality Studio</span>
            </h1>
            <p className="text-xs text-[#8A836E]">
              Estate: <strong className="text-[#163C2C]">{land?.land_name || 'My Registered Estate'}</strong> — Grade A & Grade B Leaf Collection
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Grouped Bar Analytics Connected
        </span>
      </header>

      {/* Main Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1️⃣ LEFT: GRADE A & GRADE B FORM */}
        <div className="lg:col-span-4 bg-white border border-[#E3DCC6] shadow-sm p-6 rounded-3xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-3">
              <h3 className="font-display font-semibold text-[#163C2C] text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#2F6B4A]" /> Record Harvest by Grade
              </h3>
              <span className="text-[10px] bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/20 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {todayDateStr}
              </span>
            </div>

            {successMsg && (
              <div className="bg-[#2F6B4A]/10 border border-[#2F6B4A]/20 p-3 rounded-2xl text-[#2F6B4A] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveHarvest} className="space-y-4">
              {/* Date Auto */}
              <div>
                <label className="text-[11px] text-[#8A836E] font-bold uppercase tracking-wider block mb-1">
                  Recording Date (System Auto)
                </label>
                <input
                  type="text"
                  value={todayDateStr}
                  disabled
                  className="w-full bg-[#F3EFE3] border border-[#E3DCC6] rounded-xl px-4 py-2 text-xs text-[#8A836E] font-mono cursor-not-allowed"
                />
              </div>

              {/* Grade A Weight */}
              <div className="bg-[#FBFAF6] p-3.5 rounded-2xl border border-[#E3DCC6] space-y-2">
                <label className="text-xs font-bold text-[#2F6B4A] flex items-center justify-between">
                  <span>🟢 Grade A (Fine Leaf / දලු)</span>
                  <span className="text-[10px] text-[#8A836E]">Tender Buds</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 120.0"
                    required
                    value={gradeAKg}
                    onChange={(e) => setGradeAKg(e.target.value)}
                    className="w-full bg-white border border-[#E3DCC6] rounded-xl px-4 py-2 text-sm text-[#163C2C] font-bold placeholder-[#B7AF98] focus:outline-none focus:border-[#2F6B4A]"
                  />
                  <span className="absolute right-3 top-2 text-xs text-[#2F6B4A] font-bold">Kg</span>
                </div>
              </div>

              {/* Grade B Weight */}
              <div className="bg-[#FBFAF6] p-3.5 rounded-2xl border border-[#E3DCC6] space-y-2">
                <label className="text-xs font-bold text-[#800020] flex items-center justify-between">
                  <span>🔴 Grade B (Coarse / රුචිය)</span>
                  <span className="text-[10px] text-[#8A836E]">Bulk Leaf</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 80.0"
                    required
                    value={gradeBKg}
                    onChange={(e) => setGradeBKg(e.target.value)}
                    className="w-full bg-white border border-[#E3DCC6] rounded-xl px-4 py-2 text-sm text-[#163C2C] font-bold placeholder-[#B7AF98] focus:outline-none focus:border-[#800020]"
                  />
                  <span className="absolute right-3 top-2 text-xs text-[#800020] font-bold">Kg</span>
                </div>
              </div>

              {/* Live Total Calculated Badge */}
              <div className="flex items-center justify-between bg-[#F3EFE3] p-3.5 rounded-2xl border border-[#E3DCC6]">
                <span className="text-xs font-bold text-[#54503F]">Total Leaf Weight:</span>
                <span className="text-sm font-black text-[#2F6B4A]">{liveTotalKg} Kg</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#163C2C]/15 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Scale className="w-4 h-4" /> Save Grade-Wise Harvest Entry
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#F3EFE3] p-3 rounded-2xl border border-[#E3DCC6] text-[11px] text-[#54503F]">
            <p>💡 Submitting for today will automatically update today's Grade A & Grade B collection totals.</p>
          </div>
        </div>

        {/* 2️⃣ RIGHT: GROUPED BAR CHART (Grade A Green Bar & Grade B Maroon Bar Side-by-Side) */}
        <div className="lg:col-span-8 bg-white border border-[#E3DCC6] shadow-sm p-6 rounded-3xl space-y-5 flex flex-col justify-between h-[540px]">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DCC6] pb-3">
            <div>
              <h3 className="font-display font-semibold text-[#163C2C] text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2F6B4A]" /> Grade A (Green) & Grade B (Maroon) Side-by-Side Analytics
              </h3>
              <p className="text-xs text-[#8A836E]">Comparing fine tender leaves against coarse bulk leaves side-by-side</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#F3EFE3] p-1 rounded-xl border border-[#E3DCC6] text-xs">
              <button
                onClick={() => setChartMode('daily')}
                className={`px-3 py-1 rounded-lg transition font-bold ${chartMode === 'daily' ? 'bg-[#2F6B4A] text-white' : 'text-[#8A836E]'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setChartMode('weekly')}
                className={`px-3 py-1 rounded-lg transition font-bold ${chartMode === 'weekly' ? 'bg-[#2F6B4A] text-white' : 'text-[#8A836E]'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartMode('monthly')}
                className={`px-3 py-1 rounded-lg transition font-bold ${chartMode === 'monthly' ? 'bg-[#2F6B4A] text-white' : 'text-[#8A836E]'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Recharts Grouped Bar Chart */}
          <div className="h-80 w-full pt-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-[#8A836E] gap-2 text-xs">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading Harvest Records...
              </div>
            ) : formattedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDEADC" />
                  <XAxis dataKey="date" stroke="#8A836E" fontSize={11} />
                  <YAxis
                    stroke="#8A836E"
                    fontSize={11}
                    unit="kg"
                    domain={[0, 'auto']}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCC6', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend />
                  {/* Grade B Maroon Bar on the left / side-by-side */}
                  <Bar dataKey="gradeB" name="Grade B (Coarse Leaf / රුචිය)" fill="#800020" radius={[6, 6, 0, 0]} barSize={25} />
                  {/* Grade A Green Bar side-by-side */}
                  <Bar dataKey="gradeA" name="Grade A (Fine Leaf / දලු)" fill="#2F6B4A" radius={[6, 6, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#8A836E] italic border border-dashed border-[#E3DCC6] rounded-2xl">
                No harvest logs recorded yet. Enter Grade A and Grade B leaf weights on the left!
              </div>
            )}
          </div>

          <div className="bg-[#2F6B4A]/10 border border-[#2F6B4A]/20 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#2F6B4A] font-bold">
              <TrendingUp className="w-5 h-5 shrink-0" />
              <span>
                Factory Quality Standard: Side-by-side comparison ensures clear visualization of <strong>Grade A (Green)</strong> vs <strong>Grade B (Maroon)</strong> collections.
              </span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}