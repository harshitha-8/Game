/**
 * DroneFarm Design System
 * Dark mode default, earth/green accents, glassmorphism
 */
export const colors = {
  // Base
  background: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#21262D',
  
  // Earth & Green accents
  earth: '#8B7355',
  earthLight: '#A0826D',
  soil: '#5D4E37',
  grass: '#2D5A27',
  grassBright: '#3D7B2E',
  leaf: '#4CAF50',
  leafMuted: '#388E3C',
  
  // Accent
  primary: '#22C55E',
  primaryMuted: '#16A34A',
  accent: '#84CC16',
  
  // Status
  water: '#0EA5E9',
  waterMuted: '#0284C7',
  dry: '#F59E0B',
  weed: '#EF4444',
  battery: '#22C55E',
  batteryLow: '#EF4444',
  
  // Text
  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  
  // UI
  border: '#30363D',
  borderLight: '#21262D',
  glass: 'rgba(22, 27, 34, 0.85)',
  glassBorder: 'rgba(48, 54, 61, 0.5)',
  
  // Gradients (as arrays for LinearGradient)
  gradientEarth: ['#1a1510', '#0D1117'] as const,
  gradientCard: ['#21262D', '#161B22'] as const,
  gradientAccent: ['#22C55E', '#16A34A'] as const,
  gradientWater: ['#0EA5E9', '#0284C7'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const },
  h1: { fontSize: 24, fontWeight: '600' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  code: { fontSize: 14, fontFamily: 'monospace' },
};
