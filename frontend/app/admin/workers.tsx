import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://servenow-ai-driven-hyperlocal-service.onrender.com";

type Worker = {
  worker_id: string;
  fullName: string;
  phone: string;
  city: string;
  status: string;
  verificationStage: string;
};

export default function WorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // -------------------------
  // FETCH WORKERS
  // -------------------------
  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${API}/admin/workers?status=PENDING`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setWorkers(json.data || []);
    } catch (err) {
      console.log("Fetch workers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const approveWorker = async (id: string) => {
    try {
      setActionLoading(id);

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${API}/admin/workers/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Approved", data.message);

        // ✅ REMOVE FROM UI IMMEDIATELY
        setWorkers((prev) => prev.filter((worker) => worker.worker_id !== id));
      } else {
        Alert.alert("Error", data.detail || "Failed to approve");
      }
    } catch (err) {
      console.log("Approve error:", err);
      Alert.alert("Error", "Failed to approve worker");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------
  // REJECT WORKER
  // -------------------------
  const rejectWorker = async (id: string) => {
    try {
      setActionLoading(id);

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${API}/admin/workers/${id}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      Alert.alert("Rejected", data.message);

      fetchWorkers();
    } catch (err) {
      console.log("Reject error:", err);
      Alert.alert("Error", "Failed to reject worker");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  const renderItem = ({ item }: { item: Worker }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.fullName || "No Name"}</Text>

      <Text style={styles.sub}>📞 {item.phone}</Text>
      <Text style={styles.sub}>📍 {item.city}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.stage}>Stage: {item.verificationStage}</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#22c55e" }]}
          onPress={() => approveWorker(item.worker_id)}
          disabled={actionLoading === item.worker_id}
        >
          <Text style={styles.btnText}>
            {actionLoading === item.worker_id ? "Processing..." : "Approve"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#ef4444" }]}
          onPress={() => rejectWorker(item.worker_id)}
          disabled={actionLoading === item.worker_id}
        >
          <Text style={styles.btnText}>
            {actionLoading === item.worker_id ? "Processing..." : "Reject"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading workers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Workers</Text>

      {workers.length === 0 ? (
        <Text style={styles.empty}>No pending workers 🎉</Text>
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => item.worker_id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

/* ---------------- UI ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  sub: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  status: {
    marginTop: 6,
    fontWeight: "600",
  },

  stage: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "600",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
  },
});
