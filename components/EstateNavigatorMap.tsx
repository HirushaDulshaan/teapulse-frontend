'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function EstateNavigatorMap({ targetBlockName }: { targetBlockName: string }) {
  const [userPos, setUserPos] = useState<[number, number]>([6.9271, 79.8612]); // Default Sri Lanka coords
  const [distance, setDistance] = useState<string>('Calculating...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulated target block coordinates near user
  const targetPos: [number, number] = [userPos[0] + 0.0008, userPos[1] + 0.0008];

  useEffect(() => {
    // 1. Get Live GPS from User Browser
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const current: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserPos(current);

        // 2. Calculate Distance in meters using Haversine formula
        const distMeters = calculateDistance(current[0], current[1], targetPos[0], targetPos[1]);
        setDistance(distMeters < 1000 ? `${Math.round(distMeters)} meters` : `${(distMeters / 1000).toFixed(2)} km`);
      },
      (error) => {
        setErrorMsg('Unable to retrieve your location. Please allow GPS permissions.');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Haversine formula to find exact distance in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="bg-white border border-[#E3DCC6] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-3">
        <div>
          <h3 className="font-display font-semibold text-base text-[#163C2C]">
            Live GPS Route to {targetBlockName}
          </h3>
          <p className="text-xs text-[#8A836E]">Real-time walking distance tracking from your current location</p>
        </div>
        <div className="bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/20 px-3 py-1 rounded-full text-xs font-black">
          📍 {distance} away
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-200">
          ⚠️ {errorMsg} (Using simulated GPS)
        </div>
      )}

      {/* Map View */}
      <div className="h-72 w-full rounded-2xl overflow-hidden border border-[#E3DCC6] relative z-0">
        <MapContainer center={userPos} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={userPos} />

          {/* User GPS Marker */}
          <Marker position={userPos} icon={customIcon}>
            <Popup>Your Current GPS Location 📍</Popup>
          </Marker>

          {/* Target Block Marker */}
          <Marker position={targetPos} icon={customIcon}>
            <Popup>Target: {targetBlockName} 🍃</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}