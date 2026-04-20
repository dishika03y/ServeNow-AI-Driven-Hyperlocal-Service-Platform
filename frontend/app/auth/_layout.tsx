import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
<<<<<<< HEAD
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
=======
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="worker-verification" />
    </Stack>
>>>>>>> 6304e3b (changes on dashboard)
  );
}
