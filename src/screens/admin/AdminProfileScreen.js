import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { APP_NAME, SCHOOL_NAME, APP_VERSION } from '../../constants/branding';

export default function AdminProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const ITEMS = [
    { icon: 'person-outline', label: 'Edit Profile', color: COLORS.primary },
    { icon: 'school-outline', label: 'School Settings', color: COLORS.primary },
    { icon: 'people-outline', label: 'Manage Users', color: COLORS.primary },
    { icon: 'bar-chart-outline', label: 'System Reports', color: COLORS.primary },
    { icon: 'notifications-outline', label: 'Notification Settings', color: COLORS.primary, onPress: () => navigation.navigate('NotificationSettings') },
    { icon: 'shield-outline', label: 'Security Settings', color: COLORS.primary },
    { icon: 'help-circle-outline', label: 'Help & Support', color: COLORS.primary },
    { icon: 'log-out-outline', label: 'Sign Out', color: COLORS.error, onPress: () => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Sign Out', style: 'destructive', onPress: logout }]) },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.avatarCircle}>
          <Ionicons name="settings" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>School Administrator • {SCHOOL_NAME}</Text>
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
  userName: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: '#FFF' },
  userRole: { fontSize: FONTS.sizes.sm, color: COLORS.secondary, marginTop: 2 },
  body: { padding: SPACING.md },
  menuCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.medium, color: COLORS.text },
  appVersion: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.lg },
});
