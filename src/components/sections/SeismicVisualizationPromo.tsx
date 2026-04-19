import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/**
 * A promotional component for the enhanced seismic visualization
 * to be featured on the homepage.
 */
const SeismicVisualizationPromo: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#09101d] py-24 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-10 h-56 w-56 rounded-full bg-violet-700/12 blur-[110px]" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-[90px]" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-panel rounded-3xl border border-white/5 p-8 md:p-10">
          <div className="flex flex-col items-center md:flex-row">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-300">Featured Demo</span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Interactive Seismic Response Lab</h2>
            <p className="mb-6 text-lg text-gray-300">
              Explore a physics-driven seismic demo built around SDOF response, drift-based visual feedback,
              and live parameter controls for magnitude, damping, distance, and soil conditions.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 mr-2 h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Newmark-beta solver</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 mr-2 h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Drift heatmap feedback</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 mr-2 h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>EC8 soil presets</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 mr-2 h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Interactive engineering UI</span>
              </div>
            </div>
            
            <Link 
              href="/interactive-model" 
              className="inline-block rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-cyan-400"
            >
              Open Interactive Lab
            </Link>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/assets/images/seismic-visualization-preview.jpg"
                alt="Interactive seismic response lab"
                width={600}
                height={400}
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400/111827/FFFFFF?text=Seismic+Lab";
                }}
              />
              
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#050816]/80 to-transparent">
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="ml-2 text-xs text-gray-200">Engineering Simulation</span>
                  </div>
                  <div className="rounded bg-slate-950/55 p-2 text-sm backdrop-blur-sm">
                    <p className="font-mono">PGA: 0.32g | Max drift: 2.1% | Roof delta: 42.7cm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-4 -top-4 rotate-12 rounded-full bg-violet-400 px-3 py-1 text-xs font-bold text-slate-950">
              Physics Driven
            </div>
            
            <div className="absolute -bottom-3 -left-3 rounded-full bg-white p-2 text-cyan-600 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SeismicVisualizationPromo; 
