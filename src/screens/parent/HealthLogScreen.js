import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { HEALTH_LOG, STUDENTS } from '../../constants/mockData';

export default function HealthLogScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const student = STUDENTS[0];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health & Wellness Log</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.bannerCard}>
          <Ionicons name="heart" size={24} color={COLORS.error} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Student Health Records</Text>
            <Text style={styles.bannerSub}>All health incidents reported by the school nurse for {student.name}</Text>
          </View>
        </View>

        {HEALTH_LOG.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color="#27AE60" />
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptySub}>No health incidents have been recorded for {student.name}.</Text>
          </View>
        ) : (
          HEALTH_LOG.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>{new Date(log.date).getDate()}</Text>
                  <Text style={styles.dateMon}>{new Date(log.date).toLocaleString('default', { month: 'short' })}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.complaint}>{log.complaint}</Text>
                  <Text style={styles.nurseName}>Attended by: {log.attendingStaff}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: log.status === 'Resolved' ? '#E8F8EE' : '#FEF9E7' }]}>
                  <Text style={[styles.statusText, { color: log.status === 'Resolved' ? '#27AE60' : COLORS.warning }]}>{log.status}</Text>
                </View>
              </View>
              <View style={styles.logDetail}>
                <View style={styles.detailRow}>
                  <Ionicons name="medkit-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Treatment:</Text>
                  <Text style={styles.detailVal}>{log.treatment}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.success} />
                  <Text style={styles.detailLabel}>Action:</Text>
                  <Text style={styles.detailVal}>{log.actionTaken}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={styles.emergencyCard}>
          <Ionicons name="call" size={20} color={COLORS.error} />
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>School Nurse Contact</Text>
            <Text style={styles.emergencySub}>Nurse Grace Okafor</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  bannerCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: '#FDEDEC', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.error },
  bannerTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  bannerSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  emptySub: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center' },
  logCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, marginBottom: SPACING.sm, overflow: 'hidden', ...SHADOW.sm },
  logHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  dateBox: { width: 48, backgroundColor: '#FDEDEC', borderRadius: RADIUS.sm, alignItems: 'center', paddingVertical: SPACING.sm },
  dateDay: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: COLORS.error, lineHeight: 24 },
  dateMon: { fontSize: 10, fontWeight: FONTS.weights.bold, color: COLORS.error, textTransform: 'uppercase' },
  complaint: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  nurseName: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  logDetail: { backgroundColor: COLORS.background, padding: SPACING.md, gap: SPACING.sm },
  detailRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  detailLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  detailVal: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 18 },
  emergencyCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: '#FDEDEC', borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.sm },
  emergencyTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text },
  emergencySub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  callBtn: { backgroundColor: COLORS.error, paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full },
  callBtnText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
