import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, Stack } from "expo-router";

const Dashboard: React.FC = () => {
  const [available, setAvailable] = useState<boolean>(true);
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome 👋</Text>
          <Text style={styles.name}>Ramesh Kumar</Text>
          <Text style={styles.skill}>Electrician</Text>
        </View>

        {/* Availability */}
        <View style={styles.availabilityCard}>
          <View>
            <Text style={styles.availabilityTitle}>Availability Status</Text>
            <Text style={styles.availabilitySub}>
              {available ? "You are Online" : "You are Offline"}
            </Text>
          </View>

          <Switch
            value={available}
            onValueChange={(value: boolean) => setAvailable(value)}
            thumbColor={available ? "#0D2C48" : "#ccc"}
            trackColor={{ false: "#ccc", true: "#1BBF4C" }}
          />
        </View>

        {/* Stats Row 1 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>New Jobs</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹800</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>

        {/* Stats Row 2 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>120+</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>⭐ 4.5</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/worker/job-requests")}
        >
          <Text style={styles.primaryText}>View Job Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/worker/earnings")}
        >
          <Text style={styles.secondaryText}>View Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => router.push("/worker/profile")}
        >
          <Text style={styles.outlineText}>My Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BFD3DF", // 🔥 New Background
  },

  header: {
    backgroundColor: "#0D2C48",
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcome: {
    color: "#A8D0E6",
    fontSize: 14,
  },
  name: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  skill: {
    color: "#CFE8F6",
    fontSize: 16,
    marginTop: 2,
  },

  availabilityCard: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  availabilitySub: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D2C48",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },

  primaryBtn: {
    backgroundColor: "#0D2C48",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  primaryText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#1BBF4C",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },
  secondaryText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  outlineBtn: {
    borderWidth: 2,
    borderColor: "#0D2C48",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 30,
  },
  outlineText: {
    color: "#0D2C48",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
