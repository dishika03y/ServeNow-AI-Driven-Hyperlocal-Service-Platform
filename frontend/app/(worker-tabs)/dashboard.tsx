import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import Svg, { Path, Circle, Rect, Polyline } from "react-native-svg";

// ── Brand tokens ───────────────────────────────────────────────
const C = {
  navy:        "#081F5C",
  navyLight:   "#081F5C10",
  navyMid:     "#081F5C40",
  sky:         "#BAD6EB",
  skyLight:    "#BAD6EB20",
  cream:       "#F7F2EB",
  creamBorder: "#E8E2D8",
  white:       "#FFFFFF",
  success:     "#166834",
  successBg:   "#F0FDF4",
  pending:     "#92400E",
  pendingBg:   "#FEF9C3",
  warn:        "#92400E",
  warnBg:      "#FFFBEB",
  star:        "#FBBF24",
  onlineDot:   "#22C55E",
  onlineBg:    "#BBF7D0",
  errorDot:    "#F87171",
};

// ── Stats data ─────────────────────────────────────────────────
const STATS = [
  {
    value: "3", label: "New job requests", badge: "+2 new",
    iconBg: C.skyLight, badgeBg: C.skyLight, badgeColor: C.navy,
    icon: "briefcase",
  },
  {
    value: "2", label: "Jobs in progress", badge: "live",
    iconBg: C.pendingBg, badgeBg: C.pendingBg, badgeColor: C.pending,
    icon: "clock",
  },
  {
    value: "120+", label: "Jobs completed", badge: "",
    iconBg: C.successBg, badgeBg: "", badgeColor: "",
    icon: "trending",
  },
  {
    value: "4.5", label: "Avg. rating", badge: "",
    iconBg: C.warnBg, badgeBg: "", badgeColor: "",
    icon: "star",
  },
];

const BAR_HEIGHTS = [30, 50, 40, 70, 60, 80, 100];

// ── Icons ──────────────────────────────────────────────────────
const LogoMark = () => (
  <Svg width={14} height={14} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
    <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
  </Svg>
);

const BellIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2a5 5 0 00-5 5v3l-1.5 2h13L14 10V7a5 5 0 00-5-5z" stroke={C.navy} strokeWidth={1.3} />
    <Path d="M7 15a2 2 0 004 0" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 10 10" fill="none">
    <Path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke={C.navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Stat icons
const BriefcaseIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={7} width={20} height={14} rx={2} stroke={C.navy} strokeWidth={1.4} opacity={0.5} />
    <Path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
  </Svg>
);
const ClockIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={C.warn} strokeWidth={1.4} opacity={0.6} />
    <Path d="M12 7v5l3 3" stroke={C.warn} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
  </Svg>
);
const TrendingIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={C.success} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
  </Svg>
);
const StarIconSvg = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.7 5.8 21l1.2-6.8L2 9.3l6.9-1L12 2z" stroke={C.warn} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
  </Svg>
);

const STAT_ICONS: Record<string, React.ReactNode> = {
  briefcase: <BriefcaseIcon />,
  clock:     <ClockIcon />,
  trending:  <TrendingIcon />,
  star:      <StarIconSvg />,
};

// ── Availability toggle ────────────────────────────────────────
function AvailabilityCard({ available, onToggle }: { available: boolean; onToggle: () => void }) {
  const thumbAnim = React.useRef(new Animated.Value(available ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: available ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [available]);

  const thumbX = thumbAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });

  return (
    <TouchableOpacity
      style={[st.availCard, available && st.availCardOn]}
      onPress={onToggle}
      activeOpacity={0.85}
    >
      <View style={st.availLeft}>
        <View style={[st.pulse, available && st.pulseOn]} />
        <View>
          <Text style={st.availLbl}>STATUS</Text>
          <Text style={st.availStatus}>
            {available ? "Available for work" : "Offline — not accepting jobs"}
          </Text>
        </View>
      </View>
      <View style={[st.toggleTrack, available && st.toggleTrackOn]}>
        <Animated.View style={[st.toggleThumb, { transform: [{ translateX: thumbX }] }]} />
      </View>
    </TouchableOpacity>
  );
}

