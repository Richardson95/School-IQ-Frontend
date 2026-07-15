import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { BROADCASTS } from '../../constants/mockData';

const MSG_TYPES = [
  { key: 'general', label: 'General Announcement', icon: 'megaphone', color: COLORS.primary },
  { key: 'urgent', label: 'Urgent Notice', icon: 'alert-circle', color: '#E74C3C' },
  { key: 'event', label: 'Event Invitation', icon: 'calendar', color: '#27AE60' },
  { key: 'reminder', label: 'Reminder', icon: 'alarm', color: '#F39C12' },
];

export default function BroadcastScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('general');
  const [sending, setSending] = useState(false);

  const send = () => {
    if (!title.trim() || !message.trim()) { Alert.alert('Error', 'Please fill in both the title and message.'); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      Alert.alert('Broadcast Sent!', `Your message "${title}" has been delivered to all ${612} registered parents. Teachers cannot see this message.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast to Parents</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={18} color={COLORS.primary} />
          <Text style={styles.noticeText}>This message will be sent ONLY to parents. Teachers will NOT see this broadcast.</Text>
        </View>

        <Text style={styles.fieldLabel}>Message Type</Text>
        <View style={styles.typeGrid}>
          {MSG_TYPES.map((t) => (
            <TouchableOpacity key={t.key} onPress={() => setMsgType(t.key)} style={[styles.typeCard, msgType === t.key && { borderColor: t.color, backgroundColor: t.color + '15' }]} activeOpacity={0.8}>
              <Ionicons name={t.icon} size={20} color={t.color} />
              <Text style={[styles.typeLabel, { color: t.color }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Broadcast Title *</Text>
        <TextInput style={styles.inputBox} value={title} onChangeText={setTitle} placeholder="e.g. Important Notice: Mid-Term Break" placeholderTextColor={COLORS.textMuted} />

        <Text style={styles.fieldLabel}>Message *</Text>
        <TextInput style={styles.textarea} value={message} onChangeText={setMessage} placeholder="Write your broadcast message to all parents..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={6} textAlignVertical="top" />

        <View style={styles.recipientInfo}>
          <Ionicons name="people" size={16} color={COLORS.primary} />
          <Text style={styles.recipientText}>Will be sent to: <Text style={{ fontWeight: FONTS.weights.bold }}>612 Parents</Text></Text>
          <Ionicons name="eye-off" size={16} color={COLORS.textMuted} />
          <Text style={styles.recipientMuted}>Teachers excluded</Text>
        </View>

        <TouchableOpacity onPress={send} disabled={sending} style={[styles.sendBtn, sending && { opacity: 0.7 }]} activeOpacity={0.85}>
          <Ionicons name={sending ? 'hourglass-outline' : 'megaphone'} size={20} color="#FFF" />
          <Text style={styles.sendBtnText}>{sending ? 'Sending...' : 'Send Broadcast'}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Previous Broadcasts</Text>
        {BROADCASTS.map((b) => (
          <View key={b.id} style={styles.prevCard}>
            <Text style={styles.prevTitle}>{b.title}</Text>
            <Text style={styles.prevMsg} numberOfLines={2}>{b.message}</Text>
            <Text style={styles.prevDate}>{new Date(b.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  noticeCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#EBF2FF', borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  noticeText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.primary, lineHeight: 18 },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: SPACING.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  typeCard: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  typeLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, flex: 1 },
  inputBox: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, fontSize: FONTS.sizes.md, color: COLORS.text, marginBottom: SPACING.md },
  textarea: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, fontSize: FONTS.sizes.md, color: COLORS.text, height: 130, marginBottom: SPACING.md },
  recipientInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfaceYellow, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.md },
  recipientText: { fontSize: FONTS.sizes.sm, color: COLORS.text, flex: 1 },
  recipientMuted: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.lg, ...SHADOW.md },
  sendBtnText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm },
  prevCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  prevTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  prevMsg: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 18, marginTop: 2 },
  prevDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs, textAlign: 'right' },
});
