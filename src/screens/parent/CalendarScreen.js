import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { CALENDAR_EVENTS } from '../../constants/mockData';

const TYPE_CFG = {
  resumption: { label: 'Resumption', color: '#27AE60', bg: '#E8F8EE', icon: 'school' },
  exam: { label: 'Exam', color: '#E74C3C', bg: '#FDEDEC', icon: 'pencil' },
  holiday: { label: 'Holiday', color: '#F39C12', bg: '#FEF9E7', icon: 'sunny' },
  activity: { label: 'Activity', color: '#2980B9', bg: '#EBF5FB', icon: 'ribbon' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const today = new Date();

  const sorted = [...CALENDAR_EVENTS]
    .filter((e) => filter === 'all' || e.type === filter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = sorted.filter((e) => new Date(e.date) >= today);
  const past = sorted.filter((e) => new Date(e.date) < today);

  const EventCard = ({ event }) => {
    const cfg = TYPE_CFG[event.type] || TYPE_CFG.activity;
    const d = new Date(event.date);
    const isPast = d < today;
    return (
      <View style={[styles.eventCard, isPast && { opacity: 0.6 }]}>
        <View style={[styles.dateBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.dateDay, { color: cfg.color }]}>{d.getDate()}</Text>
          <Text style={[styles.dateMon, { color: cfg.color }]}>{MONTHS[d.getMonth()]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.eventTopRow}>
            <View style={[styles.typeChip, { backgroundColor: cfg.bg }]}>
              <Ionicons name={cfg.icon} size={11} color={cfg.color} />
              <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
            {!isPast && <View style={styles.upcomingDot} />}
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
          {event.classes[0] !== 'All' && (
            <Text style={styles.classesText}>Classes: {event.classes.join(', ')}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>School Calendar</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: 10, paddingVertical: 10 }}>
        {[['all', 'All Events'], ['exam', 'Exams'], ['resumption', 'Resumption'], ['holiday', 'Holidays'], ['activity', 'Activities']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setFilter(key)} style={[styles.filterChip, filter === key && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {upcoming.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </>
        )}
        {past.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Past Events</Text>
            {past.map((e) => <EventCard key={e.id} event={e} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  filterBar: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: FONTS.weights.semibold },
  filterTextActive: { color: '#FFF', fontWeight: FONTS.weights.bold },
  body: { padding: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  eventCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md, ...SHADOW.sm },
  dateBadge: { width: 52, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.sm },
  dateDay: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, lineHeight: 28 },
  dateMon: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, textTransform: 'uppercase' },
  eventTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  typeText: { fontSize: 10, fontWeight: FONTS.weights.bold },
  upcomingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ECC71' },
  eventTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  eventDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 18, marginTop: 2 },
  classesText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: FONTS.weights.medium, marginTop: 4 },
});
