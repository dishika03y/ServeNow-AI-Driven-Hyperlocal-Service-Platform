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
const GREEN = "#22A06B";

export default function CustomerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isWorker, setIsWorker] = useState<any>(false);
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
      const user = await apiRequest("/users/me", "GET");

      // ⚠️ COMMENT THIS (API NOT READY)
      // const bookingRes = await apiRequest("/users/me/bookings", "GET");

      // TEMP DUMMY DATA
      const bookingRes = {
        data: [
          { id: 1, service_type: "Plumbing", status: "completed" },
          { id: 2, service_type: "Cleaning", status: "ongoing" },
        ],
      };
      setProfile(user);

      setBookings(bookingRes.data || []);
      setIsWorker(user?.is_worker);
      const worker = await apiRequest("/workers/me", "GET");
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

  // ---------- DATA ----------
  const name =
    profile?.fullName || profile?.name || profile?.first_name || "User";

  const city = profile?.city || "Your location";

  const initials = name
    .split(" ")
    .map((x: string) => x[0])
    .join("");

  const total = bookings.length;
  const ongoing = bookings.filter((b) => b.status === "ongoing").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const activeBooking = bookings.find((b) => b.status === "ongoing");

  // ---------- HANDLERS ----------
  const handleWorker = () => {
    // already approved worker
    if (workerStatus === "APPROVED" || isLive === true) {
      router.push("/(worker-tabs)/dashboard");
      return;
    }

    // already applied (any stage in progress)
    if (
      workerStatus === "PENDING" ||
      workerStage === "BASIC_DETAILS_SUBMITTED" ||
      workerStage === "DOCUMENTS_UPLOADED" ||
      workerStage === "OCR_COMPLETED" ||
      workerStage === "FACE_COMPLETED" ||
      workerStage === "COMPLETED_AWAITING_REVIEW"
    ) {
      router.push("/worker/verification");
      return;
    }

    // new user
    router.push("/worker/become-worker");
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

        {/* ✅ FIXED ROUTE */}
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/(tabs)/User-profile")}
        >
          <Text style={{ color: WHITE }}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* PRIMARY CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={() => router.push("/(tabs)/All-Services")}
      >
        <Text style={styles.ctaText}>🛠️ Book a Service</Text>
      </TouchableOpacity>

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
          <Text style={styles.liveSub}>Track Now →</Text>
        </TouchableOpacity>
      )}

      {/* RECENT */}
      <Text style={styles.section}>Recent Activity</Text>

      {bookings.slice(0, 3).map((b) => (
        <View key={b.id} style={styles.card}>
          <Text style={styles.cardTitle}>{b.service_type}</Text>
          <Text style={styles.cardSub}>{b.status}</Text>
        </View>
      ))}

      {workerStage !== "NONE" && (
        <View style={styles.workerBanner}>
          <Text style={styles.workerBannerTitle}>Verification Status</Text>

          <Text style={styles.workerBannerText}>
            {workerStage === "DOCUMENTS_UPLOADED" &&
              "📄 Documents uploaded. OCR in progress..."}

            {workerStage === "OCR_COMPLETED" &&
              "✔ Aadhaar verified. Face verification pending..."}

            {workerStage === "FACE_COMPLETED" &&
              "✔ Face verification done. Awaiting admin review..."}

            {workerStage === "COMPLETED_AWAITING_REVIEW" &&
              "⏳ Under admin review..."}

          </Text>
        </View>
      )}

      {/* WORKER CTA */}
      <TouchableOpacity style={styles.worker} onPress={handleWorker}>
        <Text style={styles.workerTitle}>
          <Text style={styles.workerTitle}>
            {isWorker || workerStatus === "APPROVED"
              ? "👷 Open Worker Dashboard"
              : workerStage !== "NONE"
                ? "⏳ Worker Application In Progress"
                : "🚀 Become a Worker"}
          </Text>
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
  workerBanner: {
    backgroundColor: SKY,
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  
  workerBannerTitle: {
    color: NAVY,
    fontWeight: "800",
    fontSize: 16,
  },
  
  workerBannerText: {
    color: NAVY,
    marginTop: 6,
    fontSize: 14,
  },

  cta: {
    margin: 20,
    backgroundColor: NAVY,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  ctaText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 16,
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
});
