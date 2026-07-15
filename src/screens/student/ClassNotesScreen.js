import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { CLASS_NOTES } from '../../constants/mockData';
import { downloadText } from '../../utils/download';

function noteToText(n) {
  return [
    'RIVER BANK SCHOOL — CLASS NOTES',
    '────────────────────────────────────────',
    `Subject: ${n.subject}`,
    `Topic: ${n.topic}`,
    `Teacher: ${n.teacher}`,
    `Class: ${n.className}`,
    '────────────────────────────────────────',
    `Summary:\n${n.summary}`,
    '',
    'Key Points:',
    ...n.keyPoints.map((k, i) => `  ${i + 1}. ${k}`),
    '',
    `Full Transcript:\n${n.transcript}`,
  ].join('\n');
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function ClassNotesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [openId, setOpenId] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Class Notes</Text>
        <Text style={styles.headerSub}>Transcribed lesson notes from your teachers</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {CLASS_NOTES.length > 0 && (
          <TouchableOpacity style={styles.quizBtn} onPress={() => navigation.navigate('NotesQuiz')} activeOpacity={0.9}>
            <LinearGradient colors={['#7C3AED', '#8B5CF6']} style={styles.quizGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.quizIcon}><Ionicons name="sparkles" size={22} color="#FFF" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.quizTitle}>Test yourself on these notes</Text>
                <Text style={styles.quizSub}>Generate a 20-question practice CBT from your notes</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        {CLASS_NOTES.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No class notes yet. They'll appear here after your teacher ends a lesson.</Text>
          </View>
        )}

        {CLASS_NOTES.map((n) => {
          const open = openId === n.id;
          return (
            <View key={n.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconWrap}>
                  <Ionicons name="mic" size={18} color={COLORS.primaryMid} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{n.subject}</Text>
                  <Text style={styles.topic}>{n.topic}</Text>
                  <Text style={styles.meta}>{n.teacher} • {fmtDate(n.date)}</Text>
                </View>
              </View>

              <View style={styles.summaryBox}>
                <View style={styles.summaryHead}>
                  <Ionicons name="sparkles" size={14} color={COLORS.goldDark} />
                  <Text style={styles.summaryLabel}>Summary</Text>
                </View>
                <Text style={styles.summaryText}>{n.summary}</Text>
              </View>

              <Text style={styles.keyLabel}>Key Points</Text>
              {n.keyPoints.map((k, i) => (
                <View key={i} style={styles.keyRow}>
                  <Ionicons name="checkmark-circle" size={15} color={COLORS.success} style={{ marginTop: 2 }} />
                  <Text style={styles.keyText}>{k}</Text>
                </View>
              ))}

              <View style={styles.noteActions}>
                <TouchableOpacity style={styles.toggle} onPress={() => setOpenId(open ? null : n.id)} activeOpacity={0.7}>
                  <Text style={styles.toggleText}>{open ? 'Hide transcript' : 'Read transcript'}</Text>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.primaryMid} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggle} onPress={() => downloadText(`ClassNotes_${n.subject}_${n.topic}`, noteToText(n))} activeOpacity={0.7}>
                  <Ionicons name="download-outline" size={16} color={COLORS.primaryMid} />
                  <Text style={styles.toggleText}>Download</Text>
                </TouchableOpacity>
              </View>
              {open && <Text style={styles.transcript}>{n.transcript}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  body: { padding: SPACING.md },

  quizBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.md },
  quizGrad: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md },
  quizIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  quizTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  quizSub: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.lg },

  card: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTop: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  subject: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  topic: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: 1 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  summaryBox: { backgroundColor: '#FFFBEB', borderRadius: RADIUS.sm, padding: SPACING.sm + 2, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.warningLight },
  summaryHead: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  summaryLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.extrabold, color: COLORS.goldDark, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryText: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 20 },

  keyLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: 6 },
  keyRow: { flexDirection: 'row', gap: 7, marginBottom: 6 },
  keyText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 19 },

  noteActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  toggle: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  toggleText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  transcript: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 21, marginTop: 4, backgroundColor: '#F8FAFF', padding: SPACING.sm, borderRadius: RADIUS.sm },
});
