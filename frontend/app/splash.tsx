import { View, Text, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";

export default function Splash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation (fade + scale)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirect after delay
    setTimeout(() => {
      router.replace("/auth/login"); // change if needed
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.Image
        source={require("../assets/splash.png")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />

      {/* App Name */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        ServeNow
      </Animated.Text>

      {/* Loader */}
      <ActivityIndicator size="large" color="#00D68F" style={{ marginTop: 20 }} />

      {/* Tagline */}
      <Text style={styles.tagline}>AI Powered Services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081F5C",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 10,
  },
  tagline: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 10,
  },
});