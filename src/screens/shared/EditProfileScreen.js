import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useAvatarPicker } from '../../hooks/useAvatarPicker';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const chooseAvatar = useAvatarPicker();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');

  const save = () => {
    if (!name.trim()) { Alert.alert('Error', 'Name cannot be empty.'); return; }
    if (!email.trim()) { Alert.alert('Error', 'Email cannot be empty.'); return; }
    updateUser({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    Alert.alert('Profile Updated', 'Your changes have been saved.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const FIELDS = [
    { label: 'Full Name', value: name, setter: setName, icon: 'person-outline', keyboardType: 'default', placeholder: 'Enter your full name' },
    { label: 'Email Address', value: email, setter: setEmail, icon: 'mail-outline', keyboardType: 'email-address', placeholder: 'Enter your email' },
    { label: 'Phone Number', value: phone, setter: setPhone, icon: 'call-outline', keyboardType: 'phone-pad', placeholder: 'Enter your phone number' },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
          <TouchableOpacity onPress={chooseAvatar} activeOpacity={0.8} style={styles.avatar}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        {FIELDS.map((f) => (
          <View key={f.label} style={styles.field}>
            <Text style={styles.fieldLabel}>{f.label}</Text>
            <View style={styles.inputRow}>
              <Ionicons name={f.icon} size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.textMuted}
                keyboardType={f.keyboardType}
                autoCapitalize={f.keyboardType === 'email-address' ? 'none' : 'words'}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={save} style={styles.saveBtn} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={20} color="#FFF" />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  avatarWrap: { alignItems: 'center', marginVertical: SPACING.md },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 42 },
  avatarText: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  changePhotoText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: FONTS.weights.semibold, marginTop: SPACING.sm },
  field: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: SPACING.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border },
  input: { flex: 1, paddingVertical: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.sm, ...SHADOW.md },
  saveBtnText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
});
