// app/weather/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CloudSun,
  ArrowLeft,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Compass,
} from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';

export default function WeatherForecastPage() {
  const [land, setLand] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionLand = localStorage.getItem('userLand');
    if (sessionLand) {
      const parsed = JSON.parse(sessionLand);
      setLand(parsed);
      
      // Default to Sri Lanka Nuwara Eliya / Central Highlands coordinates if land coords not set
      const lat = parsed.lat || 6.9497;
      const lon = parsed.lng || 80.7891;
      fetchWeather(lat, lon);
    } else {
      fetchWeather(6.9497, 80.7891);
    }
  }, []);

  // Fetch Open-Meteo Free Weather API Data
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Fetch weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentWeather = weatherData?.current_weather;
  const daily = weatherData?.daily;

  // Determine Agronomy Advice based on Rainfall Forecast
  const isHighRain = daily?.precipitation_probability_max?.[0] > 60 || daily?.precipitation_sum?.[0] > 10;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans p-4 md:p-8 space-y-6 overflow-x-hidden relative">
      <LandSidebar />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 pr-28">
        <div className="flex items-center gap-3">
          <Link href="/yield-analytics" className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-sky-400" />
              Micro-Climate & <span className="text-sky-400">Weather Forecast</span>
            </h1>
            <p className="text-xs text-slate-400">
              Estate: <strong className="text-white">{land?.land_name || 'My Registered Estate'}</strong> — Micro-Block Agro-Climate Insights
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-sky-500/10 text-sky-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-sky-500/20 items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Live Satellite Feeds Active
        </span>
      </header>

      {/* Main Container */}
      <main className="space-y-6">

        {/* 🌦️ 1️⃣ CURRENT WEATHER OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Temperature</span>
              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 border border-amber-500/20">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">
              {currentWeather ? `${currentWeather.temperature}°C` : '--'}
            </p>
            <p className="text-[11px] text-slate-500">Real-time Ambient Temp</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wind Velocity</span>
              <div className="bg-sky-500/10 p-2 rounded-xl text-sky-400 border border-sky-500/20">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-sky-400">
              {currentWeather ? `${currentWeather.windspeed} km/h` : '--'}
            </p>
            <p className="text-[11px] text-slate-500">Wind Direction: {currentWeather?.winddirection || '0'}°</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Rain Today</span>
              <div className="bg-purple-500/10 p-2 rounded-xl text-purple-400 border border-purple-500/20">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-purple-400">
              {daily?.precipitation_sum?.[0] !== undefined ? `${daily.precipitation_sum[0]} mm` : '0.0 mm'}
            </p>
            <p className="text-[11px] text-slate-500">Rain Chance: {daily?.precipitation_probability_max?.[0] || 0}%</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agro Conditions</span>
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Sun className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">
              {isHighRain ? 'Heavy Rain Alert' : 'Favorable Favorable'}
            </p>
            <p className="text-[11px] text-slate-500">Soil Treatment Feasibility</p>
          </div>
        </div>

        {/* 📢 2️⃣ AI FIELD ACTION ADVISORY BASED ON WEATHER */}
        <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isHighRain 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            {isHighRain ? (
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-sm text-white">
                {isHighRain ? '⚠️ Fertilizer Application Advisory: Heavy Rain Forecasted' : '✅ Optimal Field Work Window Active'}
              </h3>
              <p className="text-xs opacity-80 mt-0.5">
                {isHighRain
                  ? 'High probability of precipitation detected today. Postpone fertilizer or dolomite application to avoid nutrient runoff.'
                  : 'Weather conditions are clear with low rain risk. Ideal for soil conditioning, NPK dosing, and manual weeding.'}
              </p>
            </div>
          </div>
        </div>

        {/* 🗓️ 3️⃣ 7-DAY EXTENDED FORECAST TABLE */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" /> 7-Day Micro-Climate Projection
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            {daily?.time?.map((dateStr: string, idx: number) => {
              const maxTemp = daily.temperature_2m_max[idx];
              const minTemp = daily.temperature_2m_min[idx];
              const rainProb = daily.precipitation_probability_max?.[idx] || 0;
              const precip = daily.precipitation_sum?.[idx] || 0;

              return (
                <div key={dateStr} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-between space-y-2 text-center">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </span>

                  {rainProb > 50 ? (
                    <CloudRain className="w-7 h-7 text-sky-400 my-1" />
                  ) : rainProb > 20 ? (
                    <Cloud className="w-7 h-7 text-slate-400 my-1" />
                  ) : (
                    <Sun className="w-7 h-7 text-amber-400 my-1" />
                  )}

                  <div>
                    <p className="text-xs font-bold text-white">{maxTemp}° / {minTemp}°</p>
                    <p className="text-[10px] text-purple-400 font-semibold">{precip} mm ({rainProb}%)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}