import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import {
  getAllWorkers,
  approveWorker,
  rejectWorker,
} from "@/src/api/admin";

export default function Workers() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      const data = await getAllWorkers();
      setWorkers(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveWorker(id);
      Alert.alert("Success", "Worker Approved ✅");
      fetchWorkers();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectWorker(id);
      Alert.alert("Rejected", "Worker Rejected ❌");
      fetchWorkers();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Verification</Text>

      {workers.map((w: any) => (
        <View key={w.id} style={styles.card}>
          <Text style={styles.name}>{w.name || "No Name"}</Text>
          <Text style={styles.skill}>{w.skill || "No Skill"}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.approve}
              onPress={() => handleApprove(w.id)}
            >
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reject}
              onPress={() => handleReject(w.id)}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B2239", padding: 20 },
  title: { color: "#fff", fontSize: 22, marginBottom: 20 },

  card: {
    backgroundColor: "#1E3A5F",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  name: { color: "#fff", fontSize: 16 },
  skill: { color: "#A0AEC0", marginBottom: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  approve: {
    backgroundColor: "#00C897",
    padding: 10,
    borderRadius: 6,
    width: "48%",
  },

  reject: {
    backgroundColor: "#FF5C5C",
    padding: 10,
    borderRadius: 6,
    width: "48%",
  },

  btnText: { color: "#fff", textAlign: "center" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B2239",
  },
});