import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { BEST_STUDENTS, BEST_STUDENT_CATEGORIES } from '../../constants/mockData';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function BestStudentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState('Best Academic Student');
  const filtered = BEST_STUDENTS.filter((s) => s.category === category).sort((a, b) => a.position - b.position);
  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Best Students</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catBar} contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingVertical: SPACING.sm }}>
        {BEST_STUDENT_CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.catChip, category === cat && styles.catChipActive]}>
            <Text style={[styles.catText, category === cat && styles.catTextActive]} numberOfLines={1}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.termInfo}>1st Term • 2025/2026 Session</Text>

        {top3.length > 0 && (
          <View style={styles.podium}>
            {[1, 0, 2].map((idx) => {
              const s = top3[idx];
              if (!s) return <View key={idx} style={{ flex: 1 }} />;
              const isFirst = s.position === 1;
              return (
                <View key={s.id} style={[styles.podiumItem, isFirst && styles.podiumItemFirst]}>
                  <View style={[styles.podiumAvatar, { borderColor: MEDAL_COLORS[s.position - 1] }]}>
                    <Text style={styles.podiumAvatarText}>{s.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
                  </View>
                  <View style={[styles.medal, { backgroundColor: MEDAL_COLORS[s.position - 1] }]}>
                    <Ionicons name="trophy" size={14} color="#FFF" />
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{s.studentName.split(' ')[0]}</Text>
                  <Text style={styles.podiumClass}>{s.class}</Text>
                  {s.score && <Text style={styles.podiumScore}>{s.score}</Text>}
                  <View style={[styles.podiumBase, { height: isFirst ? 70 : idx === 1 ? 50 : 40, backgroundColor: MEDAL_COLORS[s.position - 1] + '30', borderTopLeftRadius: 8, borderTopRightRadius: 8 }]}>
                    <Text style={[styles.podiumPosition, { color: MEDAL_COLORS[s.position - 1] }]}>{s.position}{s.position === 1 ? 'st' : s.position === 2 ? 'nd' : 'rd'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={52} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No records in this category yet.</Text>
          </View>
        )}

        {rest.map((s) => (
          <View key={s.id} style={styles.listRow}>
            <View style={styles.listRank}><Text style={styles.listRankText}>{s.position}</Text></View>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{s.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listName}>{s.studentName}</Text>
              <Text style={styles.listClass}>{s.class}</Text>
            </View>
            {s.score && <Text style={styles.listScore}>{s.score}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  catBar: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  catChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.background },
  catChipActive: { backgroundColor: COLORS.primary },
  catText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: FONTS.weights.medium },
  catTextActive: { color: '#FFF', fontWeight: FONTS.weights.bold },
  body: { padding: SPACING.md },
  categoryTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: COLORS.text, textAlign: 'center' },
  termInfo: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  podiumItem: { flex: 1, alignItems: 'center' },
  podiumItemFirst: { marginBottom: 10 },
  podiumAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 4 },
  podiumAvatarText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  medal: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: -14, marginBottom: 4, borderWidth: 2, borderColor: '#FFF' },
  podiumName: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.text, textAlign: 'center' },
  podiumClass: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  podiumScore: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: '#27AE60', textAlign: 'center' },
  podiumBase: { width: '100%', marginTop: 6, alignItems: 'center', justifyContent: 'center' },
  podiumPosition: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold },
  empty: { alignItems: 'center', paddingTop: 40, gap: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textMuted },
  listRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.xs, gap: SPACING.md, ...SHADOW.sm },
  listRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  listRankText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primary },
  listAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  listAvatarText: { fontSize: 13, fontWeight: FONTS.weights.bold, color: '#FFF' },
  listName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text },
  listClass: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  listScore: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#27AE60' },
});
