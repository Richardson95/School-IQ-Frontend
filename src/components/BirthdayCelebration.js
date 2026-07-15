import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { STUDENTS } from '../constants/mockData';
import { birthdaysToday, turningAge } from '../utils/birthdays';

const { width, height } = Dimensions.get('window');
const DISPLAY_MS = 30000; // show for 30 seconds
const EMOJIS = ['🎈', '🎉', '🎊', '🥳'];

// A single falling/rising confetti piece that loops on its own.
function Piece({ emoji, left, size, delay, duration }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, { toValue: 1, duration, delay, easing: Easing.linear, useNativeDriver: true }),
    );
    anim.start();
    return () => anim.stop();
  }, [t, duration, delay]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-80, height + 80] });
  const translateX = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 18, -18] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.Text style={{ position: 'absolute', left, fontSize: size, transform: [{ translateY }, { translateX }, { rotate }] }}>
      {emoji}
    </Animated.Text>
  );
}

export default function BirthdayCelebration() {
  const insets = useSafeAreaInsets();
  const celebrants = useMemo(() => birthdaysToday(STUDENTS), []);
  const [visible, setVisible] = useState(celebrants.length > 0);
  const pop = useRef(new Animated.Value(0)).current;

  const pieces = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({
      key: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: Math.random() * width,
      size: 22 + Math.random() * 24,
      delay: Math.random() * 2600,
      duration: 4200 + Math.random() * 3200,
    })),
    [],
  );

  useEffect(() => {
    if (!visible) return;
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    const timer = setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [visible, pop]);

  if (celebrants.length === 0) return null;

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.backdrop}>
        {/* Falling balloons & congratulatory icons */}
        {pieces.map((p) => <Piece key={p.key} {...p} />)}

        <TouchableOpacity style={[styles.closeBtn, { top: insets.top + 12 }]} onPress={() => setVisible(false)} activeOpacity={0.8}>
          <Ionicons name="close" size={22} color="#FFF" />
        </TouchableOpacity>

        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Text style={styles.hbd}>🎉 Happy Birthday! 🎉</Text>
          <Text style={styles.sub}>{celebrants.length > 1 ? 'Celebrating our students today' : 'Celebrating our student today'}</Text>

          <View style={styles.celebrantsRow}>
            {celebrants.map((s) => {
              const initials = s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const age = turningAge(s.dob);
              return (
                <View key={s.id} style={styles.celebrant}>
                  <View style={styles.avatarWrap}>
                    {s.avatar ? (
                      <Image source={{ uri: s.avatar }} style={styles.avatarImg} />
                    ) : (
                      <View style={styles.avatarInitials}><Text style={styles.initialsText}>{initials}</Text></View>
                    )}
                    <Text style={styles.hat}>🎂</Text>
                  </View>
                  <Text style={styles.name}>{s.name}</Text>
                  <Text style={styles.meta}>{s.class}{age ? ` · turns ${age}` : ''}</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.wish}>Wishing you a wonderful year ahead! 🥳🎈</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12,27,51,0.75)', alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  closeBtn: { position: 'absolute', right: SPACING.md, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  card: { width: '100%', maxWidth: 380, backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center', ...SHADOW.xl },
  hbd: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, color: COLORS.primary, textAlign: 'center' },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.md, textAlign: 'center' },

  celebrantsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.lg },
  celebrant: { alignItems: 'center', marginBottom: SPACING.sm },
  avatarWrap: { marginBottom: SPACING.sm },
  avatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: COLORS.gold },
  avatarInitials: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.gold },
  initialsText: { fontSize: 34, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  hat: { position: 'absolute', top: -10, right: -6, fontSize: 30 },
  name: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text, textAlign: 'center' },
  meta: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2 },

  wish: { fontSize: FONTS.sizes.md, color: COLORS.primaryMid, fontWeight: FONTS.weights.semibold, marginTop: SPACING.md, textAlign: 'center' },
});
