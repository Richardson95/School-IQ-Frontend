import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

const SETTINGS = [
  { key: 'push', icon: 'notifications-outline', label: 'Push Notifications', desc: 'Allow the app to send you alerts on this device', default: true },
  { key: 'incidents', icon: 'warning-outline', label: 'Incident Alerts', desc: 'Get notified when a teacher reports an incident', default: true },
  { key: 'broadcasts', icon: 'megaphone-outline', label: 'School Broadcasts', desc: 'Announcements from the school administration', default: true },
  { key: 'reports', icon: 'document-text-outline', label: 'Weekly Reports', desc: 'Notify me when a new weekly report is available', default: true },
  { key: 'attendance', icon: 'calendar-outline', label: 'Attendance Updates', desc: 'Daily attendance status for your children', default: false },
  { key: 'fees', icon: 'cash-outline', label: 'Fee Reminders', desc: 'Reminders about outstanding school fees', default: true },
];

export default function NotificationSettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState(
    SETTINGS.reduce((acc, s) => ({ ...acc, [s.key]: s.default }), {})
  );

  const toggle = (key) => setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.intro}>Choose what you want to be notified about.</Text>
        <View style={styles.card}>
          {SETTINGS.map((s, i) => (
            <View key={s.key} style={[styles.row, i < SETTINGS.length - 1 && styles.rowBorder]}>
              <View style={styles.iconWrap}>
                <Ionicons name={s.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{s.label}</Text>
                <Text style={styles.desc}>{s.desc}</Text>
              </View>
              <Switch
                value={values[s.key]}
                onValueChange={() => toggle(s.key)}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor="#FFF"
              />
            </View>
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
  intro: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  desc: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2, lineHeight: 16 },
});
