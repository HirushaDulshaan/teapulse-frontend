// components/Estate3DView.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { calculateLandArea } from '@/lib/geoUtils';
import { ArrowRight, Maximize2 } from 'lucide-react';
import Link from 'next/link';

interface Estate3DProps {
  isSaved: boolean;
  points: [number, number][];
}

const BLOCK_DEPTH = 0.4;

function LandBlock({ points }: { points: [number, number][] }) {
  const geometry = useMemo(() => {
    if (!points || points.length < 3) return null;

    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const scale = 500;

    const shape = new THREE.Shape();
    points.forEach((pt, index) => {
      const x = (pt[1] - centerLng) * scale;
      const y = (pt[0] - centerLat) * scale;
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: BLOCK_DEPTH,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
    geom.computeVertexNormals();
    return geom;
  }, [points]);

  if (!geometry) return null;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" color="#A8763D" roughness={0.9} flatShading />
        <meshStandardMaterial attach="material-1" color="#3E7A57" roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

export default function Estate3DView({ isSaved, points }: Estate3DProps) {
  const landArea = useMemo(() => calculateLandArea(points), [points]);

  if (!isSaved || !points || points.length < 3) {
    return (
      <div className="h-[600px] w-full bg-[#F3EFE3] border border-[#D8CBA0] border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[#2F6B4A]/10 border border-[#2F6B4A]/25 flex items-center justify-center text-[#2F6B4A] text-2xl font-bold animate-pulse">
          3D
        </div>
        <h3 className="text-lg font-bold text-[#163C2C]">Interactive Land Model</h3>
        <p className="text-xs text-[#54503F] max-w-sm">
          Please click 3+ boundary points on the left Satellite Map and click <strong className="text-[#163C2C]">"Save & Generate 3D Model"</strong> to render your land block.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full bg-gradient-to-b from-[#FBFAF6] to-[#F3EFE3] border-2 border-[#E3DCC6] rounded-3xl relative overflow-hidden shadow-sm flex flex-col justify-between p-4">
      {/* Top Badges */}
      <div className="flex items-start justify-between z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#E3DCC6] flex items-center gap-3 shadow-sm">
          <span className="w-3 h-3 rounded-full bg-[#2F6B4A] animate-ping" />
          <div>
            <p className="text-xs font-bold text-[#163C2C]">Land Boundary 3D Model</p>
            <p className="text-[10px] text-[#8A836E]">Matches exact selected coordinates</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#E3DCC6] text-right shadow-sm">
          <p className="text-[10px] uppercase font-bold text-[#8A836E]">Terrain Style</p>
          <p className="text-sm font-black text-[#2F6B4A]">Grass Block</p>
        </div>
      </div>

      {/* THREE.JS CANVAS */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 6, 6], fov: 42 }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[8, 15, 6]} intensity={1.4} color="#fff8ec" castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#B68D40" />

          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
            <LandBlock points={points} />
          </Float>

          <gridHelper args={[24, 24, '#D8CBA0', '#E8E2CE']} position={[0, -0.6, 0]} />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </div>

      {/* FOOTER AREA SUMMARY */}
      <div className="z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E3DCC6] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#2F6B4A]/10 p-2.5 rounded-xl border border-[#2F6B4A]/20 text-[#2F6B4A]">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#8A836E]">Computed Land Area</p>
            <p className="text-lg font-black text-[#163C2C]">
              {landArea.acres} <span className="text-xs font-medium text-[#2F6B4A]">Acres</span>{' '}
              <span className="text-[#8A836E] text-xs font-normal">({landArea.perches} Perches)</span>
            </p>
          </div>
        </div>

        <Link
          href={{
            pathname: '/profile',
            query: { points: JSON.stringify(points), acres: landArea.acres, perches: landArea.perches },
          }}
          className="bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#163C2C]/15"
        >
          Proceed to Account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}