import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { WEEKLY_REPORTS, STUDENTS } from '../../constants/mockData';
import { downloadText, weeklyReportToText } from '../../utils/download';

const GRADE_COLORS = { Outstanding: '#27AE60', Excellent: '#2980B9', Good: '#8E44AD', Average: '#F39C12', 'Needs Improvement': '#E74C3C' };

export default function WeeklyReportsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);

  const scoreColor = (s) => s >= 80 ? COLORS.success : s >= 60 ? COLORS.warning : COLORS.error;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Reports</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {WEEKLY_REPORTS.map((r) => {
          const student = STUDENTS.find((s) => s.id === r.studentId);
          const avg = Math.round((r.classwork + r.homework + r.participation) / 3);
          return (
            <TouchableOpacity key={r.id} onPress={() => setSelected(r)} style={styles.card} activeOpacity={0.85}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectBadge}>
                  <Ionicons name="book-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.subjectText}>{r.subject}</Text>
                </View>
                <Text style={[styles.avgScore, { color: scoreColor(avg) }]}>{avg}%</Text>
              </View>
              <Text style={styles.teacherName}>{r.teacherName}</Text>
              <Text style={styles.weekLabel}>{r.week} • {r.term} • {r.session}</Text>
              {student && <Text style={styles.studentLabel}>Student: {student.name}</Text>}
              <View style={styles.scoresRow}>
                {[['Classwork', r.classwork], ['Homework', r.homework], ['Participation', r.participation]].map(([label, score]) => (
                  <View key={label} style={styles.scoreBox}>
                    <Text style={[styles.scoreNum, { color: scoreColor(score) }]}>{score}</Text>
                    <Text style={styles.scoreLabel}>{label}</Text>
                  </View>
                ))}
                <View style={styles.scoreBox}>
                  <View style={[styles.behaviorBadge, { backgroundColor: GRADE_COLORS[r.behavior] || COLORS.info }]}>
                    <Text style={styles.behaviorText}>{r.behavior}</Text>
                  </View>
                  <Text style={styles.scoreLabel}>Behavior</Text>
                </View>
              </View>
              <Text style={styles.summaryText} numberOfLines={2}>{r.summary}</Text>
              <Text style={styles.dateText}>{new Date(r.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selected?.subject} Report</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalMeta}>{selected?.teacherName} • {selected?.week}</Text>
              <View style={styles.modalScores}>
                {selected && [['Classwork', selected.classwork], ['Homework', selected.homework], ['Participation', selected.participation]].map(([l, v]) => (
                  <View key={l} style={styles.modalScoreBox}>
                    <Text style={[styles.modalScoreNum, { color: scoreColor(v) }]}>{v}</Text>
                    <Text style={styles.modalScoreLabel}>{l}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Teacher's Summary</Text>
                <Text style={styles.modalBody}>{selected?.summary}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Recommendations</Text>
                <Text style={styles.modalBody}>{selected?.recommendations}</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => selected && downloadText(`WeeklyReport_${selected.subject}_${selected.week}`, weeklyReportToText(selected))}
                activeOpacity={0.85}
              >
                <Ionicons name="download-outline" size={18} color="#FFF" />
                <Text style={styles.downloadText}>Download Report</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  subjectBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EBF2FF', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  subjectText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.primary },
  avgScore: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold },
  teacherName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  weekLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 2 },
  studentLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  scoresRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  scoreBox: { flex: 1, alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.sm },
  scoreNum: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold },
  scoreLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: FONTS.weights.medium, textAlign: 'center' },
  behaviorBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: RADIUS.full },
  behaviorText: { fontSize: 9, fontWeight: FONTS.weights.bold, color: '#FFF' },
  summaryText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  dateText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  modalMeta: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginBottom: SPACING.md },
  modalScores: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  modalScoreBox: { flex: 1, alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.sm },
  modalScoreNum: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold },
  modalScoreLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  modalSection: { marginBottom: SPACING.md },
  modalSectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primary, marginBottom: SPACING.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalBody: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 22 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.md, paddingVertical: 13, marginTop: SPACING.xs, marginBottom: SPACING.md },
  downloadText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
});
