import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/src/api/api";

// COLORS (same as your profile screen)
const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";
const SUCCESS = "#2E7D32";

// 🧪 fallback static data
const STATIC_HISTORY = [
  {
    id: 1,
    service: "House Cleaning",
    worker: "Ravi Kumar",
    date: "12 May 2026",
    status: "Completed",
    price: "₹499",
  },
  {
    id: 2,
    service: "Electric Repair",
    worker: "Amit Singh",
    date: "10 May 2026",
    status: "Completed",
    price: "₹299",
  },
  {
    id: 3,
    service: "Plumbing",
    worker: "Suresh Yadav",
    date: "08 May 2026",
    status: "Completed",
    price: "₹399",
  },
];

export default function CustomerHistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await apiRequest("/customer/history", "GET");

      // adjust based on your backend response shape
      setHistory(res || []);
    } catch (error) {
      console.log("History API failed, using static data");

      // fallback
      setHistory(STATIC_HISTORY);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>My Booking History</Text>

      {history.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}

function HistoryCard({ item }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.service}>{item.service}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <Text style={styles.worker}>👨‍🔧 {item.worker}</Text>

      <View style={styles.row}>
        <Text style={styles.date}>{item.date}</Text>

        <Text style={styles.status}>
          ● {item.status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    paddingTop: 60,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  service: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
  },

  worker: {
    marginTop: 6,
    color: MUTED,
  },

  date: {
    marginTop: 10,
    fontSize: 12,
    color: MUTED,
  },

  status: {
    marginTop: 10,
    fontSize: 12,
    color: SUCCESS,
    fontWeight: "600",
  },
});