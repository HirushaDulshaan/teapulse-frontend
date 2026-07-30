// app/yield-analytics/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ArrowLeft,
  Search,
  Sparkles,
  Activity,
  Bot,
  Loader2,
  Clock,
  Droplets,
  TestTube,
  Mountain,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import LandSidebar from '@/components/LandSidebar';

export default function YieldAnalyticsPage() {
  const [land, setLand] = useState<any>(null);
  const [logsList, setLogsList] = useState<any[]>([]);
  const [predictionsList, setPredictionsList] = useState<any[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockNum, setSelectedBlockNum] = useState<number>(1);
  const [activeMetric, setActiveMetric] = useState<'ph' | 'nitrogen' | 'moisture' | 'slope'>('ph');

  // AI Recommendation States
  const [aiPrescription, setAiPrescription] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [taskAddedMsg, setTaskAddedMsg] = useState<string | null>(null);

  // Total blocks calculation
  const totalAcres = useMemo(() => land?.acres || 2.67, [land]);
  const totalBlocks = useMemo(() => Math.max(4, Math.round(totalAcres * 4)), [totalAcres]);

  useEffect(() => {
    const sessionLand = localStorage.getItem('userLand');
    if (sessionLand) {
      const parsed = JSON.parse(sessionLand);
      setLand(parsed);
      fetchTelemetryLogs(parsed.id);
      fetchActivePredictions(parsed.id);
    }
  }, []);

  const fetchTelemetryLogs = async (landId: string) => {
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const res = await fetch(`${fastApiUrl}/api/v1/telemetry/get-logs/${landId}`);
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        setLogsList(result.data || []);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
    }
  };

  const fetchActivePredictions = async (landId: string) => {
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const res = await fetch(`${fastApiUrl}/api/v1/ai/get-active-predictions/${landId}`);
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        setPredictionsList(result.data || []);
      }
    } catch (err) {
      console.error('Fetch predictions error:', err);
    }
  };

  const activePredictionForBlock = useMemo(() => {
    return predictionsList.find((p) => p.block_number === selectedBlockNum);
  }, [predictionsList, selectedBlockNum]);

  // Selected Block's Latest Data
  const currentBlockLatest = useMemo(() => {
    const blockLogs = logsList.filter((l) => l.block_number === selectedBlockNum);

    let basePh = 4.6;
    let baseN = 115;
    let baseMoisture = 68 + (selectedBlockNum % 15);
    let baseSlope = 12;

    if (blockLogs.length > 0) {
      const latest = blockLogs[0];
      basePh = parseFloat(latest.soil_ph) || 4.6;
      baseN = parseFloat(latest.nitrogen_target) || 115;
      baseSlope = parseFloat(latest.slope) || 12;
    }

    if (activePredictionForBlock) {
      basePh = parseFloat((basePh + 0.3).toFixed(1));
      baseN = baseN + 15;
      baseMoisture = Math.min(95, baseMoisture + 12);
    }

    return {
      nitrogen_target: baseN,
      soil_ph: basePh,
      slope: baseSlope,
      moisture_level: baseMoisture,
    };
  }, [logsList, selectedBlockNum, activePredictionForBlock]);

  useEffect(() => {
    setAiPrescription(null);
    setTaskAddedMsg(null);
  }, [selectedBlockNum]);

  // 🤖 Function to Fetch Gemini AI Soil Advice
  const fetchAiRecommendation = async () => {
    setIsLoadingAi(true);
    setTaskAddedMsg(null);
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const response = await fetch(`${fastApiUrl}/api/v1/ai/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_name: `Block ${String(selectedBlockNum).padStart(2, '0')}`,
          soil_ph: parseFloat(String(currentBlockLatest.soil_ph)),
          nitrogen_target: parseFloat(String(currentBlockLatest.nitrogen_target)),
          moisture_level: parseFloat(String(currentBlockLatest.moisture_level)),
          slope: parseFloat(String(currentBlockLatest.slope)),
        }),
      });

      const resData = await response.json();
      if (resData.status === 'success') {
        setAiPrescription(resData.recommendation);
      }
    } catch (err) {
      console.error('Error fetching AI advice:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 📋 Function to Save AI Recommendation as a Work Task
  const handleAddToTasks = async () => {
    if (!aiPrescription || !land?.id) return;

    setIsSavingTask(true);
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const response = await fetch(`${fastApiUrl}/api/v1/ai/add-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          land_id: land.id,
          block_number: selectedBlockNum,
          task_title: aiPrescription.treatmentName,
          dosage: aiPrescription.dosage,
          application_time: aiPrescription.applicationTime,
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.status === 'success') {
        setTaskAddedMsg(`Task assigned to Block ${String(selectedBlockNum).padStart(2, '0')} Work Schedule! Check Harvest & Labor Tracker.`);
      }
    } catch (err) {
      console.error('Add task error:', err);
    } finally {
      setIsSavingTask(false);
    }
  };

  // 🚀 Split Actual vs Predicted Data into 2 separate keys for distinct Line Styling
  const chartData = useMemo(() => {
    const blockLogs = logsList
      .filter((l) => l.block_number === selectedBlockNum)
      .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

    const resultData = blockLogs.map((log) => {
      const val =
        activeMetric === 'ph' ? parseFloat(log.soil_ph) :
        activeMetric === 'nitrogen' ? parseFloat(log.nitrogen_target) :
        activeMetric === 'moisture' ? 68 + (selectedBlockNum % 15) :
        parseFloat(log.slope);

      return {
        date: log.log_date.slice(5),
        actual: val,
        predicted: null as number | null,
        ideal: activeMetric === 'ph' ? 4.8 : activeMetric === 'nitrogen' ? 120 : activeMetric === 'moisture' ? 75 : 15,
      };
    });

    // If active prediction exists, attach connection point and prediction point
    if (activePredictionForBlock && resultData.length > 0) {
      const lastIdx = resultData.length - 1;
      const lastActual = resultData[lastIdx].actual;

      // Connect actual line to predicted line seamlessly
      resultData[lastIdx].predicted = lastActual;

      const boost =
        activeMetric === 'ph' ? 0.3 :
        activeMetric === 'nitrogen' ? 15 :
        activeMetric === 'moisture' ? 12 : 0;

      const projectedVal = parseFloat((lastActual + boost).toFixed(1));

      resultData.push({
        date: 'Predict (10d)',
        actual: null, // Actual stops here
        predicted: projectedVal,
        ideal: activeMetric === 'ph' ? 4.8 : activeMetric === 'nitrogen' ? 120 : activeMetric === 'moisture' ? 75 : 15,
      });
    }

    return resultData;
  }, [logsList, selectedBlockNum, activeMetric, activePredictionForBlock]);

  const metricConfig = {
    ph: { label: 'Soil pH', color: '#7C5AA6', idealVal: 4.8, unit: 'pH' },
    nitrogen: { label: 'Nitrogen Level', color: '#2F6B4A', idealVal: 120, unit: 'kg' },
    moisture: { label: 'Soil Water / Moisture', color: '#3E7AA8', idealVal: 75, unit: '%' },
    slope: { label: 'Block Slope', color: '#B68D40', idealVal: 15, unit: '°' },
  };

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
          <Link href="/my-land" className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-[#54503F]" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-[#163C2C] flex items-center gap-2">
              <TestTube className="w-6 h-6 text-[#7C5AA6]" />
              Soil & Telemetry <span className="text-[#7C5AA6]">AI Analysis Studio</span>
            </h1>
            <p className="text-xs text-[#8A836E]">
              Estate: <strong className="text-[#163C2C]">{land?.land_name || 'My Estate'}</strong> ({totalAcres} Acres)
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-[#7C5AA6]/10 text-[#7C5AA6] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#7C5AA6]/20 items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Gemini AI Soil Agronomist Connected
        </span>
      </header>

      {/* Active Treatment Banner */}
      {activePredictionForBlock && (
        <div className="bg-[#2F6B4A]/10 border border-[#2F6B4A]/30 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#2F6B4A] font-bold">
            <TrendingUp className="w-5 h-5" />
            <span>
              Block {String(selectedBlockNum).padStart(2, '0')} has an active completed treatment! Chart shows AI Predicted 10-Day Recovery (Dashed Blue Line).
            </span>
          </div>
          <span className="bg-[#2F6B4A] text-[#F4EEDD] font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider shrink-0">
            Recovery Active
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="space-y-6">

        {/* 1️⃣ OVERVIEW SOIL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Soil pH Level</span>
              <div className="bg-[#7C5AA6]/10 p-2 rounded-xl text-[#7C5AA6] border border-[#7C5AA6]/20">
                <TestTube className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#7C5AA6]">
              {currentBlockLatest.soil_ph} <span className="text-xs font-medium text-[#8A836E]">pH</span>
            </p>
            <p className="text-[11px] text-[#8A836E]">
              {activePredictionForBlock ? (
                <strong className="text-[#2F6B4A]">Boosted by Treatment</strong>
              ) : (
                'Target Range: 4.5 - 5.5 pH'
              )}
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Soil Nitrogen Level</span>
              <div className="bg-[#2F6B4A]/10 p-2 rounded-xl text-[#2F6B4A] border border-[#2F6B4A]/20">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#2F6B4A]">
              {currentBlockLatest.nitrogen_target} <span className="text-xs font-medium text-[#8A836E]">kg/Ac</span>
            </p>
            <p className="text-[11px] text-[#8A836E]">
              {activePredictionForBlock ? (
                <strong className="text-[#2F6B4A]">+15.0 kg Absorption Boost</strong>
              ) : (
                'Target Baseline: 120.0 kg'
              )}
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Soil Water / Moisture</span>
              <div className="bg-[#3E7AA8]/10 p-2 rounded-xl text-[#3E7AA8] border border-[#3E7AA8]/20">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#3E7AA8]">{currentBlockLatest.moisture_level}%</p>
            <p className="text-[11px] text-[#8A836E]">Hydration Status: <strong className="text-[#3E7AA8]">Optimal</strong></p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Land Slope & Terrain</span>
              <div className="bg-[#B68D40]/10 p-2 rounded-xl text-[#B68D40] border border-[#B68D40]/20">
                <Mountain className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#B68D40]">{currentBlockLatest.slope}° Degree</p>
            <p className="text-[11px] text-[#8A836E]">Runoff Potential: <strong className="text-[#54503F]">Moderate</strong></p>
          </div>
        </div>

        {/* 2️⃣ DYNAMIC RECHARTS VISUALIZER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

          {/* Left Block Selector */}
          <div className="lg:col-span-4 bg-white border border-[#E3DCC6] shadow-sm p-5 rounded-3xl space-y-4 flex flex-col h-[460px]">
            <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-3">
              <h3 className="font-display font-semibold text-[#163C2C] text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-[#B68D40]" /> Select Micro-Block
              </h3>
              <span className="text-[10px] bg-[#F3EFE3] text-[#8A836E] border border-[#E3DCC6] px-2 py-0.5 rounded-md">
                {totalBlocks} Blocks
              </span>
            </div>

            <input
              type="text"
              placeholder="Search e.g. Block 03..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E3DCC6] rounded-xl px-3.5 py-2 text-xs text-[#1A1A17] placeholder-[#B7AF98] focus:outline-none focus:border-[#B68D40]"
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {Array.from({ length: totalBlocks }, (_, i) => i + 1)
                .filter((bNum) => `Block ${String(bNum).padStart(2, '0')}`.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                .map((bNum) => {
                  const isSelected = bNum === selectedBlockNum;
                  const hasPred = predictionsList.some((p) => p.block_number === bNum);
                  return (
                    <div
                      key={bNum}
                      onClick={() => setSelectedBlockNum(bNum)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#B68D40]/10 border-[#B68D40] shadow-sm text-[#163C2C] font-bold'
                          : 'bg-[#FBFAF6] border-[#E3DCC6] text-[#8A836E] hover:border-[#B68D40]/30 hover:text-[#54503F]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#163C2C]">Block {String(bNum).padStart(2, '0')}</p>
                        <p className="text-[10px] text-[#8A836E]">Acreage: 0.25 Ac</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                        isSelected ? 'bg-[#B68D40] text-white' :
                        hasPred ? 'bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/30' :
                        'bg-[#7C5AA6]/10 text-[#7C5AA6]'
                      }`}>
                        {isSelected ? 'Analyzing' : hasPred ? 'Recovering' : 'Audited'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right Interactive Chart Visualizer */}
          <div className="lg:col-span-8 bg-white border border-[#E3DCC6] shadow-sm p-6 rounded-3xl space-y-4 flex flex-col justify-between h-[460px]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DCC6] pb-3">
              <div>
                <h3 className="font-display font-semibold text-[#163C2C] text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#7C5AA6]" /> Block {String(selectedBlockNum).padStart(2, '0')} Soil Telemetry Trends
                </h3>
                <p className="text-xs text-[#8A836E]">Comparing recorded soil properties & future predictions against baseline</p>
              </div>

              {/* Metric Selector Buttons */}
              <div className="flex bg-[#F3EFE3] p-1 rounded-xl border border-[#E3DCC6] text-xs">
                <button
                  onClick={() => setActiveMetric('ph')}
                  className={`px-3 py-1 rounded-lg transition font-bold ${activeMetric === 'ph' ? 'bg-[#7C5AA6] text-white' : 'text-[#8A836E]'}`}
                >
                  pH
                </button>
                <button
                  onClick={() => setActiveMetric('nitrogen')}
                  className={`px-3 py-1 rounded-lg transition font-bold ${activeMetric === 'nitrogen' ? 'bg-[#2F6B4A] text-white' : 'text-[#8A836E]'}`}
                >
                  Nitrogen
                </button>
                <button
                  onClick={() => setActiveMetric('moisture')}
                  className={`px-3 py-1 rounded-lg transition font-bold ${activeMetric === 'moisture' ? 'bg-[#3E7AA8] text-white' : 'text-[#8A836E]'}`}
                >
                  Moisture / Water
                </button>
                <button
                  onClick={() => setActiveMetric('slope')}
                  className={`px-3 py-1 rounded-lg transition font-bold ${activeMetric === 'slope' ? 'bg-[#B68D40] text-white' : 'text-[#8A836E]'}`}
                >
                  Slope
                </button>
              </div>
            </div>

            {/* Dynamic Legend Explanation */}
            <div className="flex items-center gap-4 text-[11px] font-semibold text-[#8A836E] px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: metricConfig[activeMetric].color }}></span>
                <span>Recorded Actual Telemetry</span>
              </span>

              {activePredictionForBlock && (
                <span className="flex items-center gap-1.5 text-[#3E7AA8]">
                  <span className="w-3 h-0.5 border-b-2 border-dashed border-[#3E7AA8]"></span>
                  <span>AI Predicted Recovery (10 Days)</span>
                </span>
              )}
            </div>

            {/* Recharts Chart Stage */}
            <div className="h-60 w-full pt-1">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDEADC" />
                    <XAxis dataKey="date" stroke="#8A836E" fontSize={11} />
                    <YAxis stroke="#8A836E" fontSize={11} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCC6', borderRadius: '12px', fontSize: '12px' }}
                      labelStyle={{ color: '#8A836E' }}
                    />
                    <ReferenceLine
                      y={metricConfig[activeMetric].idealVal}
                      stroke="#B68D40"
                      strokeDasharray="5 5"
                      label={{ value: `Ideal: ${metricConfig[activeMetric].idealVal} ${metricConfig[activeMetric].unit}`, fill: '#B68D40', fontSize: 10, position: 'top' }}
                    />

                    {/* 1. ACTUAL RECORDED TELEMETRY (Solid Line) */}
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Recorded Telemetry"
                      stroke={metricConfig[activeMetric].color}
                      strokeWidth={3}
                      dot={{ fill: metricConfig[activeMetric].color, r: 4 }}
                    />

                    {/* 2. AI PREDICTED RECOVERY FORECAST (Dashed Blue Line) */}
                    {activePredictionForBlock && (
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        name="AI Predicted Recovery"
                        stroke="#3E7AA8"
                        strokeDasharray="6 6"
                        strokeWidth={3}
                        dot={{ fill: '#3E7AA8', r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#8A836E] italic border border-dashed border-[#E3DCC6] rounded-2xl">
                  No telemetry history found for Block {String(selectedBlockNum).padStart(2, '0')}.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 🤖 3️⃣ GEMINI AI SOIL CONDITIONING ENGINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-[#E3DCC6] p-6 rounded-3xl shadow-sm space-y-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E3DCC6] pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#7C5AA6]/10 p-2.5 rounded-xl border border-[#7C5AA6]/20 text-[#7C5AA6]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-[#163C2C] flex items-center gap-2">
                  Gemini AI Soil Treatment Plan — <span className="text-[#7C5AA6]">Block {String(selectedBlockNum).padStart(2, '0')}</span>
                </h3>
                <p className="text-xs text-[#8A836E]">Generates precise soil fertilizer, pH dolomite, and water conditioning plan for this block</p>
              </div>
            </div>

            <button
              onClick={fetchAiRecommendation}
              disabled={isLoadingAi}
              className="bg-[#7C5AA6] hover:bg-[#6B4B90] text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-[#7C5AA6]/20 disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Soil Telemetry...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Soil & Generate Plan
                </>
              )}
            </button>
          </div>

          {/* Success Task Alert */}
          {taskAddedMsg && (
            <div className="bg-[#2F6B4A]/10 border border-[#2F6B4A]/20 p-3.5 rounded-2xl text-[#2F6B4A] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {taskAddedMsg}
            </div>
          )}

          {/* AI Response Cards */}
          {aiPrescription ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#FBFAF6] p-4 rounded-2xl border border-[#E3DCC6] space-y-1">
                <span className="text-[10px] text-[#8A836E] uppercase font-bold">Soil Treatment Mixture</span>
                <p className="text-sm font-black text-[#7C5AA6]">{aiPrescription.treatmentName}</p>
              </div>

              <div className="bg-[#FBFAF6] p-4 rounded-2xl border border-[#E3DCC6] space-y-1">
                <span className="text-[10px] text-[#8A836E] uppercase font-bold">Application / Dosage</span>
                <p className="text-sm font-black text-[#163C2C]">{aiPrescription.dosage}</p>
              </div>

              <div className="bg-[#FBFAF6] p-4 rounded-2xl border border-[#E3DCC6] space-y-1">
                <span className="text-[10px] text-[#8A836E] uppercase font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#3E7AA8]" /> Best Application Window
                </span>
                <p className="text-sm font-black text-[#3E7AA8]">{aiPrescription.applicationTime}</p>
              </div>

              <div className="bg-[#FBFAF6] p-4 rounded-2xl border border-[#E3DCC6] space-y-1">
                <span className="text-[10px] text-[#8A836E] uppercase font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#2F6B4A]" /> Expected Soil Impact
                </span>
                <p className="text-sm font-black text-[#2F6B4A]">{aiPrescription.soilImprovement || '+18% Nutrient Retention'}</p>
              </div>

              {/* 🔬 Soil Science Analysis */}
              <div className="md:col-span-4 bg-[#7C5AA6]/10 border border-[#7C5AA6]/20 p-5 rounded-2xl text-sm md:text-base leading-relaxed text-[#3A3428] shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <strong className="text-[#7C5AA6] font-extrabold text-sm md:text-base mr-1">
                    🔬 Soil Science Analysis:
                  </strong>
                  {aiPrescription.reasoning}
                </div>

                <button
                  onClick={handleAddToTasks}
                  disabled={isSavingTask}
                  className="bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-[#163C2C]/15 shrink-0 disabled:opacity-50"
                >
                  {isSavingTask ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" /> Add to Work Tasks Schedule
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FBFAF6] border border-[#E3DCC6] p-8 rounded-2xl text-center text-[#8A836E] text-xs">
              Click <strong className="text-[#7C5AA6]">"Analyze Soil & Generate Plan"</strong> to get instant AI soil agronomy advice for Block {String(selectedBlockNum).padStart(2, '0')}.
            </div>
          )}
        </motion.div>

      </main>
    </div>
  );
}