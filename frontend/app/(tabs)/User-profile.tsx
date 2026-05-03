import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/src/api/api";

// COLORS
const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";
const DANGER = "#D94F4F";

export default async function CustomerProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isWorker, setIsWorker] = useState<any>(false);
  const [workerStatus, setWorkerStatus] = useState(null);

  const fetchData = async () => {
    try {
      const user = await apiRequest("/users/me", "GET");

      setProfile(user);
      setIsWorker(user?.is_worker);

      // 🚧 TEMP: stats API not ready
      // const statRes = await apiRequest("/users/me/stats", "GET");
      // setStats(statRes);
    } catch (error) {
      console.log("Fetch Error:", error);
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

  const worker = await apiRequest("/worker/me", "GET");
  setWorkerStatus(worker.status);
  const handleWorker = () => {
    console.log("STATUS:", workerStatus);

    if (isWorker === true || workerStatus === "APPROVED") {
      router.push("/(worker-tabs)/dashboard");
    } else if (workerStatus === "PENDING") {
      router.push("/worker/verification");
    } else {
      router.push("/worker/become-worker");
    }
  };
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      {
        text: "Logout",
        style: "destructive",

        onPress: async () => {
          await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

          router.replace("/auth/login");
        },
      },
    ]);
  };

  const initials =
    profile?.fullName
      ?.split(" ")
      .map((x: string) => x[0])
      .join("") || "U";

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>{profile?.fullName}</Text>

        <Text style={styles.location}>📍 {profile?.city}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <Stat value={stats?.total_bookings || 0} label="Bookings" />

        <Stat value={stats?.active_bookings || 0} label="Active" />

        <Stat value={stats?.completed_bookings || 0} label="Completed" />
      </View>

      {/* BECOME WORKER */}
      <TouchableOpacity
        style={styles.workerCard}
        onPress={handleWorker}
        activeOpacity={0.85}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 26 }}>{isWorker ? "👷‍♂️" : "🚀"}</Text>

          <View>
            <Text style={styles.workerTitle}>
              {isWorker === true
                ? "Switch to Worker Mode"
                : workerStatus === "PENDING"
                  ? "Check Status"
                  : "Become a Worker"}
            </Text>

            <Text style={styles.workerSub}>
              {isWorker === true
                ? "Manage jobs, earnings & profile"
                : "Start earning by offering services"}
            </Text>
          </View>
        </View>

        <Text style={{ color: "#BAD6EB", marginTop: 10, fontWeight: "600" }}>
          {isWorker === true ? "Open →" : "Apply →"}
        </Text>
      </TouchableOpacity>

      {/* MY SERVICES */}
      <Text style={styles.sectionTitle}>MY SERVICES</Text>

      <Menu
        icon="clipboard-outline"
        title="My Bookings"
        onPress={() => router.push("/customer/history")}
      />

      <Menu
        icon="time-outline"
        title="Track Current Job"
        onPress={() => router.push("/customer/live")}
      />

      <Menu
        icon="card-outline"
        title="Payments & Wallet"
        onPress={() => router.push("/customer/wallet")}
      />

      <Menu
        icon="heart-outline"
        title="Favorite Workers"
        onPress={() => router.push("/customer/favorites")}
      />

      {/* ACCOUNT */}
      <Text style={styles.sectionTitle}>ACCOUNT</Text>

      <Menu
        icon="person-outline"
        title="Edit Profile"
        onPress={() => router.push("/customer/edit-profile")}
      />

      {/* SETTINGS ADDED HERE */}
      <Menu
        icon="settings-outline"
        title="Settings"
        onPress={() => router.push("/shared/settings")}
      />

      <Menu
        icon="notifications-outline"
        title="Notifications"
        onPress={() => router.push("/customer/notifications")}
      />

      <Menu
        icon="log-out-outline"
        title="Logout"
        danger
        onPress={handleLogout}
      />
    </ScrollView>
  );
}

function Stat({ value, label }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Menu({ icon, title, onPress, danger = false }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={danger ? DANGER : NAVY} />

      <Text style={[styles.menuText, danger && { color: DANGER }]}>
        {title}
      </Text>

      <Ionicons name="chevron-forward" size={18} color={MUTED} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },

  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 30,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: NAVY,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 22,
  },

  name: {
    marginTop: 14,
    color: NAVY,
    fontSize: 22,
    fontWeight: "800",
  },

  location: {
    marginTop: 4,
    color: MUTED,
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  statValue: {
    color: NAVY,
    fontWeight: "800",
    fontSize: 22,
  },

  statLabel: {
    color: MUTED,
    marginTop: 4,
    fontSize: 12,
  },

  workerCard: {
    backgroundColor: NAVY,
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  workerTitle: {
    color: WHITE,
    fontWeight: "800",
  },

  workerSub: {
    color: "#BAD6EB",
    marginTop: 4,
  },

  sectionTitle: {
    marginTop: 28,
    marginLeft: 20,
    marginBottom: 12,
    color: MUTED,
    fontWeight: "700",
    fontSize: 11,
  },

  menuItem: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },

  menuText: {
    flex: 1,
    marginLeft: 14,
    color: NAVY,
    fontWeight: "600",
  },
});
