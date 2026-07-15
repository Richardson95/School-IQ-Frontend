import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { STUDENTS } from '../constants/mockData';
import { birthdaysToday, upcomingBirthdays, birthdayWhen, turningAge } from '../utils/birthdays';

/**
 * Broadcasts student birthdays on every home screen: the run-up starts 3 days
 * before (upcoming) and the birthday itself is highlighted as "Today". Returns
 * null when there is nothing to show.
 */
export default function UpcomingBirthdaysBanner() {
  const today = birthdaysToday(STUDENTS);
  const upcoming = upcomingBirthdays(STUDENTS, 3);
  const list = [...today, ...upcoming];
  if (list.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="gift" size={16} color={COLORS.gold} />
        <Text style={styles.title}>Birthdays</Text>
      </View>
      {list.map((s) => {
        const initials = s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
        const isToday = today.includes(s);
        const age = turningAge(s.dob);
        return (
          <View key={s.id} style={styles.row}>
            <View style={[styles.avatar, isToday && styles.avatarToday]}>
              <Text style={styles.avatarText}>{initials}</Text>
              {isToday && <Text style={styles.cake}>🎂</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.meta}>{s.class}{age ? ` · turning ${age}` : ''}</Text>
            </View>
            <View style={[styles.pill, isToday ? styles.pillToday : styles.pillSoon]}>
              <Text style={[styles.pillText, isToday && { color: '#FFF' }]}>{isToday ? '🎉 Today' : birthdayWhen(s.dob)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: '#FDE68A' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 6 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarToday: { backgroundColor: COLORS.gold },
  avatarText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  cake: { position: 'absolute', top: -8, right: -6, fontSize: 16 },
  name: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 1 },
  pill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  pillToday: { backgroundColor: COLORS.goldDark },
  pillSoon: { backgroundColor: COLORS.warningLight },
  pillText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.warning },
});
