// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function AdminLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#00D68F",
//         tabBarStyle: { backgroundColor: "#0B2239" },
//       }}
//     >
//       <Tabs.Screen
//         name="dashboard"
//         options={{
//           title: "Dashboard",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="grid" size={22} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//   name="bookings"
//   options={{
//     title: "Bookings",
//   }}
// />

//       <Tabs.Screen
//         name="workers"
//         options={{
//           title: "Workers",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="people" size={22} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="users"
//         options={{
//           title: "Users",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="person" size={22} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: "Settings",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="settings" size={22} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }