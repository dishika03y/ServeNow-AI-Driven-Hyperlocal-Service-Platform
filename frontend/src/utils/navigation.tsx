import { router } from "expo-router";

export const handleUserRouting = (user: any) => {
  if (user?.role?.trim() === "ADMIN") {
    router.replace("/admin/dashboard");
  } else if (user?.is_worker) {
    router.replace("/(worker-tabs)/dashboard");
  } else {
    router.replace("/(tabs)/home");
  }
};
