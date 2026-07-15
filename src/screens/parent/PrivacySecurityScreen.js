import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, StatusBar, Switch, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

export default function PrivacySecurityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [hideActivity, setHideActivity] = useState(false);

  const changePassword = () => {
    if (!current || !next || !confirm) { Alert.alert('Error', 'Please fill in all password fields.'); return; }
    if (next.length < 6) { Alert.alert('Error', 'New password must be at least 6 characters.'); return; }
    if (next !== confirm) { Alert.alert('Error', 'New password and confirmation do not match.'); return; }
    setCurrent(''); setNext(''); setConfirm('');
    Alert.alert('Password Changed', 'Your password has been updated successfully.');
  };

  const TOGGLES = [
    { key: 'biometric', icon: 'finger-print-outline', label: 'Biometric Login', desc: 'Use fingerprint or face ID to sign in', value: biometric, setter: setBiometric },
    { key: 'twoFactor', icon: 'shield-checkmark-outline', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security at login', value: twoFactor, setter: setTwoFactor },
    { key: 'hideActivity', icon: 'eye-off-outline', label: 'Hide Activity Status', desc: 'Don\'t show teachers when you\'re online', value: hideActivity, setter: setHideActivity },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Change Password</Text>
        <View style={styles.card}>
          {[['Current Password', current, setCurrent], ['New Password', next, setNext], ['Confirm New Password', confirm, setConfirm]].map(([label, value, setter]) => (
            <View key={label} style={styles.field}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setter}
                placeholder={label}
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>
          ))}
          <TouchableOpacity onPress={changePassword} style={styles.changeBtn} activeOpacity={0.85}>
            <Text style={styles.changeBtnText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Security Options</Text>
        <View style={styles.card}>
          {TOGGLES.map((t, i) => (
            <View key={t.key} style={[styles.row, i < TOGGLES.length - 1 && styles.rowBorder]}>
              <View style={styles.iconWrap}>
                <Ionicons name={t.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{t.label}</Text>
                <Text style={styles.desc}>{t.desc}</Text>
              </View>
              <Switch
                value={t.value}
                onValueChange={t.setter}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  field: { marginBottom: SPACING.sm },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, fontSize: FONTS.sizes.md, color: COLORS.text },
  changeBtn: { alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.xs },
  changeBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  desc: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2, lineHeight: 16 },
});
