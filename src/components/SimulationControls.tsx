import React from 'react';
import { SimulationState, SimulationModule } from '../types';
import { Layers, Thermometer, ShieldAlert, Zap } from 'lucide-react';

interface ControlsProps {
  state: SimulationState;
  setState: React.Dispatch<React.SetStateAction<SimulationState>>;
}

export default function SimulationControls({ state, setState }: ControlsProps) {
  const updateState = (updates: Partial<SimulationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">參數控制面板</h2>
        <div className="flex flex-col gap-2">
          {[
            { id: SimulationModule.DOWNFORCE, label: '腔體下壓力', icon: Layers },
            { id: SimulationModule.THERMAL, label: '熱力學疲勞', icon: Thermometer },
            { id: SimulationModule.IMPACT, label: '落摔衝擊', icon: ShieldAlert },
          ].map((mod) => (
            <button
              key={mod.id}
              onClick={() => updateState({ module: mod.id })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all text-xs border ${
                state.module === mod.id
                  ? 'bg-white border-[#B76E79]/30 text-[#B76E79] font-bold shadow-sm'
                  : 'bg-transparent border-gray-50 text-[#636E72] hover:bg-gray-50'
              }`}
            >
              <mod.icon size={14} />
              <span>{mod.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">視覺設定</h2>
        <button
          onClick={() => updateState({ isTransparent: !state.isTransparent })}
          className={`flex items-center justify-between px-3 py-2.5 rounded border transition-all text-[11px] tracking-wide ${
            state.isTransparent
              ? 'bg-white border-[#B76E79]/50 text-[#B76E79] font-bold shadow-sm'
              : 'bg-transparent border-gray-50 text-[#95A5A6]'
          }`}
        >
          <span>[ 透明模式 : {state.isTransparent ? 'ON' : 'OFF'} ]</span>
          <Zap size={12} fill={state.isTransparent ? '#B76E79' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
        {state.module === SimulationModule.DOWNFORCE && (
          <div className="flex flex-col gap-5">
            <Slider 
              label="下壓力 (Force)" 
              unit="N" 
              min={0} max={200} step={1} 
              value={state.force} 
              onChange={(v) => updateState({ force: v })} 
            />
            <Slider 
              label="受力面積 (Area)" 
              unit="cm²" 
              min={1} max={50} step={0.5} 
              value={state.area} 
              onChange={(v) => updateState({ area: v })} 
            />
          </div>
        )}

        {state.module === SimulationModule.THERMAL && (
          <div className="flex flex-col gap-5">
            <Slider 
              label="溫差負荷 (Temp)" 
              unit="°C" 
              min={0} max={100} step={1} 
              value={state.tempDelta} 
              onChange={(v) => updateState({ tempDelta: v })} 
            />
            <Slider 
              label="照射時數 (Time)" 
              unit="HRS" 
              min={0} max={10000} step={100} 
              value={state.exposureTime} 
              onChange={(v) => updateState({ exposureTime: v })} 
            />
          </div>
        )}

        {state.module === SimulationModule.IMPACT && (
          <div className="flex flex-col gap-5">
            <Slider 
              label="落摔高度 (Height)" 
              unit="m" 
              min={0} max={3} step={0.1} 
              value={state.height} 
              onChange={(v) => updateState({ height: v })} 
            />
            <Slider 
              label="衝擊耗時 (Δt)" 
              unit="ms" 
              min={1} max={50} step={1} 
              value={state.impactTime * 1000} 
              onChange={(v) => updateState({ impactTime: v / 1000 })} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({ label, unit, min, max, step, value, onChange }: { 
  label: string, unit: string, min: number, max: number, step: number, value: number, onChange: (v: number) => void 
}) {
  const progress = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-[11px] tracking-tight">
        <span className="text-[#636E72]">{label}</span>
        <span className="text-[#B76E79] font-bold">{value.toFixed(1)} {unit}</span>
      </div>
      <div className="relative w-full h-[2px] bg-gray-100 flex items-center">
        <div 
          className="absolute left-0 h-full bg-[#B76E79]" 
          style={{ width: `${progress}%` }} 
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-4 opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute w-2.5 h-2.5 bg-white border border-[#B76E79] rounded-full shadow-sm pointer-events-none z-0"
          style={{ left: `calc(${progress}% - 5px)` }}
        />
      </div>
    </div>
  );
}
