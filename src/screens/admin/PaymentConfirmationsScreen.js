import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { useFees } from '../../context/FeesContext';

const fmt = (n) => `₦${n.toLocaleString()}`;
const FILTERS = ['Pending', 'Confirmed', 'Declined'];

const STATUS_STYLE = {
  pending:   { label: 'Pending',   color: COLORS.primaryMid, bg: COLORS.surfaceAlt },
  confirmed: { label: 'Confirmed', color: COLORS.success, bg: COLORS.successLight },
  declined:  { label: 'Declined',  color: COLORS.error, bg: COLORS.errorLight },
};

export default function PaymentConfirmationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { pendingPayments, getFeeRecord, confirmPayment, declinePayment } = useFees();
  const [filter, setFilter] = useState('Pending');
  const [preview, setPreview] = useState(null); // receipt uri being viewed

  const visible = pendingPayments.filter((p) => p.status === filter.toLowerCase());

  const onConfirm = (p) => {
    const rec = getFeeRecord(p.studentId);
    const newBalance = Math.max(0, rec.totalFees - (rec.amountPaid + p.amount));
    Alert.alert(
      'Confirm payment?',
      `Confirm ${fmt(p.amount)} from ${p.studentName} (${p.className}).\n\nThis will be deducted from their fees. New balance: ${newBalance === 0 ? 'Fully Paid' : fmt(newBalance)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => { confirmPayment(p.id); Alert.alert('Payment Confirmed ✓', `${fmt(p.amount)} applied to ${p.studentName}'s account.`); } },
      ],
    );
  };

  const onDecline = (p) => {
    Alert.alert('Decline payment?', `Decline the ${fmt(p.amount)} payment from ${p.studentName}? Nothing will be deducted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => declinePayment(p.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Confirmations</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const count = pendingPayments.filter((p) => p.status === f.toLowerCase()).length;
          return (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}{count > 0 ? ` (${count})` : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {visible.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No {filter.toLowerCase()} payments.</Text>
          </View>
        )}

        {visible.map((p) => {
          const st = STATUS_STYLE[p.status];
          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardTop}>
                <TouchableOpacity onPress={() => setPreview(p.receiptUri)} activeOpacity={0.85}>
                  <Image source={{ uri: p.receiptUri }} style={styles.thumb} />
                  <View style={styles.thumbOverlay}><Ionicons name="expand" size={14} color="#FFF" /></View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.amount}>{fmt(p.amount)}</Text>
                    <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                      <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.studentName}>{p.studentName}</Text>
                  <Text style={styles.meta}>{p.className} • {p.admissionNo}</Text>
                  <Text style={styles.meta}>Submitted {new Date(p.submittedAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </View>

              {p.status === 'pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.declineBtn} onPress={() => onDecline(p)} activeOpacity={0.85}>
                    <Ionicons name="close" size={16} color={COLORS.error} />
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm(p)} activeOpacity={0.85}>
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
              {p.status === 'confirmed' && (
                <Text style={styles.doneNote}>✓ Confirmed by {p.confirmedBy} — deducted from balance</Text>
              )}
              {p.status === 'declined' && (
                <Text style={[styles.doneNote, { color: COLORS.error }]}>Declined — no deduction made</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Full receipt viewer */}
      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <TouchableOpacity style={styles.previewWrap} activeOpacity={1} onPress={() => setPreview(null)}>
          {preview && <Image source={{ uri: preview }} style={styles.previewImg} resizeMode="contain" />}
          <Text style={styles.previewHint}>Tap anywhere to close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },

  filterRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  filterText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },

  body: { paddingHorizontal: SPACING.md },
  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  cardTop: { flexDirection: 'row', gap: SPACING.md },
  thumb: { width: 72, height: 72, borderRadius: RADIUS.sm, backgroundColor: COLORS.border },
  thumbOverlay: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, padding: 3 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  statusPill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  studentName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 2 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 1 },

  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  declineBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.error },
  declineText: { color: COLORS.error, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  confirmBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11, borderRadius: RADIUS.sm, backgroundColor: COLORS.success },
  confirmText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  doneNote: { fontSize: FONTS.sizes.xs, color: COLORS.success, fontWeight: FONTS.weights.semibold, marginTop: SPACING.sm },

  previewWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  previewImg: { width: '92%', height: '80%' },
  previewHint: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, marginTop: SPACING.md },
});
