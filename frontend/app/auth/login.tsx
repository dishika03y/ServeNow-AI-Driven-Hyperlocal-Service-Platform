import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import InputField from "../../src/components/ui/InputField";
import { apiRequest } from "../../src/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      setError("Please enter phone and password");  
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", "POST", {
        phone: phone,
        password: password,
      });

      // CHANGE THIS: Only require the access_token to proceed
      if (data && data.access_token) {
        await AsyncStorage.setItem("access_token", data.access_token);

        // Only save the refresh_token if it exists in the response
        if (data.refresh_token) {
          await AsyncStorage.setItem("refresh_token", data.refresh_token);
        }

        router.replace("/(tabs)/home");
      } else {
        setError("Login failed: Server response was incomplete.");
      }
    } catch (err: any) {
      // Show the actual backend error message instead of 'undefined'
      const backendMessage = err.response?.data?.detail;
      const message =
        typeof backendMessage === "string"
          ? backendMessage
          : "Invalid phone or password";

      setError(message);

      if (__DEV__) {
        console.log("Login Error Detail:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>ServeNow</Text>
        <Text style={styles.subtitle}>AI Hyperlocal Services</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.desc}>Login to find nearby trusted services</Text>

        <InputField
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    padding: 20,
  },
  header: { alignItems: "center", marginBottom: 20 },
  brand: { fontSize: 34, fontWeight: "800", color: "#0A2540" },
  subtitle: { color: "#64748B", marginTop: 4 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0A2540", marginBottom: 6 },
  desc: { color: "#64748B", marginBottom: 20 },
  button: {
    backgroundColor: "#0A2540",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#38BDF8",
    marginTop: 18,
    fontWeight: "500",
  },
  error: { color: "#DC2626", marginBottom: 8 },
});
