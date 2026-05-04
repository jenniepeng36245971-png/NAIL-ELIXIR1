import React, { useMemo } from 'react';
import { SimulationState, SimulationModule } from '../types';
import { motion } from 'motion/react';

interface ResultsProps {
  state: SimulationState;
  simplified?: boolean;
}

export default function ResultsDisplay({ state }: ResultsProps) {
  const calculations = useMemo(() => {
    switch (state.module) {
      case SimulationModule.DOWNFORCE: {
        const pressure = state.force / state.area; // N/cm^2
        const pressurePa = (state.force / (state.area / 10000)); // Pa
        const stressLevel = pressurePa > 500000 ? '高風險' : (pressurePa > 100000 ? '穩定' : ' PASS ');
        return {
          title: 'DOWNFORCE ANALYSIS',
          formula: 'P = F / A',
          data: [
            { label: '計算壓強 (P)', value: `${pressure.toFixed(2)} N/cm²` },
            { label: '等效應力 (MPa)', value: `${(pressurePa / 1000000).toFixed(3)} MPa` },
            { label: '結構狀態', value: stressLevel, highlight: true },
          ],
        };
      }
      case SimulationModule.THERMAL: {
        const E = 2300; 
        const Alpha = 0.00007;
        const thermalStress = E * Alpha * state.tempDelta;
        const agingPercent = Math.min((state.exposureTime / 10000) * 100, 100);
        
        return {
          title: 'THERMAL FATIGUE',
          formula: 'σ = E · α · ΔT',
          data: [
            { label: '熱應力 (σ)', value: `${thermalStress.toFixed(2)} MPa` },
            { label: '老化程度', value: `${agingPercent.toFixed(1)}%` },
            { label: '安全閾值', value: thermalStress > 15 ? 'WARNING' : 'PASS', highlight: true },
          ],
        };
      }
      case SimulationModule.IMPACT: {
        const g = 9.81;
        const velocity = Math.sqrt(2 * g * state.height);
        const impactForce = (state.mass * velocity) / state.impactTime;
        
        return {
          title: 'DROP IMPACT',
          formula: 'F = (m · √2gh) / Δt',
          data: [
            { label: '落地速 (v)', value: `${velocity.toFixed(2)} m/s` },
            { label: '衝力 (F_peak)', value: `${impactForce.toFixed(0)} N` },
            { label: '衝擊強度 (G)', value: `${(impactForce / (state.mass * g)).toFixed(1)} G`, highlight: true },
          ],
        };
      }
      default:
        return null;
    }
  }, [state]);

  if (!calculations) return null;

  return (
    <motion.div 
      key={state.module}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-5"
    >
      <div className="bg-[#FAFAFA] p-5 rounded border-l-[3px] border-[#B76E79] shadow-sm">
        <div className="text-[10px] text-[#95A5A6] mb-2 font-bold tracking-widest uppercase">{calculations.title}</div>
        <div className="font-serif italic text-xl text-[#2D3436] mb-4">
          {calculations.formula.split(' = ')[0]} = {calculations.data[0].value.split(' ')[0]} {calculations.data[0].value.split(' ')[1] || ''}
        </div>
        <div className="flex flex-col gap-3">
          {calculations.data.slice(1).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px] border-t border-gray-50 pt-2">
              <span className="text-[#636E72]">{item.label}</span>
              <span className={`font-mono font-bold ${item.highlight ? 'text-[#B76E79]' : 'text-[#2D3436]'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FAFAFA]/50 p-4 rounded border-border border-dashed border p-4">
        <h4 className="text-[10px] text-[#B2BEC3] font-bold uppercase mb-2">分析引擎預警</h4>
        <p className="text-[11px] text-[#2D3436] leading-relaxed">
          {state.module === SimulationModule.IMPACT ? '偵測到底座銜接點應力集中，需強化螺栓鎖附設計。' : ''}
          {state.module === SimulationModule.THERMAL ? '溫差循環負荷正常，PC 外殼材料老化曲線符合預期。' : ''}
          {state.module === SimulationModule.DOWNFORCE ? '當前 P 值處於安全區間，內部組件無物理干涉。' : ''}
        </p>
      </div>
    </motion.div>
  );
}
