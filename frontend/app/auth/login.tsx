import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import InputField from "../../src/components/ui/InputField";
import { apiRequest } from "@/src/api/api";
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
      if (data.access_token) {
        await AsyncStorage.setItem("userToken", data.access_token);
        router.replace("/home");
      }
    } catch (err: any) {
      setError(err.message);
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
