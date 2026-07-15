import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useCbt } from '../../context/CbtContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { generateQuizFromNotes, coveredTopics, ratingFor } from '../../utils/notesQuiz';

const TOTAL = 20;

export default function NotesQuizScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addResult } = useCbt();

  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]); // selected option index per question (null until answered)
  const [result, setResult] = useState(null);

  const topicCount = useMemo(() => coveredTopics().size, []);

  const start = () => {
    const qs = generateQuizFromNotes(TOTAL);
    setQuestions(qs);
    setSelected(Array(qs.length).fill(null));
    setCurrent(0);
    setResult(null);
    setPhase('quiz');
  };

  const q = questions[current];
  const picked = selected[current];
  const answered = picked !== null && picked !== undefined;
  const isLast = current === questions.length - 1;

  const choose = (idx) => {
    if (answered) return; // locked — cannot be altered once answered
    setSelected((prev) => { const next = [...prev]; next[current] = idx; return next; });
  };

  const finish = (finalSelected) => {
    const correct = questions.reduce((acc, item, i) => acc + (finalSelected[i] === item.answer ? 1 : 0), 0);
    const pct = Math.round((correct / questions.length) * 100);
    const rating = ratingFor(pct);
    const payload = {
      studentId: user.id,
      studentName: user.name,
      className: user.class,
      parentId: user.parentId,
      total: questions.length,
      correct,
      score: pct,
      rating: rating.label,
      topics: [...new Set(questions.map((x) => x.topic))],
      source: 'Class Notes (speech-to-text)',
    };
    addResult(payload);            // auto-sent to the parent as a practice CBT result
    setResult({ correct, pct, rating });
    setPhase('result');
  };

  const next = () => {
    if (isLast) { finish(selected); return; }
    setCurrent((c) => c + 1);
  };

  /* --------------------------------------------------------------- INTRO */
  if (phase === 'intro') {
    return (
      <Shell insets={insets} navigation={navigation} title="Practice CBT">
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}><Ionicons name="sparkles" size={28} color={COLORS.gold} /></View>
            <Text style={styles.heroTitle}>Quiz from your Class Notes</Text>
            <Text style={styles.heroSub}>
              The system reads all the class notes transcribed for you so far and generates {TOTAL} practice
              questions. You'll see if each answer is right or wrong instantly, and your score is sent to your parent.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <InfoPill icon="documents" label={`${topicCount} note topics`} />
            <InfoPill icon="help-circle" label={`${TOTAL} questions`} />
            <InfoPill icon="lock-closed" label="No changing answers" />
          </View>

          <View style={styles.rulesCard}>
            <Rule text="Tap an option to answer — it locks immediately." />
            <Rule text="Correct answers turn green, wrong picks turn red." />
            <Rule text="You cannot change an answer once selected." />
            <Rule text="Finish all 20 to see your total and rating." />
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={start} activeOpacity={0.85}>
            <Ionicons name="play" size={18} color="#FFF" />
            <Text style={styles.startText}>Generate & Start Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </Shell>
    );
  }

  /* ---------------------------------------------------------------- QUIZ */
  if (phase === 'quiz') {
    const answeredCount = selected.filter((s) => s !== null && s !== undefined).length;
    const progress = Math.round((answeredCount / questions.length) * 100);
    return (
      <Shell insets={insets} navigation={navigation} title={`Question ${current + 1} of ${questions.length}`} onBack={() => setPhase('intro')}>
        <View style={styles.progressBg}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.topicChip}><Text style={styles.topicChipText}>{q.subject} • {q.topic}</Text></View>
          <Text style={styles.question}>{q.question}</Text>

          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer;
            const isPicked = i === picked;
            let state = 'idle';
            if (answered && isCorrect) state = 'correct';
            else if (answered && isPicked && !isCorrect) state = 'wrong';
            return (
              <TouchableOpacity
                key={i}
                onPress={() => choose(i)}
                disabled={answered}
                activeOpacity={0.85}
                style={[styles.option, state === 'correct' && styles.optionCorrect, state === 'wrong' && styles.optionWrong]}
              >
                <View style={[styles.optionLetter, state === 'correct' && styles.letterCorrect, state === 'wrong' && styles.letterWrong]}>
                  <Text style={[styles.optionLetterText, (state !== 'idle') && { color: '#FFF' }]}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={[styles.optionText, state === 'correct' && { color: COLORS.success, fontWeight: FONTS.weights.bold }, state === 'wrong' && { color: COLORS.error, fontWeight: FONTS.weights.bold }]}>{opt}</Text>
                {state === 'correct' && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
                {state === 'wrong' && <Ionicons name="close-circle" size={20} color={COLORS.error} />}
              </TouchableOpacity>
            );
          })}

          {answered && (
            <View style={styles.feedback}>
              <Ionicons name={picked === q.answer ? 'happy' : 'information-circle'} size={16} color={picked === q.answer ? COLORS.success : COLORS.warning} />
              <Text style={[styles.feedbackText, { color: picked === q.answer ? COLORS.success : COLORS.warning }]}>
                {picked === q.answer ? 'Correct!' : `Correct answer: ${String.fromCharCode(65 + q.answer)}`}
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.nextBtn, !answered && styles.nextBtnDisabled]}
            onPress={next}
            disabled={!answered}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>{isLast ? 'Finish & See Result' : 'Next Question'}</Text>
            <Ionicons name={isLast ? 'flag' : 'arrow-forward'} size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Shell>
    );
  }

  /* -------------------------------------------------------------- RESULT */
  const { correct, pct, rating } = result;
  return (
    <Shell insets={insets} navigation={navigation} title="Your Result" onBack={() => setPhase('intro')}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.scoreCard, { backgroundColor: rating.bg }]}>
          <View style={[styles.ratingIcon, { backgroundColor: rating.color }]}>
            <Ionicons name={rating.icon} size={30} color="#FFF" />
          </View>
          <Text style={styles.scoreBig}>{correct}<Text style={styles.scoreOf}> / {TOTAL}</Text></Text>
          <Text style={[styles.ratingLabel, { color: rating.color }]}>{rating.label}</Text>
          <Text style={styles.scorePct}>{pct}% correct</Text>
        </View>

        <View style={styles.sentCard}>
          <Ionicons name="paper-plane" size={18} color={COLORS.primaryMid} />
          <Text style={styles.sentText}>This practice result has been sent to your parent.</Text>
        </View>

        <Text style={styles.breakdownTitle}>Topics covered</Text>
        <View style={styles.topicWrap}>
          {[...new Set(questions.map((x) => x.topic))].map((t) => (
            <View key={t} style={styles.topicTag}><Text style={styles.topicTagText}>{t}</Text></View>
          ))}
        </View>

        <TouchableOpacity style={styles.retakeBtn} onPress={start} activeOpacity={0.85}>
          <Ionicons name="refresh" size={18} color={COLORS.primaryMid} />
          <Text style={styles.retakeText}>Take another quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </Shell>
  );
}

