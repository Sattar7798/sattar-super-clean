'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   SEISMIC VISUALIZATION — SDOF Newmark-β Physics Engine
   ─────────────────────────────────────────────────────────────────────────────
   Features:
   • Newmark-β (average acceleration) numerical integration of SDOF equation
   • Kanai-Tajimi stochastic ground motion generation
   • Per-floor drift heatmap (green→yellow→orange→red based on drift ratio)
   • 5 interactive controls with instant physics feedback
   • Styled for dark theme with indigo/cyan accent palette
─────────────────────────────────────────────────────────────────────────────── */

// ── Soil amplification table (EC8 site classes) ──────────────────────────────
const SOIL_TABLE: Record<string, { label: string; S: number; Tb: number; Tc: number; Td: number; color: string }> = {
  A: { label: 'Rock (Class A)', S: 1.0, Tb: 0.15, Tc: 0.4, Td: 2.0, color: '#34d399' },
  B: { label: 'Stiff Soil (B)', S: 1.2, Tb: 0.15, Tc: 0.5, Td: 2.0, color: '#22d3ee' },
  C: { label: 'Medium Soil (C)', S: 1.15, Tb: 0.20, Tc: 0.6, Td: 2.0, color: '#fb923c' },
  D: { label: 'Soft Soil (D)', S: 1.35, Tb: 0.20, Tc: 0.8, Td: 2.0, color: '#fb7185' },
};

const CODE_DRIFT_LIMIT = 0.025; // 2.5% drift ratio limit (EC8 life safety)
const NUM_FLOORS = 10;
const FLOOR_HEIGHT_M = 3.0;
const DT = 0.005; // simulation time step (seconds)
const SIM_DURATION = 30; // seconds

// ── Kanai-Tajimi + envelope ground motion generator ───────────────────────────
function generateGroundMotion(magnitude: number, distKm: number, soilClass: string): Float64Array {
  const soil = SOIL_TABLE[soilClass];
  const n = Math.floor(SIM_DURATION / DT);
  const ag = new Float64Array(n);

  // Attenuation: simplified Boore-Atkinson style PGA (g)
  const pga = Math.exp(0.5 * (magnitude - 6.0)) * Math.pow(distKm, -1.0) * 0.25 * soil.S;
  // Peak time
  const tPeak = SIM_DURATION * 0.25;
  const raiseDur = tPeak;
  const decayDur = SIM_DURATION - tPeak;

  // Dominant ground frequency (Hz) from soil class
  const ωg = 2 * Math.PI * (1.5 + (4 - ['A','B','C','D'].indexOf(soilClass)) * 0.8);

  let v = 0; // KT filter velocity state

  for (let i = 0; i < n; i++) {
    const t = i * DT;
    // Envelope: build-up → peak → exponential decay
    let env: number;
    if (t <= raiseDur) {
      env = Math.sin((Math.PI / 2) * (t / raiseDur));
    } else {
      env = Math.exp(-2.5 * ((t - tPeak) / decayDur));
    }

    // White-noise excitation
    const wn = (Math.random() * 2 - 1);

    // Simple 1-pole Kanai-Tajimi filter approximation
    v = v * Math.exp(-0.6 * ωg * DT) + wn * DT * ωg;

    ag[i] = env * pga * 9.81 * v; // m/s²
  }
  return ag;
}

// ── Newmark-β Average Acceleration SDOF Solver ───────────────────────────────
function solveSDOF(
  ag: Float64Array,
  Tn: number,   // natural period (s)
  zeta: number  // damping ratio (0.05 = 5%)
): { u: Float64Array; v: Float64Array } {
  const n = ag.length;
  const omega = (2 * Math.PI) / Tn;
  const m = 1.0; // normalised mass
  const c = 2 * zeta * omega * m;
  const k = omega * omega * m;

  // Newmark constants (average acceleration: β=0.25, γ=0.5)
  const beta = 0.25;
  const gamma = 0.5;

  const a1 = m / (beta * DT * DT) + gamma * c / (beta * DT);
  const a2 = m / (beta * DT) + (gamma / beta - 1) * c;
  const a3 = (0.5 / beta - 1) * m + DT * (0.5 * gamma / beta - 1) * c;
  const keff = k + a1;

  const u = new Float64Array(n);
  const v = new Float64Array(n);
  const acc = new Float64Array(n);

  acc[0] = (-m * ag[0] - c * v[0] - k * u[0]) / m;

  for (let i = 1; i < n; i++) {
    const peff = -m * ag[i] + a1 * u[i - 1] + a2 * v[i - 1] + a3 * acc[i - 1];
    u[i] = peff / keff;
    v[i] = gamma / (beta * DT) * (u[i] - u[i - 1]) + (1 - gamma / beta) * v[i - 1] + DT * (1 - gamma / (2 * beta)) * acc[i - 1];
    acc[i] = (u[i] - u[i - 1]) / (beta * DT * DT) - v[i - 1] / (beta * DT) - (0.5 / beta - 1) * acc[i - 1];
  }

  return { u, v };
}

