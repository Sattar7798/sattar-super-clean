'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/LayoutFix';
import DotField from '@/components/animations/DotField';
import { AIIcon, EarthquakeIcon, StructureIcon, AnalysisIcon } from '@/components/ui/AnimatedIcons';

function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, inView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const researchPillars = [
  {
    num: '01',
    title: 'BIM Coordination & Automation',
    eyebrow: 'Delivery-grade digital workflows',
    description:
      'My research-driven practice treats BIM as an active delivery system, combining multidisciplinary coordination, model validation, quantity logic, and automation for infrastructure, public, and building projects.',
    topics: [
      'Multidisciplinary coordination across Architecture, Structure, MEP, and Infrastructure',
      'Revit and Navisworks workflows from LOD 200 to 400 with clash detection and resolution',
      '4D and 5D BIM logic with WBS codes, prezzario links, schedules, and model validation',
      'Python, Dynamo, and pyRevit tools for computo metrico, scheduling, and reporting',
    ],
    accent: 'from-[#546B41]/20 via-[#99AD7A]/12 to-transparent',
    border: 'border-[#546B41]/20',
    icon: <AnalysisIcon size={24} color="currentColor" />,
  },
  {
    num: '02',
    title: 'AI, Digital Twins & Building Systems',
    eyebrow: 'Data-informed sustainability research',
    description:
      'The AI side of my work is focused on real engineering use: digital twins, reinforcement learning, and decision-support models that improve building performance while staying legible to technical teams.',
    topics: [
      'Physics-informed reinforcement learning for HVAC and building control',
      'Artificial intelligence and digital twins for bioclimatic building design',
      'Machine learning workflows with NumPy, pandas, scikit-learn, TensorFlow, and PyTorch',
      'AI-assisted BIM workflows for pricing, classification, and design-option comparison',
      'Cost-carbon tracking and executive reporting inside BIM automation pipelines',
    ],
    accent: 'from-[#99AD7A]/22 via-[#DCCCAC]/18 to-transparent',
    border: 'border-[#99AD7A]/25',
    icon: <AIIcon size={24} color="currentColor" />,
  },
  {
    num: '03',
    title: 'Seismic Hazard & Structural Vulnerability',
    eyebrow: 'From thesis to applied analysis',
    description:
      'Seismic research connects structural modeling, hazard interpretation, and public-risk understanding. This includes thesis work on building damage in the 2017 Kermanshah earthquake and related publication output.',
    topics: [
      'Seismic hazard and structural vulnerability assessment',
      'ETABS drift analysis, SAFE foundation design, and structural response interpretation',
      'Earthquake awareness, emergency planning, and risk-reduction studies',
      'Integration of geotechnical and seismic data into BIM-linked project workflows',
    ],
    accent: 'from-[#DCCCAC]/30 via-[#99AD7A]/10 to-transparent',
    border: 'border-[#DCCCAC]/60',
    icon: <EarthquakeIcon size={24} color="currentColor" />,
  },
  {
    num: '04',
    title: 'Sustainable Retrofit & Academic Support',
    eyebrow: 'Heritage, renovation, mentoring',
    description:
      'My research profile also includes heritage BIM, sustainable renovation, and academic support work at Sapienza, where teaching and thesis guidance reinforce the applied side of the research.',
    topics: [
      'H-BIM modeling for the SNIA Viscosa factory in Rieti',
      'BIM-based sustainable renovation across demolition and redesign phases',
      'Academic support and thesis guidance for engineering students',
      'Peer review activity for the EEEIC 2025 conference process',
    ],
    accent: 'from-[#546B41]/14 via-[#DCCCAC]/24 to-transparent',
    border: 'border-[#546B41]/15',
    icon: <StructureIcon size={24} color="currentColor" />,
  },
];

const profileCards = [
  {
    step: '01',
    title: 'Research Assistant',
    description:
      'Sapienza University of Rome, 2023-2026. Contributing to research reports, conference papers, and journal articles across engineering, sustainability, and digital innovation.',
  },
  {
    step: '02',
    title: "Master's Degree",
    description:
      'Master in Sustainable Building Engineering at Sapienza University of Rome, 2024-2026, currently ongoing.',
  },
  {
    step: '03',
    title: "Bachelor's Degree",
    description:
      'B.Sc. in Sustainable Building Engineering, completed at Sapienza University with a 3.86/4 CGPA and rank of 2nd among 90 students.',
  },
  {
    step: '04',
    title: 'Thesis & Review',
    description:
      'Thesis on seismic hazard and structural vulnerability in the 2017 Kermanshah earthquake, plus selected reviewer activity for the EEEIC 2025 conference cycle.',
  },
];

