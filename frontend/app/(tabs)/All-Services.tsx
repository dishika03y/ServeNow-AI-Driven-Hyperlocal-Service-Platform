import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { apiRequest } from "@/src/api/api";

// THEME
const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";

export default function AllServicesScreen() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // FETCH
  const fetchServices = async () => {
    try {
      const res = await apiRequest("/services/", "GET");
      setServices(res?.data || []);
    } catch (err) {
      console.log(err);
      setServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);

  // FILTER
  const filtered = useMemo(() => {
    if (!search.trim()) return services;

    return services.filter((s) => {
      const q = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    });
  }, [search, services]);

  // GROUP BY CATEGORY
  const grouped = useMemo(() => {
    const map: any = {};

    filtered.forEach((s) => {
      const key = s.category || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });

    return map;
  }, [filtered]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, []);

  // LOADER
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={NAVY} />
        <Text style={styles.loaderText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>All Services</Text>
        <Text style={styles.subTitle}>
          Choose professional services at your doorstep
        </Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={MUTED} />
        <TextInput
          placeholder="Search services..."
          placeholderTextColor={MUTED}
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {/* LIST */}
      {Object.keys(grouped).length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={40} color={MUTED} />
          <Text style={styles.emptyText}>No services found</Text>
        </View>
      ) : (
        Object.keys(grouped).map((category) => (
          <View key={category}>
            {/* CATEGORY HEADER */}
            <Text style={styles.category}>{category}</Text>

            {grouped[category].map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/customer/service-detail",
                    params: { service: item.name },
                  })
                }
              >
                {/* ICON */}
                <View style={styles.iconBox}>
                  <Ionicons name="construct-outline" size={20} color={NAVY} />
                </View>

                {/* INFO */}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>

                {/* PRICE */}
                <View style={styles.priceBox}>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    paddingTop: 60,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: NAVY,
  },

  subTitle: {
    marginTop: 6,
    color: MUTED,
    fontSize: 13,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    color: NAVY,
  },

  category: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "800",
    color: NAVY,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
  },

  desc: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },

  priceBox: {
    marginLeft: 10,
  },

  price: {
    fontWeight: "800",
    color: NAVY,
  },

  empty: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 10,
    color: MUTED,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CREAM,
  },

  loaderText: {
    marginTop: 10,
    color: MUTED,
  },
});
