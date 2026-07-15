import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

export default function Avatar({ name = '', uri, size = 44, style }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  if (uri) {
    return <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: size / 2 }, style]} />;
  }
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  initials: { color: COLORS.textLight, fontWeight: FONTS.weights.bold },
});
