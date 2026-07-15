import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { SCHOOL_NAME } from '../../constants/branding';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', icon: 'school', title: `Welcome to\n${SCHOOL_NAME}`, subtitle: 'The smart way to stay connected with your school journey — from attendance to academics.', color: COLORS.primaryDark },
  { id: '2', icon: 'bar-chart', title: 'Track Progress\nEvery Week', subtitle: 'Receive weekly teacher reports, view attendance records, exam results, and school fee status — all in one place.', color: '#1A4A8A' },
  { id: '3', icon: 'chatbubbles', title: 'Stay Connected,\nStay Informed', subtitle: 'Get instant notifications and communicate directly with teachers and school authorities.', color: COLORS.primary },
];

export default function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  const next = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinearGradient colors={[item.color, COLORS.primaryLight]} style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={COLORS.secondary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </LinearGradient>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.indicators}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={next} style={styles.nextBtn} activeOpacity={0.85}>
          <Text style={styles.nextText}>{activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        {activeIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryDark },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl, paddingBottom: 140 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl, borderWidth: 2, borderColor: 'rgba(255,215,0,0.3)' },
  title: { fontSize: FONTS.sizes.xxl + 2, fontWeight: FONTS.weights.extrabold, color: '#FFF', textAlign: 'center', lineHeight: 34, marginBottom: SPACING.md },
  subtitle: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: SPACING.lg, paddingBottom: 36, alignItems: 'center' },
  indicators: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { width: 28, backgroundColor: COLORS.primary },
  nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingVertical: 14, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.full, gap: 8, width: '100%', justifyContent: 'center', marginBottom: SPACING.sm },
  nextText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.primary },
  skip: { paddingVertical: SPACING.xs },
  skipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
});
