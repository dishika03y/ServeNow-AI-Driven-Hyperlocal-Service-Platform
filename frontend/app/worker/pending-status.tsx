import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { apiRequest } from "@/src/api/api";

export default function PendingStatus() {
  const [status, setStatus] = useState("pending");

  const checkStatus = async () => {
    try {
      const res = await apiRequest("/workers/status", "GET");
      setStatus(res.status);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00D68F" />

      <Text style={styles.title}>
        {status === "pending" && "Verification in Progress"}
        {status === "approved" && "You're Approved 🎉"}
        {status === "rejected" && "Verification Rejected ❌"}
      </Text>

      <Text style={styles.desc}>
        {status === "pending" &&
          "We are reviewing your documents. Please wait."}

        {status === "approved" &&
          "You can now start accepting jobs."}

        {status === "rejected" &&
          "Please re-upload correct documents."}
      </Text>

      {/* Refresh button */}
      <TouchableOpacity style={styles.btn} onPress={checkStatus}>
        <Text style={styles.btnText}>Check Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
  },
  desc: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.6,
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#00D68F",
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});