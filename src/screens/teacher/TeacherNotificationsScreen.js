import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { BROADCASTS } from '../../constants/mockData';

export default function TeacherNotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.intro}>School announcements from the administration.</Text>
        {BROADCASTS.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>You have no notifications.</Text>
          </View>
        ) : (
          BROADCASTS.map((b) => {
            const isHigh = b.priority === 'high';
            return (
              <View key={b.id} style={[styles.card, { borderLeftColor: isHigh ? COLORS.error : COLORS.primary }]}>
                <View style={styles.cardTop}>
                  <View style={[styles.chip, { backgroundColor: isHigh ? '#FDEDEC' : '#EBF2FF' }]}>
                    <Ionicons name="megaphone" size={13} color={isHigh ? COLORS.error : COLORS.primary} />
                    <Text style={[styles.chipText, { color: isHigh ? COLORS.error : COLORS.primary }]}>
                      {isHigh ? 'Urgent' : 'Announcement'}
                    </Text>
                  </View>
                  <Text style={styles.date}>{new Date(b.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</Text>
                </View>
                <Text style={styles.title}>{b.title}</Text>
                <Text style={styles.from}>From: {b.from} • {b.fromTitle}</Text>
                <Text style={styles.message}>{b.message}</Text>
              </View>
            );
          })
        )}
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
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 4, ...SHADOW.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  chipText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
  date: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  from: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 4 },
  message: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
});
