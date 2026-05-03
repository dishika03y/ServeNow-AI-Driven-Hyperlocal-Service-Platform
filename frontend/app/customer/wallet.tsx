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
const SUCCESS = "#2E7D32";

// fallback
const STATIC_WALLET = {
  balance: 1250,
  transactions: [
    { id: 1, title: "Booking Payment", amount: "-₹499", date: "12 May" },
    { id: 2, title: "Refund", amount: "+₹200", date: "10 May" },
  ],
};

export default function WalletScreen() {
  const [wallet, setWallet] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await apiRequest("/customer/wallet", "GET");
      setWallet(res.data);
    } catch {
      setWallet(STATIC_WALLET);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWallet();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* BALANCE */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balance}>₹{wallet?.balance || 0}</Text>
      </View>

      {/* TRANSACTIONS */}
      <Text style={styles.section}>Transactions</Text>

      {wallet?.transactions?.map((t: any) => (
        <View key={t.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.amount}>{t.amount}</Text>
          </View>
          <Text style={styles.date}>{t.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM, paddingTop: 60 },

  balanceCard: {
    backgroundColor: NAVY,
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },

  balanceLabel: { color: "#BAD6EB" },
  balance: { color: WHITE, fontSize: 28, fontWeight: "800", marginTop: 6 },

  section: {
    marginLeft: 20,
    marginBottom: 10,
    color: MUTED,
    fontWeight: "700",
  },

  card: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },

  title: { fontWeight: "700", color: NAVY },
  amount: { fontWeight: "700", color: SUCCESS },
  date: { fontSize: 12, color: MUTED, marginTop: 4 },
});
