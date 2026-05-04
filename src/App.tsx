import { useState } from 'react';
import SimulationScene from './components/SimulationScene';
import SimulationControls from './components/SimulationControls';
import ResultsDisplay from './components/ResultsDisplay';
import { SimulationState, INITIAL_STATE, SimulationModule } from './types';

export default function App() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#FDFDFD] font-sans text-[#2D3436] overflow-hidden">
      {/* Header */}
      <header className="h-[70px] border-b border-[#EAECEF] px-10 flex justify-between items-center bg-white z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#B76E79] rounded-md flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <h1 className="text-lg tracking-wider font-semibold">
            NAIL ELIXIR <span className="text-[#B76E79]">PHYSICS PRO</span> 
            <span className="font-light opacity-50 text-xs ml-2 tracking-widest uppercase">V2.1</span>
          </h1>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-[1.5px] text-[#636E72] font-semibold">
          <span>System Ready</span>
          <span className="text-[#B76E79]">● Simulation Active</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-[260px_1fr_280px] gap-px bg-[#EAECEF] overflow-hidden">
        {/* Left Sidebar: Controls */}
        <aside className="bg-white p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar">
          <SimulationControls state={state} setState={setState} />
          
          <div className="mt-auto pt-6">
            <button className="w-full py-3.5 bg-[#B76E79] text-white rounded-sm text-[13px] tracking-widest hover:bg-[#a05d68] transition-colors cursor-pointer uppercase font-medium">
              執行深度模擬分析
            </button>
            <div className="mt-4 text-[9px] text-[#B2BEC3] leading-relaxed text-center font-mono uppercase tracking-tighter">
              Real-time Physics Engine Stable<br/>Latency: 12ms
            </div>
          </div>
        </aside>

        {/* Viewport */}
        <section className="bg-[#F8FAFC] relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-8 left-8 text-[10px] tracking-widest text-[#B2BEC3] font-mono pointer-events-none">
            VIEWPORT: 3D_REALTIME_RENDER
          </div>
          <div className="w-[85%] h-[85%] flex items-center justify-center">
            <SimulationScene state={state} />
          </div>
          <div className="absolute bottom-10 flex gap-3 pointer-events-none">
            <div className="px-4 py-2 bg-white border border-[#EAECEF] rounded-full text-[10px] text-[#636E72] shadow-sm font-semibold tracking-wide uppercase">
              [ 透明模式 : {state.isTransparent ? 'ON' : 'OFF'} ]
            </div>
            <div className="px-4 py-2 bg-white border border-[#EAECEF] rounded-full text-[10px] text-[#636E72] shadow-sm font-semibold tracking-wide uppercase">
              [ 核心模組 : {state.module} ]
            </div>
          </div>
        </section>

        {/* Right Sidebar: Quick Stats */}
        <aside className="bg-white p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <h2 className="text-[11px] uppercase tracking-widest text-[#B76E79] font-bold border-b border-gray-50 pb-2">物理仿真瞬時數據</h2>
          <ResultsDisplay state={state} simplified />
        </aside>
      </main>

      {/* Footer */}
      <footer className="h-[120px] border-t border-[#EAECEF] bg-white px-10 py-6 grid grid-cols-[1fr_300px] gap-10 items-center">
        <div>
          <h3 className="text-xs font-bold text-[#B76E79] mb-2 uppercase tracking-widest">工學失效風險總結</h3>
          <p className="text-[13px] leading-relaxed text-[#636E72] line-clamp-2 max-w-2xl">
            系統正在對當前 {state.module} 模組進行即時分析。由模型數據推導：
            {state.module === SimulationModule.IMPACT ? ' 底部支撐組件於衝擊瞬間受力劇烈，建議優化結構圓角。' : ''}
            {state.module === SimulationModule.THERMAL ? ' UV 燈組導熱路徑存在瓶頸，應增加散熱鰭片密度。' : ''}
            {state.module === SimulationModule.DOWNFORCE ? ' 腔體頂部結構穩定，外殼受壓變位在安全控制範圍。' : ''}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-xl font-light text-[#2D3436]">98.2%</div>
            <div className="text-[9px] text-[#B2BEC3] uppercase tracking-wider font-bold">結構健康度</div>
          </div>
          <div className="text-center border-x border-[#EAECEF]">
            <div className="text-xl font-light text-[#2D3436]">0.02mm</div>
            <div className="text-[9px] text-[#B2BEC3] uppercase tracking-wider font-bold">最大位移</div>
          </div>
          <div className="text-center text-[#B76E79]">
            <div className="text-xl font-light">PASS</div>
            <div className="text-[9px] text-[#B2BEC3] uppercase tracking-wider font-bold">模擬驗證</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
