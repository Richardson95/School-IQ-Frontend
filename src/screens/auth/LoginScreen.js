import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, SCREEN_WIDTH } from '../../constants/theme';
import { APP_NAME, SCHOOL_NAME, LOGO } from '../../constants/branding';

const ROLES = [
  { key: 'student',   label: 'Student',   icon: 'school',           gradient: ['#0F766E', '#14B8A6'] },
  { key: 'parent',    label: 'Parent',    icon: 'people',           gradient: ['#1D4ED8', '#3B82F6'] },
  { key: 'teacher',   label: 'Teacher',   icon: 'book',             gradient: ['#059669', '#10B981'] },
  { key: 'authority', label: 'Authority', icon: 'shield-checkmark', gradient: ['#7C3AED', '#8B5CF6'] },
  { key: 'admin',     label: 'Admin',     icon: 'settings',         gradient: ['#D97706', '#F59E0B'] },
];

const DEMO = {
  student:   { email: 'student@riverbank.edu',   password: 'demo123' },
  parent:    { email: 'parent@riverbank.edu',    password: 'demo123' },
  teacher:   { email: 'teacher@riverbank.edu',   password: 'demo123' },
  authority: { email: 'authority@riverbank.edu', password: 'demo123' },
  admin:     { email: 'admin@riverbank.edu',     password: 'demo123' },
};

export default function LoginScreen() {
  const { login, loginAsRole } = useAuth();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('student@riverbank.edu');
  const [password, setPassword] = useState('demo123');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (r) => {
    setRole(r);
    setEmail(DEMO[r].email);
    setPassword(DEMO[r].password);
  };

  const handleLogin = () => {
    if (!email.trim() || !password) { Alert.alert('Error', 'Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.success) Alert.alert('Login Failed', result.message);
    }, 800);
  };

  const activeRole = ROLES.find((r) => r.key === role);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Hero gradient header */}
      <LinearGradient colors={['#0C1B33', '#1A3A6B', '#2563EB']} style={styles.hero}>
        <View style={styles.logoRing}>
          <LinearGradient colors={['#D97706', '#F59E0B', '#FCD34D']} style={styles.logoGradientRing}>
            <View style={styles.logoInner}>
              <Image
                source={LOGO}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.schoolTag}>{SCHOOL_NAME} • School Connect</Text>
      </LinearGradient>

      {/* White card body */}
      <ScrollView
        style={styles.cardContainer}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardHandle} />
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to continue to your account</Text>

        {/* Role selector */}
        <Text style={styles.label}>Select Role</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.key}
              onPress={() => handleRoleChange(r.key)}
              activeOpacity={0.8}
              style={[styles.roleChip, role === r.key && styles.roleChipActive]}
            >
              {role === r.key ? (
                <LinearGradient colors={r.gradient} style={styles.roleChipGrad}>
                  <Ionicons name={r.icon} size={18} color="#FFF" />
                  <Text style={styles.roleLabelActive}>{r.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.roleChipIdle}>
                  <Ionicons name={r.icon} size={18} color={COLORS.textMuted} />
                  <Text style={styles.roleLabel}>{r.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={!showPwd}
          />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={styles.eyeBtn}>
            <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign in button */}
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} disabled={loading} style={styles.loginBtnWrap}>
          <LinearGradient colors={activeRole.gradient} style={styles.loginBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading ? (
              <Text style={styles.loginBtnText}>Signing in...</Text>
            ) : (
              <>
                <Ionicons name="log-in-outline" size={22} color="#FFF" />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick demo */}
        <View style={styles.demoWrap}>
          <View style={styles.demoDivider}><View style={styles.divLine} /><Text style={styles.divText}>Quick Demo</Text><View style={styles.divLine} /></View>
          <View style={styles.demoRow}>
            {ROLES.map((r) => (
              <TouchableOpacity key={r.key} onPress={() => loginAsRole(r.key)} activeOpacity={0.8} style={styles.demoBtn}>
                <LinearGradient colors={r.gradient} style={styles.demoBtnGrad}>
                  <Ionicons name={r.icon} size={16} color="#FFF" />
                </LinearGradient>
                <Text style={styles.demoBtnLabel}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>© 2026 {SCHOOL_NAME} · Powered by {APP_NAME}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 48,
  },
  logoRing: { marginBottom: 14 },
  logoGradientRing: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOW.lg,
  },
  logoInner: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: '#FFFDE7',
    alignItems: 'center', justifyContent: 'center',
  },
  logoImg: { width: 62, height: 62 },
  appName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.black,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  schoolTag: {
    fontSize: FONTS.sizes.sm,
    color: '#F59E0B',
    marginTop: 4,
    fontWeight: FONTS.weights.semibold,
    letterSpacing: 0.3,
  },

  cardContainer: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    marginTop: -24,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  cardContent: { paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  cardHandle: {
    width: 40, height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 20,
  },

  heading: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  subheading: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 8,
    marginTop: SPACING.md,
  },

  roleRow: { flexDirection: 'row', gap: 8 },
  roleChip: { flex: 1, borderRadius: RADIUS.sm, overflow: 'hidden', ...SHADOW.sm },
  roleChipActive: {},
  roleChipGrad: { alignItems: 'center', paddingVertical: 11, gap: 4 },
  roleChipIdle: {
    alignItems: 'center',
    paddingVertical: 11,
    gap: 4,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  roleLabel: { fontSize: 10, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  roleLabelActive: { fontSize: 10, fontWeight: FONTS.weights.bold, color: '#FFF' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: SPACING.md,
    ...SHADOW.sm,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, paddingVertical: 14, fontSize: FONTS.sizes.md, color: COLORS.text },
  eyeBtn: { padding: SPACING.xs },

  loginBtnWrap: { marginTop: SPACING.xl, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.md },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  loginBtnText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: '#FFF', letterSpacing: 0.3 },

  demoWrap: { marginTop: SPACING.xl },
  demoDivider: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.sm },
  divLine: { flex: 1, height: 1, backgroundColor: '#CBD5E1' },
  divText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: FONTS.weights.semibold },
  demoRow: { flexDirection: 'row', gap: SPACING.sm },
  demoBtn: { flex: 1, alignItems: 'center', gap: 6 },
  demoBtnGrad: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOW.sm,
  },
  demoBtnLabel: { fontSize: 10, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },

  footer: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl },
});
