import { TextStyle } from 'react-native';

// Global font family constant
export const FONT_FAMILY = 'Arial Narrow, Arial, sans-serif';

// Base text styles with Arial Narrow
export const baseTextStyles = {
  fontFamily: FONT_FAMILY,
};

// Common text styles with Arial Narrow
export const textStyles: { [key: string]: TextStyle } = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: FONT_FAMILY,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: FONT_FAMILY,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILY,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FONT_FAMILY,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: FONT_FAMILY,
  },
  
  // Interactive elements
  button: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },
  link: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONT_FAMILY,
  },
  
  // Form elements
  input: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILY,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: FONT_FAMILY,
  },
  
  // Cards and lists
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FONT_FAMILY,
  },
  
  // Navigation and tabs
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: FONT_FAMILY,
  },
  
  // Metrics and data
  metric: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: FONT_FAMILY,
  },
};

// Helper function to create text style with Arial Narrow
export const withArialNarrow = (style: TextStyle = {}): TextStyle => ({
  fontFamily: FONT_FAMILY,
  ...style,
});

// Export for easy use in components
export default {
  FONT_FAMILY,
  baseTextStyles,
  textStyles,
  withArialNarrow,
};