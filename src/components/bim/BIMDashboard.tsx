'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ to, suffix = '', duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* Animated SVG donut gauge */
function Gauge({ pct, color, label, sub }: { pct: number; color: string; label: string; sub: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView({ current: ref.current?.closest('div') as HTMLElement | null }, { once: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setProgress(ease * pct);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, pct]);

  const offset = circ * (1 - progress / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            ref={ref}
            cx="40" cy="40" r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 40 40)"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-black font-mono" style={{ color }}>{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-[#FFF8EC]/70">{label}</p>
        <p className="text-[8px] text-[#99AD7A]/45">{sub}</p>
      </div>
    </div>
  );
}

const CLASHES = [
  { discipline: 'STR ↔ ARCH', count: 3,  severity: 'low',  color: '#99AD7A' },
  { discipline: 'MEP ↔ STR',  count: 12, severity: 'med',  color: '#DCCCAC' },
  { discipline: 'MEP ↔ ARCH', count: 7,  severity: 'med',  color: '#DCCCAC' },
  { discipline: 'ARCH ↔ STR', count: 0,  severity: 'none', color: '#546B41' },
];

const LOD_LEVELS = [
  { level: 'LOD 100', desc: 'Concept',     pct: 100, color: '#546B41' },
  { level: 'LOD 200', desc: 'Schematic',   pct: 100, color: '#6b8a52' },
  { level: 'LOD 300', desc: 'Developed',   pct: 87,  color: '#99AD7A' },
  { level: 'LOD 400', desc: 'Fabrication', pct: 42,  color: '#b8c99a' },
];

interface BIMDashboardProps { className?: string }

export default function BIMDashboard({ className = '' }: BIMDashboardProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  /* slight variation to make numbers feel "live" */
  const liveElements = 14230 + (tick % 3) * 7;
  const liveClashes  = 22 - (tick % 4);

  return (
    <div className={`bg-[#0f1e09] rounded-2xl overflow-hidden ${className}`} style={{ minHeight: 520 }}>

      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#546B41]/25 bg-[#1a2810]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#546B41]/60" />
          <div className="w-3 h-3 rounded-full bg-[#99AD7A]/50" />
          <div className="w-3 h-3 rounded-full bg-[#DCCCAC]/40" />
          <span className="ml-3 text-[#99AD7A]/70 text-[10px] font-mono tracking-widest uppercase">
            BIM Coordination Hub — Multi-Discipline
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#99AD7A] animate-pulse" />
          <span className="text-[#99AD7A] text-[9px] font-mono">SYNCING</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ── COL 1: Discipline gauges ── */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] font-bold text-[#99AD7A]/60 uppercase tracking-widest">Model Completeness</p>
          <div className="grid grid-cols-2 gap-4">
            <Gauge pct={88} color="#546B41" label="Structural"    sub="STR" />
            <Gauge pct={76} color="#99AD7A" label="Architectural" sub="ARCH" />
            <Gauge pct={65} color="#b8c99a" label="MEP Systems"   sub="MEP" />
            <Gauge pct={92} color="#DCCCAC" label="Site & Civil"  sub="CIV" />
          </div>
        </div>

        {/* ── COL 2: Live counters + clash table ── */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] font-bold text-[#99AD7A]/60 uppercase tracking-widest">Live Model Stats</p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'BIM Elements', to: liveElements, suffix: '', fast: true },
              { label: 'Active Clashes', to: liveClashes, suffix: '', fast: true },
              { label: 'Resolved Issues', to: 148, suffix: '+', fast: false },
              { label: 'Linked Models', to: 7, suffix: '', fast: false },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(84,107,65,0.12)', border: '1px solid rgba(153,173,122,0.15)' }}>
                <div className="text-lg font-black font-mono text-[#99AD7A]">
                  {s.fast
                    ? <motion.span key={s.to} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}>{s.to.toLocaleString()}{s.suffix}</motion.span>
                    : <CountUp to={s.to} suffix={s.suffix} />}
                </div>
                <p className="text-[8px] text-[#DCCCAC]/40 mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Clash table */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(84,107,65,0.2)' }}>
            <p className="text-[9px] font-bold text-[#99AD7A]/60 uppercase tracking-widest mb-2.5">Clash Detection</p>
            {CLASHES.map((c) => (
              <div key={c.discipline} className="flex items-center justify-between py-1.5 border-b border-[#FFF8EC]/04 last:border-0">
                <span className="text-[9px] text-[#DCCCAC]/55 font-mono">{c.discipline}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 rounded-full bg-[#FFF8EC]/06 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((c.count / 15) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                      style={{ background: c.color }}
                    />
                  </div>
                  <span className="text-[9px] font-mono w-3 text-right" style={{ color: c.color }}>{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COL 3: LOD progress + software ── */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] font-bold text-[#99AD7A]/60 uppercase tracking-widest">LOD Progression</p>

          <div className="space-y-3">
            {LOD_LEVELS.map((l) => (
              <div key={l.level}>
                <div className="flex justify-between items-center text-[9px] mb-1.5">
                  <span className="font-bold text-[#FFF8EC]/60">{l.level}</span>
                  <span className="text-[#DCCCAC]/40">{l.desc}</span>
                  <span className="font-mono" style={{ color: l.color }}>{l.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#FFF8EC]/05 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${l.pct}%` }}
                    transition={{ duration: 1.3, ease: 'easeOut', delay: 0.3 }}
                    style={{ background: `linear-gradient(90deg, ${l.color}, ${l.color}88)`,
                             boxShadow: `0 0 8px ${l.color}55` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Software grid */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(84,107,65,0.1)', border: '1px solid rgba(153,173,122,0.15)' }}>
            <p className="text-[9px] font-bold text-[#99AD7A]/60 uppercase tracking-widest mb-2.5">Software Stack</p>
            <div className="grid grid-cols-3 gap-1.5">
              {['Revit','Navisworks','AutoCAD','Civil 3D','ETABS','SAP2000','BIM 360','Recap','RealityCapture'].map(sw => (
                <div key={sw} className="rounded-lg px-1.5 py-1.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(153,173,122,0.1)' }}>
                  <p className="text-[7px] font-semibold text-[#b8c99a]/60">{sw}</p>
                </div>
              ))}
            </div>
          </div>

          {/* IFC status */}
          <div className="rounded-xl p-3 flex items-center justify-between"
            style={{ background: 'rgba(153,173,122,0.1)', border: '1px solid rgba(153,173,122,0.2)' }}>
            <div>
              <p className="text-[10px] font-bold text-[#99AD7A]">IFC 4.0 Export</p>
              <p className="text-[8px] text-[#DCCCAC]/45">Last sync: just now</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-2 h-2 rounded-full bg-[#99AD7A] animate-pulse" />
              <span className="text-[8px] text-[#99AD7A]/70 font-mono">READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
