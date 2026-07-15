import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useFees } from '../../context/FeesContext';
import { usePickup } from '../../context/PickupContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, SCREEN_WIDTH } from '../../constants/theme';
import { SCHOOL_NAME } from '../../constants/branding';
import { SCHOOL_STATS, ALL_PARENTS } from '../../constants/mockData';
import UpcomingBirthdaysBanner from '../../components/UpcomingBirthdaysBanner';

const COL3 = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm * 2) / 3;

const ACTIONS = [
  { key: 'BestStudentsAdmin',label:'Best\nStudents',   icon: 'trophy',       colors: ['#D97706', '#F59E0B'] },
  { key: 'BroadcastAdmin',  label: 'Send\nBroadcast',  icon: 'megaphone',    colors: ['#059669', '#10B981'] },
  { key: 'CalendarAdmin',   label: 'Manage\nCalendar', icon: 'calendar',     colors: ['#0F766E', '#14B8A6'] },
  { key: 'GalleryAdmin',    label: 'Manage\nGallery',  icon: 'images',       colors: ['#C2410C', '#F97316'] },
];

const SYSTEM_ROWS = [
  { label: 'Total Classes',       icon: 'library',      key: 'classCount' },
  { label: 'Total Students',      icon: 'people',       key: 'totalStudents' },
  { label: 'Attendance Today',    icon: 'checkmark-done',key: 'attendanceToday' },
];

export default function AdminHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { pendingCount } = useFees();
  const { activeCount } = usePickup();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient
        colors={['#0C1B33', '#1A3A6B']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        {/* Admin header row */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.adminBadge}>
              <Ionicons name="settings" size={12} color="#F59E0B" />
              <Text style={styles.adminBadgeText}>Admin Panel</Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
            <Text style={styles.schoolName}>{SCHOOL_NAME}</Text>
          </View>
          <LinearGradient colors={['rgba(245,158,11,0.25)', 'rgba(245,158,11,0.05)']} style={styles.adminIconWrap}>
            <Ionicons name="settings" size={30} color="#F59E0B" />
          </LinearGradient>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {[
            { label: 'Students', value: SCHOOL_STATS.totalStudents, icon: 'people' },
            { label: 'Teachers', value: SCHOOL_STATS.totalTeachers, icon: 'book' },
            { label: 'Parents',  value: SCHOOL_STATS.totalParents,  icon: 'home' },
            { label: 'Present',  value: SCHOOL_STATS.attendanceToday, icon: 'checkmark-circle' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statBox}>
                <Ionicons name={s.icon} size={13} color="rgba(255,255,255,0.6)" style={{ marginBottom: 3 }} />
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
        {/* Parent directory card */}
        <View style={styles.alertsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ManageParents')}
            activeOpacity={0.85}
            style={styles.alertTile}
          >
            <LinearGradient
              colors={['#7C3AED', '#8B5CF6']}
              style={styles.alertCard}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Ionicons name="people" size={22} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertStatus}>Parent Directory</Text>
                <Text style={styles.alertValue}>{ALL_PARENTS.length} Parents · View & chat</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Fee payment confirmations */}
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentConfirmations')}
          activeOpacity={0.85}
          style={{ marginBottom: SPACING.md }}
        >
          <LinearGradient colors={['#1D4ED8', '#3B82F6']} style={styles.alertCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="cash" size={22} color="#FFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertStatus}>Fee Payment Confirmations</Text>
              <Text style={styles.alertValue}>{pendingCount > 0 ? `${pendingCount} awaiting review` : 'All caught up'}</Text>
            </View>
            {pendingCount > 0 && (
              <View style={styles.payBadge}><Text style={styles.payBadgeText}>{pendingCount}</Text></View>
            )}
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        <UpcomingBirthdaysBanner />

        {/* Third-party pickup alerts */}
        <TouchableOpacity
          onPress={() => navigation.navigate('PickupAlerts')}
          activeOpacity={0.85}
          style={{ marginBottom: SPACING.md }}
        >
          <LinearGradient colors={['#0F766E', '#14B8A6']} style={styles.alertCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="car-sport" size={22} color="#FFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertStatus}>3rd Party Pickup Alerts</Text>
              <Text style={styles.alertValue}>{activeCount > 0 ? `${activeCount} awaiting verification` : 'No active alerts'}</Text>
            </View>
            {activeCount > 0 && (
              <View style={styles.payBadge}><Text style={styles.payBadgeText}>{activeCount}</Text></View>
            )}
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Admin Actions */}
        <Text style={styles.sectionTitle}>Admin Actions</Text>
        <View style={styles.actionsGrid}>
          {ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.key}
              onPress={() => navigation.navigate(a.key)}
              activeOpacity={0.82}
              style={styles.actionTile}
            >
              <LinearGradient colors={a.colors} style={styles.actionCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.actionIconWrap}>
                  <Ionicons name={a.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* System Overview */}
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.systemCard}>
          {SYSTEM_ROWS.map((row, i) => (
            <View key={row.label} style={[styles.infoRow, i < SYSTEM_ROWS.length - 1 && styles.infoRowBorder]}>
              <View style={styles.infoLeft}>
                <LinearGradient colors={['#1A3A6B', '#2563EB']} style={styles.infoIconWrap}>
                  <Ionicons name={row.icon} size={14} color="#FFF" />
                </LinearGradient>
                <Text style={styles.infoLabel}>{row.label}</Text>
              </View>
              <Text style={styles.infoVal}>{SCHOOL_STATS[row.key]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.lg },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6,
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.35)',
  },
  adminBadgeText: { fontSize: FONTS.sizes.xs, color: '#F59E0B', fontWeight: FONTS.weights.extrabold, letterSpacing: 0.5 },
  userName: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  schoolName: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  adminIconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md, paddingVertical: SPACING.sm + 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 4 },
  statNum: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  body: { padding: SPACING.md },
  sectionTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold,
    color: COLORS.text, marginBottom: SPACING.sm + 2, marginTop: SPACING.xs,
  },

  alertsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  alertTile: { flex: 1, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.md },
  alertCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, gap: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  alertStatus: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.75)', fontWeight: FONTS.weights.semibold },
  alertValue: { fontSize: FONTS.sizes.md, color: '#FFF', fontWeight: FONTS.weights.extrabold },
  payBadge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  payBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  actionTile: { width: COL3, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.md },
  actionCard: {
    alignItems: 'center', paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xs, gap: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  actionIconWrap: {
    width: 52, height: 52, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: {
    fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold,
    color: '#FFF', textAlign: 'center', lineHeight: 16,
  },

  systemCard: {
    backgroundColor: '#FFF', borderRadius: RADIUS.md,
    overflow: 'hidden', ...SHADOW.sm,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.md,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  infoIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: FONTS.weights.medium },
  infoVal: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: COLORS.primaryMid },
});
