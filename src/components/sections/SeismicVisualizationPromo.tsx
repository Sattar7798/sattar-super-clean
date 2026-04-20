import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const SeismicVisualizationPromo: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#DCCCAC]/30 py-24">

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-10 h-56 w-56 rounded-full bg-[#546B41]/12 blur-[110px]" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#99AD7A]/15 blur-[90px]" />
      </div>

      {/* Top/bottom organic dividers */}
      <div className="absolute inset-x-0 top-0 h-px divider-organic" />
      <div className="absolute inset-x-0 bottom-0 h-px divider-organic" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-panel rounded-3xl border border-[#99AD7A]/20 p-8 md:p-10">
          <div className="flex flex-col items-center md:flex-row">

            <motion.div
              className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="mb-5 inline-block rounded-full border border-[#546B41]/25 bg-[#546B41]/10 px-3 py-1 text-sm font-bold text-[#546B41]">
                Featured Demo
              </span>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#2d3d24] md:text-4xl">
                Interactive Seismic Response Lab
              </h2>
              <p className="mb-6 text-base text-[#546B41]/70 leading-relaxed">
                Explore a physics-driven seismic demo built around SDOF response, drift-based visual feedback,
                and live parameter controls for magnitude, damping, distance, and soil conditions.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-7">
                {[
                  'Newmark-beta solver',
                  'Drift heatmap feedback',
                  'EC8 soil presets',
                  'Interactive engineering UI',
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-[#99AD7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[#546B41]/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/interactive-model"
                className="inline-block rounded-xl bg-[#546B41] px-6 py-3 font-bold text-[#FFF8EC] shadow-[0_0_25px_rgba(84,107,65,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3d5030] hover:shadow-[0_0_35px_rgba(84,107,65,0.45)]"
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
              <div className="relative overflow-hidden rounded-2xl border border-[#DCCCAC]/60 shadow-nature-lg">
                <Image
                  src="/assets/images/seismic-visualization-preview.jpg"
                  alt="Interactive seismic response lab"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400/2d3d24/DCCCAC?text=Seismic+Lab";
                  }}
                />

                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#1e2d14]/80 to-transparent">
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 mr-1.5"></span>
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1.5"></span>
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#99AD7A] mr-1.5"></span>
                      <span className="ml-2 text-xs text-[#DCCCAC]/80">Engineering Simulation</span>
                    </div>
                    <div className="rounded bg-[#1e2d14]/60 p-2 text-sm backdrop-blur-sm border border-[#99AD7A]/20">
                      <p className="font-mono text-[#b8c99a] text-xs">PGA: 0.32g | Max drift: 2.1% | Roof delta: 42.7cm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -right-3 -top-3 rotate-12 rounded-full bg-[#99AD7A] px-3 py-1 text-xs font-bold text-[#1e2d14] shadow-sage-glow">
                Physics Driven
              </div>

              <div className="absolute -bottom-3 -left-3 rounded-full bg-[#FFF8EC] p-2 text-[#546B41] shadow-nature-lg border border-[#DCCCAC]/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
