'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/LayoutFix';
import BuildingAnimation from '@/components/animations/BuildingAnimation';
import DotField from '@/components/animations/DotField';
import Link from 'next/link';
import SeismicVisualizationPromo from '@/components/sections/SeismicVisualizationPromo';

export default function Home() {
  return (
    <Layout>
      {/* ══════════ Hero Section with DotField ══════════ */}
      <section className="relative min-h-[100vh] flex items-center justify-center bg-[#0d0618] text-gray-200 overflow-hidden pt-16">
        {/* DotField animated canvas background */}
        <div className="absolute inset-0 w-full h-full">
          <DotField
            gradientFrom="rgba(124, 58, 237, 0.45)"
            gradientTo="rgba(6, 182, 212, 0.3)"
            glowColor="#0d0618"
            dotSpacing={16}
            dotRadius={1.5}
            bulgeStrength={80}
            waveAmplitude={0}
          />
        </div>

        {/* Deep glows layered on top of DotField */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-violet-700/20 rounded-full mix-blend-screen filter blur-[140px] animate-blob" />
          <div className="absolute top-1/3 right-1/5 w-[28rem] h-[28rem] bg-cyan-500/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-[22rem] h-[22rem] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-6 z-10 text-center relative mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium tracking-widest uppercase">
              Advanced Structural Analytics
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Sattar{' '}
            <span className="text-gradient-neon">Hedayat</span>
          </motion.h1>
          
          <motion.h2
            className="text-2xl md:text-3xl mb-8 text-gray-400 font-light tracking-wide max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            BIM Coordinator &{' '}
            <span className="text-gray-200 font-medium">Structural Engineer & AI Researcher</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl mx-auto mt-10"
          >
            <p className="text-lg md:text-xl text-gray-500 mb-12">
              BIM Automation Engineer and structural specialist based in Rieti, Italy.
              Delivering large-scale BIM coordination, real physics-driven seismic simulations,
              and AI-powered engineering tools that push the frontier of building resilience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/research"
                className="px-8 py-4 bg-violet-600 rounded-xl font-semibold text-white shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] hover:bg-violet-500 hover:-translate-y-1 transition-all duration-300"
              >
                Explore Research
              </Link>
              <Link
                href="/interactive-model"
                className="px-8 py-4 bg-dark-lighter/50 backdrop-blur-md border border-violet-500/20 rounded-xl font-semibold text-white hover:bg-violet-950/30 hover:border-violet-400/40 hover:-translate-y-1 transition-all duration-300"
              >
                Interactive Models
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="animate-bounce p-3 rounded-full bg-violet-950/50 backdrop-blur-md border border-violet-500/20"
          >
            <svg className="w-5 h-5 text-violet-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Research Focus Section */}
      <section className="py-32 relative bg-[#0b1120]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Research Focus</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              My research combines structural engineering principles with advanced computational methods and AI
              to develop innovative solutions for building resilience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Research Area 1 */}
            <motion.div 
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-56 bg-dark-lighter/80 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"/>
                <div className="relative z-10 scale-[0.8] opacity-80 group-hover:scale-[0.9] group-hover:opacity-100 transition-all duration-500">
                  <BuildingAnimation />
                </div>
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Seismic Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Designing machine learning algorithms for earthquake prediction using XGBoost, Random Forests, and LSTM, with a focus on early warning systems and structural vulnerability assessment.
                </p>
              </div>
            </motion.div>
            
            {/* Research Area 2 */}
            <motion.div 
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="h-56 bg-dark-lighter/80 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                 <div className="absolute inset-0 bg-gradient-to-br from-tertiary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"/>
                <svg className="w-24 h-24 text-tertiary/70 group-hover:text-tertiary group-hover:scale-110 transition-all duration-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-tertiary/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Integration</h3>
                <p className="text-gray-400 leading-relaxed">
                  Developing AI frameworks for smart infrastructures to optimize energy efficiency, enhance health monitoring, and implement predictive maintenance systems.
                </p>
              </div>
            </motion.div>
            
            {/* Research Area 3 */}
            <motion.div 
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-56 bg-dark-lighter/80 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"/>
                <svg className="w-24 h-24 text-secondary/70 group-hover:text-secondary group-hover:scale-110 transition-all duration-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-6">
                   <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Sustainable Building</h3>
                <p className="text-gray-400 leading-relaxed">
                  Integrating BIM and smart monitoring technologies to create sustainable designs with reduced environmental impact and improved performance during seismic events.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Seismic Visualization Promo */}
      <SeismicVisualizationPromo /> 
      
      {/* Latest Publications Preview */}
      <section className="py-32 relative bg-[#0b1120] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Latest Publications</h2>
              <p className="text-xl text-gray-400">
                A selection of my recent research papers and publications in structural engineering and seismic analysis.
              </p>
            </div>
            <Link 
              href="/publications"
              className="inline-flex items-center px-6 py-3 bg-dark-lighter border border-white/10 rounded-lg text-white font-medium hover:bg-white/5 transition-colors duration-300 group whitespace-nowrap"
            >
              View All Publications
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
            {/* Publication 1 */}
            <motion.div 
              className="glass-panel p-8 rounded-2xl relative group overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-gray-300">2023</span>
                <span className="text-sm font-medium text-primary">Journal of Structural Engineering</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-light transition-colors">
                AI-Enhanced Prediction of Building Response to Seismic Events
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                This paper presents a novel approach to predicting building responses during earthquakes
                by combining traditional structural analysis with machine learning algorithms.
              </p>
              <Link href="/publications" className="text-white font-semibold inline-flex items-center group/link">
                Read Full Paper
                <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-2 transition-transform text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            
            {/* Publication 2 */}
            <motion.div 
              className="glass-panel p-8 rounded-2xl relative group overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-tertiary to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-gray-300">2022</span>
                <span className="text-sm font-medium text-tertiary">Intl. Conf. on Structural Engineering</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-tertiary transition-colors">
                Advanced Visualization Techniques for Structural Analysis
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                A comprehensive exploration of how 3D visualization and virtual reality can enhance
                our understanding of complex structural behaviors and improve design outcomes.
              </p>
              <Link href="/publications" className="text-white font-semibold inline-flex items-center group/link">
                Read Full Paper
                <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-2 transition-transform text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-32 overflow-hidden bg-[#0a0f1c]">
        {/* Abstract structural grid for CTA background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="structural-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" className="text-blue-500/30" strokeWidth="1"/>
                  <path d="M 0 0 L 60 60" fill="none" className="text-blue-300/10" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#structural-grid)" />
            </svg>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-16 rounded-3xl max-w-4xl mx-auto border-white/5"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Experience Interactive Structural Models</h2>
            <p className="text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
              Explore our interactive 3D building models with real-time seismic simulations
              and cutting-edge AI analysis tools.
            </p>
            <Link
              href="/interactive-model"
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 inline-block shadow-[0_0_35px_rgba(99,102,241,0.5)] hover:shadow-[0_0_55px_rgba(99,102,241,0.7)]"
            >
              Launch 3D Visualizations
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 