// ── Stat card ──────────────────────────────────────────────────
function StatCard({ stat }: { stat: typeof STATS[0] }) {
  return (
    <View style={st.statCard}>
      <View style={st.statIconRow}>
        <View style={[st.statIconBox, { backgroundColor: stat.iconBg }]}>
          {STAT_ICONS[stat.icon]}
        </View>
        {!!stat.badge && (
          <View style={[st.statBadge, { backgroundColor: stat.badgeBg }]}>
            <Text style={[st.statBadgeTxt, { color: stat.badgeColor }]}>{stat.badge}</Text>
          </View>
        )}
      </View>
      <Text style={st.statVal}>{stat.value}</Text>
      <Text style={st.statLbl}>{stat.label}</Text>
    </View>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const [available, setAvailable] = useState(true);
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={st.root}>
        <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
        <View style={st.bg1} />
        <View style={st.bg2} />

        {/* Top bar */}
        <View style={st.topBar}>
          <View style={st.brandRow}>
            <View style={st.logoBox}><LogoMark /></View>
            <Text style={st.brandName}>ServeNow</Text>
          </View>
          <TouchableOpacity
            style={st.bellBtn}
            onPress={() => router.push("/worker/notifications")}
            activeOpacity={0.75}
          >
            <BellIcon />
            <View style={st.bellDot} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={st.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={st.hero}>
            <Text style={st.greeting}>Good morning,</Text>
            <Text style={st.heroName}>Ramesh Kumar</Text>
            <View style={st.tagsRow}>
              <View style={st.tag}>
                <View style={st.tagDot} />
                <Text style={st.tagTxt}>Electrician</Text>
              </View>
              <View style={st.tag}>
                <Text style={[st.tagTxt, { color: C.star }]}>★ </Text>
                <Text style={st.tagTxt}>4.5 Rating</Text>
              </View>
              <View style={st.tag}>
                <Text style={st.tagTxt}>Delhi NCR</Text>
              </View>
            </View>
          </View>

          {/* Availability */}
          <AvailabilityCard available={available} onToggle={() => setAvailable((p) => !p)} />

          {/* Stats */}
          <View style={st.secRow}>
            <Text style={st.secLbl}>TODAY'S SNAPSHOT</Text>
            <TouchableOpacity activeOpacity={0.75}>
              <Text style={st.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={st.statsGrid}>
            {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
          </View>

          {/* Earnings card */}
          <View style={st.earnCard}>
            <View style={st.earnTop}>
              <View>
                <Text style={st.earnLbl}>EARNINGS TODAY</Text>
                <Text style={st.earnAmt}>₹800</Text>
                <Text style={st.earnSub}>across 2 completed jobs</Text>
              </View>
              <TouchableOpacity
                style={st.earnBtn}
                onPress={() => router.push("/worker/earnings")}
                activeOpacity={0.8}
              >
                <Text style={st.earnBtnTxt}>Details →</Text>
              </TouchableOpacity>
            </View>

            {/* Mini bar chart */}
            <View style={st.miniBars}>
              {BAR_HEIGHTS.map((h, i) => (
                <View
                  key={i}
                  style={[
                    st.miniBar,
                    { height: `${h}%` as any },
                    i === BAR_HEIGHTS.length - 1 && st.miniBarActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Action buttons */}
          <View style={st.btns}>
            <TouchableOpacity
              style={st.ctaBtn}
              onPress={() => router.push("/worker/job-requests")}
              activeOpacity={0.88}
            >
              <Text style={st.ctaTxt}>View Job Requests</Text>
              <View style={st.ctaChip}><ArrowIcon /></View>
            </TouchableOpacity>

            <View style={st.outlineRow}>
              <TouchableOpacity
                style={st.outlineBtn}
                onPress={() => router.push("/worker/earnings")}
                activeOpacity={0.75}
              >
                <Text style={st.outlineTxt}>Earnings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={st.outlineBtn}
                onPress={() => router.push("/worker/profile")}
                activeOpacity={0.75}
              >
                <Text style={st.outlineTxt}>My Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trust strip */}
          <View style={st.trust}>
            <Text style={st.trustTxt}>✦ Verified platform</Text>
            <View style={st.trustDot} />
            <Text style={st.trustTxt}>Instant payouts</Text>
            <View style={st.trustDot} />
            <Text style={st.trustTxt}>Insured jobs</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Dashboard;

// ── Styles ─────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  bg1:  { position: "absolute", width: 280, height: 280, borderRadius: 140, backgroundColor: C.sky,  opacity: 0.24, top: -60,  right: -60 },
  bg2:  { position: "absolute", width: 160, height: 160, borderRadius: 80,  backgroundColor: C.navy, opacity: 0.05, bottom: 80, left: -40 },

  topBar:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 54, paddingBottom: 8, zIndex: 2 },
  brandRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  logoBox:   { width: 28, height: 28, backgroundColor: C.navy, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  brandName: { fontFamily: "serif", fontSize: 17, fontWeight: "700", color: C.navy, letterSpacing: -0.2 },
  bellBtn:   { width: 34, height: 34, borderRadius: 9, backgroundColor: C.white, borderWidth: 1, borderColor: C.creamBorder, alignItems: "center", justifyContent: "center" },
  bellDot:   { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.errorDot, position: "absolute", top: 6, right: 6, borderWidth: 1.5, borderColor: C.cream },

  scroll: { paddingHorizontal: 20, paddingBottom: 80 },

  // Hero
  hero:     { paddingTop: 8, paddingBottom: 14 },
  greeting: { fontSize: 12, color: C.navy, opacity: 0.38, marginBottom: 3 },
  heroName: { fontFamily: "serif", fontSize: 26, fontWeight: "700", color: C.navy, letterSpacing: -0.5, lineHeight: 30, marginBottom: 10 },
  tagsRow:  { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag:      { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 11 },
  tagDot:   { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.onlineDot },
  tagTxt:   { fontSize: 10, color: C.navy, fontWeight: "500" },

  // Availability
  availCard:   { backgroundColor: C.white, borderRadius: 16, borderWidth: 1.5, borderColor: C.creamBorder, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  availCardOn: { borderColor: C.onlineBg },
  availLeft:   { flexDirection: "row", alignItems: "center", gap: 10 },
  pulse:       { width: 10, height: 10, borderRadius: 5, backgroundColor: C.creamBorder },
  pulseOn:     { backgroundColor: C.onlineDot },
  availLbl:    { fontSize: 8, fontWeight: "700", letterSpacing: 0.8, color: C.navy, opacity: 0.38, marginBottom: 2 },
  availStatus: { fontSize: 13, fontWeight: "600", color: C.navy },
  toggleTrack: { width: 44, height: 24, borderRadius: 12, backgroundColor: C.creamBorder, justifyContent: "center", paddingHorizontal: 2 },
  toggleTrackOn: { backgroundColor: C.navy },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.white },

  // Section
  secRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  secLbl: { fontSize: 9, fontWeight: "700", letterSpacing: 1.1, color: C.navy, opacity: 0.35 },
  seeAll: { fontSize: 10, fontWeight: "600", color: C.sky },

  // Stats
  statsGrid:   { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  statCard:    { width: "48.5%", backgroundColor: C.white, borderRadius: 13, borderWidth: 1.5, borderColor: C.creamBorder, padding: 13 },
  statIconRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  statIconBox: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  statBadge:   { borderRadius: 20, paddingVertical: 2, paddingHorizontal: 7 },
  statBadgeTxt:{ fontSize: 9, fontWeight: "700" },
  statVal:     { fontFamily: "serif", fontSize: 24, fontWeight: "700", color: C.navy, letterSpacing: -0.4, lineHeight: 28, marginBottom: 2 },
  statLbl:     { fontSize: 10, color: C.navy, opacity: 0.38 },

  // Earnings
  earnCard: { backgroundColor: C.navy, borderRadius: 16, padding: 16, marginBottom: 14 },
  earnTop:  { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  earnLbl:  { fontSize: 8, fontWeight: "700", letterSpacing: 0.9, color: C.sky, opacity: 0.6, marginBottom: 3 },
  earnAmt:  { fontFamily: "serif", fontSize: 30, fontWeight: "700", color: C.cream, letterSpacing: -0.5, lineHeight: 34 },
  earnSub:  { fontSize: 10, color: C.sky, opacity: 0.5, marginTop: 2 },
  earnBtn:  { backgroundColor: "#F7F2EB14", borderWidth: 1, borderColor: "#F7F2EB1A", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 13 },
  earnBtnTxt:{ fontSize: 11, fontWeight: "600", color: C.sky },
  miniBars: { flexDirection: "row", alignItems: "flex-end", gap: 4, height: 34 },
  miniBar:  { flex: 1, borderRadius: 3, backgroundColor: "#F7F2EB14" },
  miniBarActive: { backgroundColor: C.sky },

  // Buttons
  btns:       { gap: 9 },
  ctaBtn:     { height: 50, backgroundColor: C.navy, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  ctaTxt:     { fontSize: 14, fontWeight: "700", color: C.cream, letterSpacing: 0.2 },
  ctaChip:    { width: 22, height: 22, backgroundColor: C.sky, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  outlineRow: { flexDirection: "row", gap: 9 },
  outlineBtn: { flex: 1, height: 44, borderRadius: 13, borderWidth: 1.5, borderColor: C.creamBorder, backgroundColor: C.white, alignItems: "center", justifyContent: "center" },
  outlineTxt: { fontSize: 13, fontWeight: "600", color: C.navy, opacity: 0.55 },

  // Trust
  trust:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: C.navyLight, borderRadius: 11, padding: 11, marginTop: 14 },
  trustTxt: { fontSize: 10, color: C.navy, opacity: 0.28, fontWeight: "500" },
  trustDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: C.navy, opacity: 0.18 },
});