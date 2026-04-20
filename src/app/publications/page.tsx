'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/LayoutFix';
import DotField from '@/components/animations/DotField';
import { AIIcon, EarthquakeIcon, StructureIcon, PublicationsIcon } from '@/components/ui/AnimatedIcons';

type PublicationCategory = 'all' | 'ai' | 'seismic' | 'sustainability';

type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  abstract: string;
  tags: string[];
  category: Exclude<PublicationCategory, 'all'>;
  featured?: boolean;
  type: 'Journal Article' | 'Conference Paper';
};

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

const categories = [
  { id: 'all' as PublicationCategory, label: 'All Publications', icon: <PublicationsIcon size={16} /> },
  { id: 'ai' as PublicationCategory, label: 'AI & Building Systems', icon: <AIIcon size={16} /> },
  { id: 'seismic' as PublicationCategory, label: 'Seismic Research', icon: <EarthquakeIcon size={16} /> },
  { id: 'sustainability' as PublicationCategory, label: 'Sustainability', icon: <StructureIcon size={16} /> },
];

const publications: Publication[] = [
  {
    id: 'hvac-pirl-2025',
    title:
      'A Physics-Informed Reinforcement Learning Framework for HVAC Optimization: Thermodynamically-Constrained Deep Deterministic Policy Gradients with Simulation-Based Validation',
    authors: 'Hedayat, S.; Ziarati, T.; Manganelli, M.',
    venue: 'Energies 2025, 18, 6310. MDPI',
    year: 2025,
    doi: '10.3390/en18236310',
    abstract:
      'A physics-informed reinforcement learning framework for HVAC optimization that combines thermodynamic constraints with deep deterministic policy gradients and simulation-based validation for building systems.',
    tags: ['Physics-Informed RL', 'HVAC Optimization', 'DDPG', 'Building Systems'],
    category: 'ai',
    featured: true,
    type: 'Journal Article',
  },
  {
    id: 'digital-twins-2025',
    title:
      'Artificial Intelligence and Digital Twins for Bioclimatic Building Design: Innovations in Sustainability and Efficiency',
    authors: 'Filippova, E.; Hedayat, S.; Ziarati, T.; Manganelli, M.',
    venue: 'Energies 2025, 18, 5230. MDPI',
    year: 2025,
    doi: '10.3390/en18195230',
    abstract:
      'A study on artificial intelligence and digital twins for bioclimatic building design, focusing on sustainability, efficiency, and design-oriented performance feedback.',
    tags: ['Digital Twins', 'Bioclimatic Design', 'AI', 'Sustainability'],
    category: 'sustainability',
    featured: true,
    type: 'Journal Article',
  },
  {
    id: 'iran-seismic-puzzle-2024',
    title: "Iran's Seismic Puzzle: Bridging Gaps in Earthquake Emergency Planning and Public Awareness for Risk Reduction",
    authors: 'Ciampi, P.; Giannini, L. M.; Hedayat, S.; Ziarati, T.; Scarascia Mugnozza, G.',
    venue: 'Italian Journal of Engineering Geology and Environment, (1), 5-15',
    year: 2024,
    doi: '10.4408/IJEGE.2024-01.O-01',
    abstract:
      'A publication focused on earthquake emergency planning, public awareness, and risk reduction, connecting seismic knowledge, mapping, and predictive analysis.',
    tags: ['Seismic Risk', 'Emergency Planning', 'Public Awareness', 'Risk Reduction'],
    category: 'seismic',
    type: 'Journal Article',
  },
  {
    id: 'renewable-energy-ai-2024',
    title: 'Overview of the Impact of Artificial Intelligence on the Future of Renewable Energy',
    authors: 'Ziarati, T.; Hedayat, S.; Moscatiello, C.; Sappa, G.; Manganelli, M.',
    venue: '2024 IEEE EEEIC / ICPSEurope',
    year: 2024,
    doi: '10.1109/EEEIC/ICPSEurope61470.2024.10751553',
    abstract:
      'A conference paper examining how artificial intelligence is shaping renewable energy systems, sustainability transitions, and future engineering practice.',
    tags: ['Renewable Energy', 'AI', 'IEEE', 'Sustainability'],
    category: 'sustainability',
    type: 'Conference Paper',
  },
];

