import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { usePickup } from '../../context/PickupContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, SCREEN_WIDTH } from '../../constants/theme';
import { SCHOOL_NAME } from '../../constants/branding';
import { SCHOOL_STATS, BEST_STUDENTS, BROADCASTS } from '../../constants/mockData';
import UpcomingBirthdaysBanner from '../../components/UpcomingBirthdaysBanner';

const CARD_W = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / 2;

const ACTIONS = [
  { key: 'Broadcast',       label: 'Send\nBroadcast',    icon: 'megaphone',        colors: ['#1D4ED8', '#3B82F6'] },
  { key: 'ManageParents',   label: 'Parent\nDirectory',  icon: 'people',           colors: ['#7C3AED', '#8B5CF6'] },
  { key: 'BestStudents',    label: 'Best\nStudents',     icon: 'trophy',           colors: ['#D97706', '#F59E0B'] },
  { key: 'EmergencyAlert',  label: 'Emergency\nAlert',   icon: 'warning',          colors: ['#B91C1C', '#EF4444'] },
  { key: 'AuthorityCalendar',label:'School\nCalendar',   icon: 'calendar',         colors: ['#059669', '#10B981'] },
];

const MEDAL_COLORS = ['#D97706', '#94A3B8', '#92400E'];
const MEDAL_ICONS = ['trophy', 'medal', 'medal'];

export default function AuthorityHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { activeCount } = usePickup();

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
            <View style={styles.authorityBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#F59E0B" />
              <Text style={styles.authorityLabel}>School Authority</Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
            <Text style={styles.position}>{user.position || 'Principal'} · {SCHOOL_NAME}</Text>
          </View>
          <View style={styles.shieldWrap}>
            <LinearGradient colors={['rgba(245,158,11,0.25)', 'rgba(245,158,11,0.05)']} style={styles.shieldGrad}>
              <Ionicons name="shield-checkmark" size={36} color="#F59E0B" />
            </LinearGradient>
          </View>
        </View>

        {/* School stats */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'people',      label: 'Students',  value: SCHOOL_STATS.totalStudents },
            { icon: 'book',        label: 'Teachers',  value: SCHOOL_STATS.totalTeachers },
            { icon: 'home',        label: 'Parents',   value: SCHOOL_STATS.totalParents },
            { icon: 'checkmark-circle', label: 'Present', value: SCHOOL_STATS.attendanceToday },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statBox}>
                <Ionicons name={s.icon} size={14} color="rgba(255,255,255,0.6)" style={{ marginBottom: 4 }} />
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
          {ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.key}
              onPress={() => navigation.navigate(a.key)}
              activeOpacity={0.82}
              style={styles.actionTile}
            >
              <LinearGradient colors={a.colors} style={styles.actionCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.actionIconWrap}>
                  <Ionicons name={a.icon} size={30} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.55)" style={{ alignSelf: 'flex-end' }} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Broadcasts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Broadcasts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Broadcast')}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>
        {BROADCASTS.slice(0, 3).map((b) => {
          const isHigh = b.priority === 'high';
          return (
            <View key={b.id} style={styles.broadcastRow}>
              <LinearGradient
                colors={isHigh ? ['#B91C1C', '#EF4444'] : ['#1D4ED8', '#3B82F6']}
                style={styles.broadcastIcon}
              >
                <Ionicons name="megaphone" size={16} color="#FFF" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.broadcastTitle} numberOfLines={1}>{b.title}</Text>
                <Text style={styles.broadcastMeta}>
                  {b.from} · {new Date(b.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              {isHigh && (
                <View style={styles.highPriorityTag}>
                  <Text style={styles.highPriorityText}>HIGH</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Top Students */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Top Students This Term</Text>
        {BEST_STUDENTS.slice(0, 3).map((s, i) => (
          <View key={s.id} style={styles.studentRow}>
            <LinearGradient
              colors={i === 0 ? ['#D97706', '#F59E0B'] : i === 1 ? ['#64748B', '#94A3B8'] : ['#92400E', '#B45309']}
              style={styles.rankBadge}
            >
              <Ionicons name={MEDAL_ICONS[i]} size={16} color="#FFF" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{s.studentName}</Text>
              <Text style={styles.studentMeta}>{s.class} · {s.category}</Text>
            </View>
            {s.score && (
              <View style={styles.scoreChip}>
                <Text style={styles.scoreText}>{s.score}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  headerTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.lg },
  authorityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6,
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.35)',
  },
  authorityLabel: { fontSize: FONTS.sizes.xs, color: '#F59E0B', fontWeight: FONTS.weights.bold },
  userName: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  position: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontWeight: FONTS.weights.medium },
  shieldWrap: {},
  shieldGrad: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },

  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md, paddingVertical: SPACING.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 4 },
  statNum: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  body: { padding: SPACING.md },
  sectionTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold,
    color: COLORS.text, marginBottom: SPACING.sm + 2,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  seeAll: { fontSize: FONTS.sizes.sm, color: COLORS.primaryMid, fontWeight: FONTS.weights.bold },

  pickupBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.sm + 2, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: '#D1FAE5', borderLeftWidth: 4, borderLeftColor: '#0F766E' },
  pickupIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center' },
  pickupTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  pickupSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  pickupBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.warning, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  pickupBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  actionTile: { width: CARD_W, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.md },
  actionCard: { padding: SPACING.md, gap: SPACING.sm, borderRadius: RADIUS.md, minHeight: 130 },
  actionIconWrap: {
    width: 58, height: 58, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF', lineHeight: 20 },

  broadcastRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.md,
    padding: SPACING.sm + 2, marginBottom: SPACING.sm,
    gap: SPACING.sm, ...SHADOW.sm,
  },
  broadcastIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  broadcastTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text },
  broadcastMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  highPriorityTag: {
    backgroundColor: '#FEE2E2', paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: RADIUS.full,
  },
  highPriorityText: { fontSize: 9, fontWeight: FONTS.weights.extrabold, color: '#B91C1C', letterSpacing: 0.5 },

  studentRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: RADIUS.md,
    padding: SPACING.sm + 2, marginBottom: SPACING.sm,
    gap: SPACING.sm, ...SHADOW.sm,
  },
  rankBadge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  studentName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text },
  studentMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  scoreChip: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: RADIUS.full,
  },
  scoreText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: '#059669' },
});
