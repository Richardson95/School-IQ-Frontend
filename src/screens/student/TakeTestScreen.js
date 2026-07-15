import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { SAMPLE_TEST_QUESTIONS } from '../../constants/mockData';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function TakeTestScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const test = route.params?.test ?? { title: 'Test', subject: '', duration: 30 };
  const questions = SAMPLE_TEST_QUESTIONS;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const select = (qid, idx) => { if (!submitted) setAnswers((p) => ({ ...p, [qid]: idx })); };

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);

  const handleSubmit = () => {
    const unanswered = questions.length - Object.keys(answers).length;
    const doSubmit = () => setSubmitted(true);
    if (unanswered > 0) {
      Alert.alert('Submit test?', `You have ${unanswered} unanswered question(s). Submit anyway?`, [
        { text: 'Keep working', style: 'cancel' },
        { text: 'Submit', style: 'destructive', onPress: doSubmit },
      ]);
    } else {
      Alert.alert('Submit test?', 'You cannot change answers after submitting.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: doSubmit },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={22} color="#FFF" />
          </TouchableOpacity>
          {!submitted && (
            <View style={styles.timerPill}>
              <Ionicons name="time-outline" size={14} color="#FFF" />
              <Text style={styles.timerText}>{test.duration}:00</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerTitle}>{test.title}</Text>
        <Text style={styles.headerSub}>{test.subject} • {questions.length} questions</Text>
      </LinearGradient>

      {submitted ? (
        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.resultCard}>
            <View style={styles.resultCircle}>
              <Text style={styles.resultPct}>{Math.round((score / questions.length) * 100)}%</Text>
            </View>
            <Text style={styles.resultBig}>You scored {score} / {questions.length}</Text>
            <Text style={styles.resultMsg}>{score >= questions.length * 0.7 ? 'Great job! 🎉' : 'Keep practising — you can do better!'}</Text>
          </View>
          <Text style={styles.reviewTitle}>Review</Text>
          {questions.map((q, i) => {
            const correct = answers[q.id] === q.answer;
            return (
              <View key={q.id} style={styles.qCard}>
                <Text style={styles.qText}>{i + 1}. {q.question}</Text>
                <Text style={[styles.reviewLine, { color: correct ? '#059669' : '#DC2626' }]}>
                  {correct ? '✓ Correct' : `✗ Your answer: ${answers[q.id] != null ? OPTION_LETTERS[answers[q.id]] : '—'}`}
                </Text>
                {!correct && <Text style={styles.correctLine}>Correct: {OPTION_LETTERS[q.answer]}. {q.options[q.answer]}</Text>}
              </View>
            );
          })}
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
          {questions.map((q, i) => (
            <View key={q.id} style={styles.qCard}>
              <Text style={styles.qText}>{i + 1}. {q.question}</Text>
              {q.options.map((opt, idx) => {
                const chosen = answers[q.id] === idx;
                return (
                  <TouchableOpacity key={idx} onPress={() => select(q.id, idx)} activeOpacity={0.8} style={[styles.option, chosen && styles.optionChosen]}>
                    <View style={[styles.optLetter, chosen && styles.optLetterChosen]}>
                      <Text style={[styles.optLetterText, chosen && { color: '#FFF' }]}>{OPTION_LETTERS[idx]}</Text>
                    </View>
                    <Text style={[styles.optText, chosen && { color: COLORS.primaryMid, fontWeight: FONTS.weights.bold }]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
            <Text style={styles.submitText}>Submit Test</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  timerPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6 },
  timerText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  body: { padding: SPACING.md },
  qCard: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  qText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 8 },
  optionChosen: { borderColor: COLORS.primaryMid, backgroundColor: '#EFF6FF' },
  optLetter: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  optLetterChosen: { backgroundColor: COLORS.primaryMid },
  optLetterText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary },
  optText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#059669', borderRadius: RADIUS.md, paddingVertical: 15, marginTop: SPACING.sm, ...SHADOW.md },
  submitText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },

  resultCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', ...SHADOW.md, marginBottom: SPACING.md },
  resultCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, borderWidth: 3, borderColor: '#059669' },
  resultPct: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, color: '#059669' },
  resultBig: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  resultMsg: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },
  reviewTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginBottom: SPACING.sm },
  reviewLine: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, marginTop: 4 },
  correctLine: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  doneBtn: { backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.md, paddingVertical: 15, alignItems: 'center', marginTop: SPACING.sm },
  doneText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },
});
