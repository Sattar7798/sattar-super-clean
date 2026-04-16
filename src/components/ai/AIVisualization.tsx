'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   AI VISUALIZATION — Dark glass neural network + structural risk panel
─────────────────────────────────────────────────────────────────────────────── */

interface AIVisualizationProps { className?: string; }

// ── Structural features ───────────────────────────────────────────────────────
const FEATURES = [
  { name: 'Foundation Integrity', score: 0.95, status: 'safe' as const },
  { name: 'Beam-Column Joints', score: 0.72, status: 'warning' as const },
  { name: 'Lateral Resistance', score: 0.88, status: 'safe' as const },
  { name: 'Floor Diaphragm', score: 0.93, status: 'safe' as const },
  { name: 'Steel Reinforcement', score: 0.58, status: 'critical' as const },
  { name: 'Ductility Demand', score: 0.79, status: 'warning' as const },
  { name: 'Shear Wall Capacity', score: 0.91, status: 'safe' as const },
  { name: 'Connection Details', score: 0.64, status: 'critical' as const },
  { name: 'Foundation Depth', score: 0.97, status: 'safe' as const },
];

const STATUS_STYLES = {
  safe:     { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
  warning:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
  critical: { color: '#fb7185', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.25)' },
};

// ── Neural network layer definitions ─────────────────────────────────────────
const LAYERS = [4, 6, 8, 6, 3]; // nodes per layer

// ── Time-series response data ─────────────────────────────────────────────────
const ACTUAL_DATA = [0, 4.2, 11, 19.8, 22.1, 17.3, 10.5, 3.1, -5.2, -10.1, -7.4, -3.1, 1.2, 4.8, 3.5, 1.1, -0.8, -1.5, -0.6, 0, 0.3, 0.1, 0];
const PREDICT_DATA = [0, 3.8, 10.2, 20.5, 23.0, 18.1, 11.2, 3.9, -4.8, -9.5, -7.0, -2.8, 1.4, 5.1, 3.9, 1.3, -0.5, -1.3, -0.5, 0.2, 0.4, 0.2, 0];

const AIVisualization: React.FC<AIVisualizationProps> = ({ className = '' }) => {
  const [activePulse, setActivePulse] = useState(0);
  const [smoothing, setSmoothing] = useState(60);
  const [confidence, setConfidence] = useState(88);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [modelType, setModelType] = useState<'displacement'|'stress'|'seismic'|'vibration'>('seismic');
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const nnCanvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate neural network pulses
  useEffect(() => {
    pulseRef.current = setInterval(() => {
      setActivePulse(p => (p + 1) % (LAYERS.length + 2));
    }, 300);
    return () => { if (pulseRef.current) clearInterval(pulseRef.current); };
  }, []);

  // ── Draw Neural Network ─────────────────────────────────────────────────────
  const drawNN = useCallback(() => {
    const canvas = nnCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const layerXs = LAYERS.map((_, i) => (i + 1) * w / (LAYERS.length + 1));

    // Draw connections
    LAYERS.forEach((nodeCount, li) => {
      if (li === LAYERS.length - 1) return;
      const nextCount = LAYERS[li + 1];
      const x1 = layerXs[li], x2 = layerXs[li + 1];
      for (let ni = 0; ni < nodeCount; ni++) {
        const y1 = (ni + 1) * h / (nodeCount + 1);
        for (let nj = 0; nj < nextCount; nj++) {
          const y2 = (nj + 1) * h / (nextCount + 1);
          const isActive = li === activePulse - 1;
          const alpha = isActive ? 0.55 : 0.08;
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, `rgba(99,102,241,${alpha})`);
          grad.addColorStop(1, `rgba(34,211,238,${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = isActive ? 1.5 : 0.7;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
      }
    });

    // Draw nodes
    LAYERS.forEach((nodeCount, li) => {
      const x = layerXs[li];
      for (let ni = 0; ni < nodeCount; ni++) {
        const y = (ni + 1) * h / (nodeCount + 1);
        const isActive = li === activePulse;
        const r = isActive ? 7 : 5;
        const baseColor = li === 0 ? '#22d3ee' : li === LAYERS.length - 1 ? '#34d399' : '#a5b4fc';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? baseColor : `${baseColor}55`;
        if (isActive) { ctx.shadowBlur = 14; ctx.shadowColor = baseColor; }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  }, [activePulse]);

  useEffect(() => { drawNN(); }, [drawNN]);

  // ── Draw Time-Series Chart ──────────────────────────────────────────────────
  const drawChart = useCallback(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const tension = smoothing / 100;
    const band = (confidence / 100) * 6;
    const maxVal = 26;

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * (h - 30) + 15;
      ctx.strokeStyle = 'rgba(99,102,241,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(w - 10, y); ctx.stroke();
    }

    const toX = (i: number) => 30 + (i / (ACTUAL_DATA.length - 1)) * (w - 40);
    const toY = (v: number) => h/2 - 15 - (v / maxVal) * (h/2 - 20);

    // Confidence band
    ctx.beginPath();
    PREDICT_DATA.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v + band)) : ctx.lineTo(toX(i), toY(v + band)));
    PREDICT_DATA.slice().reverse().forEach((v, i) => ctx.lineTo(toX(PREDICT_DATA.length - 1 - i), toY(v - band)));
    ctx.closePath();
    ctx.fillStyle = 'rgba(251,113,133,0.07)';
    ctx.fill();

    // Actual line
    ctx.beginPath();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ACTUAL_DATA.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
    ctx.stroke();

    // Prediction line (dashed)
    ctx.beginPath();
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    PREDICT_DATA.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
    ctx.stroke();
    ctx.setLineDash([]);

    // Zero line
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(30, toY(0)); ctx.lineTo(w - 10, toY(0)); ctx.stroke();

    // Legend
    ctx.font = '10px monospace';
    ctx.fillStyle = '#22d3ee';
    ctx.fillText('Actual Response', 35, 14);
    ctx.fillStyle = '#fb7185';
    ctx.fillText('AI Prediction', 35 + 110, 14);
  }, [smoothing, confidence]);

  useEffect(() => { drawChart(); }, [drawChart]);

  const overallScore = Math.round(FEATURES.reduce((a, f) => a + f.score, 0) / FEATURES.length * 100);
  const criticalCount = FEATURES.filter(f => f.status === 'critical').length;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>

      {/* ── Header row ── */}
      <div className="flex flex-wrap items-center gap-3">
        {(['displacement','stress','seismic','vibration'] as const).map(t => (
          <button key={t} onClick={() => setModelType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${modelType === t ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300' : 'border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'}`}
          >{t} Analysis</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">Model Online</span>
        </div>
      </div>

      {/* ── 3-panel grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Panel 1: Structural Risk Heatmap */}
        <div className="glass-panel rounded-xl p-4">
          <div className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Risk Heatmap</div>
          <div className="grid grid-cols-3 gap-2">
            {FEATURES.map((f, i) => {
              const st = STATUS_STYLES[f.status];
              const isSelected = selectedFeature === i;
              return (
                <button key={i} onClick={() => setSelectedFeature(isSelected ? null : i)}
                  className="p-2 rounded-xl text-center transition-all cursor-pointer"
                  style={{ background: isSelected ? st.bg : 'rgba(255,255,255,0.03)', border: `1px solid ${isSelected ? st.color : st.border}`, boxShadow: isSelected ? `0 0 12px ${st.color}40` : 'none' }}
                >
                  <div className="text-[9px] text-gray-400 leading-tight mb-1">{f.name}</div>
                  <div className="text-sm font-black font-mono" style={{ color: st.color }}>{Math.round(f.score * 100)}%</div>
                </button>
              );
            })}
          </div>

          {/* Selected feature detail */}
          <AnimatePresence>
            {selectedFeature !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-xl overflow-hidden"
                style={{ background: STATUS_STYLES[FEATURES[selectedFeature].status].bg, border: `1px solid ${STATUS_STYLES[FEATURES[selectedFeature].status].border}` }}
              >
                <div className="text-xs font-bold mb-1" style={{ color: STATUS_STYLES[FEATURES[selectedFeature].status].color }}>
                  {FEATURES[selectedFeature].name}
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${FEATURES[selectedFeature].score * 100}%`, background: STATUS_STYLES[FEATURES[selectedFeature].status].color }} />
                </div>
                <div className="text-[10px] text-gray-500 mt-1.5">
                  {FEATURES[selectedFeature].status === 'safe' ? '✓ Within expected parameters.' : FEATURES[selectedFeature].status === 'warning' ? '⚠ Requires monitoring.' : '✕ Critical — immediate action needed.'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary */}
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
            <div>
              <div className="text-lg font-black font-mono text-white">{overallScore}<span className="text-xs text-gray-500 ml-1">/ 100</span></div>
              <div className="text-[10px] text-gray-500">Structural Score</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black font-mono" style={{ color: criticalCount > 1 ? '#fb7185' : '#fbbf24' }}>{criticalCount}</div>
              <div className="text-[10px] text-gray-500">Critical Issues</div>
            </div>
          </div>
        </div>

        {/* Panel 2: Neural Network */}
        <div className="glass-panel rounded-xl p-4">
          <div className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Neural Network</div>
          <canvas ref={nnCanvasRef} width={340} height={220} style={{ width: '100%', height: '220px', display: 'block' }} />

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Layers', value: LAYERS.length },
              { label: 'Parameters', value: '18.4K' },
              { label: 'Accuracy', value: `${confidence}%` },
            ].map(s => (
              <div key={s.label} className="rounded-lg py-2" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="text-sm font-black text-indigo-300 font-mono">{s.value}</div>
                <div className="text-[9px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Smoothing</span><span className="text-indigo-300 font-mono">{smoothing}%</span>
              </div>
              <input type="range" min={0} max={100} value={smoothing} onChange={e => setSmoothing(Number(e.target.value))}
                className="w-full" style={{ background: `linear-gradient(to right, #6366f1 ${smoothing}%, rgba(99,102,241,0.2) 0%)` }} />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Confidence Band</span><span className="text-cyan-300 font-mono">{confidence}%</span>
              </div>
              <input type="range" min={50} max={99} value={confidence} onChange={e => setConfidence(Number(e.target.value))}
                className="w-full" style={{ background: `linear-gradient(to right, #22d3ee ${((confidence - 50)/49)*100}%, rgba(34,211,238,0.2) 0%)` }} />
            </div>
          </div>
        </div>

        {/* Panel 3: Time Series */}
        <div className="glass-panel rounded-xl p-4">
          <div className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Response Prediction</div>
          <canvas ref={chartCanvasRef} width={340} height={220} style={{ width: '100%', height: '220px', display: 'block' }} />

          <div className="mt-3 space-y-2">
            {[
              { label: 'MAE', value: (1.83 * (1 - smoothing / 200)).toFixed(2), unit: 'mm', color: '#34d399' },
              { label: 'R² Score', value: (0.85 + confidence / 1000).toFixed(3), unit: '', color: '#22d3ee' },
              { label: 'Max Predicted Δ', value: '23.0', unit: 'mm', color: '#fb7185' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center py-1.5 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-[10px] text-gray-400">{m.label}</span>
                <span className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}<span className="text-[10px] text-gray-500 ml-1">{m.unit}</span></span>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl text-[10px] text-gray-400 leading-relaxed"
            style={{ background: 'rgba(251,113,133,0.07)', border: '1px solid rgba(251,113,133,0.12)' }}>
            <span className="text-rose-400 font-semibold">AI Insight: </span>
            The {modelType} model predicts potential resonance effects at higher floors. Recommend increasing damping or installing tuned mass dampers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVisualization;