import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { REPORT_CARDS, STUDENTS } from '../../constants/mockData';
import { downloadText, reportCardToText } from '../../utils/download';

const GRADE_COLOR = { 'A': '#27AE60', 'B': '#2980B9', 'C': '#F39C12', 'D': '#E67E22', 'F': '#E74C3C' };

export default function ReportCardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const student = STUDENTS[0];
  const card = REPORT_CARDS[0];

  const getGradeColor = (grade) => GRADE_COLOR[grade?.[0]] || COLORS.textMuted;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Card</Text>
        <TouchableOpacity onPress={() => downloadText(`ReportCard_${student.name}_${card.term}`, reportCardToText(card, student.name))} style={styles.backBtn}>
          <Ionicons name="download-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.topCard}>
          <View style={styles.studentRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentMeta}>{student.class} • {student.admissionNo}</Text>
            </View>
          </View>
          <View style={styles.termRow}>
            <View style={styles.termBadge}><Text style={styles.termText}>{card.term}</Text></View>
            <Text style={styles.session}>{card.session}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{card.average}%</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{card.position}<Text style={styles.statSuffix}>{getOrdinal(card.position)}</Text></Text>
              <Text style={styles.statLabel}>Position</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{card.outOf}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Subject Results</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thCell, { flex: 2 }]}>Subject</Text>
            <Text style={styles.thCell}>Score</Text>
            <Text style={styles.thCell}>Grade</Text>
            <Text style={[styles.thCell, { flex: 1.5 }]}>Remark</Text>
          </View>
          {card.subjects.map((subj, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && { backgroundColor: COLORS.background }]}>
              <Text style={[styles.tdCell, { flex: 2, fontWeight: FONTS.weights.medium }]} numberOfLines={1}>{subj.name}</Text>
              <Text style={[styles.tdCell, { color: subj.score >= 80 ? '#27AE60' : subj.score >= 60 ? '#F39C12' : '#E74C3C', fontWeight: FONTS.weights.bold }]}>{subj.score}</Text>
              <View style={[styles.gradeBox, { backgroundColor: getGradeColor(subj.grade) + '22' }]}>
                <Text style={[styles.gradeText, { color: getGradeColor(subj.grade) }]}>{subj.grade}</Text>
              </View>
              <Text style={[styles.tdCell, { flex: 1.5, color: COLORS.textSecondary }]} numberOfLines={1}>{subj.remark}</Text>
            </View>
          ))}
        </View>

        <View style={styles.remarkCard}>
          <Text style={styles.remarkTitle}>Principal's Remark</Text>
          <Text style={styles.remarkBody}>{card.principalRemark}</Text>
        </View>
        <View style={[styles.remarkCard, { borderLeftColor: COLORS.primaryLight }]}>
          <Text style={styles.remarkTitle}>Class Teacher's Remark</Text>
          <Text style={styles.remarkBody}>{card.teacherRemark}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  topCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md },
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
  studentName: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  studentMeta: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  termRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  termBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  termText: { fontSize: FONTS.sizes.sm, color: '#FFF', fontWeight: FONTS.weights.semibold },
  session: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.sm },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.primary },
  statSuffix: { fontSize: FONTS.sizes.sm },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: FONTS.weights.medium },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  tableCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.sm },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.primary, padding: SPACING.sm + 2 },
  thCell: { flex: 1, fontSize: FONTS.sizes.xs, color: '#FFF', fontWeight: FONTS.weights.bold, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tdCell: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text },
  gradeBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 3, borderRadius: 4, marginHorizontal: 2 },
  gradeText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold },
  remarkCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 4, borderLeftColor: COLORS.primary, ...SHADOW.sm },
  remarkTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  remarkBody: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 22 },
});
