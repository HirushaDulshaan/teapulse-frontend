// components/TeaLeafCanvas.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingLeaf() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Smooth rotation & floating animation without THREE.Clock warnings
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.8, 0.8, 1.2, 2.0, 0, 3.5);
  leafShape.bezierCurveTo(-1.2, 2.0, -0.8, 0.8, 0, 0);

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 2,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]} scale={1.1}>
      <extrudeGeometry args={[leafShape, extrudeSettings]} />
      <meshStandardMaterial
        color="#10b981"
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function TeaLeafCanvas() {
  return (
    <div className="w-full h-[380px] md:h-[480px] relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#059669" />
        
        <RotatingLeaf />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400/60 uppercase tracking-widest pointer-events-none bg-slate-900/60 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm">
        Drag to Rotate 3D Leaf
      </div>
    </div>
  );
}