import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../src/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path, Circle, Rect, Polyline, Line } from "react-native-svg";
import FloatingSupport from "../../src/components/shared/FloatingSupport";

const { width } = Dimensions.get("window");

// ── Brand Tokens (identical across all ServeNow screens) ───────
const C = {
  navy: "#081F5C",
  navyLight: "#081F5C14",
  navyMid: "#081F5C40",
  sky: "#BAD6EB",
  skyLight: "#BAD6EB30",
  cream: "#F7F2EB",
  creamDark: "#EDE7DC",
  creamBorder: "#E8E2D8",
  white: "#FFFFFF",
  success: "#166534",
  successBg: "#F0FDF4",
};

// ── Data ───────────────────────────────────────────────────────
const CATEGORIES = ["All", "Repair", "Cleaning", "Installation", "Maintenance"];

const SERVICES = [
  {
    title: "Electrician",
    sub: "Wiring & repairs",
    cat: "Repair",
    trending: true,
    tag: "In demand",
  },
  {
    title: "Plumber",
    sub: "Pipes & leaks",
    cat: "Repair",
    trending: false,
    tag: "",
  },
  {
    title: "AC Repair",
    sub: "Cooling systems",
    cat: "Maintenance",
    trending: true,
    tag: "In demand",
  },
  {
    title: "Deep Cleaning",
    sub: "Full home clean",
    cat: "Cleaning",
    trending: true,
    tag: "",
  },
  {
    title: "Carpenter",
    sub: "Wood & furniture",
    cat: "Repair",
    trending: false,
    tag: "",
  },
  {
    title: "Painter",
    sub: "Interior & exterior",
    cat: "Maintenance",
    trending: false,
    tag: "",
  },
  {
    title: "Pest Control",
    sub: "All pests covered",
    cat: "Cleaning",
    trending: false,
    tag: "",
  },
  {
    title: "Moving/Transport",
    sub: "Packing & shifting",
    cat: "Installation",
    trending: false,
    tag: "",
  },
];

// ── Icons ──────────────────────────────────────────────────────
const LogoMark = () => (
  <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
    <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
  </Svg>
);

const SearchIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
    <Circle
      cx={7.5}
      cy={7.5}
      r={5}
      stroke={C.navy}
      strokeWidth={1.4}
      opacity={0.35}
    />
    <Path
      d="M11.5 11.5l3 3"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={0.35}
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 18 18" fill="none">
    <Path
      d="M9 2C6.2 2 4 4.2 4 7c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z"
      stroke={C.sky}
      strokeWidth={1.4}
    />
    <Circle cx={9} cy={7} r={1.8} stroke={C.sky} strokeWidth={1.2} />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
    <Path
      d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"
      stroke={C.navy}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Service-specific icons
const ZapIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const ToolIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.7 3.3a3.5 3.5 0 00-4.9 4.9L3 15l2 2 6.8-6.8a3.5 3.5 0 004.9-4.9l-2.3 2.3-1.4-1.4 2.3-2.3z"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </Svg>
);
const WindIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.7 7.7a2.5 2.5 0 11-4.8-1.4"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
    <Path
      d="M9.6 4.6a2 2 0 11-3.9 1"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
    <Path
      d="M2 12h18M2 16h11"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </Svg>
);
const BrushIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 00-3-3z"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 8c-2 3-4 3.5-7 4l8 8c1-3 1-5 4-7"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const ShieldIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const TruckIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect
      x={1}
      y={3}
      width={15}
      height={13}
      rx={1}
      stroke={C.navy}
      strokeWidth={1.4}
    />
    <Path
      d="M16 8h4l3 5v4h-7V8z"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
    <Circle cx={5.5} cy={18.5} r={2.5} stroke={C.navy} strokeWidth={1.4} />
    <Circle cx={18.5} cy={18.5} r={2.5} stroke={C.navy} strokeWidth={1.4} />
  </Svg>
);
const HammerIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 2l7 7-1.5 1.5L15 5 9 11l-2-2 6-6M9 11L3 17a2 2 0 002 2 2 2 0 002-2"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const StarIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </Svg>
);

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Electrician: <ZapIcon />,
  Plumber: <ToolIcon />,
  "AC Repair": <WindIcon />,
  "Deep Cleaning": <StarIcon />,
  Carpenter: <HammerIcon />,
  Painter: <BrushIcon />,
  "Pest Control": <ShieldIcon />,
  "Moving/Transport": <TruckIcon />,
};

