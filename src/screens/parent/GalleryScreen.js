import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { GALLERY_ALBUMS } from '../../constants/mockData';

const CAT_COLORS = { Sports: '#E74C3C', Awards: '#F39C12', Culture: '#8E44AD', Academics: '#2980B9', 'School Life': '#27AE60' };
const CAT_ICONS = { Sports: 'football', Awards: 'trophy', Culture: 'color-palette', Academics: 'school', 'School Life': 'camera' };

export default function GalleryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(GALLERY_ALBUMS.map((a) => a.category))];
  const filtered = filter === 'All' ? GALLERY_ALBUMS : GALLERY_ALBUMS.filter((a) => a.category === filter);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Gallery</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingVertical: SPACING.sm }}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setFilter(cat)} style={[styles.filterChip, filter === cat && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {filtered.map((album) => {
          const color = CAT_COLORS[album.category] || COLORS.primary;
          const icon = CAT_ICONS[album.category] || 'images';
          return (
            <TouchableOpacity key={album.id} style={styles.albumCard} activeOpacity={0.85}>
              <View style={[styles.albumCover, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon} size={48} color={color} />
                <View style={styles.photoCount}>
                  <Ionicons name="images" size={12} color="#FFF" />
                  <Text style={styles.photoCountText}>{album.photoCount}</Text>
                </View>
              </View>
              <View style={styles.albumInfo}>
                <View style={styles.albumInfoTop}>
                  <View style={[styles.catBadge, { backgroundColor: color + '22' }]}>
                    <Text style={[styles.catText, { color }]}>{album.category}</Text>
                  </View>
                  <Text style={styles.albumDate}>{new Date(album.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                </View>
                <Text style={styles.albumTitle}>{album.title}</Text>
                <Text style={styles.albumDesc} numberOfLines={2}>{album.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={styles.comingSoon}>
          <Ionicons name="lock-closed-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.comingSoonText}>More albums coming soon...</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  filterBar: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.background },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: FONTS.weights.medium },
  filterTextActive: { color: '#FFF', fontWeight: FONTS.weights.bold },
  body: { padding: SPACING.md },
  albumCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.md },
  albumCover: { height: 160, alignItems: 'center', justifyContent: 'center' },
  photoCount: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  photoCountText: { fontSize: FONTS.sizes.xs, color: '#FFF', fontWeight: FONTS.weights.bold },
  albumInfo: { padding: SPACING.md },
  albumInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  catBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  catText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  albumDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  albumTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: 4 },
  albumDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 18 },
  comingSoon: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
  comingSoonText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
});
