'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/LayoutFix';
import DotField from '@/components/animations/DotField';

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

type WorkCategory = 'all' | 'bim' | 'seismic' | 'ai' | 'teaching';

const projects = [
  {
    id: 'cme-lazio',
    num: '01',
    title: 'CME Lazio — pyRevit BIM Automation Platform',
    subtitle: 'Lead BIM Engineer & Python Developer',
    period: '2024 – Present',
    location: 'Roma, Italy',
    category: 'bim' as WorkCategory,
    tags: ['Revit API', 'pyRevit', 'Python', 'BIM', 'Automation'],
    featured: true,
    color: 'forest',
    description:
      'Engineered a comprehensive pyRevit-based automation suite reducing manual Revit workflows by 60–80%. Built across structural, architectural, MEP, and general BIM domains with Revit API, IFC, and COM server integration.',
    highlights: [
      'Automated IFC import/export pipelines with custom schema mapping',
      'Structural element generation scripts (walls, beams, columns, foundations)',
      'MEP system routing, junction, and annotation automation',
      'Clash detection and model coordination workflows',
      'Custom parameter management and schedule generation',
      'QA/QC validation suite with automated compliance checks',
    ],
    tech: ['Python', 'Revit API', 'pyRevit', 'IFC', 'COM Server', 'BIM 360'],
  },
  {
    id: 'via-salaria',
    num: '02',
    title: 'Via Salaria 1003 — Residential High-Rise Renovation',
    subtitle: 'BIM Coordinator & Structural Analyst',
    period: '2023 – 2024',
    location: 'Roma, Italy',
    category: 'bim' as WorkCategory,
    tags: ['BIM Coordination', 'Structural Analysis', 'Revit', 'Seismic Upgrade'],
    featured: false,
    color: 'sage',
    description:
      'BIM coordination and structural renovation design for an 8-story residential complex. Managed multi-discipline clash detection and seismic upgrade documentation.',
    highlights: [
      'Full BIM model in Revit for architecture + structure',
      'Seismic vulnerability assessment and retrofit design',
      'Coordination with MEP and facade subcontractors',
      'Construction documentation with automated scheduling',
    ],
    tech: ['Revit', 'AutoCAD', 'SAP2000', 'Navisworks'],
  },
  {
    id: 'ama-roma',
    num: '03',
    title: 'AMA Roma — Industrial Waste Facility',
    subtitle: 'Structural Engineer & BIM Modeler',
    period: '2023',
    location: 'Roma, Italy',
    category: 'bim' as WorkCategory,
    tags: ['Industrial Structures', 'BIM', 'RC Frame', 'Foundation Design'],
    featured: false,
    color: 'beige',
    description:
      'Structural design and BIM modeling for an industrial waste management facility. Included reinforced concrete frame analysis, foundation design, and full documentation package.',
    highlights: [
      'RC frame design for heavy industrial loading conditions',
      'Foundation analysis with variable soil conditions',
      'BIM-coordinated structural and architectural models',
      'Compliance documentation for Italian building regulations',
    ],
    tech: ['SAP2000', 'Revit', 'AutoCAD', 'ETABS'],
  },
  {
    id: 'vardavard',
    num: '04',
    title: 'Vardavard Technology Park',
    subtitle: 'Structural Designer',
    period: '2022 – 2023',
    location: 'Tehran, Iran',
    category: 'seismic' as WorkCategory,
    tags: ['High-Rise', 'Seismic Design', 'Steel Structure', 'ETABS'],
    featured: false,
    color: 'forest',
    description:
      'Seismic design and structural analysis for a mixed-use technology park complex in a high-seismicity zone. Comparative study of steel moment frames versus braced frame systems under Iranian seismic code.',
    highlights: [
      'Multi-story steel moment frame and braced frame comparison',
      'Seismic demand analysis per Iranian Standard 2800',
      'Story drift, base shear, and modal response evaluation',
      'Structural optimization for performance and cost balance',
    ],
    tech: ['ETABS', 'SAP2000', 'MATLAB', 'AutoCAD'],
  },
  {
    id: 'hbim-snia',
    num: '05',
    title: 'H-BIM — SNIA Viscosa Factory',
    subtitle: 'Heritage BIM Researcher',
    period: '2023',
    location: 'Roma, Italy',
    category: 'bim' as WorkCategory,
    tags: ['H-BIM', 'Heritage', 'Photogrammetry', 'Preservation'],
    featured: false,
    color: 'sage',
    description:
      'Heritage BIM modeling of the historic SNIA Viscosa industrial complex. Point cloud processing, photogrammetry, and parametric Revit modeling for preservation documentation.',
    highlights: [
      'Point cloud acquisition and processing from drone survey',
      'Parametric HBIM model built in Revit from photogrammetric data',
      'Structural condition assessment and damage mapping',
      'Preservation documentation aligned with Italian cultural heritage standards',
    ],
    tech: ['Revit', 'Recap', 'RealityCapture', 'CloudCompare', 'AutoCAD'],
  },
  {
    id: 'bim-renovation',
    num: '06',
    title: 'BIM-Integrated Sustainable Renovation',
    subtitle: 'Research Project — Sapienza University',
    period: '2023 – 2024',
    location: 'Roma, Italy',
    category: 'ai' as WorkCategory,
    tags: ['BIM', 'Energy Simulation', 'AI', 'Sustainability', 'EnergyPlus'],
    featured: false,
    color: 'beige',
    description:
      'Research project integrating BIM with energy simulation and AI-driven optimization for sustainable building renovation. Developed automated IFC-to-EnergyPlus workflows with ML-based parameter tuning.',
    highlights: [
      'Automated BIM-to-energy model conversion pipeline',
      'EnergyPlus simulation with parametric variation studies',
      'ML surrogate model for rapid energy performance prediction',
      'Retrofit scenario comparison with LCA integration',
    ],
    tech: ['Revit', 'EnergyPlus', 'Python', 'scikit-learn', 'IFC', 'MATLAB'],
  },
];

