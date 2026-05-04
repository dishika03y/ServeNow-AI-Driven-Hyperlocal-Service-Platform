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

export default function UserProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
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

  const fetchData = async () => {
    try {
      const user = await apiRequest("/users/me", "GET");

      setProfile(user);
      setIsWorker(user?.is_worker);

      if (user?.is_worker) {
        try {
          const worker = await apiRequest("/workers/me", "GET");

          setWorkerStatus(worker?.status || "NONE");
          setWorkerStage(worker?.verificationStage || "NONE");
        } catch {
          setWorkerStatus("NONE");
          setWorkerStage("NONE");
        }
      } else {
        setWorkerStatus("NONE");
        setWorkerStage("NONE");
      }
    } catch (error) {
      console.log("Profile Fetch Error:", error);
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

  // Worker navigation logic
  const handleWorkerPress = () => {
    if (workerStatus === "APPROVED") {
      router.push("/(worker-tabs)/dashboard");
    } else if (workerStatus === "PENDING" || workerStage !== "NONE") {
      router.push("/worker/verification");
    } else {
      router.push("/worker/become-worker");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
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
      .join("")
      .toUpperCase() || "U";

  // Dynamic UI text based on FULL verification pipeline
  const getWorkerTitle = () => {
    if (workerStatus === "APPROVED") return "👷 Worker Dashboard";

    if (workerStage === "DOCUMENTS_UPLOADED") return "📄 Documents Uploaded";

    if (workerStage === "OCR_COMPLETED") return "🪪 Aadhaar Verified";

    if (workerStage === "FACE_COMPLETED") return "🧠 Face Verified";

    if (workerStage === "COMPLETED_AWAITING_REVIEW")
      return "⏳ Awaiting Admin Review";

    if (workerStatus === "PENDING") return "⏳ Application Pending";

    return "🚀 Become a Worker";
  };

  const getWorkerSub = () => {
    if (workerStatus === "APPROVED") return "Manage your jobs and earnings";

    if (workerStage === "DOCUMENTS_UPLOADED")
      return "Documents uploaded. Processing verification...";

    if (workerStage === "OCR_COMPLETED")
      return "Aadhaar verified. Next: Face verification";

    if (workerStage === "FACE_COMPLETED")
      return "Face verified. Waiting for admin review";

    if (workerStage === "COMPLETED_AWAITING_REVIEW")
      return "Under review by admin team";

    if (workerStatus === "PENDING") return "Complete your verification process";

    return "Start earning by offering services";
  };

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

        <Text style={styles.name}>{profile?.fullName || "User"}</Text>

        <Text style={styles.location}>📍 {profile?.city || "Unknown"}</Text>
      </View>

      {/* WORKER SECTION */}
      <TouchableOpacity
        style={styles.workerCard}
        onPress={handleWorkerPress}
        activeOpacity={0.85}
      >
        <Text style={styles.workerTitle}>{getWorkerTitle()}</Text>

        <Text style={styles.workerSub}>{getWorkerSub()}</Text>
      </TouchableOpacity>

      {/* SERVICES */}
      <Text style={styles.sectionTitle}>MY ACTIVITY</Text>

      <Menu
        icon="clipboard-outline"
        title="My Bookings"
        onPress={() => router.push("/customer/history")}
      />

      <Menu
        icon="time-outline"
        title="Track Active Booking"
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

function Menu({ icon, title, onPress, danger = false }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={danger ? DANGER : NAVY} />

      <Text style={[styles.menuText, danger && { color: DANGER }]}>
        {title}
      </Text>

      <Ionicons name="chevron-forward" size={18} color="gray" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM },

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

  workerCard: {
    backgroundColor: NAVY,
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  workerTitle: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 16,
  },

  workerSub: {
    color: "#BAD6EB",
    marginTop: 6,
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
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
