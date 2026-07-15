import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { ATTENDANCE_RECORDS, STUDENTS } from '../../constants/mockData';

const STATUS_CFG = {
  present: { label: 'Present', color: '#27AE60', bg: '#E8F8EE', icon: 'checkmark-circle' },
  absent: { label: 'Absent', color: '#E74C3C', bg: '#FDEDEC', icon: 'close-circle' },
  late: { label: 'Late', color: '#F39C12', bg: '#FEF9E7', icon: 'time' },
};

export default function AttendanceScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const student = STUDENTS[0];
  const present = ATTENDANCE_RECORDS.filter((r) => r.status === 'present').length;
  const absent = ATTENDANCE_RECORDS.filter((r) => r.status === 'absent').length;
  const late = ATTENDANCE_RECORDS.filter((r) => r.status === 'late').length;
  const total = ATTENDANCE_RECORDS.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Tracker</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.studentCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>{student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentClass}>{student.class} • {student.admissionNo}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#E8F8EE' }]}>
            <Text style={[styles.summaryNum, { color: '#27AE60' }]}>{present}</Text>
            <Text style={[styles.summaryLabel, { color: '#27AE60' }]}>Present</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FDEDEC' }]}>
            <Text style={[styles.summaryNum, { color: '#E74C3C' }]}>{absent}</Text>
            <Text style={[styles.summaryLabel, { color: '#E74C3C' }]}>Absent</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEF9E7' }]}>
            <Text style={[styles.summaryNum, { color: '#F39C12' }]}>{late}</Text>
            <Text style={[styles.summaryLabel, { color: '#F39C12' }]}>Late</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#EBF2FF' }]}>
            <Text style={[styles.summaryNum, { color: COLORS.primary }]}>{pct}%</Text>
            <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>Rate</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Attendance Rate</Text>
            <Text style={[styles.progressPct, { color: pct >= 80 ? '#27AE60' : pct >= 60 ? '#F39C12' : '#E74C3C' }]}>{pct}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: pct >= 80 ? '#27AE60' : pct >= 60 ? '#F39C12' : '#E74C3C' }]} />
          </View>
          <Text style={styles.progressNote}>{pct >= 80 ? 'Excellent! Keep it up.' : pct >= 60 ? 'Good but can improve. Attendance below 80% may affect exams.' : 'Warning: Low attendance may result in exam barring.'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Attendance Record</Text>
        {ATTENDANCE_RECORDS.map((r, i) => {
          const cfg = STATUS_CFG[r.status] || STATUS_CFG.absent;
          const d = new Date(r.date);
          return (
            <View key={i} style={[styles.recordRow, { borderLeftColor: cfg.color }]}>
              <View style={[styles.statusIcon, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={18} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recordDate}>{d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                {r.reason && <Text style={styles.recordReason}>{r.reason}</Text>}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statusBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  studentAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  studentAvatarText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
  studentName: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  studentClass: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  summaryCard: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  summaryNum: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold },
  summaryLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
  progressCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  progressTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  progressPct: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold },
  progressBar: { height: 10, backgroundColor: COLORS.background, borderRadius: 5, overflow: 'hidden', marginBottom: SPACING.sm },
  progressFill: { height: '100%', borderRadius: 5 },
  progressNote: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  recordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.sm + 2, marginBottom: SPACING.xs, borderLeftWidth: 3, gap: SPACING.sm, ...SHADOW.sm },
  statusIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  recordDate: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  recordReason: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  statusBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
});
