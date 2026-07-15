import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { usePickup } from '../../context/PickupContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, SCREEN_WIDTH } from '../../constants/theme';
import { WEEKLY_REPORTS, STUDENTS, CALENDAR_EVENTS, BROADCASTS } from '../../constants/mockData';
import UpcomingBirthdaysBanner from '../../components/UpcomingBirthdaysBanner';

const CARD_W = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / 2;

const QUICK_ACTIONS = [
  { key: 'SubmitReport',    label: 'Submit\nWeekly Report', icon: 'document-text',       colors: ['#1D4ED8', '#3B82F6'] },
  { key: 'MarkAttendance',  label: 'Mark\nAttendance',      icon: 'checkmark-circle',    colors: ['#059669', '#10B981'] },
  { key: 'MessageParent',   label: 'Message\na Parent',     icon: 'chatbubble',           colors: ['#C2410C', '#F97316'] },
  { key: 'AssignmentSubmissions', label: 'Assignment\nSubmissions', icon: 'folder-open',   colors: ['#0F766E', '#14B8A6'] },
  { key: 'TeacherLiveClass',label: 'Live\nClass',           icon: 'videocam',             colors: ['#7C3AED', '#8B5CF6'] },
  { key: 'VoiceNotes',      label: 'Voice Listener\n& Notes', icon: 'mic',                colors: ['#B91C1C', '#EF4444'] },
  { key: 'TeacherCalendar', label: 'School\nCalendar',      icon: 'calendar',             colors: ['#0F766E', '#14B8A6'] },
];

export default function TeacherHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { activeCount } = usePickup();
  const myClasses = ['SS 2A', 'SS 2B', 'SS 3A'];
  const myStudents = STUDENTS.filter((s) => myClasses.includes(s.class));
  const recentReports = WEEKLY_REPORTS.filter((r) => r.teacherId === 't1').slice(0, 3);
  const upcoming = CALENDAR_EVENTS.filter((e) => new Date(e.date) >= new Date()).slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient
        colors={['#0C1B33', '#1A3A6B']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        {/* Top row */}
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
            <View style={styles.rolePill}>
              <Ionicons name="book" size={12} color="#F59E0B" />
              <Text style={styles.roleText}>Mathematics Teacher</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#FFF" />
            {BROADCASTS.length > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{BROADCASTS.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {[
            { icon: 'library-outline',   label: 'Classes',  value: myClasses.length },
            { icon: 'people-outline',    label: 'Students', value: myStudents.length },
            { icon: 'document-outline',  label: 'Reports',  value: recentReports.length },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statBox}>
                <Ionicons name={s.icon} size={16} color="rgba(255,255,255,0.7)" style={{ marginBottom: 4 }} />
                <Text style={styles.statNum}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <UpcomingBirthdaysBanner />

        {/* Third-party pickup alerts */}
        <TouchableOpacity onPress={() => navigation.navigate('PickupAlerts')} activeOpacity={0.85} style={styles.pickupBanner}>
          <View style={styles.pickupIcon}><Ionicons name="car-sport" size={20} color="#FFF" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pickupTitle}>3rd Party Pickup Alerts</Text>
            <Text style={styles.pickupSub}>{activeCount > 0 ? `${activeCount} awaiting verification` : 'No active alerts'}</Text>
          </View>
          {activeCount > 0 && <View style={styles.pickupBadge}><Text style={styles.pickupBadgeText}>{activeCount}</Text></View>}
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.key}
              onPress={() => navigation.navigate(a.key)}
              activeOpacity={0.82}
              style={styles.actionTile}
            >
              <LinearGradient colors={a.colors} style={styles.actionCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.actionIconWrap}>
                  <Ionicons name={a.icon} size={28} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.6)" style={{ alignSelf: 'flex-end' }} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Classes */}
        <Text style={styles.sectionTitle}>My Classes</Text>
        <View style={styles.classesWrap}>
          {myClasses.map((cls, i) => {
            const count = STUDENTS.filter((s) => s.class === cls).length;
            const gradients = [['#1D4ED8', '#3B82F6'], ['#059669', '#10B981'], ['#7C3AED', '#8B5CF6']];
            return (
              <View key={cls} style={styles.classRow}>
                <LinearGradient colors={gradients[i % gradients.length]} style={styles.classBadge}>
                  <Text style={styles.classBadgeText}>{cls}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.classCountText}>{count} students enrolled</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MarkAttendance')}
                  style={styles.classActionBtn}
                >
                  <Text style={styles.classActionText}>Attendance</Text>
                  <Ionicons name="chevron-forward" size={12} color={COLORS.primaryMid} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcoming.map((e) => (
              <View key={e.id} style={styles.eventCard}>
                <LinearGradient colors={['#D97706', '#F59E0B']} style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{new Date(e.date).getDate()}</Text>
                  <Text style={styles.eventMonth}>{new Date(e.date).toLocaleString('en', { month: 'short' })}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <Text style={styles.eventType}>{e.type || 'School Event'}</Text>
                </View>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textMuted} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  headerTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.lg },
  greeting: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.65)', fontWeight: FONTS.weights.medium },
  userName: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF', marginTop: 2 },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.4)',
  },
  roleText: { fontSize: FONTS.sizes.xs, color: '#F59E0B', fontWeight: FONTS.weights.semibold },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#F59E0B', borderRadius: 9,
    minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: { fontSize: 9, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 4 },
  statNum: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  statLabel: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  body: { padding: SPACING.md },
  sectionTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold,
    color: COLORS.text, marginBottom: SPACING.sm + 2, marginTop: SPACING.sm,
  },

  pickupBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.sm + 2, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: '#D1FAE5', borderLeftWidth: 4, borderLeftColor: '#0F766E' },
  pickupIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center' },
  pickupTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  pickupSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  pickupBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.warning, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  pickupBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  actionTile: { width: CARD_W, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.md },
  actionCard: { padding: SPACING.md, gap: SPACING.sm, borderRadius: RADIUS.md, minHeight: 120 },
  actionIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: {
    flex: 1, fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold, color: '#FFF', lineHeight: 20,
  },

  classesWrap: { gap: SPACING.sm, marginBottom: SPACING.sm },
  classRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.md,
    padding: SPACING.sm + 2, gap: SPACING.sm,
    ...SHADOW.sm,
  },
  classBadge: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  classBadgeText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  classCountText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: FONTS.weights.medium },
  classActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EBF4FF', paddingHorizontal: SPACING.sm,
    paddingVertical: 6, borderRadius: RADIUS.full,
  },
  classActionText: { fontSize: 11, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },

  eventCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.md,
    marginBottom: SPACING.sm, overflow: 'hidden',
    gap: SPACING.sm + 4, ...SHADOW.sm,
  },
  eventDateBox: {
    width: 56, alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  eventDay: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: '#FFF', lineHeight: 24 },
  eventMonth: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.85)', fontWeight: FONTS.weights.bold, textTransform: 'uppercase' },
  eventTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  eventType: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
});
