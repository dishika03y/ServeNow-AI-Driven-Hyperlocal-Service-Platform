import { router } from "expo-router";

export const handleUserRouting = (user: any) => {
  if (user?.is_admin) {
    router.replace("/(admin-tabs)/dashboard");
  } else if (user?.is_worker) {
    router.replace("/(worker-tabs)/dashboard");
  } else {
    router.replace("/(tabs)/home");
  }
};
