import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';

export default function Badge({ label, color = COLORS.error, textColor = '#fff', style }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: RADIUS.full, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start' },
  text: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
});
