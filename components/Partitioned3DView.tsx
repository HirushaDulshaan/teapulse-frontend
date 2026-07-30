// components/Partitioned3DView.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { calculateLandArea } from '@/lib/geoUtils';
import { Maximize2, Layers, Sparkles, X } from 'lucide-react';

interface PartitionProps {
  points: [number, number][]
  onSelectBlock?: (blockId: string | null) => void;
  selectedBlockId?: string; // 👈 මේ Property එක මෙතැනට එකතු කරන්න;
}

const BLOCK_DEPTH = 0.38;

type Pt = [number, number];

// A palette of distinguishable block colors, tuned to the tea-estate
// cream/green/gold theme, so the grid partition is visible against a
// light card instead of the previous near-black tones.
const BLOCK_PALETTE = [
  { top: '#A9C9AF', side: '#7FB99A' }, // sage green
  { top: '#D8CBA0', side: '#C2AD78' }, // warm gold / tan
  { top: '#B7C9B0', side: '#8FA688' }, // olive green
  { top: '#E3C9A0', side: '#C9A96B' }, // clay / terracotta-tan
  { top: '#9FC2B8', side: '#6FA396' }, // teal-sage
  { top: '#C9B7A0', side: '#A8916F' }, // warm taupe
];

function isInside(p: Pt, a: Pt, b: Pt) {
  return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0;
}

function intersect(p1: Pt, p2: Pt, a: Pt, b: Pt): Pt {
  const A1 = p2[1] - p1[1];
  const B1 = p1[0] - p2[0];
  const C1 = A1 * p1[0] + B1 * p1[1];
  const A2 = b[1] - a[1];
  const B2 = a[0] - b[0];
  const C2 = A2 * a[0] + B2 * a[1];
  const det = A1 * B2 - A2 * B1;
  if (Math.abs(det) < 1e-9) return p2;
  return [(B2 * C1 - B1 * C2) / det, (A1 * C2 - A2 * C1) / det];
}

function clipPolygon(subject: Pt[], clip: Pt[]): Pt[] {
  let output = subject;
  for (let i = 0; i < clip.length; i++) {
    if (output.length === 0) break;
    const a = clip[i];
    const b = clip[(i + 1) % clip.length];
    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const current = input[j];
      const prev = input[(j + input.length - 1) % input.length];
      const curIn = isInside(current, a, b);
      const prevIn = isInside(prev, a, b);
      if (curIn) {
        if (!prevIn) output.push(intersect(prev, current, a, b));
        output.push(current);
      } else if (prevIn) {
        output.push(intersect(prev, current, a, b));
      }
    }
  }
  return output;
}

function polygonArea(pts: Pt[]) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
  }
  return Math.abs(area) / 2;
}

function polygonCentroid(pts: Pt[]): Pt {
  let x = 0;
  let y = 0;
  pts.forEach((p) => {
    x += p[0];
    y += p[1];
  });
  return [x / pts.length, y / pts.length];
}

