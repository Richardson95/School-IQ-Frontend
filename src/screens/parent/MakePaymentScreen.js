import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { SCHOOL_ACCOUNT, FEE_RECORDS, STUDENTS } from '../../constants/mockData';
import { useFees } from '../../context/FeesContext';

const fmt = (n) => `₦${n.toLocaleString()}`;

export default function MakePaymentScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { getFeeRecord, submitPayment } = useFees();
  const studentId = route?.params?.studentId ?? FEE_RECORDS.studentId;
  const student = STUDENTS.find((s) => s.id === studentId) || STUDENTS[0];
  const record = getFeeRecord(student.id);
  const balance = record.balance;

  const [amount, setAmount] = useState(balance ? String(balance) : '');
  const [receipt, setReceipt] = useState(null); // { uri, name }
  const [submitting, setSubmitting] = useState(false);

  const amountNum = parseInt((amount || '').replace(/[^0-9]/g, ''), 10) || 0;
  const canConfirm = !!receipt && amountNum > 0 && !submitting;

  const pickReceipt = (source) => async () => {
    const opts = { quality: 0.7 };
    let res;
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Please allow camera access to snap the receipt.'); return; }
      res = await ImagePicker.launchCameraAsync(opts);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Please allow photo access to choose the receipt.'); return; }
      res = await ImagePicker.launchImageLibraryAsync({ ...opts, mediaTypes: ['images'] });
    }
    if (!res.canceled) {
      const asset = res.assets[0];
      setReceipt({ uri: asset.uri, name: asset.fileName || 'payment-receipt.jpg' });
    }
  };

  const chooseReceipt = () => {
    Alert.alert('Upload Receipt', 'Attach proof of your bank transfer', [
      { text: 'Take Photo', onPress: pickReceipt('camera') },
      { text: 'Choose from Library', onPress: pickReceipt('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const confirmPayment = () => {
    if (!canConfirm) return; // guarded — button is disabled without receipt + amount
    setSubmitting(true);
    setTimeout(() => {
      submitPayment({
        studentId: student.id,
        amount: amountNum,
        receiptUri: receipt.uri,
        receiptName: receipt.name,
        note: `Fee payment — ${record.session}`,
      });
      setSubmitting(false);
      Alert.alert(
        'Payment Submitted ✓',
        `Your ${fmt(amountNum)} payment for ${student.name} has been sent to the school admin for confirmation. Once they confirm it, it will be deducted from the outstanding balance.`,
        [{ text: 'Done', onPress: () => navigation.goBack() }],
      );
    }, 900);
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} selectable>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay School Fees</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
          {/* Who / how much */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Outstanding balance for {student.name}</Text>
            <Text style={styles.balanceValue}>{balance === 0 ? 'Fully Paid' : fmt(balance)}</Text>
            <Text style={styles.balanceMeta}>{student.class} • {student.admissionNo}</Text>
          </View>

          {/* Amount being paid */}
          <Text style={styles.amountLabel}>Amount you are paying</Text>
          <View style={styles.amountRow}>
            <Text style={styles.naira}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          {amountNum > balance && balance > 0 && (
            <Text style={styles.amountWarn}>That's more than the outstanding balance of {fmt(balance)}.</Text>
          )}

          {/* Step 1 — bank details */}
          <View style={styles.stepRow}>
            <View style={styles.stepDot}><Text style={styles.stepDotText}>1</Text></View>
            <Text style={styles.stepTitle}>Transfer to the school account</Text>
          </View>
          <View style={styles.accountCard}>
            <View style={styles.bankBadge}>
              <Ionicons name="business" size={20} color={COLORS.primary} />
              <Text style={styles.bankName}>{SCHOOL_ACCOUNT.bankName}</Text>
            </View>
            <DetailRow label="Account Name" value={SCHOOL_ACCOUNT.accountName} />
            <DetailRow label="Account Number" value={SCHOOL_ACCOUNT.accountNumber} />
            <DetailRow label="Sort Code" value={SCHOOL_ACCOUNT.sortCode} />
            <View style={styles.refNote}>
              <Ionicons name="information-circle" size={16} color={COLORS.warning} />
              <Text style={styles.refText}>{SCHOOL_ACCOUNT.reference}</Text>
            </View>
          </View>

          {/* Step 2 — upload receipt */}
          <View style={styles.stepRow}>
            <View style={styles.stepDot}><Text style={styles.stepDotText}>2</Text></View>
            <Text style={styles.stepTitle}>Upload your payment receipt</Text>
          </View>

          {!receipt ? (
            <TouchableOpacity style={styles.uploadBox} onPress={chooseReceipt} activeOpacity={0.8}>
              <View style={styles.uploadIcon}>
                <Ionicons name="cloud-upload-outline" size={28} color={COLORS.primaryMid} />
              </View>
              <Text style={styles.uploadTitle}>Upload receipt</Text>
              <Text style={styles.uploadSub}>Snap or choose a photo of your transfer receipt</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.receiptCard}>
              <Image source={{ uri: receipt.uri }} style={styles.receiptThumb} />
              <View style={{ flex: 1 }}>
                <View style={styles.uploadedRow}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.uploadedText}>Receipt attached</Text>
                </View>
                <Text style={styles.receiptName} numberOfLines={1}>{receipt.name}</Text>
                <View style={styles.receiptActions}>
                  <TouchableOpacity onPress={chooseReceipt}><Text style={styles.receiptAction}>Change</Text></TouchableOpacity>
                  <Text style={styles.receiptDot}>•</Text>
                  <TouchableOpacity onPress={() => setReceipt(null)}><Text style={[styles.receiptAction, { color: COLORS.error }]}>Remove</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {!receipt && (
            <Text style={styles.hint}>You must upload a receipt before you can confirm payment.</Text>
          )}

          {/* Step 3 — confirm (disabled until receipt uploaded + amount entered) */}
          <TouchableOpacity
            style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
            onPress={confirmPayment}
            disabled={!canConfirm}
            activeOpacity={0.85}
          >
            <Ionicons name={submitting ? 'hourglass-outline' : 'shield-checkmark'} size={18} color="#FFF" />
            <Text style={styles.confirmText}>{submitting ? 'Submitting…' : 'Confirm Payment'}</Text>
          </TouchableOpacity>
          <Text style={styles.submitNote}>Your payment will be reviewed and confirmed by the school admin.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },

  balanceCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, ...SHADOW.sm, borderLeftWidth: 4, borderLeftColor: COLORS.warning },
  balanceLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  balanceValue: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: 2 },
  balanceMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  amountLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md, marginBottom: 6, ...SHADOW.sm },
  naira: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: COLORS.textSecondary },
  amountInput: { flex: 1, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text, paddingVertical: SPACING.sm },
  amountWarn: { fontSize: FONTS.sizes.xs, color: COLORS.warning, marginBottom: SPACING.md },

  stepRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm, marginTop: SPACING.md },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primaryMid, alignItems: 'center', justifyContent: 'center' },
  stepDotText: { color: '#FFF', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold },
  stepTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },

  accountCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, ...SHADOW.sm },
  bankBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingBottom: SPACING.sm, marginBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  bankName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  detailLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  detailValue: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, letterSpacing: 0.5 },
  refNote: { flexDirection: 'row', gap: 6, backgroundColor: COLORS.warningLight, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  refText: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.warning, lineHeight: 16 },

  uploadBox: { borderWidth: 1.5, borderColor: COLORS.primaryMid, borderStyle: 'dashed', borderRadius: RADIUS.md, padding: SPACING.lg, alignItems: 'center', backgroundColor: COLORS.surfaceAlt, marginBottom: SPACING.sm },
  uploadIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  uploadTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  uploadSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },

  receiptCard: { flexDirection: 'row', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.successLight },
  receiptThumb: { width: 64, height: 64, borderRadius: RADIUS.sm, backgroundColor: COLORS.border },
  uploadedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  uploadedText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.success },
  receiptName: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  receiptActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  receiptAction: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  receiptDot: { color: COLORS.textMuted },

  hint: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.md, fontStyle: 'italic' },

  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingVertical: 15, marginTop: SPACING.sm, ...SHADOW.md },
  confirmBtnDisabled: { backgroundColor: COLORS.textMuted, ...Platform.select({ default: { elevation: 0 } }), shadowOpacity: 0 },
  confirmText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },
  submitNote: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.sm },
});
