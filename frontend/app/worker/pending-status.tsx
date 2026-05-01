// app/worker/pending-status.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "pending" | "approved" | "rejected";

type StepItem = {
  label: string;
  done: boolean;
  active: boolean;
  failed?: boolean;
};

type StatusConfig = {
  emoji: keyof typeof Ionicons.glyphMap;
  emojiColor: string;
  emojiBg: string;
  title: string;
  titleItalic: string;
  sub: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  steps: StepItem[];
  cta: string;
  ctaSecondary?: string;
  infoTitle: string;
  tips: string[];
};

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, StatusConfig> = {
  pending: {
    emoji: "time-outline",
    emojiColor: "#b07a10",
    emojiBg: "#fdf4e0",
    title: "Under",
    titleItalic: "Review.",
    sub: "We're reviewing your submitted documents. This usually takes 24–48 hours.",
    badge: "Pending Review",
    badgeColor: "#b07a10",
    badgeBg: "#fdf4e0",
    steps: [
      { label: "Documents Submitted",   done: true,  active: false },
      { label: "Identity Verification", done: false, active: true  },
      { label: "Background Check",      done: false, active: false },
      { label: "Account Activated",     done: false, active: false },
    ],
    cta: "Refresh Status",
    ctaSecondary: "Re-upload Documents",
    infoTitle: "What to expect",
    tips: [
      "Ensure all document corners are visible",
      "Photos must be clear and well-lit",
      "Processing may take up to 48 hours",
    ],
  },
  approved: {
    emoji: "checkmark-circle-outline",
    emojiColor: "#1a7a4a",
    emojiBg: "#e6f5ed",
    title: "You're",
    titleItalic: "Approved!",
    sub: "Your identity has been verified. You can now start accepting bookings.",
    badge: "Verified",
    badgeColor: "#1a7a4a",
    badgeBg: "#e6f5ed",
    steps: [
      { label: "Documents Submitted",   done: true, active: false },
      { label: "Identity Verification", done: true, active: false },
      { label: "Background Check",      done: true, active: false },
      { label: "Account Activated",     done: true, active: false },
    ],
    cta: "Go to Worker Dashboard",
    ctaSecondary: "Go to Home",
    infoTitle: "Next Steps",
    tips: [
      "You can now accept bookings in your area",
      "Keep your profile updated for better visibility",
      "Respond quickly to booking requests",
    ],
  },
  rejected: {
    emoji: "close-circle-outline",
    emojiColor: "#c0392b",
    emojiBg: "#fdecea",
    title: "Verification",
    titleItalic: "Failed.",
    sub: "We couldn't verify your documents. Please re-upload clear, valid copies.",
    badge: "Rejected",
    badgeColor: "#c0392b",
    badgeBg: "#fdecea",
    steps: [
      { label: "Documents Submitted",   done: true,  active: false           },
      { label: "Identity Verification", done: false, active: false, failed: true },
      { label: "Background Check",      done: false, active: false           },
      { label: "Account Activated",     done: false, active: false           },
    ],
    cta: "Re-upload Documents",
    ctaSecondary: "Contact Support",
    infoTitle: "How to Fix",
    tips: [
      "Make sure document text is fully readable",
      "Avoid glare or shadows on the document",
      "Selfie must clearly show your face",
    ],
  },
};

