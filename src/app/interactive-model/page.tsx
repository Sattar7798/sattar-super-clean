'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/LayoutFix';
import SeismicVisualization from '@/components/3d/SeismicVisualization';
import BIMWorkflowViz from '@/components/bim/BIMWorkflowViz';
import BIMDashboard from '@/components/bim/BIMDashboard';
import DotField from '@/components/animations/DotField';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type VisualizationTab = 'building' | 'seismic' | 'ai';

const tabs = [
  {
    id: 'building' as VisualizationTab,
    label: 'BIM Workflow',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    color: 'forest',
    badge: 'Live',
  },
  {
    id: 'seismic' as VisualizationTab,
    label: 'Seismic Sim',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'sage',
    badge: 'Physics',
  },
  {
    id: 'ai' as VisualizationTab,
    label: 'Coordination',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    color: 'beige',
    badge: 'BIM',
  },
];

const colorMap: Record<string, string> = {
  forest: 'border-[#546B41] text-[#99AD7A] bg-[#546B41]/18',
  sage:   'border-[#99AD7A] text-[#b8c99a] bg-[#99AD7A]/14',
  beige:  'border-[#DCCCAC] text-[#DCCCAC] bg-[#DCCCAC]/14',
};
const inactiveClass = 'border-transparent text-[#DCCCAC]/50 hover:text-[#DCCCAC]/80 hover:border-[#99AD7A]/20 bg-transparent';

const stats = [
  { label: 'BIM Scripts',      value: '7+',    unit: 'deployed',   color: 'text-[#99AD7A]' },
  { label: 'Workflow Saved',   value: '80%',   unit: 'time cut',   color: 'text-[#b8c99a]' },
  { label: 'Peak Ground Acc.', value: '0.32g', unit: 'PGA',        color: 'text-[#DCCCAC]' },
  { label: 'Story Drift',      value: '2.50%', unit: 'EC8 limit',  color: 'text-[#beaf8e]' },
];

