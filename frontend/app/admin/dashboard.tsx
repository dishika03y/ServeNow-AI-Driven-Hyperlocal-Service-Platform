import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DashboardStats = {
  total_users: number;
  total_workers: number;
  pending_workers: number;
  approved_workers: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_workers: 0,
    pending_workers: 0,
    approved_workers: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(
        "https://servenow-ai-driven-hyperlocal-service.onrender.com/admin/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("Dashboard:", data);

      setStats(data);
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* 🔷 HEADER */}
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* 📊 MAIN STATS */}
      <View style={styles.grid}>
        <StatCard label="Total Users" value={stats.total_users} />
        <StatCard label="Total Workers" value={stats.total_workers} />
        <StatCard
          label="Pending Approvals"
          value={stats.pending_workers}
          highlight
        />
        <StatCard label="Today Bookings" value="45" />
      </View>

      {/* ⚡ URGENT ACTIONS */}
      <Text style={styles.sectionTitle}>⚡ Urgent Actions</Text>

      <TouchableOpacity
        style={styles.alertCard}
        onPress={() => router.push("/admin/workers")}
      >
        <Text style={styles.alertText}>
          ⚠️ {stats.pending_workers} Workers Pending Approval
        </Text>
        <Text
          style={styles.linkText}
          onPress={() => router.push("/admin/workers")}
        >
          Review Now →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.alertCard}>
        <Text style={styles.alertText}>🚨 5 Workers Reported</Text>
        <Text style={styles.linkText} onPress={() => router.push("/admin/reports")}>
          Check Reports →
        </Text>
      </TouchableOpacity>

      {/* 📈 TODAY PERFORMANCE */}
      <Text style={styles.sectionTitle}>📈 Today Performance</Text>

      <View style={styles.grid}>
        <StatCard label="Completed Jobs" value="30" />
        <StatCard label="Cancelled Jobs" value="5" />
        <StatCard label="Pending Jobs" value="10" />
      </View>

      {/* 💰 EARNINGS */}
      <Text style={styles.sectionTitle}>💰 Earnings</Text>

      <View style={styles.grid}>
        <StatCard label="Today Revenue" value="₹12.5K" />
        <StatCard label="Total Earnings" value="₹2.3L" />
      </View>

      {/* 🚨 SYSTEM ALERTS */}
      <Text style={styles.sectionTitle}>🚨 System Alerts</Text>

      <View style={styles.activityCard}>
        <Text style={styles.alertText}>⚠️ 3 Failed Payments</Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.alertText}>⚠️ High Cancellation Rate</Text>
      </View>

      {/* 📋 RECENT ACTIVITY */}
      <Text style={styles.sectionTitle}>📋 Recent Activity</Text>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>🟢 New worker registered</Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>✅ Worker approved</Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>❌ Worker rejected</Text>
      </View>
    </ScrollView>
  );
}

/* 🔹 REUSABLE STAT CARD */
function StatCard({ label, value, highlight = false }: any) {
  return (
    <View style={[styles.card, highlight && styles.highlightCard]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardNumber}>{value}</Text>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1A1A1A",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#1A1A1A",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },

  highlightCard: {
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },

  cardLabel: {
    fontSize: 14,
    color: "#666",
  },

  cardNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
    color: "#0A2A66",
  },

  alertCard: {
    backgroundColor: "#FFECEC",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },

  alertText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D32F2F",
  },

  linkText: {
    marginTop: 4,
    color: "#0A2A66",
    fontWeight: "600",
  },

  activityCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },

  activityText: {
    fontSize: 14,
    color: "#444",
  },
});