// ── Helpers ────────────────────────────────────────────────────
function getInitials(name?: string) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// ── Section Label ──────────────────────────────────────────────
function SectionLabel({ title, badge }: { title: string; badge?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {badge && (
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

// ── Trending Card ──────────────────────────────────────────────
function TrendingCard({ service }: { service: (typeof SERVICES)[0] }) {
  return (
    <TouchableOpacity
      style={styles.trendCard}
      onPress={() =>
        router.push({
          pathname: "/customer/service-detail",
          params: { service: service.title },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.trendIconBox}>{SERVICE_ICONS[service.title]}</View>
      <Text style={styles.trendTitle}>{service.title}</Text>
      <View style={styles.trendTag}>
        <Text style={styles.trendTagText}>Top Rated</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Service Card ───────────────────────────────────────────────
function ServiceCard({ service }: { service: (typeof SERVICES)[0] }) {
  return (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() =>
        router.push({
          pathname: "/customer/service-detail",
          params: { service: service.title },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.serviceIconBox}>{SERVICE_ICONS[service.title]}</View>
      <Text style={styles.serviceTitle}>{service.title}</Text>
      <Text style={styles.serviceSub}>{service.sub}</Text>
      {!!service.tag && (
        <View style={styles.serviceTag}>
          <Text style={styles.serviceTagText}>{service.tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main Screen ────────────────────────────────────────────────
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [masterLoading, setMasterLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          router.replace("/auth/login");
          return;
        }
        setIsAuthenticated(true);
        await loadCachedProfile();
      } catch {
        router.replace("/auth/login");
      } finally {
        setMasterLoading(false);
      }
    };
    init();
  }, []);

  const fetchData = async () => {
    try {
      const data = await apiRequest("/users/me", "GET");
      setProfile(data);
      await AsyncStorage.setItem("userProfile", JSON.stringify(data));
    } catch (err: any) {
      if (err.status === 401 || err.message?.includes("401")) {
        await AsyncStorage.multiRemove(["access_token", "userProfile"]);
        setIsAuthenticated(false);
        router.replace("/auth/login");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const loadCachedProfile = async () => {
    try {
      const cached = await AsyncStorage.getItem("userProfile");
      if (cached) setProfile(JSON.parse(cached));
      await fetchData();
    } catch {}
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Filtered services
  const filtered = SERVICES.filter(
    (s) =>
      (selectedCat === "All" || s.cat === selectedCat) &&
      s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const trending = SERVICES.filter((s) => s.trending);

  // Loading state
  // if (masterLoading) {
  //   return (
  //     <View style={styles.loadingScreen}>
  //       <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
  //       <View style={styles.logoMark}><LogoMark /></View>
  //       <ActivityIndicator size="small" color={C.navy} style={{ marginTop: 20 }} />
  //       <Text style={styles.loadingText}>Synchronizing…</Text>
  //     </View>
  //   );
  // }

  if (!isAuthenticated) return null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

      {/* Background accents */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoMarkBox}>
            <LogoMark />
          </View>
          <Text style={styles.brandName}>ServeNow</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push("/customer/Customerdashboard")}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>
            {getInitials(profile?.fullName)}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.navy}
            colors={[C.navy]}
          />
        }
      >
        {/* Location + Hero */}
        <View style={styles.hero}>
          <View style={styles.locationRow}>
            <LocationIcon />
            <Text style={styles.locationText}>
              {profile?.city || "Detecting location…"}
            </Text>
          </View>
          <Text style={styles.greeting}>
            Hello, {profile?.fullName?.split(" ")[0] || "there"}
          </Text>
          <Text style={styles.heroTitle}>
            Premium services,{"\n"}at your{" "}
            <Text style={styles.heroItalic}>doorstep.</Text>
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a service…"
            placeholderTextColor={C.navyMid}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catContent}
          style={styles.catScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catPill,
                selectedCat === cat && styles.catPillActive,
              ]}
              onPress={() => setSelectedCat(cat)}
              activeOpacity={0.75}
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

        {/* Trending — shown only when no search and All selected */}
        {!searchQuery && selectedCat === "All" && (
          <>
            <SectionLabel title="TRENDING NOW" badge="Hot" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContent}
            >
              {trending.map((s) => (
                <TrendingCard key={s.title} service={s} />
              ))}
            </ScrollView>
          </>
        )}

        {/* Services Grid */}
        <SectionLabel
          title={
            selectedCat === "All"
              ? "ALL SERVICES"
              : `${selectedCat.toUpperCase()} SERVICES`
          }
        />

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No services found</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((s) => (
              <ServiceCard key={s.title} service={s} />
            ))}
          </View>
        )}

        {/* Trust strip */}
        <View style={styles.trust}>
          <Text style={styles.trustText}>✦ Verified providers</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>Instant booking</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>1M+ users</Text>
        </View>
      </ScrollView>
      <FloatingSupport />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const CARD_WIDTH = (width - 20 * 2 - 10) / 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },

  bgCircle1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: C.sky,
    opacity: 0.28,
    top: -60,
    right: -60,
  },
  bgCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.navy,
    opacity: 0.05,
    bottom: 80,
    left: -40,
  },

  // Loading
  loadingScreen: {
    flex: 1,
    backgroundColor: C.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMark: {
    width: 48,
    height: 48,
    backgroundColor: C.navy,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: "serif",
    fontSize: 14,
    color: C.navy,
    opacity: 0.4,
    marginTop: 10,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    zIndex: 2,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMarkBox: {
    width: 32,
    height: 32,
    backgroundColor: C.navy,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.3,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { fontSize: 13, fontWeight: "700", color: C.cream },

  scrollContent: { paddingBottom: 100 },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 14,
  },
  locationText: {
    fontSize: 11,
    color: C.navy,
    opacity: 0.4,
    fontWeight: "500",
  },
  greeting: { fontSize: 13, color: C.navy, opacity: 0.45, marginBottom: 4 },
  heroTitle: {
    fontFamily: "serif",
    fontSize: 28,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  heroItalic: { fontStyle: "italic", color: C.sky },

  // Search
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    height: 48,
    paddingHorizontal: 14,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.navy },

  // Categories
  catScroll: { marginBottom: 16 },
  catContent: { paddingHorizontal: 20, gap: 8 },
  catPill: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  catPillActive: { backgroundColor: C.navy, borderColor: C.navy },
  catText: { fontSize: 12, fontWeight: "600", color: C.navy, opacity: 0.5 },
  catTextActive: { color: C.cream, opacity: 1 },

  // Section header
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: C.navy,
    opacity: 0.4,
  },
  sectionBadge: {
    backgroundColor: C.navy,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: C.sky,
    letterSpacing: 0.3,
  },

  // Trending
  trendingContent: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 4,
    marginBottom: 16,
  },
  trendCard: {
    width: 120,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    padding: 14,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trendIconBox: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: C.navyLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  trendTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 5,
  },
  trendTag: {
    backgroundColor: C.skyLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  trendTagText: { fontSize: 9, fontWeight: "600", color: C.navy },

  // Services grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  serviceCard: {
    width: CARD_WIDTH,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    padding: 14,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.navyLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 3,
  },
  serviceSub: { fontSize: 10, color: C.navy, opacity: 0.38, lineHeight: 14 },
  serviceTag: {
    backgroundColor: C.successBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 7,
  },
  serviceTagText: { fontSize: 9, fontWeight: "600", color: C.success },

  // Empty state
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyStateText: { fontSize: 13, color: C.navy, opacity: 0.3 },

  // Trust strip
  trust: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: C.navyLight,
    borderRadius: 12,
    padding: 12,
  },
  trustText: { fontSize: 10, color: C.navy, opacity: 0.35, fontWeight: "500" },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.navy,
    opacity: 0.2,
  },
});
