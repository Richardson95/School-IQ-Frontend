import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, TextInput, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { ALL_PARENTS } from '../../constants/mockData';

export default function ParentDirectoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const term = query.trim().toLowerCase();
  const parents = term
    ? ALL_PARENTS.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.children.some((c) => c.toLowerCase().includes(term)))
    : ALL_PARENTS;

  const callParent = (parent) => {
    Linking.openURL(`tel:${parent.phone}`).catch(() =>
      Alert.alert('Unable to call', `Please dial ${parent.phone} manually.`)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <Text style={styles.headerTitle}>Parent Directory</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>{ALL_PARENTS.length} parents on the system</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search by parent or child name"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={parents}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: insets.bottom + 24 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No parents match your search.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.children} numberOfLines={2}>{item.children.join(', ')}</Text>
              </View>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.contactText}>{item.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.contactText} numberOfLines={1}>{item.email}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => callParent(item)} style={styles.callBtn} activeOpacity={0.85}>
                <Ionicons name="call" size={16} color={COLORS.primary} />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Chat', { parent: item })} style={styles.chatBtn} activeOpacity={0.85}>
                <Ionicons name="chatbubble-ellipses" size={16} color="#FFF" />
                <Text style={styles.chatBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#FFF' },
  headerSub: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2, marginBottom: SPACING.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 10 },
  searchInput: { flex: 1, color: '#FFF', fontSize: FONTS.sizes.sm, padding: 0 },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
  name: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  children: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 },
  contactText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },

  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight + '22', borderWidth: 1.5, borderColor: COLORS.primary },
  callBtnText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primary },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
  chatBtnText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#FFF' },

  empty: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
});
