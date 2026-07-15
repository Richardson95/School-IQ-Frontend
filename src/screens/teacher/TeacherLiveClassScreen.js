import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { TEACHER_LIVE_CLASSES, STUDENTS } from '../../constants/mockData';

const STATUS_META = {
  live:     { label: '● Live now', color: '#7C3AED', bg: '#F5F3FF' },
  upcoming: { label: 'Scheduled',  color: COLORS.primaryMid, bg: COLORS.surfaceAlt },
  ended:    { label: 'Ended',      color: COLORS.textMuted, bg: '#F1F5F9' },
};

function fmtTime(iso) {
  return new Date(iso).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function TeacherLiveClassScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [classes, setClasses] = useState(TEACHER_LIVE_CLASSES);

  const setStatus = (id, status) => setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const startClass = (c) => {
    const count = STUDENTS.filter((s) => s.class === c.className).length;
    Alert.alert(
      'Start live class?',
      `"${c.title}" for ${c.className} will go live. ${count} students can join from home.\n\nMeeting ID: ${c.meetingId}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Live', onPress: () => { setStatus(c.id, 'live'); Alert.alert('You are live 🎥', 'Students in ' + c.className + ' can now join. Tip: turn on the Voice Listener to auto-generate notes for the class.'); } },
      ],
    );
  };

  const endClass = (c) => {
    Alert.alert('End live class?', `End "${c.title}" for ${c.className}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Class', style: 'destructive', onPress: () => setStatus(c.id, 'ended') },
    ]);
  };

  const live = classes.filter((c) => c.status === 'live');
  const upcoming = classes.filter((c) => c.status === 'upcoming');
  const ended = classes.filter((c) => c.status === 'ended');

  const Card = ({ c }) => {
    const meta = STATUS_META[c.status];
    const count = STUDENTS.filter((s) => s.class === c.className).length;
    return (
      <View style={[styles.card, c.status === 'live' && styles.cardLive]}>
        <View style={styles.cardTop}>
          <View style={[styles.subjBadge, { backgroundColor: c.status === 'live' ? '#7C3AED' : COLORS.surfaceAlt }]}>
            <Ionicons name="videocam" size={18} color={c.status === 'live' ? '#FFF' : COLORS.primaryMid} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subject}>{c.subject} • {c.className}</Text>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.meta}>{c.duration} mins • {count} students</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
            <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>

        <Text style={styles.timeText}>
          {c.status === 'live' ? `${c.joined} joined so far` : c.status === 'ended' ? 'Session ended' : fmtTime(c.startTime)}
        </Text>

        <View style={styles.actions}>
          {c.status === 'upcoming' && (
            <TouchableOpacity style={styles.goLiveBtn} onPress={() => startClass(c)} activeOpacity={0.85}>
              <Ionicons name="play" size={16} color="#FFF" />
              <Text style={styles.goLiveText}>Start Class</Text>
            </TouchableOpacity>
          )}
          {c.status === 'live' && (
            <>
              <TouchableOpacity style={styles.voiceBtn} onPress={() => navigation.navigate('VoiceNotes')} activeOpacity={0.85}>
                <Ionicons name="mic" size={16} color={COLORS.primaryMid} />
                <Text style={styles.voiceText}>Voice Listener</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.endBtn} onPress={() => endClass(c)} activeOpacity={0.85}>
                <Ionicons name="stop-circle" size={16} color="#FFF" />
                <Text style={styles.endText}>End</Text>
              </TouchableOpacity>
            </>
          )}
          {c.status === 'ended' && c.recordingAvailable && (
            <TouchableOpacity style={styles.recBtn} onPress={() => Alert.alert('Recording', 'Playback of the recorded session would open here.')} activeOpacity={0.85}>
              <Ionicons name="play-circle" size={16} color={COLORS.primaryMid} />
              <Text style={styles.voiceText}>View Recording</Text>
            </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Live Classes</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Host live lessons for students learning from home.</Text>

        {live.length > 0 && <Text style={styles.sectionTitle}>Live Now</Text>}
        {live.map((c) => <Card key={c.id} c={c} />)}

        {upcoming.length > 0 && <Text style={styles.sectionTitle}>Scheduled</Text>}
        {upcoming.map((c) => <Card key={c.id} c={c} />)}

        {ended.length > 0 && <Text style={styles.sectionTitle}>Past Classes</Text>}
        {ended.map((c) => <Card key={c.id} c={c} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  intro: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  cardLive: { borderColor: '#7C3AED', borderWidth: 1.5 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  subjBadge: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subject: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 1 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  statusPill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  timeText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: FONTS.weights.semibold, marginTop: SPACING.sm },

  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  goLiveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#7C3AED', borderRadius: RADIUS.sm, paddingVertical: 11 },
  goLiveText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  voiceBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, paddingVertical: 11, borderWidth: 1, borderColor: COLORS.primaryMid },
  recBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, paddingVertical: 11 },
  voiceText: { color: COLORS.primaryMid, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  endBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.error, borderRadius: RADIUS.sm, paddingVertical: 11, paddingHorizontal: SPACING.lg },
  endText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
});
