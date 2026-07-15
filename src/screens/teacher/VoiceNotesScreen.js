import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Animated, Easing, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { LESSON_TRANSCRIPTS, STUDENTS } from '../../constants/mockData';
import { summarizeTranscript } from '../../utils/transcription';

const STREAM_MS = 1500; // cadence at which recognised speech lines arrive

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function fmtClock(sec) { return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`; }

export default function VoiceNotesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const classes = user.classes || ['SS 2A'];
  const subjects = user.subjects || ['Mathematics'];

  const [phase, setPhase] = useState('setup'); // setup | listening | review
  const [className, setClassName] = useState(classes[0]);
  const [subject, setSubject] = useState(subjects[0]);
  const [topic, setTopic] = useState('');
  const [lines, setLines] = useState([]);       // recognised { text, key? } lines so far
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState(null);   // { summary, keyPoints, fullText }

  const scriptRef = useRef([]);   // the full simulated transcript queue
  const idxRef = useRef(0);       // how far we've streamed
  const streamRef = useRef(null);
  const clockRef = useRef(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef(null);

  const classStudents = STUDENTS.filter((s) => s.class === className);

  // Mic pulse animation while actively listening.
  useEffect(() => {
    if (phase === 'listening' && !paused) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.25, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }
  }, [phase, paused, pulse]);

  // Cleanup timers on unmount.
  useEffect(() => () => { clearInterval(streamRef.current); clearInterval(clockRef.current); }, []);

  const startClock = () => {
    clearInterval(clockRef.current);
    clockRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const startStream = () => {
    clearInterval(streamRef.current);
    streamRef.current = setInterval(() => {
      const queue = scriptRef.current;
      if (idxRef.current < queue.length) {
        const next = queue[idxRef.current];
        idxRef.current += 1;
        setLines((prev) => [...prev, next]);
      }
      // When the script is exhausted the mic stays "on" (teacher still speaking),
      // simply awaiting more speech — nothing new is appended.
    }, STREAM_MS);
  };

  const beginListening = () => {
    scriptRef.current = LESSON_TRANSCRIPTS[subject] || LESSON_TRANSCRIPTS.default;
    idxRef.current = 0;
    setLines([]);
    setSeconds(0);
    setPaused(false);
    setPhase('listening');
    startStream();
    startClock();
  };

  const togglePause = () => {
    setPaused((p) => {
      const next = !p;
      if (next) { clearInterval(streamRef.current); clearInterval(clockRef.current); }
      else { startStream(); startClock(); }
      return next;
    });
  };

  const endClass = () => {
    if (lines.length === 0) {
      Alert.alert('Nothing captured yet', 'Wait for some speech to be transcribed before ending the class.');
      return;
    }
    clearInterval(streamRef.current);
    clearInterval(clockRef.current);
    const summary = summarizeTranscript(lines, { subject, topic: topic.trim() || undefined });
    setResult(summary);
    setPhase('review');
  };

  const sendToStudents = () => {
    Alert.alert(
      'Send class notes?',
      `The transcribed notes and summary for "${topic.trim() || subject}" will be sent to all ${classStudents.length} students in ${className}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Notes',
          onPress: () => Alert.alert(
            'Notes Sent ✓',
            `Class notes delivered to ${classStudents.length} students in ${className}. They can now read the transcript and summary in their Class Notes.`,
            [{ text: 'Done', onPress: () => navigation.goBack() }],
          ),
        },
      ],
    );
  };

  /* ----------------------------------------------------------------- SETUP */
  if (phase === 'setup') {
    return (
      <Screen insets={insets} navigation={navigation} title="Class Voice Notes">
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <Ionicons name="mic-circle" size={30} color={COLORS.primaryMid} />
            <Text style={styles.introText}>
              Turn on the voice listener and it will transcribe your lesson as you teach.
              When you end the class, the notes and an auto-summary are sent to every student.
            </Text>
          </View>

          <Text style={styles.label}>Class</Text>
          <ChipRow items={classes} value={className} onPick={setClassName} />

          <Text style={styles.label}>Subject</Text>
          <ChipRow items={subjects} value={subject} onPick={setSubject} />

          <Text style={styles.label}>Lesson topic (optional)</Text>
          <TopicInput value={topic} onChange={setTopic} />

          <View style={styles.audienceRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.audienceText}>{classStudents.length} students in {className} will receive the notes</Text>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={beginListening} activeOpacity={0.85}>
            <Ionicons name="mic" size={20} color="#FFF" />
            <Text style={styles.startBtnText}>Turn On Voice Listener</Text>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    );
  }

  /* ------------------------------------------------------------- LISTENING */
  if (phase === 'listening') {
    return (
      <Screen insets={insets} navigation={navigation} title="Listening…">
        <View style={styles.liveBar}>
          <Animated.View style={[styles.liveDot, { transform: [{ scale: paused ? 1 : pulse }] }]} />
          <Text style={styles.liveText}>{paused ? 'Paused' : 'Listening'} • {subject} • {className}</Text>
          <Text style={styles.clock}>{fmtClock(seconds)}</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.transcriptBody}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {lines.length === 0 && (
            <Text style={styles.waiting}>Waiting for speech… start teaching and your words will appear here.</Text>
          )}
          {lines.map((l, i) => (
            <View key={i} style={styles.lineRow}>
              <Ionicons name="volume-medium-outline" size={14} color={COLORS.textMuted} style={{ marginTop: 3 }} />
              <Text style={[styles.lineText, l.key && styles.lineKey]}>{l.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.pauseBtn} onPress={togglePause} activeOpacity={0.85}>
            <Ionicons name={paused ? 'play' : 'pause'} size={20} color={COLORS.primaryMid} />
            <Text style={styles.pauseText}>{paused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endBtn} onPress={endClass} activeOpacity={0.85}>
            <Ionicons name="stop-circle" size={20} color="#FFF" />
            <Text style={styles.endText}>End Class & Make Notes</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  /* ---------------------------------------------------------------- REVIEW */
  return (
    <Screen insets={insets} navigation={navigation} title="Class Notes Ready">
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.metaCard}>
          <Text style={styles.metaTopic}>{topic.trim() || subject}</Text>
          <Text style={styles.metaSub}>{subject} • {className} • {fmtClock(seconds)} • {lines.length} lines transcribed</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHead}>
            <Ionicons name="sparkles" size={16} color={COLORS.gold} />
            <Text style={styles.summaryTitle}>Auto Summary</Text>
          </View>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </View>

        <Text style={styles.sectionLabel}>Key Points</Text>
        {result.keyPoints.map((k, i) => (
          <View key={i} style={styles.keyRow}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginTop: 2 }} />
            <Text style={styles.keyText}>{k}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Full Transcript</Text>
        <View style={styles.transcriptCard}>
          <Text style={styles.transcriptText}>{result.fullText}</Text>
        </View>

        <TouchableOpacity style={styles.sendBtn} onPress={sendToStudents} activeOpacity={0.85}>
          <Ionicons name="send" size={18} color="#FFF" />
          <Text style={styles.sendText}>Send to {classStudents.length} students in {className}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redoBtn} onPress={() => setPhase('setup')} activeOpacity={0.8}>
          <Text style={styles.redoText}>Discard & start over</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

/* -------------------------------------------------------------- helpers */

function Screen({ insets, navigation, title, children }) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>
      {children}
    </View>
  );
}

function ChipRow({ items, value, onPick }) {
  return (
    <View style={styles.chipRow}>
      {items.map((it) => (
        <TouchableOpacity key={it} onPress={() => onPick(it)} style={[styles.chip, value === it && styles.chipActive]}>
          <Text style={[styles.chipText, value === it && styles.chipTextActive]}>{it}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TopicInput({ value, onChange }) {
  return (
    <TextInput
      style={styles.topicInput}
      value={value}
      onChangeText={onChange}
      placeholder="e.g. Quadratic Equations Revision"
      placeholderTextColor={COLORS.textMuted}
    />
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  introCard: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
  introText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 19 },

  label: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  chipText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF' },
  topicInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, backgroundColor: COLORS.surface },

  audienceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.lg },
  audienceText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },

  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error, borderRadius: RADIUS.md, paddingVertical: 15, marginTop: SPACING.lg, ...SHADOW.md },
  startBtnText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },

  liveBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: '#FEF2F2', borderBottomWidth: 1, borderBottomColor: '#FECACA' },
  liveDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.error },
  liveText: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.error },
  clock: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: COLORS.text, fontVariant: ['tabular-nums'] },

  transcriptBody: { padding: SPACING.md, paddingBottom: SPACING.lg },
  waiting: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: SPACING.xl },
  lineRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md },
  lineText: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 22 },
  lineKey: { color: COLORS.text, fontWeight: FONTS.weights.semibold },

  controls: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  pauseBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: SPACING.lg, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.primaryMid },
  pauseText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  endBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: RADIUS.md, backgroundColor: COLORS.error },
  endText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#FFF' },

  metaCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  metaTopic: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  metaSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 3 },

  summaryCard: { backgroundColor: '#FFFBEB', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.warningLight },
  summaryHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  summaryTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: COLORS.goldDark, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryText: { fontSize: FONTS.sizes.md, color: COLORS.text, lineHeight: 22 },

  sectionLabel: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  keyRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.sm },
  keyText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },

  transcriptCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.sm },
  transcriptText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 21 },

  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingVertical: 15, marginTop: SPACING.lg, ...SHADOW.md },
  sendText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, textAlign: 'center' },
  redoBtn: { alignItems: 'center', paddingVertical: SPACING.md, marginTop: SPACING.xs },
  redoText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: FONTS.weights.semibold },
});
