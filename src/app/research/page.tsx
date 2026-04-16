'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PredictiveModels from '@/components/ai/PredictiveModels';
import ResearchAssistant from '@/components/ai/ResearchAssistant';
import PublicationCard from '@/components/publications/PublicationCard';
import { AIIcon, EarthquakeIcon, StructureIcon, AnalysisIcon } from '@/components/ui/AnimatedIcons';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import Layout from '@/components/layout/LayoutFix';

export default function ResearchPage() {
  // Research areas
  const researchAreas = [
    {
      title: 'BIM Coordination & Automation',
      icon: <AnalysisIcon size={32} />,
      description: 'Leading multidisciplinary BIM coordination for infrastructure and public-sector projects. Developer of a pyRevit-based BIM automation platform for CME, 4D scheduling, and AI-assisted prezzario mapping.',
      topics: [
        'Multi-disciplinary coordination (Architecture, Structure, MEP, Infrastructure)',
        'Clash detection & resolution in Navisworks',
        'LOD 200–400 model development in Revit',
        'Scan-to-BIM workflows with Recap Pro & CloudCompare',
        'Python & Dynamo BIM automation (CME, scheduling, families)',
        'ISO 19650 & UNI 11337 compliance'
      ]
    },
    {
      title: 'AI in Structural Engineering',
      icon: <AIIcon size={32} />,
      description: 'Applying physics-informed AI, digital twins, and deep reinforcement learning to structural health monitoring, HVAC optimization, and seismic hazard prediction.',
      topics: [
        'Physics-informed RL (DDPG) for HVAC optimization',
        'Digital twins for bioclimatic building design',
        'XGBoost & LSTM for earthquake prediction',
        'CNN-LSTM networks for environmental monitoring',
        'Graph neural networks for structural anomaly detection',
        'Remote structural health monitoring'
      ]
    },
    {
      title: 'Seismic Analysis & Structural Resilience',
      icon: <EarthquakeIcon size={32} />,
      description: 'Comprehensive seismic hazard assessment, structural vulnerability analysis, and real physics-driven SDOF simulation for building response prediction.',
      topics: [
        'SDOF Newmark-β numerical integration',
        'Kanai-Tajimi stochastic ground motion generation',
        'EC8 soil classification & amplification effects',
        'ETABS drift analysis & SAFE foundation design',
        'Building damage assessment (2017 Kermanshah case study)',
        'Seismic signal processing & QGIS geospatial analysis'
      ]
    },
    {
      title: 'Sustainability & BIM-based Renovation',
      icon: <StructureIcon size={32} />,
      description: 'Combining Building Information Modeling with sustainability goals for heritage structures, adaptive reuse, and energy-efficient building design.',
      topics: [
        'H-BIM for historic structures (SNIA Viscosa factory, Rieti)',
        'BIM-based sustainable renovation workflows',
        'Adaptive reuse and urban regeneration',
        'Cost-carbon twin tracking in BIM workflows',
        'Renewable energy AI integration',
        'Bioclimatic design optimization'
      ]
    }
  ];

  // Featured research papers from CV
  const featuredPapers = [
    {
      title: 'A Physics-Informed Reinforcement Learning Framework for HVAC Optimization: Thermodynamically-Constrained DDPG with Simulation-Based Validation',
      authors: 'Hedayat, S.; Ziarati, T.; Manganelli, M.',
      journal: 'Energies 2025, 18, 6310. MDPI',
      year: 2025,
      abstract: 'A physics-informed reinforcement learning (PIRL) framework combining thermodynamic constraints with DDPG for building HVAC optimization, validated through simulation with significant energy efficiency gains.',
      tags: ['HVAC Optimization', 'Physics-Informed RL', 'DDPG', 'Energy Efficiency'],
      imageUrl: '/assets/images/publications/seismic-puzzle.jpg',
      url: 'https://doi.org/10.3390/en18236310'
    },
    {
      title: 'Artificial Intelligence and Digital Twins for Bioclimatic Building Design: Innovations in Sustainability and Efficiency',
      authors: 'Filippova, E.; Hedayat, S.; Ziarati, T.; Manganelli, M.',
      journal: 'Energies 2025, 18, 5230. MDPI',
      year: 2025,
      abstract: 'Integration of AI and digital twin technology for bioclimatic building design to enhance sustainability and energy efficiency through real-time simulations.',
      tags: ['Digital Twins', 'Bioclimatic Design', 'AI', 'Sustainability'],
      imageUrl: '/assets/images/publications/bridge-monitoring.jpg',
      url: 'https://doi.org/10.3390/en18195230'
    },
    {
      title: "Iran's Seismic Puzzle: Bridging Gaps in Earthquake Emergency Planning and Public Awareness for Risk Reduction",
      authors: 'Ciampi, P.; Giannini, L.M.; Hedayat, S.; Ziarati, T.; Scarascia Mugnozza, G.',
      journal: 'Italian Journal of Engineering Geology and Environment, 2024',
      year: 2024,
      abstract: 'Survey-based study on public seismic risk awareness in Iran using QGIS mapping and ML (XGBoost, Random Forests, LSTM) for earthquake prediction.',
      tags: ['Seismic Risk', 'Public Awareness', 'Machine Learning', 'QGIS'],
      imageUrl: '/assets/images/publications/seismic-vulnerability.jpg',
      url: 'https://doi.org/10.4408/IJEGE.2024-01.O-01'
    }
  ];

  return (
    <Layout>
      <PageHeader
        title="Research"
        subtitle="Exploring the frontiers of BIM automation, structural engineering, seismic analysis, and AI integration"
        imageUrl="/assets/images/research-header.jpg"
      />

      <Container>
        {/* Research Areas */}
        <Section>
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Research Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="glass-panel glass-panel-hover rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4 text-indigo-400">
                      {area.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{area.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">
                    {area.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2 text-xs uppercase tracking-widest text-indigo-400/70">
                      Key Focus Areas
                    </h4>
                    <ul className="space-y-1">
                      {area.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* AI-Enhanced Section */}
        <Section className="py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">AI-Enhanced Structural Analysis</h2>
            <p className="text-lg text-gray-400 mb-6">
              Predictive models that combine artificial intelligence with structural engineering principles.
            </p>
            <div className="glass-panel rounded-2xl p-6">
              <PredictiveModels
                initialModelType="displacement"
                height="500px"
              />
            </div>
          </div>
        </Section>

        {/* Featured Papers */}
        <Section>
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPapers.map((paper, index) => (
                <PublicationCard
                  key={index}
                  publication={paper}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="/publications"
                className="inline-block px-6 py-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold hover:bg-indigo-500/25 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                View All Publications →
              </a>
            </div>
          </div>
        </Section>

        {/* Research Assistant */}
        <Section className="py-16">
          <div>
            <h2 className="text-3xl font-bold mb-2">Research Assistant</h2>
            <p className="text-lg text-gray-400 mb-6">
              Use the AI-powered research assistant to explore my research database and find relevant publications.
            </p>
            <div className="glass-panel rounded-2xl p-6">
              <ResearchAssistant />
            </div>
          </div>
        </Section>
      </Container>
    </Layout>
  );
}