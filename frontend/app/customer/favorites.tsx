import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/src/api/api";

const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";

// fallback
const STATIC_FAV = [
  { id: 1, name: "Ravi Electrician", service: "Electric Repair" },
  { id: 2, name: "Suresh Plumber", service: "Plumbing" },
];

export default function FavoritesScreen() {
  const [list, setList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFav = async () => {
    try {
      const res = await apiRequest("/customer/favorites", "GET");
      setList(res.data || []);
    } catch {
      setList(STATIC_FAV);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFav();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFav();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Favorite Workers</Text>

      {list.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.name}>👨‍🔧 {item.name}</Text>
          <Text style={styles.service}>{item.service}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM, paddingTop: 60 },

  title: {
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },

  card: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  name: { fontWeight: "700", color: NAVY },
  service: { color: MUTED, marginTop: 4 },
});
