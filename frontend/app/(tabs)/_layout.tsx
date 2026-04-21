import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const NAVY = "#0B2239";
const NAVY_MID = "#163552";
const ACCENT = "#00D68F";
const MUTED = "rgba(200,220,235,0.45)";
const BORDER = "rgba(255,255,255,0.08)";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: NAVY_MID,
          borderTopWidth: 1,
          borderTopColor: BORDER,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.4,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="time" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ color, focused }) => (
            <BookingTabIcon focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="card" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chatbubbles" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

// Components remain the same as your original file
function TabIcon({
  name,
  color,
  focused,
}: {
  name: any;
  color: string;
  focused: boolean;
}) {
  const iconName = focused ? name : `${name}-outline`;
  return (
    <View style={tabIconStyles.wrapper}>
      <Ionicons name={iconName} size={22} color={color} />
      {focused && <View style={tabIconStyles.dot} />}
    </View>
  );
}

function BookingTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={bookingStyles.container}>
      <View style={[bookingStyles.pill, focused && bookingStyles.pillActive]}>
        <Ionicons
          name={focused ? "document-text" : "document-text-outline"}
          size={22}
          color={focused ? NAVY : MUTED}
        />
      </View>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", gap: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT },
});

const bookingStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  pill: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  pillActive: { backgroundColor: ACCENT, borderColor: ACCENT },
});
