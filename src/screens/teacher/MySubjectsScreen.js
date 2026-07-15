import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';

export default function MySubjectsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const subjects = user.subjects || [];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subjects</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.intro}>Subjects you are currently assigned to teach.</Text>
        {subjects.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No subjects assigned yet.</Text>
          </View>
        ) : (
          subjects.map((subject) => (
            <View key={subject} style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name="book" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.cardText}>{subject}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  body: { padding: SPACING.md },
  intro: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  cardText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
});
