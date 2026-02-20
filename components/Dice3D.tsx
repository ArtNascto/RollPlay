'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Dice3DProps {
  faces: number;
  onRollComplete?: (value: number) => void;
  isRolling?: boolean;
}

function DiceWithNumbers({ faces, rotation, result }: { faces: number; rotation: THREE.Euler; result: number | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.copy(rotation);
    }
  });

  const getDiceGeometry = () => {
    switch (faces) {
      case 3: return <cylinderGeometry args={[0.8, 0.8, 0.4, 3]} />;
      case 4: return <tetrahedronGeometry args={[1.2]} />;
      case 6: return <boxGeometry args={[1.4, 1.4, 1.4]} />;
      case 8: return <octahedronGeometry args={[1.2]} />;
      case 12: return <dodecahedronGeometry args={[1.2]} />;
      case 20: return <icosahedronGeometry args={[1.2]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getNumberPositions = () => {
    // Calculate positions for numbers on each face
    const positions: Array<{ pos: [number, number, number], rot: [number, number, number], num: number }> = [];
    
    if (faces === 6) {
      // D6 - Cube faces
      positions.push({ pos: [0, 0.71, 0], rot: [-Math.PI / 2, 0, 0], num: 1 });
      positions.push({ pos: [0, -0.71, 0], rot: [Math.PI / 2, 0, 0], num: 6 });
      positions.push({ pos: [0.71, 0, 0], rot: [0, Math.PI / 2, 0], num: 2 });
      positions.push({ pos: [-0.71, 0, 0], rot: [0, -Math.PI / 2, 0], num: 5 });
      positions.push({ pos: [0, 0, 0.71], rot: [0, 0, 0], num: 3 });
      positions.push({ pos: [0, 0, -0.71], rot: [0, Math.PI, 0], num: 4 });
    } else if (faces === 20) {
      // D20 - Show subset of numbers on visible faces
      const radius = 0.9;
      for (let i = 1; i <= 20; i++) {
        const phi = Math.acos(-1 + (2 * i - 1) / 20);
        const theta = Math.sqrt(20 * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        positions.push({ pos: [x, y, z], rot: [0, 0, 0], num: i });
      }
    } else if (faces === 12) {
      // D12 - Show subset of numbers
      const angles = [0, 72, 144, 216, 288];
      angles.forEach((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        positions.push({ 
          pos: [Math.cos(rad) * 0.9, 0.5, Math.sin(rad) * 0.9], 
          rot: [0, 0, 0], 
          num: i + 1 
        });
        positions.push({ 
          pos: [Math.cos(rad) * 0.9, -0.5, Math.sin(rad) * 0.9], 
          rot: [0, 0, 0], 
          num: i + 7 
        });
      });
      positions.push({ pos: [0, 1, 0], rot: [0, 0, 0], num: 11 });
      positions.push({ pos: [0, -1, 0], rot: [0, 0, 0], num: 12 });
    } else if (faces === 8) {
      // D8 - Octahedron
      positions.push({ pos: [0, 1, 0], rot: [0, 0, 0], num: 1 });
      positions.push({ pos: [0, -1, 0], rot: [0, 0, 0], num: 8 });
      positions.push({ pos: [0.7, 0, 0.7], rot: [0, 0, 0], num: 2 });
      positions.push({ pos: [-0.7, 0, -0.7], rot: [0, 0, 0], num: 7 });
      positions.push({ pos: [0.7, 0, -0.7], rot: [0, 0, 0], num: 3 });
      positions.push({ pos: [-0.7, 0, 0.7], rot: [0, 0, 0], num: 6 });
      positions.push({ pos: [0, 0, 1], rot: [0, 0, 0], num: 4 });
      positions.push({ pos: [0, 0, -1], rot: [0, 0, 0], num: 5 });
    } else if (faces === 3) {
      // D3 - Triangular prism sides
      positions.push({ pos: [0, 0, 0.5], rot: [0, 0, 0], num: 1 });
      positions.push({ pos: [-0.5, 0, -0.3], rot: [0, Math.PI * 2/3, 0], num: 2 });
      positions.push({ pos: [0.5, 0, -0.3], rot: [0, -Math.PI * 2/3, 0], num: 3 });
    } else if (faces === 4) {
      // D4 - Tetrahedron
      positions.push({ pos: [0, 0.8, 0], rot: [0, 0, 0], num: 1 });
      positions.push({ pos: [0.6, -0.3, 0.4], rot: [0, 0, 0], num: 2 });
      positions.push({ pos: [-0.6, -0.3, 0.4], rot: [0, 0, 0], num: 3 });
      positions.push({ pos: [0, -0.3, -0.6], rot: [0, 0, 0], num: 4 });
    }
    
    return positions;
  };

  return (
    <group ref={groupRef}>
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
      
      {/* Render numbers on faces */}
      {getNumberPositions().map(({ pos, rot, num }, index) => (
        <Text
          key={index}
          position={pos}
          rotation={rot}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0A0A0F"
        >
          {num}
        </Text>
      ))}
    </group>
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

    const finalValue = Math.floor(Math.random() * faces) + 1;
    const startTime = Date.now();
    const duration = 2500;
    const spins = 5;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

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
        className="touch-none"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22D3EE" />
        <DiceWithNumbers faces={faces} rotation={rotation} result={result} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {result !== null && !rolling && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-surface-2 border-2 border-neon-violet rounded-2xl px-8 py-4 shadow-glow-primary backdrop-blur-sm bg-opacity-90">
            <div className="text-6xl font-bold text-gradient-hero">
              {result}
            </div>
          </div>
        </div>
      )}
      
      {rolling && (
        <div className="absolute top-4 right-4 bg-neon-violet text-bg-main px-4 py-2 rounded-lg text-sm font-medium shadow-glow-primary animate-pulse">
          Rolando D{faces}...
        </div>
      )}
    </div>
  );
}