export default function ResearchPage() {
  return (
    <Layout>
      <section className="relative min-h-[92vh] flex items-center bg-[#1e2d14] overflow-hidden">
        <div className="absolute inset-0">
          <DotField
            gradientFrom="rgba(84,107,65,0.48)"
            gradientTo="rgba(153,173,122,0.26)"
            glowColor="#1e2d14"
            dotSpacing={20}
            dotRadius={1.15}
            bulgeStrength={64}
            waveAmplitude={0}
          />
        </div>

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="research-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 56 L 56 0" fill="none" stroke="#99AD7A" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#research-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[12%] left-[10%] w-[34rem] h-[34rem] rounded-full bg-[#546B41]/28 blur-[150px]" />
          <div className="absolute bottom-[8%] right-[8%] w-[28rem] h-[28rem] rounded-full bg-[#99AD7A]/16 blur-[130px]" />
          <div className="absolute top-[35%] right-[24%] w-[18rem] h-[18rem] rounded-full bg-[#DCCCAC]/10 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-14 items-end">
            <div>
              <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-[#99AD7A]/45" />
                <span className="text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase">
                  Sapienza Research Profile
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="font-black leading-[0.9] tracking-[-0.05em] mb-7"
              >
                <span className="block text-[clamp(3.9rem,10vw,8.4rem)] text-[#FFF8EC]">Research</span>
                <span className="block text-[clamp(3.9rem,10vw,8.4rem)] text-gradient-nature">
                  Practice
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.18)}
                className="max-w-2xl text-base md:text-lg leading-relaxed text-[#DCCCAC]/68"
              >
                Research assistant at Sapienza University of Rome, working across BIM automation,
                seismic hazard and structural vulnerability, AI for building systems, and sustainable
                building engineering. This page now reflects the actual roles, publications, and
                academic track from the CV you provided.
              </motion.p>

              <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row gap-4 mt-9">
                <Link
                  href="/publications"
                  className="px-7 py-3.5 bg-[#99AD7A] text-[#1e2d14] rounded-xl font-bold text-sm shadow-[0_0_28px_rgba(153,173,122,0.35)] hover:bg-[#b8c99a] hover:-translate-y-1 transition-all duration-300"
                >
                  View Publications
                </Link>
                <Link
                  href="/works"
                  className="px-7 py-3.5 border border-[#99AD7A]/25 text-[#DCCCAC] rounded-xl font-semibold text-sm hover:border-[#99AD7A]/50 hover:bg-[#546B41]/25 hover:-translate-y-1 transition-all duration-300"
                >
                  See Applied Projects
                </Link>
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.34)} className="grid grid-cols-2 gap-4">
              {[
                { label: 'Selected Publications', to: 4, suffix: '' },
                { label: 'Research Assistant Years', to: 3, suffix: '+' },
                { label: 'BSc Rank in Cohort', to: 2, suffix: 'nd' },
                { label: 'Conference Reviewer Role', to: 1, suffix: '' },
              ].map((item, index) => (
                <div key={item.label} className="glass-panel-dark rounded-2xl p-5 min-h-[120px] flex flex-col justify-between">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#DCCCAC]/38">
                    {item.label}
                  </div>
                  <div className="stat-callout text-4xl text-[#99AD7A]">
                    <CountUp to={item.to} suffix={item.suffix} duration={1400 + index * 220} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-[#FFF8EC] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px divider-organic" />
        <div className="absolute -top-20 right-0 w-[48rem] h-[48rem] rounded-full bg-[#99AD7A]/10 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUpView()} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div>
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Focus Matrix
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-[#1e2d14] leading-tight max-w-3xl">
                Research areas grounded in
                <br />
                <span className="text-gradient-forest">real work and study.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm md:text-base leading-relaxed text-[#546B41]/62">
              The categories below now follow your actual CV instead of generic placeholder themes:
              BIM coordination, AI and digital twins, seismic research, and sustainable retrofit work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {researchPillars.map((pillar, index) => (
              <motion.div
                key={pillar.num}
                {...fadeUpView(index * 0.08)}
                className={`group relative overflow-hidden rounded-3xl card-warm border ${pillar.border} p-7 md:p-8 hover:shadow-nature-lg transition-all duration-300`}
                whileHover={{ y: -6 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.accent} opacity-80 pointer-events-none`} />
                <div className="absolute -top-4 right-2 section-num text-[#546B41]/10">{pillar.num}</div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#546B41]/10 text-[#546B41] flex items-center justify-center">
                      {pillar.icon}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[#99AD7A] font-bold">
                        {pillar.eyebrow}
                      </div>
                      <h3 className="text-xl font-black text-[#1e2d14]">{pillar.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[#546B41]/65 mb-6">
                    {pillar.description}
                  </p>

                  <div className="space-y-2.5">
                    {pillar.topics.map((topic) => (
                      <div key={topic} className="flex items-start gap-3 text-sm text-[#546B41]/66">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#99AD7A] flex-shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 bg-[#2d3d24] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[38rem] h-[38rem] rounded-full bg-[#546B41]/28 blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#99AD7A]/12 blur-[120px]" />
        </div>

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="research-process-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#FFF8EC" strokeWidth="0.55" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#research-process-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
            <motion.div {...fadeUpView()}>
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Academic Context
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-[#FFF8EC] leading-tight mb-6">
                Research supported by
                <br />
                <span className="text-gradient-nature">applied engineering work.</span>
              </h2>
              <p className="text-[#DCCCAC]/64 text-base leading-relaxed max-w-xl mb-8">
                The academic side of your profile is strongest when it is presented alongside the
                actual engineering work: Sapienza research support, the sustainable building track,
                the seismic thesis, and paper writing connected to live BIM and structural practice.
              </p>

              <div className="glass-panel-dark rounded-3xl p-7">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#99AD7A] font-bold mb-4">
                  Profile Anchors
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Sapienza University research support',
                    'Master in Sustainable Building Engineering',
                    'Thesis on the 2017 Kermanshah earthquake',
                    'EEEIC reviewer and student mentoring',
                  ].map((theme) => (
                    <div
                      key={theme}
                      className="rounded-2xl border border-[#99AD7A]/15 bg-[#546B41]/18 px-4 py-4 text-sm text-[#DCCCAC]/70"
                    >
                      {theme}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              {profileCards.map((item, index) => (
                <motion.div
                  key={item.step}
                  {...fadeUpView(index * 0.1)}
                  className="group relative rounded-3xl glass-panel-dark p-6 md:p-7 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#99AD7A] via-[#DCCCAC] to-transparent opacity-70" />
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl border border-[#99AD7A]/20 bg-[#99AD7A]/10 flex items-center justify-center text-[#99AD7A] stat-callout text-2xl">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#FFF8EC] mb-2">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-[#DCCCAC]/62 max-w-lg">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pt-20 pb-8 md:pt-24 md:pb-10 bg-[#546B41] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="research-cta-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 0 L 56 56" fill="none" stroke="#FFF8EC" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#research-cta-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#99AD7A]/18 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#2d3d24]/45 blur-[110px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUpView()} className="glass-panel-dark rounded-3xl p-10 md:p-12 max-w-4xl mx-auto text-center">
            <p className="label-dash justify-center text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-6">
              Next Step
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#FFF8EC] leading-tight mb-5">
              See how the research connects to
              <br />
              <span className="text-gradient-nature">projects, tools, and delivery.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base leading-relaxed text-[#DCCCAC]/65 mb-10">
              The research section is now aligned with your real CV data. From here, visitors can
              continue into projects and interactive tools to see how the academic work translates
              into BIM coordination, automation, and structural engineering practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/works"
                className="px-8 py-4 bg-[#FFF8EC] text-[#1e2d14] rounded-xl font-bold hover:bg-[#DCCCAC] hover:-translate-y-1 transition-all duration-300"
              >
                Explore Works
              </Link>
              <Link
                href="/interactive-model"
                className="px-8 py-4 border border-[#99AD7A]/24 text-[#FFF8EC] rounded-xl font-semibold hover:bg-[#2d3d24]/28 hover:border-[#99AD7A]/45 hover:-translate-y-1 transition-all duration-300"
              >
                Launch Interactive Lab
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
