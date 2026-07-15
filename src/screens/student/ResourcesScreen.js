import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENT_RESOURCES } from '../../constants/mockData';

const TYPE_ICON = {
  pdf:    { icon: 'document-text', color: '#DC2626', bg: '#FEF2F2' },
  slides: { icon: 'easel',         color: '#D97706', bg: '#FFFBEB' },
  video:  { icon: 'play-circle',   color: '#7C3AED', bg: '#F5F3FF' },
};

export default function ResourcesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Resources</Text>
        <Text style={styles.headerSub}>Class notes, slides and recorded lessons</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {STUDENT_RESOURCES.map((r) => {
          const t = TYPE_ICON[r.type] || TYPE_ICON.pdf;
          return (
            <TouchableOpacity key={r.id} activeOpacity={0.85} onPress={() => Alert.alert('Download', `Downloading "${r.title}" (${r.size}).`)} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: t.bg }]}>
                <Ionicons name={t.icon} size={22} color={t.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.subject}>{r.subject}</Text>
                <Text style={styles.title}>{r.title}</Text>
                <Text style={styles.meta}>{r.type.toUpperCase()} · {r.size} · {r.date}</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={COLORS.primaryMid} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  body: { padding: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subject: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginTop: 1 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
});
