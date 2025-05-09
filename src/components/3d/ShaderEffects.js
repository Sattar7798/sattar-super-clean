import React, { useMemo } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A collection of shader effects for Three.js rendering
 */

// Create a basic gradient shader material
const GradientMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color('#ff0000'),
    color2: new THREE.Color('#0000ff'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;

    void main() {
      vec3 color = mix(color1, color2, vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Create a heat map shader material
const HeatmapMaterial = shaderMaterial(
  {
    minValue: 0,
    maxValue: 1,
    colorHot: new THREE.Color('#ff0000'),
    colorCold: new THREE.Color('#0000ff'),
  },
  // Vertex shader
  `
    attribute float value;
    varying float vValue;
    void main() {
      vValue = value;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float minValue;
    uniform float maxValue;
    uniform vec3 colorHot;
    uniform vec3 colorCold;
    varying float vValue;

    void main() {
      float normalizedValue = (vValue - minValue) / (maxValue - minValue);
      normalizedValue = clamp(normalizedValue, 0.0, 1.0);
      vec3 color = mix(colorCold, colorHot, normalizedValue);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Create an outline shader material
const OutlineMaterial = shaderMaterial(
  {
    outlineColor: new THREE.Color('#000000'),
    outlineWidth: 0.02,
  },
  // Vertex shader
  `
    uniform float outlineWidth;
    void main() {
      vec3 newPosition = position + normal * outlineWidth;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 outlineColor;
    void main() {
      gl_FragColor = vec4(outlineColor, 1.0);
    }
  `
);

// Create an X-ray shader material
const XRayMaterial = shaderMaterial(
  {
    color: new THREE.Color('#00ffff'),
    opacity: 0.5,
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vViewDir = normalize(cameraPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float opacity;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
      fresnel = pow(fresnel, 3.0);
      gl_FragColor = vec4(color, opacity * fresnel);
    }
  `
);

// Extend Three.js with our custom materials
extend({ GradientMaterial, HeatmapMaterial, OutlineMaterial, XRayMaterial });

// Gradient Material Component
export const GradientShader = ({ color1 = '#ff0000', color2 = '#0000ff', ...props }) => {
  const ref = React.useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.time = clock.getElapsedTime();
    }
  });
  
  return <gradientMaterial ref={ref} color1={color1} color2={color2} {...props} />;
};

// Heatmap Material Component
export const HeatmapShader = ({ 
  minValue = 0, 
  maxValue = 1, 
  colorHot = '#ff0000', 
  colorCold = '#0000ff',
  ...props 
}) => {
  return (
    <heatmapMaterial 
      minValue={minValue} 
      maxValue={maxValue}
      colorHot={colorHot}
      colorCold={colorCold}
      {...props} 
    />
  );
};

// Outline Material Component
export const OutlineShader = ({ 
  color = '#000000', 
  width = 0.02,
  ...props 
}) => {
  return (
    <outlineMaterial 
      outlineColor={color}
      outlineWidth={width}
      side={THREE.BackSide}
      {...props} 
    />
  );
};

// X-Ray Material Component
export const XRayShader = ({ 
  color = '#00ffff', 
  opacity = 0.5,
  ...props 
}) => {
  return (
    <xRayMaterial 
      color={color}
      opacity={opacity}
      transparent={true}
      depthWrite={false}
      {...props} 
    />
  );
};

// Main component to export all shaders
const ShaderEffects = {
  GradientShader,
  HeatmapShader,
  OutlineShader,
  XRayShader
};

export default ShaderEffects;

// Advanced WebGL shader programs for seismic visualization

/**
 * Creates a shader of the given type with the provided source code
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} type - Shader type (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 * @param {string} source - GLSL shader source code
 * @returns {WebGLShader} Compiled shader or null if compilation failed
 */
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  // Check if compilation was successful
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  
  // If compilation failed, log error and delete shader
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

/**
 * Creates a shader program from the provided vertex and fragment shaders
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {WebGLShader} vertexShader - Compiled vertex shader
 * @param {WebGLShader} fragmentShader - Compiled fragment shader
 * @returns {WebGLProgram} Linked shader program or null if linking failed
 */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  // Check if linking was successful
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  
  // If linking failed, log error and delete program
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

/**
 * Creates a buffer with vertex data for a building
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} numFloors - Number of floors in the building
 * @param {Object} floorPositions - Array of floor positions with x,y coordinates
 * @returns {Object} Buffer and attribute information
 */
function createBuildingBuffer(gl, numFloors, floorPositions) {
  // Create vertex position buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Generate vertices for each floor
  const vertices = [];
  
  // For each floor, create a rectangle
  for (let floor = 0; floor < numFloors; floor++) {
    const baseY = floorPositions[floor].y;
    const nextY = floor < numFloors - 1 ? floorPositions[floor + 1].y : baseY - 30;
    const baseX = floorPositions[floor].x;
    const nextX = floor < numFloors - 1 ? floorPositions[floor + 1].x : baseX;
    
    const width = 100; // Width of building
    
    // Floor slab (rectangle)
    vertices.push(
      baseX, baseY, 0,               // Bottom left
      baseX + width, baseY, 0,       // Bottom right
      baseX, baseY - 10, 0,          // Top left
      
      baseX + width, baseY, 0,       // Bottom right
      baseX + width, baseY - 10, 0,  // Top right
      baseX, baseY - 10, 0           // Top left
    );
    
    // Left column (if not the top floor)
    if (floor < numFloors - 1) {
      vertices.push(
        baseX, baseY - 10, 0,        // Top of current floor
        baseX + 5, baseY - 10, 0,    // Top right of column
        nextX, nextY, 0,             // Bottom of next floor
        
        nextX, nextY, 0,             // Bottom of next floor
        nextX + 5, nextY, 0,         // Bottom right of column
        baseX + 5, baseY - 10, 0     // Top right of column
      );
    }
    
    // Right column (if not the top floor)
    if (floor < numFloors - 1) {
      vertices.push(
        baseX + width - 5, baseY - 10, 0,  // Top left of column
        baseX + width, baseY - 10, 0,      // Top right of column
        nextX + width - 5, nextY, 0,       // Bottom left of next floor
        
        nextX + width - 5, nextY, 0,       // Bottom left of next floor
        nextX + width, nextY, 0,           // Bottom right of next floor
        baseX + width, baseY - 10, 0       // Top right of column
      );
    }
  }
  
  // Upload data to buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  return {
    position: positionBuffer,
    vertexCount: vertices.length / 3
  };
}

