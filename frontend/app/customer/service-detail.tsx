import {
  View, Text, StyleSheet, TouchableOpacity
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const NAVY = "#081F5C";
const SKY = "#BAD6EB";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";

export default function ServiceDetail() {
  const { service } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service}</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Service Details</Text>
        <Text style={styles.text}>
          Professional {service} service at your doorstep.
        </Text>

        <Text style={styles.price}>₹299 starting</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.push({
              pathname: "/customer/booking",
              params: { service },
            })
          }
        >
          <Text style={styles.btnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM, padding: 20 },
  title: { fontSize: 26, fontWeight: "800", color: NAVY, marginBottom: 20 },

  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
  },

  heading: { fontSize: 18, fontWeight: "700", color: NAVY },
  text: { marginTop: 10, color: "#333" },
  price: { marginTop: 20, fontSize: 20, fontWeight: "800", color: NAVY },

  btn: {
    marginTop: 30,
    backgroundColor: NAVY,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "700" },
});