const categoryStyles: Record<Exclude<PublicationCategory, 'all'>, { badge: string; pill: string }> = {
  ai: {
    badge: 'bg-[#546B41]/10 border-[#546B41]/25 text-[#546B41]',
    pill: 'tag-forest',
  },
  seismic: {
    badge: 'bg-[#DCCCAC]/40 border-[#DCCCAC]/75 text-[#7a6040]',
    pill: 'tag-beige',
  },
  sustainability: {
    badge: 'bg-[#99AD7A]/14 border-[#99AD7A]/30 text-[#3d5030]',
    pill: 'tag-sage',
  },
};

export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState<PublicationCategory>('all');
  const [query, setQuery] = useState('');

  const filteredPublications = useMemo(() => {
    const terms = query.toLowerCase().split(' ').filter(Boolean);

    return publications
      .filter((publication) => activeFilter === 'all' || publication.category === activeFilter)
      .filter((publication) => {
        if (terms.length === 0) return true;

        const haystack = [
          publication.title,
          publication.authors,
          publication.abstract,
          publication.venue,
          publication.doi,
          ...publication.tags,
        ]
          .join(' ')
          .toLowerCase();

        return terms.every((term) => haystack.includes(term));
      })
      .sort((a, b) => b.year - a.year);
  }, [activeFilter, query]);

  const featuredPublications = publications.filter((publication) => publication.featured);

  return (
    <Layout>
      <section className="relative min-h-[82vh] flex items-center bg-[#1e2d14] overflow-hidden">
        <div className="absolute inset-0">
          <DotField
            gradientFrom="rgba(84,107,65,0.46)"
            gradientTo="rgba(153,173,122,0.26)"
            glowColor="#1e2d14"
            dotSpacing={20}
            dotRadius={1.15}
            bulgeStrength={60}
            waveAmplitude={0}
          />
        </div>

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="publications-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 56 L 56 0" fill="none" stroke="#99AD7A" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#publications-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[14%] left-[12%] w-[34rem] h-[34rem] rounded-full bg-[#546B41]/26 blur-[150px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[26rem] h-[26rem] rounded-full bg-[#99AD7A]/14 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-14 items-end">
            <div>
              <motion.div {...fadeUp()} className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-[#99AD7A]/45" />
                <span className="text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase">
                  Published Work
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="font-black leading-[0.9] tracking-[-0.05em] mb-7"
              >
                <span className="block text-[clamp(3.9rem,10vw,8.2rem)] text-[#FFF8EC]">Publications</span>
                <span className="block text-[clamp(3.9rem,10vw,8.2rem)] text-gradient-nature">
                  & Papers
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.18)}
                className="max-w-2xl text-base md:text-lg leading-relaxed text-[#DCCCAC]/68"
              >
                A focused archive of journal articles and conference papers spanning physics-informed
                AI, digital twins, seismic risk, and sustainable building engineering.
              </motion.p>

              <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row gap-4 mt-9">
                <a
                  href="https://scholar.google.com/scholar?q=Sattar+Hedayat"
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 bg-[#99AD7A] text-[#1e2d14] rounded-xl font-bold text-sm shadow-[0_0_28px_rgba(153,173,122,0.35)] hover:bg-[#b8c99a] hover:-translate-y-1 transition-all duration-300"
                >
                  Explore Papers
                </a>
                <Link
                  href="/research"
                  className="px-7 py-3.5 border border-[#99AD7A]/25 text-[#DCCCAC] rounded-xl font-semibold text-sm hover:border-[#99AD7A]/50 hover:bg-[#546B41]/25 hover:-translate-y-1 transition-all duration-300"
                >
                  Back to Research
                </Link>
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.34)} className="grid grid-cols-2 gap-4">
              {[
                { label: 'Selected Publications', value: '04' },
                { label: 'Journal Articles', value: '03' },
                { label: 'Conference Papers', value: '01' },
                { label: 'Latest Publication Year', value: '2025' },
              ].map((item) => (
                <div key={item.label} className="glass-panel-dark rounded-2xl p-5 min-h-[120px] flex flex-col justify-between">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#DCCCAC]/38">
                    {item.label}
                  </div>
                  <div className="stat-callout text-4xl text-[#99AD7A]">{item.value}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-28 bg-[#FFF8EC] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px divider-organic" />
        <div className="absolute -top-16 right-0 w-[44rem] h-[44rem] rounded-full bg-[#99AD7A]/08 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <motion.div {...fadeUpView()}>
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Featured Work
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-[#1e2d14] leading-tight">
                Recent journal
                <br />
                <span className="text-gradient-forest">highlights.</span>
              </h2>
            </motion.div>
            <motion.p
              {...fadeUpView(0.1)}
              className="max-w-lg text-sm md:text-base leading-relaxed text-[#546B41]/62"
            >
              The featured pair shows the current research direction most clearly: intelligent
              building systems, digital twins, and engineering use cases for AI.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {featuredPublications.map((publication, index) => (
              <motion.article
                key={publication.id}
                {...fadeUpView(index * 0.1)}
                className="group rounded-3xl card-warm p-8 overflow-hidden relative hover:shadow-nature-lg transition-all duration-300"
                whileHover={{ y: -6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#546B41]/06 via-transparent to-[#DCCCAC]/18 opacity-80 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="tag tag-beige">{publication.year}</span>
                    <span className={`tag ${categoryStyles[publication.category].pill}`}>
                      {publication.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1e2d14] leading-snug mb-3 group-hover:text-[#546B41] transition-colors">
                    {publication.title}
                  </h3>
                  <p className="text-sm text-[#99AD7A] mb-3 font-semibold leading-relaxed">{publication.authors}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#546B41]/42 mb-4">{publication.venue}</p>
                  <p className="text-sm leading-relaxed text-[#546B41]/62 mb-6">{publication.abstract}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {publication.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[10px] bg-[#DCCCAC]/38 border border-[#DCCCAC]/60 text-[#546B41]/68"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#546B41]"
                  >
                    Open DOI
                    <svg className="w-4 h-4 text-[#99AD7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-[#FFF8EC]">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUpView()} className="rounded-3xl card-warm p-6 md:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-[0.68fr_1.32fr] gap-8 items-start">
              <div>
                <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                  Search & Filter
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-[#1e2d14] leading-tight mb-4">
                  Navigate the
                  <br />
                  <span className="text-gradient-forest">publication archive.</span>
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-[#546B41]/62">
                  Filter by topic or search by title, author, DOI, and keywords to move across the
                  publication list quickly.
                </p>
              </div>

              <div>
                <div className="relative mb-5">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99AD7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by title, author, topic, or DOI..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FFF8EC] border border-[#DCCCAC]/70 text-[#2d3d24] placeholder-[#546B41]/35 text-sm outline-none focus:border-[#99AD7A] focus:ring-2 focus:ring-[#99AD7A]/20 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        activeFilter === category.id
                          ? 'bg-[#546B41] border-[#546B41] text-[#FFF8EC]'
                          : 'bg-[#FFF8EC] border-[#DCCCAC]/70 text-[#546B41]/70 hover:border-[#99AD7A]/50 hover:text-[#546B41]'
                      }`}
                    >
                      {category.icon}
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-28 bg-[#2d3d24] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[40rem] h-[40rem] rounded-full bg-[#546B41]/28 blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#99AD7A]/12 blur-[120px]" />
        </div>

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="publication-list-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#FFF8EC" strokeWidth="0.55" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#publication-list-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div {...fadeUpView()}>
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Archive
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-[#FFF8EC] leading-tight">
                Full
                <br />
                <span className="text-gradient-nature">publication list.</span>
              </h2>
            </motion.div>
            <motion.div {...fadeUpView(0.08)} className="glass-panel-dark rounded-2xl px-5 py-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#DCCCAC]/38">Results</div>
              <div className="stat-callout text-3xl text-[#99AD7A]">{filteredPublications.length}</div>
            </motion.div>
          </div>

          {filteredPublications.length > 0 ? (
            <div className="space-y-4">
              {filteredPublications.map((publication, index) => {
                const style = categoryStyles[publication.category];

                return (
                  <motion.article
                    key={publication.id}
                    {...fadeUpView(index * 0.06)}
                    className="group rounded-3xl glass-panel-dark p-6 md:p-8 overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                      <div className="lg:w-40 flex-shrink-0">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#99AD7A] font-bold mb-2">
                          {publication.year}
                        </div>
                        <div className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-bold ${style.badge}`}>
                          {publication.type}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`tag ${style.pill}`}>
                            {publication.category === 'ai'
                              ? 'AI'
                              : publication.category === 'seismic'
                                ? 'Seismic'
                                : 'Sustainability'}
                          </span>
                          <span className="text-xs text-[#DCCCAC]/42">{publication.venue}</span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-[#FFF8EC] leading-snug mb-2 group-hover:text-[#b8c99a] transition-colors">
                          {publication.title}
                        </h3>
                        <p className="text-sm text-[#99AD7A] font-semibold mb-4 leading-relaxed">{publication.authors}</p>
                        <p className="text-sm leading-relaxed text-[#DCCCAC]/63 mb-5">{publication.abstract}</p>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {publication.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-full text-[10px] bg-[#DCCCAC]/08 border border-[#DCCCAC]/14 text-[#DCCCAC]/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={`https://doi.org/${publication.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#99AD7A]"
                        >
                          DOI: {publication.doi}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <motion.div {...fadeUpView()} className="glass-panel-dark rounded-3xl p-12 text-center">
              <p className="text-[#DCCCAC]/55 text-sm mb-5">No publications match the current filter or search.</p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setQuery('');
                }}
                className="px-6 py-3 rounded-xl border border-[#99AD7A]/25 text-[#99AD7A] text-sm font-semibold hover:bg-[#546B41]/25 transition-all duration-300"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section className="relative pt-20 pb-8 md:pt-24 md:pb-10 bg-[#546B41] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="publication-cta-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 0 L 56 56" fill="none" stroke="#FFF8EC" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#publication-cta-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#99AD7A]/18 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#2d3d24]/45 blur-[110px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUpView()} className="glass-panel-dark rounded-3xl p-10 md:p-12 max-w-4xl mx-auto text-center">
            <p className="label-dash justify-center text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-6">
              Continue Exploring
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#FFF8EC] leading-tight mb-5">
              Read the research context
              <br />
              <span className="text-gradient-nature">behind the papers.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base leading-relaxed text-[#DCCCAC]/65 mb-10">
              Move back into the research page or into the project archive to see how the published
              work connects to BIM coordination, structural engineering, and applied automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/research"
                className="px-8 py-4 bg-[#FFF8EC] text-[#1e2d14] rounded-xl font-bold hover:bg-[#DCCCAC] hover:-translate-y-1 transition-all duration-300"
              >
                View Research
              </Link>
              <Link
                href="/works"
                className="px-8 py-4 border border-[#99AD7A]/24 text-[#FFF8EC] rounded-xl font-semibold hover:bg-[#2d3d24]/28 hover:border-[#99AD7A]/45 hover:-translate-y-1 transition-all duration-300"
              >
                See Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
