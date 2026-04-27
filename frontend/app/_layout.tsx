// app/_layout.tsx
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore, Role } from "../src/store/useAuthStore"; // Ensure Role is exported

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const userProfile = await AsyncStorage.getItem("userProfile");

        if (token && userProfile) {
          const parsedUser = JSON.parse(userProfile);
          // Hydrate store with actual role from storage
          login(token, parsedUser.role as Role);
        }
      } catch (e) {
        console.error("Auth Hydration Error:", e);
      } finally {
        setIsReady(true);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      // You could route them based on role here if needed
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, segments, isReady]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0B2239",
        }}
      >
        <ActivityIndicator size="large" color="#00D68F" />
      </View>
    );
  }

  return <Slot />;
}
