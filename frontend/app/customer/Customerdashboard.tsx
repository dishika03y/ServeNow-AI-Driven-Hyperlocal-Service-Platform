import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/src/api/api";

const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const CREAM = "#F7F2EB";
const MUTED = "rgba(8,31,92,0.5)";
const SKY = "#BAD6EB";

export default function CustomerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [isWorker, setIsWorker] = useState(false);
  const [workerStatus, setWorkerStatus] = useState<
    "NONE" | "PENDING" | "APPROVED"
  >("NONE");

  const [workerStage, setWorkerStage] = useState<
    | "NONE"
    | "BASIC_DETAILS_SUBMITTED"
    | "DOCUMENTS_UPLOADED"
    | "OCR_COMPLETED"
    | "FACE_COMPLETED"
    | "COMPLETED_AWAITING_REVIEW"
  >("NONE");

  const [isLive, setIsLive] = useState(false);

  const fetchData = async () => {
    try {
      const [user, bookingRes, worker] = await Promise.all([
        apiRequest("/users/me", "GET"),
        apiRequest("/users/me/bookings", "GET"),
        apiRequest("/workers/me", "GET"),
      ]);

      setProfile(user);

      setBookings(bookingRes?.data || []);

      setIsWorker(user?.is_worker);

      setWorkerStatus(worker?.status || "NONE");
      setWorkerStage(worker?.verificationStage || "NONE");
      setIsLive(worker?.isLive || false);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const name =
    profile?.fullName || profile?.name || profile?.first_name || "User";

  const city = profile?.city || "Your location";

  const initials =
    name
      ?.split(" ")
      .map((x: string) => x[0])
      .join("") || "U";

  const total = bookings.length;
  const ongoing = bookings.filter((b) => b.status === "ongoing").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const activeBooking = bookings.find((b) => b.status === "ongoing");

  const handleWorker = () => {
    if (workerStatus === "APPROVED" || isLive) {
      router.push("/(worker-tabs)/dashboard");
      return;
    }

    if (workerStatus === "PENDING" || workerStage !== "NONE") {
      router.push("/worker/verification");
      return;
    }

    router.push("/worker/become-worker");
  };

  const getWorkerBannerText = () => {
    switch (workerStage) {
      case "DOCUMENTS_UPLOADED":
        return "📄 Documents uploaded. OCR in progress...";
      case "OCR_COMPLETED":
        return "✔ Aadhaar verified. Face verification pending...";
      case "FACE_COMPLETED":
        return "✔ Face verification done. Awaiting admin review...";
      case "COMPLETED_AWAITING_REVIEW":
        return "⏳ Under admin review...";
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: CREAM }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>👋 Welcome</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.location}>📍 {city}</Text>
        </View>

        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/(tabs)/User-profile")}
        >
          <Text style={{ color: WHITE }}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.row}>
        <Stat label="Total" value={total} />
        <Stat label="Ongoing" value={ongoing} />
        <Stat label="Completed" value={completed} />
      </View>

      {/* LIVE BOOKING */}
      {activeBooking && (
        <TouchableOpacity
          style={styles.liveCard}
          onPress={() => router.push("/customer/live")}
        >
          <Text style={styles.liveTitle}>🔴 Ongoing Service</Text>
          <Text style={styles.liveSub}>{activeBooking.service_type}</Text>
        </TouchableOpacity>
      )}

      {/* VERIFICATION BANNER */}
      {workerStage !== "NONE" && (
        <View style={styles.workerBanner}>
          <Text style={styles.workerBannerTitle}>Verification Status</Text>
          <Text style={styles.workerBannerText}>{getWorkerBannerText()}</Text>
        </View>
      )}

      {/* RECENT */}
      <Text style={styles.section}>Recent Activity</Text>

      {bookings.slice(0, 3).map((b) => (
        <View key={b.id} style={styles.card}>
          <Text style={styles.cardTitle}>{b.service_type}</Text>
          <Text style={styles.cardSub}>{b.status}</Text>
        </View>
      ))}

      {/* WORKER CTA */}
      <TouchableOpacity style={styles.worker} onPress={handleWorker}>
        <Text style={styles.workerTitle}>
          {workerStatus === "APPROVED"
            ? "👷 Open Worker Dashboard"
            : workerStage !== "NONE"
              ? "⏳ Application In Progress"
              : "🚀 Become a Worker"}
        </Text>

        <Text style={styles.workerSub}>Earn money by offering services</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Stat({ label, value }: any) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  greeting: { color: MUTED },
  name: { fontSize: 26, fontWeight: "800", color: NAVY },
  location: { color: MUTED, marginTop: 4 },

  avatar: {
    backgroundColor: NAVY,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 10,
  },

  stat: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },

  statLabel: {
    color: MUTED,
    fontSize: 12,
  },

  liveCard: {
    backgroundColor: NAVY,
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },

  liveTitle: { color: WHITE, fontWeight: "800" },
  liveSub: { color: SKY, marginTop: 6 },

  section: {
    margin: 20,
    fontWeight: "700",
    color: MUTED,
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },

  cardTitle: {
    color: NAVY,
    fontWeight: "700",
  },

  cardSub: {
    color: MUTED,
  },

  worker: {
    margin: 20,
    backgroundColor: WHITE,
    padding: 18,
    borderRadius: 16,
  },

  workerTitle: {
    color: NAVY,
    fontWeight: "800",
  },

  workerSub: {
    color: MUTED,
    marginTop: 4,
  },

  workerBanner: {
    backgroundColor: SKY,
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  workerBannerTitle: {
    color: NAVY,
    fontWeight: "800",
  },

  workerBannerText: {
    color: NAVY,
    marginTop: 6,
  },
});
