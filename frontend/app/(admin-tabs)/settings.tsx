import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();

  const Item = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.row}>
        <Ionicons name={icon} size={20} color="#0B2239" />
        <Text style={styles.text}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
      </View>

      {/* PROFILE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Item icon="person-outline" title="Profile" />
        <Item icon="notifications-outline" title="Notifications" />
      </View>

      {/* BUSINESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business</Text>
        <Item icon="cash-outline" title="Commission Settings" />
        <Item icon="construct-outline" title="Manage Services" />
      </View>

      {/* WORKERS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workers</Text>
        <Item icon="people-outline" title="Worker Approvals" />
        <Item icon="shield-checkmark-outline" title="Worker Verification" />
      </View>

      {/* APP */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <Item icon="settings-outline" title="App Preferences" />
        <Item icon="help-circle-outline" title="Help & Support" />
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    backgroundColor: "#0B2239",
    padding: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  section: {
    marginTop: 16,
    paddingHorizontal: 12,
  },

  sectionTitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },

  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  logout: {
    margin: 20,
    backgroundColor: "#FF3B3B",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});