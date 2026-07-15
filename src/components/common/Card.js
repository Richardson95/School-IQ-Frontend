import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOW } from '../../constants/theme';

export default function Card({ children, style, variant = 'default', padding = 'md' }) {
  return (
    <View style={[styles.card, styles[variant], styles[`pad_${padding}`], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.md, backgroundColor: COLORS.surface, ...SHADOW.md },
  default: {},
  yellow: { backgroundColor: COLORS.surfaceYellow },
  outlined: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  pad_sm: { padding: SPACING.sm },
  pad_md: { padding: SPACING.md },
  pad_lg: { padding: SPACING.lg },
  pad_none: { padding: 0 },
});
