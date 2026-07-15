import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { useAssignments } from '../../context/AssignmentsContext';
import { downloadText, assignmentToText } from '../../utils/download';

const FILTERS = ['All', 'Pending', 'Submitted', 'Graded'];

const STATUS_STYLE = {
  pending:   { label: 'Pending',   color: '#D97706', bg: '#FFFBEB' },
  submitted: { label: 'Submitted', color: '#2563EB', bg: '#EFF6FF' },
  graded:    { label: 'Graded',    color: '#059669', bg: '#ECFDF5' },
};

export default function AssignmentsScreen() {
  const insets = useSafeAreaInsets();
  const { assignments, submitAssignment } = useAssignments();
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null); // assignment being submitted
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState(null); // { uri, name }

  const visible = filter === 'All' ? assignments : assignments.filter((a) => a.status === filter.toLowerCase());

  const openSubmit = (item) => { setActive(item); setAnswer(''); setFile(null); };

  const attachFile = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed', 'Please allow photo access to attach your work.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ['images'] });
    if (!res.canceled) {
      const asset = res.assets[0];
      setFile({ uri: asset.uri, name: asset.fileName || 'submission.jpg' });
    }
  };

  const submit = () => {
    if (!answer.trim() && !file) { Alert.alert('Empty submission', 'Type your answer or attach a file before submitting.'); return; }
    submitAssignment(active.id, { answer: answer.trim(), fileUri: file?.uri || null, fileName: file?.name || null });
    const title = active.title;
    setActive(null);
    Alert.alert('Submitted ✓', `Your work for "${title}" has been submitted. Your teacher can now download it.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Assignment Board</Text>
        <Text style={styles.headerSub}>View, work on and submit your assignments</Text>
      </LinearGradient>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {visible.length === 0 && <Text style={styles.empty}>No assignments here.</Text>}
        {visible.map((a) => {
          const st = STATUS_STYLE[a.status];
          return (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.subject}>{a.subject}</Text>
                <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>
              <Text style={styles.title}>{a.title}</Text>
              <Text style={styles.desc} numberOfLines={3}>{a.description}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{a.teacher}</Text>
                <Ionicons name="time-outline" size={13} color={COLORS.textMuted} style={{ marginLeft: 10 }} />
                <Text style={styles.metaText}>Due {a.dueDate}</Text>
              </View>

              {a.status === 'graded' && (
                <View style={styles.gradedBox}>
                  <Text style={styles.gradedScore}>Score: {a.score}/{a.maxScore}</Text>
                  {!!a.feedback && <Text style={styles.feedback}>“{a.feedback}”</Text>}
                </View>
              )}

              <TouchableOpacity onPress={() => downloadText(`Assignment_${a.subject}_${a.title}`, assignmentToText(a))} style={styles.downloadBriefBtn} activeOpacity={0.8}>
                <Ionicons name="download-outline" size={15} color={COLORS.primaryMid} />
                <Text style={styles.downloadBriefText}>Download brief</Text>
              </TouchableOpacity>

              {a.status === 'pending' && (
                <TouchableOpacity onPress={() => openSubmit(a)} style={styles.submitBtn} activeOpacity={0.85}>
                  <Ionicons name="cloud-upload-outline" size={16} color="#FFF" />
                  <Text style={styles.submitBtnText}>Submit Assignment</Text>
                </TouchableOpacity>
              )}
              {a.status === 'submitted' && (
                <Text style={styles.submittedNote}>Submitted on {a.submittedDate} — awaiting grading</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Submission modal */}
      <Modal visible={!!active} transparent animationType="slide" onRequestClose={() => setActive(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{active?.title}</Text>
            <Text style={styles.modalSub}>{active?.subject} • Due {active?.dueDate}</Text>
            <Text style={styles.modalLabel}>Your answer / notes</Text>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Type your answer here, or note the file you are attaching..."
              placeholderTextColor={COLORS.textMuted}
              multiline
            />
            {file ? (
              <View style={styles.attachedRow}>
                <Ionicons name="document-attach" size={18} color={COLORS.success} />
                <Text style={styles.attachedName} numberOfLines={1}>{file.name}</Text>
                <TouchableOpacity onPress={() => setFile(null)}><Text style={styles.removeAttach}>Remove</Text></TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.attachRow} activeOpacity={0.7} onPress={attachFile}>
                <Ionicons name="attach" size={18} color={COLORS.primaryMid} />
                <Text style={styles.attachText}>Attach your work (photo of your work)</Text>
              </TouchableOpacity>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setActive(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={submit}>
                <Text style={styles.confirmText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  filterRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  filterText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },

  body: { paddingHorizontal: SPACING.md },
  empty: { textAlign: 'center', color: COLORS.textMuted, marginTop: SPACING.xl },

  card: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subject: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  statusPill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: 6 },
  desc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: 4 },
  metaText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  gradedBox: { backgroundColor: '#ECFDF5', borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  gradedScore: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#059669' },
  feedback: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 3 },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.sm, paddingVertical: 11, marginTop: SPACING.sm },
  submitBtnText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  submittedNote: { fontSize: FONTS.sizes.xs, color: '#2563EB', fontWeight: FONTS.weights.semibold, marginTop: SPACING.sm },

  modalWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, paddingBottom: SPACING.xl },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  modalSub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2, marginBottom: SPACING.md },
  modalLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: RADIUS.sm, padding: SPACING.md, minHeight: 110, textAlignVertical: 'top', fontSize: FONTS.sizes.md, color: COLORS.text },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.md },
  attachText: { fontSize: FONTS.sizes.sm, color: COLORS.primaryMid, fontWeight: FONTS.weights.semibold },
  attachedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md, backgroundColor: '#ECFDF5', borderRadius: RADIUS.sm, padding: SPACING.sm },
  attachedName: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: FONTS.weights.semibold },
  removeAttach: { fontSize: FONTS.sizes.sm, color: COLORS.error, fontWeight: FONTS.weights.bold },
  downloadBriefBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: SPACING.sm, paddingVertical: 9, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: '#E2E8F0' },
  downloadBriefText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary },
  confirmBtn: { flex: 1, paddingVertical: 13, borderRadius: RADIUS.sm, backgroundColor: COLORS.primaryMid, alignItems: 'center' },
  confirmText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
