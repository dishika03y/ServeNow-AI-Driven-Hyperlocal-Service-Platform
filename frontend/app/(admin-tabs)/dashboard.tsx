import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Worker = {
  worker_id: string;
  fullName: string;
  phone: string;
  city: string;
  status: string;
};

export default function WorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 🔥 FETCH WORKERS
  const fetchWorkers = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(
        "https://servenow-ai-driven-hyperlocal-service.onrender.com/admin/workers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Workers:", data);

      setWorkers(data?.data || []);
    } catch (error) {
      console.log("Workers Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // 🔄 REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkers();
    setRefreshing(false);
  };

  // ✅ APPROVE
  const approveWorker = (workerId: string) => {
    Alert.alert("Approve Worker", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Approve",
        onPress: async () => {
          try {
            setActionLoading(workerId);

            const token = await AsyncStorage.getItem("access_token");

            await fetch(
              `https://servenow-ai-driven-hyperlocal-service.onrender.com/admin/workers/${workerId}/approve`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            fetchWorkers();
          } catch (error) {
            console.log("Approve Error:", error);
          } finally {
            setActionLoading(null);
          }
        },
      },
    ]);
  };

  // ❌ REJECT
  const rejectWorker = (workerId: string) => {
    Alert.alert("Reject Worker", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Reject",
        onPress: async () => {
          try {
            setActionLoading(workerId);

            const token = await AsyncStorage.getItem("access_token");

            await fetch(
              `https://servenow-ai-driven-hyperlocal-service.onrender.com/admin/workers/${workerId}/reject`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            fetchWorkers();
          } catch (error) {
            console.log("Reject Error:", error);
          } finally {
            setActionLoading(null);
          }
        },
      },
    ]);
  };

  // 🔥 FILTER PENDING ONLY
  const pendingWorkers = workers.filter(
    (w) =>
      w.status === "PENDING" ||
      w.status === "PENDING_FACE_VERIFICATION"
  );

  // 🔄 LOADING UI
  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading workers...</Text>
      </View>
    );
  }

  // ❗ EMPTY STATE
  if (pendingWorkers.length === 0) {
    return (
      <View style={styles.loader}>
        <Text>No pending workers 🎉</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pendingWorkers}
      keyExtractor={(item) => item.worker_id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.text}>📞 {item.phone}</Text>
          <Text style={styles.text}>📍 {item.city}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>

          {/* 🔥 BUTTONS */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "green" }]}
              disabled={actionLoading === item.worker_id}
              onPress={() => approveWorker(item.worker_id)}
            >
              <Text style={styles.btnText}>
                {actionLoading === item.worker_id ? "..." : "Approve"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "red" }]}
              disabled={actionLoading === item.worker_id}
              onPress={() => rejectWorker(item.worker_id)}
            >
              <Text style={styles.btnText}>
                {actionLoading === item.worker_id ? "..." : "Reject"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  text: {
    fontSize: 14,
    color: "#555",
  },

  status: {
    marginTop: 5,
    fontWeight: "600",
    color: "#FF9800",
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  btn: {
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 90,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});