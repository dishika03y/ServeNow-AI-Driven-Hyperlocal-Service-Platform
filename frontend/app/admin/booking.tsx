import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Booking = {
  _id: string;
  service: string;
  userName: string;
  workerName?: string;
  price: number;
  status: string; // keep string to avoid backend mismatch crashes
};

const TABS: { key: "all" | BookingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BookingsScreen() {
  const [data, setData] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"all" | BookingStatus>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 NORMALIZE STATUS
  const normalizeStatus = (status: string): BookingStatus =>
    status?.toLowerCase() as BookingStatus;

  // 🔥 FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(
        "https://servenow-ai-driven-hyperlocal-service.onrender.com/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await res.json();
      console.log("BOOKINGS API:", json);

      const list = Array.isArray(json) ? json : json?.data || [];

      setData(list);
    } catch (e) {
      console.log("Fetch error:", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔄 REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      await fetch(
        `https://servenow-ai-driven-hyperlocal-service.onrender.com/admin/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      fetchBookings();
    } catch (e) {
      console.log("Update error:", e);
    }
  };

  // 🔎 FILTER (FIXED)
  const filtered =
    tab === "all"
      ? data
      : data.filter((b) => normalizeStatus(b.status) === tab);

  const statusColor = (s: string) => {
    switch (normalizeStatus(s)) {
      case "pending":
        return "#FF9800";
      case "confirmed":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#999";
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 TABS */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.activeTab]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && { color: "#fff" }]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item._id || index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No bookings found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>🔧 {item.service}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>

            <Text>👤 {item.userName}</Text>
            <Text style={styles.sub}>
              🧑‍🔧 {item.workerName || "Not Assigned"}
            </Text>

            <Text style={[styles.status, { color: statusColor(item.status) }]}>
              {normalizeStatus(item.status).toUpperCase()}
            </Text>

            {/* 🔥 ACTIONS */}
            {normalizeStatus(item.status) === "pending" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.green}
                  onPress={() => updateStatus(item._id, "confirmed")}
                >
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.red}
                  onPress={() => updateStatus(item._id, "cancelled")}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {normalizeStatus(item.status) === "confirmed" && (
              <TouchableOpacity
                style={styles.blue}
                onPress={() => updateStatus(item._id, "completed")}
              >
                <Text style={styles.btnText}>Mark Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },

  activeTab: {
    backgroundColor: "#0B2239",
  },

  tabText: {
    fontSize: 12,
    color: "#333",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "600",
  },

  price: {
    fontWeight: "700",
    color: "#0B2239",
  },

  sub: {
    color: "#777",
    fontSize: 12,
  },

  status: {
    marginTop: 6,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  green: {
    backgroundColor: "#00C853",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },

  red: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 8,
  },

  blue: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 13,
  },
});
