import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { apiRequest } from "@/src/api/api";

// 🎨 Same theme (keep consistent with your app)
const NAVY = "#081F5C";
const SKY = "#BAD6EB";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.5)";
const BORDER = "rgba(8,31,92,0.08)";

export default function ServiceList() {
  const [services, setServices] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchServices = async () => {
    try {
      const res = await apiRequest("/services", "GET");
      setServices(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.log("Service error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = services.filter((s) =>
      s.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={NAVY} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 🔍 Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search services..."
          placeholderTextColor={MUTED}
          value={search}
          onChangeText={handleSearch}
          style={styles.input}
        />
      </View>

      {/* 🧰 Services Grid */}
      <View style={styles.grid}>
        {filtered.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/customer/service-detail",
                params: { id: service.id },
              })
            }
          >
            <View style={styles.iconBox}>
              <Text style={{ fontSize: 22 }}>🛠️</Text>
            </View>

            <Text style={styles.title}>
              {service.name || "Service"}
            </Text>

            <Text style={styles.subtitle}>
              ₹{service.price || "100"} onwards
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    paddingTop: 50,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CREAM,
  },

  searchBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
  },

  input: {
    height: 48,
    fontSize: 14,
    color: NAVY,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: SKY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: NAVY,
  },

  subtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 4,
  },
});