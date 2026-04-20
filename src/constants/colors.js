/**
 * Color constants — earthy biophilic palette
 * Forest (#546B41) · Sage (#99AD7A) · Beige (#DCCCAC) · Cream (#FFF8EC)
 */

export const PALETTE = {
  FOREST:  '#546B41',
  FOREST_DARK:  '#2d3d24',
  FOREST_DEEP:  '#1e2d14',
  FOREST_LIGHT: '#6b8a52',
  SAGE:    '#99AD7A',
  SAGE_LIGHT: '#b8c99a',
  SAGE_DARK:  '#7a9060',
  BEIGE:   '#DCCCAC',
  BEIGE_LIGHT: '#efe4cc',
  BEIGE_DARK:  '#c8b48c',
  CREAM:   '#FFF8EC',
  CREAM_DARK:  '#f5edd8',
};

// Brand scale (Tailwind-compatible shades)
export const BRAND = {
  PRIMARY: {
    50:  '#f2f6ee',
    100: '#dce8d3',
    200: '#bbd3a8',
    300: '#99AD7A',   // sage
    400: '#7a9060',
    500: '#546B41',   // forest — main
    600: '#3d5030',
    700: '#2d3d24',   // forest dark
    800: '#1e2d14',   // forest deep
    900: '#111a0c',
  },
  SECONDARY: {
    50:  '#fdfaf4',
    100: '#f5edd8',
    200: '#efe4cc',
    300: '#e5d8bb',
    400: '#DCCCAC',   // beige — main
    500: '#c8b48c',
    600: '#b09a6e',
    700: '#8a7554',
    800: '#63543c',
    900: '#3c3323',
  },
  ACCENT: {
    50:  '#fffdf8',
    100: '#FFF8EC',   // cream — main
    200: '#f5edd8',
    300: '#ecdec5',
    400: '#e0ccac',
    500: '#d4ba93',
    600: '#c0a070',
    700: '#a07848',
    800: '#7a5830',
    900: '#523818',
  },
};

export const BASIC = {
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: {
    50:  '#fafaf9',
    100: '#f5f5f0',
    200: '#e8e5de',
    300: '#d4cfc4',
    400: '#b8b0a0',
    500: '#968d7c',
    600: '#756c5c',
    700: '#5a5245',
    800: '#3d3830',
    900: '#21201c',
  },
};

export const DARK = {
  BACKGROUND: {
    DEFAULT: '#1e2d14',
    PAPER:   '#2d3d24',
    ELEVATED: '#3d5030',
  },
  TEXT: {
    PRIMARY:   '#FFF8EC',
    SECONDARY: 'rgba(255, 248, 236, 0.72)',
    MUTED:     'rgba(220, 204, 172, 0.6)',
    DISABLED:  'rgba(220, 204, 172, 0.35)',
  },
};

export const LIGHT = {
  BACKGROUND: {
    DEFAULT: '#FFF8EC',
    PAPER:   '#f5edd8',
    ELEVATED: '#ffffff',
  },
  TEXT: {
    PRIMARY:   '#546B41',
    SECONDARY: 'rgba(84, 107, 65, 0.72)',
    MUTED:     'rgba(84, 107, 65, 0.5)',
    DISABLED:  'rgba(84, 107, 65, 0.35)',
  },
};

export const SEMANTIC = {
  SUCCESS: {
    LIGHT: '#99AD7A',
    MAIN:  '#546B41',
    DARK:  '#2d3d24',
    CONTRAST: '#FFF8EC',
  },
  ERROR: {
    LIGHT: '#ef5350',
    MAIN:  '#d32f2f',
    DARK:  '#c62828',
    CONTRAST: '#ffffff',
  },
  WARNING: {
    LIGHT: '#ffb74d',
    MAIN:  '#ffa000',
    DARK:  '#e65100',
    CONTRAST: '#1e2d14',
  },
  INFO: {
    LIGHT: '#DCCCAC',
    MAIN:  '#99AD7A',
    DARK:  '#546B41',
    CONTRAST: '#1e2d14',
  },
};

export const DOMAIN = {
  STRUCTURAL: {
    CONCRETE: '#DCCCAC',
    STEEL:    '#99AD7A',
    GLASS:    '#e8f5e9',
    WOOD:     '#c8b48c',
  },
  SEISMIC: {
    LOW:      '#99AD7A',
    MODERATE: '#DCCCAC',
    HIGH:     '#e8a060',
    CRITICAL: '#d32f2f',
  },
  AI: {
    NEURAL:     '#546B41',
    PREDICTION: '#99AD7A',
    ANALYSIS:   '#DCCCAC',
    VISION:     '#7a9060',
  },
  CHART: {
    SERIES: [
      '#546B41',
      '#99AD7A',
      '#DCCCAC',
      '#7a9060',
      '#b8c99a',
      '#c8b48c',
      '#2d3d24',
      '#efe4cc',
      '#3d5030',
      '#e0ccac',
    ],
    SEQUENTIAL: [
      '#f2f6ee',
      '#bbd3a8',
      '#99AD7A',
      '#7a9060',
      '#546B41',
      '#2d3d24',
    ],
    DIVERGING: [
      '#d32f2f',
      '#e8a060',
      '#DCCCAC',
      '#FFF8EC',
      '#b8c99a',
      '#99AD7A',
      '#546B41',
      '#2d3d24',
    ],
  },
};

export const GRADIENTS = {
  PRIMARY:  'linear-gradient(135deg, #546B41 0%, #99AD7A 100%)',
  SECONDARY:'linear-gradient(135deg, #DCCCAC 0%, #FFF8EC 100%)',
  NATURE:   'linear-gradient(135deg, #546B41 0%, #99AD7A 50%, #DCCCAC 100%)',
  DARK:     'linear-gradient(135deg, #1e2d14 0%, #2d3d24 100%)',
  WARM:     'linear-gradient(135deg, #FFF8EC 0%, #DCCCAC 100%)',
  SEISMIC:  'linear-gradient(90deg, #99AD7A 0%, #DCCCAC 50%, #e8a060 100%)',
};

export const TAILWIND = {
  primary:   BRAND.PRIMARY,
  secondary: BRAND.SECONDARY,
  accent:    BRAND.ACCENT,
  success:   SEMANTIC.SUCCESS,
  error:     SEMANTIC.ERROR,
  warning:   SEMANTIC.WARNING,
  info:      SEMANTIC.INFO,
  gray:      BASIC.GRAY,
};

export default {
  PALETTE,
  BRAND,
  BASIC,
  DARK,
  LIGHT,
  SEMANTIC,
  DOMAIN,
  GRADIENTS,
  TAILWIND,
};
