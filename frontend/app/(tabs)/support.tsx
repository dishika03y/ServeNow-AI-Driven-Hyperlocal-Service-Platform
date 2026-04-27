import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useRef } from 'react';

const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const ACCENT      = '#00D68F';
const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
const SURFACE     = 'rgba(255,255,255,0.04)';
const SURFACE_MID = 'rgba(255,255,255,0.07)';
const BORDER      = 'rgba(255,255,255,0.08)';
const TEXT        = '#EEF4FA';
const MUTED       = 'rgba(200,220,235,0.55)';
const BUBBLE_IN   = '#163552';
const BUBBLE_OUT  = '#00D68F';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'support';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    text: 'Hi! 👋 Welcome to WorkerOS support. How can we help you today?',
    sender: 'support',
    time: '10:00 AM',
  },
];

const AUTO_REPLIES = [
  "Thanks for reaching out! Our team will get back to you shortly.",
  "Got it! Let me check that for you.",
  "We're looking into this — usually takes under 2 minutes.",
  "Could you share your booking ID so we can assist faster?",
];

const SupportScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const now = () => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${ampm}`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'customer',
      time: now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: 'support',
        time: now(),
      };
      setMessages((prev) => [...prev, reply]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 900);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appLabel}>WorkerOS</Text>
        <View style={styles.agentRow}>
          <View style={styles.agentAvatar}>
            <Text style={styles.agentInitials}>WO</Text>
          </View>
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>Support Team</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chat area */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListHeaderComponent={
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>Today</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isCustomer = item.sender === 'customer';
          return (
            <View style={[styles.bubbleRow, isCustomer ? styles.rowRight : styles.rowLeft]}>
              {!isCustomer && (
                <View style={styles.supportAvatarSmall}>
                  <Text style={styles.supportAvatarText}>W</Text>
                </View>
              )}
              <View style={styles.bubbleCol}>
                <View
                  style={[
                    styles.bubble,
                    isCustomer ? styles.bubbleCustomer : styles.bubbleSupport,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isCustomer ? styles.bubbleTextCustomer : styles.bubbleTextSupport,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
                <Text style={[styles.timeText, isCustomer ? styles.timeRight : styles.timeLeft]}>
                  {item.time}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message…"
          placeholderTextColor={MUTED}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          activeOpacity={0.8}
          disabled={!input.trim()}
        >
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: NAVY,
  },

  // TOP BAR
  topBar: {
    backgroundColor: NAVY_MID,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 14,
    gap: 14,
  },
  appLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentInitials: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
  agentInfo: {
    gap: 3,
  },
  agentName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT,
  },
  onlineText: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: '600',
  },

  // CHAT
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 4,
  },
  datePill: {
    alignSelf: 'center',
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  datePillText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    gap: 8,
  },
  rowLeft:  { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  supportAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  supportAvatarText: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: '700',
  },
  bubbleCol: {
    maxWidth: '75%',
    gap: 3,
  },
  bubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleCustomer: {
    backgroundColor: BUBBLE_OUT,
    borderBottomRightRadius: 4,
  },
  bubbleSupport: {
    backgroundColor: BUBBLE_IN,
    borderWidth: 1,
    borderColor: BORDER,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextCustomer: {
    color: NAVY,
    fontWeight: '500',
  },
  bubbleTextSupport: {
    color: TEXT,
  },
  timeText: {
    fontSize: 10,
    color: MUTED,
  },
  timeLeft:  { alignSelf: 'flex-start', marginLeft: 4 },
  timeRight: { alignSelf: 'flex-end',   marginRight: 4 },

  // INPUT BAR
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: NAVY_MID,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  input: {
    flex: 1,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: TEXT,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
  },
  sendBtnText: {
    color: NAVY,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
});