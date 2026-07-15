import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { PARENT_MESSAGES } from '../../constants/mockData';

export default function ChatScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { parent } = route.params;
  const [messages, setMessages] = useState(PARENT_MESSAGES[parent.id] || []);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, from: 'staff', text, time: new Date().toISOString() },
    ]);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{parent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName} numberOfLines={1}>{parent.name}</Text>
          <Text style={styles.headerMeta} numberOfLines={1}>{parent.children.join(', ')}</Text>
        </View>
      </LinearGradient>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: SPACING.md, flexGrow: 1 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No messages yet. Say hello 👋</Text>
          </View>
        }
        renderItem={({ item }) => {
          const mine = item.from === 'staff';
          return (
            <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, mine && { color: '#FFF' }]}>{item.text}</Text>
                <Text style={[styles.bubbleTime, mine && { color: 'rgba(255,255,255,0.7)' }]}>
                  {new Date(item.time).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={`Message ${parent.name.split(' ')[0]}...`}
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <TouchableOpacity onPress={send} style={[styles.sendBtn, !draft.trim() && { opacity: 0.5 }]} disabled={!draft.trim()}>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: '#FFF' },
  headerName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#FFF' },
  headerMeta: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  bubbleRow: { marginBottom: SPACING.sm, flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, ...SHADOW.sm },
  bubbleMine: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 19 },
  bubbleTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  input: { flex: 1, maxHeight: 110, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: FONTS.sizes.sm, color: COLORS.text },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
});
