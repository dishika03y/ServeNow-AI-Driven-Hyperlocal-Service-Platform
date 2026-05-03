import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/src/api/api";

const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";

// fallback
const STATIC_NOTIFICATIONS = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your cleaning service is scheduled",
    time: "2 hrs ago",
  },
  {
    id: 2,
    title: "Worker Assigned",
    message: "Ravi is on the way",
    time: "1 hr ago",
  },
];

export default function NotificationsScreen() {
  const [list, setList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await apiRequest("/customer/notifications", "GET");
      setList(res.data || []);
    } catch {
      setList(STATIC_NOTIFICATIONS);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Notifications</Text>

      {list.map((n) => (
        <View key={n.id} style={styles.card}>
          <Text style={styles.nTitle}>{n.title}</Text>
          <Text style={styles.message}>{n.message}</Text>
          <Text style={styles.time}>{n.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM, paddingTop: 60 },

  title: {
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },

  card: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  nTitle: { fontWeight: "700", color: NAVY },
  message: { marginTop: 4, color: MUTED },
  time: { marginTop: 6, fontSize: 12, color: MUTED },
});