import { Dimensions } from 'react-native';
export const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const COLORS = {
  primary: '#0C1B33',
  primaryDark: '#0C1B33',   // alias kept for legacy screens
  primaryMid: '#1A3A6B',
  primaryLight: '#2563EB',
  gold: '#F59E0B',
  goldLight: '#FCD34D',
  goldDark: '#D97706',
  secondary: '#F59E0B',     // alias — maps to gold
  background: '#F0F4FF',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FF',
  surfaceYellow: '#FFFBEB', // warm yellow tint
  text: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  border: '#E2E8F0',
  success: '#059669',
  successLight: '#D1FAE5',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  warning: '#D97706',
  warningLight: '#FEF3C7',
};

export const GRADIENTS = {
  header: ['#0C1B33', '#1A3A6B'],
  gold: ['#D97706', '#F59E0B'],
  blue: ['#1D4ED8', '#3B82F6'],
  green: ['#059669', '#10B981'],
  purple: ['#7C3AED', '#8B5CF6'],
  red: ['#B91C1C', '#EF4444'],
  teal: ['#0F766E', '#14B8A6'],
  orange: ['#C2410C', '#F97316'],
  navy: ['#0C1B33', '#1E3A5F'],
  pink: ['#9D174D', '#EC4899'],
};

export const FONTS = {
  sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 30, display: 36 },
  weights: { regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800', black: '900' },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const RADIUS = { sm: 8, md: 14, lg: 20, xl: 28, full: 999 };

export const SHADOW = {
  sm: { shadowColor: '#1A3A6B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  md: { shadowColor: '#1A3A6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 6 },
  lg: { shadowColor: '#1A3A6B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 20, elevation: 10 },
  xl: { shadowColor: '#0C1B33', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 28, elevation: 16 },
};

export const TAB_BAR_STYLE = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0,
  height: 72,
  paddingBottom: 12,
  paddingTop: 8,
  shadowColor: '#0C1B33',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 20,
};
