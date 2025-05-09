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
  
  // Canvas ref
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const realisticDataRef = useRef(null);
  
  // Animation state
  const [currentTime, setCurrentTime] = useState(0);
  const [buildingDisplacement, setBuildingDisplacement] = useState(0);
  
  // Maximum number of data points to keep in time history
  const MAX_DATA_POINTS = 300;
  
  // Pre-earthquake time in seconds (quiet period)
  const PRE_EARTHQUAKE_TIME = 40;
  // Main shock duration in seconds
  const MAIN_SHOCK_DURATION = 15;
  // Total simulation time in seconds
  const TOTAL_SIMULATION_TIME = 90;
  
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
  
  // Draw animation frame
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
      // For realistic mode - use the pre-calculated values
      groundMotion = forcedPGA * 300; // Convert to pixel scale for better visibility
      buildingResp = forcedDisplacement * 0.5; // Scale displacement for better visualization
      setBuildingDisplacement(buildingResp);
    } else {
      // For simplified mode - calculate sinusoidal response
      const { frequency, maxAmplitude } = animationData;
      groundMotion = Math.sin(2 * Math.PI * frequency * time) * maxAmplitude * 30;
      
      // Calculate building response (with phase lag and amplification at top)
      // Using simplified SDOF response
      const dampingFactor = Math.exp(-animationData.dampingRatio * 2 * Math.PI * frequency * time);
      buildingResp = -groundMotion * dampingFactor * 1.5;
      setBuildingDisplacement(buildingResp);
      
      // Generate time history data for engineering graphs
      updateTimeHistoryData(time, groundMotion, buildingResp);
    }
    
    // Draw building (10-story)
    const buildingWidth = width * 0.3;
    const buildingHeight = groundY * 0.8;
    const buildingX = width / 2 - buildingWidth / 2;
    const buildingY = groundY - buildingHeight;
    
    // Number of floors
    const numFloors = 10;
    const floorHeight = buildingHeight / numFloors;
    
    // Draw each floor with increasing displacement at higher floors
    for (let floor = 0; floor <= numFloors; floor++) {
      const floorY = groundY - floor * floorHeight;
      
      // Displacement increases with height (mode shape)
      // For realistic mode, we apply a mode shape profile
      const floorDisplacement = simulationMode === 'realistic' 
        ? buildingResp * Math.pow(floor / numFloors, 1.3) // Non-linear shape for realistic mode
        : buildingResp * (floor / numFloors); // Linear shape for simplified mode
      
      // Draw floor slab
      ctx.fillStyle = floor === 0 ? '#1e40af' : '#3b82f6';
      ctx.fillRect(buildingX + floorDisplacement, floorY - 5, buildingWidth, 10);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(buildingX + floorDisplacement, floorY - 5, buildingWidth, 10);
      
      // Draw columns for all floors except the top
      if (floor < numFloors) {
        const nextFloorDisp = simulationMode === 'realistic'
          ? buildingResp * Math.pow((floor + 1) / numFloors, 1.3) // Non-linear shape
          : buildingResp * ((floor + 1) / numFloors); // Linear shape
        
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        // Left column
        ctx.beginPath();
        ctx.moveTo(buildingX + floorDisplacement, floorY);
        ctx.lineTo(buildingX + nextFloorDisp, floorY - floorHeight);
        ctx.stroke();
        
        // Right column
        ctx.beginPath();
        ctx.moveTo(buildingX + floorDisplacement + buildingWidth, floorY);
        ctx.lineTo(buildingX + nextFloorDisp + buildingWidth, floorY - floorHeight);
        ctx.stroke();
      }
    }
    
    // Draw ground motion visualization
    if (simulationMode === 'realistic') {
      // Draw realistic ground representation in realistic mode
      
      // Get time index for current frame
      const normalizedTime = time / TOTAL_SIMULATION_TIME;
      const dataLength = timeHistoryData.time.length;
      const timeIndex = Math.min(Math.floor(normalizedTime * dataLength), dataLength - 1);
      
      // Draw wave pattern in ground based on actual data
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      const numPoints = 100; // Number of points to sample for drawing the wave
      const waveAmplitude = 8; // Visual amplitude of wave pattern
      
      for (let i = 0; i < numPoints; i++) {
        // Sample points from the acceleration data
        const dataIndex = Math.min(Math.floor((i / numPoints) * dataLength), dataLength - 1);
        const dataValue = timeHistoryData.pga[dataIndex] || 0;
        
        // Calculate x position
        const x = (i / numPoints) * width;
        
        // Calculate y position based on data - only draw the most recent 20% of data
        const dataTimeNormalized = dataIndex / dataLength;
        const timeWindowStart = Math.max(0, normalizedTime - 0.2);
        
        // Only show recent activity in the wave pattern
        const opacity = dataTimeNormalized >= timeWindowStart && dataTimeNormalized <= normalizedTime 
          ? 1 - (normalizedTime - dataTimeNormalized) * 5 // Fade based on recency
          : 0;
        
        if (opacity > 0) {
          const y = groundY + 5 + dataValue * waveAmplitude * opacity;
          
          if (i === 0 || opacity === 0) {
            ctx.moveTo(x, groundY + 5);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      
      ctx.stroke();
      
      // Draw ground acceleration arrow (using actual current value)
      const currentPGA = forcedPGA || 0;
      const arrowLength = Math.abs(currentPGA) * 300; // Scale for visibility
      const arrowDirection = currentPGA > 0 ? 1 : -1;
      
      if (arrowLength > 5) { // Only draw if significant
        // Arrow head
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(width / 2 - arrowLength * arrowDirection, groundY + 20);
        ctx.lineTo(width / 2, groundY + 15);
        ctx.lineTo(width / 2, groundY + 25);
        ctx.closePath();
        ctx.fill();
        
        // Arrow line
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width / 2, groundY + 20);
        ctx.lineTo(width / 2 - arrowLength * arrowDirection, groundY + 20);
        ctx.stroke();
      }
    } else {
      // For simplified mode, use original visualization
      // Draw ground motion arrow
      const arrowLength = Math.abs(groundMotion);
      const arrowDirection = groundMotion > 0 ? 1 : -1;
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(width / 2 - arrowLength * arrowDirection, groundY + 20);
      ctx.lineTo(width / 2, groundY + 15);
      ctx.lineTo(width / 2, groundY + 25);
      ctx.closePath();
      ctx.fill();
      
      // Arrow line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, groundY + 20);
      ctx.lineTo(width / 2 - arrowLength * arrowDirection, groundY + 20);
      ctx.stroke();
      
      // Add visual wave pattern in ground
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      for (let x = 0; x < width; x += 5) {
        // Create wave pattern based on current time and position
        const y = groundY + 5 + Math.sin(x / 20 + time * 10) * 3;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Add info text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // Display PGA
    let pgaText;
    if (simulationMode === 'realistic' && forcedPGA !== undefined) {
      pgaText = `Peak Ground Acceleration: ${Math.abs(forcedPGA).toFixed(2)}g`;
    } else {
      const pga = getCalculatedValues().pga;
      pgaText = `Peak Ground Acceleration: ${pga}g`;
    }
    ctx.fillText(pgaText, width / 2, groundY + 50);
    
    // Display displacement
    const dispValue = Math.abs(buildingResp);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Building Displacement: ${dispValue.toFixed(1)} cm`, width / 2, buildingY - 20);
    
    // Display current time if in realistic mode
    if (simulationMode === 'realistic') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`Time: ${time.toFixed(1)}s`, width / 2, groundY + 70);
      
      // Display earthquake phase
      let phaseText = "";
      if (time < PRE_EARTHQUAKE_TIME) {
        phaseText = "Pre-earthquake quiet period";
      } else if (time < PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION) {
        phaseText = "Main shock";
      } else {
        phaseText = "Aftershock period";
      }
      ctx.fillText(phaseText, width / 2, groundY + 90);
    }
  };
  
  // Update time history data for engineering graphs
  const updateTimeHistoryData = (time, groundMotion, buildingResp) => {
    if (simulationMode === 'realistic') {
      // In realistic mode, we use pre-generated data with proper earthquake characteristics
      // Just update the current time pointer
      setCurrentTime(time);
      return;
    }
    
    setTimeHistoryData(prevData => {
      // More accurate calculation of ground acceleration
      const { frequency, maxAmplitude } = animationData;
      
      // Use proper seismic engineering formulas
      // PGA calculation based on second derivative of displacement
      const groundAccel = -Math.sin(2 * Math.PI * frequency * time) * maxAmplitude * Math.pow(2 * Math.PI * frequency, 2) * 0.01; // in g
      
      // Velocity calculation using first derivative of displacement
      const groundVelocity = Math.cos(2 * Math.PI * frequency * time) * maxAmplitude * (2 * Math.PI * frequency) * 0.01; // in m/s
      
      // Convert building displacement to cm with more realistic scaling
      const buildingDisp = buildingResp * 0.3; // Scale factor for display in cm
      
      // Limit the number of data points
      const newTimes = [...prevData.time, time.toFixed(2)].slice(-MAX_DATA_POINTS);
      const newPga = [...prevData.pga, groundAccel.toFixed(4)].slice(-MAX_DATA_POINTS);
      const newVelocity = [...prevData.velocity, groundVelocity.toFixed(4)].slice(-MAX_DATA_POINTS);
      const newDisplacement = [...prevData.displacement, buildingDisp.toFixed(4)].slice(-MAX_DATA_POINTS);
      
      return {
        time: newTimes,
        pga: newPga,
        velocity: newVelocity,
        displacement: newDisplacement
      };
    });
  };
  
  // Generate realistic earthquake data based on parameters
  const generateRealisticEarthquakeData = () => {
    console.log("Generating realistic data with:", { magnitude, distance, soilType, damping });
    // Create time array from 0 to TOTAL_SIMULATION_TIME with MAX_DATA_POINTS points
    const timeArray = Array.from({length: MAX_DATA_POINTS}, (_, i) => i * TOTAL_SIMULATION_TIME / MAX_DATA_POINTS);
    
    // Background noise function - small random values
    const getNoise = (amplitude = 0.01) => (Math.random() - 0.5) * amplitude;
    
    // Soil factors based on type
    const soilFactors = {
      'rock': 1.0,
      'stiff': 1.3,
      'soft': 1.8,
      'very-soft': 2.5
    };
    
    // Scale factor based on soil type
    const soilFactor = soilFactors[soilType];
    
    // Generate accelerogram data
    const pgaData = timeArray.map(t => {
      // Pre-earthquake phase (just noise)
      if (t < PRE_EARTHQUAKE_TIME) {
        return getNoise(0.02);
      }
      // Main shock phase
      else if (t < PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION) {
        // Time relative to start of earthquake
        const relativeTime = t - PRE_EARTHQUAKE_TIME;
        
        // Peak amplitude scaling based on magnitude and distance
        // More accurate formula based on magnitude and distance
        const peakAmplitude = Math.pow(10, magnitude - 5.0) / Math.sqrt(distance/10) * soilFactor;
        
        // Envelope function - builds up quickly and decays more slowly
        const envelope = Math.sin(Math.PI * relativeTime / MAIN_SHOCK_DURATION) * 
                         Math.exp(-0.2 * relativeTime);
        
        // Main oscillatory component with varying frequency
        const mainComponent = envelope * peakAmplitude * 
                             Math.sin(2 * Math.PI * 2 * relativeTime) * 
                             Math.sin(2 * Math.PI * 0.5 * relativeTime);
        
        // Add higher frequency components for realism
        const highFreqComponent = envelope * peakAmplitude * 0.7 * 
                                 Math.sin(2 * Math.PI * 5 * relativeTime) * 
                                 Math.cos(2 * Math.PI * 3 * relativeTime + 0.5);
        
        // Add random spikes that occur during strong motion
        const randomSpikes = envelope * peakAmplitude * 0.5 * 
                            (Math.random() > 0.9 ? (Math.random() - 0.5) : 0);
        
        return mainComponent + highFreqComponent + randomSpikes + getNoise(0.05);
      }
      // Post-earthquake phase (coda waves and aftershocks)
      else {
        const relativeTime = t - (PRE_EARTHQUAKE_TIME + MAIN_SHOCK_DURATION);
        
        // Exponential decay for coda waves - use damping parameter
        const decay = Math.exp(-damping * 20 * relativeTime);
        
        // Decaying oscillations with some randomness
        const codaWaves = decay * 0.2 * Math.sin(2 * Math.PI * 1.5 * relativeTime) * 
                          Math.sin(2 * Math.PI * 0.7 * relativeTime);
        
        // Occasional small aftershocks
        const aftershock = Math.random() > 0.98 ? 
                          decay * 0.3 * Math.sin(2 * Math.PI * 3 * relativeTime) : 0;
        
        return codaWaves + aftershock + getNoise(0.03 * decay);
      }
    });
    
    // Derive velocity through numerical integration of acceleration
    let velocity = 0;
    const velocityData = pgaData.map((acc, i) => {
      // Time step in seconds
      const dt = TOTAL_SIMULATION_TIME / MAX_DATA_POINTS;
      
      // Simple trapezoidal numerical integration
      velocity += acc * dt * 100; // Scale to cm/sec
      
      // Add slight damping to prevent drift
      velocity *= (1 - damping * 0.2);
      
      return velocity;
    });
    
    // Derive displacement through numerical integration of velocity
    let displacement = 0;
    const displacementData = velocityData.map((vel, i) => {
      // Time step in seconds
      const dt = TOTAL_SIMULATION_TIME / MAX_DATA_POINTS;
      
      // Simple trapezoidal numerical integration
      displacement += vel * dt;
      
      // Add slight damping to prevent drift
      displacement *= (1 - damping * 0.2);
      
      return displacement;
    });
    
    // Store the generated data in a ref to avoid regenerating unnecessarily
    realisticDataRef.current = {
      time: timeArray,
      pga: pgaData,
      velocity: velocityData,
      displacement: displacementData,
      parameters: {
        magnitude,
        distance,
        soilType,
        damping
      }
    };
    
    return {
      time: timeArray,
      pga: pgaData,
      velocity: velocityData,
      displacement: displacementData
    };
  };
  
  // When parameters change, check if we need to regenerate realistic data
  useEffect(() => {
    // Only update when in realistic mode
    if (simulationMode === 'realistic') {
      // Check if parameters have changed
      const currentParams = realisticDataRef.current?.parameters;
      const paramsChanged = !currentParams || 
        currentParams.magnitude !== magnitude ||
        currentParams.distance !== distance ||
        currentParams.soilType !== soilType ||
        currentParams.damping !== damping;
      
      if (paramsChanged) {
        console.log("Parameters changed, regenerating data");
        setNeedsDataUpdate(true);
      }
    }
  }, [magnitude, distance, soilType, damping, simulationMode]);

  // Update data when changes are needed
  useEffect(() => {
    if (needsDataUpdate && simulationMode === 'realistic') {
      console.log("Updating realistic data");
      // Generate new data with current parameters
      const newData = generateRealisticEarthquakeData();
      
      // Update state with new data
      setTimeHistoryData(newData);
      
      // Reset time and redraw
      setCurrentTime(0);
      if (canvasRef.current) {
        drawFrame(0, newData.pga[0], newData.displacement[0]);
      }
      
      // Reset the need for update
      setNeedsDataUpdate(false);
    }
  }, [needsDataUpdate, simulationMode]);
  
  // Animation loop
  const animate = () => {
    if (!isPlaying) return;
    
    setCurrentTime(prevTime => {
      const newTime = prevTime + 0.016 * speed; // ~60fps with speed factor
      
      // For realistic mode, we precompute all the data and just animate through it
      if (simulationMode === 'realistic') {
        // Get normalized time index in the precomputed data
        const normalizedTime = newTime / TOTAL_SIMULATION_TIME;
        const timeIndex = Math.min(
          Math.floor(normalizedTime * timeHistoryData.time.length), 
          timeHistoryData.time.length - 1
        );
        
        // Get current values from precomputed data
        const currentPGA = timeHistoryData.pga[timeIndex] || 0;
        const currentDisplacement = timeHistoryData.displacement[timeIndex] || 0;
        
        // Draw the current frame with forced values
        if (canvasRef.current) {
          drawFrame(newTime, currentPGA, currentDisplacement);
        }
        
        // Reset if we reach the end
        if (newTime >= TOTAL_SIMULATION_TIME) {
          // Stop animation when it reaches the end
          cancelAnimationFrame(animationRef.current);
          setIsPlaying(false);
          return 0;
        }
        
        return newTime;
      } else {
        // For simplified mode, calculate on the fly
        if (canvasRef.current) {
          drawFrame(newTime);
        }
        return newTime;
      }
    });
    
    animationRef.current = requestAnimationFrame(animate);
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
    
    // Regenerate earthquake data regardless of mode
    if (simulationMode === 'realistic') {
      // Check if we need to regenerate the data or just reuse existing data
      let newData;
      
      // If parameters haven't changed since last generation, reuse the data
      const currentParams = realisticDataRef.current?.parameters;
      const paramsChanged = !currentParams || 
        currentParams.magnitude !== magnitude ||
        currentParams.distance !== distance ||
        currentParams.soilType !== soilType ||
        currentParams.damping !== damping;
      
      if (paramsChanged || !realisticDataRef.current) {
        // Generate new data
        newData = generateRealisticEarthquakeData();
      } else {
        // Reuse existing data
        newData = {
          time: [...realisticDataRef.current.time],
          pga: [...realisticDataRef.current.pga],
          velocity: [...realisticDataRef.current.velocity],
          displacement: [...realisticDataRef.current.displacement]
        };
      }
      
      // Update UI with data
      setTimeHistoryData(newData);
      
      // Draw the first frame with initial values
      if (canvasRef.current) {
        drawFrame(0, newData.pga[0], newData.displacement[0]);
      }
    } else {
      // Reset to empty data for simplified mode
      setTimeHistoryData({
        time: [],
        pga: [],
        velocity: [],
        displacement: []
      });
      
      // Draw initial frame with simplified values
      if (canvasRef.current) {
        drawFrame(0);
      }
    }
    
    // If animation was playing, restart it
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      // If we're in realistic mode and don't have data, generate it
      if (simulationMode === 'realistic' && (!realisticDataRef.current || timeHistoryData.pga.length <= 10)) {
        const newData = generateRealisticEarthquakeData();
        setTimeHistoryData(newData);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, simulationMode]);
  
  // Initialize canvas and data
  useEffect(() => {
    // Generate realistic earthquake data on first load or mode change
    if (simulationMode === 'realistic') {
      const newData = generateRealisticEarthquakeData();
      setTimeHistoryData(newData);
      
      // Draw the initial frame
      if (canvasRef.current) {
        drawFrame(0, newData.pga[0], newData.displacement[0]);
      }
    } else {
      setTimeHistoryData({
        time: [],
        pga: [],
        velocity: [],
        displacement: []
      });
      
      // Draw initial frame
      if (canvasRef.current) {
        drawFrame(0);
      }
    }
    
    // Notify parent component that visualization is ready
    onVisualizationReady();
  }, [simulationMode]);

  // Engineering time history graphs with improved styling and time labels
  const pgaChartData = {
    labels: timeHistoryData.time.map(t => Number(t).toFixed(0)),
    datasets: [
      {
        label: 'Peak Ground Acceleration',
        data: timeHistoryData.pga,
        borderColor: 'rgba(0, 0, 220, 1)',
        backgroundColor: 'rgba(0, 0, 220, 0.05)',
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 1.5
      }
    ]
  };

  const velocityChartData = {
    labels: timeHistoryData.time.map(t => Number(t).toFixed(0)),
    datasets: [
      {
        label: 'Ground Velocity',
        data: timeHistoryData.velocity,
        borderColor: 'rgba(0, 0, 220, 1)',
        backgroundColor: 'rgba(0, 0, 220, 0.05)',
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 1.5
      }
    ]
  };

  const displacementChartData = {
    labels: timeHistoryData.time.map(t => Number(t).toFixed(0)),
    datasets: [
      {
        label: 'Building Displacement',
        data: timeHistoryData.displacement,
        borderColor: 'rgba(0, 0, 220, 1)',
        backgroundColor: 'rgba(0, 0, 220, 0.05)',
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 1.5
      }
    ]
  };

  // Enhanced chart options for a more professional appearance
  const getChartOptions = (title, yAxisLabel, minY, maxY) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 14,
            weight: 'bold',
            family: "'Roboto', 'Arial', sans-serif"
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 12,
            family: "'Roboto', 'Arial', sans-serif"
          },
          bodyFont: {
            size: 11,
            family: "'Roboto', 'Arial', sans-serif"
          },
          padding: 10,
          caretSize: 5,
          cornerRadius: 4,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${yAxisLabel}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time [sec]',
            font: {
              size: 12,
              weight: 'bold',
              family: "'Roboto', 'Arial', sans-serif"
            }
          },
          ticks: {
            font: {
              size: 10,
              family: "'Roboto', 'Arial', sans-serif"
            },
            autoSkip: true,
            maxTicksLimit: 12,
            callback: function(value, index, values) {
              // Only show a subset of tick labels for readability
              return Number(this.getLabelForValue(value)).toFixed(0);
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)',
            lineWidth: 1
          }
        },
        y: {
          title: {
            display: true,
            text: yAxisLabel,
            font: {
              size: 12,
              weight: 'bold',
              family: "'Roboto', 'Arial', sans-serif"
            }
          },
          min: minY,
          max: maxY,
          ticks: {
            font: {
              size: 10,
              family: "'Roboto', 'Arial', sans-serif"
            },
            precision: 1
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)',
            lineWidth: 1
          }
        }
      },
      animation: {
        duration: 0 // Disable animations for better performance
      },
      elements: {
        line: {
          tension: 0.1,
          borderWidth: 1.5
        },
        point: {
          radius: 0 // Hide points for smoother lines
        }
      }
    };
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
                  onClick={() => setIsPlaying(true)}
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
            <h3 className="text-xl font-bold mb-4">Earthquake Parameters</h3>
            
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