import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { INCIDENT_MESSAGES, BROADCASTS } from '../../constants/mockData';

const TYPE_CONFIG = {
  fight: { label: 'Physical Fight', color: '#E74C3C', bg: '#FDEDEC', icon: 'hand-left' },
  misconduct: { label: 'Misconduct', color: '#E67E22', bg: '#FDEBD0', icon: 'warning' },
  bad_language: { label: 'Bad Language', color: '#D35400', bg: '#FAE5D3', icon: 'chatbubble-ellipses' },
  injury: { label: 'Injury', color: '#C0392B', bg: '#FDEDEC', icon: 'medkit' },
  late: { label: 'Lateness', color: '#2980B9', bg: '#EBF5FB', icon: 'time' },
  bullying: { label: 'Bullying', color: '#8E44AD', bg: '#F5EEF8', icon: 'alert-circle' },
  other: { label: 'Other', color: '#7F8C8D', bg: '#F0F0F0', icon: 'document-text' },
};

export default function IncidentMessagesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = React.useState(null);
  const [tab, setTab] = React.useState('incidents');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages & Alerts</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.tabBar}>
        {[['incidents', 'Incident Messages'], ['broadcasts', 'School Broadcasts']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {tab === 'incidents' ? (
          INCIDENT_MESSAGES.map((msg) => {
            const cfg = TYPE_CONFIG[msg.type] || TYPE_CONFIG.other;
            return (
              <TouchableOpacity key={msg.id} onPress={() => setSelected(msg)} style={[styles.card, { borderLeftColor: cfg.color }]} activeOpacity={0.85}>
                <View style={styles.cardTop}>
                  <View style={[styles.typeChip, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={13} color={cfg.color} />
                    <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                  {!msg.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.msgStudent}>{msg.studentName}</Text>
                <Text style={styles.msgFrom}>From: {msg.from} ({msg.fromRole})</Text>
                <Text style={styles.msgPreview} numberOfLines={2}>{msg.message}</Text>
                <Text style={styles.msgDate}>{new Date(msg.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
              </TouchableOpacity>
            );
          })
        ) : (
          BROADCASTS.map((b) => (
            <View key={b.id} style={[styles.card, { borderLeftColor: b.priority === 'high' ? COLORS.error : COLORS.primary }]}>
              <View style={styles.cardTop}>
                <View style={[styles.typeChip, { backgroundColor: b.priority === 'high' ? '#FDEDEC' : '#EBF2FF' }]}>
                  <Ionicons name="megaphone" size={13} color={b.priority === 'high' ? COLORS.error : COLORS.primary} />
                  <Text style={[styles.typeText, { color: b.priority === 'high' ? COLORS.error : COLORS.primary }]}>
                    {b.priority === 'high' ? 'Urgent' : 'Announcement'}
                  </Text>
                </View>
              </View>
              <Text style={styles.msgStudent}>{b.title}</Text>
              <Text style={styles.msgFrom}>From: {b.from} • {b.fromTitle}</Text>
              <Text style={styles.msgPreview}>{b.message}</Text>
              <Text style={styles.msgDate}>{new Date(b.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Incident Detail</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {selected && (() => {
              const cfg = TYPE_CONFIG[selected.type] || TYPE_CONFIG.other;
              return (
                <>
                  <View style={[styles.typeChip, { backgroundColor: cfg.bg, marginBottom: SPACING.md }]}>
                    <Ionicons name={cfg.icon} size={14} color={cfg.color} />
                    <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                  <Text style={styles.detailLabel}>Student</Text>
                  <Text style={styles.detailValue}>{selected.studentName}</Text>
                  <Text style={styles.detailLabel}>Reported By</Text>
                  <Text style={styles.detailValue}>{selected.from} ({selected.fromRole})</Text>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>{new Date(selected.date).toLocaleString('en-NG')}</Text>
                  <Text style={styles.detailLabel}>Message</Text>
                  <Text style={styles.msgBody}>{selected.message}</Text>
                </>
              );
            })()}
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
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.medium, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: FONTS.weights.bold },
  body: { padding: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 4, ...SHADOW.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  typeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.error },
  msgStudent: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  msgFrom: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 4 },
  msgPreview: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  msgDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  detailLabel: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: SPACING.sm },
  detailValue: { fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: FONTS.weights.medium },
  msgBody: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 22, marginTop: SPACING.xs },
});
