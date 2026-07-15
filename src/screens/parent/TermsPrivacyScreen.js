import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By using the School IQ application, you agree to these Terms of Use and our Privacy Policy. School IQ is provided to parents and guardians of River Bank School students to support communication with the school.',
  },
  {
    title: '2. Use of the App',
    body: 'The app is for personal, non-commercial use. You agree to keep your login credentials confidential and to use the information provided solely for matters concerning your child\'s education and welfare.',
  },
  {
    title: '3. Information We Collect',
    body: 'We collect your name, email, phone number, and details about your child\'s academic records, attendance, health logs, and fees. This information is provided by the school and used only to deliver the app\'s features to you.',
  },
  {
    title: '4. How We Use Your Data',
    body: 'Your data is used to display reports, attendance, broadcasts, and to enable communication with school staff. We do not sell your personal information to third parties.',
  },
  {
    title: '5. Data Security',
    body: 'We apply reasonable technical and organisational measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
  },
  {
    title: '6. Communication',
    body: 'Messages exchanged with school staff through the app are records associated with your child\'s file. Please communicate respectfully and professionally at all times.',
  },
  {
    title: '7. Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of the app after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    title: '8. Contact',
    body: 'For questions about these terms or your privacy, contact the school administration at support@riverbank.edu or 0800-123-4567.',
  },
];

export default function TermsPrivacyScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.card}>
          <Ionicons name="document-text" size={28} color={COLORS.primary} />
          <Text style={styles.lastUpdated}>Last updated: June 2026</Text>
          <Text style={styles.intro}>Please read these terms and our privacy policy carefully before using School IQ.</Text>
        </View>

        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}

        <Text style={styles.footer}>School IQ v1.0.0 • River Bank School</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  lastUpdated: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.sm, fontWeight: FONTS.weights.semibold },
  intro: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20, marginTop: SPACING.xs },
  section: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.xs },
  sectionBody: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 21 },
  footer: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.sm },
});