// ─── Step Dot ─────────────────────────────────────────────────────────────────
function StepDot({ step }: { step: StepItem }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step.active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [step.active]);

  const bg = step.failed ? "#c0392b" : step.done ? "#1a7a4a" : step.active ? "#1a2f4e" : "#e0e8f0";

  return (
    <Animated.View
      style={[
        styles.stepDot,
        { backgroundColor: bg, transform: [{ scale: step.active ? pulseAnim : 1 }] },
        step.active && styles.stepDotActive,
      ]}
    >
      {step.done && <Ionicons name="checkmark" size={12} color="#fff" />}
      {step.failed && <Ionicons name="close"    size={12} color="#fff" />}
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PendingStatus() {
  const [status, setStatus]   = useState<Status>("pending");
  const [loading, setLoading] = useState(false);
  const cfg = STATUS_CONFIG[status];

  // ── Load status from AsyncStorage ─────────────────────────────────────────
  const checkStatus = async () => {
    setLoading(true);
    try {
      const saved = await AsyncStorage.getItem("kyc_docs");
      if (!saved) { setStatus("pending"); return; }

      const parsed = JSON.parse(saved);
      const values: any[] = Object.values(parsed);
      const allApproved = values.length > 0 && values.every((d) => d.status === "approved");
      const anyRejected = values.some((d) => d.status === "rejected");

      if (anyRejected)       setStatus("rejected");
      else if (allApproved)  setStatus("approved");
      else                   setStatus("pending");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkStatus(); }, []);

  // ── CTA handler ────────────────────────────────────────────────────────────
  const handleCTA = () => {
    if (status === "pending")  checkStatus();
    if (status === "approved") router.replace("/worker/dashboard");
    if (status === "rejected") router.push("/worker/verification");
  };

  const handleSecondary = () => {
    if (status === "pending")  router.push("/worker/verification");
    if (status === "approved") router.replace("/(tabs)/home");
    if (status === "rejected") { /* open support chat */ }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE9E1" />

      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.brand}>
          <View style={styles.logoBox}><Ionicons name="star" size={20} color="#fff" /></View>
          <Text style={styles.brandName}>ServeNow</Text>
        </View>
        <Text style={styles.navTag}>HYPERLOCAL AI</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>
            {cfg.title} <Text style={styles.headingItalic}>{cfg.titleItalic}</Text>
          </Text>
          <Text style={styles.subtext}>{cfg.sub}</Text>
        </View>

        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardTop}>
            <View style={[styles.emojiCircle, { backgroundColor: cfg.emojiBg }]}>
              <Ionicons name={cfg.emoji} size={28} color={cfg.emojiColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.statusCardTitleRow}>
                <Text style={styles.statusCardTitle}>Verification Status</Text>
                <View style={[styles.badge, { backgroundColor: cfg.badgeBg }]}>
                  <Text style={[styles.badgeText, { color: cfg.badgeColor }]}>{cfg.badge}</Text>
                </View>
              </View>
              <Text style={styles.statusCardSub}>Last checked: just now</Text>
            </View>
          </View>

          {/* Steps */}
          <View style={styles.stepsWrap}>
            {cfg.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <StepDot step={step} />
                  {i < cfg.steps.length - 1 && (
                    <View style={[styles.stepLine, { backgroundColor: step.done ? "#1a7a4a" : "#e0e8f0" }]} />
                  )}
                </View>
                <View style={styles.stepRight}>
                  <Text style={[
                    styles.stepLabel,
                    step.done    && styles.stepLabelDone,
                    step.active  && styles.stepLabelActive,
                    step.failed  && styles.stepLabelFailed,
                    !step.done && !step.active && !step.failed && styles.stepLabelMuted,
                  ]}>
                    {step.label}
                  </Text>
                  {step.active && <Text style={styles.stepStatus}>• In Progress</Text>}
                  {step.failed && <Text style={styles.stepStatusFailed}>• Failed</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Info / tips card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={18} color="#2d4a6e" />
            <Text style={styles.infoTitle}>{cfg.infoTitle}</Text>
          </View>
          {cfg.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, loading && styles.ctaBtnLoading]}
          onPress={handleCTA}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.ctaBtnLeft}>
              <Ionicons
                name={
                  status === "pending"  ? "refresh-outline"    :
                  status === "approved" ? "grid-outline"       :
                                         "cloud-upload-outline"
                }
                size={18}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.ctaBtnText}>{cfg.cta}</Text>
            </View>
          )}
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Secondary CTA */}
        {cfg.ctaSecondary && (
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSecondary} activeOpacity={0.85}>
            <View style={styles.secondaryLeft}>
              <Ionicons
                name={status === "approved" ? "home-outline" : "document-outline"}
                size={18}
                color="#1a2f4e"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.secondaryText}>{cfg.ctaSecondary}</Text>
            </View>
            <View style={styles.arrowCircleGhost}>
              <Ionicons name="arrow-forward" size={16} color="#1a2f4e" />
            </View>
          </TouchableOpacity>
        )}

        {/* Trust bar */}
        <View style={styles.trustBar}>
          <Text style={styles.trustItem}>🔒 SSL secured</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustItem}>✓ Encrypted</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustItem}>★ Verified safely</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDE9E1" },
  scroll:   { paddingBottom: 40 },

  navbar:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 18 },
  brand:     { flexDirection: "row", alignItems: "center" },
  logoBox:   { width: 42, height: 42, borderRadius: 12, backgroundColor: "#1a2f4e", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: 20, fontWeight: "700", color: "#1a2f4e", marginLeft: 10 },
  navTag:    { fontSize: 10, fontWeight: "600", letterSpacing: 2, color: "#8a9ab0" },

  headerRow:     { paddingHorizontal: 20, marginBottom: 20 },
  heading:       { fontSize: 32, fontWeight: "800", color: "#1a2f4e" },
  headingItalic: { fontStyle: "italic", fontWeight: "400", color: "#7BAFD4" },
  subtext:       { fontSize: 13, color: "#8a9ab0", marginTop: 4, lineHeight: 19 },

  // Status card
  statusCard:         { backgroundColor: "#fff", borderRadius: 20, marginHorizontal: 20, padding: 20, marginBottom: 16, shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  statusCardTop:      { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 24 },
  emojiCircle:        { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statusCardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  statusCardTitle:    { fontSize: 14, fontWeight: "700", color: "#1a2f4e" },
  statusCardSub:      { fontSize: 11, color: "#94a3b8" },
  badge:              { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText:          { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },

  // Steps
  stepsWrap:       { gap: 0 },
  stepRow:         { flexDirection: "row", alignItems: "flex-start", gap: 14, minHeight: 52 },
  stepLeft:        { alignItems: "center", width: 24 },
  stepDot:         { width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  stepDotActive:   { borderWidth: 2, borderColor: "#7BAFD4" },
  stepLine:        { width: 2, flex: 1, minHeight: 24, borderRadius: 1, marginTop: 2 },
  stepRight:       { flex: 1, paddingTop: 2, paddingBottom: 12 },
  stepLabel:       { fontSize: 13, lineHeight: 20 },
  stepLabelDone:   { color: "#1a7a4a", fontWeight: "700" },
  stepLabelActive: { color: "#1a2f4e", fontWeight: "700" },
  stepLabelFailed: { color: "#c0392b", fontWeight: "700" },
  stepLabelMuted:  { color: "#94a3b8", fontWeight: "400" },
  stepStatus:      { fontSize: 11, color: "#7BAFD4", fontWeight: "700", marginTop: 2 },
  stepStatusFailed:{ fontSize: 11, color: "#c0392b", fontWeight: "700", marginTop: 2 },

  // Info card
  infoCard:   { backgroundColor: "#fff", borderRadius: 20, marginHorizontal: 20, padding: 18, marginBottom: 16, shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  infoHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  infoTitle:  { fontSize: 14, fontWeight: "700", color: "#1a2f4e" },
  tipRow:     { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  tipDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: "#7BAFD4", marginTop: 5 },
  tipText:    { fontSize: 13, color: "#64748b", flex: 1, lineHeight: 19 },

  // CTA
  ctaBtn:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, backgroundColor: "#1a2f4e", marginBottom: 12, shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  ctaBtnLoading: { opacity: 0.75 },
  ctaBtnLeft:    { flexDirection: "row", alignItems: "center" },
  ctaBtnText:    { fontSize: 15, fontWeight: "700", color: "#fff" },
  arrowCircle:   { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },

  secondaryBtn:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: "#d8e2ec", backgroundColor: "#f9fafb", marginBottom: 20 },
  secondaryLeft:     { flexDirection: "row", alignItems: "center" },
  secondaryText:     { fontSize: 14, fontWeight: "600", color: "#1a2f4e" },
  arrowCircleGhost:  { width: 34, height: 34, borderRadius: 10, backgroundColor: "#e8eef5", alignItems: "center", justifyContent: "center" },

  // Trust bar
  trustBar:  { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.55)", marginHorizontal: 32, marginBottom: 8, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16 },
  trustItem: { fontSize: 11, color: "#8a9ab0" },
  trustDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: "#b0bec8", marginHorizontal: 6 },
});