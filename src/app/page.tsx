'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

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
  return <span ref={ref}>{val}{suffix}</span>;
}
import Layout from '@/components/layout/LayoutFix';
import BuildingAnimation from '@/components/animations/BuildingAnimation';
import DotField from '@/components/animations/DotField';
import Link from 'next/link';
import SeismicVisualizationPromo from '@/components/sections/SeismicVisualizationPromo';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Home() {
  return (
    <Layout>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] flex items-center justify-center bg-[#1a2810] overflow-hidden">

        {/* DotField */}
        <div className="absolute inset-0 w-full h-full">
          <DotField
            gradientFrom="rgba(84,107,65,0.5)"
            gradientTo="rgba(153,173,122,0.32)"
            glowColor="#1a2810"
            dotSpacing={20}
            dotRadius={1.3}
            bulgeStrength={72}
            waveAmplitude={0}
          />
        </div>

        {/* Organic ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[18%] left-[12%] w-[38rem] h-[38rem] bg-[#546B41]/22 rounded-full filter blur-[160px] animate-blob" />
          <div className="absolute top-[40%] right-[8%]  w-[28rem] h-[28rem] bg-[#99AD7A]/14 rounded-full filter blur-[140px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[15%] left-[30%] w-[22rem] h-[22rem] bg-[#DCCCAC]/10 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />
        </div>

        {/* Structural grid overlay */}
        <div className="absolute inset-0 opacity-[0.055] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#DCCCAC" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* ── Content ── */}
        <div className="container mx-auto px-6 z-10 relative pt-20 pb-16">

          {/* Badge */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-[#99AD7A]/50" />
            <span className="text-[#99AD7A] text-xs font-bold tracking-[0.25em] uppercase">
              BIM Coordinator · Structural Engineer · AI Researcher
            </span>
          </motion.div>

          {/* Name — display scale */}
          <motion.div {...fadeUp(0.1)} className="mb-8">
            <h1 className="font-black leading-[0.92] tracking-[-0.04em]">
              <span className="block text-[clamp(4.5rem,12vw,10rem)] text-[#FFF8EC]">Sattar</span>
              <span className="block text-[clamp(4.5rem,12vw,10rem)] text-gradient-nature">Hedayat</span>
            </h1>
          </motion.div>

          {/* Description + CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end max-w-5xl">
            <motion.div {...fadeUp(0.22)}>
              <p className="text-[#DCCCAC]/65 text-base md:text-lg leading-relaxed max-w-md">
                BIM Automation Engineer and structural specialist based in Rieti, Italy.
                Physics-driven seismic simulations, AI-powered engineering tools,
                and large-scale BIM coordination — pushing the frontier of building resilience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/works"
                  className="px-7 py-3.5 bg-[#99AD7A] text-[#1a2810] rounded-xl font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(153,173,122,0.35)] hover:shadow-[0_0_50px_rgba(153,173,122,0.55)] hover:bg-[#b8c99a] hover:-translate-y-1 transition-all duration-300"
                >
                  View Works
                </Link>
                <Link
                  href="/research"
                  className="px-7 py-3.5 border border-[#99AD7A]/25 text-[#DCCCAC] rounded-xl font-semibold text-sm hover:border-[#99AD7A]/50 hover:bg-[#546B41]/25 hover:-translate-y-1 transition-all duration-300"
                >
                  Explore Research
                </Link>
                <Link
                  href="/interactive-model"
                  className="px-7 py-3.5 border border-[#DCCCAC]/15 text-[#DCCCAC]/60 rounded-xl font-semibold text-sm hover:border-[#DCCCAC]/35 hover:text-[#DCCCAC]/90 hover:-translate-y-1 transition-all duration-300"
                >
                  3D Lab
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.35)} className="grid grid-cols-3 gap-4">
              {[
                { to: 4,   suffix: '',  label: 'Peer-Reviewed\nPublications' },
                { to: 4,   suffix: '+', label: 'Years BIM &\nResearch' },
                { to: 20,  suffix: '+', label: 'Students\nTaught' },
              ].map((s, i) => (
                <div key={s.label} className="glass-panel-dark rounded-2xl p-4 text-center">
                  <div className="stat-callout text-3xl text-[#99AD7A] mb-1">
                    <CountUp to={s.to} suffix={s.suffix} duration={1400 + i * 200} />
                  </div>
                  <div className="text-[9px] text-[#DCCCAC]/45 uppercase tracking-widest leading-tight whitespace-pre-line">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <motion.div {...fadeUp(1.1)} className="flex flex-col items-center gap-2 opacity-50">
            <span className="text-[#DCCCAC] text-[9px] tracking-[0.25em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#99AD7A]/60 to-transparent" />
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          RESEARCH FOCUS — numbered editorial
      ════════════════════════════════════════ */}
      <section className="py-32 relative bg-[#FFF8EC] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px divider-organic" />
        <div className="absolute -top-20 right-0 w-[50rem] h-[50rem] bg-[#99AD7A]/06 rounded-full filter blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6">
          {/* Section header */}
          <motion.div {...fadeUpView()} className="mb-20">
            <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
              Research Focus
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-[#1e2d14] max-w-2xl leading-tight">
              Three pillars of<br />
              <span className="text-gradient-forest">my research.</span>
            </h2>
          </motion.div>

          {/* Numbered cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Seismic Analysis',
                body: 'Machine learning for earthquake prediction using XGBoost, Random Forests, and LSTM — with focus on early warning systems and structural vulnerability.',
                accent: 'bg-[#546B41]',
                visual: <BuildingAnimation />,
              },
              {
                num: '02',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'AI Integration',
                body: 'Physics-informed RL, digital twins, and DDPG for HVAC optimization and structural health monitoring in smart infrastructures.',
                accent: 'bg-[#99AD7A]',
                visual: null,
              },
              {
                num: '03',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: 'Sustainable Building',
                body: 'BIM + smart monitoring for sustainable, heritage, and adaptive-reuse design — with reduced environmental impact and improved seismic performance.',
                accent: 'bg-[#DCCCAC]',
                visual: null,
              },
            ].map((card, i) => (
              <motion.div
                key={card.num}
                {...fadeUpView(i * 0.12)}
                className="group relative rounded-3xl overflow-hidden card-warm hover:shadow-nature-lg transition-all duration-400"
                whileHover={{ y: -8 }}
              >
                {/* Oversized background number */}
                <div className="absolute -top-4 -right-2 section-num text-[#546B41]/08 select-none pointer-events-none">
                  {card.num}
                </div>

                {/* Visual zone */}
                <div className="h-48 relative bg-[#DCCCAC]/25 overflow-hidden flex items-center justify-center border-b border-[#DCCCAC]/50">
                  <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#546B41]/08 to-transparent group-hover:from-[#546B41]/15 transition-all duration-500" />
                  {card.visual
                    ? <div className="scale-75 opacity-70 group-hover:scale-90 group-hover:opacity-100 transition-all duration-500">{card.visual}</div>
                    : (
                      <div className="text-[#DCCCAC]/60 group-hover:text-[#99AD7A] group-hover:scale-110 transition-all duration-500">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                          {i === 1
                            ? <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm1-11h-2V7h2v2zm0 8h-2v-6h2v6z"/>
                            : <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-9 0zm-1.47 8.26L15 17l-.5-1.26C13.5 14 12 13 12 13s1.5-1 2.5-3.26L15 9l.53 1.26C16.5 12 18 13 18 13s-1.5 1-2.47 3.26z"/>}
                        </svg>
                      </div>
                    )
                  }
                </div>

                {/* Text content */}
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-[#546B41]/10 text-[#546B41]">{card.icon}</div>
                    <h3 className="text-lg font-bold text-[#1e2d14]">{card.title}</h3>
                  </div>
                  <p className="text-[#546B41]/60 text-sm leading-relaxed">{card.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Link to research */}
          <motion.div {...fadeUpView(0.3)} className="mt-12 flex justify-center">
            <Link
              href="/research"
              className="label-dash text-[#546B41] text-sm font-bold hover:text-[#2d3d24] transition-colors"
            >
              Deep-dive into Research Areas
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          WORKS PREVIEW — horizontal editorial list
      ════════════════════════════════════════ */}
      <section className="py-32 bg-[#2d3d24] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-[#546B41]/30 rounded-full filter blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#99AD7A]/12 rounded-full filter blur-[120px]" />
        </div>
        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="work-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFF8EC" strokeWidth="0.6"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#work-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <motion.div {...fadeUpView()}>
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Selected Work
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-[#FFF8EC] leading-tight">
                Projects &<br />
                <span className="text-gradient-nature">Automation.</span>
              </h2>
            </motion.div>
            <motion.div {...fadeUpView(0.15)}>
              <Link
                href="/works"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-[#99AD7A]/25 text-[#99AD7A] text-sm font-semibold hover:bg-[#546B41]/25 hover:border-[#99AD7A]/50 transition-all duration-300 group"
              >
                View All Works
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Project rows */}
          <div className="space-y-px">
            {[
              {
                num: '01',
                title: 'CME Lazio — pyRevit BIM Automation Platform',
                year: '2024 – Present',
                tag: 'BIM Automation',
                tagStyle: 'tag-active',
                desc: 'Production-grade automation reducing a 5–7 day manual CME process to under one day. AI-assisted prezzario mapping, 4D scheduling, cost-carbon tracking.',
              },
              {
                num: '02',
                title: 'Vardavard Technology Park — 10-Story Research Building',
                year: '2023 – 2025',
                tag: 'BIM + Structure',
                tagStyle: 'tag-dark',
                desc: 'Full BIM coordination and structural engineering for a multi-tenant research facility in Tehran. ETABS drift analysis, SAFE foundation design, 4D/5D integration.',
              },
              {
                num: '03',
                title: 'AMA Roma Infrastructure & Systems',
                year: '2025 – Present',
                tag: 'Infrastructure',
                tagStyle: 'tag-dark',
                desc: 'Complex families and clash resolution for Rome\'s waste management authority. Cross-disciplinary coordination across Navisworks, Revit, and MS Project.',
              },
              {
                num: '04',
                title: 'Via Salaria — Strategic Road Infrastructure',
                year: '2025 – Present',
                tag: 'Civil / Roads',
                tagStyle: 'tag-dark',
                desc: 'BIM coordination for one of Italy\'s most strategically important road projects. Civil 3D, road drainage, terrain modeling, SAL-based follow-up.',
              },
              {
                num: '05',
                title: 'H-BIM: SNIA Viscosa Factory, Rieti',
                year: '2024',
                tag: 'Heritage BIM',
                tagStyle: 'tag-dark',
                desc: 'Detailed Heritage BIM of historic factory for adaptive reuse and urban regeneration objectives through digital documentation.',
              },
            ].map((proj, i) => (
              <motion.div
                key={proj.num}
                {...fadeUpView(i * 0.08)}
                className="group flex items-start gap-6 md:gap-10 py-7 px-2 border-t border-[#FFF8EC]/06 hover:bg-[#546B41]/15 rounded-2xl transition-all duration-300 cursor-default"
              >
                <span className="text-[#99AD7A]/40 font-mono text-xs font-bold mt-1 w-7 flex-shrink-0 group-hover:text-[#99AD7A]/80 transition-colors">
                  {proj.num}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-base md:text-lg font-bold text-[#FFF8EC] group-hover:text-[#b8c99a] transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <span className={`tag ${proj.tagStyle} flex-shrink-0`}>{proj.tag}</span>
                  </div>
                  <p className="text-[#DCCCAC]/50 text-sm leading-relaxed hidden md:block">{proj.desc}</p>
                </div>
                <span className="text-[#DCCCAC]/35 text-xs font-mono flex-shrink-0 mt-1">{proj.year}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          SEISMIC PROMO
      ════════════════════════════════════════ */}
      <SeismicVisualizationPromo />


      {/* ════════════════════════════════════════
          LATEST PUBLICATIONS
      ════════════════════════════════════════ */}
      <section className="py-32 relative bg-[#FFF8EC] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px divider-organic" />
        <div className="absolute bottom-0 right-0 w-[42rem] h-[42rem] bg-[#DCCCAC]/40 rounded-full filter blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div {...fadeUpView()}>
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Recent Work
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-[#1e2d14] leading-tight">
                Latest<br />
                <span className="text-gradient-forest">Publications.</span>
              </h2>
            </motion.div>
            <motion.div {...fadeUpView(0.1)}>
              <Link
                href="/publications"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl card-warm text-[#546B41] text-sm font-semibold hover:shadow-nature transition-all duration-300 group"
              >
                All Publications
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl">
            {[
              {
                year: '2025',
                journal: 'Energies — MDPI',
                title: 'AI-Enhanced Prediction of Building Response to Seismic Events',
                abstract: 'A physics-informed RL framework combining thermodynamic constraints with DDPG for building HVAC optimization, validated through simulation with significant energy efficiency gains.',
                doi: '10.3390/en18236310',
                tagStyle: 'tag-sage',
                tag: 'AI & ML',
              },
              {
                year: '2025',
                journal: 'Energies — MDPI',
                title: 'AI and Digital Twins for Bioclimatic Building Design',
                abstract: 'Integration of artificial intelligence and digital twin technology for bioclimatic building design to enhance sustainability and energy efficiency through real-time simulations.',
                doi: '10.3390/en18195230',
                tagStyle: 'tag-forest',
                tag: 'Sustainability',
              },
            ].map((pub, i) => (
              <motion.div
                key={i}
                {...fadeUpView(i * 0.12)}
                className="group relative rounded-3xl card-warm p-8 overflow-hidden hover:shadow-nature-lg transition-all duration-400"
                whileHover={{ y: -6 }}
              >
                {/* Animated left accent */}
                <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b from-transparent via-[#99AD7A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full" />

                <div className="flex items-center gap-3 mb-5">
                  <span className="tag tag-beige">{pub.year}</span>
                  <span className="text-[#99AD7A] text-xs font-semibold">{pub.journal}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1e2d14] mb-3 leading-snug group-hover:text-[#546B41] transition-colors">
                  {pub.title}
                </h3>
                <p className="text-[#546B41]/55 text-sm mb-6 leading-relaxed">{pub.abstract}</p>
                <div className="flex items-center justify-between">
                  <span className={`tag ${pub.tagStyle}`}>{pub.tag}</span>
                  <Link href="/publications" className="text-xs text-[#546B41] font-bold flex items-center gap-1.5 group/link">
                    Read Paper
                    <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform text-[#99AD7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden bg-[#546B41]">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="cta-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7"/>
              <path d="M 0 0 L 56 56" fill="none" stroke="#FFF8EC" strokeWidth="0.4"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3  w-[30rem] h-[30rem] bg-[#99AD7A]/18 rounded-full filter blur-[140px] animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-[24rem] h-[24rem] bg-[#2d3d24]/45 rounded-full filter blur-[110px] animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            {...fadeUpView()}
            className="glass-panel-dark rounded-3xl p-14 md:p-20 max-w-4xl mx-auto"
          >
            <p className="label-dash justify-center text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-7">
              Interactive Lab
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-5 text-[#FFF8EC] tracking-tight leading-tight">
              Experience Interactive<br />
              <span className="text-gradient-nature">Structural Models.</span>
            </h2>
            <p className="text-base mb-10 text-[#DCCCAC]/65 max-w-xl mx-auto leading-relaxed">
              Real-time 3D building models, physics-driven seismic simulations,
              and AI-powered analysis — all in one workspace.
            </p>
            <Link
              href="/interactive-model"
              className="inline-block px-10 py-4 bg-[#FFF8EC] text-[#1e2d14] rounded-xl font-bold hover:bg-[#DCCCAC] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_0_35px_rgba(255,248,236,0.22)] hover:shadow-[0_0_55px_rgba(255,248,236,0.38)]"
            >
              Launch 3D Visualizations
            </Link>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}
