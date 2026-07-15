import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

const ALERT_TYPES = [
  { key: 'fire', label: 'Fire Emergency', icon: 'flame', color: '#E74C3C', message: 'URGENT: Fire emergency at River Bank School. All students are being safely evacuated. Please do NOT come to school. We will update you shortly.' },
  { key: 'medical', label: 'Medical Emergency', icon: 'medkit', color: '#8E44AD', message: 'URGENT: A medical emergency is being handled at River Bank School. Affected parents will be contacted individually. School operations continue normally.' },
  { key: 'security', label: 'Security Threat', icon: 'shield', color: '#E67E22', message: 'URGENT: A security situation is being managed at River Bank School. Students are safe and secured. Do NOT come to school until further notice.' },
  { key: 'dismissal', label: 'Early Dismissal', icon: 'home', color: '#2980B9', message: 'NOTICE: School is closing early today. Please make arrangements to pick up your children by 1:00 PM. Students will wait in the assembly hall.' },
  { key: 'custom', label: 'Custom Alert', icon: 'warning', color: '#F39C12', message: '' },
];

export default function EmergencyAlertScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [alertType, setAlertType] = useState(null);
  const [message, setMessage] = useState('');

  const handleSelect = (type) => {
    setAlertType(type);
    setMessage(type.message);
  };

  const sendAlert = () => {
    if (!alertType || !message.trim()) { Alert.alert('Error', 'Select an alert type and write a message.'); return; }
    Alert.alert('EMERGENCY ALERT SENT', `Your emergency alert has been sent to ALL 612 parents and school staff immediately.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1A0000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0000" />
      <LinearGradient colors={['#6B0000', '#C0392B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Ionicons name="warning" size={28} color="#FFD700" />
          <Text style={styles.headerTitle}>Emergency Alert</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>This will immediately notify ALL parents and staff. Use only in genuine emergencies.</Text>
        </View>

        <Text style={styles.fieldLabel}>Alert Type</Text>
        {ALERT_TYPES.map((type) => (
          <TouchableOpacity key={type.key} onPress={() => handleSelect(type)} style={[styles.alertTypeCard, alertType?.key === type.key && { borderColor: type.color, backgroundColor: type.color + '20' }]} activeOpacity={0.85}>
            <View style={[styles.alertIcon, { backgroundColor: type.color }]}>
              <Ionicons name={type.icon} size={24} color="#FFF" />
            </View>
            <Text style={[styles.alertLabel, { color: type.color }]}>{type.label}</Text>
            {alertType?.key === type.key && <Ionicons name="checkmark-circle" size={22} color={type.color} />}
          </TouchableOpacity>
        ))}

        <Text style={styles.fieldLabel}>Alert Message *</Text>
        <TextInput style={styles.textarea} value={message} onChangeText={setMessage}
          placeholder="Write your emergency message here..." placeholderTextColor="rgba(255,255,255,0.4)"
          multiline numberOfLines={5} textAlignVertical="top" />

        <View style={styles.recipientRow}>
          <Ionicons name="people" size={16} color="#FF6B6B" />
          <Text style={styles.recipientText}>Will be sent to: 612 parents + 42 teachers + all school staff</Text>
        </View>

        <TouchableOpacity onPress={sendAlert} style={styles.sendBtn} activeOpacity={0.85}>
          <Ionicons name="warning" size={22} color="#FFF" />
          <Text style={styles.sendBtnText}>SEND EMERGENCY ALERT NOW</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  body: { padding: SPACING.md, backgroundColor: '#1A0000' },
  warningBanner: { backgroundColor: 'rgba(255,107,107,0.15)', borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: '#FF6B6B' },
  warningText: { fontSize: FONTS.sizes.sm, color: '#FF6B6B', textAlign: 'center', lineHeight: 20 },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  alertTypeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  alertIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alertLabel: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  textarea: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1.5, borderColor: 'rgba(255,107,107,0.4)', fontSize: FONTS.sizes.md, color: '#FFF', height: 130, marginBottom: SPACING.md },
  recipientRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.lg },
  recipientText: { fontSize: FONTS.sizes.sm, color: '#FF6B6B', flex: 1 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C0392B', borderRadius: RADIUS.md, padding: SPACING.md + 4, gap: SPACING.sm, borderWidth: 2, borderColor: '#FF6B6B' },
  sendBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: '#FFF', letterSpacing: 0.5 },
});
