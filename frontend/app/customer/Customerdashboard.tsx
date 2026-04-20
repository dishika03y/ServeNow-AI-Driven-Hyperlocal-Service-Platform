import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/src/api/api";

// --- Design tokens ---
const NAVY = "#0B2239";
const ACCENT = "#00D68F";
const ACCENT_DIM = "rgba(0,214,143,0.12)";
const SKY = "#52B4FF";
const SKY_DIM = "rgba(82,180,255,0.12)";
const WARM = "#FF8C42";
const WARM_DIM = "rgba(255,140,66,0.12)";
const SURFACE = "rgba(255,255,255,0.04)";
const SURFACE_MID = "rgba(255,255,255,0.07)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#EEF4FA";
const MUTED = "rgba(200,220,235,0.55)";
const DANGER = "#FF4D4D";
const DANGER_DIM = "rgba(255,77,77,0.10)";
const DANGER_BDR = "rgba(255,77,77,0.22)";

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isWorker, setIsWorker] = useState(false); // Added to check worker status

  const fetchData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.allSettled([
        apiRequest("/users/me", "GET"),
        apiRequest("/users/me/requests", "GET"),
      ]);

      if (profileRes.status === "fulfilled") {
        const user = profileRes.value;

        console.log("USER DATA:", user); //debug log to verify data structure

        setProfile(user);

        setIsWorker(user?.is_worker === true);
      }

      if (requestsRes.status === "fulfilled") {
        setRequests(requestsRes.value.data || []);
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWorkerBannerPress = async () => {
    try {
      const workerProfile = await apiRequest("/workers/me", "GET");
      console.log("WORKER PROFILE:", workerProfile);
      console.log("VERIFICATION STAGE:", workerProfile?.verificationStage);

      if (workerProfile?.verificationStage === "BASIC_DETAILS_SUBMITTED") {
        router.push("/worker/verification");
      } else if (
        workerProfile?.verificationStage === "COMPLETED_AWAITING_REVIEW"
      ) {
        Alert.alert("Under Review", "Your profile is under review.");
      } else {
        router.push("/worker/verification");
      }
    } catch (err: any) {
      router.push("/worker/become-worker");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear the actual keys used in LoginScreen
            await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

            // Use replace to ensure the user cannot "Go Back" to the dashboard
            router.replace("/auth/login");
          } catch (e) {
            console.error("Logout Error:", e);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const initials =
    profile?.fullName
      ?.split(" ")
      .map((n: any) => n[0])
      .join("")
      .toUpperCase() || "??";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={ACCENT}
        />
      }
    >
      {/* --- Top Bar --- */}
      <View style={styles.topBar}>
        <View>
          <Text style={{ color: MUTED, fontSize: 11 }}>Your service hub</Text>
          <Text style={styles.dateLabel}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push("/customer/profile")}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* --- Hero Section --- */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.heroName}>{profile?.fullName || "User"}</Text>
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>
            📍 {profile?.city || "Set Location"}
          </Text>
        </View>
      </View>

      {/* --- Stats Cards --- */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="📦"
          value={requests.length}
          label="Your Orders"
          color={SKY}
          bg={SKY_DIM}
        />
        <StatCard
          icon="🕒"
          value={requests.filter((r) => r.status !== "completed").length}
          label="Active"
          color={WARM}
          bg={WARM_DIM}
        />
      </View>

      <TouchableOpacity
        style={styles.workerBanner}
        onPress={handleWorkerBannerPress}
      >
        <View style={styles.workerBannerContent}>
          <Text style={{ fontSize: 26 }}>{isWorker ? "👷‍♂️" : "🚀"}</Text>

          <View>
            <Text style={styles.workerBannerTitle}>
              {isWorker ? "Switch to Worker Mode" : "Become a Worker"}
            </Text>

            <Text style={styles.workerBannerSub}>
              {isWorker
                ? "Manage jobs, earnings & profile"
                : "Start earning by offering services"}
            </Text>
          </View>
        </View>

        <Text style={styles.workerBannerLink}>
          {isWorker ? "Open →" : "Apply →"}
        </Text>
      </TouchableOpacity>

      {/* --- Recent Activity --- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <TouchableOpacity onPress={() => router.push("/customer/history")}>
          <Text style={styles.sectionAccent}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityCard}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You haven’t booked any services yet.
            </Text>
            <Text style={{ color: MUTED, marginTop: 6 }}>
              Tap “Book Now” to get started 🚀
            </Text>
          </View>
        ) : (
          requests.slice(0, 3).map((req, idx) => (
            <TouchableOpacity key={req.id || idx} style={styles.requestRow}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      req.status === "completed" ? ACCENT_DIM : WARM_DIM,
                  },
                ]}
              >
                <Text style={{ fontSize: 18 }}>
                  {req.status === "completed" ? "✅" : "⏳"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reqTitle}>
                  {req.service_type || "Service"}
                </Text>
                <Text style={styles.reqSub}>{req.date || "Just now"}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text
                  style={[
                    styles.statusText,
                    { color: req.status === "completed" ? ACCENT : WARM },
                  ]}
                >
                  {req.status?.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* --- Action Center --- */}
      <Text style={[styles.sectionTitle, { marginLeft: 22, marginTop: 20 }]}>
        ACTION CENTER
      </Text>
      <View style={styles.actionsGrid}>
        <ActionBtn
          emoji="🛠️"
          title="Book Now"
          sub="Find a pro"
          onPress={() => router.push("/(tabs)/home")}
        />
        <ActionBtn
          emoji="💳"
          title="Wallet"
          sub="Payments"
          onPress={() => {}}
        />
        <ActionBtn
          emoji="🎧"
          title="Support"
          sub="Get help"
          onPress={() => {}}
        />
      </View>

      {/* --- Sign Out --- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out Securely</Text>
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: 22,
          marginTop: 10,
          backgroundColor: SURFACE,
          padding: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: BORDER,
        }}
      >
        <Text style={{ color: TEXT, fontWeight: "700" }}>Need help today?</Text>
        <Text style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>
          Book trusted professionals near you instantly.
        </Text>
      </View>
    </ScrollView>
  );
}

// --- Helpers ---
function StatCard({ icon, value, label, color, bg }: any) {
  return (
    <View style={[styles.statCard, { borderColor: BORDER }]}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View>
        <Text style={[styles.statValue, { color: TEXT }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function ActionBtn({ emoji, title, sub, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 40 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 20,
  },
  appLabel: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  dateLabel: { color: MUTED, fontSize: 12, marginTop: 2 },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: TEXT, fontSize: 14, fontWeight: "700" },
  hero: { paddingHorizontal: 22, marginBottom: 20 },
  greeting: { color: MUTED, fontSize: 16, fontWeight: "500" },
  heroName: { color: TEXT, fontSize: 32, fontWeight: "800", marginVertical: 4 },
  locationBadge: {
    alignSelf: "flex-start",
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  locationText: { color: MUTED, fontSize: 13 },
  statsGrid: { flexDirection: "row", paddingHorizontal: 22, gap: 15 },
  statCard: {
    flex: 1,
    backgroundColor: SURFACE,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { color: MUTED, fontSize: 12 },

  // New Worker Banner Styles
  workerBanner: {
    marginHorizontal: 22,
    marginTop: 25,
    backgroundColor: "rgba(0, 214, 143, 0.08)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 214, 143, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workerBannerContent: { flexDirection: "row", gap: 15, alignItems: "center" },
  workerBannerTitle: { color: TEXT, fontSize: 16, fontWeight: "800" },
  workerBannerSub: { color: MUTED, fontSize: 12, marginTop: 2 },
  workerBannerLink: { color: ACCENT, fontSize: 13, fontWeight: "700" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  sectionAccent: { color: ACCENT, fontSize: 13, fontWeight: "600" },
  activityCard: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 15,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  reqTitle: { color: TEXT, fontSize: 15, fontWeight: "700" },
  reqSub: { color: MUTED, fontSize: 12, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  statusText: { fontSize: 10, fontWeight: "800" },
  emptyState: { padding: 40, alignItems: "center" },
  emptyText: { color: MUTED, fontSize: 14 },
  actionsGrid: {
    flexDirection: "row",
    paddingHorizontal: 22,
    gap: 12,
    marginTop: 15,
  },
  actionItem: {
    flex: 1,
    backgroundColor: SURFACE_MID,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  actionTitle: { color: TEXT, fontSize: 13, fontWeight: "700" },
  actionSub: { color: MUTED, fontSize: 10, marginTop: 2 },
  logoutBtn: {
    marginHorizontal: 22,
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: DANGER_DIM,
    borderWidth: 1,
    borderColor: DANGER_BDR,
    alignItems: "center",
  },
  logoutText: { color: DANGER, fontSize: 15, fontWeight: "700" },
});
