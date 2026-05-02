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
const CREAM      = "#F7F2EB";
const NAVY       = "#081F5C";
const SKY        = "#BAD6EB";
const SKY_DIM    = "rgba(186,214,235,0.18)";
const SKY_BORDER = "rgba(186,214,235,0.35)";
const WHITE      = "#FFFFFF";
const INK        = "#081F5C";
const MUTED      = "rgba(8,31,92,0.45)";
const BORDER     = "rgba(8,31,92,0.10)";
const SURFACE    = "rgba(8,31,92,0.04)";
const WARM       = "#E8855A";
const WARM_DIM   = "rgba(232,133,90,0.12)";
const SUCCESS    = "#22A06B";
const SUCCESS_DIM= "rgba(34,160,107,0.12)";
const DANGER     = "#D94F4F";
const DANGER_DIM = "rgba(217,79,79,0.08)";
const DANGER_BDR = "rgba(217,79,79,0.20)";

export default function CustomerDashboard() {
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile]     = useState<any>(null);
  const [requests, setRequests]   = useState<any[]>([]);
  const [isWorker, setIsWorker] = useState<boolean | "pending">(false);


  const fetchData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.allSettled([
        apiRequest("/users/me", "GET"),
        apiRequest("/users/me/requests", "GET"),
      ]);
      if (profileRes.status === "fulfilled") {
  const user = profileRes.value;
  setProfile(user);

  setIsWorker(user?.is_worker); // now can be true / false / "pending"
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
    const user = await apiRequest("/users/me", "GET");

    const status = user?.is_worker;

    if (status === true) {
      router.push("/(worker-tabs)/dashboard");
    } else if (status === "pending") {
      router.push("/worker/verification");
    } else {
      router.push("/worker/become-worker");
    }

  } catch (err) {
    console.error("Worker Banner Error:", err);
  }
};

  useEffect(() => { fetchData(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout", style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
            router.replace("/auth/login");
          } catch (e) { console.error("Logout Error:", e); }
        },
      },
    ]);
  };

  // if (loading) {
  //   return (
  //     <View style={[styles.container, { justifyContent: "center" }]}>
  //       <ActivityIndicator size="large" color={NAVY} />
  //     </View>
  //   );
  // }

  const initials =
    profile?.fullName?.split(" ").map((n: any) => n[0]).join("").toUpperCase() || "??";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={NAVY} />}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarSub}>Your service hub</Text>
          <Text style={styles.dateLabel}>
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push("/customer/profile")}>
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.heroName}>{profile?.fullName || "User"}</Text>
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 {profile?.city || "Set Location"}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard icon="📦" value={requests.length}                                        label="Your Orders" color={NAVY}    bg={SKY_DIM}    border={SKY_BORDER} />
        <StatCard icon="🕒" value={requests.filter((r) => r.status !== "completed").length} label="Active"      color={WARM}    bg={WARM_DIM}   border="rgba(232,133,90,0.22)" />
      </View>

      {/* Worker Banner */}
      <TouchableOpacity style={styles.workerBanner} onPress={handleWorkerBannerPress} activeOpacity={0.85}>
        <View style={styles.workerBannerContent}>
          <Text style={{ fontSize: 26 }}>{isWorker ? "👷‍♂️" : "🚀"}</Text>
          <View>
           <Text style={styles.workerBannerTitle}>
  {isWorker === true
    ? "Switch to Worker Mode"
    : isWorker === "pending"
    ? "Check Status"
    : "Become a Worker"}
