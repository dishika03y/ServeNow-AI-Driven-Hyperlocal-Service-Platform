import {
  View, Text, StyleSheet, TextInput, TouchableOpacity
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

const NAVY = "#081F5C";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";

export default function BookingScreen() {
  const { service } = useLocalSearchParams();
  const [address, setAddress] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking - {service}</Text>

      <TextInput
        placeholder="Enter Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/customer/booking-success")}
      >
        <Text style={styles.btnText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM, padding: 20 },
  title: { fontSize: 22, fontWeight: "800", color: NAVY, marginBottom: 20 },

  input: {
    backgroundColor: WHITE,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  btn: {
    backgroundColor: NAVY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "700" },
});