import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { STUDENT_TIMETABLE } from '../../constants/mockData';

const DAYS = STUDENT_TIMETABLE.map((d) => d.day);
const todayName = new Date().toLocaleString([], { weekday: 'long' });

export default function TimetableScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const initial = DAYS.includes(todayName) ? todayName : DAYS[0];
  const [day, setDay] = useState(initial);

  const periods = STUDENT_TIMETABLE.find((d) => d.day === day)?.periods ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFF' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient colors={['#0C1B33', '#1A3A6B']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Timetable</Text>
        <Text style={styles.headerSub}>Your weekly class schedule</Text>
      </LinearGradient>

      <View style={styles.dayRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm, paddingHorizontal: SPACING.md }}>
          {DAYS.map((d) => (
            <TouchableOpacity key={d} onPress={() => setDay(d)} style={[styles.dayChip, day === d && styles.dayChipActive]}>
              <Text style={[styles.dayText, day === d && styles.dayTextActive]}>{d.slice(0, 3)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {periods.map((p, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.timeCol}>
              <Text style={styles.timeText}>{p.time.split(' - ')[0]}</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.card}>
              <Text style={styles.subject}>{p.subject}</Text>
              <Text style={styles.teacher}>{p.teacher}</Text>
              <Text style={styles.slot}>{p.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: '#FFF' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  dayRow: { paddingVertical: SPACING.md },
  dayChip: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  dayChipActive: { backgroundColor: COLORS.primaryMid, borderColor: COLORS.primaryMid },
  dayText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary },
  dayTextActive: { color: '#FFF' },

  body: { paddingHorizontal: SPACING.md },
  row: { flexDirection: 'row', gap: SPACING.sm },
  timeCol: { width: 54, alignItems: 'center' },
  timeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.primaryMid },
  line: { flex: 1, width: 2, backgroundColor: '#E2E8F0', marginTop: 4 },
  card: { flex: 1, backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderWidth: 1, borderColor: '#F1F5F9', borderLeftWidth: 4, borderLeftColor: COLORS.primaryMid },
  subject: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  teacher: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  slot: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 4 },
});
