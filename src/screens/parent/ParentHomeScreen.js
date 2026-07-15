import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, SCREEN_WIDTH } from '../../constants/theme';
import { STUDENTS, WEEKLY_REPORTS, INCIDENT_MESSAGES, ATTENDANCE_RECORDS, BROADCASTS } from '../../constants/mockData';
import UpcomingBirthdaysBanner from '../../components/UpcomingBirthdaysBanner';

const CARD_W = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / 2;

const FEATURES = [
  { key: 'IncidentMessages', label: 'Incident Messages', icon: 'warning',          iconColor: '#DC2626', bg: '#FEF2F2', tab: 'Reports' },
  { key: 'Attendance',       label: 'Attendance',        icon: 'calendar-number',  iconColor: '#059669', bg: '#F0FDF4' },
  { key: 'ReportCard',       label: 'Report Card',       icon: 'school',           iconColor: '#7C3AED', bg: '#F5F3FF' },
  { key: 'PracticeCbt',      label: 'Practice CBT',      icon: 'sparkles',         iconColor: '#2563EB', bg: '#EFF6FF' },
  { key: 'FeeTracker',       label: 'Fee Tracker',       icon: 'cash',             iconColor: '#D97706', bg: '#FFFBEB' },
  { key: 'Gallery',          label: 'Event Gallery',     icon: 'images',           iconColor: '#EA580C', bg: '#FFF7ED' },
  { key: 'HealthLog',        label: 'Health Log',        icon: 'medkit',           iconColor: '#DB2777', bg: '#FDF4FF' },
  { key: 'ThirdPartyPickup', label: '3rd Party Pickup',  icon: 'car-sport',        iconColor: '#0F766E', bg: '#ECFDF5' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function ParentHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const children = STUDENTS.filter((s) => user.childrenIds?.includes(s.id));
  const unread = INCIDENT_MESSAGES.filter((m) => !m.read).length + BROADCASTS.length;
  const todayPresent = ATTENDANCE_RECORDS[0]?.status === 'present';

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient
        colors={['#0C1B33', '#1A3A6B']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.navigate('Reports', { screen: 'IncidentMessages' })} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color="#FFF" />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Child cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.childScroll}
        >
          {children.map((child) => (
            <View key={child.id} style={styles.childCard}>
              <View style={styles.childAvatar}>
                <Text style={styles.avatarText}>
                  {child.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.childName} numberOfLines={1}>{child.name}</Text>
                <Text style={styles.childClass}>{child.class}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: todayPresent ? '#34D399' : '#F87171' }]} />
                  <Text style={styles.statusText}>{todayPresent ? 'Present Today' : 'Absent'}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Broadcast banner */}
        {BROADCASTS.length > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Reports', { screen: 'IncidentMessages' })}
            activeOpacity={0.85}
            style={styles.broadcastBanner}
          >
            <View style={styles.broadcastIconWrap}>
              <Ionicons name="megaphone" size={16} color="#2563EB" />
            </View>
            <Text style={styles.broadcastText} numberOfLines={1}>{BROADCASTS[0].title}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        <UpcomingBirthdaysBanner />

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => f.tab ? navigation.navigate(f.tab, { screen: f.key }) : navigation.navigate(f.key)}
              activeOpacity={0.78}
              style={styles.featureCard}
            >
              <View style={[styles.iconCircle, { backgroundColor: f.bg }]}>
                <Ionicons name={f.icon} size={26} color={f.iconColor} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Ionicons name="chevron-forward" size={13} color={COLORS.textMuted} style={{ alignSelf: 'flex-end' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Reports */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reports', { screen: 'WeeklyReports' })}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>
        {WEEKLY_REPORTS.slice(0, 2).map((r) => (
          <TouchableOpacity
            key={r.id}
            onPress={() => navigation.navigate('WeeklyReports')}
            style={styles.reportCard}
            activeOpacity={0.85}
          >
            <View style={styles.reportLeft}>
              <Text style={styles.reportSubject}>{r.subject}</Text>
              <Text style={styles.reportMeta}>{r.teacherName} · {r.week}</Text>
              <Text style={styles.reportSummary} numberOfLines={2}>{r.summary}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreNum}>{r.classwork}</Text>
              <Text style={styles.scoreLabel}>CW</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  greeting: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.65)' },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: '#FFF', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -3, right: -3,
    backgroundColor: '#F59E0B', borderRadius: 9,
    minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  childScroll: { paddingBottom: 4, gap: SPACING.sm },
  childCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: RADIUS.md, padding: SPACING.sm,
    gap: 10, minWidth: 200, maxWidth: 240,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  childAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#F59E0B',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  childName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#FFF' },
  childClass: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.85)' },

  body: { padding: SPACING.md },

  broadcastBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.md,
    padding: SPACING.sm, marginBottom: SPACING.md,
    gap: SPACING.sm, ...SHADOW.sm,
    borderWidth: 1, borderColor: '#E0EAFF',
  },
  broadcastIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
  },
  broadcastText: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.primaryMid },

  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginBottom: SPACING.sm },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: SPACING.md, marginBottom: SPACING.sm,
  },
  seeAll: { fontSize: FONTS.sizes.sm, color: COLORS.primaryMid, fontWeight: FONTS.weights.bold },

  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  featureCard: {
    width: CARD_W, backgroundColor: '#FFF',
    borderRadius: RADIUS.md, padding: SPACING.md,
    gap: SPACING.sm, ...SHADOW.sm,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  featureLabel: {
    fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold,
    color: COLORS.text, flex: 1, lineHeight: 18,
  },

  reportCard: {
    flexDirection: 'row', backgroundColor: '#FFF',
    borderRadius: RADIUS.md, marginBottom: SPACING.sm,
    overflow: 'hidden', ...SHADOW.sm,
    borderWidth: 1, borderColor: '#F1F5F9',
    borderLeftWidth: 4, borderLeftColor: COLORS.primaryMid,
  },
  reportLeft: { flex: 1, padding: SPACING.sm + 2 },
  reportSubject: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  reportMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  reportSummary: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
  scoreBox: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.md, backgroundColor: '#EFF6FF',
    minWidth: 56,
  },
  scoreNum: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.primaryMid },
  scoreLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: FONTS.weights.semibold },
});
