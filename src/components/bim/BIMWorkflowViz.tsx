'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── animated counter ── */
function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
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

/* ── pipeline stages ── */
const STAGES = [
  { label: 'Source Files',    sub: 'Revit · IFC · Excel',      color: '#546B41', symbol: 'S' },
  { label: 'pyRevit Engine',  sub: 'Python · Revit API',        color: '#6b8a52', symbol: 'P' },
  { label: 'Automation Core', sub: '60+ deployed scripts',      color: '#99AD7A', symbol: 'A' },
  { label: 'QA / Clash',      sub: 'Navisworks · Validation',   color: '#b8c99a', symbol: 'Q' },
  { label: 'Deliverables',    sub: 'IFC · Reports · BIM 360',   color: '#DCCCAC', symbol: 'D' },
];

const METRICS = [
  { label: 'Scripts Deployed',   to: 7,    suffix: '+' },
  { label: 'Workflow Reduction',  to: 80,   suffix: '%' },
  { label: 'Elements Automated', to: 5000, suffix: '+' },
  { label: 'Disciplines Covered',to: 4,    suffix: '' },
];

const LOGS = [
  '✓  IFC export pipeline — 847 elements processed',
  '✓  Structural frame generated — B2, B3 levels',
  '⟳  Clash detection running — 3 active models',
  '✓  Schedule QA passed — 0 conflicts found',
  '✓  prezzario mapping — 312 items matched',
  '⟳  4D timeline update — processing...',
  '✓  Foundation drawings auto-annotated',
  '✓  MEP routing script — zone C complete',
];

interface BIMWorkflowVizProps { className?: string }

export default function BIMWorkflowViz({ className = '' }: BIMWorkflowVizProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [logIndex, setLogIndex] = useState(4);
  const [particle, setParticle] = useState(0); // 0-100 along pipeline

  /* advance active stage highlight */
  useEffect(() => {
    const t = setInterval(() => setActiveStage(s => (s + 1) % STAGES.length), 1600);
    return () => clearInterval(t);
  }, []);

  /* advance log */
  useEffect(() => {
    const t = setInterval(() => setLogIndex(i => (i + 1) % LOGS.length), 2200);
    return () => clearInterval(t);
  }, []);

  /* particle position */
  useEffect(() => {
    let raf: number;
    let start = performance.now();
    const PERIOD = 2400;
    const tick = (now: number) => {
      const pct = ((now - start) % PERIOD) / PERIOD;
      setParticle(Math.round(pct * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const particleStageIdx = Math.floor((particle / 100) * (STAGES.length - 1));

  return (
    <div className={`bg-[#0f1e09] rounded-2xl overflow-hidden ${className}`} style={{ minHeight: 520 }}>

      {/* ── header bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#546B41]/25 bg-[#1a2810]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#546B41]/60" />
          <div className="w-3 h-3 rounded-full bg-[#99AD7A]/50" />
          <div className="w-3 h-3 rounded-full bg-[#DCCCAC]/40" />
          <span className="ml-3 text-[#99AD7A]/70 text-[10px] font-mono tracking-widest uppercase">
            BIM Automation Pipeline — CME Lazio
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#99AD7A] animate-pulse" />
          <span className="text-[#99AD7A] text-[9px] font-mono">LIVE</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

        {/* ── LEFT: pipeline ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Stage nodes */}
          <div className="flex items-center gap-0">
            {STAGES.map((stage, i) => {
              const isActive = activeStage === i;
              const isParticle = particleStageIdx === i;
              return (
                <React.Fragment key={stage.label}>
                  <motion.div
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 min-w-0"
                  >
                    <div
                      className="rounded-xl p-3 text-center transition-all duration-300 cursor-default"
                      style={{
                        background: isActive
                          ? `${stage.color}22`
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isActive ? stage.color + '55' : 'rgba(153,173,122,0.12)'}`,
                      }}
                    >
                      {/* Symbol circle */}
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-black transition-all duration-300"
                        style={{
                          background: isActive ? stage.color : 'rgba(153,173,122,0.1)',
                          color: isActive ? '#0f1e09' : stage.color,
                          boxShadow: isActive ? `0 0 16px ${stage.color}66` : 'none',
                        }}
                      >
                        {stage.symbol}
                      </div>
                      <p className="text-[9px] font-bold text-[#FFF8EC]/70 truncate">{stage.label}</p>
                      <p className="text-[8px] text-[#99AD7A]/45 truncate mt-0.5">{stage.sub}</p>

                      {/* Particle dot */}
                      {isParticle && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#99AD7A] mx-auto mt-1.5"
                          style={{ boxShadow: '0 0 6px #99AD7A' }}
                        />
                      )}
                    </div>
                  </motion.div>
                  {i < STAGES.length - 1 && (
                    <div className="flex-shrink-0 w-4 flex items-center justify-center">
                      <div className="h-px w-full bg-gradient-to-r from-[#546B41]/50 to-[#99AD7A]/30" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(84,107,65,0.12)', border: '1px solid rgba(153,173,122,0.15)' }}
              >
                <div className="text-xl font-black font-mono text-[#99AD7A]">
                  <CountUp to={m.to} suffix={m.suffix} duration={1600 + i * 200} />
                </div>
                <div className="text-[8px] text-[#DCCCAC]/45 mt-0.5 uppercase tracking-wide leading-tight">{m.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Discipline coverage bars */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(84,107,65,0.08)', border: '1px solid rgba(153,173,122,0.12)' }}>
            <p className="text-[10px] font-bold text-[#99AD7A]/70 uppercase tracking-widest mb-3">Discipline Automation Coverage</p>
            {[
              { name: 'Structural',     pct: 88, color: '#546B41' },
              { name: 'Architectural',  pct: 76, color: '#99AD7A' },
              { name: 'MEP Systems',    pct: 65, color: '#b8c99a' },
              { name: 'Documentation', pct: 92, color: '#DCCCAC' },
            ].map((d) => (
              <div key={d.name} className="mb-2">
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="text-[#DCCCAC]/60">{d.name}</span>
                  <span className="font-mono" style={{ color: d.color }}>{d.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#FFF8EC]/06 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: automation log ── */}
        <div className="flex flex-col gap-4">
          <div
            className="flex-1 rounded-xl p-4 font-mono"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(84,107,65,0.2)' }}
          >
            <p className="text-[9px] text-[#99AD7A]/60 uppercase tracking-widest mb-3">Automation Log</p>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => {
                const idx = (logIndex + i) % LOGS.length;
                const isLatest = i === 5;
                return (
                  <motion.p
                    key={`${logIndex}-${i}`}
                    initial={isLatest ? { opacity: 0, x: -8 } : {}}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[9px] leading-relaxed"
                    style={{ color: isLatest ? '#99AD7A' : `rgba(184,201,154,${0.25 + i * 0.1})` }}
                  >
                    {LOGS[idx]}
                  </motion.p>
                );
              })}
              <p className="text-[9px] text-[#99AD7A]/50">
                <span className="animate-pulse">█</span>
              </p>
            </div>
          </div>

          {/* Tech stack pills */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(84,107,65,0.1)', border: '1px solid rgba(153,173,122,0.15)' }}>
            <p className="text-[9px] text-[#99AD7A]/60 uppercase tracking-widest mb-2.5">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {['Python','Revit API','pyRevit','IFC','Navisworks','BIM 360','COM Server','AutoCAD API'].map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-[8px] font-semibold"
                  style={{ background: 'rgba(153,173,122,0.12)', border: '1px solid rgba(153,173,122,0.22)', color: '#b8c99a' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
