import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useAvatarPicker } from '../../hooks/useAvatarPicker';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { APP_NAME, SCHOOL_NAME, APP_VERSION } from '../../constants/branding';
import { STUDENT_ATTENDANCE_SUMMARY, STUDENT_MARKS } from '../../constants/mockData';

export default function StudentProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const chooseAvatar = useAvatarPicker();

  const overall = Math.round(
    STUDENT_MARKS.reduce((a, m) => a + (m.score / m.maxScore) * 100, 0) / STUDENT_MARKS.length
  );

  const STATS = [
    { label: 'Average', value: `${overall}%`, icon: 'ribbon', color: '#059669' },
    { label: 'Attendance', value: `${STUDENT_ATTENDANCE_SUMMARY.percentage}%`, icon: 'calendar', color: '#2563EB' },
    { label: 'Class', value: user.class, icon: 'school', color: '#7C3AED' },
  ];

  const MENU_ITEMS = [
    { icon: 'person-outline', label: 'Edit Profile', color: COLORS.primary, onPress: () => navigation.navigate('EditProfile') },
    { icon: 'calendar-number-outline', label: 'My Timetable', color: COLORS.primary, onPress: () => navigation.navigate('Timetable') },
    { icon: 'folder-open-outline', label: 'Learning Resources', color: COLORS.primary, onPress: () => navigation.navigate('Resources') },
    { icon: 'notifications-outline', label: 'Notification Settings', color: COLORS.primary, onPress: () => navigation.navigate('NotificationSettings') },
    { icon: 'help-circle-outline', label: 'Help & Support', color: COLORS.primary, onPress: () => navigation.navigate('HelpSupport') },
    { icon: 'log-out-outline', label: 'Sign Out', color: COLORS.error, onPress: () => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Sign Out', style: 'destructive', onPress: logout }]) },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={chooseAvatar} activeOpacity={0.8} style={styles.avatarCircle}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>Student • {SCHOOL_NAME}</Text>
        <Text style={styles.userEmail}>{user.admissionNo}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} onPress={item.onPress} style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuRowBorder]} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: item.color === COLORS.error ? COLORS.error : COLORS.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.appVersion}>{APP_NAME} v{APP_VERSION} • {SCHOOL_NAME}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingBottom: SPACING.xl },
  avatarCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm, borderWidth: 3, borderColor: '#FFF' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 42 },
  avatarText: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.primary },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: '#FFF' },
  userRole: { fontSize: FONTS.sizes.sm, color: COLORS.secondary, marginTop: 2 },
  userEmail: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  body: { padding: SPACING.md },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: -SPACING.lg - SPACING.sm },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', ...SHADOW.md },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 1 },

  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  menuCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.sm, marginBottom: SPACING.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.medium },
  appVersion: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.sm },
});
