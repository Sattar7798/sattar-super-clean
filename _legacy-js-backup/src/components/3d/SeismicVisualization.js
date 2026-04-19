import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Advanced SeismicVisualization component
 * Creates interactive, data-rich visualizations for seismic response
 */
const SeismicVisualization = ({
  initialIntensity = 0.3,
  width = '100%',
  height = '600px',
  className = '',
  showControls = true,
  initialMagnitude = 6.5,
  initialDistance = 20,
  initialDirection = 0,
  initialSoilType = 'stiff',
  onVisualizationReady = () => {},
}) => {
  // Core state for earthquake parameters
  const [magnitude, setMagnitude] = useState(initialMagnitude);
  const [distance, setDistance] = useState(initialDistance);
  const [soilType, setSoilType] = useState(initialSoilType);
  const [damping, setDamping] = useState(0.05);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [simulationMode, setSimulationMode] = useState('simplified'); // 'simplified' or 'realistic'
  const [needsDataUpdate, setNeedsDataUpdate] = useState(false);
  
  // Number of floors in the building (constant across the component)
  const numFloors = 10;
  
  // Advanced structural parameters
  const [structuralMaterial, setStructuralMaterial] = useState('concrete'); // 'concrete', 'steel', 'wood', 'hybrid'
  const [aiSupport, setAiSupport] = useState(false); // Whether AI-based structural control is activated
  const [buildingCode, setBuildingCode] = useState('modern'); // 'modern', 'legacy', 'advanced'
  const [reinforcement, setReinforcement] = useState('standard'); // 'standard', 'minimal', 'advanced'
  const [hasCollapsed, setHasCollapsed] = useState(false); // Tracks if building has collapsed during simulation
  
  // Canvas ref
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const realisticDataRef = useRef(null);
  
  // Animation state
  const [currentTime, setCurrentTime] = useState(0);
  const [buildingDisplacement, setBuildingDisplacement] = useState(0);
  
  // Maximum number of data points to keep in time history
  const MAX_DATA_POINTS = 600; // Increased from 300 for ultra-high resolution
  
  // Pre-earthquake time in seconds (quiet period)
  const PRE_EARTHQUAKE_TIME = 2.0;
  // Main shock duration in seconds
  const MAIN_SHOCK_DURATION = 10.0;
  // Total simulation time in seconds
  const TOTAL_SIMULATION_TIME = 20;
  
  // Advanced physics constants
  const EARTH_GRAVITY = 9.80665; // m/s² (exact value)
  const SOIL_AMPLIFICATION_FACTORS = {
    'rock': { Fa: 0.8, Fv: 0.8, Fs: 0.7, T0: 0.1, Ts: 0.4 },      // Site class A/B
    'stiff': { Fa: 1.0, Fv: 1.3, Fs: 1.0, T0: 0.15, Ts: 0.6 },    // Site class C
    'soft': { Fa: 1.2, Fv: 1.8, Fs: 1.3, T0: 0.2, Ts: 0.8 },      // Site class D
    'very-soft': { Fa: 1.6, Fv: 2.4, Fs: 1.8, T0: 0.3, Ts: 1.2 }  // Site class E
  };
  
  // Animation parameters
  const [animationData, setAnimationData] = useState({
    frequency: 2,
    maxAmplitude: 1,
    dampingRatio: 0.05
  });

  // Time history data for graphs
  const [timeHistoryData, setTimeHistoryData] = useState({
    time: Array.from({length: 10}, (_, i) => i),
    pga: Array(10).fill(0),
    velocity: Array(10).fill(0),
    displacement: Array(10).fill(0)
  });
  
  // Material properties for different building types
  const materialProperties = {
    concrete: {
      name: 'Reinforced Concrete',
      elasticModulus: 25000, // MPa
      density: 2400, // kg/m³
      dampingRatio: 0.05,
      collapseThreshold: 0.025, // 2.5% drift ratio for collapse
      description: 'High strength and mass, moderate flexibility, common in multi-story buildings.',
      color: '#a1a1aa', // Gray color for concrete
      yieldStress: 30, // MPa
      ultimateStrain: 0.003,
      damageThreshold: 0.010, // 1.0% drift ratio for damage
      stiffnessModifier: 1.0,
      poissonRatio: 0.2, // Poisson's ratio
      shearModulus: 10400, // MPa - G = E/2(1+v)
      thermalExpansion: 10e-6, // per °C
      compressiveStrength: 30, // MPa
      tensileStrength: 3.0, // MPa
      yieldStrain: 0.0012, // Yield strain
      crackingStrain: 0.0001 // Strain at first cracking
    },
    steel: {
      name: 'Structural Steel',
      elasticModulus: 200000, // MPa
      density: 7850, // kg/m³
      dampingRatio: 0.02,
      collapseThreshold: 0.03, // 3% drift ratio for collapse
      description: 'High strength-to-weight ratio, excellent ductility, and energy dissipation.',
      color: '#60a5fa', // Blue color for steel
      yieldStress: 345, // MPa (50 ksi)
      ultimateStrain: 0.15,
      damageThreshold: 0.015, // 1.5% drift ratio for damage
      stiffnessModifier: 1.2,
      poissonRatio: 0.3, // Poisson's ratio
      shearModulus: 77000, // MPa - G = E/2(1+v)
      thermalExpansion: 12e-6, // per °C
      compressiveStrength: 345, // MPa (same as tensile for steel)
      tensileStrength: 450, // MPa
      yieldStrain: 0.00173, // Yield strain = fy/E
      bucklingStress: 260 // MPa - Local buckling stress
    },
    wood: {
      name: 'Engineered Wood',
      elasticModulus: 11000, // MPa for engineered wood
      density: 600, // kg/m³
      dampingRatio: 0.08,
      collapseThreshold: 0.02, // 2% drift ratio for collapse
      description: 'Lightweight and renewable, good for low-rise buildings, lower stiffness.',
      color: '#a16207', // Brown color for wood
      yieldStress: 20, // MPa
      ultimateStrain: 0.004,
      damageThreshold: 0.008, // 0.8% drift ratio for damage
      stiffnessModifier: 0.8,
      poissonRatio: 0.25, // Poisson's ratio
      shearModulus: 4400, // MPa - G = E/2(1+v)
      thermalExpansion: 4e-6, // per °C
      compressiveStrength: 22, // MPa parallel to grain
      tensileStrength: 18, // MPa parallel to grain
      yieldStrain: 0.0018, // Yield strain
      moistureContent: 0.12 // 12% moisture content (optimal)
    },
    hybrid: {
      name: 'Hybrid Structure',
      elasticModulus: 85000, // MPa - weighted average of components
      density: 1800, // kg/m³ - lower than concrete due to composite efficiency
      dampingRatio: 0.04,
      collapseThreshold: 0.035, // 3.5% drift ratio for collapse
      description: 'Combines multiple materials with supplemental damping systems for optimal performance.',
      color: '#818cf8', // Purple color for hybrid
      yieldStress: 120, // MPa - effective system value
      ultimateStrain: 0.10,
      damageThreshold: 0.020, // 2.0% drift ratio for damage
      stiffnessModifier: 1.1,
      poissonRatio: 0.25, // Poisson's ratio
      shearModulus: 34000, // MPa - G = E/2(1+v)
      thermalExpansion: 10e-6, // per °C
      compressiveStrength: 60, // MPa - system value
      tensileStrength: 80, // MPa - system value
      yieldStrain: 0.0014, // Yield strain
      dampingDevices: true, // Has supplemental damping devices
      compositeAction: 0.85 // Degree of composite action between materials
    }
  };

  // Building code properties affecting structural performance
  const buildingCodeProperties = {
    legacy: {
      name: 'Pre-2000 Code',
      strengthModifier: 0.7, // Lower strength requirements
      stiffnessModifier: 0.8, // Lower stiffness requirements
      dampingModifier: 0.9, // Limited damping provisions
      collapseThresholdModifier: 0.6, // More vulnerable to collapse
      description: 'Older design standards with limited seismic provisions and safety factors.',
      designPGA: 0.1, // g - typical design PGA
      detailingRequirements: 'minimal',
      ductilityFactor: 2, // R-factor equivalent
      overstrengthFactor: 1.2, // Ω-factor
      redundancyFactor: 1.0, // ρ-factor
      designSpectrum: {
        cornerPeriod: 0.4, // Ts in seconds
        plateauAccel: 0.25 // g - plateau acceleration
      }
    },
    modern: {
      name: 'Modern Code',
      strengthModifier: 1.0, // Baseline strength requirements
      stiffnessModifier: 1.0, // Baseline stiffness requirements
      dampingModifier: 1.0, // Standard damping provisions
      collapseThresholdModifier: 1.0, // Standard collapse resistance
      description: 'Current design codes with capacity design principles and ductility requirements.',
      designPGA: 0.4, // g - typical design PGA
      detailingRequirements: 'moderate',
      ductilityFactor: 5, // R-factor equivalent
      overstrengthFactor: 2.0, // Ω-factor
      redundancyFactor: 1.3, // ρ-factor
      designSpectrum: {
        cornerPeriod: 0.6, // Ts in seconds
        plateauAccel: 1.0 // g - plateau acceleration
      }
    },
    advanced: {
      name: 'Performance-Based Design',
      strengthModifier: 1.2, // Enhanced strength requirements
      stiffnessModifier: 1.1, // Enhanced stiffness requirements
      dampingModifier: 1.2, // Enhanced damping provisions
      collapseThresholdModifier: 1.4, // Superior collapse resistance
      description: 'Advanced design approach focused on specific performance objectives and resilience.',
      designPGA: 0.6, // g - typical design PGA
      detailingRequirements: 'extensive',
      ductilityFactor: 8, // R-factor equivalent
      overstrengthFactor: 2.5, // Ω-factor
      redundancyFactor: 1.5, // ρ-factor
      designSpectrum: {
        cornerPeriod: 0.8, // Ts in seconds
        plateauAccel: 1.5 // g - plateau acceleration
      },
      performanceObjectives: {
        serviceabilityEQ: 'immediate occupancy',
        designEQ: 'life safety',
        MCE: 'collapse prevention'
      }
    }
  };

  // Reinforcement impact on structure performance
  const reinforcementProperties = {
    minimal: {
      name: 'Minimal Reinforcement',
      stiffnessModifier: 0.8,
      strengthModifier: 0.7,
      ductilityModifier: 0.6,
      collapseThresholdModifier: 0.7,
      description: 'Basic reinforcement meeting minimum code requirements'
    },
    standard: {
      name: 'Standard Reinforcement',
      stiffnessModifier: 1.0,
      strengthModifier: 1.0,
      ductilityModifier: 1.0,
      collapseThresholdModifier: 1.0,
      description: 'Typical reinforcement for seismic regions'
    },
    advanced: {
      name: 'Advanced Reinforcement',
      stiffnessModifier: 1.3,
      strengthModifier: 1.4,
      ductilityModifier: 1.6,
      collapseThresholdModifier: 1.5,
      description: 'High-performance reinforcement with special ductile detailing'
    }
  };

  // AI support impact on structure performance during earthquake
  const aiSupportProperties = {
    active: {
      name: 'AI-Enhanced Structural Control',
      stiffnessModifier: 1.0,
      responseReductionFactor: 0.6, // Reduces response by 40%
      adaptiveControl: true,
      earlyWarningSystem: true,
      description: 'Real-time AI structural control with adaptive tuned mass dampers'
    },
    inactive: {
      name: 'Conventional Structure',
      stiffnessModifier: 1.0,
      responseReductionFactor: 1.0, // No reduction
      adaptiveControl: false,
      earlyWarningSystem: false,
      description: 'Traditional structure without advanced control systems'
    }
  };

  // Function to check if building has collapsed based on sophisticated engineering criteria
  const checkBuildingCollapse = (floors, numFloors, currentPGA) => {
    if (hasCollapsed) return true; // If already collapsed, stay collapsed
    
    // Skip collapse check during initialization period
    if (currentTime < 0.1) return false;
    
    // Get current material properties
    const material = materialProperties[structuralMaterial];
    const codeProps = buildingCodeProperties[buildingCode];
    const reinforcementProps = reinforcementProperties[reinforcement];
    
    // Calculate actual collapse threshold with all modifiers
    const actualCollapseThreshold = material.collapseThreshold * 
                                   codeProps.collapseThresholdModifier * 
                                   reinforcementProperties[reinforcement].collapseThresholdModifier;
    
    // Calculate absolute PGA limit (converted to g units)
    const absolutePGALimit = actualCollapseThreshold * 15; // Conservative conversion to g
    
    // Higher threshold during initial frames to avoid immediate collapse
    const timeBasedPGAMultiplier = Math.min(currentTime / 10, 1.0);
    const effectivePGALimit = absolutePGALimit / timeBasedPGAMultiplier;
    
    // Displacement-based collapse criteria (in cm) with time-based increasing sensitivity
    const materialDisplacementLimit = {
      'concrete': 120, // cm
      'steel': 180,    // cm
      'wood': 90,      // cm
      'hybrid': 200    // cm
    };
    const adjustedDisplacementLimit = materialDisplacementLimit[structuralMaterial] * 
                                     codeProps.collapseThresholdModifier *
                                     reinforcementProps.collapseThresholdModifier;
    
    // Apply AI reduction if active
    const aiReductionFactor = aiSupport ? 
                             aiSupportProperties.active.responseReductionFactor : 
                             aiSupportProperties.inactive.responseReductionFactor;
    
    // Calculate inter-story drift ratios and check for irregularities
    const storyHeights = [];
    const storyDrifts = [];
    const driftRatios = [];
    
    // Skip if floors data is incomplete
    if (!floors || floors.length < numFloors) return false;
    
    // Check for P-Delta effects and soft story mechanisms
    for (let floor = 0; floor < numFloors; floor++) {
      if (!floors[floor] || !floors[floor+1]) continue;
      
      // Calculate drift between consecutive floors
      const lowerFloor = floors[floor];
      const upperFloor = floors[floor+1];
      const floorHeight = upperFloor.y - lowerFloor.y;
      const horizontalDisplacement = Math.abs(upperFloor.x - lowerFloor.x);
      
      // Store heights and displacements for structural analysis
      storyHeights.push(floorHeight);
      storyDrifts.push(horizontalDisplacement);
      
      // Calculate drift ratio (horizontal displacement / floor height)
      const driftRatio = horizontalDisplacement / floorHeight;
      driftRatios.push(driftRatio);
      
      // Apply AI reduction to effective drift if AI support is active
      const effectiveDrift = driftRatio * aiReductionFactor;
    }
    
    // Detect soft story mechanism (more than 50% difference in stiffness between adjacent stories)
    let hasSoftStory = false;
    for (let i = 0; i < driftRatios.length - 1; i++) {
      if (driftRatios[i] > 0 && driftRatios[i+1] > 0) {
        const stiffnessRatio = driftRatios[i] / driftRatios[i+1];
        if (stiffnessRatio > 1.5 || stiffnessRatio < 0.67) {
          hasSoftStory = true;
          break;
        }
      }
    }
    
    // Calculate P-Delta effects (second-order effects)
    const buildingHeight = storyHeights.reduce((sum, h) => sum + h, 0);
    const lateralDisplacement = storyDrifts.reduce((sum, d) => sum + d, 0);
    const overallDriftRatio = lateralDisplacement / buildingHeight;
    
    // Get maximum absolute displacement at top of building
    const topFloor = floors[numFloors];
    const baseFloor = floors[0];
    const absoluteDisplacement = topFloor && baseFloor ? 
                               Math.abs(topFloor.x - baseFloor.x) : 0;
                               
    // Convert pixel displacement to cm for comparison with limits
    // Use the same scale factor as in the display
    const displacementInCm = absoluteDisplacement * 0.7; // Approximate conversion
    
    // P-Delta sensitivity factor (θ)
    const pDeltaFactor = overallDriftRatio * material.density * buildingHeight / (material.elasticModulus * 1000); // Normalized factor
    
    // Maximum drift ratio accounting for P-Delta amplification
    let maxDriftRatio = Math.max(...driftRatios);
    if (pDeltaFactor > 0.05) { // P-Delta becomes significant
      // Amplify drift by P-Delta effect (simplified approximation)
      maxDriftRatio *= (1.0 + pDeltaFactor);
    }
    
    // Calculate cumulative energy dissipation (hysteretic energy)
    // This is a simplified approximation of energy-based collapse criteria
    const cumulativeEnergyFactor = Math.pow(overallDriftRatio, 2) * Math.max(1.0, currentPGA * 5);
    
    // Material-specific modifications
    if (structuralMaterial === 'concrete') {
      // Concrete is more sensitive to cumulative damage
      if (cumulativeEnergyFactor > 0.5) {
        maxDriftRatio *= 1.2; // Accumulated damage amplification
      }
    } else if (structuralMaterial === 'steel') {
      // Steel is more sensitive to extreme displacements than to cumulative damage
      if (maxDriftRatio > 0.03) {
        maxDriftRatio *= 1.1; // Local buckling amplification
      }
    } else if (structuralMaterial === 'wood') {
      // Wood is sensitive to connection failures
      if (maxDriftRatio > 0.01) {
        maxDriftRatio *= 1.3; // Connection slip amplification
      }
    }
    
    // Allow higher displacements during initialization period
    const effectiveDisplacementLimit = currentTime < 2 ? 
                                      adjustedDisplacementLimit * 2 : 
                                      adjustedDisplacementLimit;
    
    // Minimum displacement threshold to trigger collapse (prevents false collapses)
    const minDisplacementForCollapse = 30; // cm
    
    // Minimum PGA threshold to trigger collapse (prevents false collapses)
    const minPGAForCollapse = 0.8; // g
    
    // Check if collapse conditions are met through various mechanisms
    // Add additional conditions to prevent false triggers
    const collapseByDrift = maxDriftRatio > actualCollapseThreshold * 1.2 && currentTime > 5;
    const collapseByPGA = currentPGA > effectivePGALimit && currentPGA > minPGAForCollapse && currentTime > 5;
    const collapseBySoftStory = hasSoftStory && maxDriftRatio > 0.8 * actualCollapseThreshold && currentTime > 10;
    const collapseByEnergy = cumulativeEnergyFactor > 1.2 && maxDriftRatio > 0.6 * actualCollapseThreshold && currentTime > 15;
    const collapseByDisplacement = displacementInCm > effectiveDisplacementLimit && 
                                   displacementInCm > minDisplacementForCollapse && 
                                   currentTime > 5;
    
    // P-Delta instability collapse criterion (only after significant time)
    const collapseByPDelta = pDeltaFactor > 0.35 && currentTime > 15; 
    
    // Log collapse reason if any threshold is exceeded (for debugging)
    if (collapseByDrift || collapseByPGA || collapseBySoftStory || 
        collapseByPDelta || collapseByEnergy || collapseByDisplacement) {
      console.log("Building collapse triggered by:", {
        drift: collapseByDrift ? `${maxDriftRatio.toFixed(3)} > ${actualCollapseThreshold.toFixed(3)}` : "OK",
        pga: collapseByPGA ? `${currentPGA.toFixed(3)} > ${effectivePGALimit.toFixed(3)}` : "OK",
        softStory: collapseBySoftStory ? "Yes" : "No",
        pDelta: collapseByPDelta ? `${pDeltaFactor.toFixed(3)} > 0.35` : "OK",
        energy: collapseByEnergy ? `${cumulativeEnergyFactor.toFixed(3)} > 1.2` : "OK", 
        displacement: collapseByDisplacement ? `${displacementInCm.toFixed(1)} > ${effectiveDisplacementLimit.toFixed(1)}` : "OK",
        currentTime: currentTime.toFixed(1)
      });
    }
    
    // Return collapse state considering multiple collapse mechanisms
    return collapseByDrift || collapseByPGA || collapseBySoftStory || 
           collapseByPDelta || collapseByEnergy || collapseByDisplacement;
  };
  
  // Get calculated values based on inputs
  const getCalculatedValues = () => {
    // Peak ground acceleration (simplified model)
    // Based on magnitude and distance
    const pga = Math.pow(10, magnitude - 4.5) / Math.sqrt(distance) * 0.1;
    
    // Amplification factor based on soil type
    const soilFactors = {
      'rock': 1.0,
      'stiff': 1.3,
      'soft': 1.8,
      'very-soft': 2.5
    };
    
    // Get frequency and amplitude based on parameters
    const frequency = 2.0 - (magnitude - 4.0) * 0.2; // Lower frequency for larger magnitude
    const maxAmplitude = pga * soilFactors[soilType];
    
    // Return values
    return {
      frequency,
      maxAmplitude,
      dampingRatio: damping,
      pga: pga.toFixed(2)
    };
  };
  
  // Update animation data when parameters change
  useEffect(() => {
    const values = getCalculatedValues();
    setAnimationData({
      frequency: values.frequency,
      maxAmplitude: values.maxAmplitude,
      dampingRatio: values.dampingRatio
    });
    
    // Initialize realistic time history with pre-earthquake values
    if (simulationMode === 'realistic') {
      const initialTimes = Array.from({length: MAX_DATA_POINTS}, (_, i) => i * TOTAL_SIMULATION_TIME / MAX_DATA_POINTS);
      
      // Add small background noise to make it realistic
      const getNoise = () => (Math.random() - 0.5) * 0.01;
      
      setTimeHistoryData({
        time: initialTimes,
        pga: initialTimes.map(t => t <= PRE_EARTHQUAKE_TIME ? getNoise() : 0),
        velocity: initialTimes.map(t => t <= PRE_EARTHQUAKE_TIME ? getNoise() * 2 : 0),
        displacement: initialTimes.map(t => t <= PRE_EARTHQUAKE_TIME ? getNoise() * 5 : 0)
      });
    } else {
      // Reset time history when parameters change
      setTimeHistoryData({
        time: [],
        pga: [],
        velocity: [],
        displacement: []
      });
    }
    
    setCurrentTime(0);
  }, [magnitude, distance, soilType, damping, simulationMode]);
  
  // Draw animation frame with advanced structural visualization
  const drawFrame = (time, forcedPGA, forcedDisplacement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw ground
    const groundY = height * 0.75;
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(0, groundY, width, height - groundY);
    
    // Calculate ground motion (horizontal sinusoidal motion)
    let groundMotion, buildingResp;
    
    if (forcedPGA !== undefined && forcedDisplacement !== undefined) {
      // For realistic mode - use the pre-calculated values with amplification
      groundMotion = forcedPGA * 2000; // Scaled for visibility
      
      // Scale displacement based on magnitude for more dramatic visual effect
      const magnitudeScaling = Math.pow(10, (magnitude - 6.0) / 2.5);
      const soilAmplification = soilType === 'rock' ? 1.0 : 
                              soilType === 'stiff' ? 1.2 : 
                              soilType === 'soft' ? 1.5 : 1.8;
                              
      // Apply visual scaling for better visualization
      const visualScaling = 2.0;
      
      // Ensure there's always a visible building displacement (avoid 0.0 cm)
      buildingResp = Math.abs(forcedDisplacement) < 0.1 ? 
                   2.0 * magnitudeScaling * soilAmplification * visualScaling : 
                   forcedDisplacement * magnitudeScaling * soilAmplification * visualScaling;
      
      // Apply a subtle motion even during "quiet period" for better visualization
      if (time < PRE_EARTHQUAKE_TIME && Math.abs(buildingResp) < 1.0) {
        // Small ambient motion during quiet period
        buildingResp = 0.5 * Math.sin(time * 0.5); 
      }
      
      setBuildingDisplacement(buildingResp);
    } else {
      // For simplified mode - calculate sinusoidal response
      const { frequency, maxAmplitude } = animationData;
      groundMotion = Math.sin(2 * Math.PI * frequency * time) * maxAmplitude * 30;
    
      // Calculate building response (with phase lag and amplification at top)
      // Using simplified SDOF response
      const dampingFactor = Math.exp(-animationData.dampingRatio * 2 * Math.PI * frequency * time);
      buildingResp = -groundMotion * dampingFactor * 1.5;
      
      // Ensure minimum displacement for visibility
      if (Math.abs(buildingResp) < 0.5) {
        buildingResp = 0.5 * Math.sin(time * 0.5);
      }
      
      setBuildingDisplacement(buildingResp);
      
      // Generate time history data for engineering graphs
      updateTimeHistoryData(time, groundMotion, buildingResp);
    }
    
    // Draw building (10-story)
    const buildingWidth = width * 0.3;
    const buildingHeight = groundY * 0.8;
    const buildingX = width / 2 - buildingWidth / 2;
    const buildingY = groundY - buildingHeight;
    
    // Calculate floor height based on building height and number of floors
    const floorHeight = buildingHeight / numFloors;
    
    // Get current material properties
    const materialProps = materialProperties[structuralMaterial];
    const codeProps = buildingCodeProperties[buildingCode];
    const reinforcementProps = reinforcementProperties[reinforcement];
    
    // Apply material-specific modifiers to building properties
    const buildingMassRatio = materialProps.density / 2400; // Normalized to concrete
    const buildingStiffnessRatio = materialProps.stiffnessModifier * 
                                 codeProps.stiffnessModifier * 
                                 reinforcementProps.stiffnessModifier;
    
    // Apply AI-based reduction if active
    const aiReductionFactor = aiSupport ? 
                             aiSupportProperties.active.responseReductionFactor : 
                             aiSupportProperties.inactive.responseReductionFactor;
    
    // Calculate building deformation modes with material properties
    const calculateModeShape = (floor, numModes) => {
      // Normalized height (0 at bottom, 1 at top)
      const h = floor / numFloors;
      
      // Mode shape components with proper orthogonal functions
      // These are the analytical solutions for a shear beam model
      const modes = [
        Math.sin(Math.PI * h / 2),                  // First mode (fundamental)
        Math.sin(3 * Math.PI * h / 2),              // Second mode
        Math.sin(5 * Math.PI * h / 2),              // Third mode
        Math.sin(7 * Math.PI * h / 2),              // Fourth mode
        Math.sin(9 * Math.PI * h / 2)               // Fifth mode
      ];
      
      // Advanced mode shape models for different structure types
      // Different materials behave differently under seismic loads
      if (structuralMaterial === 'steel') {
        // Steel has more flexible connections and beam-like behavior
        modes[0] = Math.sin(Math.PI * h / 2) * (1.0 + 0.15 * h); // More top-heavy first mode
        modes[1] = Math.sin(3 * Math.PI * h / 2) * (1.0 - 0.1 * h); // Modified second mode
      } else if (structuralMaterial === 'concrete') {
        // Concrete behaves more like a shear wall with some bending
        modes[0] = Math.sin(Math.PI * h / 2) * (1.0 + 0.05 * h); // Slightly modified first mode
        // Add shear deformation component for concrete structures
        modes[0] += 0.2 * h * (1 - h); // Add shear component to first mode
      } else if (structuralMaterial === 'wood') {
        // Wood structures have more shear deformation
        modes[0] = Math.sin(Math.PI * h / 2) * (1.0 + 0.1 * h) + 0.3 * h * (1 - h);
        modes[1] = Math.sin(3 * Math.PI * h / 2) * 0.9; // Reduced higher modes in wood
      } else if (structuralMaterial === 'hybrid') {
        // Hybrid structures combine behaviors
        modes[0] = Math.sin(Math.PI * h / 2) * (1.0 + 0.08 * h);
      }
      
      // Participation factors for each mode based on earthquake frequency content
      // These factors are derived from modal analysis in structural dynamics
      // Larger earthquakes excite lower modes more, smaller earthquakes excite higher modes
      let modeWeights;
      if (magnitude > 7.5) {
        // Very large earthquakes primarily excite fundamental mode with longer period content
        modeWeights = [0.88, 0.08, 0.02, 0.01, 0.01];
      } else if (magnitude > 7.0) {
        // Large earthquakes primarily excite lower modes
        modeWeights = [0.82, 0.12, 0.04, 0.015, 0.005];
      } else if (magnitude > 6.0) {
        // Medium earthquakes excite a mix of modes
        modeWeights = [0.70, 0.20, 0.06, 0.03, 0.01];
      } else if (magnitude > 5.0) {
        // Moderate earthquakes excite more higher modes
        modeWeights = [0.58, 0.25, 0.10, 0.05, 0.02];
      } else {
        // Smaller earthquakes excite higher modes more significantly
        modeWeights = [0.50, 0.27, 0.13, 0.07, 0.03];
      }
      
      // Soil effects on modal participation - softer soils emphasize lower modes
      if (soilType === 'soft' || soilType === 'very-soft') {
        // Soft soils amplify long period (lower mode) motion
        modeWeights[0] *= 1.2; // Increase first mode
        // Normalize the weights to ensure they sum to 1.0
        const sum = modeWeights.reduce((a, b) => a + b, 0);
        modeWeights = modeWeights.map(w => w / sum);
      } else if (soilType === 'rock') {
        // Rock sites amplify higher frequency (higher mode) motion
        modeWeights[0] *= 0.9; // Decrease first mode
        modeWeights[1] *= 1.1; // Increase second mode
        modeWeights[2] *= 1.2; // Increase third mode
        // Normalize the weights
        const sum = modeWeights.reduce((a, b) => a + b, 0);
        modeWeights = modeWeights.map(w => w / sum);
      }
      
      // Apply material-specific modifications to mode participation
      if (structuralMaterial === 'steel') {
        // Steel has better high-frequency response
        modeWeights[1] *= 1.15; // Increase second mode participation
        modeWeights[2] *= 1.2;  // Increase third mode participation
        // Normalize weights
        const sum = modeWeights.reduce((a, b) => a + b, 0);
        modeWeights = modeWeights.map(w => w / sum);
      } else if (structuralMaterial === 'wood') {
        // Wood has more damping of higher modes
        modeWeights[1] *= 0.9; // Decrease higher mode participation
        modeWeights[2] *= 0.8;
        modeWeights[3] *= 0.7;
        modeWeights[0] *= 1.15; // Increase fundamental mode to compensate
        // Normalize weights
        const sum = modeWeights.reduce((a, b) => a + b, 0);
        modeWeights = modeWeights.map(w => w / sum);
      } else if (structuralMaterial === 'hybrid') {
        // Hybrid structures have more controlled response
        modeWeights[0] *= 1.1; // Increase fundamental mode
        modeWeights[1] *= 0.9; // Decrease higher modes
        // Normalize weights
        const sum = modeWeights.reduce((a, b) => a + b, 0);
        modeWeights = modeWeights.map(w => w / sum);
      }
      
      // Combine weighted modes (limited to requested number of modes)
      let combinedShape = 0;
      for (let i = 0; i < numModes && i < modes.length; i++) {
        combinedShape += modes[i] * modeWeights[i];
      }
      
      // Add P-Delta effects for large displacements (geometric nonlinearity)
      // This becomes significant at larger drift ratios
      if (time > 5 && buildingDisplacement > 30) {
        // The P-Delta effect amplifies displacements at large drifts
        const pDeltaFactor = Math.pow(buildingDisplacement / 50, 0.8) * 0.1;
        combinedShape *= (1.0 + pDeltaFactor * h); // More effect at top
      }
      
      return combinedShape;
    };
    
    // Floor properties array to store all floor positions
    const floors = [];
    
    // Check if building has already collapsed
    const currentPGA = forcedPGA ? Math.abs(forcedPGA) : 0;
    
    // Draw floors and calculate positions
    for (let floor = 0; floor <= numFloors; floor++) {
      const floorY = groundY - floor * floorHeight;
      
      // Calculate mode shape based on building and earthquake properties
      let numActiveModes;
      if (simulationMode === 'realistic') {
        // Realistic mode uses multiple modes based on magnitude and soil
        // Softer soils and larger magnitudes cause more complex responses
        numActiveModes = 1 + Math.floor((magnitude - 4.0) / 0.8);
        numActiveModes = Math.max(1, Math.min(5, numActiveModes));
        
        if (soilType === 'soft' || soilType === 'very-soft') {
          numActiveModes += 1; // Soft soils amplify higher modes
        }
      } else {
        // Simplified mode uses just the fundamental mode
        numActiveModes = 1;
      }
      
      // Calculate mode shape factor
      const modeShape = calculateModeShape(floor, numActiveModes);
      
      // Apply displacement with proper scaling and mode shape
      let floorDisplacement;
      if (simulationMode === 'realistic') {
        // Apply modal participation with soil-dependent amplification
        const soilAmplification = soilType === 'rock' ? 1.0 : 
                                soilType === 'stiff' ? 1.3 : 
                                soilType === 'soft' ? 1.7 : 2.2;
                                
        // Apply AI reduction if enabled
        const effectiveDisplacement = buildingResp * aiReductionFactor;
        
        // Apply material stiffness adjustment
        floorDisplacement = effectiveDisplacement * modeShape * 
                           soilAmplification * 
                           buildingMassRatio / buildingStiffnessRatio;
        
        // Add floor-specific vibration based on current motion state
        // This adds more realism with small high-frequency components
        if (time > PRE_EARTHQUAKE_TIME) {
          const highFreqAmp = 0.05 * Math.abs(buildingResp);
          const highFreqOsc = Math.sin(2 * Math.PI * 5 * time + floor * 0.5) * highFreqAmp;
          floorDisplacement += highFreqOsc * materialProps.stiffnessModifier;
        }
      } else {
        // Simplified mode - linear shape with material properties
        floorDisplacement = buildingResp * (floor / numFloors) * 
                          (1.0 / buildingStiffnessRatio);
      }
      
      // Store floor position for column drawing
      floors.push({
        y: floorY,
        x: buildingX + floorDisplacement,
        displacement: floorDisplacement
      });
      
      // Check if building should collapse
      const buildingCollapsed = checkBuildingCollapse(floors, numFloors, currentPGA);
      
      // If building is determined to have collapsed, animate the collapse
      if (buildingCollapsed && !hasCollapsed) {
        setHasCollapsed(true);
      }
      
      // For collapsed building, modify floor positions to show collapse mechanism
      if (hasCollapsed) {
        // Set initial collapse time if it doesn't exist
        if (!floors.lastCollapseTime) {
          floors.lastCollapseTime = time;
        }
        
        // Calculate elapsed time since collapse began
        const collapseElapsedTime = time - floors.lastCollapseTime;
        const collapseDuration = structuralMaterial === 'steel' ? 4.0 : 2.5; // Steel collapses more slowly
        
        // Normalized collapse progress (0 to 1)
        const collapseProgress = Math.min(1.0, collapseElapsedTime / collapseDuration);
        
        // Create debris particles on initial collapse 
        if (collapseProgress < 0.1 && floor % 2 === 0) {
          // Draw dust/debris cloud
          const debrisRadius = 3 + Math.random() * 5;
          const debrisAlpha = Math.max(0, 0.7 - collapseProgress * 0.7);
          ctx.fillStyle = `rgba(200, 200, 200, ${debrisAlpha})`;
          ctx.beginPath();
          ctx.arc(
            floors[floor].x + buildingWidth/2 + (Math.random() - 0.5) * 30, 
            floors[floor].y + (Math.random() - 0.5) * 10,
            debrisRadius, 0, Math.PI * 2
          );
          ctx.fill();
        }
       
        // Different collapse mechanisms based on material and building configuration
        if (structuralMaterial === 'concrete') {
          // CONCRETE: Pancake collapse (progressive floor-by-floor)
          // Find the weakest story that initiates collapse
          const weakestStoryIndex = Math.floor(numFloors * 0.3); // Typically lower floors
          
          // Floors below the weakest story compress but stay roughly in place
          if (floor < weakestStoryIndex) {
            // Lower floors compress with slight random offset
            const compressionFactor = 0.2 * collapseProgress;
            floors[floor].y = groundY - floorHeight * floor * (1 - compressionFactor) + Math.random() * 2;
            floors[floor].x += (Math.random() - 0.5) * 5 * collapseProgress; // Random horizontal shift
          } 
          // Weakest story collapses dramatically
          else if (floor === weakestStoryIndex) {
            // Dramatic failure at weakest story
            floors[floor].y = groundY - floorHeight * (weakestStoryIndex - 1);
            // Random horizontal displacement
            floors[floor].x += 20 * Math.sin(collapseProgress * Math.PI) * collapseProgress;
          }
          // Floors above weakest story pancake down with increasing delays
          else {
            // Calculate delay factor based on distance from weakest story
            const delayFactor = 0.15 * (floor - weakestStoryIndex);
            const adjustedProgress = Math.max(0, collapseProgress - delayFactor);
            const normalizedProgress = adjustedProgress / (1 - delayFactor);
            
            if (normalizedProgress > 0) {
              // Progressive collapse with floors stacking
              const collapseFactor = Math.pow(normalizedProgress, 1.5); // Non-linear for acceleration effect
              const targetY = groundY - floorHeight * (weakestStoryIndex - 1);
              // Distance to fall
              const fallDistance = (floors[floor].y - targetY);
              // Apply easing for physical acceleration
              const easedFall = fallDistance * (1 - Math.cos(normalizedProgress * Math.PI / 2));
              // Final position
              floors[floor].y -= easedFall * collapseFactor;
              
              // Add rotation and horizontal displacement proportional to height
              const rotationFactor = (floor - weakestStoryIndex) * 0.02;
              const horizontalDisp = buildingWidth * rotationFactor * normalizedProgress;
              floors[floor].x += horizontalDisp * (floor % 2 === 0 ? 1 : -1);
              
              // Add debris effects for completely collapsed floors
              if (normalizedProgress > 0.8) {
                ctx.fillStyle = 'rgba(150, 150, 150, 0.7)';
                for (let d = 0; d < 3; d++) {
                  const debrisX = floors[floor].x + (Math.random() * buildingWidth);
                  const debrisY = floors[floor].y + (Math.random() * 10);
                  const debrisSize = 2 + Math.random() * 5;
                  ctx.beginPath();
                  ctx.arc(debrisX, debrisY, debrisSize, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
          }
        } 
        else if (structuralMaterial === 'wood') {
          // WOOD: Brittle failure with splintering/breaking
          // Wood has more sudden, brittle failures with splintering
          
          // Determine collapse initiation point (often in middle floors for wood)
          const failurePoint = Math.floor(numFloors * 0.5);
          
          // Calculate delay based on distance from failure point
          const distFromFailure = Math.abs(floor - failurePoint);
          const delayFactor = distFromFailure * 0.08;
          const adjustedProgress = Math.max(0, collapseProgress - delayFactor);
          
          if (adjustedProgress > 0) {
            // Bottom floors compress and buckle
            if (floor < failurePoint) {
              // Compression with buckling
              const compression = 0.7 * adjustedProgress;
              floors[floor].y = groundY - floorHeight * floor * (1 - compression);
              // Horizontal buckling increases toward failure point
              const buckleFactor = ((floor / failurePoint) * 40 * adjustedProgress);
              floors[floor].x += floor % 2 === 0 ? buckleFactor : -buckleFactor;
            } 
            // Floors at failure point break and fall
            else {
              // Calculate fall with acceleration
              const gravity = 9.8; // m/s²
              const fallTime = adjustedProgress * 2; // seconds
              const fallDistance = 0.5 * gravity * Math.pow(fallTime, 2) * 10; // in pixels
              
              // Apply fall with rotation
              floors[floor].y = Math.min(groundY - 10, 
                              groundY - floorHeight * failurePoint + fallDistance);
              
              // Rotation increases with distance from failure point
              const rotationAmount = (floor - failurePoint) * 15 * adjustedProgress;
              floors[floor].x += rotationAmount;
              
              // Add splinter effects for wood
              if (adjustedProgress > 0.3 && adjustedProgress < 0.7) {
                ctx.fillStyle = '#a27153'; // Wood color
                for (let s = 0; s < 2; s++) {
                  // Draw wood splinters
                  ctx.save();
                  ctx.translate(
                    floors[floor].x + buildingWidth/2 + (Math.random() - 0.5) * 40,
                    floors[floor].y + (Math.random() - 0.5) * 15
                  );
                  ctx.rotate(Math.random() * Math.PI);
                  ctx.fillRect(-10, -1, 20, 2);
                  ctx.restore();
                }
              }
            }
          }
        }
        else if (structuralMaterial === 'steel') {
          // STEEL: Global instability with progressive sidesway collapse
          
          // Steel frames typically fail through global instability
          // Calculate global tilt direction (based on displacement direction)
          const collapseSide = buildingDisplacement > 0 ? 1 : -1;
          
          // Initial lean angle increases with progress
          const baseLeadAngle = collapseProgress * 0.3; // radians
          
          // P-delta effect: upper floors magnify rotation more than lower floors
          const floorFactor = Math.pow(floor / numFloors, 2); // Quadratic increase of effect with height
          const floor_rotation = baseLeadAngle * floorFactor;
          
          // Calculate new position based on rotation around base
          const pivotX = buildingX + buildingWidth/2;
          const pivotY = groundY;
          const floorRadius = pivotY - floors[floor].y;
          const rotatedX = pivotX + Math.sin(floor_rotation * collapseSide) * floorRadius;
          const rotatedY = pivotY - Math.cos(floor_rotation * collapseSide) * floorRadius;
          
          floors[floor].x = rotatedX - buildingWidth/2;
          floors[floor].y = rotatedY;
          
          // Add buckling effect when collapse exceeds certain threshold
          if (collapseProgress > 0.5) {
            // Local buckling in columns
            const bucklingAmplitude = 15 * (collapseProgress - 0.5) * Math.sin(floor * 1.5);
            floors[floor].x += bucklingAmplitude * collapseSide;
            
            // Progressive disconnection of floors
            if (collapseProgress > 0.7 && floor > numFloors * 0.7) {
              // Upper floors detach and fall with gravity
              const detachmentProgress = (collapseProgress - 0.7) / 0.3;
              const fallDistance = 150 * Math.pow(detachmentProgress, 2); // Quadratic for acceleration
              floors[floor].y += fallDistance;
              
              // Rotation of detached floors
              floors[floor].x += collapseSide * 50 * detachmentProgress * (floor / numFloors);
            }
          }
        }
        else if (structuralMaterial === 'hybrid') {
          // HYBRID: Mixed-mode collapse with advanced damping/control systems
          
          // Hybrid structures often have complex failure modes combining aspects of concrete and steel
          
          // Calculate multiple potential failure mechanisms
          const softStoryFactor = 0.4; // Soft story at lower floors
          const initialFailureFloor = Math.floor(numFloors * softStoryFactor);
          
          // Delay collapse for lower floors due to base isolation/damping systems
          const delayFactor = floor < initialFailureFloor ? 
                            0.3 - (floor / initialFailureFloor) * 0.3 : 
                            0 ;
          const adjustedProgress = Math.max(0, collapseProgress - delayFactor);
          
          // Phased collapse with initial rocking then progressive failure
          if (adjustedProgress < 0.3) {
            // Initial phase: rocking motion
            const rockAngle = 0.1 * Math.sin(adjustedProgress * Math.PI * 10) * (1 - adjustedProgress / 0.3);
            const rockingX = buildingWidth * rockAngle * (floor / numFloors);
            floors[floor].x += rockingX;
          } 
          else {
            // Second phase: mechanism formation and collapse
            const secondPhaseProgress = (adjustedProgress - 0.3) / 0.7;
            
            // Floors below failure remain relatively intact but lean
            if (floor < initialFailureFloor) {
              const leanAngle = 0.2 * secondPhaseProgress;
              floors[floor].x += buildingWidth * leanAngle * (floor / initialFailureFloor);
              // Slight compression
              floors[floor].y = groundY - floorHeight * floor * (1 - 0.1 * secondPhaseProgress);
            }
            // Floors at failure point have maximum deformation
            else if (floor === initialFailureFloor) {
              // Dramatic shear deformation at failure floor
              floors[floor].x += buildingWidth * 0.5 * secondPhaseProgress;
              // Slight drop
              floors[floor].y += floorHeight * 0.3 * secondPhaseProgress;
            }
            // Upper floors move as semi-rigid body with acceleration
            else {
              // Calculate advanced motion with damped oscillation
              const dampingTerm = Math.exp(-3 * secondPhaseProgress);
              const oscillation = dampingTerm * Math.sin(secondPhaseProgress * Math.PI * 3);
              
              // Base displacement from failure floor
              const baseDisp = floors[initialFailureFloor].x - buildingX;
              // Additional displacement for upper floors (relative to failure floor)
              const additionalDisp = buildingWidth * 0.3 * secondPhaseProgress * 
                                    (floor - initialFailureFloor) / (numFloors - initialFailureFloor);
              
              // Combined displacement with oscillation effect
              floors[floor].x = buildingX + baseDisp + additionalDisp + 
                              oscillation * 30 * (floor - initialFailureFloor) / (numFloors - initialFailureFloor);
              
              // Progressive vertical displacement (upper floors start detaching)
              if (secondPhaseProgress > 0.7) {
                const detachProgress = (secondPhaseProgress - 0.7) / 0.3;
                floors[floor].y += floorHeight * detachProgress * (floor - initialFailureFloor) * 0.5;
              }
            }
          }
          
          // Add special damper failure effects for hybrid structures
          if (floor % 3 === 0 && adjustedProgress > 0.5 && adjustedProgress < 0.8) {
            // Draw broken dampers/isolators
            ctx.save();
            ctx.strokeStyle = '#3b82f6'; // Blue for damping devices
            ctx.lineWidth = 2;
            const deviceX = floors[floor].x + (floor % 2 === 0 ? 0 : buildingWidth);
            const deviceY = floors[floor].y;
            
            // Draw broken damper
            ctx.beginPath();
            ctx.moveTo(deviceX, deviceY);
            ctx.lineTo(deviceX + (Math.random() - 0.5) * 30, deviceY + 10);
            ctx.stroke();
            
            // Draw failure spring effect
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              ctx.lineTo(deviceX + (Math.random() - 0.5) * 15, 
                         deviceY + 10 + i * 3);
            }
            ctx.stroke();
            ctx.restore();
          }
        }
        
        // Add global dust cloud effect for all materials
        if (collapseProgress > 0.2) {
          const dustOpacity = Math.min(0.5, (collapseProgress - 0.2) * 0.7);
          ctx.fillStyle = `rgba(200, 200, 200, ${dustOpacity})`;
          
          // Create dust cloud at bottom of building
          ctx.beginPath();
          ctx.ellipse(
            buildingX + buildingWidth/2, 
            groundY + 10, 
            buildingWidth * (0.8 + collapseProgress * 0.5), 
            30 * collapseProgress, 
            0, 0, Math.PI * 2
          );
          ctx.fill();
          
          // Additional dust particles
          for (let d = 0; d < 10; d++) {
            const particleX = buildingX + Math.random() * buildingWidth;
            const particleY = groundY - Math.random() * 50 * collapseProgress;
            const particleSize = 3 + Math.random() * 8;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Draw floor slab with styling based on material
      ctx.fillStyle = hasCollapsed ? '#dc2626' : (floor === 0 ? '#1e40af' : materialProps.color || '#3b82f6');
      ctx.fillRect(floors[floor].x, floorY - 5, buildingWidth, 10);
      
      // Add 3D effect to floors
      ctx.strokeStyle = hasCollapsed ? '#991b1b' : (floor === 0 ? '#1c3879' : (materialProps.color || '#2563eb'));
      ctx.lineWidth = 1;
      ctx.strokeRect(floors[floor].x, floorY - 5, buildingWidth, 10);
      
      // Add shadow underneath for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(floors[floor].x + 2, floorY - 5 + 10, buildingWidth, 2);
    }
    
    // Set initial collapse time if just collapsed
    if (hasCollapsed && !floors.lastCollapseTime) {
      floors.lastCollapseTime = time;
    }
    
    // Draw columns between floors with proper structural deformation
    for (let floor = 0; floor < numFloors; floor++) {
      const currentFloor = floors[floor];
      const nextFloor = floors[floor + 1];
      
      // Skip if floor data is missing (shouldn't happen)
      if (!currentFloor || !nextFloor) continue;
      
      // Calculate inter-story drift
      const drift = Math.abs(nextFloor.displacement - currentFloor.displacement);
      
      // Column color based on drift and material properties
      // Changes color as strain increases
      let columnColor;
      const driftRatio = drift / buildingWidth;
      
      // Different damage thresholds based on material properties
      const damageThreshold = materialProps.damageThreshold;
      const severeThreshold = damageThreshold * 1.5;
      const criticalThreshold = materialProps.collapseThreshold * 0.8;
      
      if (hasCollapsed) {
        // Red for collapsed building
        columnColor = '#dc2626';
      } else if (driftRatio < damageThreshold) {
        // Normal range - use material color
        columnColor = materialProps.color;
      } else if (driftRatio < severeThreshold) {
        // Moderate strain - yellow
        columnColor = '#eab308';
      } else if (driftRatio < criticalThreshold) {
        // High strain - orange
        columnColor = '#f97316';
      } else {
        // Critical strain - red
        columnColor = '#dc2626';
      }
      
      // Draw columns with varying thickness (wider at lower floors)
      // Adjust thickness based on material type
      const baseThickness = structuralMaterial === 'steel' ? 1.8 : 
                          structuralMaterial === 'wood' ? 2.5 : 2.2;
      const columnWidth = baseThickness + (numFloors - floor) * 0.3;
      
      ctx.strokeStyle = columnColor;
      ctx.lineWidth = columnWidth;
        
      // Left column
      ctx.beginPath();
      ctx.moveTo(currentFloor.x, currentFloor.y);
      ctx.lineTo(nextFloor.x, nextFloor.y);
      ctx.stroke();
        
      // Right column
      ctx.beginPath();
      ctx.moveTo(currentFloor.x + buildingWidth, currentFloor.y);
      ctx.lineTo(nextFloor.x + buildingWidth, nextFloor.y);
      ctx.stroke();
    
      // Draw inter-story connection (beams) with subtle gradient
      if (simulationMode === 'realistic' && driftRatio > damageThreshold) {
        // Make beams visible during significant deformation
        const gradient = ctx.createLinearGradient(
          currentFloor.x, currentFloor.y,
          nextFloor.x, nextFloor.y
        );
        gradient.addColorStop(0, columnColor);
        gradient.addColorStop(1, '#3b82f6');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        
        // Draw different bracing patterns based on material
        if (structuralMaterial === 'steel') {
          // X-bracing for steel structures
          ctx.beginPath();
          ctx.moveTo(currentFloor.x, currentFloor.y);
          ctx.lineTo(nextFloor.x + buildingWidth, nextFloor.y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(currentFloor.x + buildingWidth, currentFloor.y);
          ctx.lineTo(nextFloor.x, nextFloor.y);
          ctx.stroke();
        } else if (structuralMaterial === 'concrete') {
          // Shear walls for concrete
          if (floor % 3 === 0) { // Every few floors
            ctx.fillStyle = 'rgba(30, 64, 175, 0.2)';
            const points = [
              {x: currentFloor.x, y: currentFloor.y},
              {x: nextFloor.x, y: nextFloor.y},
              {x: nextFloor.x + buildingWidth/4, y: nextFloor.y},
              {x: currentFloor.x + buildingWidth/4, y: currentFloor.y}
            ];
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
            ctx.fill();
          }
        } else if (structuralMaterial === 'hybrid') {
          // Diagrid pattern for hybrid
          const midX = (currentFloor.x + nextFloor.x + buildingWidth) / 2;
          const midY = (currentFloor.y + nextFloor.y) / 2;
          
          ctx.beginPath();
          ctx.moveTo(currentFloor.x, currentFloor.y);
          ctx.lineTo(midX, midY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(currentFloor.x + buildingWidth, currentFloor.y);
          ctx.lineTo(midX, midY);
          ctx.stroke();
        }
      }
    }
    
    // Calculate top floor displacement for use in multiple calculations below
    const topDisplacement = Math.abs(floors[numFloors].displacement);
    
    // Add info text with enhanced styling
    // Main info panel with semi-transparent background
    const infoX = width / 2;
    const infoY = groundY + 50;
    const infoWidth = 350;
    const infoHeight = 120;
    
    // Create semi-transparent panel for info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(infoX - infoWidth/2, infoY - 20, infoWidth, infoHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.strokeRect(infoX - infoWidth/2, infoY - 20, infoWidth, infoHeight);
    
    // Display PGA with improved accuracy
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    let pgaText, pgaValue;
    if (simulationMode === 'realistic' && forcedPGA !== undefined) {
      // For realistic mode, directly calculate appropriate PGA based on displacement
      
      // Engineering rule of thumb: PGA ~= displacement / (10 * story count)
      // For a 10-story building showing 71.4cm displacement, PGA should be ~0.7g
      const minPgaForDisplacement = topDisplacement / (10 * numFloors); // Simple engineering approximation
      
      // Modify this formula to ensure realistic PGA values that match the visible building deformation
      // Typical relationship for moderate-to-large earthquakes:
      // Displacement(cm) ≈ 100-200 × PGA(g) for multi-story buildings
      // Therefore PGA(g) ≈ Displacement(cm) / 150
      
      // During initialization or quiet period, show lower PGA values
      if (time < PRE_EARTHQUAKE_TIME || time < 2.0) {
        // During quiet period, show small ambient PGA
        pgaValue = 0.05 + 0.02 * Math.sin(time * 0.5);
        pgaText = `Peak Ground Acceleration: ${pgaValue.toFixed(3)}g`;
      } else {
        // For active shaking, calculate appropriate PGA
        const calculatedPGA = Math.min(
          1.5, // Maximum realistic PGA cap (most earthquakes don't exceed 1-2g)
          Math.max(
            topDisplacement / 150, // Direct calculation from displacement
            0.05,                  // Minimum PGA to show noticeable deformation
            Math.abs(forcedPGA) * 0.3 // Original PGA with reasonable amplification
          )
        );
        
        // Display appropriate PGA value
        pgaValue = calculatedPGA;
        pgaText = `Peak Ground Acceleration: ${pgaValue.toFixed(3)}g`;
      }
    } else {
      const pga = getCalculatedValues().pga;
      pgaText = `Peak Ground Acceleration: ${pga}g`;
      // Make sure pgaValue is undefined when not in realistic mode
      pgaValue = undefined;
    }
    ctx.fillText(pgaText, infoX, infoY);
    
    // Display displacement with units - exactly as measured for consistency
    ctx.fillStyle = '#10b981';
    // Ensure displayed displacement is never exactly zero - minimum 0.2 cm for visibility
    const displayDisplacement = Math.abs(topDisplacement) < 0.1 ? 0.2 : topDisplacement;
    ctx.fillText(`Building Displacement: ${displayDisplacement.toFixed(1)} cm`, infoX, infoY + 25);
    
    // Display material and building information
    const material = materialProperties[structuralMaterial];
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`Material: ${material.name}`, infoX, infoY + 50);
    
    // Display building code and reinforcement
    const code = buildingCodeProperties[buildingCode];
    const reinforcementInfo = reinforcementProperties[reinforcement];
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(`${code.name} | ${reinforcementInfo.name} ${aiSupport ? '| AI-Enhanced' : ''}`, infoX, infoY + 75);
    
    // Display collapse status or building health
    if (hasCollapsed) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('BUILDING COLLAPSED', infoX, infoY + 100);
    } else {
      // Calculate and show building health percentage
      const maxDriftRatio = Math.max(...Array.from({length: numFloors}, (_, i) => {
        if (!floors[i] || !floors[i+1]) return 0;
        return Math.abs(floors[i+1].x - floors[i].x) / (floors[i+1].y - floors[i].y);
      }));
      
      const collapseThreshold = material.collapseThreshold * 
                               buildingCodeProperties[buildingCode].collapseThresholdModifier *
                               reinforcementProperties[reinforcement].collapseThresholdModifier;
      
      // Calculate health as percentage of remaining capacity
      const healthPercent = Math.max(0, 100 * (1 - maxDriftRatio / collapseThreshold));
      
      // CRITICAL: Force collapse if building exceeds realistic limits
      // PGA-based collapse check - buildings have absolute limits regardless of other factors
      const absolutePGALimit = material.collapseThreshold * 
                              buildingCodeProperties[buildingCode].collapseThresholdModifier * 
                              reinforcementProperties[reinforcement].collapseThresholdModifier * 15; // Convert to g
      
      // Displacement-based collapse check (in cm)
      const maxDisplacement = Math.abs(topDisplacement);
      const materialDisplacementLimit = {
        'concrete': 120, // cm
        'steel': 180,    // cm
        'wood': 90,      // cm
        'hybrid': 200    // cm
      };
      const adjustedDisplacementLimit = materialDisplacementLimit[structuralMaterial] * 
                                       buildingCodeProperties[buildingCode].collapseThresholdModifier *
                                       reinforcementProperties[reinforcement].collapseThresholdModifier;
      
      // Extremely high drift ratio check (absolute safety mechanism)
      if ((maxDriftRatio > collapseThreshold * 1.2 || 
          (pgaValue !== undefined && pgaValue > absolutePGALimit && pgaValue > 0.8) || 
          (maxDisplacement > adjustedDisplacementLimit * 0.9 && maxDisplacement > 30)) && 
          !hasCollapsed && currentTime > 5) { // Only check after 5 seconds
        // Set collapse flag to trigger animation
        console.log(`Building collapsed due to: ${maxDriftRatio > collapseThreshold * 1.2 ? 'Drift Ratio' : 
                                              (pgaValue !== undefined && pgaValue > absolutePGALimit) ? 'PGA' : 
                                              'Displacement'}`);
        console.log(`Values: Drift=${maxDriftRatio.toFixed(3)}, DriftLimit=${collapseThreshold.toFixed(3)}, 
                    PGA=${pgaValue ? pgaValue.toFixed(3) : 'N/A'}, PGALimit=${absolutePGALimit.toFixed(3)},
                    Disp=${maxDisplacement.toFixed(1)}, DispLimit=${adjustedDisplacementLimit.toFixed(1)}`);
        
        setTimeout(() => setHasCollapsed(true), 50); // Small delay for visual effect
        
        // Draw red warning first
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('CRITICAL STRUCTURAL FAILURE', infoX, infoY + 100);
        return;
      }
      
      // Color based on health
      let healthColor;
      if (healthPercent > 80) {
        healthColor = '#22c55e'; // Green
      } else if (healthPercent > 50) {
        healthColor = '#eab308'; // Yellow
      } else if (healthPercent > 25) {
        healthColor = '#f97316'; // Orange
      } else {
        healthColor = '#ef4444'; // Red
      }
      
      // Current capacity display
      ctx.fillStyle = healthColor;
      ctx.fillText(`Building Health: ${healthPercent.toFixed(1)}%`, infoX, infoY + 100);
      
      // Show collapse thresholds to the user
      ctx.font = '10px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Collapse Thresholds: PGA ${absolutePGALimit.toFixed(2)}g | Drift ${(collapseThreshold * 100).toFixed(1)}% | Disp ${adjustedDisplacementLimit.toFixed(0)}cm`, 
                  infoX, infoY + 120);
    }
    
    // Display current time and phase if in realistic mode
    if (simulationMode === 'realistic') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`Time: ${time.toFixed(1)}s`, infoX, infoY - 5);
      
      // Display earthquake phase with color coding
      let phaseText = "";
      let phaseColor = "";
      if (time < PRE_EARTHQUAKE_TIME) {
        phaseText = "Pre-earthquake quiet period";
        phaseColor = "#60a5fa"; // Blue
      } else if (time < PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION) {
        phaseText = "Main shock";
        phaseColor = "#ef4444"; // Red
      } else {
        phaseText = "Aftershock period";
        phaseColor = "#f97316"; // Orange
      }
      ctx.fillStyle = phaseColor;
      ctx.font = 'bold 10px Arial';
      ctx.fillText(phaseText, infoX, infoY - 35);
    }
  };
  
  // Update time history data for engineering graphs
  const updateTimeHistoryData = (time, groundAccel, buildingDisp) => {
    // Keep a moving window of data for better visualization
    const MAX_VISIBLE_POINTS = 100;
    
    // Calculate approximate velocity based on displacement and time
    const velocity = buildingDisp * 2.0; // Approximate velocity
    
    // Use magnitude and distance to scale effects for more dramatic visualization
    const magnitudeScaling = Math.pow(10, (magnitude - 6.0) / 3.0);
    const distanceFactor = Math.pow(Math.max(5, distance) / 10, -0.8);
    
    // Scale values for better visualization
    const scaledAccel = groundAccel * magnitudeScaling * distanceFactor;
    const scaledVelocity = velocity * magnitudeScaling * distanceFactor;
    const scaledDisp = buildingDisp * magnitudeScaling * distanceFactor;
    
    setTimeHistoryData(prevData => {
      // Get existing data or initialize
      const prevTimes = prevData.time || [];
      const prevPga = prevData.pga || [];
      const prevVelocity = prevData.velocity || [];
      const prevDisplacement = prevData.displacement || [];
      
      // Add new data point
      const newTimes = [...prevTimes, time];
      const newPga = [...prevPga, scaledAccel];
      const newVelocity = [...prevVelocity, scaledVelocity];
      const newDisplacement = [...prevDisplacement, scaledDisp];
      
      // Keep only the last MAX_VISIBLE_POINTS
      const sliceStart = Math.max(0, newTimes.length - MAX_VISIBLE_POINTS);
      
      return {
        time: newTimes.slice(sliceStart),
        pga: newPga.slice(sliceStart),
        velocity: newVelocity.slice(sliceStart),
        displacement: newDisplacement.slice(sliceStart),
        currentPoint: newTimes.length - sliceStart - 1 // Point to the most recent data
      };
    });
  };
  
  // Animation loop that handles both modes
  const animate = () => {
    if (!isPlaying) return;
    
    if (simulationMode === 'realistic') {
      // Use the specialized realistic mode animation
      animateRealistic();
    } else {
      // Simplified mode animation with parameter-responsive behavior
      setCurrentTime(prevTime => {
        const newTime = prevTime + 0.016 * speed; // ~60fps with speed factor
        
        // For simplified mode, calculate motion with current parameters
        const { frequency, maxAmplitude, dampingRatio } = animationData;
        
        // Calculate ground motion with current parameters
        const groundMotion = Math.sin(2 * Math.PI * frequency * newTime) * maxAmplitude * 30;
        
        // Calculate building response with current damping
        const dampingFactor = Math.exp(-dampingRatio * 2 * Math.PI * frequency * newTime);
        const buildingResp = -groundMotion * dampingFactor * 1.5;
        
        // Apply magnitude and distance effects for more responsive visualization
        const magnitudeScaling = Math.pow(10, (magnitude - 6.0) / 3.0);
        const distanceAttenuation = Math.pow(Math.max(5, distance) / 10, -0.5);
        
        // Scale building response for better visualization
        const scaledResp = buildingResp * magnitudeScaling * distanceAttenuation;
        
        // Draw with current parameters
        if (canvasRef.current) {
          drawFrame(newTime, groundMotion / 30, scaledResp); // Convert to g
        }
        
        // Update building displacement state
        setBuildingDisplacement(scaledResp);
        
        // Update time history data for graphs
        updateTimeHistoryData(newTime, groundMotion / 30, scaledResp);
        
        // Loop the animation
        if (newTime >= 10) {
          return 0;
        }
        
        return newTime;
      });
      
      // Request the next animation frame
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      // Reset the time history data when starting to play
      if (simulationMode === 'realistic') {
        // Only generate data if it hasn't been generated already
        if (!realisticDataRef.current || !realisticDataRef.current.time || realisticDataRef.current.time.length === 0) {
          // Generate complete dataset first but only show empty graphs initially
          console.log("Generating realistic data from useEffect...");
          const fullData = generateRealisticEarthquakeData();
          
          // Store full data in ref for animation to use
          realisticDataRef.current = fullData;
          
          // Initialize time history data with empty arrays
          setTimeHistoryData({
            time: [],
            pga: [],
            velocity: [],
            displacement: [],
            currentPoint: -1
          });
        }
      } else {
        // For simplified mode, initialize with empty data
        setTimeHistoryData({
          time: [],
          pga: [],
          velocity: [],
          displacement: [],
          currentPoint: -1
        });
      }
      
      // Start the animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Stop the animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, simulationMode]);

  // When parameters change, check if we need to regenerate realistic data
  useEffect(() => {
    // Reset collapse state when parameters change
    setHasCollapsed(false);
    
    // Only update when in realistic mode
    if (simulationMode === 'realistic') {
      console.log("Parameters changed, regenerating data");
      
      // Always regenerate data when parameters change
      const newData = generateRealisticEarthquakeData();
      setTimeHistoryData(newData);
      
      // Reset animation
      setCurrentTime(0);
      
      // Ensure the first frame is drawn with the new data
      if (canvasRef.current) {
        const initialPGA = newData.pga.length > 0 ? newData.pga[0] : 0.05;
        const initialDisp = newData.displacement.length > 0 ? newData.displacement[0] : 0.5;
        drawFrame(0, initialPGA, initialDisp);
      }
      
      // Auto-start animation after parameter change
      setIsPlaying(true);
    } else {
      // For simplified mode, recalculate animation data based on new parameters
      const values = getCalculatedValues();
      setAnimationData({
        frequency: values.frequency,
        maxAmplitude: values.maxAmplitude,
        dampingRatio: values.dampingRatio
      });
      
      // Reset time history data
      setTimeHistoryData({
        time: [],
        pga: [],
        velocity: [],
        displacement: []
      });
      
      // Draw initial frame with new parameters
      if (canvasRef.current) {
        drawFrame(0, 0, 2.0);
      }
      
      // Auto-start animation after parameter change
      setIsPlaying(true);
    }
  }, [magnitude, distance, soilType, damping, structuralMaterial, buildingCode, reinforcement, aiSupport]);
  
  // Initialize canvas and data
  useEffect(() => {
    // Reset collapse state when initializing
    setHasCollapsed(false);
    
    // Generate data on first load or mode change
    if (simulationMode === 'realistic') {
      try {
        // For realistic mode, generate and display data immediately
        const newData = generateRealisticEarthquakeData();
        
        // Ensure there's some initial displacement data so the building is visible
        if (newData.displacement && newData.displacement.length > 0) {
          // Apply a small initial displacement if all values are near zero
          const hasSignificantDisplacement = newData.displacement.some(d => Math.abs(Number(d)) > 1.0);
          
          if (!hasSignificantDisplacement) {
            // Create a small displacement pattern for initial visibility
            newData.displacement = newData.displacement.map((val, i) => {
              const initialValue = 3.0 * Math.sin(i * 0.1); // Small sinusoidal pattern
              return initialValue.toFixed(4);
            });
          }
        }
        
        // Set displacement values to be moderate - avoid triggering collapse
        newData.displacement = newData.displacement.map(d => {
          const val = parseFloat(d);
          // Cap displacement to avoid triggering collapse
          return Math.min(Math.abs(val), 10).toFixed(4);
        });
        
        // Same for PGA values
        newData.pga = newData.pga.map(p => {
          const val = parseFloat(p);
          // Cap PGA to avoid triggering collapse
          return Math.min(Math.abs(val), 0.5).toFixed(4);
        });
        
        setTimeHistoryData(newData);
        
        // Draw the initial frame
        if (canvasRef.current) {
          const initialPGA = newData.pga.length > 0 ? newData.pga[0] : 0;
          const initialDisp = newData.displacement.length > 0 ? newData.displacement[0] : 2.0;
          
          // Apply scaling with limited values
          const magnitudeScalingFactor = Math.min(1.5, Math.pow(1.5, magnitude - 6.0));
          const scaledDisplacement = Math.min(initialDisp * magnitudeScalingFactor, 10);
          
          drawFrame(0, initialPGA, scaledDisplacement);
        }
      } catch (error) {
        console.error("Error generating realistic data:", error);
        setTimeHistoryData({
          time: [],
          pga: [],
          velocity: [],
          displacement: []
        });
        
        if (canvasRef.current) {
          drawFrame(0, 0, 2.0); // Use non-zero displacement value
        }
      }
    } else {
      // For simplified mode
      setTimeHistoryData({
        time: [],
        pga: [],
        velocity: [],
        displacement: []
      });
      
      if (canvasRef.current) {
        drawFrame(0, 0, 2.0); // Use non-zero displacement value
      }
    }
    
    // Notify parent component that visualization is ready
    onVisualizationReady();
  }, [simulationMode]);

  // Professional chart options with engineering styling
  const getChartOptions = (title, yAxisLabel, minY, maxY) => {
    const phaseLineColor = 'rgba(100, 116, 139, 0.5)';
    
    // Dynamically determine appropriate scale for display based on parameters
    let dynamicMaxY = maxY;
    let dynamicMinY = minY;
    
    // Dynamically set scales based on magnitude and other parameters
    const magnitudeScalingFactor = Math.pow(10, (magnitude - 6.0) / 2.0);
    
    // For acceleration, scale by magnitude with realistic limits
    if (title.includes('Acceleration')) {
      const expectedMaxAccel = Math.min(2.5, 0.3 * magnitudeScalingFactor); // Cap at 2.5g for ultra-realistic limits
      dynamicMaxY = Math.max(expectedMaxAccel * 1.5, 0.5); // At least 0.5g range
      dynamicMinY = -dynamicMaxY;
    }
    
    // For displacement, scale to precise values based on magnitude and building type
    if (title.includes('Displacement')) {
      const materialFactor = structuralMaterial === 'concrete' ? 1.0 :
                           structuralMaterial === 'steel' ? 0.85 :
                           structuralMaterial === 'wood' ? 1.3 : 0.9;
      const expectedMaxDisp = Math.min(250, 40 * magnitudeScalingFactor * materialFactor); 
      dynamicMaxY = Math.max(expectedMaxDisp * 1.5, 35); 
      dynamicMinY = -dynamicMaxY;
    }
    
    // For velocity, scale by magnitude with realistic engineering limits
    if (title.includes('Velocity')) {
      const soilFactor = soilType === 'rock' ? 0.8 :
                       soilType === 'stiff' ? 1.0 :
                       soilType === 'soft' ? 1.4 : 1.8;
      const expectedMaxVel = Math.min(180, 35 * magnitudeScalingFactor * soilFactor);
      dynamicMaxY = Math.max(expectedMaxVel * 1.2, 35);
      dynamicMinY = -dynamicMaxY;
    }
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: title,
          color: '#1e293b',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', 'Roboto', 'Arial', sans-serif"
          },
          padding: {
            bottom: 10
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: {
            size: 12,
            weight: 'bold',
            family: "'Inter', 'Roboto', 'Arial', sans-serif"
          },
          bodyFont: {
            size: 11,
            family: "'Inter', 'Roboto', 'Arial', sans-serif"
          },
          padding: 10,
          cornerRadius: 4,
          displayColors: false,
          callbacks: {
            title: function(tooltipItems) {
              return `Time: ${Number(tooltipItems[0].label).toFixed(3)}s`; // More precise time display
            },
            label: function(context) {
              // Engineering style formatting with proper units and precision
              let valueLabel = '';
              if (context.dataset.label.includes('Acceleration')) {
                valueLabel = `Acceleration: ${Number(context.raw).toFixed(5)}g`;
              } else if (context.dataset.label.includes('Velocity')) {
                valueLabel = `Velocity: ${Number(context.raw).toFixed(4)} cm/s`;
              } else if (context.dataset.label.includes('Displacement')) {
                valueLabel = `Displacement: ${Number(context.raw).toFixed(4)} cm`;
              }
              return valueLabel;
            }
          }
        },
        annotation: {
          annotations: {
            phaseLines: title.includes('Acceleration') && simulationMode === 'realistic' ? [
              {
                type: 'line',
                xMin: PRE_EARTHQUAKE_TIME,
                xMax: PRE_EARTHQUAKE_TIME,
                borderColor: phaseLineColor,
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                  content: 'Main shock',
                  display: true,
                  position: 'top',
                  backgroundColor: 'rgba(107, 114, 128, 0.7)',
                  color: '#fff',
                  font: {
                    size: 10
                  }
                }
              },
              {
                type: 'line',
                xMin: PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION,
                xMax: PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION,
                borderColor: phaseLineColor,
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                  content: 'Aftershock',
                  display: true,
                  position: 'top',
                  backgroundColor: 'rgba(107, 114, 128, 0.7)',
                  color: '#fff',
                  font: {
                    size: 10
                  }
                }
              }
            ] : []
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time [s]',
            color: '#475569',
            font: {
              size: 12,
              weight: 'bold',
              family: "'Inter', 'Roboto', 'Arial', sans-serif"
            }
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 10,
              family: "'Inter', 'Roboto', 'Arial', sans-serif"
            },
            autoSkip: true,
            maxTicksLimit: 15,
            precision: 3
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.6)',
            tickColor: 'rgba(226, 232, 240, 0.9)',
            tickLength: 8,
            lineWidth: 1,
            drawBorder: true,
            offset: false
          }
        },
        y: {
          title: {
            display: true,
            text: yAxisLabel,
            color: '#475569',
            font: {
              size: 12,
              weight: 'bold',
              family: "'Inter', 'Roboto', 'Arial', sans-serif"
            }
          },
          min: dynamicMinY,
          max: dynamicMaxY,
          ticks: {
            color: '#64748b',
            font: {
              size: 10,
              family: "'Inter', 'Roboto', 'Arial', sans-serif"
            },
            precision: 4,
            count: 11,
            stepSize: (dynamicMaxY - dynamicMinY) / 10
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.6)',
            lineWidth: 1,
            drawBorder: true
          }
        }
      },
      animation: {
        duration: 0 // Disable animations for better performance
      },
      elements: {
        line: {
          tension: 0.3,
          borderWidth: 1.5,
          fill: true
        },
        point: {
          // Only render points for the current time marker
          radius: ctx => (ctx.datasetIndex === 1 ? 4 : 0)
        }
      },
      layout: {
        padding: {
          top: 20, // Make room for labels
          right: 15,
          left: 5,
          bottom: 5
        }
      }
    };
  };

  // Function to calculate more accurate PGA using state-of-the-art ground motion models
  const calculatePGA = (magnitude, distance, soilType) => {
    // Implementation of NGA-West2 Ground Motion Model (Boore-Atkinson 2014)
    // This is a standard model used in modern seismic hazard analysis
    
    // Input parameters
    const M = magnitude;      // Moment magnitude
    const Rjb = distance;     // Joyner-Boore distance (km)
    const VS30 = soilType === 'rock' ? 760 :     // Site Vs30 in m/s
                soilType === 'stiff' ? 400 : 
                soilType === 'soft' ? 250 : 150;  // Very soft
    
    // Reference values
    const Vref = 760; // Reference Vs30 (m/s)
    const Mref = 4.5; // Reference magnitude
    const Rref = 1.0; // Reference distance (km)
    
    // Model coefficients for PGA from Boore et al. (2014)
    const e0 = -4.416;
    const e1 = 0.984;
    const e2 = 0.537;
    const e3 = -1.499;
    const e4 = -0.496;
    const e5 = -2.773;
    const e6 = 0.248;
    const e7 = 6.768;
    const Mh = 6.75;  // Hinge magnitude
    const c = 2.400;  // Distance coefficient
    const h = 4.5;    // Pseudo-depth (km)
    
    // Magnitude scaling
    let FM;
    if (M <= Mh) {
      FM = e0 + e1 * (M - Mref) + e2 * Math.pow(M - Mref, 2);
    } else {
      FM = e0 + e1 * (Mh - Mref) + e2 * Math.pow(Mh - Mref, 2) + e3 * (M - Mh);
    }
    
    // Distance scaling
    const R = Math.sqrt(Rjb * Rjb + h * h); // Hypocentral distance
    const FD = (e4 + e5 * (M - Mref)) * Math.log(R / Rref);
    
    // Site amplification
    const Fsite = calculateSiteAmplification(VS30);
    
    // Compute median ground motion (in ln scale)
    const lnY = FM + FD + Fsite;
    
    // Convert from ln to linear scale and from cm/s² to g
    const gmInCmSec2 = Math.exp(lnY);
    const pgaInG = gmInCmSec2 / 980.665; // Convert to g
    
    // Apply regional factors based on global region (assumed Western US)
    const regionalFactor = 1.0;
    
    // Apply directivity effects for near-fault locations
    let directivityFactor = 1.0;
    if (Rjb < 20 && M > 6.5) {
      // Simplified directivity model
      directivityFactor = 1.0 + 0.05 * (M - 6.5) * (1.0 - Rjb / 20.0);
    }
    
    // Apply aleatory variability (randomness inherent in ground motions)
    // Standard deviation components from NGA-West2
    const tau = 0.40; // Between-event variability
    const phi = 0.55; // Within-event variability
    const sigma = Math.sqrt(tau * tau + phi * phi); // Total standard deviation
    
    // Generate a random normal variate (mean 0, stddev 1)
    // Truncated at +/- 2.5 sigma to avoid unrealistic extremes
    const randomNormal = () => {
      const u1 = Math.random();
      const u2 = Math.random();
      // Box-Muller transform for normal distribution
      let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      // Truncate to avoid extreme values
      z = Math.max(-2.5, Math.min(2.5, z));
      return z;
    };
    
    const epsilon = randomNormal();
    
    // Apply variability to median ground motion
    let finalPGA = pgaInG * Math.exp(epsilon * sigma) * regionalFactor * directivityFactor;
    
    // Ensure PGA is within realistic bounds
    // Hard cap based on observed historical limit of ~3g
    finalPGA = Math.min(Math.max(finalPGA, 0.01), 3.0);
    
    return finalPGA;
  };
  
  // Helper function for site amplification
  const calculateSiteAmplification = (VS30) => {
    // Site coefficients from Boore et al. (2014)
    const c = -0.6;
    const Vc = 1500.0; // m/s
    const Vref = 760.0; // m/s
    
    // Linear site amplification term
    let siteAmp;
    if (VS30 <= Vc) {
      siteAmp = c * Math.log(VS30 / Vref);
    } else {
      siteAmp = c * Math.log(Vc / Vref);
    }
    
    // Add nonlinear site response for soft soils
    if (VS30 < 400) {
      // Simplified nonlinear term - stronger for softer soils
      const nonlinearFactor = -0.1 * Math.max(0, (400 - VS30) / 400);
      siteAmp += nonlinearFactor;
    }
    
    return siteAmp;
  };

  // Engineering time history graphs with professional styling
  const pgaChartData = {
    labels: timeHistoryData && timeHistoryData.time ? 
      timeHistoryData.time.map(t => typeof t === 'number' ? t.toFixed(3) : t) : [],
    datasets: [
      {
        label: 'Peak Ground Acceleration',
        data: timeHistoryData && timeHistoryData.pga ? 
          timeHistoryData.pga.map(val => typeof val === 'string' ? parseFloat(val) : val) : [],
        borderColor: 'rgba(37, 99, 235, 1)', // Vibrant blue
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5
      },
      // Add points dataset for current time marker
      {
        label: 'Current Position',
        data: timeHistoryData && timeHistoryData.pga && timeHistoryData.currentPoint !== undefined ? 
          timeHistoryData.pga.map((val, i) => i === timeHistoryData.currentPoint ? 
            (typeof val === 'string' ? parseFloat(val) : val) : null) : 
          [],
        borderColor: 'rgba(220, 38, 38, 1)', // Red
        backgroundColor: 'rgba(220, 38, 38, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointStyle: 'circle',
        showLine: false
      },
      // Add threshold line for significant damage
      {
        label: 'Damage Threshold',
        data: timeHistoryData && timeHistoryData.time ? 
          timeHistoryData.time.map(() => 0.2) : [], // 0.2g is often used as a damage threshold for buildings
        borderColor: 'rgba(234, 88, 12, 0.7)', // Orange
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const velocityChartData = {
    labels: timeHistoryData && timeHistoryData.time ? 
      timeHistoryData.time.map(t => typeof t === 'number' ? t.toFixed(3) : t) : [],
    datasets: [
      {
        label: 'Ground Velocity',
        data: timeHistoryData && timeHistoryData.velocity ? 
          timeHistoryData.velocity.map(val => typeof val === 'string' ? parseFloat(val) : val) : [],
        borderColor: 'rgba(5, 150, 105, 1)', // Vibrant green
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5
      },
      // Add points dataset for current time marker
      {
        label: 'Current Position',
        data: timeHistoryData && timeHistoryData.velocity && timeHistoryData.currentPoint !== undefined ? 
          timeHistoryData.velocity.map((val, i) => i === timeHistoryData.currentPoint ? 
            (typeof val === 'string' ? parseFloat(val) : val) : null) : 
          [],
        borderColor: 'rgba(220, 38, 38, 1)', // Red
        backgroundColor: 'rgba(220, 38, 38, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointStyle: 'circle',
        showLine: false
      },
      // Add threshold line for significant damage
      {
        label: 'Damage Threshold',
        data: timeHistoryData && timeHistoryData.time ? 
          timeHistoryData.time.map(() => 30) : [], // 30 cm/s is often used as a damage threshold
        borderColor: 'rgba(234, 88, 12, 0.7)', // Orange
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const displacementChartData = {
    labels: timeHistoryData && timeHistoryData.time ? 
      timeHistoryData.time.map(t => typeof t === 'number' ? t.toFixed(3) : t) : [],
    datasets: [
      {
        label: 'Building Displacement',
        data: timeHistoryData && timeHistoryData.displacement ? 
          timeHistoryData.displacement.map(val => typeof val === 'string' ? parseFloat(val) : val) : [],
        borderColor: 'rgba(124, 58, 237, 1)', // Vibrant purple
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5
      },
      // Add points dataset for current time marker
      {
        label: 'Current Position',
        data: timeHistoryData && timeHistoryData.displacement && timeHistoryData.currentPoint !== undefined ? 
          timeHistoryData.displacement.map((val, i) => i === timeHistoryData.currentPoint ? 
            (typeof val === 'string' ? parseFloat(val) : val) : null) : 
          [],
        borderColor: 'rgba(220, 38, 38, 1)', // Red
        backgroundColor: 'rgba(220, 38, 38, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointStyle: 'circle',
        showLine: false
      },
      // Add structural damage threshold based on current material
      {
        label: 'Damage Threshold',
        data: timeHistoryData && timeHistoryData.time ? 
          timeHistoryData.time.map(() => {
            const material = materialProperties[structuralMaterial];
            const codeProps = buildingCodeProperties[buildingCode];
            // Convert drift ratio to displacement (cm) for a 10-story building of ~30m height
            const damageDisp = material.damageThreshold * codeProps.stiffnessModifier * 3000 * 0.1;
            return damageDisp;
          }) : [],
        borderColor: 'rgba(234, 88, 12, 0.7)', // Orange
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },
      // Add collapse threshold based on current material
      {
        label: 'Collapse Threshold',
        data: timeHistoryData && timeHistoryData.time ? 
          timeHistoryData.time.map(() => {
            const material = materialProperties[structuralMaterial];
            const codeProps = buildingCodeProperties[buildingCode];
            const reinforcementProps = reinforcementProperties[reinforcement];
            // Convert drift ratio to displacement (cm) for a 10-story building of ~30m height
            const collapseDisp = material.collapseThreshold * 
                               codeProps.collapseThresholdModifier * 
                               reinforcementProps.collapseThresholdModifier * 3000 * 0.1;
            return collapseDisp;
          }) : [],
        borderColor: 'rgba(220, 38, 38, 0.7)', // Red
        borderWidth: 1.5,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // Helper function to calculate floor positions for collapse detection
  const calculateFloorsForBuilding = (displacement) => {
    if (!canvasRef.current) return [];
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // Ground position
    const groundY = height * 0.75;
    
    // Building dimensions
    const buildingWidth = width * 0.3;
    const buildingHeight = groundY * 0.8;
    const buildingX = width / 2 - buildingWidth / 2;
    
    // Use fixed value of 10 for numFloors
    const fixedNumFloors = 10;
    const floorHeight = buildingHeight / fixedNumFloors;
    
    // Calculate floor positions
    const floors = [];
    
    for (let floor = 0; floor <= fixedNumFloors; floor++) {
      const floorY = groundY - floor * floorHeight;
      
      // Simplified mode shape (linear for quick calculation)
      const floorDisplacement = displacement * (floor / fixedNumFloors);
      
      floors.push({
        y: floorY,
        x: buildingX + floorDisplacement,
        displacement: floorDisplacement
      });
    }
    
    return floors;
  };
  
  // Animation loop for realistic mode
  const animateRealistic = () => {
    if (!isPlaying) return;
    
    // Get data from realisticDataRef (the full dataset) 
    // This contains ALL data points, not the windowed subset in timeHistoryData
    const fullData = realisticDataRef.current;
    
    // If no data available, stop animation
    if (!fullData || !fullData.time || fullData.time.length === 0) {
      console.log("No realistic data available, stopping animation");
      setIsPlaying(false);
      return;
    }
    
    setCurrentTime(prevTime => {
      // Time step for 60fps animation
      const newTime = prevTime + 0.016 * speed;
      
      // Find the index in the full precomputed data that matches our current animation time
      const scaledTime = newTime % TOTAL_SIMULATION_TIME; // Loop the animation
      const relativeTime = scaledTime / TOTAL_SIMULATION_TIME; // Normalize to 0-1
      const dataIndex = Math.min(Math.floor(relativeTime * fullData.time.length), fullData.time.length - 1);
      
      // Get the current data point from full dataset
      const actualDisplacement = parseFloat(fullData.displacement[dataIndex] || 0);
      const actualPGA = parseFloat(fullData.pga[dataIndex] || 0);
      
      // Update building displacement
      setBuildingDisplacement(actualDisplacement);
      
      // Create a moving window of data points centered around the current time
      // This creates the "scrolling" effect in the graphs
      const windowSize = 120; // Number of points to show in the window
      
      // Compute the window of data to display based on the current position
      // We want to show data "ahead" of the current position as well as behind
      const behindPoints = 30; // Show this many points behind the current point
      const aheadPoints = windowSize - behindPoints; // Show this many points ahead
      
      // Calculate window boundaries
      const windowStartIdx = Math.max(0, dataIndex - behindPoints);
      const windowEndIdx = Math.min(fullData.time.length - 1, dataIndex + aheadPoints);
      
      // Extract data window from full dataset
      const windowTimes = fullData.time.slice(windowStartIdx, windowEndIdx + 1);
      const windowPGA = fullData.pga.slice(windowStartIdx, windowEndIdx + 1);
      const windowVelocity = fullData.velocity.slice(windowStartIdx, windowEndIdx + 1);
      const windowDisplacement = fullData.displacement.slice(windowStartIdx, windowEndIdx + 1);
      
      // The current point is relative to the window
      const currentPointInWindow = dataIndex - windowStartIdx;
      
      // Update timeHistoryData state with the new window of data
      setTimeHistoryData({
        time: windowTimes,
        pga: windowPGA,
        velocity: windowVelocity,
        displacement: windowDisplacement,
        currentPoint: currentPointInWindow // Highlight current position in the graph
      });
      
      // Draw the building frame
      if (canvasRef.current) {
        drawFrame(scaledTime, actualPGA, actualDisplacement);
      }
      
      // Check for building collapse
      const floors = calculateFloorsForBuilding(actualDisplacement);
      const buildingCollapsed = checkBuildingCollapse(floors, 10, actualPGA);
      
      if (buildingCollapsed && !hasCollapsed) {
        setHasCollapsed(true);
        console.log(`Building collapsed at t=${scaledTime.toFixed(2)}s with:`,
                   `PGA=${actualPGA.toFixed(3)}g, Displacement=${actualDisplacement.toFixed(1)}cm`);
      }
      
      return newTime;
    });
    
    // Request the next animation frame
    animationRef.current = requestAnimationFrame(animateRealistic);
  };

  // Generate realistic earthquake data when needed (based on current parameters)
  const generateRealisticEarthquakeData = () => {
    const numPoints = 800; // Ultra-high resolution for smoother animation

    // Generate time array with proper duration
    const duration = TOTAL_SIMULATION_TIME;
    const timeStep = duration / numPoints;
    const timeArray = Array.from({length: numPoints}, (_, i) => i * timeStep);
    
    // STEP 1: Generate base acceleration time history using advanced stochastic methods
    let accelData = [];
    
    // Calculate dominant frequency based on parameters using empirical models
    // Closer, harder soil, smaller magnitude = higher frequency
    let dominantFrequency = 2.0;
    if (soilType === 'rock') dominantFrequency += 1.2;
    if (soilType === 'soft' || soilType === 'very-soft') dominantFrequency -= 0.7;
    if (distance < 10) dominantFrequency += 0.8;
    if (magnitude > 7.0) dominantFrequency -= 0.7;
    
    // Secondary frequencies for more complex motion
    const secondaryFrequencies = [
      dominantFrequency * 1.5,  // Higher mode
      dominantFrequency * 0.7,  // Lower mode
      dominantFrequency * 2.3,  // Much higher mode
      dominantFrequency * 0.4   // Much lower mode
    ];
    
    // Calculate expected PGA based on magnitude and distance using NGA-West2 model
    const distanceTerm = Math.max(5, distance);
    
    // Higher magnitude = exponentially higher PGA with realistic attenuation
    const magnitudeFactor = Math.pow(10, (magnitude - 5.0) / 2.0);
    
    // Advanced distance attenuation (PGA decreases with distance)
    // Based on actual ground motion prediction equations
    const distanceAttenuation = Math.pow(distanceTerm, -1.3) * Math.exp(-0.01 * distanceTerm);
    
    // Soil amplification factors based on NEHRP site classifications
    const soilAmplification = {
      rock: 1.0,      // Site Class A/B
      stiff: 1.4,     // Site Class C
      soft: 1.8,      // Site Class D
      'very-soft': 2.3 // Site Class E
    };
    
    // Calculate base PGA (in g) using GMPE-style equations
    let expectedPGA = 0.15 * magnitudeFactor * distanceAttenuation;
    expectedPGA *= soilAmplification[soilType] || 1.4;
    
    // Add regional and directivity effects
    const directivityFactor = distance < 15 && magnitude > 6.0 ? 1.3 : 1.0;
    expectedPGA *= directivityFactor;
    
    // Cap PGA to realistic values (rare to exceed 2.5g)
    expectedPGA = Math.min(2.5, expectedPGA);
    
    // Generate stronger shaking for higher magnitudes with magnitude-dependent duration
    const strongMotionDuration = Math.min(MAIN_SHOCK_DURATION, 5 + (magnitude - 5.0) * 2.5);
    
    // Generate acceleration time history using stochastic methods
    for (let i = 0; i < numPoints; i++) {
      const t = timeArray[i];
      
      // Envelope function to model build-up and decay of shaking
      // Based on actual earthquake envelope functions from seismology
      let envelope = 0;
      
      // Pre-earthquake ambient motion (higher values for visibility)
      if (t < PRE_EARTHQUAKE_TIME) {
        // Realistic ambient noise pattern with microseisms
        envelope = 0.02 + 0.015 * Math.sin(t * 2.0) + 0.01 * Math.sin(t * 5.3);
      } 
      // Initial P-wave arrival and build-up of main shock
      else if (t < PRE_EARTHQUAKE_TIME + 0.2 * strongMotionDuration) {
        // P-wave arrival has initial pulse then rapid amplitude increase
        const buildupTime = (t - PRE_EARTHQUAKE_TIME) / (0.2 * strongMotionDuration);
        const initialPulse = 0.2 * Math.exp(-50 * Math.pow(buildupTime - 0.05, 2)); // Initial P-wave pulse
        envelope = buildupTime * 0.9 + initialPulse; // Ramp up to 90% of full amplitude
      } 
      // Strong motion phase - S-waves dominant
      else if (t < PRE_EARTHQUAKE_TIME + 0.6 * strongMotionDuration) {
        // Realistic variations in amplitude during strong shaking
        const strongPhaseTime = (t - (PRE_EARTHQUAKE_TIME + 0.2 * strongMotionDuration)) / (0.4 * strongMotionDuration);
        envelope = 0.9 + 0.1 * Math.sin(t * 5.0) - 0.1 * Math.pow(strongPhaseTime, 2); // Full amplitude with realistic fluctuations
      } 
      // Decay phase - surface waves and coda
      else if (t < PRE_EARTHQUAKE_TIME + strongMotionDuration) {
        const decayTime = (t - (PRE_EARTHQUAKE_TIME + 0.6 * strongMotionDuration)) / (0.4 * strongMotionDuration);
        // Realistic coda decay follows power law with exponential transition
        envelope = Math.exp(-decayTime * 2.0) * (1.0 - decayTime) + Math.pow(1.0 - decayTime, 2) * 0.2; 
      }
      // Aftershock period
      else {
        const aftershockTime = t - (PRE_EARTHQUAKE_TIME + strongMotionDuration);
        
        // Realistic aftershock pattern based on Omori's law
        const omoriParameter = 2.0; // Controls aftershock decay rate
        const aftershockDecay = Math.pow(1 + aftershockTime/omoriParameter, -1.5);
        
        // Generate pulses for aftershocks with clustered timing
        // Aftershocks have higher probability immediately after mainshock
        if (Math.random() < 0.05 * aftershockDecay + 0.01 * Math.exp(-aftershockTime / 2)) {
          // Aftershock amplitude scales with mainshock magnitude (Bath's law)
          const bathLawDrop = 1.2; // Typical mainshock-aftershock magnitude difference
          const aftershockMagnitude = Math.max(3.0, magnitude - bathLawDrop * Math.random());
          const aftershockAmplitude = 0.3 * Math.pow(10, (aftershockMagnitude - 5.0) / 2.0) * aftershockDecay;
          
          // Generate shorter-duration aftershock pulse
          const aftershockDuration = 0.5 + Math.random() * 1.0; // Duration between 0.5-1.5s
          const pulseTime = Math.min(aftershockDuration, Math.random() * 2.0);
          const pulseShape = Math.exp(-Math.pow(pulseTime - aftershockDuration/2, 2) / (2 * Math.pow(aftershockDuration/6, 2)));
          
          envelope = aftershockAmplitude * pulseShape;
        } else {
          // Background tremor following power-law decay
          envelope = 0.04 * aftershockDecay + 0.01 * Math.exp(-aftershockTime);
        }
      }
      
      // Scale envelope by magnitude with realistic relationship
      const magnitudeScaling = Math.pow(10, (magnitude - 6.0) / 3.0);
      envelope *= magnitudeScaling;
      
      // Apply distance attenuation with realistic seismic wave spreading
      envelope *= Math.pow(Math.max(5, distance) / 10, -0.5) * Math.exp(-0.002 * distance);
      
      // Advanced complex waveform using multiple frequencies with phase shifts
      // This creates a more realistic ground motion with frequency content matching real earthquakes
      let acceleration = 0;
      
      // Primary wave component (dominant frequency) - S-waves
      acceleration += envelope * expectedPGA * 0.7 * Math.sin(2 * Math.PI * dominantFrequency * t + 0.5);
      
      // Higher frequency components (more pronounced in hard rock sites) - P-waves and higher modes
      const highFreqFactor = soilType === 'rock' ? 0.5 : 
                           soilType === 'stiff' ? 0.3 : 0.15;
      
      // Add multiple frequency components with appropriate phase shifts
      for (let f = 0; f < secondaryFrequencies.length; f++) {
        const freq = secondaryFrequencies[f];
        const freqAmplitude = highFreqFactor * Math.pow(0.7, f); // Amplitude decreases with higher modes
        const phaseShift = 1.0 + f * 0.8; // Phase shifts between different frequencies
        
        // Add frequency component
        acceleration += envelope * expectedPGA * freqAmplitude * 
                       Math.sin(2 * Math.PI * freq * t + phaseShift);
      }
      
      // Lower frequency components (more pronounced in soft soil sites) - Surface waves and basin effects
      const lowFreqFactor = (soilType === 'soft' || soilType === 'very-soft') ? 0.5 : 
                          soilType === 'stiff' ? 0.3 : 0.15;
      
      // Add long-period motion components (especially important for tall buildings)
      acceleration += envelope * expectedPGA * lowFreqFactor * 
                     Math.sin(2 * Math.PI * (dominantFrequency * 0.4) * t + 2.1);
      
      if (soilType === 'very-soft') {
        // Add basin resonance effects for very soft soils
        const basinFreq = dominantFrequency * 0.3; // Basin frequency
        const basinAmplitude = envelope * expectedPGA * 0.4;
        const basinDuration = t > PRE_EARTHQUAKE_TIME ? Math.exp(-0.1 * (t - PRE_EARTHQUAKE_TIME)) : 0;
        
        // Basin motion continues after primary shaking (resonance effect)
        acceleration += basinAmplitude * basinDuration * 
                       Math.sin(2 * Math.PI * basinFreq * t + 0.7);
      }
      
      // Add realistic non-stationarity with changing frequency content
      if (t > PRE_EARTHQUAKE_TIME && t < PRE_EARTHQUAKE_TIME + strongMotionDuration) {
        // Frequency content changes during earthquake - higher frequencies arrive earlier
        const normalizedTime = (t - PRE_EARTHQUAKE_TIME) / strongMotionDuration;
        const timeVaryingFreq = dominantFrequency * (1.5 - 0.7 * normalizedTime);
        
        // Add time-varying frequency component
        acceleration += envelope * expectedPGA * 0.3 * 
                       Math.sin(2 * Math.PI * timeVaryingFreq * t + 1.5);
      }
      
      // Add realistic random variation (colored noise, not white noise)
      // Low-pass filtered noise component for more realistic motion
      let noise = 0;
      const noiseFrequencies = [1.3, 2.7, 4.1, 6.3, 8.9];
      for (let n = 0; n < noiseFrequencies.length; n++) {
        // Each noise component has random phase, diminishing amplitude with frequency
        noise += (Math.random() * 2 - 1) * Math.pow(0.7, n) * 
                Math.sin(2 * Math.PI * noiseFrequencies[n] * t + Math.random() * 10);
      }
      
      // Add filtered noise component
      const randomComponent = envelope * expectedPGA * 0.15 * noise;
      acceleration += randomComponent;
      
      accelData.push(acceleration);
    }
    
    // If AI support is active, reduce the PGA
    if (aiSupport) {
      const reductionFactor = aiSupportProperties.active.responseReductionFactor;
      accelData = accelData.map(a => a * reductionFactor);
    }
    
    // STEP 2: Integrate acceleration to get velocity and displacement using Newmark-beta method
    // This is much more accurate than simple integration
    let velocityData = [0]; // Start with zero velocity
    let displacementData = [0]; // Start with zero displacement
    
    // Apply building period and damping from material properties
    const material = materialProperties[structuralMaterial];
    const codeProps = buildingCodeProperties[buildingCode];
    
    // Calculate effective period and damping using actual structural engineering principles
    const effectivePeriod = 0.1 * Math.sqrt(numFloors) + // Empirical period-height relationship
                          numFloors * 0.05 + // Taller buildings have longer periods
                          (100000.0 / material.elasticModulus); // Material stiffness effect
    
    // Damping ratio combines material and code properties
    const effectiveDamping = material.dampingRatio * codeProps.dampingModifier;
    
    // For each time step, integrate acceleration to get velocity and displacement
    // Using Newmark-beta method which is more accurate than simple trapezoidal rule
    const beta = 0.25; // Newmark beta parameter (0.25 = average acceleration)
    const gamma = 0.5; // Newmark gamma parameter
    
    for (let i = 1; i < accelData.length; i++) {
      const dt = timeArray[i] - timeArray[i-1];
      const accel = accelData[i];
      const prevAccel = accelData[i-1];
      const prevVel = velocityData[i-1];
      const prevDisp = displacementData[i-1];
      
      // Effective stiffness and mass parameters
      const omega = 2 * Math.PI / effectivePeriod; // Angular frequency
      const damping = effectiveDamping;
      
      // Apply Newmark-beta integration
      // Calculate effective acceleration for integration
      const effectiveAccel = prevAccel + ((accel - prevAccel) * gamma / beta / dt);
      
      // Calculate velocity increment with damping
      const dampingCoeff = 2 * damping * omega;
      const stiffnessCoeff = omega * omega;
      
      // Apply structural dynamics equation of motion with damping and stiffness
      const restoringForce = -stiffnessCoeff * prevDisp;
      const dampingForce = -dampingCoeff * prevVel;
      const netForce = effectiveAccel + restoringForce + dampingForce;
      
      // Integrate using Newmark-beta method
      const velocity = prevVel + dt * (1 - gamma) * prevAccel + dt * gamma * accel;
      velocityData.push(velocity);
      
      // Calculate displacement using updated velocity
      const displacement = prevDisp + dt * prevVel + dt * dt * (0.5 - beta) * prevAccel + dt * dt * beta * accel;
      displacementData.push(displacement);
    }
    
    // Scale displacement to get proper building displacement in cm using detailed structural factors
    const stiffnessFactor = material.elasticModulus * codeProps.stiffnessModifier / 50000;
    const dispScaleFactor = 180 / Math.max(0.1, stiffnessFactor); // Higher values = more displacement
    
    // Scale displacements to centimeters with realistic structural engineering factors
    const displacementDataCm = displacementData.map(d => d * dispScaleFactor);
    
    // Apply magnitude scaling for displacement (higher magnitudes cause larger displacements)
    // Based on empirical earthquake engineering relationships
    const magnitudeDispScaling = Math.pow(10, (magnitude - 6.0) / 2.5);
    
    // Apply final displacement scaling with magnitude effect
    const scaledDisplacementData = displacementDataCm.map(d => d * magnitudeDispScaling);
    
    // Scale velocities consistently in cm/s
    const scaledVelocityData = velocityData.map(v => v * dispScaleFactor * magnitudeDispScaling);
    
    // Ensure no NaN values in the data
    const validateData = (arr) => arr.map(val => isNaN(val) ? 0 : val);
    
    // Store the full data for animation to access
    realisticDataRef.current = {
      time: timeArray,
      pga: validateData(accelData),
      velocity: validateData(scaledVelocityData),
      displacement: validateData(scaledDisplacementData)
    };
    
    // Convert arrays to string values for consistent handling
    const formatValue = val => val.toString();
    
    // Return the data in a format ready to use
    return {
      time: timeArray,
      pga: validateData(accelData).map(formatValue),
      velocity: validateData(scaledVelocityData).map(formatValue),
      displacement: validateData(scaledDisplacementData).map(formatValue),
      currentPoint: 0 // Add a current point tracker
    };
  };
  
  // Reset function to properly reset animation and data
  const handleReset = () => {
    // Stop animation if playing
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Reset time and displacement
    setCurrentTime(0);
    setBuildingDisplacement(0);
    
    // Reset collapse state
    setHasCollapsed(false);
    
    // Clear data for both modes
    setTimeHistoryData({
      time: [],
      pga: [],
      velocity: [],
      displacement: [],
      currentPoint: -1
    });
    
    // Clear reference data
    realisticDataRef.current = null;
    
    // Draw building at rest position
    if (canvasRef.current) {
      drawFrame(0, 0, 0);
    }
    
    // Reset playing state
    setIsPlaying(false);
  };

  return (
    <div className={`seismic-visualization ${className}`} style={{ width, position: 'relative' }}>
      <div className="flex flex-col gap-6">
        {/* Main visualization area */}
        <div className="flex-grow">
          <div 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative"
            style={{ height }}
          >
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={600}
              className="w-full h-full"
            />
            
            {/* Playback controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              {!isPlaying ? (
                <button 
                  onClick={() => {
                    // For realistic mode, ensure data is generated before playing
                    if (simulationMode === 'realistic') {
                      console.log("Generating realistic data from Play button click...");
                      
                      // Always generate fresh data when Play is clicked in realistic mode
                      const fullData = generateRealisticEarthquakeData();
                      realisticDataRef.current = fullData;
                      
                      // Initialize timeHistoryData with the first few data points
                      // This ensures the animation has something to display immediately
                      if (fullData.time && fullData.time.length > 0) {
                        const previewLength = Math.min(10, fullData.time.length);
                        setTimeHistoryData({
                          time: fullData.time.slice(0, previewLength),
                          pga: fullData.pga.slice(0, previewLength),
                          velocity: fullData.velocity.slice(0, previewLength),
                          displacement: fullData.displacement.slice(0, previewLength),
                          currentPoint: 0
                        });
                      }
                    }
                    
                    // Reset time to 0
                    setCurrentTime(0);
                    
                    // Start playing
                    setIsPlaying(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Play
                </button>
              ) : (
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Pause
                </button>
              )}
              
              <button 
                onClick={() => {
                  // Force stop and reset
                  setIsPlaying(false);
                  setHasCollapsed(false); // Explicitly reset collapse state
                  setTimeout(() => handleReset(), 50);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Reset
              </button>
              
              <div className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg px-3">
                <span className="text-white mr-2 text-sm">Speed:</span>
                <select 
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="bg-transparent text-white border-none text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>
              </div>
              
              <div className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg px-3">
                <span className="text-white mr-2 text-sm">Mode:</span>
                <select 
                  value={simulationMode}
                  onChange={(e) => {
                    // Stop animation if playing
                    setIsPlaying(false);
                    // Change mode
                    setSimulationMode(e.target.value);
                    // Reset when changing modes for consistent state
                    setTimeout(() => handleReset(), 50);
                  }}
                  className="bg-transparent text-white border-none text-sm"
                >
                  <option value="simplified">Simplified</option>
                  <option value="realistic">Realistic</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering time history graphs */}
        <div className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {/* PGA Graph */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-inner h-[180px] md:h-[220px]">
            <Line 
              data={pgaChartData} 
              options={getChartOptions('Acceleration [g]', 'Acceleration (g)', -0.6, 0.6)} 
            />
          </div>
          
          {/* Velocity Graph */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-inner h-[180px] md:h-[220px]">
            <Line 
              data={velocityChartData} 
              options={getChartOptions('Velocity [cm/sec]', 'Velocity (cm/s)', -140, 80)} 
            />
          </div>
          
          {/* Displacement Graph */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-inner h-[180px] md:h-[220px]">
            <Line 
              data={displacementChartData} 
              options={getChartOptions('Displacement [cm]', 'Displacement (cm)', -100, 50)} 
            />
          </div>
        </div>
        
        {/* Earthquake parameters controls */}
        {showControls && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Simulation Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Magnitude: {magnitude}
                </label>
                <input 
                  type="range" 
                  min={4.0}
                  max={9.0}
                  step={0.1}
                  value={magnitude}
                  onChange={(e) => {
                    setMagnitude(parseFloat(e.target.value));
                    
                    if (simulationMode === 'realistic') {
                      // Flag for update, but don't regenerate immediately
                      // This prevents regenerating multiple times during a slider drag
                      setNeedsDataUpdate(true);
                    } else {
                      // Reset graphs when changing parameters in simplified mode
                      setTimeHistoryData({
                        time: [],
                        pga: [],
                        velocity: [],
                        displacement: []
                      });
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4.0</span>
                  <span>9.0</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distance (km): {distance}
                </label>
                <input 
                  type="range" 
                  min={5}
                  max={50}
                  step={1}
                  value={distance}
                  onChange={(e) => {
                    setDistance(parseFloat(e.target.value));
                    
                    if (simulationMode === 'realistic') {
                      // Flag for update
                      setNeedsDataUpdate(true);
                    } else {
                      // Reset graphs when changing parameters in simplified mode
                      setTimeHistoryData({
                        time: [],
                        pga: [],
                        velocity: [],
                        displacement: []
                      });
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soil Type:
                </label>
                <select 
                  value={soilType}
                  onChange={(e) => {
                    setSoilType(e.target.value);
                    
                    if (simulationMode === 'realistic') {
                      // Flag for update
                      setNeedsDataUpdate(true);
                    } else {
                      // Reset graphs when changing parameters in simplified mode
                      setTimeHistoryData({
                        time: [],
                        pga: [],
                        velocity: [],
                        displacement: []
                      });
                    }
                  }}
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="rock">Rock</option>
                  <option value="stiff">Stiff Soil</option>
                  <option value="soft">Soft Soil</option>
                  <option value="very-soft">Very Soft Soil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Building Damping: {(damping * 100).toFixed(0)}%
                </label>
                <input 
                  type="range" 
                  min={0.01}
                  max={0.2}
                  step={0.01}
                  value={damping}
                  onChange={(e) => {
                    setDamping(parseFloat(e.target.value));
                    
                    if (simulationMode === 'realistic') {
                      // Flag for update
                      setNeedsDataUpdate(true);
                    } else {
                      // Reset graphs when changing parameters in simplified mode
                      setTimeHistoryData({
                        time: [],
                        pga: [],
                        velocity: [],
                        displacement: []
                      });
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
            
            {/* Structural parameters section */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Structural Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Building Material:
                  </label>
                  <select 
                    value={structuralMaterial}
                    onChange={(e) => {
                      setStructuralMaterial(e.target.value);
                      setHasCollapsed(false); // Reset collapse state when changing material
                      
                      if (simulationMode === 'realistic') {
                        // Flag for update
                        setNeedsDataUpdate(true);
                      }
                    }}
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="concrete">Reinforced Concrete</option>
                    <option value="steel">Structural Steel</option>
                    <option value="wood">Engineered Wood</option>
                    <option value="hybrid">Hybrid Structure</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {materialProperties[structuralMaterial].description}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Building Code:
                  </label>
                  <select 
                    value={buildingCode}
                    onChange={(e) => {
                      setBuildingCode(e.target.value);
                      setHasCollapsed(false); // Reset collapse state when changing code
                      
                      if (simulationMode === 'realistic') {
                        // Flag for update
                        setNeedsDataUpdate(true);
                      }
                    }}
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="legacy">Pre-2000 Code</option>
                    <option value="modern">Modern Code</option>
                    <option value="advanced">Performance-Based Design</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {buildingCodeProperties[buildingCode].description}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reinforcement Level:
                  </label>
                  <select 
                    value={reinforcement}
                    onChange={(e) => {
                      setReinforcement(e.target.value);
                      setHasCollapsed(false); // Reset collapse state when changing reinforcement
                      
                      if (simulationMode === 'realistic') {
                        // Flag for update
                        setNeedsDataUpdate(true);
                      }
                    }}
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="minimal">Minimal Reinforcement</option>
                    <option value="standard">Standard Reinforcement</option>
                    <option value="advanced">Advanced Reinforcement</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {reinforcementProperties[reinforcement].description}
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <input
                      type="checkbox"
                      checked={aiSupport}
                      onChange={() => {
                        setAiSupport(!aiSupport);
                        setHasCollapsed(false); // Reset collapse state when changing AI support
                        
                        if (simulationMode === 'realistic') {
                          // Flag for update
                          setNeedsDataUpdate(true);
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    AI-Enhanced Structural Control
                  </label>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {aiSupport ? 
                      aiSupportProperties.active.description : 
                      aiSupportProperties.inactive.description}
                  </p>
                  
                  {/* Collapse simulation reset button */}
                  {hasCollapsed && (
                    <button
                      onClick={() => {
                        setHasCollapsed(false);
                        handleReset();
                      }}
                      className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Reset Collapsed Building
                    </button>
                  )}
                </div>
              </div>

              {/* Collapse Prediction Analytics Section */}
              <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="text-md font-bold mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Structural Collapse Analysis
                </h4>
                
                {(() => {
                  // Calculate collapse thresholds based on current parameters
                  const material = materialProperties[structuralMaterial];
                  const codeProps = buildingCodeProperties[buildingCode];
                  const reinforcementProps = reinforcementProperties[reinforcement];
                  
                  // Drift ratio threshold
                  const driftThreshold = material.collapseThreshold * 
                                       codeProps.collapseThresholdModifier * 
                                       reinforcementProps.collapseThresholdModifier;
                  
                  // PGA threshold (g)
                  const pgaThreshold = driftThreshold * 15;
                  
                  // Displacement threshold (cm)
                  const materialDisplacementLimit = {
                    'concrete': 120, // cm
                    'steel': 180,    // cm
                    'wood': 90,      // cm
                    'hybrid': 200    // cm
                  };
                  const displacementThreshold = materialDisplacementLimit[structuralMaterial] * 
                                              codeProps.collapseThresholdModifier *
                                              reinforcementProps.collapseThresholdModifier;
                  
                  // Calculate expected magnitude that would cause collapse
                  // Simple approximation based on engineering judgment
                  const distanceFactor = Math.pow(Math.max(5, distance) / 10, 0.7); // Distance attenuation
                  const soilFactor = soilType === 'rock' ? 1.0 : 
                                   soilType === 'stiff' ? 1.3 : 
                                   soilType === 'soft' ? 1.7 : 2.0;
                                   
                  // Approximate collapse magnitude (will vary based on many factors)
                  const expectedCollapseMag = Math.min(9.0, 
                                            4.5 + pgaThreshold / (0.1 * distanceFactor * soilFactor));
                  
                  // Structural vulnerability assessment
                  let vulnerabilityLevel = 'low';
                  if (driftThreshold < 0.025 || pgaThreshold < 0.5 || displacementThreshold < 80) {
                    vulnerabilityLevel = 'extreme';
                  } else if (driftThreshold < 0.035 || pgaThreshold < 0.7 || displacementThreshold < 120) {
                    vulnerabilityLevel = 'high';
                  } else if (driftThreshold < 0.045 || pgaThreshold < 0.9 || displacementThreshold < 150) {
                    vulnerabilityLevel = 'moderate';
                  }
                  
                  // Color coding based on vulnerability
                  const vulnColors = {
                    low: 'text-green-600 dark:text-green-400',
                    moderate: 'text-yellow-600 dark:text-yellow-400',
                    high: 'text-orange-600 dark:text-orange-400',
                    extreme: 'text-red-600 dark:text-red-400'
                  };
                  
                  // Warning messages based on vulnerability
                  const vulnMessages = {
                    low: 'Resilient structure with good seismic performance.',
                    moderate: 'Structure may experience damage in moderate to severe earthquakes.',
                    high: 'Structure is vulnerable to collapse in strong ground motion.',
                    extreme: 'Structure has critical vulnerabilities and is likely to collapse even in moderate earthquakes.'
                  };
                  
                  return (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 uppercase">PGA Threshold</h5>
                          <p className="text-lg font-bold">{pgaThreshold.toFixed(2)}g</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Peak Ground Acceleration</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 uppercase">Drift Limit</h5>
                          <p className="text-lg font-bold">{(driftThreshold * 100).toFixed(1)}%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Inter-story Drift Ratio</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 uppercase">Displacement Limit</h5>
                          <p className="text-lg font-bold">{displacementThreshold.toFixed(0)} cm</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Max Building Displacement</p>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm mb-3">
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 uppercase">Vulnerability Assessment</h5>
                          <span className={`text-sm font-semibold ${vulnColors[vulnerabilityLevel]}`}>
                            {vulnerabilityLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {vulnMessages[vulnerabilityLevel]}
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                        <h5 className="text-xs text-gray-500 dark:text-gray-400 uppercase">Collapse Prediction</h5>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm">Structure will likely collapse at:</p>
                          <span className="text-sm font-semibold">
                            M{expectedCollapseMag.toFixed(1)}+ @ {distance}km
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full ${
                              vulnerabilityLevel === 'extreme' ? 'bg-red-500' : 
                              vulnerabilityLevel === 'high' ? 'bg-orange-500' : 
                              vulnerabilityLevel === 'moderate' ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, Math.max(0, ((magnitude - 4) / (expectedCollapseMag - 4)) * 100))}%`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>M4.0</span>
                          <span>Current: M{magnitude}</span>
                          <span>M9.0</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            {/* Material properties table */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-auto">
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Show Material Properties
                </summary>
                <div className="mt-2">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-2 text-left">Property</th>
                        <th className="p-2 text-right">Value</th>
                        <th className="p-2 text-right">Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-2">Elastic Modulus</td>
                        <td className="p-2 text-right">{materialProperties[structuralMaterial].elasticModulus.toLocaleString()}</td>
                        <td className="p-2 text-right">MPa</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-2">Yield Stress</td>
                        <td className="p-2 text-right">{materialProperties[structuralMaterial].yieldStress}</td>
                        <td className="p-2 text-right">MPa</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-2">Ultimate Strain</td>
                        <td className="p-2 text-right">{materialProperties[structuralMaterial].ultimateStrain}</td>
                        <td className="p-2 text-right">-</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-2">Damage Threshold (Drift)</td>
                        <td className="p-2 text-right">{materialProperties[structuralMaterial].damageThreshold}</td>
                        <td className="p-2 text-right">-</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-2">Collapse Threshold (Drift)</td>
                        <td className="p-2 text-right">{materialProperties[structuralMaterial].collapseThreshold}</td>
                        <td className="p-2 text-right">-</td>
                      </tr>
                      <tr>
                        <td className="p-2">Density</td>
                        <td className="p-2 text-right">{materialProperties[structuralMaterial].density}</td>
                        <td className="p-2 text-right">kg/m³</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            {simulationMode === 'realistic' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Realistic mode uses pre-generated acceleration time histories based on actual earthquake records.
                  The graphs show characteristic patterns including the quiet period before the earthquake (0-40s),
                  the main shock (40-55s), and the gradual decay afterward. Adjust parameters to see how different
                  earthquakes affect the building response.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeismicVisualization;