import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

export default function Button({ label, onPress, variant = 'primary', size = 'md', loading = false, disabled = false, style }) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.base, styles[variant], styles[`size_${size}`], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.textLight : COLORS.primary} size="small" />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  danger: { backgroundColor: COLORS.error },
  ghost: { backgroundColor: 'transparent' },
  size_sm: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md },
  size_md: { paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.lg },
  size_lg: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
  disabled: { opacity: 0.5 },
  label: { fontWeight: FONTS.weights.semibold },
  label_primary: { color: COLORS.textLight },
  label_secondary: { color: COLORS.primary },
  label_outline: { color: COLORS.primary },
  label_danger: { color: COLORS.textLight },
  label_ghost: { color: COLORS.primary },
  labelSize_sm: { fontSize: FONTS.sizes.sm },
  labelSize_md: { fontSize: FONTS.sizes.md },
  labelSize_lg: { fontSize: FONTS.sizes.lg },
});
