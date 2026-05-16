import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";

const NAVY = "#081F5C";
const SKY = "#BAD6EB";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";

const CheckIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={NAVY}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function BookingSummary() {
  const { service, worker, price, eta } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Review & Confirm</Text>
      <Text style={styles.sub}>
        Your booking is almost ready. Please review details.
      </Text>

      {/* Card */}
      <View style={styles.card}>
        {/* Secure badge */}
        <View style={styles.badge}>
          <CheckIcon />
          <Text style={styles.badgeText}>Secure Booking</Text>
        </View>

        {/* Service */}
        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{service}</Text>
        </View>

        {/* Worker */}
        <View style={styles.row}>
          <Text style={styles.label}>Assigned Worker</Text>
          <Text style={styles.value}>{worker}</Text>
        </View>

        {/* ETA */}
        <View style={styles.row}>
          <Text style={styles.label}>Arrival Time</Text>
          <Text style={styles.value}>{eta}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Price highlight */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.price}>₹{price}</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          router.push({
            pathname: "/customer/payment",
            params: { service, worker, price, eta },
          })
        }
      >
        <Text style={styles.btnText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: NAVY,
  },

  sub: {
    fontSize: 13,
    color: NAVY,
    opacity: 0.5,
    marginBottom: 20,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    shadowColor: NAVY,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: SKY,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: NAVY,
  },

  row: {
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    opacity: 0.5,
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  priceBox: {
    alignItems: "center",
  },

  priceLabel: {
    fontSize: 12,
    opacity: 0.5,
  },

  price: {
    fontSize: 26,
    fontWeight: "900",
    color: NAVY,
  },

  btn: {
    marginTop: 20,
    backgroundColor: NAVY,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