/**
 * Creates color buffer for the building elements
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} numFloors - Number of floors
 * @param {string} materialColor - Hex color string for the material
 * @returns {WebGLBuffer} Color buffer
 */
function createBuildingColorBuffer(gl, numFloors, materialColor) {
  // Create color buffer
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  
  // Convert hex color to RGB components
  const r = parseInt(materialColor.substr(1, 2), 16) / 255;
  const g = parseInt(materialColor.substr(3, 2), 16) / 255;
  const b = parseInt(materialColor.substr(5, 2), 16) / 255;
  
  // Generate colors for each vertex
  const colors = [];
  
  // For each floor
  for (let floor = 0; floor < numFloors; floor++) {
    // Floor slab color (slightly darker)
    const floorColor = [r * 0.9, g * 0.9, b * 0.9, 1.0];
    for (let i = 0; i < 6; i++) { // 6 vertices per floor slab
      colors.push(...floorColor);
    }
    
    // Column colors
    if (floor < numFloors - 1) {
      // Left column
      const leftColumnColor = [r, g, b, 1.0];
      for (let i = 0; i < 6; i++) {
        colors.push(...leftColumnColor);
      }
      
      // Right column
      const rightColumnColor = [r, g, b, 1.0];
      for (let i = 0; i < 6; i++) {
        colors.push(...rightColumnColor);
      }
    }
  }
  
  // Upload data to buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  return colorBuffer;
}

// Vertex shader for building visualization
const buildingVertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  
  varying lowp vec4 vColor;
  
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

// Fragment shader for building visualization
const buildingFragmentShaderSource = `
  precision mediump float;
  
  varying lowp vec4 vColor;
  
  void main(void) {
    gl_FragColor = vColor;
  }
`;

// Vertex shader for ground motion visualization
const groundVertexShaderSource = `
  attribute vec4 aVertexPosition;
  
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  
  varying lowp vec4 vColor;
  
  void main(void) {
    // Apply sinusoidal motion to x-coordinate based on y position
    float displacement = uAmplitude * sin(uFrequency * uTime + aVertexPosition.y * 0.1);
    vec4 displacedPosition = aVertexPosition;
    displacedPosition.x += displacement;
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * displacedPosition;
    
    // Generate color based on displacement
    float colorIntensity = (displacement + uAmplitude) / (2.0 * uAmplitude);
    vColor = vec4(0.5 + 0.5 * colorIntensity, 0.5, 0.5 - 0.5 * colorIntensity, 1.0);
  }
`;

// Fragment shader for ground motion visualization
const groundFragmentShaderSource = `
  precision mediump float;
  
  varying lowp vec4 vColor;
  
  void main(void) {
    gl_FragColor = vColor;
  }
`;

// Advanced vertex shader with damage visualization
const damageVertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  attribute float aDamageLevel;
  
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform float uTime;
  
  varying lowp vec4 vColor;
  varying float vDamageLevel;
  
  void main(void) {
    // Apply vibration effect based on damage level
    float vibration = 0.0;
    if (aDamageLevel > 0.5) {
      vibration = sin(uTime * 10.0) * 2.0 * (aDamageLevel - 0.5);
    }
    
    vec4 displacedPosition = aVertexPosition;
    displacedPosition.x += vibration;
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * displacedPosition;
    vColor = aVertexColor;
    vDamageLevel = aDamageLevel;
  }
`;

// Advanced fragment shader with damage visualization
const damageFragmentShaderSource = `
  precision mediump float;
  
  varying lowp vec4 vColor;
  varying float vDamageLevel;
  
  void main(void) {
    // Adjust color based on damage level
    vec4 damageColor = vec4(1.0, 0.0, 0.0, 1.0); // Red for damage
    vec4 finalColor = mix(vColor, damageColor, vDamageLevel);
    
    // Add crack effect if damage is high
    if (vDamageLevel > 0.7) {
      // Simple procedural crack pattern
      if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) < 1.0) {
        finalColor = vec4(0.1, 0.1, 0.1, 1.0); // Dark crack
      }
    }
    
    gl_FragColor = finalColor;
  }
`;

// Export shader sources and utility functions
export {
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
}; 