const teaching = [
  {
    role: 'Academic Support Tutor',
    course: 'Structural Mechanics & Engineering Design',
    institution: 'Sapienza University of Rome',
    period: '2023 – Present',
    students: '30+',
    topics: ['Structural analysis', 'Finite element methods', 'BIM fundamentals', 'Seismic design principles'],
  },
  {
    role: 'Teaching Assistant',
    course: 'Structural Mechanics',
    institution: 'Sapienza University of Rome',
    period: '2023',
    students: '45+',
    topics: ['Force method', 'Displacement method', 'Matrix structural analysis', 'Lab sessions'],
  },
  {
    role: 'Teaching Assistant',
    course: 'Analysis I (Calculus)',
    institution: 'Sapienza University of Rome',
    period: '2022',
    students: '60+',
    topics: ['Differential calculus', 'Integral calculus', 'Series', 'Problem sessions'],
  },
  {
    role: 'Teaching Assistant',
    course: 'Mathematics',
    institution: 'Sapienza University of Rome',
    period: '2022',
    students: '50+',
    topics: ['Linear algebra', 'Differential equations', 'Numerical methods', 'Exam preparation'],
  },
];

const categories = [
  { id: 'all' as WorkCategory, label: 'All Works' },
  { id: 'bim' as WorkCategory, label: 'BIM & Digital' },
  { id: 'seismic' as WorkCategory, label: 'Seismic' },
  { id: 'ai' as WorkCategory, label: 'AI & Research' },
  { id: 'teaching' as WorkCategory, label: 'Teaching' },
];

const colorAccent: Record<string, { border: string; tag: string; num: string; dot: string }> = {
  forest: {
    border: 'border-[#546B41]/40',
    tag: 'bg-[#546B41]/10 border-[#546B41]/25 text-[#546B41]',
    num: 'text-[#546B41]',
    dot: 'bg-[#546B41]',
  },
  sage: {
    border: 'border-[#99AD7A]/40',
    tag: 'bg-[#99AD7A]/12 border-[#99AD7A]/30 text-[#3d5030]',
    num: 'text-[#99AD7A]',
    dot: 'bg-[#99AD7A]',
  },
  beige: {
    border: 'border-[#DCCCAC]/60',
    tag: 'bg-[#DCCCAC]/40 border-[#DCCCAC]/70 text-[#7a6040]',
    num: 'text-[#DCCCAC]',
    dot: 'bg-[#DCCCAC]',
  },
};

