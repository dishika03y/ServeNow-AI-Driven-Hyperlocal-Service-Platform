import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { createBooking } from "@/src/store/bookingStore";

const NAVY = "#081F5C";
const CREAM = "#F7F2EB";

const workers = [
  "Ramesh (Electrician)",
  "Aman (Verified Pro)",
  "Vikram (Top Rated)",
  "Suresh (Nearby Expert)",
];

export default function FindingWorker() {
  const { service } = useLocalSearchParams();

  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;

  const timer3 = setTimeout(async () => {
    const booking = await createBooking({
      service: String(service),
      worker: "Ramesh (Electrician)",
      price: "₹349",
      eta: "25 min",
    });

    router.replace({
      pathname: "/customer/booking-summary",
      params: {
        id: booking.id,
      },
    });
  }, 4500);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer1 = setTimeout(() => setStep(1), 1500);
    const timer2 = setTimeout(() => setStep(2), 3000);
    const timer3 = setTimeout(() => {
      router.replace({
        pathname: "/customer/booking-summary",
        params: {
          service: String(service),
          worker: "Ramesh (Electrician)",
          price: "₹349",
          eta: "25 min",
        },
      });
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fade }]}>
        Finding nearby professionals...
      </Animated.Text>

      <Text style={styles.sub}>Service: {service}</Text>

      <View style={styles.box}>
        <Text style={styles.step}>
          {step === 0 && "Scanning area..."}
          {step === 1 && "Matching verified workers..."}
          {step === 2 && "Assigning best professional..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: NAVY,
    textAlign: "center",
    marginBottom: 10,
  },
  sub: {
    fontSize: 13,
    opacity: 0.5,
    marginBottom: 30,
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },
  step: {
    fontSize: 14,
    fontWeight: "600",
    color: NAVY,
  },
});
