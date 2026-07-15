import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { ALL_CLASSES, STUDENTS } from '../../constants/mockData';

const BEHAVIORS = ['Outstanding', 'Excellent', 'Good', 'Average', 'Needs Improvement'];
const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const TERMS = ['1st Term', '2nd Term', '3rd Term'];

export default function SubmitReportScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [cls, setCls] = useState('SS 2A');
  const [week, setWeek] = useState('Week 3');
  const [term, setTerm] = useState('2nd Term');
  const [subject, setSubject] = useState('Mathematics');
  const [classwork, setClasswork] = useState('');
  const [homework, setHomework] = useState('');
  const [participation, setParticipation] = useState('');
  const [behavior, setBehavior] = useState('Good');
  const [summary, setSummary] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!classwork || !summary) { Alert.alert('Error', 'Please fill in all required fields.'); return; }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      Alert.alert('Report Submitted!', `Your ${subject} report for ${cls} — ${week} has been sent to parents.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }, 1500);
  };

  const Selector = ({ label, options, value, onChange }) => (
    <View style={styles.selectorGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm }}>
        {options.map((opt) => (
          <TouchableOpacity key={opt} onPress={() => onChange(opt)} style={[styles.selectorChip, value === opt && styles.selectorChipActive]}>
            <Text style={[styles.selectorText, value === opt && styles.selectorTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Weekly Report</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Selector label="Class *" options={['SS 2A', 'SS 2B', 'SS 3A']} value={cls} onChange={setCls} />
        <Selector label="Term *" options={TERMS} value={term} onChange={setTerm} />
        <Selector label="Week *" options={WEEKS} value={week} onChange={setWeek} />

        <Text style={styles.fieldLabel}>Subject *</Text>
        <View style={styles.inputWrap}>
          <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="e.g. Mathematics" placeholderTextColor={COLORS.textMuted} />
        </View>

        <View style={styles.scoresRow}>
          {[['Classwork %', classwork, setClasswork], ['Homework %', homework, setHomework], ['Participation %', participation, setParticipation]].map(([label, val, set]) => (
            <View key={label} style={styles.scoreInput}>
              <Text style={styles.scoreLabel}>{label}</Text>
              <TextInput style={styles.scoreBox} value={val} onChangeText={set} placeholder="0-100" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" maxLength={3} textAlign="center" />
            </View>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Behavior *</Text>
        <View style={styles.behaviorRow}>
          {BEHAVIORS.map((b) => (
            <TouchableOpacity key={b} onPress={() => setBehavior(b)} style={[styles.behaviorChip, behavior === b && styles.behaviorChipActive]}>
              <Text style={[styles.behaviorText, behavior === b && styles.behaviorTextActive]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Teacher's Summary *</Text>
        <TextInput style={[styles.inputWrap, styles.textarea]} value={summary} onChangeText={setSummary}
          placeholder="Write a summary of the student's performance this week..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={4} textAlignVertical="top" />

        <Text style={styles.fieldLabel}>Recommendations</Text>
        <TextInput style={[styles.inputWrap, styles.textarea]} value={recommendations} onChangeText={setRecommendations}
          placeholder="Any recommendations for the student or parent..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <TouchableOpacity onPress={handleSubmit} disabled={submitted} style={[styles.submitBtn, submitted && { opacity: 0.7 }]} activeOpacity={0.85}>
          <Ionicons name={submitted ? 'hourglass-outline' : 'send'} size={20} color="#FFF" />
          <Text style={styles.submitBtnText}>{submitted ? 'Submitting...' : 'Submit Report to Parents'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  selectorGroup: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: SPACING.xs },
  selectorChip: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  selectorChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectorText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: FONTS.weights.medium },
  selectorTextActive: { color: '#FFF', fontWeight: FONTS.weights.bold },
  inputWrap: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, marginBottom: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text },
  input: { fontSize: FONTS.sizes.md, color: COLORS.text },
  textarea: { height: 100 },
  scoresRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  scoreInput: { flex: 1 },
  scoreLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary, marginBottom: SPACING.xs, textAlign: 'center' },
  scoreBox: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.sm, borderWidth: 1.5, borderColor: COLORS.border, fontSize: FONTS.sizes.xl, color: COLORS.text, fontWeight: FONTS.weights.bold, textAlign: 'center' },
  behaviorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  behaviorChip: { paddingHorizontal: SPACING.sm, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  behaviorChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  behaviorText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  behaviorTextActive: { color: '#FFF', fontWeight: FONTS.weights.bold },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, marginTop: SPACING.sm, ...SHADOW.md },
  submitBtnText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
