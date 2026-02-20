'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Dice3DProps {
  faces: number;
  onRollComplete?: (value: number) => void;
  isRolling?: boolean;
}

function DiceGeometry({ faces, rotation, result }: { faces: number; rotation: THREE.Euler; result: number | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.copy(rotation);
    }
  });

  const getDiceGeometry = () => {
    switch (faces) {
      case 3: // D3 - triangular prism
        return <cylinderGeometry args={[0.8, 0.8, 0.4, 3]} />;
      case 4: // D4 - tetrahedron
        return <tetrahedronGeometry args={[1]} />;
      case 6: // D6 - cube
        return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case 8: // D8 - octahedron
        return <octahedronGeometry args={[1]} />;
      case 12: // D12 - dodecahedron
        return <dodecahedronGeometry args={[1]} />;
      case 20: // D20 - icosahedron
        return <icosahedronGeometry args={[1]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} castShadow>
      {getDiceGeometry()}
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.4}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

export default function Dice3D({ faces, onRollComplete, isRolling = false }: Dice3DProps) {
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (isRolling && !rolling) {
      performRoll();
    }
  }, [isRolling]);

  const performRoll = () => {
    setRolling(true);
    setResult(null);

    // Generate random result
    const finalValue = Math.floor(Math.random() * faces) + 1;

    // Animate rotation
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds
    const spins = 5;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      // Calculate rotation
      const rotX = eased * spins * Math.PI * 2 + finalValue * 0.5;
      const rotY = eased * spins * Math.PI * 2 + finalValue * 0.7;
      const rotZ = eased * spins * Math.PI * 2 + finalValue * 0.3;

      setRotation(new THREE.Euler(rotX, rotY, rotZ));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setResult(finalValue);
        setRolling(false);
        onRollComplete?.(finalValue);
      }
    };

    animate();
  };

  return (
    <div className="relative w-full h-64 sm:h-80">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        className="touchscreen-none"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22D3EE" />
        <DiceGeometry faces={faces} rotation={rotation} result={result} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {result !== null && !rolling && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-surface-2 border border-neon-violet rounded-2xl px-8 py-4 shadow-glow-primary">
            <div className="text-6xl font-bold text-gradient-hero">
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
