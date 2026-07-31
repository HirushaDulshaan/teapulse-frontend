'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface RouteStep {
  instruction: string;
  distance: number; // meters
  maneuver: string; // e.g. "turn-left"
}

export default function EstateNavigatorMap({
                                             targetBlockName,
                                             targetLat,
                                             targetLng,
                                           }: {
  targetBlockName: string;
  targetLat: number;
  targetLng: number;
}) {
  const [userPos, setUserPos] = useState<[number, number]>([6.9271, 79.8612]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [distanceText, setDistanceText] = useState('Calculating...');
  const [durationText, setDurationText] = useState('');
  const [steps, setSteps] = useState<RouteStep[]>([]);

  // Guard: only build a target position once we actually have valid numbers.
  // Without this, a transient render (e.g. during a Fast Refresh reload, or
  // before parent state has finished settling) can pass targetLat/targetLng
  // as undefined, which crashes Leaflet with "Invalid LatLng object".
  const hasValidTarget =
      typeof targetLat === 'number' &&
      typeof targetLng === 'number' &&
      !Number.isNaN(targetLat) &&
      !Number.isNaN(targetLng);

  const targetPos: [number, number] | null = hasValidTarget
      ? [targetLat, targetLng]
      : null;

  // Get live GPS
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
        },
        () => setErrorMsg('Unable to retrieve your location. Please allow GPS permissions.'),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Fetch real route from OSRM whenever user or target position changes
  useEffect(() => {
    if (!targetPos) return; // nothing valid to route to yet

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/foot/${userPos[1]},${userPos[0]};${targetPos[1]},${targetPos[0]}?geometries=geojson&steps=true`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          const coords: [number, number][] = route.geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]]
          );
          setRouteCoords(coords);

          const distMeters = route.distance;
          setDistanceText(distMeters < 1000 ? `${Math.round(distMeters)} m` : `${(distMeters / 1000).toFixed(2)} km`);
          setDurationText(`${Math.round(route.duration / 60)} min`);

          const legSteps: RouteStep[] = route.legs[0].steps.map((s: any) => ({
            instruction: `${s.maneuver.type} ${s.maneuver.modifier ?? ''} onto ${s.name || 'the path'}`.trim(),
            distance: s.distance,
            maneuver: s.maneuver.modifier || s.maneuver.type,
          }));
          setSteps(legSteps);
        }
      } catch (err) {
        setErrorMsg('Could not calculate route. Check your connection.');
      }
    };

    fetchRoute();
  }, [userPos[0], userPos[1], targetPos?.[0], targetPos?.[1]]);

  // Don't render the map at all until we have a real target — this is what
  // prevents the "Invalid LatLng object (undefined, undefined)" crash.
  if (!targetPos) {
    return (
        <div className="bg-white border border-[#E3DCC6] rounded-3xl overflow-hidden shadow-sm p-5">
          <p className="text-sm text-[#8A836E]">
            Locating {targetBlockName || 'target block'}...
          </p>
        </div>
    );
  }

  return (
      <div className="bg-white border border-[#E3DCC6] rounded-3xl overflow-hidden shadow-sm">
        {/* Top turn-by-turn banner, like Google Maps */}
        {steps.length > 0 && (
            <div className="bg-[#163C2C] text-white p-4">
              <p className="text-lg font-bold">{steps[0].instruction}</p>
              <p className="text-sm opacity-80">
                {steps[0].distance < 1000 ? `${Math.round(steps[0].distance)} m` : `${(steps[0].distance / 1000).toFixed(1)} km`}
              </p>
              {steps[1] && <p className="text-xs opacity-60 mt-1">Then: {steps[1].instruction}</p>}
            </div>
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-3">
            <div>
              <h3 className="font-display font-semibold text-base text-[#163C2C]">
                Live GPS Route to {targetBlockName}
              </h3>
              <p className="text-xs text-[#8A836E]">{durationText} · Real-time walking route</p>
            </div>
            <div className="bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/20 px-3 py-1 rounded-full text-xs font-black">
              📍 {distanceText} away
            </div>
          </div>

          {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-200">
                ⚠️ {errorMsg}
              </div>
          )}

          <div className="h-72 w-full rounded-2xl overflow-hidden border border-[#E3DCC6] relative z-0">
            <MapContainer center={userPos} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapRecenter center={userPos} />

              <Marker position={userPos} icon={customIcon}>
                <Popup>Your Current GPS Location 📍</Popup>
              </Marker>

              <Marker position={targetPos} icon={customIcon}>
                <Popup>Target: {targetBlockName} 🍃</Popup>
              </Marker>

              {routeCoords.length > 0 && (
                  <Polyline positions={routeCoords} pathOptions={{ color: '#163C2C', weight: 5 }} />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
  );
}