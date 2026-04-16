'use client';
import React, { useRef, useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   BuildingModelViewer — Procedural Three.js building (no .glb required)
   Uses canvas to draw a professional isometric-style 3D building view
─────────────────────────────────────────────────────────────────────────────── */

interface BuildingModelViewerProps {
  className?: string;
  backgroundColor?: string;
  modelPath?: string; // kept for API compat, ignored
}

const FLOORS = 12;
const FLOOR_COLS = 3;
const FLOOR_ROWS = 2;

const BuildingModelViewer: React.FC<BuildingModelViewerProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [stats] = useState({ floors: FLOORS, area: 42500, height: 48 });
  const autoRotateRef = useRef(true);
  const highlightedRef = useRef<number | null>(null);

  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { highlightedRef.current = highlighted; }, [highlighted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const draw = (t: number) => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.7);
      bg.addColorStop(0, '#0d1f3c');
      bg.addColorStop(1, '#050e1f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Grid floor
      ctx.save();
      ctx.strokeStyle = 'rgba(99,102,241,0.1)';
      ctx.lineWidth = 1;
      const gridSize = 600 / 20;
      const gridN = 20;
      const cx = w/2, cy = h * 0.75;
      for (let i = -gridN/2; i <= gridN/2; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i*gridSize - gridN*gridSize/2, cy); ctx.lineTo(cx + i*gridSize, cy - gridN*gridSize*0.3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - gridN*gridSize/2 + i*gridSize, cy); ctx.lineTo(cx + i*gridSize/2 + gridN*gridSize/4, cy - gridN*gridSize*0.3/2); ctx.stroke();
      }
      ctx.restore();

      // Building dimensions
      const angle = rotationRef.current;
      const bw = 140, bd = 90, floorH = 14;
      const totalH = FLOORS * floorH;
      const bx = w/2 - bw/2, by = h * 0.68 - totalH;

      // Isometric projection
      const iso = (x: number, z: number, y: number) => {
        const cosA = Math.cos(angle), sinA = Math.sin(angle);
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        return { sx: w/2 + rx, sy: h * 0.68 - y - rz * 0.35 };
      };

      const corners = [
        { x: -bw/2, z: -bd/2 }, { x: bw/2, z: -bd/2 },
        { x: bw/2, z: bd/2 }, { x: -bw/2, z: bd/2 }
      ];

      // Draw each floor
      for (let fl = 0; fl < FLOORS; fl++) {
        const y0 = fl * floorH, y1 = (fl + 1) * floorH;
        const isHL = highlightedRef.current === fl;
        const floorColor = isHL
          ? 'rgba(34,211,238,0.9)'
          : `rgba(${99 + fl*5}, ${102}, ${241 - fl*3}, ${0.7 + fl*0.02})`;

        // Front face
        const p0 = iso(corners[0].x, corners[0].z, y0);
        const p1 = iso(corners[1].x, corners[1].z, y0);
        const p2 = iso(corners[1].x, corners[1].z, y1);
        const p3 = iso(corners[0].x, corners[0].z, y1);

        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy); ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy); ctx.lineTo(p3.sx, p3.sy);
        ctx.closePath();
        ctx.fillStyle = isHL ? 'rgba(34,211,238,0.25)' : `rgba(13,31,60,${0.7 + fl*0.01})`;
        ctx.fill();
        ctx.strokeStyle = floorColor;
        ctx.lineWidth = isHL ? 2 : 1;
        ctx.stroke();

        // Side face
        const s0 = iso(corners[1].x, corners[1].z, y0);
        const s1 = iso(corners[2].x, corners[2].z, y0);
        const s2 = iso(corners[2].x, corners[2].z, y1);
        const s3 = iso(corners[1].x, corners[1].z, y1);
        ctx.beginPath();
        ctx.moveTo(s0.sx, s0.sy); ctx.lineTo(s1.sx, s1.sy);
        ctx.lineTo(s2.sx, s2.sy); ctx.lineTo(s3.sx, s3.sy);
        ctx.closePath();
        ctx.fillStyle = isHL ? 'rgba(34,211,238,0.15)' : `rgba(5,14,31,${0.5 + fl*0.01})`;
        ctx.fill();
        ctx.strokeStyle = floorColor;
        ctx.lineWidth = isHL ? 2 : 0.8;
        ctx.stroke();

        // Windows on front face
        if (!isHL) {
          ctx.fillStyle = `rgba(165,180,252,${0.3 + fl * 0.02})`;
          for (let wx = 0; wx < 3; wx++) {
            for (let wz = 0; wz < 2; wz++) {
              const wFrac = (wx + 0.5) / 3.5;
              const wy = y0 + floorH * 0.2 + wz * floorH * 0.4;
              const wp0 = iso(corners[0].x + (corners[1].x - corners[0].x) * wFrac - 8, corners[0].z, wy + 3);
              const wp1 = iso(corners[0].x + (corners[1].x - corners[0].x) * wFrac + 8, corners[0].z, wy + 3);
              const wp2 = iso(corners[0].x + (corners[1].x - corners[0].x) * wFrac + 8, corners[0].z, wy + 8);
              const wp3 = iso(corners[0].x + (corners[1].x - corners[0].x) * wFrac - 8, corners[0].z, wy + 8);
              ctx.beginPath(); ctx.moveTo(wp0.sx, wp0.sy); ctx.lineTo(wp1.sx, wp1.sy); ctx.lineTo(wp2.sx, wp2.sy); ctx.lineTo(wp3.sx, wp3.sy); ctx.closePath(); ctx.fill();
            }
          }
        }
      }

      // Roof
      const topPts = corners.map(c => iso(c.x, c.z, FLOORS * floorH));
      ctx.beginPath();
      ctx.moveTo(topPts[0].sx, topPts[0].sy);
      topPts.forEach(p => ctx.lineTo(p.sx, p.sy));
      ctx.closePath();
      ctx.fillStyle = 'rgba(99,102,241,0.4)';
      ctx.fill();
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ground shadow
      const shadowPts = corners.map(c => iso(c.x, c.z, 0));
      ctx.beginPath();
      ctx.moveTo(shadowPts[0].sx, shadowPts[0].sy);
      shadowPts.forEach(p => ctx.lineTo(p.sx, p.sy));
      ctx.closePath();
      ctx.fillStyle = 'rgba(34,211,238,0.07)';
      ctx.fill();

      // Stats overlay
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#a5b4fc';
      ctx.fillText(`Floors: ${FLOORS}`, 16, 24);
      ctx.fillText(`Height: ${stats.height}m`, 16, 40);
      ctx.fillText(`Area: ${stats.area.toLocaleString()}m²`, 16, 56);

      if (autoRotateRef.current) rotationRef.current += 0.006;
      animRef.current = requestAnimationFrame(() => draw(performance.now()));
    };

    animRef.current = requestAnimationFrame(() => draw(performance.now()));
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const FLOOR_LABELS = ['Foundation', 'Basement', 'Ground Fl', ...Array.from({ length: FLOORS - 3 }, (_, i) => `Floor ${i + 1}`)];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
        {/* Canvas */}
        <div className="glass-panel rounded-xl overflow-hidden relative" style={{ height: '420px' }}>
          <canvas ref={canvasRef} width={800} height={420} style={{ width: '100%', height: '100%', display: 'block' }} />
          {/* Controls */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button onClick={() => setAutoRotate(p => !p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{ background: autoRotate ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)', borderColor: autoRotate ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)', color: autoRotate ? '#a5b4fc' : '#6b7280' }}
            >{autoRotate ? '⏸ Pause' : '▶ Rotate'}</button>
            <button onClick={() => { rotationRef.current = 0; }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
            >Reset</button>
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
            Drag to rotate
          </div>
        </div>

        {/* Floor list */}
        <div className="glass-panel rounded-xl p-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
          <div className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Floor Map</div>
          <div className="space-y-1">
            {FLOOR_LABELS.slice().reverse().map((label, i) => {
              const floorIdx = FLOORS - 1 - i;
              const isHL = highlighted === floorIdx;
              return (
                <button key={floorIdx}
                  onMouseEnter={() => setHighlighted(floorIdx)}
                  onMouseLeave={() => setHighlighted(null)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition-all"
                  style={{ background: isHL ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isHL ? 'rgba(34,211,238,0.3)' : 'transparent'}` }}
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black flex-shrink-0"
                    style={{ background: `rgba(99,102,241,${0.2 + floorIdx * 0.05})`, color: isHL ? '#22d3ee' : '#a5b4fc' }}
                  >{floorIdx}</div>
                  <span style={{ color: isHL ? '#22d3ee' : '#6b7280' }}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Structural System', value: 'RC Frame', color: '#a5b4fc' },
          { label: 'Foundation Type', value: 'Deep Pile', color: '#22d3ee' },
          { label: 'Seismic Zone', value: 'Zone III', color: '#34d399' },
        ].map(m => (
          <div key={m.label} className="glass-panel rounded-xl p-4 text-center">
            <div className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[10px] text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildingModelViewer;