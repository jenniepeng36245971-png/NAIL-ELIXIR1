import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { SimulationState, SimulationModule, COLORS } from '../types';

interface ModelProps {
  state: SimulationState;
}

export default function NailElixirModel({ state }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Gentle auto-rotation
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  // Calculate colors based on module
  const heatmapColor = useMemo(() => {
    if (state.module === SimulationModule.DOWNFORCE) {
      const intensity = Math.min(state.force / 200, 1);
      // Indigo (Low) to Rose Gold (High) gradient approach
      const c = new THREE.Color('#fcfcfc');
      const target = new THREE.Color('#ff4d4d'); // Stress red
      return c.lerp(target, intensity);
    }
    if (state.module === SimulationModule.THERMAL) {
      const yellowing = Math.min(state.exposureTime / 15000, 0.4);
      const heatBlush = Math.min(state.tempDelta / 100, 0.4);
      // Base off-white, add yellow and slight red
      return new THREE.Color(1, 1 - yellowing, 1 - yellowing - heatBlush);
    }
    return new THREE.Color('#FFFFFF');
  }, [state]);

  const bodyOpacity = state.isTransparent ? 0.3 : 1;

  return (
    <group ref={meshRef}>
      {/* Base - Rose Gold */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.5, 64]} />
        <meshStandardMaterial color={COLORS.roseGold} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Main Body */}
      <mesh position={[0, 0, 0]}>
        <RoundedBox args={[2.8, 3.6, 2.8]} radius={0.9} smoothness={5}>
          <meshStandardMaterial 
            color={heatmapColor} 
            transparent={state.isTransparent} 
            opacity={bodyOpacity}
            roughness={0.05}
            metalness={0.1}
          />
        </RoundedBox>
      </mesh>

      {/* "Hand Cave" Opening - Simulated lighting and depth */}
      <group position={[0, 0.2, 0.5]}>
        {!state.isTransparent && (
          <mesh position={[0, 0, 0.9]}>
            <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
            <meshStandardMaterial color="#222" emissive={COLORS.uvBlue} emissiveIntensity={0.2} />
          </mesh>
        )}
        
        {/* UV Lamp Glow */}
        <pointLight position={[0, 0, 0.5]} intensity={8} color={COLORS.uvBlue} distance={4} />
      </group>
      
      {/* Internal Components - Visible when transparent */}
      {state.isTransparent && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial color="#1e3a1a" roughness={1} />
          </mesh>
          <mesh position={[0.6, -0.6, -0.6]}>
            <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
            <meshStandardMaterial color="#444" metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
             <torusGeometry args={[0.9, 0.08, 16, 64]} rotation={[Math.PI / 2, 0, 0]} />
             <meshStandardMaterial color={COLORS.uvBlue} emissive={COLORS.uvBlue} emissiveIntensity={2} />
          </mesh>
        </group>
      )}

      {/* Impact Indicators */}
      {state.module === SimulationModule.IMPACT && (
        <group position={[0, -1.8, 1.6]}>
          <mesh position={[0, 0.5, 0]}>
             <coneGeometry args={[0.15, 0.6, 8]} rotation={[Math.PI, 0, 0]} />
             <meshBasicMaterial color="#ff4d4d" />
          </mesh>
          <group scale={[1 + state.height, 1, 1 + state.height]}>
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
               <ringGeometry args={[0.6, 0.65, 64]} />
               <meshBasicMaterial color="#ff4d4d" transparent opacity={0.6} />
             </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
