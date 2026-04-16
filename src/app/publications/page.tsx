'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AIIcon, StructureIcon, EarthquakeIcon } from '@/components/ui/AnimatedIcons';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import Layout from '@/components/layout/LayoutFix';

type Publication = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  tags: string[];
  category: string;
  url: string;
  featured?: boolean;
};

export default function PublicationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Publications', icon: <StructureIcon size={20} /> },
    { id: 'seismic', label: 'Seismic Analysis', icon: <EarthquakeIcon size={20} /> },
    { id: 'ai', label: 'AI & Optimization', icon: <AIIcon size={20} /> },
    { id: 'sustainability', label: 'Sustainability', icon: <StructureIcon size={20} /> }
  ];

  const publications: Publication[] = [
    {
      id: 'pub-1',
      title: 'A Physics-Informed Reinforcement Learning Framework for HVAC Optimization: Thermodynamically-Constrained Deep Deterministic Policy Gradients with Simulation-Based Validation',
      authors: 'Hedayat, S.; Ziarati, T.; Manganelli, M.',
      journal: 'Energies 2025, 18, 6310. MDPI',
      year: 2025,
      doi: '10.3390/en18236310',
      abstract: 'A physics-informed reinforcement learning (PIRL) framework combining thermodynamic constraints with deep deterministic policy gradients (DDPG) for building HVAC optimization. The approach enforces physical laws during policy learning and is validated through simulation, demonstrating significant energy efficiency improvements over conventional control strategies.',
      tags: ['HVAC Optimization', 'Reinforcement Learning', 'Physics-Informed AI', 'Energy Efficiency', 'DDPG'],
      category: 'ai',
      url: 'https://doi.org/10.3390/en18236310',
      featured: true
    },
    {
      id: 'pub-2',
      title: 'Artificial Intelligence and Digital Twins for Bioclimatic Building Design: Innovations in Sustainability and Efficiency',
      authors: 'Filippova, E.; Hedayat, S.; Ziarati, T.; Manganelli, M.',
      journal: 'Energies 2025, 18, 5230. MDPI',
      year: 2025,
      doi: '10.3390/en18195230',
      abstract: 'This paper explores the integration of artificial intelligence and digital twin technology for bioclimatic building design. The research presents novel AI-driven approaches to enhance sustainability and energy efficiency through real-time digital twin simulations.',
      tags: ['Digital Twins', 'Bioclimatic Design', 'AI', 'Sustainability'],
      category: 'sustainability',
      url: 'https://doi.org/10.3390/en18195230',
      featured: true
    },
    {
      id: 'pub-3',
      title: "Iran's Seismic Puzzle: Bridging Gaps in Earthquake Emergency Planning and Public Awareness for Risk Reduction",
      authors: 'Ciampi, P.; Giannini, L.M.; Hedayat, S.; Ziarati, T.; Scarascia Mugnozza, G.',
      journal: 'Italian Journal of Engineering Geology and Environment, (1), 5–15',
      year: 2024,
      doi: '10.4408/IJEGE.2024-01.O-01',
      abstract: 'This study designed surveys across various regions of Iran to gather data on public awareness of local hazard risks, utilizing QGIS and Excel to generate detailed maps integrating demographic, geographic, and hazard data. The research also modeled a machine learning system using XGBoost, Random Forests, and LSTM algorithms to predict potential earthquakes.',
      tags: ['Seismic Risk', 'Public Awareness', 'Emergency Planning', 'Machine Learning', 'QGIS'],
      category: 'seismic',
      url: 'https://doi.org/10.4408/IJEGE.2024-01.O-01',
    },
    {
      id: 'pub-4',
      title: 'Overview of the Impact of Artificial Intelligence on the Future of Renewable Energy',
      authors: 'Ziarati, T.; Hedayat, S.; Moscatiello, C.; Sappa, G.; Manganelli, M.',
      journal: '2024 IEEE EEEIC / ICPSEurope — IEEE Conference',
      year: 2024,
      doi: '10.1109/EEEIC/ICPSEurope61470.2024.10751553',
      abstract: 'This paper explores the integration of AI with renewable energy, examining its role in promoting sustainability in smart cities. The research emphasizes creative AI-driven solutions demonstrating revolutionary potential for enhancing sustainable practices in the renewable energy sector.',
      tags: ['AI', 'Renewable Energy', 'Smart Cities', 'Sustainability'],
      category: 'sustainability',
      url: 'https://doi.org/10.1109/EEEIC/ICPSEurope61470.2024.10751553',
    }
  ];

  const filteredPublications = publications.filter(pub => {
    const categoryMatch = activeFilter === 'all' || pub.category === activeFilter;
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(t => t.length > 0);
    const searchMatch = searchTerms.length === 0 || searchTerms.every(t =>
      pub.title.toLowerCase().includes(t) ||
      pub.abstract.toLowerCase().includes(t) ||
      pub.tags.some(tag => tag.toLowerCase().includes(t))
    );
    return categoryMatch && searchMatch;
  });

  const sortedPublications = [...filteredPublications].sort((a, b) => b.year - a.year);
  const featuredPublications = publications.filter(pub => pub.featured);

  const tagColor = (category: string) => ({
    'ai': 'bg-indigo-500/15 border-indigo-500/25 text-indigo-300',
    'seismic': 'bg-rose-500/15 border-rose-500/25 text-rose-300',
    'sustainability': 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300',
  }[category] ?? 'bg-white/5 border-white/10 text-gray-400');

  return (
    <Layout>
      <PageHeader
        title="Publications"
        subtitle="Peer-reviewed journal articles and conference papers"
        imageUrl="/assets/images/publications-header.jpg"
      />

      <Container>
        <Section>
          {/* Featured publications */}
          {featuredPublications.length > 0 && activeFilter === 'all' && searchQuery === '' && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-white">Featured Publications</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPublications.map((pub, i) => (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass-panel rounded-2xl p-6 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tagColor(pub.category)} flex-shrink-0`}>
                        {pub.year}
                      </span>
                      <span className="text-[10px] text-gray-500 text-right">{pub.journal}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug">{pub.title}</h3>
                    <p className="text-xs text-indigo-300 mb-3">{pub.authors}</p>
                    <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{pub.abstract}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pub.tags.map((tag, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                      ))}
                    </div>
                    {pub.doi && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                        DOI: {pub.doi} →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filter */}
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/40"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeFilter === cat.id
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                  }`}
                >
                  {cat.icon}{cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* All publications list */}
          <h2 className="text-2xl font-bold mb-6 text-white">
            {activeFilter === 'all' ? 'All Publications' : categories.find(c => c.id === activeFilter)?.label}
            {searchQuery && ` matching "${searchQuery}"`}
            <span className="text-gray-500 text-lg ml-2">({sortedPublications.length})</span>
          </h2>

          {sortedPublications.length > 0 ? (
            <div className="space-y-5">
              {sortedPublications.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="glass-panel rounded-2xl p-6"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tagColor(pub.category)}`}>{pub.category.toUpperCase()}</span>
                    <span className="text-xs text-gray-500">{pub.year} · {pub.journal}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">{pub.title}</h3>
                  <p className="text-xs text-indigo-300 mb-3">{pub.authors}</p>
                  <p className="text-gray-400 text-sm mb-4">{pub.abstract}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pub.tags.map((tag, j) => (
                      <span key={j} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                    ))}
                  </div>
                  {pub.doi && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      DOI: {pub.doi} →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">No publications found matching your criteria.</p>
              <button
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                className="px-5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </Section>
      </Container>
    </Layout>
  );
}