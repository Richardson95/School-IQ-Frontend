import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useAvatarPicker } from '../../hooks/useAvatarPicker';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { APP_NAME, SCHOOL_NAME, APP_VERSION } from '../../constants/branding';

export default function TeacherProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const chooseAvatar = useAvatarPicker();

  const ITEMS = [
    { icon: 'person-outline', label: 'Edit Profile', color: COLORS.primary, onPress: () => navigation.navigate('EditProfile') },
    { icon: 'book-outline', label: 'My Subjects', color: COLORS.primary, onPress: () => navigation.navigate('MySubjects') },
    { icon: 'people-outline', label: 'My Classes', color: COLORS.primary, onPress: () => navigation.navigate('MyClasses') },
    { icon: 'folder-open-outline', label: 'Assignment Submissions', color: COLORS.primary, onPress: () => navigation.navigate('AssignmentSubmissions') },
    { icon: 'videocam-outline', label: 'Live Classes', color: COLORS.primary, onPress: () => navigation.navigate('TeacherLiveClass') },
    { icon: 'mic-outline', label: 'Class Voice Notes', color: COLORS.primary, onPress: () => navigation.navigate('VoiceNotes') },
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
        <Text style={styles.userRole}>Teacher • {SCHOOL_NAME}</Text>
        <View style={styles.subjectsRow}>
          {(user.subjects || []).map((s) => (
            <View key={s} style={styles.subjectChip}><Text style={styles.subjectChipText}>{s}</Text></View>
          ))}
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.menuCard}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity key={i} onPress={item.onPress} style={[styles.menuRow, i < ITEMS.length - 1 && styles.menuRowBorder]} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, item.color === COLORS.error && { color: COLORS.error }]}>{item.label}</Text>
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
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  avatarText: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.primary },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: '#FFF' },
  userRole: { fontSize: FONTS.sizes.sm, color: COLORS.secondary, marginTop: 2 },
  subjectsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, flexWrap: 'wrap', justifyContent: 'center' },
  subjectChip: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  subjectChipText: { fontSize: FONTS.sizes.xs, color: '#FFF', fontWeight: FONTS.weights.medium },
  body: { padding: SPACING.md },
  menuCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.medium, color: COLORS.text },
  appVersion: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.lg },
});
