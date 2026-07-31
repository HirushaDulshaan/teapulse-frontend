// app/telemetry/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Lock,
  Unlock,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Activity
} from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';
import { authFetch } from '@/lib/auth';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export default function TelemetryManagementPage() {
  const [land, setLand] = useState<any>(null);
  const [logsList, setLogsList] = useState<any[]>([]);

  // Date State - Default Today (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Form States
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(1);
  const [formData, setFormData] = useState({
    nTarget: '110',
    ph: '4.5',
    slope: '12',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Check if selected date is Today
  const isEditable = selectedDate === todayStr;

  // Total blocks calculation
  const totalMicroBlocks = useMemo(() => {
    if (!land?.acres) return 4;
    return Math.max(4, Math.round(parseFloat(land.acres) * 4));
  }, [land]);

  // Load Session & Fetch Telemetry Logs
  useEffect(() => {
    const sessionLand = localStorage.getItem('userLand');
    if (sessionLand) {
      const parsedLand = JSON.parse(sessionLand);
      setLand(parsedLand);
      fetchTelemetryLogs(parsedLand.id);
    }
  }, []);

  const fetchTelemetryLogs = async (landId: string) => {
    try {
      const res = await authFetch(`${FASTAPI_URL}/api/v1/telemetry/get-logs/${landId}`);
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        setLogsList(result.data || []);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
    }
  };

  // Load existing log values for the form when Block or Date changes
  useEffect(() => {
    const existingLog = logsList.find(
        (log) => log.block_number === selectedBlockNumber && log.log_date === selectedDate
    );

    if (existingLog) {
      setFormData({
        nTarget: String(existingLog.nitrogen_target),
        ph: String(existingLog.soil_ph),
        slope: String(existingLog.slope),
      });
    } else {
      setFormData({ nTarget: '110', ph: '4.5', slope: '12' });
    }
  }, [selectedBlockNumber, selectedDate, logsList]);

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable) {
      setNotification({ type: 'error', msg: 'Cannot edit historical records past today!' });
      return;
    }

    if (!land?.id) {
      setNotification({ type: 'error', msg: 'No active land found. Please log in again.' });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      const response = await authFetch(`${FASTAPI_URL}/api/v1/telemetry/save-or-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          land_id: land.id,
          block_number: selectedBlockNumber,
          nitrogen_target: parseFloat(formData.nTarget),
          soil_ph: parseFloat(formData.ph),
          slope: parseFloat(formData.slope),
          log_date: selectedDate,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setNotification({ type: 'success', msg: result.message });
        fetchTelemetryLogs(land.id);
      } else {
        setNotification({ type: 'error', msg: result.detail || 'Save failed.' });
      }
    } catch (err) {
      setNotification({ type: 'error', msg: 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] p-4 md:p-8 space-y-6 font-sans">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
          .font-display {
            font-family: 'Fraunces', Georgia, serif;
            font-optical-sizing: auto;
          }
        `}</style>

        <LandSidebar />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E3DCC6] pb-4 gap-4 pr-14 md:pr-36">
          <div className="flex items-start gap-3">
            <Link href="/my-land" className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition text-[#54503F] shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="font-display text-base md:text-xl font-semibold text-[#163C2C] leading-snug flex items-center gap-2">
                <Database className="w-5 h-5 text-[#2F6B4A] shrink-0" /> Daily Telemetry
              </h1>
              <p className="text-xs text-[#8A836E] mt-1">
                Estate: <strong className="text-[#163C2C]">{land?.land_name || 'My Estate'}</strong> ({totalMicroBlocks} Blocks)
              </p>
            </div>
          </div>

          {/* Dynamic Lock Indicator */}
          <div className={`self-start md:self-auto px-4 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 shrink-0 ${
              isEditable
                  ? 'bg-[#2F6B4A]/10 text-[#2F6B4A] border-[#2F6B4A]/20'
                  : 'bg-[#B68D40]/10 text-[#B68D40] border-[#B68D40]/20'
          }`}>
            {isEditable ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isEditable ? 'Editing Active (Today)' : 'Historical Record (Locked)'}
          </div>
        </div>

        {/* Main Grid: Left Side Form (5 Cols), Right Side Scrollable Table (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">

          {/* 👈 LEFT: Form Panel */}
          <div className="lg:col-span-5 bg-white border border-[#E3DCC6] p-6 rounded-3xl shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-[#E3DCC6] pb-3">
              <Activity className="w-5 h-5 text-[#3E7AA8]" />
              <h2 className="font-display font-semibold text-base text-[#163C2C]">Record Telemetry Data</h2>
            </div>

            {notification && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    notification.type === 'success'
                        ? 'bg-[#2F6B4A]/10 border border-[#2F6B4A]/20 text-[#2F6B4A]'
                        : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {notification.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Audit Date */}
              <div>
                <label className="block text-xs font-semibold text-[#54503F] mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2F6B4A]" /> Audit Date
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    max={todayStr}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-[#E3DCC6] rounded-xl px-3 py-2 text-xs text-[#1A1A17] focus:outline-none focus:border-[#2F6B4A]"
                />
              </div>

              {/* Block Number */}
              <div>
                <label className="block text-xs font-semibold text-[#54503F] mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B68D40]" /> Select Block
                </label>
                <select
                    value={selectedBlockNumber}
                    onChange={(e) => setSelectedBlockNumber(Number(e.target.value))}
                    className="w-full bg-white border border-[#E3DCC6] rounded-xl px-3 py-2 text-xs text-[#163C2C] font-bold focus:outline-none focus:border-[#B68D40]"
                >
                  {Array.from({ length: totalMicroBlocks }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        Block {String(num).padStart(2, '0')}
                      </option>
                  ))}
                </select>
              </div>

              {/* Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#54503F] mb-1">Nitrogen Target (kg)</label>
                  <input
                      type="number"
                      required
                      disabled={!isEditable}
                      value={formData.nTarget}
                      onChange={(e) => setFormData({ ...formData, nTarget: e.target.value })}
                      className="w-full bg-white border border-[#E3DCC6] rounded-xl px-3 py-2.5 text-xs text-[#1A1A17] focus:outline-none focus:border-[#2F6B4A] disabled:opacity-50 disabled:bg-[#F3EFE3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#54503F] mb-1">Soil pH Level</label>
                  <input
                      type="number"
                      step="0.1"
                      required
                      disabled={!isEditable}
                      value={formData.ph}
                      onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                      className="w-full bg-white border border-[#E3DCC6] rounded-xl px-3 py-2.5 text-xs text-[#1A1A17] focus:outline-none focus:border-[#7C5AA6] disabled:opacity-50 disabled:bg-[#F3EFE3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#54503F] mb-1">Slope (° Degree)</label>
                  <input
                      type="number"
                      required
                      disabled={!isEditable}
                      value={formData.slope}
                      onChange={(e) => setFormData({ ...formData, slope: e.target.value })}
                      className="w-full bg-white border border-[#E3DCC6] rounded-xl px-3 py-2.5 text-xs text-[#1A1A17] focus:outline-none focus:border-[#B68D40] disabled:opacity-50 disabled:bg-[#F3EFE3]"
                  />
                </div>
              </div>

              <button
                  type="submit"
                  disabled={!isEditable || loading}
                  className="w-full bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#163C2C]/15 disabled:opacity-40 mt-2"
              >
                {isEditable ? (
                    <>
                      <PlusCircle className="w-4 h-4" /> Save / Update Telemetry
                    </>
                ) : (
                    <>
                      <Lock className="w-4 h-4" /> Past Date Record Locked
                    </>
                )}
              </button>
            </form>
          </div>

          {/* 👉 RIGHT: Scrollable Table Panel */}
          <div className="lg:col-span-7 bg-white border border-[#E3DCC6] p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-3">
              <h3 className="font-display font-semibold text-sm text-[#163C2C] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2F6B4A]" /> Estate Telemetry Audit Logs
              </h3>
              <span className="text-[10px] bg-[#F3EFE3] text-[#8A836E] px-2.5 py-1 rounded-full font-bold border border-[#E3DCC6]">
              {logsList.length} Records Found
            </span>
            </div>

            <div className="max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3EFE3] text-[#8A836E] border-b border-[#E3DCC6] sticky top-0 z-10">
                <tr>
                  <th className="p-3">Log Date</th>
                  <th className="p-3">Block</th>
                  <th className="p-3">Nitrogen</th>
                  <th className="p-3">pH</th>
                  <th className="p-3">Slope</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DCC6]">
                {logsList.length > 0 ? (
                    logsList.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FBFAF6] transition">
                          <td className="p-3 font-mono text-[#54503F]">{log.log_date}</td>
                          <td className="p-3 font-bold text-[#163C2C]">Block {String(log.block_number).padStart(2, '0')}</td>
                          <td className="p-3 text-[#2F6B4A] font-semibold">{log.nitrogen_target} kg</td>
                          <td className="p-3 text-[#7C5AA6]">{log.soil_ph} pH</td>
                          <td className="p-3 text-[#54503F]">{log.slope}°</td>
                          <td className="p-3 text-right">
                            {log.log_date === todayStr ? (
                                <span className="bg-[#2F6B4A]/10 text-[#2F6B4A] px-2 py-0.5 rounded-md border border-[#2F6B4A]/20 text-[10px]">Active</span>
                            ) : (
                                <span className="bg-[#F3EFE3] text-[#8A836E] px-2 py-0.5 rounded-md text-[10px] border border-[#E3DCC6]">Locked</span>
                            )}
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[#8A836E] italic">
                        No telemetry records found. Add new records using the form on the left!
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
  );
}