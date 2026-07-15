import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENT_TESTS } from '../../constants/mockData';

const STATUS_STYLE = {
  available: { label: 'Open Now', color: '#059669', bg: '#ECFDF5' },
  upcoming:  { label: 'Upcoming', color: '#D97706', bg: '#FFFBEB' },
  completed: { label: 'Completed', color: '#2563EB', bg: '#EFF6FF' },
};

export default function TestsExamsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tests & Exams</Text>
        <Text style={styles.headerSub}>Take your tests and exams remotely</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {STUDENT_TESTS.map((t) => {
          const st = STATUS_STYLE[t.status];
          return (
            <View key={t.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.typeBadge, { backgroundColor: t.type === 'exam' ? '#FEF2F2' : '#EFF6FF' }]}>
                  <Ionicons name={t.type === 'exam' ? 'school' : 'create'} size={14} color={t.type === 'exam' ? '#DC2626' : '#2563EB'} />
                  <Text style={[styles.typeText, { color: t.type === 'exam' ? '#DC2626' : '#2563EB' }]}>{t.type.toUpperCase()}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>
              <Text style={styles.subject}>{t.subject}</Text>
              <Text style={styles.title}>{t.title}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="help-circle-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{t.totalQuestions} questions</Text>
                <Ionicons name="time-outline" size={14} color={COLORS.textMuted} style={{ marginLeft: 12 }} />
                <Text style={styles.metaText}>{t.duration} mins</Text>
              </View>

              {t.status === 'available' && (
                <TouchableOpacity onPress={() => navigation.navigate('TakeTest', { test: t })} style={styles.startBtn} activeOpacity={0.85}>
                  <Ionicons name="play" size={16} color="#FFF" />
                  <Text style={styles.startBtnText}>Start {t.type}</Text>
                </TouchableOpacity>
              )}
              {t.status === 'upcoming' && (
                <Text style={styles.upcomingNote}>Opens {t.openDate}</Text>
              )}
              {t.status === 'completed' && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultText}>Your score: {t.score}/{t.maxScore}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  body: { padding: SPACING.md },
  card: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  typeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold, letterSpacing: 0.5 },
  statusPill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  subject: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: 4 },
  metaText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#059669', borderRadius: RADIUS.sm, paddingVertical: 11, marginTop: SPACING.sm },
  startBtnText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, textTransform: 'capitalize' },
  upcomingNote: { fontSize: FONTS.sizes.xs, color: '#D97706', fontWeight: FONTS.weights.semibold, marginTop: SPACING.sm },
  resultBox: { backgroundColor: '#EFF6FF', borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  resultText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#2563EB' },
});
