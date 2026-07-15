import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { APP_NAME, SCHOOL_NAME, LOGO } from '../../constants/branding';

export default function SplashScreen({ navigation }) {
  const scale = new Animated.Value(0.85);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Onboarding'), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={['#0C1B33', '#1A3A6B', '#2563EB']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0C1B33" />

      <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity }]}>
        <View style={styles.glowRing} />
        <View style={styles.logoCircle}>
          <Image
            source={LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Text style={styles.appName}>{APP_NAME}</Text>
      <Text style={styles.school}>{SCHOOL_NAME}</Text>
      <Text style={styles.tagline}>Connecting School, Parents & Excellence</Text>

      {/* Animated loading dots */}
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  logoWrap: { marginBottom: SPACING.xl, alignItems: 'center', justifyContent: 'center' },
  glowRing: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F59E0B', opacity: 0.15,
  },
  logoCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFFDE7',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 14,
    borderWidth: 3, borderColor: '#F59E0B',
  },
  logo: { width: 96, height: 96 },

  appName: {
    fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.extrabold,
    color: '#FFFFFF', letterSpacing: 1.5,
  },
  school: {
    fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold,
    color: '#F59E0B', marginTop: 6, letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.65)',
    marginTop: SPACING.sm, textAlign: 'center',
    paddingHorizontal: SPACING.xl, lineHeight: 20,
  },

  dots: { flexDirection: 'row', marginTop: SPACING.xxl, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 28, backgroundColor: '#F59E0B', borderRadius: 4 },
});