// ── Floor drift colour (based on drift ratio vs code limit) ──────────────────
function driftColor(drift: number): string {
  const r = Math.abs(drift) / CODE_DRIFT_LIMIT;
  if (r < 0.3) return '#34d399'; // green — safe
  if (r < 0.6) return '#fbbf24'; // yellow
  if (r < 0.85) return '#fb923c'; // orange
  return '#fb7185';              // red — critical
}

// ── Slider component ──────────────────────────────────────────────────────────
interface SliderProps { label: string; value: number; min: number; max: number; step: number; unit: string; format?: (v: number) => string; onChange: (v: number) => void; color: string; }
const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unit, format, onChange, color }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="font-mono" style={{ color }}>{format ? format(value) : value.toFixed(1)}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ background: `linear-gradient(to right, ${color} ${((value-min)/(max-min))*100}%, rgba(99,102,241,0.2) 0%)` }}
      className="w-full cursor-pointer"
    />
    <div className="flex justify-between text-[10px] text-gray-600">
      <span>{min}{unit}</span><span>{max}{unit}</span>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
interface SeismicVisualizationProps {
  initialIntensity?: number;
  className?: string;
  showControls?: boolean;
}

const SeismicVisualization: React.FC<SeismicVisualizationProps> = ({
  className = '',
}) => {
  const [magnitude, setMagnitude] = useState(6.5);
  const [distance, setDistance] = useState(20);
  const [soilClass, setSoilClass] = useState<'A'|'B'|'C'|'D'>('B');
  const [damping, setDamping] = useState(5);
  const [naturalPeriod, setNaturalPeriod] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState(3);

  // Simulation state refs (avoid re-renders during animation)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agRef = useRef<Float64Array | null>(null);
  const uRef = useRef<Float64Array | null>(null);
  const frameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(false);

  // Chart mini-canvases
  const pgaCanvasRef = useRef<HTMLCanvasElement>(null);
  const dispCanvasRef = useRef<HTMLCanvasElement>(null);

  // Current metrics for display
  const [metrics, setMetrics] = useState({ pga: 0, maxDisp: 0, maxDrift: 0, time: 0 });

  // Generate simulation data
  const runSim = useCallback(() => {
    const ag = generateGroundMotion(magnitude, distance, soilClass);
    const { u } = solveSDOF(ag, naturalPeriod, damping / 100);
    agRef.current = ag;
    uRef.current = u;
    frameRef.current = 0;
    // Compute max values
    let maxPGA = 0, maxU = 0;
    for (let i = 0; i < ag.length; i++) { maxPGA = Math.max(maxPGA, Math.abs(ag[i])); maxU = Math.max(maxU, Math.abs(u[i])); }
    setMetrics({ pga: maxPGA / 9.81, maxDisp: maxU * 100, maxDrift: (maxU / (NUM_FLOORS * FLOOR_HEIGHT_M)) * 100, time: 0 });
  }, [magnitude, distance, soilClass, damping, naturalPeriod]);

  // Generate on param change
  useEffect(() => { runSim(); }, [runSim]);

  // ── Draw canvas frame ────────────────────────────────────────────────────────
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !agRef.current || !uRef.current) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    const ag = agRef.current;
    const u = uRef.current;
    const fi = Math.min(frameIdx, ag.length - 1);

    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#050e1f');
    bg.addColorStop(1, '#0d1f3c');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // ── Ground ────────────────────────────────────────────────────────────────
    const groundY = h * 0.82;
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
    groundGrad.addColorStop(0, '#1e3a5f');
    groundGrad.addColorStop(1, '#0a1628');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Ground wave pattern
    const groundShift = u[fi] * 30;
    ctx.strokeStyle = 'rgba(34,211,238,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 4) {
      const y = groundY + 3 + Math.sin((x + groundShift * 5) * 0.08) * 3;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // ── Building ─────────────────────────────────────────────────────────────
    const bw = w * 0.2;
    const totalBH = groundY * 0.78;
    const bx0 = w / 2 - bw / 2;
    const floorH = totalBH / NUM_FLOORS;

    // Window pattern helper
    const drawWindows = (fx: number, fy: number, floorW: number, fh: number, drift: number) => {
      const ww = floorW * 0.18;
      const wh = fh * 0.4;
      const wOpacity = Math.max(0, 1 - Math.abs(drift) / CODE_DRIFT_LIMIT * 1.5);
      ctx.fillStyle = `rgba(99,102,241,${0.08 + wOpacity * 0.12})`;
      for (let wx = fx + floorW * 0.1; wx < fx + floorW - ww; wx += floorW * 0.3) {
        ctx.fillRect(wx, fy + fh * 0.15, ww, wh);
      }
    };

    for (let floor = 0; floor < NUM_FLOORS; floor++) {
      const floorFraction = floor / NUM_FLOORS;
      const nextFraction = (floor + 1) / NUM_FLOORS;

      // Mode shape: 1st mode — sin curve approximation
      const modeShape = Math.sin((Math.PI / 2) * floorFraction);
      const modeShapeNext = Math.sin((Math.PI / 2) * nextFraction);

      const thisDisp = u[fi] * modeShape * 80;        // pixels
      const nextDisp = u[fi] * modeShapeNext * 80;

      const floorY = groundY - (floor + 1) * floorH;

      // Drift ratio for this storey
      const storyDriftM = Math.abs((u[fi] * modeShapeNext - u[fi] * modeShape));
      const driftRatio = storyDriftM / FLOOR_HEIGHT_M;

      const col = driftColor(driftRatio);

      // Floor slab
      const slabX = bx0 + thisDisp;
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 6;
      ctx.fillRect(slabX, floorY, bw, 5);
      ctx.shadowBlur = 0;

      // Columns from this floor to next
      const nSlabX = bx0 + nextDisp;
      ctx.strokeStyle = col;
      ctx.lineWidth = floor === 0 ? 4 : 2.5;
      ctx.globalAlpha = 0.85;
      [[slabX, nSlabX], [slabX + bw, nSlabX + bw]].forEach(([x1, x2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, floorY + 5);
        ctx.lineTo(x2, floorY + 5 + floorH);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // Windows
      drawWindows(slabX, floorY + 5, bw, floorH - 5, driftRatio);
    }

    // Ground floor base
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(bx0 + u[fi] * 0 - 20, groundY - 5, bw + 40, 5);

    // ── Ground motion waveform strip (mini seismograph at bottom) ─────────────
    const wavH = h * 0.07;
    const wavY0 = h - wavH - 4;
    const scale = (wavH / 2) / (Math.max(...Array.from(ag).map(Math.abs)) + 0.001);

    ctx.strokeStyle = 'rgba(34,211,238,0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const step = Math.max(1, Math.floor(ag.length / w));
    for (let x = 0; x < w; x++) {
      const di = Math.min(Math.floor((x / w) * fi), ag.length - 1);
      const y = wavY0 + wavH / 2 - ag[di] * scale;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Progress indicator line
    ctx.strokeStyle = 'rgba(251,113,133,0.9)';
    ctx.lineWidth = 1.5;
    const px = (fi / ag.length) * w;
    ctx.beginPath(); ctx.moveTo(px, wavY0); ctx.lineTo(px, wavY0 + wavH); ctx.stroke();

    // ── Labels ────────────────────────────────────────────────────────────────
    ctx.font = 'bold 11px "Inter", monospace';
    ctx.textAlign = 'center';
    const dispCm = (Math.abs(u[fi]) * 100).toFixed(1);
    const currentDrift = ((Math.abs(u[fi]) / (NUM_FLOORS * FLOOR_HEIGHT_M)) * 100).toFixed(2);

    ctx.fillStyle = '#22d3ee';
    ctx.fillText(`Roof Δ: ${dispCm} cm`, w * 0.25, groundY - 10);

    const driftNum = parseFloat(currentDrift);
    ctx.fillStyle = driftNum > 2 ? '#fb7185' : driftNum > 1 ? '#fb923c' : '#34d399';
    ctx.fillText(`Drift: ${currentDrift}%`, w * 0.75, groundY - 10);

    ctx.fillStyle = '#a5b4fc';
    ctx.fillText(`t = ${(fi * DT).toFixed(2)}s`, w / 2, groundY + 20);

  }, []);

  // ── Mini PGA chart ───────────────────────────────────────────────────────────
  const drawPGAChart = useCallback((frameIdx: number) => {
    const canvas = pgaCanvasRef.current;
    if (!canvas || !agRef.current) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const ag = agRef.current;
    const maxAG = Math.max(...Array.from(ag).map(Math.abs)) + 0.001;

    // Axes
    ctx.strokeStyle = 'rgba(99,102,241,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Signal (past = cyan, future = dim)
    const fi = Math.min(frameIdx, ag.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(34,211,238,0.8)';
    ctx.lineWidth = 1.5;
    const step = Math.max(1, Math.floor(ag.length / w));
    for (let x = 0; x < w; x++) {
      const di = Math.min(Math.floor((x / w) * fi), ag.length - 1);
      const y = h / 2 - (ag[di] / maxAG) * (h / 2 - 4);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Cursor
    const pct = (fi / ag.length) * w;
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pct, 0); ctx.lineTo(pct, h); ctx.stroke();

    // Label
    ctx.font = '10px monospace';
    ctx.fillStyle = '#a5b4fc';
    ctx.textAlign = 'left';
    ctx.fillText(`PGA: ${(Math.abs(ag[fi]) / 9.81).toFixed(3)}g`, 4, 12);
  }, []);

  const drawDispChart = useCallback((frameIdx: number) => {
    const canvas = dispCanvasRef.current;
    if (!canvas || !uRef.current) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const u = uRef.current;
    const maxU = Math.max(...Array.from(u).map(Math.abs)) + 0.001;

    ctx.strokeStyle = 'rgba(99,102,241,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    const fi = Math.min(frameIdx, u.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(139,92,246,0.9)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < w; x++) {
      const di = Math.min(Math.floor((x / w) * fi), u.length - 1);
      const y = h / 2 - (u[di] / maxU) * (h / 2 - 4);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    const pct = (fi / u.length) * w;
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pct, 0); ctx.lineTo(pct, h); ctx.stroke();

    ctx.font = '10px monospace';
    ctx.fillStyle = '#a5b4fc';
    ctx.textAlign = 'left';
    ctx.fillText(`Δ: ${(Math.abs(u[fi]) * 100).toFixed(2)} cm`, 4, 12);
  }, []);

  // ── Animation loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    playingRef.current = isPlaying;

    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const loop = () => {
      if (!playingRef.current) return;
      frameRef.current += simSpeed;
      const fi = frameRef.current;

      drawFrame(fi);
      drawPGAChart(fi);
      drawDispChart(fi);

      if (agRef.current && fi < agRef.current.length - 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        setIsPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, simSpeed, drawFrame, drawPGAChart, drawDispChart]);

  // Draw static first frame on param change
  useEffect(() => {
    frameRef.current = 0;
    drawFrame(0);
    drawPGAChart(0);
    drawDispChart(0);
  }, [agRef.current, drawFrame, drawPGAChart, drawDispChart]);

  const soil = SOIL_TABLE[soilClass];
  const maxDrift = metrics.maxDrift;
  const driftStatus = maxDrift > 2.5 ? 'CRITICAL' : maxDrift > 1.5 ? 'WARNING' : 'SAFE';
  const driftStatusColor = maxDrift > 2.5 ? '#fb7185' : maxDrift > 1.5 ? '#fb923c' : '#34d399';

  return (
    <div className={`flex flex-col gap-0 ${className}`}>

      {/* ── Main Layout: Controls | Canvas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">

        {/* ── Controls Panel ── */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 tracking-wide uppercase">Parameters</h3>
            <p className="text-xs text-gray-500">Adjust and press Simulate</p>
          </div>

          <Slider label="Magnitude (Mw)" min={5.0} max={9.0} step={0.1} value={magnitude} unit="" format={v => v.toFixed(1)} onChange={setMagnitude} color="#fb7185" />
          <Slider label="Epicentral Distance" min={5} max={150} step={5} value={distance} unit=" km" onChange={setDistance} color="#22d3ee" />
          <Slider label="Structural Damping" min={2} max={15} step={0.5} value={damping} unit="%" onChange={setDamping} color="#8b5cf6" />
          <Slider label="Natural Period Tₙ" min={0.2} max={3.0} step={0.05} value={naturalPeriod} unit=" s" onChange={setNaturalPeriod} color="#a5b4fc" />

          {/* Soil Class */}
          <div>
            <div className="text-xs text-gray-400 font-medium mb-2">Soil Classification (EC8)</div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['A','B','C','D'] as const).map(sc => (
                <button key={sc} onClick={() => setSoilClass(sc)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${soilClass === sc ? 'opacity-100 text-white' : 'opacity-40 hover:opacity-70 text-gray-300 border-transparent'}`}
                  style={{ borderColor: soilClass === sc ? SOIL_TABLE[sc].color : undefined, background: soilClass === sc ? `${SOIL_TABLE[sc].color}22` : 'rgba(255,255,255,0.04)' }}
                >
                  {sc}
                </button>
              ))}
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: soil.color }}>{soil.label} · S={soil.S}</p>
          </div>

          {/* Speed */}
          <div>
            <div className="text-xs text-gray-400 mb-2">Playback Speed</div>
            <div className="grid grid-cols-3 gap-1">
              {[1, 3, 6].map(s => (
                <button key={s} onClick={() => setSimSpeed(s)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${simSpeed === s ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >{s}×</button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
            <button onClick={() => { runSim(); setIsPlaying(false); frameRef.current = 0; drawFrame(0); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >Regenerate</button>
            <button onClick={() => setIsPlaying(p => !p)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: isPlaying ? 'rgba(251,113,133,0.2)' : 'rgba(99,102,241,0.8)', border: `1px solid ${isPlaying ? 'rgba(251,113,133,0.4)' : 'rgba(99,102,241,0.6)'}`, boxShadow: isPlaying ? '0 0 15px rgba(251,113,133,0.3)' : '0 0 15px rgba(99,102,241,0.4)' }}
            >{isPlaying ? '⏸ Pause' : '▶ Simulate'}</button>
          </div>
        </div>

        {/* ── Canvas Panel ── */}
        <div className="flex flex-col gap-3">
          {/* Main animation canvas */}
          <div className="glass-panel rounded-xl overflow-hidden" style={{ height: '380px', position: 'relative' }}>
            <canvas ref={canvasRef} width={800} height={380}
              style={{ width: '100%', height: '100%', display: 'block' }} />

            {/* Drift status badge */}
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: `${driftStatusColor}22`, border: `1px solid ${driftStatusColor}55`, color: driftStatusColor }}>
              {driftStatus} — {maxDrift.toFixed(2)}% drift
            </div>
          </div>

          {/* ── Mini charts row ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel rounded-xl p-3">
              <div className="text-[10px] text-cyan-400 font-semibold mb-1 uppercase tracking-widest">Ground Acceleration (g)</div>
              <canvas ref={pgaCanvasRef} width={400} height={80} style={{ width: '100%', height: '80px', display: 'block' }} />
            </div>
            <div className="glass-panel rounded-xl p-3">
              <div className="text-[10px] text-purple-400 font-semibold mb-1 uppercase tracking-widest">Roof Displacement (cm)</div>
              <canvas ref={dispCanvasRef} width={400} height={80} style={{ width: '100%', height: '80px', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        {[
          { label: 'Peak Ground Accel.', value: metrics.pga.toFixed(3), unit: 'g', color: '#22d3ee' },
          { label: 'Max Roof Displacement', value: metrics.maxDisp.toFixed(1), unit: 'cm', color: '#8b5cf6' },
          { label: 'Max Story Drift', value: metrics.maxDrift.toFixed(2), unit: '%', color: driftStatusColor },
          { label: 'Code Drift Limit', value: '2.50', unit: '% (EC8)', color: '#6366f1' },
        ].map(m => (
          <div key={m.label} className="glass-panel rounded-xl p-4">
            <div className="text-2xl font-black font-mono" style={{ color: m.color }}>{m.value}<span className="text-sm font-normal ml-1 text-gray-500">{m.unit}</span></div>
            <div className="text-[10px] text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* ── Drift Ratio Legend ── */}
      <div className="mt-3 glass-panel rounded-xl p-4">
        <div className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-widest">Floor Drift Heatmap Legend</div>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: '< 0.75% — Immediate Occupancy', color: '#34d399' },
            { label: '< 1.5% — Life Safety', color: '#fbbf24' },
            { label: '< 2.5% — Collapse Prevention', color: '#fb923c' },
            { label: '> 2.5% — EXCEEDS CODE LIMIT', color: '#fb7185' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: l.color, boxShadow: `0 0 6px ${l.color}` }} />
              <span className="text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeismicVisualization;