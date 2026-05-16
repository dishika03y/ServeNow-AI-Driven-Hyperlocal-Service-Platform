import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/src/api/api";

const CREAM = "#F7F2EB";
const NAVY = "#081F5C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(8,31,92,0.45)";
const BORDER = "rgba(8,31,92,0.08)";
const DANGER = "#D94F4F";

export default function SettingsScreen() {
  const [profile, setProfile] =
    useState<any>(null);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchData = async () => {
    try {
      const user =
        await apiRequest(
          "/users/me",
          "GET"
        );

      setProfile(user);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh =
    useCallback(() => {
      setRefreshing(true);
      fetchData();
    }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure?",
      [
        {
          text: "Cancel",
        },

        {
          text: "Logout",
          style:
            "destructive",

          onPress:
            async () => {
              await AsyncStorage.multiRemove(
                [
                  "access_token",
                  "refresh_token",
                ]
              );

              router.replace(
                "/auth/login"
              );
            },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={
            refreshing
          }
          onRefresh={
            onRefresh
          }
        />
      }
    >
      {/* HEADER */}
      <View
        style={styles.header}
      >
        <Text
          style={styles.heading}
        >
          Settings
        </Text>

        <Text
          style={styles.subHeading}
        >
          {
            profile?.fullName
          }
        </Text>
      </View>

      {/* ACCOUNT */}
      <Section
        title="ACCOUNT"
      />

      <Menu
        icon="person-outline"
        title="Edit Profile"
        route="/customer/edit-profile"
      />

      <Menu
        icon="lock-closed-outline"
        title="Change Password"
        route="/shared/change-password"
      />

      {/* APP */}
      <Section
        title="APP"
      />

      <Menu
        icon="notifications-outline"
        title={`Notifications ${
          profile
            ?.unread_notifications ||
          0
        }`}
        route="/shared/notifications"
      />

      <Menu
        icon="language-outline"
        title="Language"
        route="/shared/language"
      />

      {/* SAFETY */}
      <Section
        title="SAFETY"
      />

      <Menu
        icon="shield-checkmark-outline"
        title={`Verification ${
          profile?.verified
            ? "✓"
            : "Pending"
        }`}
        route="/shared/verification"
      />

      <Menu
        icon="document-text-outline"
        title="Privacy Policy"
        route="/shared/privacy"
      />

      <Menu
        icon="document-outline"
        title="Terms & Conditions"
        route="/shared/terms"
      />

      {/* SUPPORT */}
      <Section
        title="SUPPORT"
      />

      <Menu
        icon="chatbubble-outline"
        title="Help Center"
        route="/shared/help"
      />

      <Menu
        icon="call-outline"
        title="Emergency Support"
        route="/shared/emergency"
      />

      {/* SESSION */}
      <Section
        title="SESSION"
      />

      <Menu
        icon="log-out-outline"
        title="Logout"
        onPress={
          handleLogout
        }
        danger
      />

      <View
        style={{
          height: 40,
        }}
      />
    </ScrollView>
  );
}

function Section({
  title,
}: any) {
  return (
    <Text
      style={
        styles.section
      }
    >
      {title}
    </Text>
  );
}

function Menu({
  icon,
  title,
  route,
  onPress,
  danger = false,
}: any) {
  return (
    <TouchableOpacity
      style={
        styles.menu
      }
      onPress={
        onPress ||
        (() =>
          router.push(
            route
          ))
      }
    >
      <Ionicons
        name={icon}
        size={22}
        color={
          danger
            ? DANGER
            : NAVY
        }
      />

      <Text
        style={[
          styles.menuText,

          danger && {
            color:
              DANGER,
          },
        ]}
      >
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={
          MUTED
        }
      />
    </TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        CREAM,
    },

    header: {
      marginTop: 70,
      marginLeft: 20,
      marginBottom: 20,
    },

    heading: {
      fontSize: 24,
      fontWeight:
        "800",
      color: NAVY,
    },

    subHeading: {
      marginTop: 4,
      color: MUTED,
    },

    section: {
      marginTop: 20,
      marginLeft: 20,
      marginBottom: 12,
      color: MUTED,
      fontSize: 11,
      fontWeight:
        "700",
    },

    menu: {
      marginHorizontal: 20,
      marginBottom: 10,
      backgroundColor:
        WHITE,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        BORDER,

      flexDirection:
        "row",

      alignItems:
        "center",

      padding: 18,
    },

    menuText: {
      flex: 1,
      marginLeft: 14,
      color: NAVY,
      fontWeight:
        "600",
    },
  });