import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/api/api";
import { router } from "expo-router";

// COLORS
const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";

export default function EditProfileScreen() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch current user data
  const fetchProfile = async () => {
    try {
      const res = await apiRequest("/users/me", "GET");

      setForm({
        fullName: res?.fullName || "",
        email: res?.email || "",
        phone: res?.phone || "",
        city: res?.city || "",
        pincode: res?.pincode || "",
      });
    } catch (err) {
      console.log("Fetch profile failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔹 Update handler
  const handleUpdate = async () => {
    if (!form.fullName || !form.email) {
      Alert.alert("Error", "Name and Email are required");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/users/me", "PUT", form);

      Alert.alert("Success", "Profile updated successfully");

      router.back();
    } catch (err) {
      Alert.alert("Error", "Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.card}>
        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(v: string) => setForm({ ...form, fullName: v })}
        />

        <Input
          label="Email"
          value={form.email}
          onChange={(v: string) => setForm({ ...form, email: v })}
        />

        <Input
          label="Phone"
          value={form.phone}
          onChange={(v: string) => setForm({ ...form, phone: v })}
        />

        <Input
          label="City"
          value={form.city}
          onChange={(v: string) => setForm({ ...form, city: v })}
        />

        <Input
          label="Pincode"
          value={form.pincode}
          onChange={(v: string) => setForm({ ...form, pincode: v })}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🔹 Reusable Input
function Input({ label, value, onChange }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder={`Enter ${label}`}
        placeholderTextColor={MUTED}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    paddingTop: 60,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },

  label: {
    color: NAVY,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    color: NAVY,
  },

  button: {
    margin: 20,
    backgroundColor: NAVY,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: WHITE,
    fontWeight: "700",
  },
});