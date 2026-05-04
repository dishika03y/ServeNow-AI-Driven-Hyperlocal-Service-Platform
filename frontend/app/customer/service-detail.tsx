import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import { apiRequest } from "@/src/api/api";

const NAVY = "#081F5C";
const SKY = "#BAD6EB";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";

const StarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2l3 7 7 .5-5 4.5 1.5 7-6.5-4-6.5 4L7 14 2 9.5 9 9l3-7z"
      stroke={NAVY}
      strokeWidth={1.5}
    />
  </Svg>
);

export default function ServiceDetail() {
  const { service } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // -------------------------
  // BOOK SERVICE API CALL
  // -------------------------
  const bookService = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        Alert.alert("Error", "Login required");
        return;
      }

      // ⚠️ TEMP FIX (you MUST replace this later with real service _id)
      const serviceId = service; // still temporary, but backend will fail if not ObjectId

      const payload = {
        serviceId,
        location: {
          lat: 28.61,
          lng: 77.2,
        },
        notes: `Need ${service} service`,
      };

      const data = await apiRequest("/bookings/", "POST", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // IMPORTANT: apiRequest already returns JSON
      console.log("BOOKING RESPONSE:", data);

      Alert.alert("Booking Confirmed 🎉", "Your request has been created");

      router.push("/customer/booking");
    } catch (err: any) {
      console.log("Booking error:", err);
      Alert.alert("Error", err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />

      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>{service}</Text>
          <Text style={styles.subtitle}>
            Verified professionals at your doorstep
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.badge}>
            <StarIcon />
            <Text style={styles.badgeText}>Trusted Service</Text>
          </View>

          <Text style={styles.heading}>What you get</Text>
          <Text style={styles.text}>
            High-quality {service} service delivered by verified experts.
          </Text>

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>₹299</Text>
          </View>

          {/* BOOK BUTTON */}
          <TouchableOpacity
            style={styles.btn}
            onPress={bookService}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Book Now</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },

  container: {
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: NAVY,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: NAVY,
    opacity: 0.5,
    marginBottom: 18,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
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
    marginBottom: 14,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: NAVY,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
  },

  text: {
    marginTop: 8,
    fontSize: 13,
    color: "#444",
  },

  priceBox: {
    marginTop: 16,
    backgroundColor: "#F0F7FF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  priceLabel: {
    fontSize: 11,
    color: NAVY,
    opacity: 0.6,
  },

  price: {
    fontSize: 22,
    fontWeight: "800",
    color: NAVY,
  },

  btn: {
    marginTop: 18,
    backgroundColor: NAVY,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
