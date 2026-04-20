import { Stack } from "expo-router";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const inAuthGroup = segments[0] === "auth";

        if (!token) {
          // Only block if NOT inside auth
          if (!inAuthGroup) {
            router.replace("/auth/login");
          }
        } else {
          // If logged in, prevent going back to auth screens
          if (inAuthGroup) {
            router.replace("/(tabs)/home");
          }
        }
      } catch (error) {
        console.error("Auth Check Error:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkUserAuth();
  }, [segments]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0B2239",
        }}
      >
        <ActivityIndicator size="large" color="#00D68F" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* REMOVED: "auth", "(tabs)", etc. 
          Expo Router automatically detects these folders. 
          Listing them here again causes the 'extraneous' warning.
      */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
