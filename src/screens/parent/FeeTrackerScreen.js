import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { FEE_RECORDS, STUDENTS } from '../../constants/mockData';
import { useFees } from '../../context/FeesContext';

export default function FeeTrackerScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { getFeeRecord, pendingPayments } = useFees();
  const student = STUDENTS[0];
  const fee = getFeeRecord(student.id);
  const myPending = pendingPayments.filter((p) => p.studentId === student.id && p.status === 'pending');
  const paidPct = Math.round((fee.amountPaid / fee.totalFees) * 100);
  const isOverdue = new Date(fee.dueDate) < new Date();

  const fmt = (n) => `₦${n.toLocaleString()}`;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fee Tracker</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.overviewCard}>
          <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.overviewGrad}>
            <Text style={styles.overviewLabel}>Total Fees — {fee.session}</Text>
            <Text style={styles.overviewTotal}>{fmt(fee.totalFees)}</Text>
            <View style={styles.overviewRow}>
              <View>
                <Text style={styles.overviewSub}>Paid</Text>
                <Text style={styles.overviewPaid}>{fmt(fee.amountPaid)}</Text>
              </View>
              <View style={styles.overviewDivider} />
              <View>
                <Text style={styles.overviewSub}>Balance</Text>
                <Text style={[styles.overviewBalance, fee.balance === 0 && { color: '#2ECC71' }]}>
                  {fee.balance === 0 ? 'Fully Paid' : fmt(fee.balance)}
                </Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${paidPct}%` }]} />
            </View>
            <Text style={styles.paidPct}>{paidPct}% paid</Text>
          </LinearGradient>
        </View>

        {fee.balance > 0 && (
          <View style={[styles.alertCard, isOverdue && { borderColor: COLORS.error, backgroundColor: '#FDEDEC' }]}>
            <Ionicons name={isOverdue ? 'alert-circle' : 'calendar'} size={18} color={isOverdue ? COLORS.error : COLORS.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: isOverdue ? COLORS.error : COLORS.warning }]}>
                {isOverdue ? 'Payment Overdue!' : 'Payment Due Date'}
              </Text>
              <Text style={styles.alertSub}>
                {fmt(fee.balance)} due by {new Date(fee.dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
        )}

        {fee.balance === 0 && (
          <View style={[styles.alertCard, { borderColor: '#27AE60', backgroundColor: '#E8F8EE' }]}>
            <Ionicons name="checkmark-circle" size={18} color="#27AE60" />
            <Text style={[styles.alertTitle, { color: '#27AE60', flex: 1 }]}>All fees fully paid for {fee.session}!</Text>
          </View>
        )}

        {myPending.map((p) => (
          <View key={p.id} style={styles.pendingCard}>
            <Ionicons name="hourglass" size={18} color={COLORS.primaryMid} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>{fmt(p.amount)} awaiting confirmation</Text>
              <Text style={styles.pendingSub}>Submitted {new Date(p.submittedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} — pending school admin review</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Payment History</Text>
        {fee.payments.map((p) => (
          <View key={p.id} style={styles.paymentRow}>
            <View style={styles.paymentIcon}>
              <Ionicons name="receipt" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentDesc}>{p.description}</Text>
              <Text style={styles.paymentDate}>{new Date(p.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
              <Text style={styles.receiptNo}>Receipt: {p.receipt}</Text>
            </View>
            <Text style={styles.paymentAmount}>{fmt(p.amount)}</Text>
          </View>
        ))}

        {fee.balance > 0 && (
          <TouchableOpacity
            style={styles.payBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MakePayment', { balance: fee.balance })}
          >
            <Ionicons name="card" size={18} color="#FFF" />
            <Text style={styles.payBtnText}>Pay Fees / Upload Receipt</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.contactBtn} activeOpacity={0.85}>
          <Ionicons name="call" size={18} color={COLORS.primary} />
          <Text style={styles.contactBtnText}>Contact School Bursary</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  overviewCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.lg },
  overviewGrad: { padding: SPACING.lg },
  overviewLabel: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)' },
  overviewTotal: { fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.extrabold, color: '#FFF', marginBottom: SPACING.md },
  overviewRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xl, marginBottom: SPACING.md },
  overviewSub: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)' },
  overviewPaid: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.secondary },
  overviewBalance: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.error },
  overviewDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  progressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.secondary, borderRadius: 4 },
  paidPct: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#FEF9E7', borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.warning },
  alertTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.warning },
  alertSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  pendingCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.primaryMid + '40' },
  pendingTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  pendingSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md, ...SHADOW.sm },
  paymentIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center' },
  paymentDesc: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  paymentDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  receiptNo: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: FONTS.weights.medium },
  paymentAmount: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: '#27AE60' },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBF2FF', borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, marginTop: SPACING.sm, borderWidth: 1, borderColor: COLORS.primary },
  contactBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.primary },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, marginTop: SPACING.md, ...SHADOW.sm },
  payBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
