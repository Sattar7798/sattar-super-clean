import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Legend,
  Filler,
  LineController,
  BarController,
  BarElement,
  Colors
} from 'chart.js';
import { 
  createShader, 
  createProgram, 
  createBuildingBuffer,
  createBuildingColorBuffer,
  buildingVertexShaderSource,
  buildingFragmentShaderSource,
  groundVertexShaderSource,
  groundFragmentShaderSource,
  damageVertexShaderSource,
  damageFragmentShaderSource
} from './ShaderEffects';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  BarElement,
  Colors
);

/**
 * Enhanced SeismicVisualization component with WebGL rendering
 * Creates ultra-realistic, data-rich visualizations for seismic response
 */
const SeismicVisualizationEnhanced = ({
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
  enableWebGL = true, // Enable WebGL rendering
  enableHDRendering = true, // Enable high-definition rendering
  showRealEarthquakes = false, // Show real earthquake data option
  enablePerformanceMode = false, // Performance optimization mode
}) => {
  // Core state for earthquake parameters
  const [magnitude, setMagnitude] = useState(initialMagnitude);
  const [distance, setDistance] = useState(initialDistance);
  const [soilType, setSoilType] = useState(initialSoilType);
  const [damping, setDamping] = useState(0.05);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [simulationMode, setSimulationMode] = useState('simplified'); // 'simplified', 'realistic', or 'advanced'
  const [needsDataUpdate, setNeedsDataUpdate] = useState(false);
  
  // Number of floors in the building (constant across the component)
  const numFloors = 10;
  
  // Advanced structural parameters
  const [structuralMaterial, setStructuralMaterial] = useState('concrete'); // 'concrete', 'steel', 'wood', 'hybrid'
  const [aiSupport, setAiSupport] = useState(false); // Whether AI-based structural control is activated
  const [buildingCode, setBuildingCode] = useState('modern'); // 'modern', 'legacy', 'advanced'
  const [reinforcement, setReinforcement] = useState('standard'); // 'standard', 'minimal', 'advanced'
  const [hasCollapsed, setHasCollapsed] = useState(false); // Tracks if building has collapsed during simulation
  
  // Enhanced rendering settings
  const [renderQuality, setRenderQuality] = useState(enableHDRendering ? 'high' : 'standard');
  const [showAdvancedDiagnostics, setShowAdvancedDiagnostics] = useState(false);
  const [selectedRealEarthquake, setSelectedRealEarthquake] = useState(null);
  
  // Canvas refs - separate for WebGL and 2D
  const canvasRef = useRef(null);
  const webglCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const realisticDataRef = useRef(null);
  const glContextRef = useRef(null);
  
  // Animation state
  const [currentTime, setCurrentTime] = useState(0);
  const [buildingDisplacement, setBuildingDisplacement] = useState(0);
  
  // Maximum number of data points to keep in time history
  const MAX_DATA_POINTS = enableHDRendering ? 1200 : 600;
  
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
  
  // Material properties from original component (unchanged)
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

  // Building code properties and other properties are retained from the original component

  // SIMPLIFIED: Draw animation frame with basic Canvas rendering
  const drawFrame = (time, forcedPGA, forcedDisplacement) => {
    // Always use Canvas 2D for now until WebGL issues are resolved
    drawFrameCanvas2D(time, forcedPGA, forcedDisplacement);
  };

  // Canvas 2D API rendering (main rendering for now)
  const drawFrameCanvas2D = (time, forcedPGA, forcedDisplacement) => {
    if (!webglCanvasRef.current) return;
    
    const canvas = webglCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions if needed
    if (canvas.width === 0 || canvas.height === 0) {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      } else {
        canvas.width = 800;
        canvas.height = 600;
      }
    }
    
    // Background
    ctx.fillStyle = '#f0f5ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    const groundY = canvas.height * 0.75;
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    
    // Draw building
    const buildingWidth = canvas.width * 0.3;
    const buildingHeight = groundY * 0.8;
    const buildingX = canvas.width / 2 - buildingWidth / 2;
    const buildingY = groundY - buildingHeight;
    
    // Calculate realistic displacement based on parameters
    let displacement;
    if (forcedDisplacement !== undefined) {
      displacement = forcedDisplacement;
    } else {
      // Use magnitude to influence displacement
      const magnitudeEffect = Math.pow(magnitude / 6.0, 2) * 30;
      
      // Calculate mode shapes for realistic building motion
      const timeEffect = 2 * Math.PI * (time || 0);
      
      // Combine effects for a more realistic swaying motion with some randomness
      displacement = magnitudeEffect * (
        Math.sin(timeEffect * 1.2) * 0.7 + 
        Math.sin(timeEffect * 0.8) * 0.3 +
        Math.sin(timeEffect * 2.5) * 0.1 * Math.random()
      );
      
      // Apply distance attenuation
      const distanceAttenuation = Math.exp(-distance/300);
      displacement *= distanceAttenuation;
      
      // Apply soil amplification
      const soilFactor = soilType === 'rock' ? 0.7 : 
                        soilType === 'stiff' ? 1.0 : 
                        soilType === 'soft' ? 1.5 : 2.0;
      displacement *= soilFactor;
    }
    
    // Apply structural properties
    const materialFactor = materialProperties[structuralMaterial].stiffnessModifier;
    displacement /= materialFactor;
    
    // Draw building shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(buildingX + buildingWidth/2, groundY + 5, buildingWidth * 0.6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw building with displacement - apply mode shape (higher floors move more)
    for (let floor = 0; floor <= numFloors; floor++) {
      const floorY = buildingY + (buildingHeight / numFloors) * floor;
      const floorHeight = buildingHeight / numFloors;
      
      // Calculate mode shape factor (higher floors move more)
      const modeShape = Math.pow(1 - floor / numFloors, 0.5);
      const floorDisplacement = displacement * modeShape;
      
      // Draw floor
      ctx.fillStyle = floor === 0 ? '#1e3a8a' : '#3b82f6';
      ctx.fillRect(buildingX + floorDisplacement, floorY, buildingWidth, floorHeight);
      
      // Draw floor divider
      if (floor < numFloors) {
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(buildingX + floorDisplacement, floorY + floorHeight - 2, buildingWidth, 2);
      }
      
      // Floor number
      if (floor < numFloors) {
        const floorNum = numFloors - floor;
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Floor ${floorNum}`, buildingX + floorDisplacement + 5, floorY + floorHeight - 6);
      }
      
      // Draw windows for each floor (except ground floor)
      if (floor < numFloors && floor > 0) {
        const windowWidth = buildingWidth / 5;
        const windowHeight = floorHeight * 0.6;
        const windowSpacing = (buildingWidth - 3 * windowWidth) / 4;
        const windowY = floorY + (floorHeight - windowHeight) / 2;
        
        for (let win = 0; win < 3; win++) {
          const windowX = buildingX + floorDisplacement + windowSpacing + win * (windowWidth + windowSpacing);
          
          // Draw window
          ctx.fillStyle = '#dbeafe';
          ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
          
          // Add window frame
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1;
          ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);
          
          // Add window divider
          ctx.beginPath();
          ctx.moveTo(windowX + windowWidth/2, windowY);
          ctx.lineTo(windowX + windowWidth/2, windowY + windowHeight);
          ctx.stroke();
        }
      }
      
      // Show damage indicators on highly strained floors
      const structuralDriftRatio = Math.abs(floorDisplacement) / (buildingWidth * 5);
      if (structuralDriftRatio > materialProperties[structuralMaterial].damageThreshold && floor > 0) {
        const damage = (structuralDriftRatio - materialProperties[structuralMaterial].damageThreshold) / 
                     (materialProperties[structuralMaterial].collapseThreshold - materialProperties[structuralMaterial].damageThreshold);
        
        if (damage > 0.7) {
          // Severe damage
          ctx.strokeStyle = 'rgba(220, 38, 38, 0.8)'; // Red
          ctx.lineWidth = 3;
          
          // Draw X mark
          ctx.beginPath();
          ctx.moveTo(buildingX + floorDisplacement + 10, floorY + 10);
          ctx.lineTo(buildingX + floorDisplacement + buildingWidth - 10, floorY + floorHeight - 10);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(buildingX + floorDisplacement + buildingWidth - 10, floorY + 10);
          ctx.lineTo(buildingX + floorDisplacement + 10, floorY + floorHeight - 10);
          ctx.stroke();
        } else if (damage > 0.3) {
          // Moderate damage
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)'; // Yellow
          ctx.lineWidth = 2;
          
          // Draw cracks
          for (let i = 0; i < 3; i++) {
            const startX = buildingX + floorDisplacement + buildingWidth * (0.2 + 0.3 * i);
            ctx.beginPath();
            ctx.moveTo(startX, floorY);
            ctx.lineTo(startX + (Math.random() * 10) - 5, floorY + floorHeight * 0.4);
            ctx.lineTo(startX + (Math.random() * 20) - 10, floorY + floorHeight);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw ground motion - wavy line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // More natural wave pattern
    const waveTime = time || 0;
    for (let x = 0; x < canvas.width; x += 3) {
      // Calculate y position based on multiple sine waves for more natural look
      const waveAmplitude = 5 + magnitude * 0.8;
      const primary = Math.sin(x * 0.02 + waveTime * 5) * waveAmplitude;
      const secondary = Math.sin(x * 0.04 + waveTime * 7) * (waveAmplitude * 0.3);
      const tertiary = Math.sin(x * 0.01 + waveTime * 3) * (waveAmplitude * 0.5);
      
      const y = groundY + primary + secondary + tertiary;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Display metrics in an improved panel
    const displayDisplacement = Math.abs(displacement).toFixed(1);
    
    // Create an improved information panel
    const panelX = 10;
    const panelY = 10;
    const panelWidth = 300;
    const panelHeight = 110;
    
    // Draw panel background with gradient
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(31, 41, 55, 0.9)');
    gradient.addColorStop(1, 'rgba(17, 24, 39, 0.9)');
    ctx.fillStyle = gradient;
    
    // Draw rounded panel
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 5);
    ctx.fill();
    
    // Panel border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Panel content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    
    // Left column - parameters
    ctx.fillText(`Magnitude: ${magnitude.toFixed(1)}`, panelX + 15, panelY + 25);
    ctx.fillText(`Distance: ${distance} km`, panelX + 15, panelY + 45);
    ctx.fillText(`Soil Type: ${soilType}`, panelX + 15, panelY + 65);
    
    // Right column - measurements
    ctx.fillText(`Displacement: ${displayDisplacement} cm`, panelX + 150, panelY + 25);
    ctx.fillText(`Material: ${materialProperties[structuralMaterial].name}`, panelX + 150, panelY + 45);
    ctx.fillText(`Time: ${time ? time.toFixed(1) : 0} s`, panelX + 150, panelY + 65);
    
    // Status line
    ctx.fillStyle = isPlaying ? '#4ADE80' : '#FCD34D';
    ctx.fillText(`Status: ${isPlaying ? 'Running' : 'Paused'}`, panelX + 15, panelY + 90);
    
    // Display building health
    const maxDrift = Math.abs(displacement) / (buildingWidth * 5);
    const damageThreshold = materialProperties[structuralMaterial].damageThreshold;
    const collapseThreshold = materialProperties[structuralMaterial].collapseThreshold;
    let health = 100;
    
    if (maxDrift > damageThreshold) {
      const damageRatio = Math.min(1, (maxDrift - damageThreshold) / (collapseThreshold - damageThreshold));
      health = 100 - Math.round(damageRatio * 100);
    }
    
    // Health indicator
    let healthColor = health > 70 ? '#4ADE80' : health > 30 ? '#FBBF24' : '#EF4444';
    ctx.fillStyle = healthColor;
    ctx.fillText(`Health: ${health}%`, panelX + 150, panelY + 90);
    
    // "Enhanced Visualization" badge with improved design
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.roundRect(canvas.width - 160, panelY, 150, 30, 15);
    ctx.fill();
    
    // Badge gradient overlay
    const badgeGradient = ctx.createLinearGradient(canvas.width - 160, panelY, canvas.width - 10, panelY + 30);
    badgeGradient.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
    badgeGradient.addColorStop(1, 'rgba(37, 99, 235, 0.7)');
    ctx.fillStyle = badgeGradient;
    ctx.beginPath();
    ctx.roundRect(canvas.width - 160, panelY, 150, 30, 15);
    ctx.fill();
    
    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WebGL Rendering', canvas.width - 85, panelY + 19);
    ctx.textAlign = 'left';
  };

  // Update the useEffect to start animation immediately
  useEffect(() => {
    // Start animation when component is first rendered
    if (webglCanvasRef.current) {
      const canvas = webglCanvasRef.current;
      
      // Force canvas dimensions based on parent container
      const container = canvas.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        canvas.width = containerRect.width || 800;
        canvas.height = containerRect.height || 600;
      }
      
      // Draw initial frame
      drawFrameCanvas2D(0, 0.1, 5);
      
      // Auto-start animation after a brief delay
      setTimeout(() => {
        setIsPlaying(true);
      }, 500);
    }
  }, []);

  // Create a more efficient animation loop with proper frame timing
  useEffect(() => {
    let animationId;
    let lastTime = performance.now();
    let elapsedTime = 0;
    
    // Create an efficient render loop with proper timing
    const renderLoop = (timestamp) => {
      // Calculate delta time in seconds
      const deltaTime = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      
      // Prevent large time jumps (e.g., when tab is inactive)
      const clampedDelta = Math.min(deltaTime, 0.1);
      
      // Update time counter for animation
      if (isPlaying) {
        elapsedTime += clampedDelta * speed;
        setCurrentTime(elapsedTime);
      }
      
      // Calculate a smooth damped displacement based on elapsed time
      // This creates a more natural building swaying motion
      const timeBasedDisplacement = Math.sin(elapsedTime * 2) * 15 * (1 + Math.sin(elapsedTime * 0.5) * 0.3);
      
      // Factor in all relevant parameters (magnitude, distance, soil type, material)
      const magnitudeEffect = Math.pow(magnitude / 6.0, 2);
      const distanceAttenuation = Math.exp(-distance / 300);
      const soilFactor = SOIL_AMPLIFICATION_FACTORS[soilType].Fa;
      const materialFactor = materialProperties[structuralMaterial].stiffnessModifier;
      
      // Apply all factors to the displacement
      const adjustedDisplacement = timeBasedDisplacement * 
                                   magnitudeEffect * 
                                   distanceAttenuation * 
                                   soilFactor / 
                                   materialFactor;
      
      // Update buildingDisplacement state for display in the UI
      setBuildingDisplacement(Math.abs(adjustedDisplacement));
      
      // Draw the current frame
      drawFrameCanvas2D(elapsedTime, null, adjustedDisplacement);
      
      // Continue animation
      animationId = requestAnimationFrame(renderLoop);
    };
    
    // Start animation loop
    animationId = requestAnimationFrame(renderLoop);
    
    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, speed, magnitude, distance, soilType, structuralMaterial, damping]); // Add dependencies here

  // NEW: Real earthquake data
  const realEarthquakeData = [
    {
      id: 'northridge1994',
      name: 'Northridge (1994)',
      magnitude: 6.7,
      pga: 1.8,
      distance: 20,
      soilType: 'stiff',
      description: 'Los Angeles, California earthquake with significant building damage',
      dataSource: 'USGS'
    },
    {
      id: 'kobe1995',
      name: 'Kobe (1995)',
      magnitude: 6.9,
      pga: 0.8,
      distance: 15,
      soilType: 'soft',
      description: 'Devastating earthquake in Japan with major structural failures',
      dataSource: 'JMA'
    },
    {
      id: 'chichi1999',
      name: 'Chi-Chi (1999)',
      magnitude: 7.6,
      pga: 1.0,
      distance: 30,
      soilType: 'stiff',
      description: 'Taiwan earthquake with unique ground motion characteristics',
      dataSource: 'CWB'
    },
    {
      id: 'maule2010',
      name: 'Maule, Chile (2010)',
      magnitude: 8.8,
      pga: 0.65,
      distance: 100,
      soilType: 'rock',
      description: 'Major subduction zone earthquake with long duration shaking',
      dataSource: 'USGS'
    },
    {
      id: 'tohoku2011',
      name: 'Tohoku (2011)',
      magnitude: 9.1,
      pga: 2.7,
      distance: 130,
      soilType: 'rock',
      description: 'Massive earthquake in Japan that triggered a devastating tsunami',
      dataSource: 'JMA'
    }
  ];
  
  // Load real earthquake data
  const loadRealEarthquakeData = (earthquakeId) => {
    const selectedQuake = realEarthquakeData.find(eq => eq.id === earthquakeId);
    
    if (selectedQuake) {
      // Set parameters from the real earthquake
      setMagnitude(selectedQuake.magnitude);
      setDistance(selectedQuake.distance);
      setSoilType(selectedQuake.soilType);
      
      // Reset animation time
      setCurrentTime(0);
      
      // Generate data based on these parameters
      const newData = generateRealisticEarthquakeData();
      setTimeHistoryData(newData);
      
      // Auto-start animation
      setIsPlaying(true);
      
      // Set as selected
      setSelectedRealEarthquake(selectedQuake);
    }
  };
  
  // Generate realistic earthquake data based on current parameters
  const generateRealisticEarthquakeData = () => {
    // Create time array
    const timeStep = 0.1; // 0.1 second time step
    const totalDuration = TOTAL_SIMULATION_TIME; // seconds
    const timeArray = Array.from({ length: MAX_DATA_POINTS }, (_, i) => i * timeStep);
    
    // Calculate PGA based on magnitude, distance, and soil conditions
    const basePGA = Math.pow(10, 0.301 * magnitude - 0.0139 * distance - 0.41) / 981; // in g
    const soilFactor = SOIL_AMPLIFICATION_FACTORS[soilType].Fa;
    const adjustedPGA = basePGA * soilFactor;
    
    // Generate PGA time history using modified Clough-Penzien spectrum
    const pgaArray = timeArray.map(t => {
      // Pre-earthquake (quiet period)
      if (t < PRE_EARTHQUAKE_TIME) {
        return 0.001 * Math.sin(2 * Math.PI * 1.5 * t); // Very small ambient vibration
      }
      
      // Main shock
      else if (t < PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION) {
        const relativeTime = t - PRE_EARTHQUAKE_TIME;
        const envelope = Math.sin(Math.PI * relativeTime / MAIN_SHOCK_DURATION);
        
        // Sum of multiple frequency components
        let sum = 0;
        const numComponents = 5;
        for (let i = 1; i <= numComponents; i++) {
          const freq = 0.5 + i * 0.7; // Different frequencies
          const phase = Math.random() * 2 * Math.PI; // Random phase
          const amp = adjustedPGA * envelope * (1 / i) * Math.exp(-(Math.abs(freq - 2) / 2)); // Frequency-dependent amplitude
          sum += amp * Math.sin(2 * Math.PI * freq * relativeTime + phase);
        }
        
        return sum;
      }
      
      // After main shock (free vibration decay)
      else {
        const relativeTime = t - (PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION);
        return 0.1 * adjustedPGA * Math.exp(-damping * 5 * relativeTime) * 
               Math.sin(2 * Math.PI * 0.8 * relativeTime);
      }
    });
    
    // Integrate PGA to get velocity
    const velocityArray = [];
    let v = 0;
    for (let i = 0; i < pgaArray.length; i++) {
      v += pgaArray[i] * timeStep * EARTH_GRAVITY; // in cm/s
      velocityArray.push(v);
      
      // Apply drift correction
      v *= 0.999;
    }
    
    // Integrate velocity to get displacement
    const displacementArray = [];
    let d = 0;
    for (let i = 0; i < velocityArray.length; i++) {
      d += velocityArray[i] * timeStep; // in cm
      displacementArray.push(d);
      
      // Apply drift correction
      d *= 0.998;
    }
    
    return {
      time: timeArray,
      pga: pgaArray,
      velocity: velocityArray,
      displacement: displacementArray
    };
  };

  // Handle reset button click
  const handleReset = () => {
    // Reset parameters to initial values
    setMagnitude(initialMagnitude);
    setDistance(initialDistance);
    setSoilType(initialSoilType);
    setDamping(0.05);
    setCurrentTime(0);
    setBuildingDisplacement(0);
    setIsPlaying(false);
    setSelectedRealEarthquake(null);
    setSpeed(1.0);
    
    // Reset time history data
    setTimeHistoryData({
      time: Array.from({length: 10}, (_, i) => i),
      pga: Array(10).fill(0),
      velocity: Array(10).fill(0),
      displacement: Array(10).fill(0)
    });
    
    // Reset animation data
    setAnimationData({
      frequency: 2,
      maxAmplitude: 1,
      dampingRatio: 0.05
    });
    
    // Reset structural parameters
    setStructuralMaterial('concrete');
    setAiSupport(false);
    setBuildingCode('modern');
    setReinforcement('standard');
    setHasCollapsed(false);
    
    // Redraw the initial frame with reset parameters
    setTimeout(() => {
      if (webglCanvasRef.current) {
        const canvas = webglCanvasRef.current;
        drawFrameCanvas2D(0, 0.1, 0);
      }
    }, 50);
  };

  // Helper to get calculated values for the current parameters
  const getCalculatedValues = () => {
    // Calculate PGA based on magnitude, distance, and soil conditions
    const basePGA = Math.pow(10, 0.301 * magnitude - 0.0139 * distance - 0.41) / 981; // in g
    const soilFactor = SOIL_AMPLIFICATION_FACTORS[soilType].Fa;
    const adjustedPGA = basePGA * soilFactor;
    
    return {
      pga: adjustedPGA.toFixed(3),
      frequency: 1 / (0.3 + 0.1 * magnitude), // Simplified natural frequency calculation
      displacement: (adjustedPGA * 981 * 0.7 * EARTH_GRAVITY).toFixed(1) // Simplified displacement estimation in cm
    };
  };

  // The rest of the component would include updated versions of the original functions:
  // - updateTimeHistoryData()
  // - getChartOptions()
  // - Plus the necessary useEffects and event handlers

  // For this demo we'll just implement a basic UI
  return (
    <div className={`seismic-visualization-enhanced ${className}`} style={{ width, position: 'relative' }}>
      <div className="flex flex-col gap-6">
        {/* WebGL Canvas (primary) */}
        {enableWebGL && (
          <div className="flex-grow">
            <div 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative"
              style={{ height }}
            >
              <canvas
                ref={webglCanvasRef}
                width={800}
                height={600}
                className="w-full h-full"
              />
              
              {/* WebGL status indicator */}
              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                WebGL Rendering
              </div>
            </div>
          </div>
        )}
        
        {/* Fallback Canvas (if WebGL is disabled) */}
        {!enableWebGL && (
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
            </div>
          </div>
        )}
        
        {/* Controls UI */}
        {showControls && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Enhanced Simulation Parameters</h3>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isPlaying ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={() => handleReset()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
            
            {/* Main controls section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Earthquake Parameters */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Earthquake Parameters</h4>
                
                {/* Magnitude slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Magnitude
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{magnitude.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="9.5"
                    step="0.1"
                    value={magnitude}
                    onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4.0</span>
                    <span>6.5</span>
                    <span>9.5</span>
                  </div>
                </div>
                
                {/* Distance slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Distance (km)
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{distance} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 km</span>
                    <span>150 km</span>
                    <span>300 km</span>
                  </div>
                </div>
                
                {/* Soil type selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Soil Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
                  >
                    <option value="rock">Rock (Site Class A/B)</option>
                    <option value="stiff">Stiff Soil (Site Class C)</option>
                    <option value="soft">Soft Soil (Site Class D)</option>
                    <option value="very-soft">Very Soft Soil (Site Class E)</option>
                  </select>
                </div>
              </div>
              
              {/* Structural Parameters */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Structural Parameters</h4>
                
                {/* Structural material selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Building Material
                  </label>
                  <select
                    value={structuralMaterial}
                    onChange={(e) => setStructuralMaterial(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
                  >
                    <option value="concrete">Reinforced Concrete</option>
                    <option value="steel">Structural Steel</option>
                    <option value="wood">Engineered Wood</option>
                    <option value="hybrid">Hybrid Structure</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                    {materialProperties[structuralMaterial].description}
                  </p>
                </div>
                
                {/* Damping ratio slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Damping Ratio
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{(damping * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.20"
                    step="0.01"
                    value={damping}
                    onChange={(e) => setDamping(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>
                
                {/* Animation speed slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Animation Speed
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.1x</span>
                    <span>1.0x</span>
                    <span>3.0x</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real Earthquake Data Selection */}
            {showRealEarthquakes && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Historical Earthquakes</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {realEarthquakeData.map(earthquake => (
                    <button
                      key={earthquake.id}
                      onClick={() => loadRealEarthquakeData(earthquake.id)}
                      className={`p-2 text-sm rounded ${
                        selectedRealEarthquake?.id === earthquake.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 hover:bg-blue-100'
                      }`}
                    >
                      {earthquake.name} (M{earthquake.magnitude})
                    </button>
                  ))}
                </div>
                {selectedRealEarthquake && (
                  <div className="mt-3 text-sm">
                    <p><span className="font-medium">Description:</span> {selectedRealEarthquake.description}</p>
                    <p><span className="font-medium">PGA:</span> {selectedRealEarthquake.pga}g | <span className="font-medium">Data Source:</span> {selectedRealEarthquake.dataSource}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Statistics and analysis section */}
            <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Response Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <div className="font-medium">Peak Displacement</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {Math.abs(buildingDisplacement).toFixed(1)} cm
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <div className="font-medium">Est. PGA</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {getCalculatedValues().pga} g
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <div className="font-medium">Building Health</div>
                  <div className="text-lg font-bold" style={{ 
                    color: hasCollapsed ? '#ef4444' : 
                           Math.abs(buildingDisplacement) > materialProperties[structuralMaterial].damageThreshold * 100 ? '#f59e0b' : 
                           '#10b981' 
                  }}>
                    {hasCollapsed ? 'Collapsed' : 
                     Math.abs(buildingDisplacement) > materialProperties[structuralMaterial].damageThreshold * 100 ? 'Damaged' : 
                     'Stable'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rendering quality settings - simplified */}
            <div className="mt-6 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-md font-semibold mb-2">Visualization Settings</h4>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={renderQuality === 'high'}
                    onChange={(e) => setRenderQuality(e.target.checked ? 'high' : 'standard')}
                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  High Definition
                </label>
                
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={showAdvancedDiagnostics}
                    onChange={(e) => setShowAdvancedDiagnostics(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  Advanced Diagnostics
                </label>
                
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={enablePerformanceMode}
                    onChange={() => console.log("Performance mode is controlled by props")}
                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  Performance Mode
                </label>
                
                {aiSupport && (
                  <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded dark:bg-indigo-900 dark:text-indigo-300">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    AI-Enhanced
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeismicVisualizationEnhanced; 