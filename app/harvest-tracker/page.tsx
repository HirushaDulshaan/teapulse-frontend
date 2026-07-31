// app/harvest-tracker/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Loader2,
  Calendar,
  Layers,
  TestTube,
  Activity,
  Droplets,
  Zap,
} from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';

export default function HarvestLaborTrackerPage() {
  const [land, setLand] = useState<any>(null);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const sessionLand = localStorage.getItem('userLand');
    if (sessionLand) {
      const parsed = JSON.parse(sessionLand);
      setLand(parsed);
      fetchTasks(parsed.id);
    }
  }, []);

  const fetchTasks = async (landId: string) => {
    setLoading(true);
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const res = await fetch(`${fastApiUrl}/api/v1/ai/get-tasks/${landId}`);
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        setTasksList(result.data || []);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Complete Task and Generate AI Soil Improvement Prediction
  const handleCompleteTask = async (taskId: string, blockNum: number) => {
    setCompletingTaskId(taskId);
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const response = await fetch(`${fastApiUrl}/api/v1/ai/complete-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, block_number: blockNum }),
      });

      const resData = await response.json();
      if (response.ok && resData.status === 'success') {
        fetchTasks(land.id); // Refresh List
      }
    } catch (err) {
      console.error('Complete task error:', err);
    } finally {
      setCompletingTaskId(null);
    }
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
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E3DCC6] pb-4 gap-4 pr-16 md:pr-28">        <div className="flex items-start gap-3">
          <Link href="/yield-analytics" className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5 text-[#54503F]" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-display text-lg md:text-xl font-semibold tracking-tight text-[#163C2C] leading-snug flex items-center gap-2">
              <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-[#2F6B4A] shrink-0" />
              Field Work Schedule
            </h1>
            <p className="text-xs text-[#8A836E] mt-1">
              Estate: <strong className="text-[#163C2C]">{land?.land_name || 'My Estate'}</strong> — Track task completions & predicted soil recovery
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5 shrink-0">
    <Sparkles className="w-4 h-4" /> AI Soil Recovery Engine Active
  </span>
      </header>

      {/* Main Grid List */}
      <main className="space-y-6">

        {/* Task Cards List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#54503F] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3E7AA8]" /> Active & Completed Field Tasks ({tasksList.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center p-12 text-[#8A836E] gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading Field Tasks...
            </div>
          ) : tasksList.length === 0 ? (
            <div className="bg-white border border-[#E3DCC6] shadow-sm p-12 rounded-3xl text-center text-[#8A836E] text-xs">
              No field work tasks assigned yet. Go to <Link href="/yield-analytics" className="text-[#7C5AA6] underline">Soil AI Studio</Link> to assign AI treatment plans!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasksList.map((task) => {
                const isCompleted = task.status === 'Completed';
                const createdDateStr = new Date(task.created_at).toLocaleDateString();
                const completedDateStr = task.completed_at ? new Date(task.completed_at).toLocaleDateString() : 'Pending';

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl border transition space-y-4 shadow-sm ${
                      isCompleted
                        ? 'bg-[#2F6B4A]/5 border-[#2F6B4A]/30'
                        : 'bg-white border-[#E3DCC6] hover:border-[#B68D40]/30'
                    }`}
                  >
                    {/* Top Row: Block + Title + Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DCC6] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#F3EFE3] px-3 py-1.5 rounded-xl border border-[#E3DCC6] text-xs font-black text-[#163C2C] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#B68D40]" /> Block {String(task.block_number).padStart(2, '0')}
                        </span>
                        <h3 className="text-sm font-bold text-[#7C5AA6]">{task.task_title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCompleteTask(task.id, task.block_number)}
                            disabled={completingTaskId === task.id}
                            className="bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-[#163C2C]/15 disabled:opacity-50"
                          >
                            {completingTaskId === task.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Mark Completed Today
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle Info Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-[#FBFAF6] p-3 rounded-2xl border border-[#E3DCC6]">
                        <span className="text-[10px] text-[#8A836E] uppercase font-bold block">Assigned Date</span>
                        <p className="font-mono text-[#54503F] mt-0.5">{createdDateStr}</p>
                      </div>

                      <div className="bg-[#FBFAF6] p-3 rounded-2xl border border-[#E3DCC6]">
                        <span className="text-[10px] text-[#8A836E] uppercase font-bold block">Completed Date</span>
                        <p className={`font-mono mt-0.5 ${isCompleted ? 'text-[#2F6B4A] font-bold' : 'text-[#B68D40]'}`}>
                          {completedDateStr}
                        </p>
                      </div>

                      <div className="bg-[#FBFAF6] p-3 rounded-2xl border border-[#E3DCC6]">
                        <span className="text-[10px] text-[#8A836E] uppercase font-bold block">Dosage Required</span>
                        <p className="font-bold text-[#163C2C] mt-0.5">{task.dosage}</p>
                      </div>

                      <div className="bg-[#FBFAF6] p-3 rounded-2xl border border-[#E3DCC6]">
                        <span className="text-[10px] text-[#8A836E] uppercase font-bold block">Application Window</span>
                        <p className="font-bold text-[#3E7AA8] mt-0.5">{task.application_time}</p>
                      </div>
                    </div>

                    {/* 🤖 AI PREDICTIVE SOIL RECOVERY IMPACT (Shown when task is Completed) */}
                    {isCompleted && task.predicted_impact && (
                      <div className="bg-[#2F6B4A]/10 border border-[#2F6B4A]/20 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#2F6B4A]">
                          <TrendingUp className="w-4 h-4" /> AI Predicted Soil Recovery Projection (Next 7 - 10 Days)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-2 text-[#3A3428] bg-white p-2.5 rounded-xl border border-[#E3DCC6]">
                            <TestTube className="w-4 h-4 text-[#7C5AA6]" />
                            <span>pH Impact: <strong className="text-[#7C5AA6]">{task.predicted_impact.predicted_ph_increase}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-[#3A3428] bg-white p-2.5 rounded-xl border border-[#E3DCC6]">
                            <Activity className="w-4 h-4 text-[#2F6B4A]" />
                            <span>Nitrogen Boost: <strong className="text-[#2F6B4A]">{task.predicted_impact.predicted_nitrogen_boost}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-[#3A3428] bg-white p-2.5 rounded-xl border border-[#E3DCC6]">
                            <Droplets className="w-4 h-4 text-[#3E7AA8]" />
                            <span>Moisture Retention: <strong className="text-[#3E7AA8]">{task.predicted_impact.predicted_water_retention}</strong></span>
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}