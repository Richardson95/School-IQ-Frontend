import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { usePickup } from '../../context/PickupContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

const FILTERS = ['Active', 'Acknowledged'];

function fmt(iso) {
  return new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function PickupAlertsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { requests, acknowledge } = usePickup();
  const [filter, setFilter] = useState('Active');
  const [preview, setPreview] = useState(null);

  const visible = requests.filter((r) => (filter === 'Active' ? r.status === 'active' : r.status === 'acknowledged'));

  const onAcknowledge = (r) => acknowledge(r.id, { role: user.role, name: user.name });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup Alerts</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const count = requests.filter((r) => (f === 'Active' ? r.status === 'active' : r.status === 'acknowledged')).length;
          return (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}{count > 0 ? ` (${count})` : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.noteBanner}>
          <Ionicons name="information-circle" size={16} color={COLORS.primaryMid} />
          <Text style={styles.noteText}>Parents raise these when someone other than the usual guardian is collecting a child. Verify the person against the photo before release.</Text>
        </View>

        {visible.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No {filter.toLowerCase()} pickup alerts.</Text>
          </View>
        )}

        {visible.map((r) => (
          <View key={r.id} style={[styles.card, r.status === 'active' && styles.cardActive]}>
            <View style={styles.cardTop}>
              <TouchableOpacity onPress={() => setPreview(r.photoUri)} activeOpacity={0.85}>
                <Image source={{ uri: r.photoUri }} style={styles.photo} />
                <View style={styles.photoZoom}><Ionicons name="expand" size={12} color="#FFF" /></View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>{r.personName}</Text>
                <View style={styles.relPill}><Text style={styles.relText}>{r.relationship}</Text></View>
                <Text style={styles.meta}>Picking up <Text style={styles.metaStrong}>{r.studentName}</Text> ({r.className})</Text>
                <Text style={styles.meta}>Authorised by {r.parentName}</Text>
                <Text style={styles.time}>{fmt(r.createdAt)}</Text>
              </View>
            </View>

            {!!r.note && (
              <View style={styles.noteBox}>
                <Ionicons name="chatbubble-ellipses-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.noteBoxText}>{r.note}</Text>
              </View>
            )}

            {r.status === 'active' ? (
              <TouchableOpacity style={styles.ackBtn} onPress={() => onAcknowledge(r)} activeOpacity={0.85}>
                <Ionicons name="checkmark-done" size={16} color="#FFF" />
                <Text style={styles.ackText}>Acknowledge</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ackedRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.ackedText}>
                  Acknowledged by {r.acknowledgedBy?.name} ({r.acknowledgedBy?.role}) · {fmt(r.acknowledgedBy?.at)}
                </Text>
              </View>
            )}
          </View>
        ))}
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

  filterRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  filterText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },

  body: { paddingHorizontal: SPACING.md },
  noteBanner: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  noteText: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, lineHeight: 17 },

  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  cardActive: { borderLeftWidth: 4, borderLeftColor: COLORS.warning },
  cardTop: { flexDirection: 'row', gap: SPACING.md },
  photo: { width: 80, height: 80, borderRadius: RADIUS.sm, backgroundColor: COLORS.border },
  photoZoom: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 9, padding: 3 },
  personName: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  relPill: { alignSelf: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3, marginTop: 3, marginBottom: 4 },
  relText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 1 },
  metaStrong: { fontWeight: FONTS.weights.bold, color: COLORS.text },
  time: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 3 },

  noteBox: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.sm },
  noteBoxText: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, lineHeight: 17 },

  ackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, borderRadius: RADIUS.sm, paddingVertical: 11, marginTop: SPACING.md },
  ackText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  ackedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.md },
  ackedText: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.success, fontWeight: FONTS.weights.semibold },

  previewWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  previewImg: { width: '92%', height: '80%' },
  previewHint: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, marginTop: SPACING.md },
});
