import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  getAllBookings,
  updateBookingStatus,
} from "@/src/api/admin";

// 🔥 MORE DUMMY DATA
const dummyBookings = [
  { _id: "1", service: "Electrician", userName: "Rahul Sharma", workerName: "Ramesh", price: 500, status: "pending" },
  { _id: "2", service: "Plumber", userName: "Amit Verma", workerName: "Suresh", price: 700, status: "confirmed" },
  { _id: "3", service: "AC Repair", userName: "Priya Singh", workerName: "", price: 1200, status: "completed" },
  { _id: "4", service: "Deep Cleaning", userName: "Neha", workerName: "Ravi", price: 2000, status: "cancelled" },
  { _id: "5", service: "Carpenter", userName: "Vikas", workerName: "Mahesh", price: 900, status: "pending" },
  { _id: "6", service: "Painter", userName: "Rohit", workerName: "", price: 1500, status: "pending" },
  { _id: "7", service: "Cleaning", userName: "Simran", workerName: "Anil", price: 600, status: "completed" },
  { _id: "8", service: "AC Installation", userName: "Karan", workerName: "Deepak", price: 1800, status: "confirmed" },
  { _id: "9", service: "Fridge Repair", userName: "Pooja", workerName: "Sanjay", price: 800, status: "cancelled" },
  { _id: "10", service: "Washing Machine Repair", userName: "Arjun", workerName: "", price: 1100, status: "pending" },
];

export default function Bookings() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getAllBookings();
      if (!res || res.length === 0) setData(dummyBookings);
      else setData(res);
    } catch {
      setData(dummyBookings);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      load();
    } catch {
      console.log("status update failed");
    }
  };

  const filtered =
    filter === "all"
      ? data
      : data.filter((b) => b.status === filter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#FFF4E5", text: "#FF9800" };
      case "confirmed":
        return { bg: "#E3F2FD", text: "#2196F3" };
      case "completed":
        return { bg: "#E8F5E9", text: "#4CAF50" };
      case "cancelled":
        return { bg: "#FFEBEE", text: "#F44336" };
      default:
        return { bg: "#eee", text: "#555" };
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      {/* FILTERS */}
      <View style={styles.filters}>
        {[
          { key: "all", label: "All Bookings" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              styles.filterBtn,
              filter === f.key && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key && { color: "#fff" },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => {
          const statusStyle = getStatusStyle(item.status);

          return (
            <TouchableOpacity
              onPress={() =>
                router.push(`/admin/booking/${item._id}`)
              }
            >
              <View style={styles.card}>
                {/* TOP */}
                <View style={styles.row}>
                  <Text style={styles.service}>
                    🔧 {item.service}
                  </Text>
                  <Text style={styles.price}>
                    ₹{item.price}
                  </Text>
                </View>

                {/* USER */}
                <Text style={styles.text}>
                  👤 {item.userName}
                </Text>
                <Text style={styles.subText}>
                  🧑‍🔧 {item.workerName || "Not Assigned"}
                </Text>

                {/* STATUS */}
                <View
                  style={[
                    styles.statusChip,
                    { backgroundColor: statusStyle.bg },
                  ]}
                >
                  <Text
                    style={{
                      color: statusStyle.text,
                      fontWeight: "600",
                    }}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </View>

                {/* ACTIONS */}
                {item.status === "pending" && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.approve}
                      onPress={() =>
                        handleStatus(item._id, "confirmed")
                      }
                    >
                      <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancel}
                      onPress={() =>
                        handleStatus(item._id, "cancelled")
                      }
                    >
                      <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === "confirmed" && (
                  <TouchableOpacity
                    style={styles.complete}
                    onPress={() =>
                      handleStatus(item._id, "completed")
                    }
                  >
                    <Text style={styles.btnText}>
                      Mark Completed
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    backgroundColor: "#0B2239",
    padding: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },

  activeFilter: {
    backgroundColor: "#0B2239",
  },

  filterText: {
    fontSize: 12,
    color: "#333",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  service: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    fontWeight: "bold",
    color: "#0B2239",
  },

  text: {
    marginTop: 4,
    fontSize: 14,
  },

  subText: {
    fontSize: 12,
    color: "#777",
  },

  statusChip: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  approve: {
    backgroundColor: "#00C853",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },

  cancel: {
    backgroundColor: "#FF3B3B",
    padding: 10,
    borderRadius: 8,
  },

  complete: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 13,
  },
});


