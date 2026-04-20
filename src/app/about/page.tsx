'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/LayoutFix';
import DotField from '@/components/animations/DotField';

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

      if (progress < 1) raf = requestAnimationFrame(tick);
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

const profileParagraphs = [
  'BIM Coordinator with hands-on experience in large-scale infrastructure, public, and building projects in Italy, collaborating with SPERI S.p.A and Spoeltini Studio.',
  'Specialized in multidisciplinary coordination across Architecture, Structure, MEP, and Infrastructure, with advanced expertise in clash detection, model development, and BIM-based workflows using Revit, Navisworks, AutoCAD, Civil 3D, and Recap Pro.',
  'Experienced in leading coordination meetings, resolving complex design conflicts, and supporting project delivery through 4D/5D BIM processes, quantity take-off logic, and model validation. Strong technical background in engineering, point cloud processing, custom family development, and automation through Python and Dynamo, including custom Revit tool development for computo metrico and cost-related processes.',
  'Familiar with ISO 19650 and UNI 11337 standards and committed to internationally aligned BIM delivery.',
  'Developer of a production-grade BIM automation platform built on pyRevit, covering automated CME/computo metrico, AI-assisted prezzario mapping, 4D scheduling, cost-carbon tracking, and tender-grade reporting, reducing a workflow that previously required up to one week to under one day. Also active as a web developer with delivered projects for engineering and architecture firms.',
];

const stackSystems = [
  {
    code: '01',
    title: 'Model',
    tools: ['Revit', 'Navisworks', 'Civil 3D', 'Recap Pro'],
  },
  {
    code: '02',
    title: 'Automate',
    tools: ['Python', 'Dynamo', 'CME Automation'],
  },
  {
    code: '03',
    title: 'Deliver',
    tools: ['4D / 5D BIM', 'ISO 19650', 'UNI 11337'],
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative min-h-[90vh] flex items-center bg-[#1e2d14] overflow-hidden">
        <div className="absolute inset-0">
          <DotField
            gradientFrom="rgba(84,107,65,0.48)"
            gradientTo="rgba(153,173,122,0.26)"
            glowColor="#1e2d14"
            dotSpacing={20}
            dotRadius={1.15}
            bulgeStrength={62}
            waveAmplitude={0}
          />
        </div>

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 56 L 56 0" fill="none" stroke="#99AD7A" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[14%] left-[10%] w-[34rem] h-[34rem] rounded-full bg-[#546B41]/28 blur-[150px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[26rem] h-[26rem] rounded-full bg-[#99AD7A]/14 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-end">
            <div>
              <motion.div {...fadeUp()} className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-[#99AD7A]/45" />
                <span className="text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase">
                  Profile
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="font-black leading-[0.9] tracking-[-0.05em] mb-7"
              >
                <span className="block text-[clamp(3.9rem,10vw,8.2rem)] text-[#FFF8EC]">About</span>
                <span className="block text-[clamp(3.9rem,10vw,8.2rem)] text-gradient-nature">
                  Sattar
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.18)}
                className="max-w-2xl text-base md:text-lg leading-relaxed text-[#DCCCAC]/68"
              >
                BIM Coordinator, BIM Automation Engineer, and structural specialist focused on
                multidisciplinary delivery, engineering workflows, and production-grade BIM automation.
              </motion.p>

              <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row gap-4 mt-9">
                <Link
                  href="/works"
                  className="px-7 py-3.5 bg-[#99AD7A] text-[#1e2d14] rounded-xl font-bold text-sm shadow-[0_0_28px_rgba(153,173,122,0.35)] hover:bg-[#b8c99a] hover:-translate-y-1 transition-all duration-300"
                >
                  View Works
                </Link>
                <Link
                  href="/contact"
                  className="px-7 py-3.5 border border-[#99AD7A]/25 text-[#DCCCAC] rounded-xl font-semibold text-sm hover:border-[#99AD7A]/50 hover:bg-[#546B41]/25 hover:-translate-y-1 transition-all duration-300"
                >
                  Contact Me
                </Link>
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.34)} className="grid grid-cols-2 gap-4 max-w-[28rem] lg:ml-auto">
              {[
                { label: 'Years Active', to: 4, suffix: '+' },
                { label: 'Publications', to: 4, suffix: '' },
                { label: 'Rank', to: 2, suffix: 'nd' },
                { label: 'Key Projects', to: 7, suffix: '+' },
              ].map((item, index) => (
                <div key={item.label} className="glass-panel-dark rounded-[2rem] px-5 py-6 min-h-[150px] flex flex-col justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#DCCCAC]/42">
                    {item.label}
                  </div>
                  <div className="stat-callout text-[clamp(2.7rem,6vw,4.2rem)] text-[#b8c99a] leading-none">
                    <CountUp to={item.to} suffix={item.suffix} duration={1400 + index * 180} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-28 bg-[#FFF8EC] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px divider-organic" />
        <div className="absolute -top-16 right-0 w-[46rem] h-[46rem] rounded-full bg-[#99AD7A]/08 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-8 items-start">
            <motion.div {...fadeUpView()} className="rounded-3xl card-warm p-8 md:p-10">
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Professional Profile
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-[#1e2d14] leading-tight mb-6">
                Focused on delivery,
                <br />
                <span className="text-gradient-forest">coordination, and automation.</span>
              </h2>

              <div className="space-y-4 text-sm md:text-base leading-relaxed text-[#546B41]/66">
                {profileParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUpView(0.08)} className="rounded-3xl card-warm p-8 md:p-9 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 left-8 right-8 bottom-8 rounded-[2rem] border border-[#546B41]/08" />
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#99AD7A]/10 blur-[70px]" />
              </div>

              <div className="relative z-10 text-[10px] uppercase tracking-[0.22em] text-[#99AD7A] font-bold mb-4">
                Core Stack
              </div>

              <div className="relative z-10 space-y-4">
                {stackSystems.map((system, index) => (
                  <div
                    key={system.code}
                    className="grid grid-cols-[56px_1fr] gap-4 items-start rounded-[1.5rem] border border-[#546B41]/10 bg-[#546B41]/[0.035] px-4 py-4"
                  >
                    <div className="pt-1">
                      <div className="w-11 h-11 rounded-2xl bg-[#546B41]/08 border border-[#546B41]/12 flex items-center justify-center">
                        <span className="stat-callout text-lg text-[#546B41]/78">{system.code}</span>
                      </div>
                      {index < stackSystems.length - 1 && (
                        <div className="w-px h-8 bg-gradient-to-b from-[#99AD7A]/40 to-transparent mx-auto mt-2" />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-black text-[#1e2d14] mb-3">{system.title}</div>
                      <div className="flex flex-wrap gap-2">
                        {system.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1.5 rounded-full border border-[#546B41]/14 bg-[#FFF8EC]/72 text-[11px] font-semibold text-[#546B41]/78"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
