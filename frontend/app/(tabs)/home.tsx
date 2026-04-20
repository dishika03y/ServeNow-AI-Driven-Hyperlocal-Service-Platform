import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/src/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// --- Design tokens ---
const NAVY = "#0B2239";
const NAVY_MID = "#163552";
const ACCENT = "#00D68F";
const ACCENT_DIM = "rgba(0,214,143,0.12)";
const ACCENT_BDR = "rgba(0,214,143,0.25)";
const SURFACE = "rgba(255,255,255,0.04)";
const SURFACE_MID = "rgba(255,255,255,0.07)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#EEF4FA";
const MUTED = "rgba(200,220,235,0.55)";

const CATEGORIES = ["All", "Repair", "Cleaning", "Installation", "Maintenance"];

const services = [
  { title: "Electrician", emoji: "⚡", cat: "Repair", trending: true },
  { title: "Plumber", emoji: "🔧", cat: "Repair", trending: false },
  { title: "AC Repair", emoji: "❄️", cat: "Maintenance", trending: true },
  { title: "Cleaning", emoji: "🧹", cat: "Cleaning", trending: false },
  { title: "Carpenter", emoji: "🪚", cat: "Repair", trending: false },
  { title: "Painter", emoji: "🖌️", cat: "Maintenance", trending: false },
  { title: "Pest Control", emoji: "🛡️", cat: "Cleaning", trending: false },
  { title: "Moving", emoji: "🚚", cat: "Installation", trending: false },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [masterLoading, setMasterLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");

        if (!token) {
          // No token found, move to login immediately
          router.replace("/auth/login");
          return;
        }

        // Token exists, now try to get profile
        setIsAuthenticated(true);
        await loadCachedProfile();
      } catch (error) {
        console.error("Initialization error:", error);
        router.replace("/auth/login");
      } finally {
        // Only stop showing the loader when everything is checked
        setMasterLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchData = async () => {
    try {
      const data = await apiRequest("/users/me", "GET");
      setProfile(data);
      await AsyncStorage.setItem("userProfile", JSON.stringify(data));
    } catch (err: any) {
      console.error("Home Fetch Error:", err);

      // ONLY redirect if we are sure it's an auth error
      if (err.status === 401 || err.message.includes("401")) {
        // Clear the bad tokens so we don't loop
        await AsyncStorage.multiRemove(["access_token", "userProfile"]);
        setIsAuthenticated(false);
        router.replace("/auth/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const loadCachedProfile = async () => {
    try {
      const cached = await AsyncStorage.getItem("userProfile");
      if (cached) {
        setProfile(JSON.parse(cached));
      }
      // Always fetch fresh data in background
      await fetchData();
    } catch (e) {
      console.error("Cache read error:", e);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // 1. Show a clean loader while checking auth/profile
  if (masterLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.loadingText}>Synchronizing...</Text>
      </View>
    );
  }

  // 2. If the check finishes and we aren't authenticated, return nothing
  // (the router.replace handles the transition)
  if (!isAuthenticated) return null;
  const getInitials = () => {
    if (!profile?.fullName) return "??";
    return profile.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredServices = services.filter(
    (s) =>
      (selectedCat === "All" || s.cat === selectedCat) &&
      s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appLabel}>WorkerOS</Text>
          <Text style={styles.locationText}>
            📍 {profile?.city || "Detecting..."}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push("/customer/Customerdashboard")}
        >
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT}
          />
        }
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.greeting}>
            Hello, {profile?.fullName?.split(" ")[0] || "Guest"}
          </Text>
          <Text style={styles.heroTitle}>
            Premium services,{"\n"}at your doorstep
          </Text>
        </View>

        {/* Search & Filter Section */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a service..."
            placeholderTextColor={MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
          contentContainerStyle={styles.catContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCat(cat)}
              style={[
                styles.catChip,
                selectedCat === cat && styles.catChipActive,
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  selectedCat === cat && styles.catTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Section */}
        {!searchQuery && selectedCat === "All" && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TRENDING NOW</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContent}
            >
              {services
                .filter((s) => s.trending)
                .map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.trendingCard}
                    onPress={() =>
                      router.push({
                        pathname: "/customer/service-list",
                        params: { service: s.title },
                      })
                    }
                  >
                    <View style={styles.trendIcon}>
                      <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                    </View>
                    <Text style={styles.trendTitle}>{s.title}</Text>
                    <Text style={styles.trendSub}>Top Rated</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </>
        )}

        {/* Main Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCat.toUpperCase()} SERVICES
          </Text>
        </View>
        <View style={styles.grid}>
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              emoji={service.emoji}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ServiceCard({ title, emoji }: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/customer/service-list",
          params: { service: title },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardIconWrap}>
        <Text style={styles.cardEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.cardText} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  centerContainer: {
    flex: 1,
    backgroundColor: NAVY,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: TEXT, marginTop: 12, fontSize: 14 },
  scrollContent: { paddingBottom: 100 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 15,
  },
  appLabel: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  locationText: { color: MUTED, fontSize: 11, marginTop: 2 },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: TEXT, fontSize: 14, fontWeight: "700" },
  hero: { paddingHorizontal: 22, marginVertical: 15 },
  greeting: { color: MUTED, fontSize: 16 },
  heroTitle: {
    color: TEXT,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 20,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: TEXT, fontSize: 15 },
  catScroll: { marginBottom: 20 },
  catContent: { paddingHorizontal: 22, gap: 10 },
  catChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  catChipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BDR },
  catText: { color: MUTED, fontSize: 14, fontWeight: "600" },
  catTextActive: { color: ACCENT },
  sectionHeader: { paddingHorizontal: 22, marginBottom: 15, marginTop: 10 },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  trendingContent: { paddingHorizontal: 22, gap: 15, paddingBottom: 10 },
  trendingCard: {
    width: 140,
    backgroundColor: NAVY_MID,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  trendIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: SURFACE_MID,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  trendTitle: { color: TEXT, fontSize: 15, fontWeight: "700" },
  trendSub: { color: ACCENT, fontSize: 11, fontWeight: "600", marginTop: 2 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  card: {
    width: (width - 44) / 2 - 6,
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  cardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: SURFACE_MID,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardEmoji: { fontSize: 24 },
  cardText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
