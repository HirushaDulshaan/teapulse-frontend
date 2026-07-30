// components/EstateMap.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap, LayersControl } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, RefreshCw, CheckCircle2, Search, Compass } from 'lucide-react';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
});

interface MapProps {
  onBoundarySave: (points: [number, number][]) => void;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

function PolygonDrawer({ points, setPoints }: any) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPoints((prev: any) => [...prev, newPoint]);
    },
  });

  return (
    <>
      {points.map((pt: [number, number], idx: number) => (
        <Marker key={idx} position={pt} icon={customIcon} />
      ))}
      {points.length >= 3 && (
        <Polygon positions={points} pathOptions={{ color: '#2F6B4A', fillColor: '#2F6B4A', fillOpacity: 0.35 }} />
      )}
    </>
  );
}

const TEA_REGIONS = [
  { name: 'Kalawana', coords: [6.4252, 80.3983] as [number, number] },
  { name: 'Niwitigala', coords: [6.6022, 80.4431] as [number, number] },
  { name: 'Pelmadulla', coords: [6.6215, 80.5402] as [number, number] },
  { name: 'Ratnapura', coords: [6.6828, 80.3992] as [number, number] },
  { name: 'Nuwara Eliya', coords: [6.971, 80.7828] as [number, number] },
];

export default function EstateMap({ onBoundarySave }: MapProps) {
  const [position, setPosition] = useState<[number, number]>([6.4252, 80.3983]);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleReset = () => {
    setPolygonPoints([]);
  };

  const handleSave = () => {
    if (polygonPoints.length >= 3) {
      onBoundarySave(polygonPoints);
    } else {
      alert('කරුණාකර Map එක මත තැන් 3ක් හෝ ඊට වැඩි ගණනක් Click කර මායිම සලකුණු කරන්න.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Sri Lanka')}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
      } else {
        alert('ස්ථානය සොයාගැනීමට නොහැකි විය.');
      }
    } catch (err) {
      console.error(err);
      alert('Search කිරීමේදී දෝෂයක් සිදු විය.');
    } finally {
      setSearching(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="h-[500px] w-full bg-[#F3EFE3] border-2 border-[#E3DCC6] rounded-2xl flex items-center justify-center text-[#8A836E] text-xs animate-pulse">
        Loading Map Engine...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8A836E] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#2F6B4A]" /> Draw Land Boundary
        </label>
        <button
          type="button"
          onClick={handleReset}
          className="bg-white hover:bg-[#F3EFE3] border border-[#E3DCC6] text-[#54503F] px-2 py-0.5 rounded-lg text-[11px] flex items-center gap-1 transition"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Search & Shortcuts */}
      <div className="space-y-1.5">
        <form onSubmit={handleSearch} className="flex gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8A836E] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city/village (e.g. Kalawana, Kukuleganga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E3DCC6] rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-[#1A1A17] placeholder:text-[#B7AF98] focus:outline-none focus:border-[#2F6B4A]"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            {searching ? '...' : 'Search'}
          </button>
        </form>

        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] scrollbar-none">
          <span className="text-[#8A836E] flex items-center gap-1 shrink-0">
            <Compass className="w-3 h-3 text-[#2F6B4A]" /> Jump:
          </span>
          {TEA_REGIONS.map((reg) => (
            <button
              key={reg.name}
              type="button"
              onClick={() => setPosition(reg.coords)}
              className="bg-white hover:bg-[#F3EFE3] border border-[#E3DCC6] text-[#54503F] px-2 py-0.5 rounded-md shrink-0 transition"
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {/* MAP CANVAS */}
      <div className="h-[500px] w-full rounded-2xl overflow-hidden border-2 border-[#E3DCC6] shadow-sm relative z-0">
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <RecenterMap center={position} />

          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Street & Landmarks Map">
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked name="Hybrid Satellite View">
              <div className="relative">
                <TileLayer
                  attribution="&copy; Esri World Imagery"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                  subdomains="abcd"
                  maxZoom={19}
                />
              </div>
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Pure Satellite View">
              <TileLayer
                attribution="&copy; Esri World Imagery"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <PolygonDrawer points={polygonPoints} setPoints={setPolygonPoints} />
        </MapContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[11px] text-[#8A836E]">
          Points: <strong className="text-[#2F6B4A] text-xs">{polygonPoints.length}</strong>
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={polygonPoints.length < 3}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
            polygonPoints.length >= 3
              ? 'bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] shadow-[#163C2C]/15 cursor-pointer'
              : 'bg-[#F3EFE3] text-[#B7AF98] cursor-not-allowed border border-[#E3DCC6]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Save & Generate 3D Model
        </button>
      </div>
    </div>
  );
}