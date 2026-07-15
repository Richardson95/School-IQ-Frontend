import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENT_LIVE_CLASSES } from '../../constants/mockData';

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function LiveClassesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const live = STUDENT_LIVE_CLASSES.filter((c) => c.status === 'live');
  const upcoming = STUDENT_LIVE_CLASSES.filter((c) => c.status === 'upcoming');
  const ended = STUDENT_LIVE_CLASSES.filter((c) => c.status === 'ended');

  const join = (c) => Alert.alert('Joining live class', `Connecting you to "${c.title}" with ${c.teacher}.\n\nMeeting ID: ${c.meetingId}`);
  const watch = (c) => Alert.alert('Recording', `Playing the recorded session for "${c.title}".`);

  const Section = ({ title, data, renderRight }) => (
    data.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((c) => (
          <View key={c.id} style={[styles.card, c.status === 'live' && styles.cardLive]}>
            <View style={styles.cardLeft}>
              <View style={[styles.subjBadge, { backgroundColor: c.status === 'live' ? '#7C3AED' : '#EEF2FF' }]}>
                <Ionicons name="videocam" size={18} color={c.status === 'live' ? '#FFF' : COLORS.primaryMid} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.subject}>{c.subject}</Text>
                <Text style={styles.title}>{c.title}</Text>
                <Text style={styles.meta}>{c.teacher} · {c.duration} mins</Text>
                <Text style={styles.time}>{c.status === 'live' ? '● Live now' : fmtTime(c.startTime)}</Text>
              </View>
            </View>
            {renderRight(c)}
          </View>
        ))}
      </>
    )
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Live Classes</Text>
            <Text style={styles.headerSub}>Join live lessons and meetings</Text>
          </View>
          <TouchableOpacity style={styles.notesBtn} onPress={() => navigation.navigate('ClassNotes')} activeOpacity={0.85}>
            <Ionicons name="document-text" size={16} color="#FFF" />
            <Text style={styles.notesBtnText}>Class Notes</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Section title="Live Now" data={live} renderRight={(c) => (
          <TouchableOpacity onPress={() => join(c)} style={styles.joinBtn} activeOpacity={0.85}>
            <Text style={styles.joinText}>Join</Text>
          </TouchableOpacity>
        )} />
        <Section title="Upcoming" data={upcoming} renderRight={(c) => (
          <TouchableOpacity onPress={() => Alert.alert('Reminder set', `We'll remind you before "${c.title}" starts.`)} style={styles.remindBtn} activeOpacity={0.85}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.primaryMid} />
          </TouchableOpacity>
        )} />
        <Section title="Past Classes" data={ended} renderRight={(c) => (
          c.recordingAvailable
            ? <TouchableOpacity onPress={() => watch(c)} style={styles.watchBtn} activeOpacity={0.85}>
                <Ionicons name="play-circle" size={16} color="#FFF" />
                <Text style={styles.watchText}>Replay</Text>
              </TouchableOpacity>
            : <Text style={styles.endedText}>Ended</Text>
        )} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  notesBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  notesBtnText: { color: '#FFF', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  body: { padding: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold, color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  cardLive: { borderColor: '#7C3AED', borderWidth: 1.5 },
  cardLeft: { flexDirection: 'row', gap: SPACING.sm, flex: 1 },
  subjBadge: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subject: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 1 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  time: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2, fontWeight: FONTS.weights.semibold },

  joinBtn: { backgroundColor: '#7C3AED', borderRadius: RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: 9, marginLeft: SPACING.sm },
  joinText: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  remindBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginLeft: SPACING.sm },
  watchBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 8, marginLeft: SPACING.sm },
  watchText: { color: '#FFF', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  endedText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: FONTS.weights.semibold, marginLeft: SPACING.sm },
});