export default function WorksPage() {
  const [activeFilter, setActiveFilter] = useState<WorkCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>('cme-lazio');

  const visibleProjects =
    activeFilter === 'all' || activeFilter === 'teaching'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const showTeaching = activeFilter === 'all' || activeFilter === 'teaching';

  return (
    <Layout>
      {/* ══════════ Hero ══════════ */}
      <section className="relative bg-[#1e2d14] text-[#FFF8EC] pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <DotField
            gradientFrom="rgba(84,107,65,0.45)"
            gradientTo="rgba(153,173,122,0.25)"
            glowColor="#1e2d14"
            dotSpacing={20}
            dotRadius={1.1}
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="wk-grid" width="52" height="52" patternUnits="userSpaceOnUse">
                <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#FFF8EC" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wk-grid)" />
          </svg>
        </div>

        <div className="absolute top-8 right-1/4 w-[28rem] h-[20rem] bg-[#546B41]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[22rem] h-[14rem] bg-[#99AD7A]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="label-dash text-[#99AD7A] text-xs font-semibold tracking-widest uppercase mb-6 inline-flex">
              Portfolio & Teaching
            </span>
            <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.9] tracking-[-0.04em] mb-6">
              <span className="block text-[#FFF8EC]">Works &</span>
              <span className="block text-gradient-nature">Projects</span>
            </h1>
            <p className="text-lg text-[#DCCCAC]/65 max-w-2xl leading-relaxed">
              Engineering projects spanning BIM automation, seismic analysis, AI integration,
              and academic teaching — from concept to deployment.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-6"
          >
            {[
              { to: 6,   suffix: '+', label: 'Engineering Projects' },
              { to: 4,   suffix: '',  label: 'Teaching Roles' },
              { to: 20,  suffix: '+', label: 'Students Taught' },
              { to: 7,   suffix: '+', label: 'BIM Scripts Deployed' },
            ].map((s, i) => (
              <div key={s.label} className="glass-panel-dark rounded-xl px-6 py-4 flex flex-col min-w-[120px]">
                <span className="text-2xl font-black font-mono text-[#99AD7A]">
                  <CountUp to={s.to} suffix={s.suffix} duration={1400 + i * 250} />
                </span>
                <span className="text-xs text-[#DCCCAC]/45 mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ Filter Bar ══════════ */}
      <div className="sticky top-16 z-40 bg-[#FFF8EC]/96 backdrop-blur-xl border-b border-[#DCCCAC]/60">
        <div className="container mx-auto px-6 py-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeFilter === cat.id
                  ? 'bg-[#546B41] border-[#546B41] text-[#FFF8EC]'
                  : 'bg-transparent border-[#DCCCAC]/60 text-[#546B41]/65 hover:border-[#99AD7A]/45 hover:text-[#546B41]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ Projects ══════════ */}
      <section className="py-20 bg-[#FFF8EC]">
        <div className="container mx-auto px-6">

          {/* Section header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="label-dash text-[#99AD7A] text-xs font-semibold tracking-widest uppercase mb-3 inline-flex">
                Engineering Works
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-[#2d3d24] tracking-tight leading-[0.95]">
                Selected<br />
                <span className="text-gradient-forest">Projects</span>
              </h2>
            </div>
            <span className="section-num opacity-40">
              {String(visibleProjects.length).padStart(2, '0')}
            </span>
          </div>

          {/* Featured project */}
          {(activeFilter === 'all' || activeFilter === 'bim') && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10 rounded-3xl overflow-hidden card-warm border border-[#546B41]/20 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Left accent strip */}
                <div className="lg:col-span-1 bg-gradient-to-b from-[#546B41] to-[#2d3d24] p-8 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="text-[#99AD7A] text-xs font-bold tracking-widest uppercase">Featured</span>
                    <div className="mt-4 text-[#FFF8EC]/15 font-black font-mono text-[5rem] leading-none">01</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {projects[0].tech.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#99AD7A]/20 border border-[#99AD7A]/30 text-[#b8c99a]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-4 p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#546B41]/10 border border-[#546B41]/25 text-[#546B41] uppercase tracking-widest">
                      BIM & Automation
                    </span>
                    <span className="text-xs text-[#546B41]/45">{projects[0].period} · {projects[0].location}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#2d3d24] mb-1 leading-tight tracking-tight group-hover:text-[#546B41] transition-colors">
                    {projects[0].title}
                  </h3>
                  <p className="text-sm text-[#99AD7A] font-semibold mb-4">{projects[0].subtitle}</p>
                  <p className="text-[#546B41]/65 text-sm leading-relaxed mb-6">{projects[0].description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {projects[0].highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#546B41]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#99AD7A] mt-1.5 flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {projects[0].tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-[#DCCCAC]/50 border border-[#DCCCAC]/70 text-[#546B41]/65">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Project list (accordion style) */}
          <div className="space-y-3">
            {visibleProjects.filter((p) => !p.featured).map((project, i) => {
              const accent = colorAccent[project.color];
              const isExpanded = expandedId === project.id;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`rounded-2xl card-warm border ${accent.border} overflow-hidden`}
                >
                  <button
                    className="w-full text-left p-6 md:p-8 flex items-start gap-6 group"
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  >
                    {/* Number */}
                    <span className={`font-black font-mono text-2xl md:text-3xl ${accent.num} flex-shrink-0 leading-none mt-0.5`}>
                      {project.num}
                    </span>

                    {/* Title block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${accent.tag}`}>
                            {tag}
                          </span>
                        ))}
                        <span className="text-[10px] text-[#546B41]/40 ml-auto">{project.period}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-[#2d3d24] group-hover:text-[#546B41] transition-colors leading-tight tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#99AD7A] font-medium mt-1">{project.subtitle} · {project.location}</p>
                    </div>

                    {/* Expand icon */}
                    <motion.span
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[#99AD7A] text-2xl font-light flex-shrink-0 mt-1"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-7 border-t border-[#DCCCAC]/40 pt-5">
                          <p className="text-[#546B41]/65 text-sm leading-relaxed mb-5">
                            {project.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
                            {project.highlights.map((h, j) => (
                              <div key={j} className="flex items-start gap-2.5 text-xs text-[#546B41]/65">
                                <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} mt-1.5 flex-shrink-0`} />
                                {h}
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tech.map((t) => (
                              <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF8EC] border border-[#DCCCAC]/70 text-[#546B41]/60">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ Teaching ══════════ */}
      {showTeaching && (
        <section className="py-20 bg-[#2d3d24] relative overflow-hidden">
          {/* Decorative ghost number */}
          <div className="absolute right-8 top-8 section-num section-num-light opacity-60 pointer-events-none select-none">
            04
          </div>

          <div className="absolute top-0 left-1/3 w-[30rem] h-[20rem] bg-[#546B41]/25 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-14">
              <span className="label-dash text-[#99AD7A] text-xs font-semibold tracking-widest uppercase mb-3 inline-flex">
                Academic Roles
              </span>
              <h2 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight">
                <span className="text-[#FFF8EC]">Teaching</span>{' '}
                <span className="text-gradient-nature">&amp; Mentoring</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teaching.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-panel-dark rounded-2xl p-7 glass-panel-dark-hover"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#99AD7A]/15 border border-[#99AD7A]/30 text-[#99AD7A] uppercase tracking-widest mb-2">
                        {role.role}
                      </span>
                      <h3 className="text-base font-bold text-[#FFF8EC] leading-snug">{role.course}</h3>
                      <p className="text-xs text-[#DCCCAC]/50 mt-0.5">{role.institution}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-[#DCCCAC]/40 block">{role.period}</span>
                      <span className="text-lg font-black font-mono text-[#99AD7A]">{role.students}</span>
                      <span className="text-[9px] text-[#DCCCAC]/35 block">students</span>
                    </div>
                  </div>
                  <div className="divider-organic mb-4" />
                  <div className="flex flex-wrap gap-1.5">
                    {role.topics.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#DCCCAC]/08 border border-[#DCCCAC]/15 text-[#DCCCAC]/55">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ CTA ══════════ */}
      <section className="py-20 bg-[#FFF8EC]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="label-dash text-[#99AD7A] text-xs font-semibold tracking-widest uppercase mb-4 inline-flex justify-center">
              Collaborate
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2d3d24] mb-4 tracking-tight leading-tight">
              Interested in <span className="text-gradient-forest">Working Together?</span>
            </h2>
            <p className="text-[#546B41]/60 mb-10 text-base leading-relaxed">
              Open to BIM engineering, structural analysis, AI research, and academic collaborations.
              Let's build something impactful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-[#546B41] text-[#FFF8EC] rounded-xl font-bold shadow-[0_0_22px_rgba(84,107,65,0.3)] hover:shadow-[0_0_38px_rgba(84,107,65,0.5)] hover:bg-[#3d5030] hover:-translate-y-1 transition-all duration-300"
              >
                Get in Touch
              </Link>
              <Link
                href="/research"
                className="px-8 py-4 bg-transparent border border-[#546B41]/30 rounded-xl font-semibold text-[#546B41] hover:bg-[#546B41]/08 hover:border-[#546B41]/55 hover:-translate-y-1 transition-all duration-300"
              >
                View Research
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
