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
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E3DCC6] pb-4 gap-4 pr-16 md:pr-28">
        <div className="flex items-start gap-3">
          <Link href="/yield-analytics" className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5 text-[#54503F]" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-display text-lg md:text-xl font-semibold tracking-tight text-[#163C2C] leading-snug flex items-center gap-2">
              <CloudSun className="w-5 h-5 md:w-6 md:h-6 text-[#2F6B4A] shrink-0" />
              Micro-Climate
            </h1>
            <p className="text-xs text-[#8A836E] mt-1">
              Estate: <strong className="text-[#163C2C]">{land?.land_name || 'My Registered Estate'}</strong> — Micro-Block Agro-Climate Insights
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5 shrink-0">
    <Sparkles className="w-4 h-4" /> Live Satellite Feeds Active
  </span>
      </header>

      {/* Main Container */}
      <main className="space-y-6">

        {/* 🌦️ 1️⃣ CURRENT WEATHER OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Current Temperature</span>
              <div className="bg-[#B68D40]/10 p-2 rounded-xl text-[#B68D40] border border-[#B68D40]/20">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#163C2C]">
              {currentWeather ? `${currentWeather.temperature}°C` : '--'}
            </p>
            <p className="text-[11px] text-[#8A836E]">Real-time Ambient Temp</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Wind Velocity</span>
              <div className="bg-[#2F6B4A]/10 p-2 rounded-xl text-[#2F6B4A] border border-[#2F6B4A]/20">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#2F6B4A]">
              {currentWeather ? `${currentWeather.windspeed} km/h` : '--'}
            </p>
            <p className="text-[11px] text-[#8A836E]">Wind Direction: {currentWeather?.winddirection || '0'}°</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Expected Rain Today</span>
              <div className="bg-[#7C5AA6]/10 p-2 rounded-xl text-[#7C5AA6] border border-[#7C5AA6]/20">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#7C5AA6]">
              {daily?.precipitation_sum?.[0] !== undefined ? `${daily.precipitation_sum[0]} mm` : '0.0 mm'}
            </p>
            <p className="text-[11px] text-[#8A836E]">Rain Chance: {daily?.precipitation_probability_max?.[0] || 0}%</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A836E] uppercase tracking-wider">Agro Conditions</span>
              <div className="bg-[#2F6B4A]/10 p-2 rounded-xl text-[#2F6B4A] border border-[#2F6B4A]/20">
                <Sun className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-[#2F6B4A] mt-1">
              {isHighRain ? 'Heavy Rain Alert' : 'Favorable'}
            </p>
            <p className="text-[11px] text-[#8A836E]">Soil Treatment Feasibility</p>
          </div>
        </div>

        {/* 📢 2️⃣ AI FIELD ACTION ADVISORY BASED ON WEATHER */}
        <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isHighRain
            ? 'bg-[#B68D40]/10 border-[#B68D40]/30 text-[#8A6A2E]'
            : 'bg-[#2F6B4A]/10 border-[#2F6B4A]/30 text-[#1F4D36]'
        }`}>
          <div className="flex items-center gap-3">
            {isHighRain ? (
              <AlertTriangle className="w-6 h-6 text-[#B68D40] shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-[#2F6B4A] shrink-0" />
            )}
            <div>
              <h3 className="font-display font-semibold text-sm text-[#163C2C]">
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
        <div className="bg-white border border-[#E3DCC6] shadow-sm p-6 rounded-3xl space-y-4">
          <h3 className="font-display font-semibold text-sm text-[#163C2C] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2F6B4A]" /> 7-Day Micro-Climate Projection
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            {daily?.time?.map((dateStr: string, idx: number) => {
              const maxTemp = daily.temperature_2m_max[idx];
              const minTemp = daily.temperature_2m_min[idx];
              const rainProb = daily.precipitation_probability_max?.[idx] || 0;
              const precip = daily.precipitation_sum?.[idx] || 0;

              return (
                <div key={dateStr} className="bg-[#FBFAF6] p-4 rounded-2xl border border-[#E3DCC6] flex flex-col items-center justify-between space-y-2 text-center">
                  <span className="text-[11px] font-mono text-[#8A836E] uppercase">
                    {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </span>

                  {rainProb > 50 ? (
                    <CloudRain className="w-7 h-7 text-[#2F6B4A] my-1" />
                  ) : rainProb > 20 ? (
                    <Cloud className="w-7 h-7 text-[#8A836E] my-1" />
                  ) : (
                    <Sun className="w-7 h-7 text-[#B68D40] my-1" />
                  )}

                  <div>
                    <p className="text-xs font-bold text-[#163C2C]">{maxTemp}° / {minTemp}°</p>
                    <p className="text-[10px] text-[#7C5AA6] font-semibold">{precip} mm ({rainProb}%)</p>
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