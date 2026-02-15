import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack } from "expo-router";

const Earnings: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>💰 Earnings</Text>
          <Text style={styles.subHeading}>Your income summary</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.amount}>₹800</Text>
            <Text style={styles.label}>Today</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.amount}>₹12,500</Text>
            <Text style={styles.label}>This Month</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.amount}>₹45,000</Text>
            <Text style={styles.label}>Total Earnings</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.amount}>120+</Text>
            <Text style={styles.label}>Jobs Completed</Text>
          </View>
        </View>

        {/* Earnings History */}
        <Text style={styles.sectionTitle}>Recent Earnings</Text>

        <View style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Text style={styles.job}>Electric Repair</Text>
            <Text style={styles.money}>₹500</Text>
          </View>
          <Text style={styles.date}>12 Feb 2026</Text>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Text style={styles.job}>Fan Installation</Text>
            <Text style={styles.money}>₹300</Text>
          </View>
          <Text style={styles.date}>12 Feb 2026</Text>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Text style={styles.job}>Switch Board Repair</Text>
            <Text style={styles.money}>₹250</Text>
          </View>
          <Text style={styles.date}>10 Feb 2026</Text>
        </View>

      </ScrollView>
    </>
  );
};

export default Earnings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BFD3DF", // Dashboard background
  },

  header: {
    backgroundColor: "#0D2C48",
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },

  subHeading: {
    fontSize: 14,
    color: "#CFE8F6",
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },

  summaryCard: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1BBF4C", // Accent Green
  },

  label: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    color: "#0D2C48",
  },

  historyCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  job: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0D2C48",
  },

  money: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1BBF4C",
  },

  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
});
