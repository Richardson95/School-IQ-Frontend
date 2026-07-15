import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENTS, INCIDENT_TYPES } from '../../constants/mockData';

export default function MessageParentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [student, setStudent] = useState(null);
  const [incidentType, setIncidentType] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('medium');

  const handleSend = () => {
    if (!student || !incidentType || !message.trim()) { Alert.alert('Error', 'Please select a student, incident type, and write a message.'); return; }
    Alert.alert('Message Sent!', `The parent of ${student.name} has been notified about the ${incidentType.label} incident.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message Parent</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.fieldLabel}>Select Student *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm, marginBottom: SPACING.md }}>
          {STUDENTS.map((s) => (
            <TouchableOpacity key={s.id} onPress={() => setStudent(s)} style={[styles.studentChip, student?.id === s.id && styles.studentChipActive]}>
              <View style={[styles.studentChipAvatar, student?.id === s.id && { backgroundColor: '#FFF' }]}>
                <Text style={[styles.studentChipAvatarText, student?.id === s.id && { color: COLORS.primary }]}>{s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View>
                <Text style={[styles.studentChipName, student?.id === s.id && { color: '#FFF' }]} numberOfLines={1}>{s.name.split(' ')[0]}</Text>
                <Text style={[styles.studentChipClass, student?.id === s.id && { color: 'rgba(255,255,255,0.8)' }]}>{s.class}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {student && (
          <View style={styles.selectedStudentCard}>
            <Ionicons name="person-circle" size={18} color={COLORS.primary} />
            <Text style={styles.selectedStudentText}>Parent: <Text style={{ fontWeight: FONTS.weights.bold }}>Parent of {student.name}</Text> will receive this message</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>Incident Type *</Text>
        <View style={styles.incidentGrid}>
          {INCIDENT_TYPES.map((type) => (
            <TouchableOpacity key={type.key} onPress={() => setIncidentType(type)} style={[styles.incidentCard, incidentType?.key === type.key && { borderColor: type.color, backgroundColor: type.color + '15' }]} activeOpacity={0.8}>
              <Ionicons name={type.icon} size={22} color={type.color} />
              <Text style={[styles.incidentLabel, { color: type.color }]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Severity Level</Text>
        <View style={styles.severityRow}>
          {[['low', 'Low', '#27AE60'], ['medium', 'Medium', '#F39C12'], ['high', 'High', '#E74C3C']].map(([key, label, color]) => (
            <TouchableOpacity key={key} onPress={() => setSeverity(key)} style={[styles.severityChip, severity === key && { backgroundColor: color, borderColor: color }]}>
              <Text style={[styles.severityText, severity === key && { color: '#FFF' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Message to Parent *</Text>
        <TextInput style={styles.textarea} value={message} onChangeText={setMessage}
          placeholder="Describe the incident clearly and professionally..." placeholderTextColor={COLORS.textMuted}
          multiline numberOfLines={5} textAlignVertical="top" />

        <TouchableOpacity onPress={handleSend} style={styles.sendBtn} activeOpacity={0.85}>
          <Ionicons name="send" size={20} color="#FFF" />
          <Text style={styles.sendBtnText}>Send to Parent</Text>
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
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: SPACING.sm },
  studentChip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  studentChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  studentChipAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  studentChipAvatarText: { fontSize: 12, fontWeight: FONTS.weights.bold, color: '#FFF' },
  studentChipName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  studentChipClass: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  selectedStudentCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#EBF2FF', borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.md },
  selectedStudentText: { fontSize: FONTS.sizes.sm, color: COLORS.primary },
  incidentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  incidentCard: { width: '30%', alignItems: 'center', gap: 6, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  incidentLabel: { fontSize: 10, fontWeight: FONTS.weights.semibold, textAlign: 'center' },
  severityRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  severityChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  severityText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  textarea: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, fontSize: FONTS.sizes.md, color: COLORS.text, height: 120, marginBottom: SPACING.md },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.error, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, ...SHADOW.md },
  sendBtnText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
