import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import InputField from "../../src/components/ui/InputField";
import { apiRequest } from "@/src/api/api";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSignup = async () => {
   if (!fullName || !phone || !password || !city || !pincode) {
     setError("Please fill in all required fields");
     return;
   }

   setLoading(true);
   setError("");

   try {
     // MATCHING YOUR DOCS: /auth/register and camelCase keys
     await apiRequest("/auth/register", "POST", {
       fullName: fullName, // Must be fullName, not full_name
       phone: phone,
       password: password,
       email: email,
       city: city,
       pincode: pincode,
     });

     alert("Registration successful!");
     router.replace("/auth/login");
   } catch (err: any) {
     // If you get a 422 here, check the phone number format
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>ServeNow</Text>
        <Text style={styles.subtitle}>Join our community</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <InputField
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <InputField
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <InputField
          placeholder="Email (Optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <InputField placeholder="City" value={city} onChangeText={setCity} />
        <InputField
          placeholder="Pincode"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="number-pad"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: "#E0F2FE",
  },
  header: { alignItems: "center", marginBottom: 20 },
  brand: { fontSize: 34, fontWeight: "800", color: "#0A2540" },
  subtitle: { color: "#64748B", marginTop: 4 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A2540",
    marginBottom: 20,
  },
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
  error: { color: "#DC2626", marginBottom: 10, textAlign: "center" },
});
