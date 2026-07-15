import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENTS } from '../../constants/mockData';

const STATUS_OPTIONS = [
  { key: 'present', label: 'P', color: '#27AE60', bg: '#E8F8EE' },
  { key: 'absent', label: 'A', color: '#E74C3C', bg: '#FDEDEC' },
  { key: 'late', label: 'L', color: '#F39C12', bg: '#FEF9E7' },
];

export default function MarkAttendanceScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [cls, setCls] = useState('SS 2A');
  const classStudents = STUDENTS.filter((s) => s.class === cls);
  const [attendance, setAttendance] = useState(() =>
    Object.fromEntries(classStudents.map((s) => [s.id, 'present']))
  );

  const toggle = (studentId) => {
    const statuses = ['present', 'absent', 'late'];
    const current = attendance[studentId];
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    setAttendance((prev) => ({ ...prev, [studentId]: next }));
  };

  const submit = () => {
    const counts = STATUS_OPTIONS.map((s) => ({ ...s, count: Object.values(attendance).filter((v) => v === s.key).length }));
    Alert.alert('Attendance Submitted!', counts.map((c) => `${c.label}: ${c.count}`).join('  '), [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.clsRow}>
        {['SS 2A', 'SS 2B', 'SS 3A'].map((c) => (
          <TouchableOpacity key={c} onPress={() => setCls(c)} style={[styles.clsChip, cls === c && styles.clsChipActive]}>
            <Text style={[styles.clsText, cls === c && styles.clsTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dateRow}>
        <Ionicons name="calendar" size={16} color={COLORS.primary} />
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      </View>

      <View style={styles.legendRow}>
        {STATUS_OPTIONS.map((s) => (
          <View key={s.key} style={[styles.legend, { backgroundColor: s.bg }]}>
            <Text style={[styles.legendText, { color: s.color }]}>{s.label} = {s.key.charAt(0).toUpperCase() + s.key.slice(1)}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}>
        {classStudents.map((student, i) => {
          const status = attendance[student.id];
          const cfg = STATUS_OPTIONS.find((s) => s.key === status);
          return (
            <View key={student.id} style={styles.studentRow}>
              <Text style={styles.num}>{i + 1}.</Text>
              <View style={styles.studentAvatar}>
                <Text style={styles.studentAvatarText}>{student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.admNo}>{student.admissionNo}</Text>
              </View>
              <TouchableOpacity onPress={() => toggle(student.id)} style={[styles.statusBtn, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
                <Text style={[styles.statusBtnText, { color: cfg.color }]}>{cfg.label}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.submitBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.summaryRow}>
          {STATUS_OPTIONS.map((s) => (
            <Text key={s.key} style={[styles.summaryText, { color: s.color }]}>
              {s.label}: {Object.values(attendance).filter((v) => v === s.key).length}
            </Text>
          ))}
        </View>
        <TouchableOpacity onPress={submit} style={styles.submitBtn}>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.submitBtnText}>Submit Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  clsRow: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  clsChip: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border },
  clsChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  clsText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.medium, color: COLORS.textSecondary },
  clsTextActive: { color: '#FFF', fontWeight: FONTS.weights.bold },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: '#EBF2FF' },
  dateText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: FONTS.weights.medium },
  legendRow: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.sm, paddingHorizontal: SPACING.md },
  legend: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  legendText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
  body: { paddingHorizontal: SPACING.md },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.sm + 2, marginBottom: SPACING.xs, gap: SPACING.sm, ...SHADOW.sm },
  num: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, width: 20 },
  studentAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  studentAvatarText: { fontSize: 12, fontWeight: FONTS.weights.bold, color: '#FFF' },
  studentName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  admNo: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  statusBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  statusBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },
  submitBar: { backgroundColor: COLORS.surface, padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  summaryRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.sm, justifyContent: 'center' },
  summaryText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  submitBtnText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
