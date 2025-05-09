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
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-white text-blue-600 text-sm font-bold px-3 py-1 rounded-full mb-4">NEW</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Seismic Visualization</h2>
            <p className="text-lg text-blue-100 mb-6">
              Explore our state-of-the-art interactive seismic visualization with WebGL rendering,
              realistic physics, and real earthquake data. A powerful educational tool for understanding
              structural response to earthquakes.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>WebGL Acceleration</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Multi-Modal Analysis</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Real Earthquake Data</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced Material Models</span>
              </div>
            </div>
            
            <Link 
              href="/interactive-model" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors duration-300"
            >
              Try It Now →
            </Link>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/assets/images/seismic-visualization-preview.jpg"
                alt="Advanced Seismic Visualization"
                width={600}
                height={400}
                className="w-full h-auto"
                // If image doesn't exist yet, use a placeholder
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400/3b82f6/FFFFFF?text=Seismic+Visualization";
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex items-end">
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-xs ml-2 text-gray-200">Visualization Demo</span>
                  </div>
                  <div className="bg-blue-800/50 backdrop-blur-sm p-2 rounded text-sm">
                    <p className="font-mono">PGA: 0.32g | Displacement: 42.7cm | Health: 78%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-blue-900 text-xs px-2 py-1 rounded-full transform rotate-12 font-bold">
              WebGL Powered
            </div>
            
            <div className="absolute -bottom-3 -left-3 bg-white text-blue-600 rounded-full p-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SeismicVisualizationPromo; 