import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function BookingSuccess() {
  const { serviceName } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Booking Successful!</Text>

      <Text style={styles.sub}>
        Your request for{" "}
        <Text style={{ fontWeight: "700" }}>{serviceName}</Text> has been
        placed.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/customer/home")}
      >
        <Text style={styles.btnText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  sub: { textAlign: "center", opacity: 0.6, marginBottom: 20 },
  btn: {
    backgroundColor: "#166534",
    padding: 14,
    borderRadius: 10,
    width: "100%",
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
