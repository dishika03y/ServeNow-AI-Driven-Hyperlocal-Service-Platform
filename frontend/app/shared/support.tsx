import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { apiRequest } from "@/src/api/api";

const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";

export default function SupportScreen() {
  const [messages, setMessages] = useState<any[]>([]);

  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    // try {
    //   const data = await apiRequest(
    //     "/support/messages",
    //     "GET"
    //   );

    //   setMessages(data || []);
    // } catch {}
    return;
  };

  const send = async () => {
    if (!text.trim()) return;

    try {
      const msg = await apiRequest("/support/send", "POST", {
        message: text,
      });

      setMessages((prev) => [...prev, msg]);

      setText("");
    } catch {}
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bubble}>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message..."
        />

        <TouchableOpacity onPress={send}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },

  bubble: {
    backgroundColor: WHITE,
    margin: 12,
    padding: 16,
    borderRadius: 16,
  },

  inputRow: {
    flexDirection: "row",
    padding: 16,
  },

  input: {
    flex: 1,
  },
});
