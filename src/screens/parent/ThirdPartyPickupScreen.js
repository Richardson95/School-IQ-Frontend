import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { usePickup } from '../../context/PickupContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENTS } from '../../constants/mockData';

const RELATIONSHIPS = ['Uncle', 'Aunt', 'Grandparent', 'Sibling', 'Family Friend', 'Guardian', 'Driver', 'Other'];

export default function ThirdPartyPickupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addRequest } = usePickup();
  const children = STUDENTS.filter((s) => user.childrenIds?.includes(s.id));

  const [childId, setChildId] = useState(children[0]?.id);
  const [photo, setPhoto] = useState(null);   // { uri }
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const child = children.find((c) => c.id === childId);
  const canSend = !!photo && personName.trim().length > 1 && !!relationship && !submitting;

  const pick = (source) => async () => {
    const opts = { allowsEditing: true, aspect: [1, 1], quality: 0.6 };
    let res;
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Please allow camera access to take the photo.'); return; }
      res = await ImagePicker.launchCameraAsync(opts);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Please allow photo access to choose a picture.'); return; }
      res = await ImagePicker.launchImageLibraryAsync({ ...opts, mediaTypes: ['images'] });
    }
    if (!res.canceled) setPhoto({ uri: res.assets[0].uri });
  };

  const choosePhoto = () => {
    Alert.alert('Photo of person picking up', 'Add a clear photo so staff can identify them', [
      { text: 'Take Photo', onPress: pick('camera') },
      { text: 'Choose from Library', onPress: pick('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const send = () => {
    if (!canSend) return;
    setSubmitting(true);
    setTimeout(() => {
      addRequest({
        studentId: child.id,
        studentName: child.name,
        className: child.class,
        parentId: user.id,
        parentName: user.name,
        personName: personName.trim(),
        relationship,
        photoUri: photo.uri,
        note: note.trim(),
      });
      setSubmitting(false);
      Alert.alert(
        'Pickup Alert Sent ✓',
        `${personName.trim()} (${relationship}) has been authorised to pick up ${child.name}. School authority, teachers and admin have been notified.`,
        [{ text: 'Done', onPress: () => navigation.goBack() }],
      );
    }, 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>3rd Party Pickup</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <Ionicons name="shield-checkmark" size={22} color={COLORS.primaryMid} />
            <Text style={styles.introText}>
              Use this when the usual guardian can't pick up your child. Staff at the gate will verify the person
              against the photo and details you provide here.
            </Text>
          </View>

          {/* Child */}
          <Text style={styles.label}>Which child?</Text>
          <View style={styles.chipRow}>
            {children.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => setChildId(c.id)} style={[styles.chip, childId === c.id && styles.chipActive]}>
                <Text style={[styles.chipText, childId === c.id && styles.chipTextActive]}>{c.name.split(' ')[0]} · {c.class}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo */}
          <Text style={styles.label}>Photo of the person picking up</Text>
          {!photo ? (
            <TouchableOpacity style={styles.photoBox} onPress={choosePhoto} activeOpacity={0.8}>
              <View style={styles.photoIcon}><Ionicons name="camera" size={26} color={COLORS.primaryMid} /></View>
              <Text style={styles.photoTitle}>Add photo</Text>
              <Text style={styles.photoSub}>Take or choose a clear picture of their face</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photo.uri }} style={styles.photoImg} />
              <View style={{ flex: 1 }}>
                <View style={styles.attachedRow}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.attachedText}>Photo added</Text>
                </View>
                <TouchableOpacity onPress={choosePhoto}><Text style={styles.changePhoto}>Change photo</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {/* Name */}
          <Text style={styles.label}>Full name of the person</Text>
          <TextInput
            style={styles.input}
            value={personName}
            onChangeText={setPersonName}
            placeholder="e.g. Mr. Chidi Okonkwo"
            placeholderTextColor={COLORS.textMuted}
          />

          {/* Relationship */}
          <Text style={styles.label}>How are they related to {child?.name.split(' ')[0] || 'the child'}?</Text>
          <View style={styles.chipRow}>
            {RELATIONSHIPS.map((r) => (
              <TouchableOpacity key={r} onPress={() => setRelationship(r)} style={[styles.chip, relationship === r && styles.chipActive]}>
                <Text style={[styles.chipText, relationship === r && styles.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note */}
          <Text style={styles.label}>Note for staff (optional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Picking up today at 2pm, I'm stuck at work."
            placeholderTextColor={COLORS.textMuted}
            multiline
          />

          {!canSend && (
            <Text style={styles.hint}>Add a photo, the person's name and their relationship to send the alert.</Text>
          )}

          <TouchableOpacity style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]} onPress={send} disabled={!canSend} activeOpacity={0.85}>
            <Ionicons name={submitting ? 'hourglass-outline' : 'send'} size={18} color="#FFF" />
            <Text style={styles.sendText}>{submitting ? 'Sending…' : 'Send Pickup Alert'}</Text>
          </TouchableOpacity>
          <Text style={styles.sendNote}>Sent to school authority, teachers and admin — not to students.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },

  introCard: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  introText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 19 },

  label: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  chipText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF' },

  photoBox: { borderWidth: 1.5, borderColor: COLORS.primaryMid, borderStyle: 'dashed', borderRadius: RADIUS.md, padding: SPACING.lg, alignItems: 'center', backgroundColor: COLORS.surfaceAlt },
  photoIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  photoTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  photoSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  photoPreview: { flexDirection: 'row', gap: SPACING.md, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.successLight },
  photoImg: { width: 72, height: 72, borderRadius: RADIUS.sm, backgroundColor: COLORS.border },
  attachedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attachedText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.success },
  changePhoto: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid, marginTop: 6 },

  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, backgroundColor: COLORS.surface },
  noteInput: { minHeight: 80, textAlignVertical: 'top' },

  hint: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md, fontStyle: 'italic' },

  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primaryMid, borderRadius: RADIUS.md, paddingVertical: 15, marginTop: SPACING.md, ...SHADOW.md },
  sendBtnDisabled: { backgroundColor: COLORS.textMuted, shadowOpacity: 0, elevation: 0 },
  sendText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.extrabold },
  sendNote: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.sm },
});
