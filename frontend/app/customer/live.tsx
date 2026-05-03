import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/src/api/api";

// COLORS (same as your system)
const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";
const SUCCESS = "#2E7D32";
const WARNING = "#F59E0B";

// 🧪 fallback data
const STATIC_LIVE = {
  id: 1,
  service: "AC Repair",
  worker: "Ravi Technician",
  status: "On the way",
  eta: "15 mins",
  date: "Today",
  price: "₹599",
};

export default function CustomerLiveScreen() {
  const [booking, setBooking] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLive = async () => {
    try {
      const res = await apiRequest("/customer/live", "GET");

      // adjust based on backend
      if (!res) {
        setBooking(null);
      } else {
        setBooking(res.data);
      }
    } catch (error) {
      console.log("Live API failed, using static fallback");

      setBooking(STATIC_LIVE);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLive();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLive();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Live Booking</Text>

      {!booking ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No active booking</Text>
        </View>
      ) : (
        <LiveCard booking={booking} />
      )}
    </ScrollView>
  );
}

function LiveCard({ booking }: any) {
  return (
    <View style={styles.card}>
      {/* TOP ROW */}
      <View style={styles.row}>
        <Text style={styles.service}>{booking.service}</Text>
        <Text style={styles.price}>{booking.price}</Text>
      </View>

      {/* WORKER */}
      <Text style={styles.worker}>👨‍🔧 {booking.worker}</Text>

      {/* STATUS */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>● {booking.status}</Text>
      </View>

      {/* EXTRA INFO */}
      <View style={styles.row}>
        <Text style={styles.meta}>{booking.date}</Text>
        <Text style={styles.meta}>ETA: {booking.eta}</Text>
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
    borderRadius: 20,
    padding: 20,
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
    fontWeight: "800",
    color: NAVY,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
  },

  worker: {
    marginTop: 8,
    color: MUTED,
  },

  statusBox: {
    marginTop: 14,
    backgroundColor: "#FFF7ED",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  statusText: {
    color: WARNING,
    fontWeight: "700",
    fontSize: 12,
  },

  meta: {
    marginTop: 14,
    fontSize: 12,
    color: MUTED,
  },

  emptyBox: {
    marginHorizontal: 20,
    padding: 30,
    backgroundColor: WHITE,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  emptyText: {
    color: MUTED,
    fontWeight: "600",
  },
});
