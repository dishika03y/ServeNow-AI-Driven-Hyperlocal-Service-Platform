import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* 🔷 HEADER */}
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* 📊 MAIN STATS */}
      <View style={styles.grid}>
        <StatCard label="Total Users" value="1200" />
        <StatCard label="Total Workers" value="320" />
        <StatCard label="Pending Approvals" value="18" highlight />
        <StatCard label="Today Bookings" value="45" />
      </View>

      {/* ⚡ URGENT ACTIONS */}
      <Text style={styles.sectionTitle}>⚡ Urgent Actions</Text>

      <TouchableOpacity
        style={styles.alertCard}
        onPress={() => router.push("/admin/workers?tab=pending")}
      >
        <Text style={styles.alertText}>
          ⚠️ 18 Workers Pending Approval
        </Text>
        <Text style={styles.linkText}>Review Now →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.alertCard}>
        <Text style={styles.alertText}>🚨 5 Workers Reported</Text>
        <Text style={styles.linkText}>Check Reports →</Text>
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
        <Text style={styles.alertText}>
          ⚠️ High Cancellation Rate
        </Text>
      </View>

      {/* 📋 RECENT ACTIVITY */}
      <Text style={styles.sectionTitle}>📋 Recent Activity</Text>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>
          🟢 New worker registered
        </Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>
          ✅ Worker approved
        </Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityText}>
          ❌ Worker rejected
        </Text>
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