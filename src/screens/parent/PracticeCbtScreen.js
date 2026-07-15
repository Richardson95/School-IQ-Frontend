import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useCbt } from '../../context/CbtContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { ratingFor } from '../../utils/notesQuiz';
import { downloadText, cbtResultToText } from '../../utils/download';

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PracticeCbtScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { resultsForChildren } = useCbt();
  const results = resultsForChildren(user.childrenIds || []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice CBT</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.noteBanner}>
          <Ionicons name="information-circle" size={18} color={COLORS.primaryMid} />
          <Text style={styles.noteText}>
            These are self-practice quizzes your child generated from their class notes — separate from official
            teacher tests and examinations.
          </Text>
        </View>

        {results.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="school-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No practice quizzes yet. Results will appear here once your child completes a notes practice CBT.</Text>
          </View>
        ) : (
          results.map((r) => {
            const rating = ratingFor(r.score);
            return (
              <View key={r.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.childName}>{r.studentName}</Text>
                    <Text style={styles.meta}>{r.className} • {fmtDate(r.takenAt)}</Text>
                    <Text style={styles.source}>From: {r.source}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: rating.bg }]}>
                    <Text style={[styles.scoreBadgeNum, { color: rating.color }]}>{r.correct}/{r.total}</Text>
                    <Text style={[styles.scoreBadgeLabel, { color: rating.color }]}>{rating.label}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => downloadText(`CBT_${r.studentName}_${r.takenAt.slice(0, 10)}`, cbtResultToText(r))}
                  activeOpacity={0.8}
                >
                  <Ionicons name="download-outline" size={16} color={COLORS.primaryMid} />
                  <Text style={styles.downloadText}>Download result</Text>
                </TouchableOpacity>

                <View style={styles.barBg}><View style={[styles.barFill, { width: `${r.score}%`, backgroundColor: rating.color }]} /></View>
                <Text style={styles.pct}>{r.score}% correct</Text>

                {r.topics?.length > 0 && (
                  <View style={styles.topicWrap}>
                    {r.topics.map((t) => (
                      <View key={t} style={styles.topicTag}><Text style={styles.topicTagText}>{t}</Text></View>
                    ))}
                  </View>
                )}
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

  noteBanner: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  noteText: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, lineHeight: 17 },

  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.lg, lineHeight: 20 },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  childName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  source: { fontSize: FONTS.sizes.xs, color: COLORS.primaryMid, marginTop: 2, fontWeight: FONTS.weights.semibold },
  scoreBadge: { alignItems: 'center', borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, minWidth: 76 },
  scoreBadgeNum: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold },
  scoreBadgeLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },

  barBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginTop: SPACING.md },
  barFill: { height: '100%', borderRadius: 4 },
  pct: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4, fontWeight: FONTS.weights.semibold },

  topicWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm },
  topicTag: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  topicTagText: { fontSize: 10, color: COLORS.textSecondary, fontWeight: FONTS.weights.semibold },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: SPACING.md, paddingVertical: 10, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.primaryMid },
  downloadText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
});
