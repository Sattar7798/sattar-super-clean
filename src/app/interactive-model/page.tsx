'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/LayoutFix';
import BuildingModelViewer from '@/components/3d/BuildingModelViewer';
import SeismicVisualization from '@/components/3d/SeismicVisualization';
import SeismicVisualizationEnhanced from '@/components/3d/SeismicVisualizationEnhanced';
import AIVisualization from '@/components/ai/AIVisualization';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Tab interface for switching between different visualizations
type VisualizationTab = 'building' | 'seismic' | 'ai' | 'seismicEnhanced';

export default function InteractiveModelPage() {
  const [activeTab, setActiveTab] = useState<VisualizationTab>('building');
  const [useEnhancedSeismic, setUseEnhancedSeismic] = useState(true);
  
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive Structural Visualizations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Explore cutting-edge visualizations of building structures, seismic responses, 
              and AI-powered structural analysis.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Visualization Tabs */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'building' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('building')}
              >
                3D Building Model
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'seismic' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('seismic')}
              >
                Seismic Simulation
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'seismicEnhanced' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('seismicEnhanced')}
              >
                Advanced Seismic
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${
                  activeTab === 'ai' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                AI Analysis
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* 3D Building Model Viewer */}
              {activeTab === 'building' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      Interactive 3D Building Model
                    </h2>
                    <p className="text-gray-600">
                      Explore a detailed 3D model of a building structure. Use your mouse to rotate, 
                      zoom, and pan to examine the model from different angles.
                    </p>
                  </div>
                  <BuildingModelViewer 
                    backgroundColor="#f8fafc"
                    className="rounded-lg shadow-inner"
                    modelPath="/models/building.glb"
                  />
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">About This Model</h3>
                    <p>
                      This 3D model represents a modern reinforced concrete frame structure designed 
                      to withstand seismic forces. The model includes detailed representations of 
                      structural elements including columns, beams, floor slabs, and foundations.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Seismic Visualization - Original */}
              {activeTab === 'seismic' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      Seismic Response Simulation
                    </h2>
                    <p className="text-gray-600">
                      Visualize how buildings respond to earthquake forces with this interactive 
                      seismic simulation. Adjust parameters like magnitude, distance, and soil type to observe 
                      different building responses.
                    </p>
                  </div>
                  <SeismicVisualization
                    initialIntensity={0.3}
                    className="rounded-lg shadow-inner"
                  />
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">Understanding Seismic Effects</h3>
                    <p>
                      This simulation demonstrates the dynamic response of buildings to seismic ground 
                      motions. The visualization includes real-time engineering graphs showing Peak Ground Acceleration (PGA), 
                      ground velocity, and building displacement over time, providing valuable insights into structural behavior during earthquakes.
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                      <div>
                        <h4 className="font-medium text-blue-800">PGA vs. Time</h4>
                        <p className="text-sm">Measures the maximum acceleration experienced by the ground during the earthquake, a key parameter in seismic design codes.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Velocity vs. Time</h4>
                        <p className="text-sm">Shows how fast the ground is moving during the seismic event, correlating with the energy transfer to structures.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Displacement vs. Time</h4>
                        <p className="text-sm">Displays building movement in response to ground motion, revealing structural performance under seismic loads.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Enhanced Seismic Visualization - NEW */}
              {activeTab === 'seismicEnhanced' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      Advanced Seismic Simulation Engine
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 max-w-3xl">
                        Experience our next-generation seismic visualization with WebGL rendering, 
                        ultra-realistic physics, historical earthquake data, and advanced structural analysis capabilities.
                      </p>
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                    </div>
                  </div>
                  
                  <SeismicVisualizationEnhanced
                    initialIntensity={0.3}
                    className="rounded-lg shadow-inner"
                    enableWebGL={true}
                    enableHDRendering={true}
                    showRealEarthquakes={true}
                  />
                  
                  <div className="mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Advanced Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <h4 className="font-medium">WebGL Rendering</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Hardware-accelerated graphics for smoother animations and more detailed visualizations
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                            </svg>
                            <h4 className="font-medium">Real Earthquake Data</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Simulate historical earthquakes with actual ground motion recordings
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            <h4 className="font-medium">Advanced Physics</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Multi-modal vibration analysis with soil-structure interaction effects
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                            </svg>
                            <h4 className="font-medium">Performance Settings</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Customize simulation quality to match your device capabilities
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">Educational Resources</h3>
                    <p className="mb-4">
                      This advanced simulation incorporates research-grade seismic analysis techniques used by 
                      professional structural engineers. The model accounts for material nonlinearity, geometric 
                      effects, and dynamic soil-structure interaction.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Research Applications</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Performance-based seismic design validation</li>
                          <li>Structural health monitoring simulations</li>
                          <li>Multi-hazard resilience assessment</li>
                          <li>Advanced material response modeling</li>
                        </ul>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Engineering Standards</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>ASCE 7-22 seismic design provisions</li>
                          <li>FEMA P-58 performance assessment</li>
                          <li>NEHRP site classification effects</li>
                          <li>IBC 2021 design parameters</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* AI Analysis Visualization */}
              {activeTab === 'ai' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      AI-Powered Structural Analysis
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Explore how artificial intelligence analyzes building structures to identify 
                      potential weaknesses and optimize designs for seismic performance.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 shadow-inner bg-gray-50">
                    <AIVisualization
                      className="rounded-lg"
                    />
                  </div>
                  <div className="mt-6 text-gray-600">
                    <h3 className="text-lg font-semibold mb-2">The Future of Structural Engineering</h3>
                    <p>
                      AI-powered analysis represents the cutting edge of structural engineering, 
                      enabling more precise predictions of building behavior and optimizing design 
                      decisions for safety, efficiency, and resilience against natural disasters.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover how these advanced visualization techniques are being applied in real-world 
            research projects to improve building safety and resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/research"
              className="px-8 py-4 bg-white text-blue-800 rounded-lg font-bold hover:bg-blue-100 transition-colors duration-300"
            >
              Research Projects
            </Link>
            <Link
              href="/publications"
              className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold hover:bg-white hover:text-blue-800 transition-all duration-300"
            >
              View Publications
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 