import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const NAVY = "#081F5C";
const CREAM = "#F7F2EB";

export default function BookingSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Booking Confirmed</Text>
      <Text style={styles.sub}>Your service is on the way 🚀</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.btnText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: { fontSize: 60 },
  title: { fontSize: 22, fontWeight: "800", color: NAVY, marginTop: 20 },
  sub: { marginTop: 10 },

  btn: {
    marginTop: 30,
    backgroundColor: NAVY,
    padding: 14,
    borderRadius: 12,
  },

  btnText: { color: "#fff", fontWeight: "700" },
});