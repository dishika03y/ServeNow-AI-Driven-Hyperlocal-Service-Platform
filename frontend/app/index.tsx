import { Redirect } from "expo-router";

// This simply acts as the entry point.
// The real logic is in your RootLayout.
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
