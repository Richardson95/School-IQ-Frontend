import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENT_TOPICS } from '../../constants/mockData';

const FILTERS = ['All', 'Completed', 'Missed'];

export default function TopicsNotesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);

  const visible = filter === 'All' ? STUDENT_TOPICS : STUDENT_TOPICS.filter((t) => t.status === filter.toLowerCase());
  const missedCount = STUDENT_TOPICS.filter((t) => t.status === 'missed').length;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Topics & Notes</Text>
        <Text style={styles.headerSub}>Everything covered this term — tap to read class notes</Text>
      </LinearGradient>

      {missedCount > 0 && (
        <View style={styles.alert}>
          <Ionicons name="alert-circle" size={18} color="#D97706" />
          <Text style={styles.alertText}>You missed {missedCount} topic(s). Catch up using the notes below.</Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {visible.map((t) => {
          const isOpen = open === t.id;
          const missed = t.status === 'missed';
          return (
            <TouchableOpacity key={t.id} activeOpacity={0.9} onPress={() => setOpen(isOpen ? null : t.id)} style={[styles.card, missed && styles.cardMissed]}>
              <View style={styles.cardTop}>
                <View style={[styles.statusDot, { backgroundColor: missed ? '#D97706' : '#059669' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{t.subject} · {t.week}</Text>
                  <Text style={styles.topic}>{t.topic}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: missed ? '#FFFBEB' : '#ECFDF5' }]}>
                  <Text style={[styles.tagText, { color: missed ? '#D97706' : '#059669' }]}>{missed ? 'Missed' : 'Done'}</Text>
                </View>
                <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} style={{ marginLeft: 6 }} />
              </View>
              {isOpen && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Class Notes</Text>
                  <Text style={styles.notes}>{t.notes}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  alert: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFBEB', marginHorizontal: SPACING.md, marginTop: SPACING.md, padding: SPACING.sm + 2, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: '#FDE68A' },
  alertText: { flex: 1, fontSize: FONTS.sizes.xs, color: '#92400E', fontWeight: FONTS.weights.semibold },

  filterRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  filterText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },

  body: { paddingHorizontal: SPACING.md },
  card: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  cardMissed: { borderLeftWidth: 4, borderLeftColor: '#D97706' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  subject: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  topic: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 1 },
  tag: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  notesBox: { marginTop: SPACING.md, backgroundColor: '#F8FAFC', borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1, borderColor: '#EEF2F7' },
  notesLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  notes: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 21 },
});
