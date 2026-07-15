import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

const FAQS_BY_ROLE = {
  parent: [
    { q: 'How do I view my child\'s weekly reports?', a: 'Open the Reports tab from the bottom navigation. You\'ll find all weekly reports submitted by your child\'s teachers, with classwork scores and summaries.' },
    { q: 'Where can I see school announcements?', a: 'Tap the notification bell on your home screen, or the broadcast banner at the top. Announcements appear under the "School Broadcasts" tab.' },
    { q: 'How do I track my child\'s attendance?', a: 'Go to Home → Attendance to see daily attendance records, including any late or absent days with reasons.' },
    { q: 'How are school fees displayed?', a: 'Open Home → Fee Tracker to view total fees, amount paid, outstanding balance, and your payment history.' },
    { q: 'How do I update my contact information?', a: 'Go to Profile → Edit Profile, change your name, email, or phone number, and tap Save Changes.' },
  ],
  teacher: [
    { q: 'How do I submit a weekly report?', a: 'Open the Reports tab, fill in the student, subject, scores, and summary, then submit. Parents will see it in their app.' },
    { q: 'How do I mark attendance?', a: 'Go to the Attendance tab, select your class, and mark each student present, absent, or late before saving.' },
    { q: 'How do I message a parent about an incident?', a: 'Use the Messages tab, choose the student, pick an incident type and severity, write your message, and send it to the parent.' },
    { q: 'Where do I see my subjects and classes?', a: 'Open Profile → My Subjects or My Classes to review everything currently assigned to you.' },
    { q: 'How do I change my profile photo?', a: 'Go to Profile and tap your picture (or Profile → Edit Profile), then choose a photo from your library or take a new one.' },
  ],
};

const CONTACTS = [
  { icon: 'call-outline', label: 'Call the School', value: '0800-123-4567', action: () => Linking.openURL('tel:08001234567') },
  { icon: 'mail-outline', label: 'Email Support', value: 'support@riverbank.edu', action: () => Linking.openURL('mailto:support@riverbank.edu') },
  { icon: 'logo-whatsapp', label: 'WhatsApp', value: 'Chat with us', action: () => Linking.openURL('https://wa.me/2348001234567') },
];

export default function HelpSupportScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [open, setOpen] = useState(null);
  const FAQS = FAQS_BY_ROLE[user?.role] || FAQS_BY_ROLE.parent;

  const handleContact = (c) => {
    c.action().catch(() => Alert.alert('Unavailable', `Please reach us at ${c.value}.`));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {FAQS.map((f, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setOpen(open === i ? null : i)}
              style={[styles.faqRow, i < FAQS.length - 1 && styles.rowBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.faqTop}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
              </View>
              {open === i && <Text style={styles.faqA}>{f.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.card}>
          {CONTACTS.map((c, i) => (
            <TouchableOpacity
              key={c.label}
              onPress={() => handleContact(c)}
              style={[styles.contactRow, i < CONTACTS.length - 1 && styles.rowBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={c.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{c.label}</Text>
                <Text style={styles.desc}>{c.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
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
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  faqRow: { paddingVertical: SPACING.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  faqTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm },
  faqQ: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  faqA: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20, marginTop: SPACING.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  desc: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
});
