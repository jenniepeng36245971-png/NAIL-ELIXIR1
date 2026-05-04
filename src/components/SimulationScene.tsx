import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';
import NailElixirModel from './NailElixirModel';
import { SimulationState, COLORS } from '../types';

interface SceneProps {
  state: SimulationState;
}

export default function SimulationScene({ state }: SceneProps) {
  return (
    <div className="w-full h-full bg-[#f8f9fa] relative overflow-hidden">
      <Canvas shadow={{ type: 'basic' }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={40} />
        <Environment preset="studio" />
        
        <Stage adjustCamera={false} intensity={0.5} environment="studio" contactShadow={{ opacity: 0.2 }}>
           <NailElixirModel state={state} />
        </Stage>

        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={12} 
          makeDefault
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      </Canvas>

      {/* Floating Canvas UI Indicators */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none text-gray-400 font-mono text-[10px] tracking-widest uppercase">
        Nail Elixir Physics Core V2.1
      </div>
    </div>
  );
}
