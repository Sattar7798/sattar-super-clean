'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import Timeline from '@/components/ui/Timeline';
import { StructureIcon, EarthquakeIcon, AIIcon, AnalysisIcon } from '@/components/ui/AnimatedIcons';
import Layout from '@/components/layout/LayoutFix';
import Link from 'next/link';

export default function AboutPage() {
  const expertise = [
    {
      title: 'BIM Coordination & Automation',
      icon: <StructureIcon size={28} />,
      description: 'Lead multidisciplinary BIM coordination for infrastructure and public-sector projects in Italy, with expertise in Revit, Navisworks, AutoCAD, Civil 3D, and Recap Pro.',
      skills: ['Revit (LOD 200–400)', 'Navisworks Clash Detection', 'Civil 3D & Toposolid', 'Scan-to-BIM (Recap Pro + CloudCompare)', 'ISO 19650 / UNI 11337', 'BEP / Piano di Gestione Informativa']
    },
    {
      title: 'Structural Engineering',
      icon: <EarthquakeIcon size={28} />,
      description: 'Structural analysis and seismic assessment with focus on building vulnerability, foundation design, and code compliance.',
      skills: ['ETABS (drift & lateral load)', 'SAFE (foundation design)', 'SAP2000 / ABAQUS', 'Seismic Hazard Assessment', 'Structural Vulnerability Analysis', 'Seismic Signal Processing']
    },
    {
      title: 'BIM Automation & Programming',
      icon: <AnalysisIcon size={28} />,
      description: 'Developer of a production-grade pyRevit BIM automation platform covering CME, AI-assisted prezzario mapping, 4D scheduling, and executive reporting.',
      skills: ['Python (pyRevit, plugin dev)', 'Dynamo (tagging, scheduling, geometry)', 'AI-assisted prezzario mapping', 'Computo Metrico Estimativo (CME)', '4D/5D BIM workflows', 'Custom Revit family development']
    },
    {
      title: 'AI & Data Science',
      icon: <AIIcon size={28} />,
      description: 'Applying machine learning and physics-informed AI to structural health monitoring, HVAC optimization, and seismic hazard prediction.',
      skills: ['TensorFlow / PyTorch / Keras', 'NumPy / pandas / Matplotlib', 'scikit-learn', 'Reinforcement Learning (DDPG)', 'QGIS / ArcGIS', 'React / Three.js / JavaScript']
    }
  ];

  const education = [
    {
      year: '2024 – 2026',
      degree: 'Master in Sustainable Building Engineering',
      institution: 'Sapienza University, Rome, Italy',
      description: 'Ongoing. Research focus on BIM automation, seismic resilience, and AI applications in structural engineering.',
      achievements: []
    },
    {
      year: '2021 – 2024',
      degree: 'B.Sc. in Sustainable Building Engineering',
      institution: 'Sapienza University, Rome, Italy',
      description: 'Thesis: Seismic Hazard and Structural Vulnerability: A Study of Building Damage in the 2017 Kermanshah Earthquake',
      achievements: ['CGPA: 3.86 / 4.0', 'Ranked 2nd among 90 students', 'Among the first to complete the program on schedule']
    }
  ];

  const career = [
    {
      years: '2025 – Present',
      position: 'BIM Coordinator',
      organization: 'Spoeltini Studio, Rieti, Italy',
      description: 'Leading BIM coordination across multidisciplinary teams for major infrastructure and public-sector projects in Italy.',
      achievements: [
        'Led 10–15+ coordination meetings per project for Architecture, Structure, MEP, and Infrastructure teams',
        'Identified and resolved 10–20+ clashes per project cycle using Navisworks, Revit, and MS Project; commended by SPERI management for precision',
        'Developed high-detail Revit models at LOD 200–400 per BEP specifications',
        'Processed point cloud data with Autodesk Recap Pro and CloudCompare for Scan-to-BIM workflows',
        'Built custom pyRevit/Dynamo automation tools for computo metrico and quantity take-off workflows',
        'Delivered full 4D/5D BIM on AMA Roma and Via Salaria: WBS, prezzario codes, durations, cost data linked to model elements via Shared Parameters',
        'Selected projects: Baiano (LEONARDO), AMA Roma (SPERI), Via Salaria (SPERI), Bocconi Scuola Milano, Forze Armate Milano, Poggio Vitellino Amatrice, Municipio Roma Scuola'
      ]
    },
    {
      years: '2025 – Present',
      position: 'BIM Coordinator — External Collaboration',
      organization: 'SPERI S.p.A, Rome, Italy',
      description: 'Direct collaboration with SPERI managers on major infrastructure projects requiring advanced BIM coordination support.',
      achievements: [
        'Supported clash detection, model validation, and multidisciplinary coordination',
        'Contributed to Via Salaria strategic infrastructure project with SAL-based follow-up',
        'Entrusted with projects requiring reliable, precision BIM coordination'
      ]
    },
    {
      years: '2023 – 2025',
      position: 'BIM Coordinator & Structural Engineer',
      organization: 'Peyvand Baft Pars, Tehran, Iran',
      description: 'Full BIM coordination and structural engineering for a 10-story research and technology building at Vardavard Technology Park, West Tehran.',
      achievements: [
        'Coordinated dual-access design for two independent tenants from floor 4 upward',
        'Produced full Revit BIM models with Shared Parameters; executed 4D/5D workflows in Navisworks',
        'Performed ETABS drift analysis and SAFE foundation design alongside BIM coordination',
        'Delivered final models and documentation to client in a two-person team'
      ]
    },
    {
      years: '2023 – 2026',
      position: 'Research Assistant',
      organization: 'Sapienza University of Rome, Italy',
      description: 'Contributing to research reports, conference papers, and journal articles in engineering, sustainability, and digital innovation.',
      achievements: []
    },
    {
      years: '2023 – 2024',
      position: 'Peer Reviewer — EEEIC 2025 Conference',
      organization: '',
      description: 'Selected as a reviewer for EEEIC 2025; evaluated submitted academic papers for quality, relevance, and scientific rigor.',
      achievements: []
    },
    {
      years: '2020 – 2021',
      position: 'Education Consultant',
      organization: 'Venous Institute',
      description: 'Mathematics instructor and education consultant supporting students in planning their educational paths.',
      achievements: []
    },
    {
      years: '2017 – 2020',
      position: 'Architectural Designer',
      organization: '',
      description: 'Architectural design projects using AutoCAD and 3ds Max.',
      achievements: []
    },
    {
      years: '2018 – 2019',
      position: 'Civil Engineering Intern',
      organization: 'Khaf Steel Company, Iran',
      description: 'Civil engineering internship focused on practical engineering workflows and construction environments.',
      achievements: []
    }
  ];

  const awards = [
    { year: 2024, title: 'Ranked 2nd in Sustainable Building Engineering', description: 'Ranked 2nd among 90 Sustainable Building Engineering students at Sapienza University.' },
    { year: 2024, title: 'First to Complete Program On Schedule', description: 'Among the first students in the program to complete the Bachelor\'s degree on schedule at Sapienza University.' },
    { year: 2017, title: 'Outstanding Student Award', description: 'Ranked 1st among 100+ students at Salam High School, Iran.' },
    { year: 2017, title: 'Iranian University Entrance Exam', description: 'Ranked 261 out of 170,000+ candidates in the highly competitive national exam.' },
    { year: 2014, title: 'Mathematics Olympiad — First Stage', description: 'Qualified in the first stage of the Iranian Mathematics Olympiad among 12,000 candidates.' }
  ];

  const languages = [
    { lang: 'Persian', level: 'Native', pct: 100 },
    { lang: 'English', level: 'Professional', pct: 90 },
    { lang: 'Italian', level: 'A2 — In Progress', pct: 30 },
    { lang: 'French', level: 'Basic', pct: 15 },
  ];

  const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay }, viewport: { once: true } });

  return (
    <Layout>
      <PageHeader
        title="About Me"
        subtitle="BIM Coordinator · BIM Automation Engineer · Structural Engineer · Sapienza University Research Assistant"
        imageUrl="/assets/images/about-header.jpg"
      />

      <Container>
        {/* ── Bio ── */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div {...fade()}>
              <h2 className="text-3xl font-bold mb-6">Professional Background</h2>
              <p className="text-gray-300 mb-4">
                BIM Coordinator with hands-on experience in large-scale infrastructure, public, and building projects in Italy,
                collaborating with <strong className="text-indigo-300">SPERI S.p.A</strong> and{' '}
                <strong className="text-indigo-300">Spoeltini Studio</strong>. Specialized in multidisciplinary coordination
                across Architecture, Structure, MEP, and Infrastructure, with advanced expertise in clash detection,
                model development, and BIM-based workflows.
              </p>
              <p className="text-gray-300 mb-4">
                Developer of a production-grade{' '}
                <strong className="text-cyan-300">BIM Automation Platform</strong> (pyRevit-based) covering automated
                CME/computo metrico, AI-assisted prezzario mapping, 4D scheduling, cost-carbon tracking, and
                tender-grade reporting — reducing a process that took up to one week to under one day.
              </p>
              <p className="text-gray-300">
                Master's student at <strong className="text-indigo-300">Sapienza University of Rome</strong>,
                active researcher, peer reviewer for EEEIC 2025, and web developer with delivered projects for
                engineering and architecture firms.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Revit', 'Navisworks', 'Civil 3D', 'Python', 'Dynamo', 'ETABS', 'SAFE', 'ISO 19650'].map(s => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">{s}</span>
                ))}
              </div>
            </motion.div>

            <motion.div {...fade(0.2)} className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Languages</h3>
              <div className="space-y-4">
                {languages.map(l => (
                  <div key={l.lang}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-white">{l.lang}</span>
                      <span className="text-gray-400">{l.level}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${l.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/5">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Location</h3>
                <p className="text-gray-300">📍 Rieti, Italy</p>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* ── Expertise ── */}
        <Section className="py-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Areas of Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((area, i) => (
              <motion.div key={i} {...fade(i * 0.1)} className="glass-panel glass-panel-hover rounded-2xl p-6">
                <div className="text-indigo-400 mb-4">{area.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-white">{area.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{area.description}</p>
                <ul className="space-y-1">
                  {area.skills.map((s, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Education ── */}
        <Section>
          <h2 className="text-3xl font-bold mb-8">Education</h2>
          <Timeline items={education.map(edu => ({
            time: edu.year,
            title: edu.degree,
            subtitle: edu.institution,
            content: (
              <div>
                <p className="mb-2 text-gray-300">{edu.description}</p>
                {edu.achievements.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1 mt-2">
                    {edu.achievements.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            )
          }))} />
        </Section>

        {/* ── Career ── */}
        <Section className="py-16">
          <h2 className="text-3xl font-bold mb-8">Professional Experience</h2>
          <Timeline items={career.map(exp => ({
            time: exp.years,
            title: exp.position,
            subtitle: exp.organization,
            content: (
              <div>
                <p className="mb-2 text-gray-300">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1 mt-2">
                    {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            )
          }))} />
        </Section>

        {/* ── Awards ── */}
        <Section>
          <h2 className="text-3xl font-bold mb-8">Honors & Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awards.map((award, i) => (
              <motion.div key={i} {...fade(i * 0.07)} className="glass-panel rounded-xl p-5 flex items-start gap-4">
                <div className="px-3 py-1.5 rounded-lg text-xs font-black text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 flex-shrink-0">{award.year}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{award.title}</h3>
                  <p className="text-gray-400 text-sm">{award.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── CTA ── */}
        <Section className="py-16">
          <div className="glass-panel rounded-3xl p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Get in Touch</h2>
            <p className="text-gray-400 mb-8">
              I welcome collaboration on BIM coordination, structural engineering research, and AI-driven engineering automation.
            </p>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-300 inline-block"
            >
              Contact Me
            </Link>
          </div>
        </Section>
      </Container>
    </Layout>
  );
}