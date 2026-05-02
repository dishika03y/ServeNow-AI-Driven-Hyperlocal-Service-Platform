import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const PRIMARY = "#0A4D8C"; // worker blue
const INACTIVE = "#6B7280";
const BG = "#FFFFFF";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: BG,
          height: 78,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingTop: 8,
          paddingBottom: 10,
        },

        tabBarShowLabel: false,

        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomTab
              icon={focused ? "home" : "home-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      {/* SERVICES */}
      <Tabs.Screen
        name="All Services"
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomTab
              icon={focused ? "construct" : "construct-outline"}
              label="Services"
              focused={focused}
            />
          ),
        }}
      />

      {/* BOOKINGS */}
      <Tabs.Screen
        name="booking"
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomTab
              icon={focused ? "clipboard" : "clipboard-outline"}
              label="Bookings"
              focused={focused}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="User-profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomTab
              icon={focused ? "person" : "person-outline"}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function BottomTab({
  icon,
  label,
  focused,
}: {
  icon: any;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={24}
        color={focused ? PRIMARY : INACTIVE}
      />

      <Text
        style={[
          styles.label,
          {
            color: focused ? PRIMARY : INACTIVE,
            fontWeight: focused ? "700" : "500",
          },
        ]}
      >
        {label}
      </Text>

      {focused && <View style={styles.activeLine} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },

  label: {
    fontSize: 11,
    marginTop: 4,
  },

  activeLine: {
    marginTop: 4,
    width: 22,
    height: 3,
    borderRadius: 10,
    backgroundColor: PRIMARY,
  },
});