/* -------------------------------------------------------------- helpers */
function Shell({ insets, navigation, title, onBack, children }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack || (() => navigation.goBack())} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>
      {children}
    </View>
  );
}

const InfoPill = ({ icon, label }) => (
  <View style={styles.pill}>
    <Ionicons name={icon} size={15} color={COLORS.primaryMid} />
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

const Rule = ({ text }) => (
  <View style={styles.ruleRow}>
    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginTop: 1 }} />
    <Text style={styles.ruleText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  heroCard: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.lg, alignItems: 'center', ...SHADOW.sm, marginBottom: SPACING.md },
  heroIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  heroTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text, textAlign: 'center' },
  heroSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 20 },

  infoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md, flexWrap: 'wrap' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 8 },
  pillText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },

  rulesCard: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.sm, marginBottom: SPACING.lg, gap: SPACING.sm },
  ruleRow: { flexDirection: 'row', gap: 8 },
  ruleText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 19 },

  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.md, paddingVertical: 15, ...SHADOW.md },
  startText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },

  progressBg: { height: 6, backgroundColor: '#E2E8F0' },
  progressFill: { height: '100%', backgroundColor: COLORS.success },

  topicChip: { alignSelf: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6, marginBottom: SPACING.md },
  topicChipText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  question: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginBottom: SPACING.lg, lineHeight: 26 },

  option: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1.5, borderColor: '#E2E8F0' },
  optionCorrect: { borderColor: COLORS.success, backgroundColor: '#F0FDF4' },
  optionWrong: { borderColor: COLORS.error, backgroundColor: '#FEF2F2' },
  optionLetter: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  letterCorrect: { backgroundColor: COLORS.success },
  letterWrong: { backgroundColor: COLORS.error },
  optionLetterText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.extrabold, color: COLORS.primaryMid },
  optionText: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text },

  feedback: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm },
  feedbackText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },

  footer: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#FFF' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.md, paddingVertical: 14 },
  nextBtnDisabled: { backgroundColor: COLORS.textMuted },
  nextText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },

  scoreCard: { borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.md },
  ratingIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  scoreBig: { fontSize: 48, fontWeight: FONTS.weights.black, color: COLORS.text },
  scoreOf: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary },
  ratingLabel: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, marginTop: 4 },
  scorePct: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },

  sentCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
  sentText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.primaryMid, fontWeight: FONTS.weights.semibold },

  breakdownTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  topicWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  topicTag: { backgroundColor: '#FFF', borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border },
  topicTagText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: FONTS.weights.semibold },

  retakeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, borderRadius: RADIUS.md, paddingVertical: 14, borderWidth: 1.5, borderColor: COLORS.primaryMid, marginBottom: SPACING.sm },
  retakeText: { color: COLORS.primaryMid, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  doneBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.md, paddingVertical: 14, backgroundColor: COLORS.primary },
  doneText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },
});
