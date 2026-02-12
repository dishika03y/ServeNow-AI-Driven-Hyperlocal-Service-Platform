import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";

interface WorkerProfile {
  name: string;
  skill: string;
  rating: string;
  mobile: string;
  experience: string;
  location: string;
  jobs: string;
  earnings: string;
}

const Profile: React.FC = () => {
  const router = useRouter();

  const [profile] = useState<WorkerProfile>({
    name: "Ramesh Kumar",
    skill: "Electrician",
    rating: "⭐ 4.5 Rating",
    mobile: "+91 9XXXXXXXXX",
    experience: "5 Years",
    location: "Indore, MP",
    jobs: "120+",
    earnings: "₹45k",
  });

  const handleEditProfile = (): void => {
    Alert.alert(
      "Edit Profile",
      "Profile editing backend integration ke baad enable hogi.",
      [{ text: "OK" }]
    );
  };

  const handleLogout = (): void => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.skill}>{profile.skill}</Text>
          <Text style={styles.rating}>{profile.rating}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.label}>📞 Mobile</Text>
          <Text style={styles.value}>{profile.mobile}</Text>

          <Text style={styles.label}>🛠 Experience</Text>
          <Text style={styles.value}>{profile.experience}</Text>

          <Text style={styles.label}>📍 Location</Text>
          <Text style={styles.value}>{profile.location}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.jobs}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.earnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BFD3DF", // Dashboard background
  },

  header: {
    alignItems: "center",
    backgroundColor: "#0D2C48", // Dashboard header color
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },

  skill: {
    fontSize: 16,
    color: "#CFE8F6",
    marginTop: 4,
  },

  rating: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
    color: "#0D2C48",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  statBox: {
    backgroundColor: "#ffffff",
    width: "45%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D2C48",
  },

  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#0D2C48",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutBtn: {
    backgroundColor: "#E02020",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 30,
  },

  logoutText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
