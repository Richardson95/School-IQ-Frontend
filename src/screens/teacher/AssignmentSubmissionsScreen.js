import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { useAssignments } from '../../context/AssignmentsContext';
import { downloadText, downloadUri, submissionToText } from '../../utils/download';

const STATUS_STYLE = {
  submitted: { label: 'Submitted', color: '#2563EB', bg: '#EFF6FF' },
  graded:    { label: 'Graded',    color: '#059669', bg: '#ECFDF5' },
};

export default function AssignmentSubmissionsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { submissions } = useAssignments();
  const [preview, setPreview] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assignment Submissions</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Work submitted by students. Download their uploads to review offline.</Text>

        {submissions.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No submissions yet.</Text>
          </View>
        )}

        {submissions.map((a) => {
          const st = STATUS_STYLE[a.status] || STATUS_STYLE.submitted;
          const sub = a.submission;
          return (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{a.subject}</Text>
                  <Text style={styles.title}>{a.title}</Text>
                  <Text style={styles.meta}>{a.studentName} • submitted {sub.submittedDate || a.submittedDate}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>

              {!!sub.answer && sub.answer !== '(submitted earlier)' && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerLabel}>Student's written answer</Text>
                  <Text style={styles.answerText} numberOfLines={4}>{sub.answer}</Text>
                </View>
              )}

              {sub.fileUri ? (
                <TouchableOpacity style={styles.fileRow} onPress={() => setPreview(sub.fileUri)} activeOpacity={0.85}>
                  <Image source={{ uri: sub.fileUri }} style={styles.fileThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>{sub.fileName || 'Uploaded file'}</Text>
                    <Text style={styles.fileHint}>Tap to preview</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noFile}>No file uploaded — written answer only.</Text>
              )}

              <View style={styles.actions}>
                {sub.fileUri && (
                  <TouchableOpacity style={styles.dlPrimary} onPress={() => downloadUri(sub.fileUri, { dialogTitle: sub.fileName || 'Submission' })} activeOpacity={0.85}>
                    <Ionicons name="download" size={16} color="#FFF" />
                    <Text style={styles.dlPrimaryText}>Download upload</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.dlSecondary} onPress={() => downloadText(`Submission_${a.studentName}_${a.title}`, submissionToText(a, sub))} activeOpacity={0.85}>
                  <Ionicons name="document-text-outline" size={16} color={COLORS.primaryMid} />
                  <Text style={styles.dlSecondaryText}>Download as text</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <TouchableOpacity style={styles.previewWrap} activeOpacity={1} onPress={() => setPreview(null)}>
          {preview && <Image source={{ uri: preview }} style={styles.previewImg} resizeMode="contain" />}
          <Text style={styles.previewHint}>Tap anywhere to close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  intro: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  subject: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: 1 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  statusPill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },

  answerBox: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  answerLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary, marginBottom: 2 },
  answerText: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 19 },

  fileRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, padding: SPACING.sm },
  fileThumb: { width: 48, height: 48, borderRadius: RADIUS.sm, backgroundColor: COLORS.border },
  fileName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  fileHint: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 1 },
  noFile: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontStyle: 'italic', marginTop: SPACING.sm },

  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  dlPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.sm, paddingVertical: 11 },
  dlPrimaryText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  dlSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: RADIUS.sm, paddingVertical: 11, borderWidth: 1.5, borderColor: COLORS.primaryMid },
  dlSecondaryText: { color: COLORS.primaryMid, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },

  previewWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  previewImg: { width: '92%', height: '80%' },
  previewHint: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, marginTop: SPACING.md },
});
