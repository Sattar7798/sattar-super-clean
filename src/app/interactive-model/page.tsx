'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/LayoutFix';
import BuildingModelViewer from '@/components/3d/BuildingModelViewer';
import SeismicVisualization from '@/components/3d/SeismicVisualization';

import AIVisualization from '@/components/ai/AIVisualization';
import DotField from '@/components/animations/DotField';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type VisualizationTab = 'building' | 'seismic' | 'ai';

const tabs = [
  {
    id: 'building' as VisualizationTab,
    label: '3D Building',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'violet',
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
    color: 'cyan',
    badge: 'Physics',
  },

  {
    id: 'ai' as VisualizationTab,
    label: 'AI Analysis',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'emerald',
    badge: 'AI',
  },
];

const colorMap: Record<string, string> = {
  violet: 'border-violet-500 text-violet-300 bg-violet-500/10',
  cyan: 'border-cyan-500 text-cyan-300 bg-cyan-500/10',
  rose: 'border-rose-500 text-rose-300 bg-rose-500/10',
  emerald: 'border-emerald-500 text-emerald-300 bg-emerald-500/10',
};

const inactiveClass = 'border-transparent text-gray-400 hover:text-gray-200 hover:border-white/20 bg-transparent';

const stats = [
  { label: 'Peak Ground Acc.', value: '0.32g', unit: 'PGA', color: 'text-violet-400' },
  { label: 'Story Drift Limit', value: '2.50%', unit: 'EC8', color: 'text-cyan-400' },
  { label: 'AI Confidence', value: '94.2%', unit: 'score', color: 'text-emerald-400' },
  { label: 'Roof Displacement', value: '42.7cm', unit: 'max delta', color: 'text-rose-400' },
];

export default function InteractiveModelPage() {
  const [activeTab, setActiveTab] = useState<VisualizationTab>('building');

  return (
    <Layout>
      {/* ══════════ Hero Banner ══════════ */}
      <section className="relative bg-[#0d0618] text-white pt-24 pb-20 overflow-hidden">
        {/* DotField background */}
        <div className="absolute inset-0 w-full h-full">
          <DotField
            gradientFrom="rgba(124, 58, 237, 0.35)"
            gradientTo="rgba(6, 182, 212, 0.2)"
            glowColor="#0d0618"
            dotSpacing={18}
            dotRadius={1.2}
          />
        </div>
        {/* Soft ambient glow */}
        <div className="absolute top-0 left-1/3 w-[30rem] h-[20rem] bg-violet-700/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[20rem] h-[15rem] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1 mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium tracking-widest uppercase">
              Interactive Lab
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-5 tracking-tight">
              Structural{' '}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Interaction Lab
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Explore interactive building studies, seismic response simulations,
              and AI-assisted structural analysis in a single experimental workspace.
            </p>
          </motion.div>

          {/* Live Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-panel rounded-xl px-5 py-4 flex flex-col"
              >
                <span className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-500 mt-1">{s.unit} — {s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ Tab Navigation + Content ══════════ */}
      <section className="py-12 bg-[#0d0618] min-h-screen">
        <div className="container mx-auto px-6">
          {/* Pill Tab Bar */}
          <div className="flex flex-wrap gap-3 mb-8 p-1.5 glass-panel rounded-2xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  activeTab === tab.id ? colorMap[tab.color] : inactiveClass
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* ── 3D Building Model ── */}
              {activeTab === 'building' && (
                <div className="glass-panel rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-violet-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                        {tabs[0].icon}
                      </div>
                      <h2 className="text-2xl font-bold text-white">Interactive 3D Building Model</h2>
                    </div>
                    <p className="text-gray-400">
                      Review a conceptual building model with floor-by-floor highlighting, geometry metrics,
                      and a clean visual summary of the structural system.
                    </p>
                  </div>
                  <div className="p-6">
                    <BuildingModelViewer
                      backgroundColor="#0d0618"
                      className="rounded-xl"
                      modelPath="/models/building.glb"
                    />
                    <div className="mt-6 p-5 rounded-xl bg-violet-950/30 border border-violet-500/10 text-gray-400 text-sm leading-relaxed">
                      <h3 className="text-base font-semibold text-violet-300 mb-2">About This Model</h3>
                      <p>
                        This concept model summarizes a reinforced concrete frame with a simplified floor map,
                        envelope geometry, and structural indicators intended for presentation and rapid review.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Seismic Simulation ── */}
              {activeTab === 'seismic' && (
                <div className="glass-panel rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        {tabs[1].icon}
                      </div>
                      <h2 className="text-2xl font-bold text-white">Seismic Response Simulation</h2>
                    </div>
                    <p className="text-gray-400">
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
                      ].map((item) => (
                        <div key={item.title} className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/10">
                          <h4 className="font-semibold text-cyan-300 mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}



              {/* ── AI Analysis ── */}
              {activeTab === 'ai' && (
                <div className="glass-panel rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-emerald-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        {tabs[2].icon}
                      </div>
                      <h2 className="text-2xl font-bold text-white">AI-Powered Structural Analysis</h2>
                    </div>
                    <p className="text-gray-400">
                      Explore how AI can classify structural performance, interpret engineering signals,
                      and support design decisions for resilience-focused workflows.
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="rounded-xl overflow-hidden border border-emerald-500/10 bg-[#0a0f1c]">
                      <AIVisualization className="rounded-xl" />
                    </div>
                    <div className="mt-6 p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/10">
                      <h3 className="font-semibold text-emerald-300 mb-2">The Future of Structural Engineering</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        AI-assisted analysis can accelerate engineering review, expose patterns in complex
                        response data, and support faster, more informed decisions in BIM and structural workflows.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════ Call to Action ══════════ */}
      <section className="py-20 bg-[#0a0618] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-violet-800/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel rounded-3xl p-14 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Want to Learn More?</h2>
            <p className="text-lg mb-10 text-gray-400">
              Discover how these advanced visualization techniques are applied in real-world research to improve building safety and resilience.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/research"
                className="px-8 py-4 bg-violet-600 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] hover:bg-violet-500 hover:-translate-y-1 transition-all duration-300"
              >
                Research Projects
              </Link>
              <Link
                href="/publications"
                className="px-8 py-4 bg-transparent border border-violet-500/20 rounded-xl font-semibold text-white hover:bg-violet-950/30 hover:border-violet-400/40 hover:-translate-y-1 transition-all duration-300"
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
