import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { BEST_STUDENTS, BEST_STUDENT_CATEGORIES } from '../../constants/mockData';

export default function BestStudentsAdminScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [students, setStudents] = useState(BEST_STUDENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ studentName: '', class: '', category: BEST_STUDENT_CATEGORIES[0], description: '', score: '', position: '1' });

  const handleAdd = () => {
    if (!form.studentName.trim() || !form.class.trim()) { Alert.alert('Error', 'Fill in student name and class.'); return; }
    const newEntry = { id: Date.now().toString(), term: '2nd Term', session: '2025/2026', ...form, position: parseInt(form.position) || 1 };
    setStudents((prev) => [...prev, newEntry]);
    setShowAdd(false);
    setForm({ studentName: '', class: '', category: BEST_STUDENT_CATEGORIES[0], description: '', score: '', position: '1' });
    Alert.alert('Success!', 'Best student entry added and published to all parents.');
  };

  const deleteEntry = (id) => {
    Alert.alert('Delete Entry?', '', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: () => setStudents((prev) => prev.filter((s) => s.id !== id)) }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Best Students Admin</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {students.map((s) => (
          <View key={s.id} style={styles.entryCard}>
            <View style={styles.entryLeft}>
              <View style={styles.entryAvatar}>
                <Text style={styles.entryAvatarText}>{s.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryName}>{s.studentName}</Text>
                <Text style={styles.entryClass}>{s.class} • Position {s.position}</Text>
                <View style={styles.categoryBadge}><Text style={styles.categoryText}>{s.category}</Text></View>
                {s.description && <Text style={styles.entryDesc} numberOfLines={2}>{s.description}</Text>}
              </View>
            </View>
            <View style={styles.entryActions}>
              {s.score && <Text style={styles.entryScore}>{s.score}</Text>}
              <TouchableOpacity onPress={() => deleteEntry(s.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Best Student</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity>
            </View>
            <ScrollView>
              {[['Student Name', 'studentName', 'e.g. Chidi Nwankwo'], ['Class', 'class', 'e.g. SS 3A'], ['Position', 'position', '1'], ['Score (optional)', 'score', 'e.g. 98.5%'], ['Description', 'description', 'Brief description...']].map(([label, key, placeholder]) => (
                <View key={key} style={{ marginBottom: SPACING.sm }}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TextInput style={styles.formInput} value={form[key]} onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))} placeholder={placeholder} placeholderTextColor={COLORS.textMuted} />
                </View>
              ))}
              <Text style={styles.fieldLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm, marginBottom: SPACING.md }}>
                {BEST_STUDENT_CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat} onPress={() => setForm((f) => ({ ...f, category: cat }))} style={[styles.catChip, form.category === cat && styles.catChipActive]}>
                    <Text style={[styles.catText, form.category === cat && { color: '#FFF' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={handleAdd} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Add & Publish</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  body: { padding: SPACING.md },
  entryCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  entryLeft: { flex: 1, flexDirection: 'row', gap: SPACING.md },
  entryAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  entryAvatarText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#FFF' },
  entryName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  entryClass: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  categoryBadge: { backgroundColor: '#EBF2FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full, alignSelf: 'flex-start', marginTop: 4 },
  categoryText: { fontSize: 10, color: COLORS.primary, fontWeight: FONTS.weights.semibold },
  entryDesc: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4 },
  entryActions: { alignItems: 'flex-end', gap: SPACING.sm },
  entryScore: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#27AE60' },
  deleteBtn: { padding: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: 4 },
  formInput: { backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.sm + 4, borderWidth: 1.5, borderColor: COLORS.border, fontSize: FONTS.sizes.md, color: COLORS.text },
  catChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: FONTS.weights.medium },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  submitBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
