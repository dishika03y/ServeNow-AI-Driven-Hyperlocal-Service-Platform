import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const inAuthGroup = segments[0] === "auth";

        if (!token && !inAuthGroup) {
          router.replace("/auth/login");
        } else if (token && inAuthGroup) {
          // FIX: Redirect to the home file inside (tabs)
          // In Expo Router, the path for (tabs)/home.tsx is just "/home"
          router.replace("/home");
        }
      } catch (error) {
        console.error("Auth Check Error:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkUserAuth();
  }, [segments]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#E0F2FE",
        }}
      >
        <ActivityIndicator size="large" color="#0A2540" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Name matches the folder/file structure */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="(tabs)/home" />
      <Stack.Screen name="customer/Customerdashboard" />
    </Stack>
  );
}