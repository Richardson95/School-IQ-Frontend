import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, SCREEN_WIDTH } from '../../constants/theme';
import {
  STUDENT_ASSIGNMENTS, STUDENT_TESTS, STUDENT_LIVE_CLASSES,
  STUDENT_MARKS, STUDENT_ATTENDANCE_SUMMARY, BROADCASTS,
} from '../../constants/mockData';
import UpcomingBirthdaysBanner from '../../components/UpcomingBirthdaysBanner';

const CARD_W = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / 2;

const FEATURES = [
  { key: 'Assignments',  label: 'Assignments',   icon: 'clipboard',       iconColor: '#2563EB', bg: '#EFF6FF', tab: 'Assignments' },
  { key: 'TestsExams',   label: 'Tests & Exams', icon: 'create',          iconColor: '#DC2626', bg: '#FEF2F2' },
  { key: 'LiveClasses',  label: 'Live Classes',  icon: 'videocam',        iconColor: '#7C3AED', bg: '#F5F3FF', tab: 'Classes' },
  { key: 'Grades',       label: 'My Grades',     icon: 'ribbon',          iconColor: '#059669', bg: '#F0FDF4', tab: 'Grades' },
  { key: 'TopicsNotes',  label: 'Topics & Notes',icon: 'book',            iconColor: '#D97706', bg: '#FFFBEB' },
  { key: 'ClassNotes',   label: 'Class Notes',   icon: 'mic',             iconColor: '#DB2777', bg: '#FDF2F8' },
  { key: 'NotesQuiz',    label: 'Practice CBT',  icon: 'sparkles',        iconColor: '#7C3AED', bg: '#F5F3FF' },
  { key: 'Timetable',    label: 'Timetable',     icon: 'calendar-number', iconColor: '#0F766E', bg: '#ECFDF5' },
  { key: 'Resources',    label: 'Resources',     icon: 'folder-open',     iconColor: '#EA580C', bg: '#FFF7ED' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function StudentHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const pending = STUDENT_ASSIGNMENTS.filter((a) => a.status === 'pending').length;
  const availableTests = STUDENT_TESTS.filter((t) => t.status === 'available').length;
  const liveNow = STUDENT_LIVE_CLASSES.find((c) => c.status === 'live');
  const recentMarks = STUDENT_MARKS.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
            <Text style={styles.userMeta}>{user.class} • {user.admissionNo}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{pending}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{availableTests}</Text>
            <Text style={styles.statLabel}>Open Tests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{STUDENT_ATTENDANCE_SUMMARY.percentage}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {/* Live class banner */}
        {liveNow && (
          <TouchableOpacity onPress={() => navigation.navigate('Classes')} activeOpacity={0.9} style={styles.liveBanner}>
            <View style={styles.liveDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.liveTitle}>LIVE NOW · {liveNow.subject}</Text>
              <Text style={styles.liveSub} numberOfLines={1}>{liveNow.title} — {liveNow.teacher}</Text>
            </View>
            <View style={styles.joinPill}>
              <Ionicons name="videocam" size={14} color="#FFF" />
              <Text style={styles.joinPillText}>Join</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Broadcast banner */}
        {BROADCASTS.length > 0 && (
          <View style={styles.broadcastBanner}>
            <View style={styles.broadcastIconWrap}>
              <Ionicons name="megaphone" size={16} color="#2563EB" />
            </View>
            <Text style={styles.broadcastText} numberOfLines={1}>{BROADCASTS[0].title}</Text>
          </View>
        )}

        <UpcomingBirthdaysBanner />

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => f.tab ? navigation.navigate(f.tab) : navigation.navigate(f.key)}
              activeOpacity={0.78}
              style={styles.featureCard}
            >
              <View style={[styles.iconCircle, { backgroundColor: f.bg }]}>
                <Ionicons name={f.icon} size={26} color={f.iconColor} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent grades */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Grades</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Grades')}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>
        {recentMarks.map((m) => {
          const pct = Math.round((m.score / m.maxScore) * 100);
          return (
            <View key={m.id} style={styles.markCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.markSubject}>{m.subject}</Text>
                <Text style={styles.markMeta}>{m.assessment} · {m.type}</Text>
              </View>
              <View style={[styles.scoreBox, { backgroundColor: pct >= 70 ? '#ECFDF5' : pct >= 50 ? '#FFFBEB' : '#FEF2F2' }]}>
                <Text style={[styles.scoreNum, { color: pct >= 70 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626' }]}>{m.score}/{m.maxScore}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  greeting: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.65)' },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: '#FFF', marginTop: 2 },
  userMeta: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: RADIUS.md, paddingVertical: SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  statNum: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  statLabel: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  body: { padding: SPACING.md },

  liveBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7C3AED', borderRadius: RADIUS.md, padding: SPACING.sm + 2, marginBottom: SPACING.md, gap: SPACING.sm, ...SHADOW.md },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FCA5A5' },
  liveTitle: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold, color: '#FFF', letterSpacing: 0.5 },
  liveSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  joinPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6 },
  joinPillText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#FFF' },

  broadcastBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.md, gap: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#E0EAFF' },
  broadcastIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  broadcastText: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.primaryMid },

  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginBottom: SPACING.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md, marginBottom: SPACING.sm },
  seeAll: { fontSize: FONTS.sizes.sm, color: COLORS.primaryMid, fontWeight: FONTS.weights.bold },

  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  featureCard: { width: CARD_W, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  iconCircle: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },

  markCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  markSubject: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  markMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2, textTransform: 'capitalize' },
  scoreBox: { borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  scoreNum: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },
});