</Text>

            <Text style={styles.workerBannerSub}>{isWorker ? "Manage jobs, earnings & profile" : "Start earning by offering services"}</Text>
          </View>
        </View>
        <Text style={styles.workerBannerLink}>{isWorker ? "Open →" : "Apply →"}</Text>
      </TouchableOpacity>

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <TouchableOpacity onPress={() => router.push("/customer/history")}>
          <Text style={styles.sectionAccent}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityCard}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You haven't booked any services yet.</Text>
            <Text style={{ color: MUTED, marginTop: 6 }}>Tap "Book Now" to get started 🚀</Text>
          </View>
        ) : (
          requests.slice(0, 3).map((req, idx) => (
            <TouchableOpacity key={req.id || idx} style={styles.requestRow}>
              <View style={[styles.iconBox, { backgroundColor: req.status === "completed" ? SUCCESS_DIM : WARM_DIM }]}>
                <Text style={{ fontSize: 18 }}>{req.status === "completed" ? "✅" : "⏳"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reqTitle}>{req.service_type || "Service"}</Text>
                <Text style={styles.reqSub}>{req.date || "Just now"}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: req.status === "completed" ? SUCCESS_DIM : WARM_DIM }]}>
                <Text style={[styles.statusText, { color: req.status === "completed" ? SUCCESS : WARM }]}>
                  {req.status?.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Action Center */}
      <Text style={[styles.sectionTitle, { marginLeft: 22, marginTop: 20 }]}>ACTION CENTER</Text>
      <View style={styles.actionsGrid}>
        <ActionBtn emoji="🛠️" title="Book Now"  sub="Find a pro"  onPress={() => router.push("/(tabs)/home")} />
        <ActionBtn emoji="💳" title="Wallet"     sub="Payments"    onPress={() => {}} />
        <ActionBtn emoji="🎧" title="Support"    sub="Get help"    onPress={() => {}} />
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out Securely</Text>
      </TouchableOpacity>

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>Need help today?</Text>
        <Text style={styles.helpSub}>Book trusted professionals near you instantly.</Text>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, color, bg, border }: any) {
  return (
    <View style={[styles.statCard, { borderColor: border, backgroundColor: bg }]}>
      <View style={[styles.statIcon, { backgroundColor: WHITE }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function ActionBtn({ emoji, title, sub, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.8}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: CREAM },
  scrollContent:{ paddingBottom: 40 },

  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 22, paddingTop: 60, paddingBottom: 20,
  },
  topBarSub:  { color: MUTED, fontSize: 11, fontWeight: "600" },
  dateLabel:  { color: MUTED, fontSize: 12, marginTop: 2 },
  avatarBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: NAVY, justifyContent: "center", alignItems: "center",
    shadowColor: NAVY, shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarText: { color: WHITE, fontSize: 14, fontWeight: "700" },

  hero:         { paddingHorizontal: 22, marginBottom: 20 },
  greeting:     { color: MUTED, fontSize: 16, fontWeight: "500" },
  heroName:     { color: INK, fontSize: 32, fontWeight: "800", marginVertical: 4, letterSpacing: -0.5 },
  locationBadge:{
    alignSelf: "flex-start", backgroundColor: WHITE,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  locationText: { color: MUTED, fontSize: 13 },

  statsGrid:  { flexDirection: "row", paddingHorizontal: 22, gap: 14 },
  statCard: {
    flex: 1, padding: 16, borderRadius: 20, borderWidth: 1.5,
    flexDirection: "row", alignItems: "center", gap: 12,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statValue:  { fontSize: 22, fontWeight: "800" },
  statLabel:  { color: MUTED, fontSize: 12, marginTop: 1 },

  workerBanner: {
    marginHorizontal: 22, marginTop: 18,
    backgroundColor: NAVY, borderRadius: 24, padding: 20,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    shadowColor: NAVY, shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  workerBannerContent: { flexDirection: "row", gap: 14, alignItems: "center" },
  workerBannerTitle:   { color: WHITE, fontSize: 15, fontWeight: "800" },
  workerBannerSub:     { color: "rgba(186,214,235,0.7)", fontSize: 12, marginTop: 2 },
  workerBannerLink:    { color: SKY, fontSize: 13, fontWeight: "700" },

  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 22, marginTop: 28, marginBottom: 12,
  },
  sectionTitle:  { color: MUTED, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  sectionAccent: { color: NAVY, fontSize: 13, fontWeight: "700" },

  activityCard: {
    marginHorizontal: 22, backgroundColor: WHITE, borderRadius: 24,
    padding: 8, borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  requestRow: {
    flexDirection: "row", alignItems: "center", padding: 12, gap: 14,
    borderRadius: 16,
  },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  reqTitle:  { color: INK, fontSize: 15, fontWeight: "700" },
  reqSub:    { color: MUTED, fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText:  { fontSize: 10, fontWeight: "800" },
  emptyState:  { padding: 40, alignItems: "center" },
  emptyText:   { color: MUTED, fontSize: 14 },

  actionsGrid: { flexDirection: "row", paddingHorizontal: 22, gap: 12, marginTop: 14 },
  actionItem: {
    flex: 1, backgroundColor: WHITE, padding: 16, borderRadius: 20,
    alignItems: "center", borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionTitle: { color: INK, fontSize: 13, fontWeight: "700" },
  actionSub:   { color: MUTED, fontSize: 10, marginTop: 2 },

  logoutBtn: {
    marginHorizontal: 22, marginTop: 28, paddingVertical: 18,
    borderRadius: 20, backgroundColor: DANGER_DIM,
    borderWidth: 1, borderColor: DANGER_BDR, alignItems: "center",
  },
  logoutText: { color: DANGER, fontSize: 15, fontWeight: "700" },

  helpCard: {
    marginHorizontal: 22, marginTop: 10,
    backgroundColor: WHITE, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER,
  },
  helpTitle: { color: INK, fontWeight: "700", fontSize: 14 },
  helpSub:   { color: MUTED, fontSize: 12, marginTop: 4 },
});