export default function InteractiveModelPage() {
  const [activeTab, setActiveTab] = useState<VisualizationTab>('building');

  return (
    <Layout>
      {/* ══════════ Hero Banner ══════════ */}
      <section className="relative bg-[#1e2d14] text-[#FFF8EC] pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <DotField
            gradientFrom="rgba(84, 107, 65, 0.5)"
            gradientTo="rgba(153, 173, 122, 0.3)"
            glowColor="#1e2d14"
            dotSpacing={18}
            dotRadius={1.2}
          />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="im-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFF8EC" strokeWidth="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#im-grid)" />
          </svg>
        </div>

        <div className="absolute top-0 left-1/3 w-[30rem] h-[18rem] bg-[#546B41]/22 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[20rem] h-[14rem] bg-[#99AD7A]/12 rounded-full blur-[90px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1 mb-6 rounded-full border border-[#99AD7A]/30 bg-[#99AD7A]/12 text-[#99AD7A] text-xs font-semibold tracking-widest uppercase">
              Interactive Lab
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-[#FFF8EC]">
              Structural{' '}
              <span className="text-gradient-nature">Interaction Lab</span>
            </h1>
            <p className="text-lg text-[#DCCCAC]/65 max-w-2xl">
              Explore interactive building studies, seismic response simulations,
              and AI-assisted structural analysis in a single experimental workspace.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map(s => (
              <div key={s.label} className="glass-panel-dark rounded-xl px-5 py-4 flex flex-col">
                <span className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</span>
                <span className="text-xs text-[#DCCCAC]/45 mt-1">{s.unit} — {s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ Tab Navigation + Content ══════════ */}
      <section className="py-12 bg-[#1e2d14] min-h-screen">
        <div className="container mx-auto px-6">

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mb-8 p-1.5 glass-panel-dark rounded-2xl w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  activeTab === tab.id ? colorMap[tab.color] : inactiveClass
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#99AD7A]/20 text-[#99AD7A] border border-[#99AD7A]/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── BIM Workflow ── */}
              {activeTab === 'building' && (
                <div className="glass-panel-dark rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-[#546B41]/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#546B41]/25 flex items-center justify-center text-[#99AD7A]">
                        {tabs[0].icon}
                      </div>
                      <h2 className="text-xl font-bold text-[#FFF8EC]">BIM Automation Pipeline</h2>
                    </div>
                    <p className="text-[#DCCCAC]/60 text-sm">
                      Live view of the pyRevit-based automation suite built for CME Lazio — from Revit source files
                      through Python scripting, clash detection, and final IFC/documentation delivery.
                    </p>
                  </div>
                  <div className="p-6">
                    <BIMWorkflowViz className="rounded-xl" />
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'pyRevit Scripting', desc: '60+ Python scripts automating structural generation, IFC export, annotation, and scheduling tasks inside Revit.' },
                        { title: 'Multi-Discipline', desc: 'Covers Structural, Architectural, MEP, and documentation workflows — reducing 5–7 day processes to under one day.' },
                        { title: 'IFC & BIM 360', desc: 'Automated IFC 4.0 export pipelines with custom schema mapping, linked directly to BIM 360 cloud collaboration.' },
                      ].map(item => (
                        <div key={item.title} className="p-4 rounded-xl bg-[#546B41]/12 border border-[#546B41]/22">
                          <h4 className="font-semibold text-[#99AD7A] text-sm mb-1.5">{item.title}</h4>
                          <p className="text-[#DCCCAC]/55 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Seismic Simulation ── */}
              {activeTab === 'seismic' && (
                <div className="glass-panel-dark rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-[#99AD7A]/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#99AD7A]/18 flex items-center justify-center text-[#99AD7A]">
                        {tabs[1].icon}
                      </div>
                      <h2 className="text-xl font-bold text-[#FFF8EC]">Seismic Response Simulation</h2>
                    </div>
                    <p className="text-[#DCCCAC]/60 text-sm">
                      Visualize drift, displacement, and ground acceleration under different earthquake
                      scenarios by adjusting magnitude, damping, distance, and soil class.
                    </p>
                  </div>
                  <div className="p-6">
                    <SeismicVisualization initialIntensity={0.3} className="rounded-xl" />
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'Ground Acceleration', desc: 'Tracks the intensity of shaking over time and highlights peak demand on the structure.' },
                        { title: 'Drift Response', desc: 'Shows how story drift evolves relative to code-oriented thresholds and warning ranges.' },
                        { title: 'Roof Displacement', desc: 'Summarizes lateral movement so structural response is readable at a glance.' },
                      ].map(item => (
                        <div key={item.title} className="p-4 rounded-xl bg-[#99AD7A]/10 border border-[#99AD7A]/20">
                          <h4 className="font-semibold text-[#99AD7A] text-sm mb-1.5">{item.title}</h4>
                          <p className="text-[#DCCCAC]/55 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── BIM Coordination ── */}
              {activeTab === 'ai' && (
                <div className="glass-panel-dark rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-[#DCCCAC]/15">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#DCCCAC]/12 flex items-center justify-center text-[#DCCCAC]">
                        {tabs[2].icon}
                      </div>
                      <h2 className="text-xl font-bold text-[#FFF8EC]">BIM Coordination Hub</h2>
                    </div>
                    <p className="text-[#DCCCAC]/60 text-sm">
                      Multi-discipline BIM coordination dashboard — real-time model completeness gauges,
                      clash detection matrix, LOD progression, and live element statistics.
                    </p>
                  </div>
                  <div className="p-6">
                    <BIMDashboard className="rounded-xl" />
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'Clash Detection', desc: 'Cross-discipline clash matrix between Structural, Architectural, and MEP models using Navisworks automated workflows.' },
                        { title: 'LOD Management', desc: 'Track Level of Development from LOD 100 concept through LOD 400 fabrication-ready models per discipline.' },
                        { title: 'IFC Coordination', desc: 'Open BIM approach with automated IFC 4.0 export, schema validation, and BIM 360 synchronization for all stakeholders.' },
                      ].map(item => (
                        <div key={item.title} className="p-4 rounded-xl bg-[#DCCCAC]/06 border border-[#DCCCAC]/12">
                          <h4 className="font-semibold text-[#DCCCAC] text-sm mb-1.5">{item.title}</h4>
                          <p className="text-[#DCCCAC]/50 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-20 bg-[#2d3d24] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38rem] h-[18rem] bg-[#546B41]/25 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel-dark rounded-3xl p-14 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#FFF8EC]">Want to Learn More?</h2>
            <p className="text-base mb-10 text-[#DCCCAC]/65">
              Discover how these advanced visualization techniques are applied in real-world research to improve building safety and resilience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/research"
                className="px-8 py-4 bg-[#99AD7A] text-[#1e2d14] rounded-xl font-bold shadow-[0_0_22px_rgba(153,173,122,0.35)] hover:shadow-[0_0_38px_rgba(153,173,122,0.55)] hover:bg-[#b8c99a] hover:-translate-y-1 transition-all duration-300"
              >
                Research Projects
              </Link>
              <Link
                href="/publications"
                className="px-8 py-4 bg-transparent border border-[#99AD7A]/25 rounded-xl font-semibold text-[#DCCCAC] hover:bg-[#546B41]/25 hover:border-[#99AD7A]/45 hover:-translate-y-1 transition-all duration-300"
              >
                View Publications
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