// 🧩 Single Sub-Block Component
// Click reliability fix: every pointer event carries the block's own id via
// e.object.userData.blockId, and both pointerDown + pointerUp stop
// propagation so a click can never be mis-attributed to a neighboring block
// or swallowed/confused by OrbitControls on the canvas.
function InteractiveExactBlock({
  shape,
  label,
  blockId,
  subData,
  colorIndex,
  centroid,
  isSelected,
  onSelect,
}: {
  shape: THREE.Shape;
  label: string;
  blockId: string;
  subData: any;
  colorIndex: number;
  centroid: Pt;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const palette = BLOCK_PALETTE[colorIndex % BLOCK_PALETTE.length];

  const geometry = useMemo(() => {
    if (!shape) return null;
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: BLOCK_DEPTH,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    geom.computeVertexNormals();
    return geom;
  }, [shape]);

  if (!geometry) return null;

  const zOffset = isSelected ? 0.35 : 0;

  return (
    <group
      position={[0, 0, zOffset]}
      userData={{ blockId }}
      onPointerDown={(e) => {
        e.stopPropagation();
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        const dist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
        // If mouse moved less than 5px, it's a true CLICK, not a camera drag!
        // Always resolve the id from the hit object's own userData rather than
        // relying on outer closures, so the block that fires is always the
        // block that gets selected.
        if (dist < 5) {
          const hitId = (e.object?.userData?.blockId as string) ?? blockId;
          onSelect(hitId);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {/* 3D Extruded Block Mesh */}
      <mesh geometry={geometry} castShadow receiveShadow userData={{ blockId }}>
        <meshStandardMaterial
          attach="material-0"
          color={isSelected ? '#B68D40' : palette.top}
          roughness={0.8}
        />
        <meshStandardMaterial
          attach="material-1"
          color={isSelected ? '#D8B36B' : hovered ? '#8FA688' : palette.side}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Wireframe Outline - visible against the light card background */}
      <lineSegments raycast={() => null}>
        <wireframeGeometry args={[geometry]} />
        <lineBasicMaterial
          color={isSelected ? '#B68D40' : '#8A836E'}
          opacity={isSelected ? 0.95 : 0.45}
          transparent
        />
      </lineSegments>

      {/* Block number badge - only shown on hover or when selected, so the
          normal/unselected view stays clean instead of 75 labels stacking
          on top of each other. */}
      {hovered && !isSelected && (
        <Html position={[centroid[0], centroid[1], BLOCK_DEPTH + 0.03]} center distanceFactor={12}>
          <div className="pointer-events-none select-none text-[9px] font-black px-1.5 py-0.5 rounded-md border bg-white/95 text-[#163C2C] border-[#E3DCC6]">
            {label}
          </div>
        </Html>
      )}

      {/* Center Pin Indicator */}
      <mesh position={[centroid[0], centroid[1], BLOCK_DEPTH + 0.02]} raycast={() => null}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={isSelected ? '#B68D40' : '#2F6B4A'} />
      </mesh>

      {/* Floating Info Popup on Selection */}
      {isSelected && (
        <Html position={[centroid[0], centroid[1], BLOCK_DEPTH + 0.45]} center distanceFactor={10}>
          <div className="bg-white/97 border-2 border-[#B68D40] text-[#1A1A17] p-3.5 rounded-2xl shadow-2xl shadow-[#B68D40]/20 w-52 backdrop-blur-md space-y-2 pointer-events-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-1.5">
              <span className="font-black text-[#B68D40] text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(blockId);
                }}
                className="text-[#8A836E] hover:text-[#163C2C] p-0.5 rounded-md transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#7A7566]">
              <div>Acreage: <strong className="text-[#163C2C] font-bold">{subData.acreage} Ac</strong></div>
              <div>Nitrogen: <strong className="text-[#2F6B4A] font-bold">{subData.nValue} ppm</strong></div>
              <div>Slope: <strong className="text-[#B68D40] font-bold">{subData.slope}°</strong></div>
              <div>Soil pH: <strong className="text-[#7C5AA6] font-bold">{subData.ph}</strong></div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// 📐 Grid Partitioning Math
function ExactDynamicPartitionedLand({
  points,
  selectedBlock,
  setSelectedBlock,
  totalAcres,
}: {
  points: [number, number][];
  selectedBlock: string | null;
  setSelectedBlock: (b: string | null) => void;
  totalAcres: number;
}) {
  const { subShapes } = useMemo(() => {
    if (!points || points.length < 3) return { subShapes: [] };

    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const scale = 480;

    const coords: Pt[] = points.map((pt) => [
      (pt[1] - centerLng) * scale,
      (pt[0] - centerLat) * scale,
    ]);

    const totalRenderArea = polygonArea(coords);

    const calcBlockCount = Math.max(4, Math.round(totalAcres * 4));
    const cols = Math.ceil(Math.sqrt(calcBlockCount));
    const rows = Math.ceil(calcBlockCount / cols);

    const xs = coords.map((c) => c[0]);
    const ys = coords.map((c) => c[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const stepX = (maxX - minX) / cols;
    const stepY = (maxY - minY) / rows;

    const blocks: any[] = [];
    let count = 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x1 = minX + c * stepX;
        const x2 = minX + (c + 1) * stepX;
        const y1 = minY + r * stepY;
        const y2 = minY + (r + 1) * stepY;

        const rect: Pt[] = [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
        ];

        const clipped = clipPolygon(coords, rect);

        if (clipped.length < 3) continue;
        const clippedArea = polygonArea(clipped);
        // Lowered threshold (was 0.002) so slivers of land near irregular
        // boundary edges still show up as their own clickable block instead
        // of silently disappearing.
        if (clippedArea < totalRenderArea * 0.0005) continue;

        const qShape = new THREE.Shape();
        clipped.forEach((pt, idx) => {
          if (idx === 0) qShape.moveTo(pt[0], pt[1]);
          else qShape.lineTo(pt[0], pt[1]);
        });
        qShape.closePath();

        const blockAcres = totalAcres * (clippedArea / totalRenderArea);
        const paddedNum = String(count).padStart(2, '0');
        const blockId = `block-${count}`;

        blocks.push({
          id: blockId,
          label: `B${paddedNum}`,
          shape: qShape,
          centroid: polygonCentroid(clipped),
          colorIndex: count - 1,
          data: {
            acreage: blockAcres.toFixed(2),
            nValue: 110 + (count % 15),
            slope: 10 + (count % 12),
            ph: (4.5 + (count % 8) * 0.1).toFixed(1),
          },
        });

        count++;
      }
    }

    return { subShapes: blocks };
  }, [points, totalAcres]);

  if (!subShapes.length) return null;

  return (
    <group rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.2, 0]}>
      {subShapes.map((sub) => (
        <InteractiveExactBlock
          key={sub.id}
          shape={sub.shape}
          label={sub.label}
          blockId={sub.id}
          subData={sub.data}
          colorIndex={sub.colorIndex}
          centroid={sub.centroid}
          isSelected={selectedBlock === sub.id}
          onSelect={(id) => setSelectedBlock(selectedBlock === id ? null : id)}
        />
      ))}
    </group>
  );
}

export default function Partitioned3DView({ points }: PartitionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const landArea = useMemo(() => calculateLandArea(points), [points]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[620px] w-full bg-[#F3EFE3] border-2 border-[#E3DCC6] rounded-3xl flex items-center justify-center text-[#8A836E] text-xs animate-pulse">
        Initializing Dynamic 3D Model...
      </div>
    );
  }

  const totalMicroBlocks = Math.max(4, Math.round(landArea.acres * 4));

  return (
    <div className="h-[620px] w-full bg-gradient-to-b from-[#FBFAF6] to-[#F3EFE3] border-2 border-[#E3DCC6] rounded-3xl relative overflow-hidden shadow-sm flex flex-col justify-between p-5">
      {/* Top Badges */}
      <div className="flex items-start justify-between z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E3DCC6] flex items-center gap-3 shadow-sm">
          <span className="w-3 h-3 rounded-full bg-[#2F6B4A] animate-ping" />
          <div>
            <p className="text-xs font-bold text-[#163C2C]">Quarter-Acre Precision Division Grid</p>
            <p className="text-[10px] text-[#8A836E]">1 Acre = 4 Micro-Blocks ({landArea.acres} Ac = {totalMicroBlocks} Blocks)</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#E3DCC6] text-right shadow-sm">
          <p className="text-[10px] uppercase font-bold text-[#8A836E]">Total Division</p>
          <p className="text-sm font-black text-[#B68D40] flex items-center gap-1">
            <Layers className="w-4 h-4" /> {totalMicroBlocks} Micro-Blocks
          </p>
        </div>
      </div>

      {/* THREE.JS CANVAS */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 7, 7], fov: 40 }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[10, 15, 8]} intensity={1.6} color="#fff8ec" castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.35} color="#B68D40" />

          <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
            <ExactDynamicPartitionedLand
              points={points}
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
              totalAcres={landArea.acres}
            />
          </Float>

          <gridHelper args={[28, 28, '#D8CBA0', '#E8E2CE']} position={[0, -0.6, 0]} />

          {/* Pause Auto Rotate when a block is selected so the popup stays in focus */}
          <OrbitControls enableZoom={true} autoRotate={!selectedBlock} autoRotateSpeed={0.8} />
        </Canvas>
      </div>

      {/* FOOTER SUMMARY */}
      <div className="z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E3DCC6] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#B68D40]/10 p-2.5 rounded-xl border border-[#B68D40]/20 text-[#B68D40]">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#8A836E]">Total Estate Area</p>
            <p className="text-lg font-black text-[#163C2C]">
              {landArea.acres} <span className="text-xs font-medium text-[#B68D40]">Acres</span>{' '}
              <span className="text-[#8A836E] text-xs font-normal">({landArea.perches} Perches)</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="bg-[#F3EFE3] border border-[#E3DCC6] px-3 py-1.5 rounded-xl text-[#54503F] font-medium">
            Status: <strong className="text-[#B68D40]">{selectedBlock ? `Inspecting ${selectedBlock.toUpperCase()}` : 'Click any block to inspect'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}