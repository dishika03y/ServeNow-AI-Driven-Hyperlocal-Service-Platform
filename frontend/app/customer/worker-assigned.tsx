import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const NAVY = "#081F5C";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";

export default function WorkerAssigned() {
  const { service, worker, price } = useLocalSearchParams();

  const [eta, setEta] = useState(18); // fake ETA in minutes
  const [status, setStatus] = useState("Finding nearest worker...");

  useEffect(() => {
    // Step 1: assigning worker
    setTimeout(() => {
      setStatus(`👨‍🔧 ${worker} assigned to your job`);
    }, 1500);

    // Step 2: simulate ETA updates
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          // final redirect → success / booking tab
          router.replace("/customer/booking");
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Assigned</Text>

      <View style={styles.card}>
        <Text style={styles.status}>{status}</Text>

        <ActivityIndicator
          size="large"
          color={NAVY}
          style={{ marginVertical: 20 }}
        />

        <Text style={styles.label}>Service</Text>
        <Text style={styles.value}>{service}</Text>

        <Text style={styles.label}>Worker</Text>
        <Text style={styles.value}>{worker}</Text>

        <Text style={styles.label}>Estimated Arrival</Text>
        <Text style={styles.eta}>{eta} min</Text>
      </View>

      <Text style={styles.note}>
        Live tracking will start once worker accepts job
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: NAVY,
    marginBottom: 20,
  },

  card: {
    backgroundColor: WHITE,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
    color: NAVY,
    textAlign: "center",
  },

  label: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
  },

  eta: {
    fontSize: 26,
    fontWeight: "900",
    color: NAVY,
    marginTop: 5,
  },

  note: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 11,
    opacity: 0.5,
  },
});
