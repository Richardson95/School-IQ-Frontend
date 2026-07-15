import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENT_MARKS } from '../../constants/mockData';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'test', label: 'Tests' },
  { key: 'exam', label: 'Exams' },
  { key: 'assignment', label: 'Assignments' },
];

function gradeOf(pct) {
  if (pct >= 80) return { letter: 'A', color: '#059669' };
  if (pct >= 70) return { letter: 'B', color: '#16A34A' };
  if (pct >= 60) return { letter: 'C', color: '#D97706' };
  if (pct >= 50) return { letter: 'D', color: '#EA580C' };
  return { letter: 'F', color: '#DC2626' };
}

export default function GradesScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('all');

  const visible = tab === 'all' ? STUDENT_MARKS : STUDENT_MARKS.filter((m) => m.type === tab);
  const overall = Math.round(
    STUDENT_MARKS.reduce((a, m) => a + (m.score / m.maxScore) * 100, 0) / STUDENT_MARKS.length
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>My Grades</Text>
        <Text style={styles.headerSub}>Tests, exams & assignment marks</Text>
        <View style={styles.overallCard}>
          <View>
            <Text style={styles.overallLabel}>Overall Average</Text>
            <Text style={styles.overallNum}>{overall}%</Text>
          </View>
          <View style={[styles.gradeBubble, { backgroundColor: gradeOf(overall).color }]}>
            <Text style={styles.gradeBubbleText}>{gradeOf(overall).letter}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, tab === t.key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {visible.map((m) => {
          const pct = Math.round((m.score / m.maxScore) * 100);
          const g = gradeOf(pct);
          return (
            <View key={m.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subject}>{m.subject}</Text>
                <Text style={styles.assessment}>{m.assessment}</Text>
                <Text style={styles.meta}>{m.term} · {m.date}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.score}>{m.score}/{m.maxScore}</Text>
                <View style={[styles.gradeTag, { backgroundColor: g.color + '18' }]}>
                  <Text style={[styles.gradeTagText, { color: g.color }]}>{pct}% · {g.letter}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  overallCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  overallLabel: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.75)' },
  overallNum: { fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.black, color: '#FFF' },
  gradeBubble: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  gradeBubbleText: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, color: '#FFF' },

  tabRow: { flexDirection: 'row', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  tab: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  tabText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },

  body: { paddingHorizontal: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  subject: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  assessment: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 1 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  score: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  gradeTag: { borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  gradeTagText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
});
