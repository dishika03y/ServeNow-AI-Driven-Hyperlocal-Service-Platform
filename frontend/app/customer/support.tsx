import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'support';
}

const SupportScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'customer' }]);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <FlatList
        style={styles.chatContainer}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'customer' ? styles.customer : styles.support]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', padding: 20 },
  chatContainer: { flex: 1, paddingHorizontal: 20 },
  message: { padding: 12, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  customer: { backgroundColor: '#2563EB', alignSelf: 'flex-end' },
  support: { backgroundColor: '#E2E8F0', alignSelf: 'flex-start' },
  messageText: { color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF' },
  input: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 14, height: 44 },
  sendButton: { marginLeft: 10, backgroundColor: '#2563EB', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  sendButtonText: { color: '#FFFFFF', fontWeight: '600' },
});

export default SupportScreen;
