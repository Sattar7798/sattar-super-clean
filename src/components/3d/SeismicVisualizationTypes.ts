// Type definitions for SeismicVisualization component

// Props interface
export interface SeismicVisualizationProps {
  initialIntensity?: number;
  width?: string;
  height?: string;
  className?: string;
  showControls?: boolean;
  initialMagnitude?: number;
  initialDistance?: number;
  initialDirection?: number;
  initialSoilType?: 'rock' | 'stiff' | 'soft' | 'very-soft';
  onVisualizationReady?: () => void;
}

// State interfaces
export interface TimeHistoryData {
  time: (string | number)[];
  pga: (string | number)[];
  velocity: (string | number)[];
  displacement: (string | number)[];
}

export interface AnimationData {
  frequency: number;
  maxAmplitude: number;
  dampingRatio: number;
}

export interface RealisticDataParameters {
  magnitude: number;
  distance: number;
  soilType: string;
  damping: number;
}

export interface RealisticData {
  time: number[];
  pga: number[];
  velocity: number[];
  displacement: number[];
  parameters: RealisticDataParameters;
}

// Chart data interfaces
export interface ChartDataset {
  label: string;
  data: (string | number)[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
  pointRadius: number;
  borderWidth: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
    };
    title: {
      display: boolean;
      text: string;
      font: {
        size: number;
        weight: string;
        family: string;
      };
    };
    tooltip: {
      enabled: boolean;
      backgroundColor: string;
      titleFont: {
        size: number;
        family: string;
      };
      bodyFont: {
        size: number;
        family: string;
      };
      padding: number;
      caretSize: number;
      cornerRadius: number;
      displayColors: boolean;
      callbacks: {
        label: (context: any) => string;
      };
    };
  };
  scales: {
    x: {
      title: {
        display: boolean;
        text: string;
        font: {
          size: number;
          weight: string;
          family: string;
        };
      };
      ticks: {
        font: {
          size: number;
          family: string;
        };
        autoSkip: boolean;
        maxTicksLimit: number;
        callback: (value: any, index: number, values: any[]) => string | number;
      };
      grid: {
        color: string;
        lineWidth: number;
      };
    };
    y: {
      title: {
        display: boolean;
        text: string;
        font: {
          size: number;
          weight: string;
          family: string;
        };
      };
      min: number;
      max: number;
      ticks: {
        font: {
          size: number;
          family: string;
        };
        precision: number;
      };
      grid: {
        color: string;
        lineWidth: number;
      };
    };
  };
  animation: {
    duration: number;
  };
  elements: {
    line: {
      tension: number;
      borderWidth: number;
    };
    point: {
      radius: number;
    };
  };
}

// Function types
export type DrawFrameFunction = (
  time: number, 
  forcedPGA?: number, 
  forcedDisplacement?: number
) => void;

export type UpdateTimeHistoryDataFunction = (
  time: number, 
  groundMotion: number, 
  buildingResp: number
) => void;

export type GetCalculatedValuesFunction = () => {
  frequency: number;
  maxAmplitude: number;
  dampingRatio: number;
  pga: string;
};

export type GenerateRealisticEarthquakeDataFunction = () => TimeHistoryData;

export type GetChartOptionsFunction = (
  title: string, 
  yAxisLabel: string, 
  minY: number, 
  maxY: number
) => ChartOptions;

export type HandleResetFunction = () => void;
export type AnimateFunction = () => void; 