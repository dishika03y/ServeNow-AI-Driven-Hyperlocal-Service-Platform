import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/src/api/api";
import Svg, { Path, Circle } from "react-native-svg";

// ─────────────────────────────────────────────────────────────
// Brand tokens — shared across all ServeNow screens
// ─────────────────────────────────────────────────────────────
const C = {
  navy:        "#081F5C",
  navyLight:   "#081F5C0D",
  navyMid:     "#081F5C40",
  sky:         "#BAD6EB",
  cream:       "#F7F2EB",
  creamBorder: "#E8E2D8",
  white:       "#FFFFFF",
  // Status colours
  pendingBg:   "#EFF6FF",
  pendingRing: "#BAD6EB",
  successBg:   "#F0FDF4",
  successRing: "#22C55E",
  successText: "#166834",
  dangerBg:    "#FEF2F2",
  dangerRing:  "#F87171",
  dangerText:  "#991B1B",
};

type Status = "pending" | "approved" | "rejected";

// ─────────────────────────────────────────────────────────────
// Static content per status
// ─────────────────────────────────────────────────────────────
const STATUS_CONTENT: Record<Status, {
  bg: string;
  ringColor: string;
  titleLine1: string;
  titleItalic: string;
  sub: string;
  steps: { label: string; sub: string; state: "done" | "active" | "idle" | "fail" }[];
  infoRows: { label: string; val: string }[];
  ctaLabel: string;
  ctaColor: string;
  ctaTextColor: string;
  ghostLabel: string;
  note: string;
}> = {
  pending: {
    bg: C.pendingBg,
    ringColor: C.pendingRing,
    titleLine1: "Verification in",
    titleItalic: "progress.",
    sub: "We're reviewing your documents. You'll be notified within 24 hours.",
    steps: [
      { label: "Application submitted",  sub: "Received successfully",       state: "done" },
      { label: "Documents uploaded",      sub: "Aadhaar front, back, selfie", state: "done" },
      { label: "Identity verification",   sub: "Currently in review",         state: "active" },
      { label: "Profile activation",      sub: "Pending completion",          state: "idle" },
    ],
    infoRows: [
      { label: "Submitted",        val: "28 Apr 2025" },
      { label: "Est. review time", val: "24 hours" },
      { label: "Status",           val: "Under review" },
    ],
    ctaLabel:      "Check Status",
    ctaColor:      C.navy,
    ctaTextColor:  C.cream,
    ghostLabel:    "Contact Support",
    note: "Your documents are encrypted and reviewed only by our trust & safety team.",
  },
  approved: {
    bg: C.successBg,
    ringColor: C.successRing,
    titleLine1: "You're all set,",
    titleItalic: "welcome!",
    sub: "Your profile is live. Start browsing and accepting jobs near you.",
    steps: [
      { label: "Application submitted",  sub: "Received successfully",       state: "done" },
      { label: "Documents uploaded",      sub: "Aadhaar front, back, selfie", state: "done" },
      { label: "Identity verified",       sub: "Verified on 29 Apr 2025",     state: "done" },
      { label: "Profile activated",       sub: "Ready to accept jobs",         state: "done" },
    ],
    infoRows: [
      { label: "Approved on", val: "29 Apr 2025" },
      { label: "Worker ID",   val: "WK-00421" },
      { label: "Status",      val: "Active" },
    ],
    ctaLabel:      "Go to Dashboard",
    ctaColor:      C.successText,
    ctaTextColor:  C.successBg,
    ghostLabel:    "View My Profile",
    note: "You can start accepting nearby jobs immediately. Keep your profile updated.",
  },
  rejected: {
    bg: C.dangerBg,
    ringColor: C.dangerRing,
    titleLine1: "Verification",
    titleItalic: "unsuccessful.",
    sub: "We couldn't verify your identity. Please re-upload clear, valid documents.",
    steps: [
      { label: "Application submitted",  sub: "Received successfully",       state: "done" },
      { label: "Documents uploaded",      sub: "Aadhaar front, back, selfie", state: "done" },
      { label: "Identity verification",   sub: "Could not be verified",       state: "fail" },
      { label: "Profile activation",      sub: "Requires re-verification",    state: "idle" },
    ],
    infoRows: [
      { label: "Reviewed on", val: "28 Apr 2025" },
      { label: "Reason",      val: "Unclear document" },
      { label: "Status",      val: "Action required" },
    ],
    ctaLabel:      "Re-upload Documents",
    ctaColor:      C.dangerText,
    ctaTextColor:  C.dangerBg,
    ghostLabel:    "Contact Support",
    note: "Common issues: blurry photos, expired ID, or face not visible in selfie.",
  },
};

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const LogoMark = () => (
  <Svg width={14} height={14} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
    <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
  </Svg>
);

const BackIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <Path d="M9 3L5 7l4 4" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 10 10" fill="none">
    <Path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke={C.navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
  </Svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
    <Path d="M2 6l3 3 5-5" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const XIcon = ({ color }: { color: string }) => (
  <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
    <Path d="M3 3l6 6M9 3L3 9" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);

// ─────────────────────────────────────────────────────────────
// Animated spinner (pending state)
// ─────────────────────────────────────────────────────────────
function SpinnerIcon() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Circle cx={18} cy={18} r={14} stroke={C.sky} strokeWidth={3} strokeDasharray="20 68" />
        <Circle cx={18} cy={18} r={14} stroke={C.navy} strokeWidth={3} strokeDasharray="68 20" strokeDashoffset={-20} opacity={0.15} />
      </Svg>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// Pulse ring animation
// ─────────────────────────────────────────────────────────────
function PulseRing({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const scale   = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] });
  const opacity = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.15, 0] });
  return (
    <Animated.View
      style={{
        position: "absolute",
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: color,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Step row
// ─────────────────────────────────────────────────────────────
function StepRow({
  step, isLast,
}: {
  step: { label: string; sub: string; state: "done" | "active" | "idle" | "fail" };
  isLast: boolean;
}) {
  const dotColor =
    step.state === "done"   ? C.navy :
    step.state === "active" ? C.sky :
    step.state === "fail"   ? C.dangerRing : C.creamBorder;

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <View style={{ alignItems: "center" }}>
        <View style={[st.stepDot, { backgroundColor: dotColor }]}>
          {step.state === "done"   && <CheckIcon color={C.cream} />}
          {step.state === "active" && <View style={st.stepActiveDot} />}
          {step.state === "fail"   && <XIcon color="#fff" />}
        </View>
        {!isLast && <View style={st.stepLine} />}
      </View>
      <View style={{ paddingBottom: isLast ? 0 : 14, paddingTop: 1 }}>
        <Text style={st.stepLabel}>{step.label}</Text>
        <Text style={st.stepSub}>{step.sub}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────
export default function PendingStatus() {
  const [status, setStatus] = useState<Status>("pending");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/workers/status", "GET");
      if (res?.status) setStatus(res.status as Status);
    } catch (err) {
      console.log("Status check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkStatus(); }, []);

  const content = STATUS_CONTENT[status];

  const handleCTA = () => {
    if (status === "pending")  checkStatus();
    if (status === "approved") router.replace("/(tabs)/home");
    if (status === "rejected") router.push("/worker/verification");
  };

  return (
    <View style={st.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
      <View style={st.bg1} />
      <View style={st.bg2} />

      {/* Top bar */}
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <BackIcon />
        </TouchableOpacity>
        <View style={st.brandRow}>
          <View style={st.logoBox}><LogoMark /></View>
          <Text style={st.brandName}>ServeNow</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Status illustration card ── */}
        <View style={[st.illustrationCard, { backgroundColor: content.bg }]}>
          {/* Icon ring */}
          <View style={st.iconRingWrap}>
            <PulseRing color={content.ringColor} />
            <View style={[st.iconRing, { backgroundColor: content.ringColor + "30" }]}>
              {status === "pending"  && <SpinnerIcon />}
              {status === "approved" && <CheckIcon color={C.successText} />}
              {status === "rejected" && <XIcon color={C.dangerText} />}
            </View>
          </View>

          {/* Title */}
          <Text style={st.illustTitle}>
            {content.titleLine1}{"\n"}
            <Text style={st.illustItalic}>{content.titleItalic}</Text>
          </Text>
          <Text style={st.illustSub}>{content.sub}</Text>
        </View>

        {/* ── Progress steps ── */}
        <View style={st.card}>
          {content.steps.map((step, i) => (
            <StepRow key={step.label} step={step} isLast={i === content.steps.length - 1} />
          ))}
        </View>

        {/* ── Info rows ── */}
        <View style={st.card}>
          {content.infoRows.map((row, i) => (
            <View key={row.label}>
              <View style={st.infoRow}>
                <Text style={st.infoLabel}>{row.label}</Text>
                <Text style={st.infoVal}>{row.val}</Text>
              </View>
              {i < content.infoRows.length - 1 && <View style={st.divider} />}
            </View>
          ))}
        </View>

        {/* ── Note ── */}
        <View style={st.noteBox}>
          <ShieldIcon />
          <Text style={st.noteTxt}>{content.note}</Text>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[st.ctaBtn, { backgroundColor: content.ctaColor }]}
          onPress={handleCTA}
          activeOpacity={0.88}
          disabled={loading}
        >
          <Text style={[st.ctaTxt, { color: content.ctaTextColor }]}>
            {loading ? "Checking…" : content.ctaLabel}
          </Text>
          <View style={st.ctaChip}><ArrowIcon /></View>
        </TouchableOpacity>

        <TouchableOpacity style={st.ghostBtn} activeOpacity={0.75}>
          <Text style={st.ghostTxt}>{content.ghostLabel}</Text>
        </TouchableOpacity>

        {/* ── Trust strip ── */}
        <View style={st.trust}>
          <Text style={st.trustTxt}>✦ 256-bit encrypted</Text>
          <View style={st.trustDot} />
          <Text style={st.trustTxt}>GDPR compliant</Text>
          <View style={st.trustDot} />
          <Text style={st.trustTxt}>24hr review</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  bg1:  { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: C.sky,  opacity: 0.24, top: -70, right: -70 },
  bg2:  { position: "absolute", width: 160, height: 160, borderRadius: 80,  backgroundColor: C.navy, opacity: 0.05, bottom: 80, left: -40 },

  topBar:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 54, paddingBottom: 8, zIndex: 2 },
  backBtn:  { width: 32, height: 32, borderRadius: 8, backgroundColor: C.white, borderWidth: 1, borderColor: C.creamBorder, alignItems: "center", justifyContent: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  logoBox:  { width: 26, height: 26, backgroundColor: C.navy, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  brandName:{ fontFamily: "serif", fontSize: 16, fontWeight: "700", color: C.navy, letterSpacing: -0.2 },

  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 60 },

  // Illustration card
  illustrationCard: {
    borderRadius: 20, padding: 28, alignItems: "center",
    marginBottom: 14,
    borderWidth: 1, borderColor: C.creamBorder,
  },
  iconRingWrap: { width: 72, height: 72, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  iconRing:     { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", position: "absolute" },
  illustTitle:  { fontFamily: "serif", fontSize: 24, fontWeight: "700", color: C.navy, letterSpacing: -0.5, textAlign: "center", lineHeight: 30, marginBottom: 8 },
  illustItalic: { fontStyle: "italic", color: C.sky },
  illustSub:    { fontSize: 12, color: C.navy, opacity: 0.42, textAlign: "center", lineHeight: 18 },

  // Card (steps + info)
  card: {
    backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1.5, borderColor: C.creamBorder,
    padding: 16, marginBottom: 12,
  },

  // Steps
  stepDot:       { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepActiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.navy },
  stepLine:      { width: 1.5, flex: 1, backgroundColor: C.creamBorder, minHeight: 10, marginTop: 3 },
  stepLabel:     { fontSize: 12, fontWeight: "600", color: C.navy, marginBottom: 2 },
  stepSub:       { fontSize: 10, color: C.navy, opacity: 0.35, lineHeight: 14 },

  // Info rows
  infoRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7 },
  infoLabel: { fontSize: 11, color: C.navy, opacity: 0.4 },
  infoVal:   { fontSize: 11, fontWeight: "700", color: C.navy },
  divider:   { height: 1, backgroundColor: C.creamBorder },

  // Note
  noteBox: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: C.navyLight, borderRadius: 12,
    padding: 12, marginBottom: 14,
  },
  noteTxt: { flex: 1, fontSize: 11, color: C.navy, opacity: 0.4, lineHeight: 16 },

  // CTA
  ctaBtn: {
    height: 52, borderRadius: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    marginBottom: 10,
  },
  ctaTxt:  { fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
  ctaChip: { width: 22, height: 22, backgroundColor: C.sky, borderRadius: 6, alignItems: "center", justifyContent: "center" },

  // Ghost
  ghostBtn: {
    height: 46, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.creamBorder,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  ghostTxt: { fontSize: 13, fontWeight: "600", color: C.navy, opacity: 0.45 },

  // Trust
  trust:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: C.navyLight, borderRadius: 12, padding: 12 },
  trustTxt: { fontSize: 10, color: C.navy, opacity: 0.3, fontWeight: "500" },
  trustDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: C.navy, opacity: 0.18 },
});