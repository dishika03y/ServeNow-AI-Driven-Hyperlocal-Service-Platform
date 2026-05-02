import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { apiRequest } from "@/src/api/api";

const NAVY = "#081F5C";
const SKY = "#BAD6EB";
const WHITE = "#FFFFFF";
const DANGER = "#D94F4F";

export default function FloatingSupport() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadUnread();
  }, []);

  const loadUnread = async () => {
    try {
      const data = await apiRequest(
        "/support/unread-count",
        "GET"
      );

      setCount(data?.count || 0);
    } catch {}
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.container}
      onPress={() =>
        router.push("/shared/support")
      }
    >
      <Ionicons
        name="chatbubble-ellipses"
        size={24}
        color={WHITE}
      />

      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 95,
    right: 20,

    width: 58,
    height: 58,
    borderRadius: 20,

    backgroundColor: NAVY,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: NAVY,
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 8,
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,

    minWidth: 20,
    height: 20,

    borderRadius: 10,

    backgroundColor: DANGER,

    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: "700",
  },
});