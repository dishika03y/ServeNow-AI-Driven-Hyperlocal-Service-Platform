import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "@/src/api/api";

// ── Design tokens ──────────────────────────────────────────────────────────────
const CREAM      = "#F7F2EB";
const NAVY       = "#081F5C";
const SKY        = "#BAD6EB";
const SKY_DIM    = "rgba(186,214,235,0.18)";
const WHITE      = "#FFFFFF";
const MUTED      = "rgba(8,31,92,0.42)";
const BORDER     = "rgba(8,31,92,0.09)";
const SUCCESS    = "#22A06B";
const SUCCESS_DIM= "rgba(34,160,107,0.10)";
const SUCCESS_BDR= "rgba(34,160,107,0.25)";
const DANGER     = "#D94F4F";
const DANGER_DIM = "rgba(217,79,79,0.08)";
const DANGER_BDR = "rgba(217,79,79,0.22)";
const WARM       = "#E8855A";
const WARM_DIM   = "rgba(232,133,90,0.10)";
const WARM_BDR   = "rgba(232,133,90,0.25)";

type StatusType = "pending" | "approved" | "rejected";

const STATUS_CONFIG: Record<StatusType, {
  icon: string; iconColor: string; bg: string; border: string;
  title: string; desc: string; btnLabel: string; btnBg: string; btnText: string;
}> = {
  pending: {
    icon: "time-outline",
    iconColor: NAVY,
    bg: SKY_DIM,
    border: "rgba(186,214,235,0.45)",
    title: "Verification in Progress",
    desc: "We're reviewing your documents carefully. This usually takes 24–48 hours. We'll notify you once done.",
    btnLabel: "Refresh Status",
    btnBg: NAVY,
    btnText: WHITE,
  },
  approved: {
    icon: "checkmark-circle-outline",
    iconColor: SUCCESS,
    bg: SUCCESS_DIM,
    border: SUCCESS_BDR,
    title: "You're Approved! 🎉",
    desc: "Your identity has been verified. You can now start accepting jobs and earning with ServeNow.",
    btnLabel: "Go to Dashboard",
    btnBg: SUCCESS,
    btnText: WHITE,
  },
  rejected: {
    icon: "close-circle-outline",
    iconColor: DANGER,
    bg: DANGER_DIM,
    border: DANGER_BDR,
    title: "Verification Rejected",
    desc: "We couldn't verify your documents. Please re-upload clear, valid copies and resubmit for review.",
    btnLabel: "Re-upload Documents",
    btnBg: DANGER,
    btnText: WHITE,
  },
};

export default function PendingStatus() {
  const router = useRouter();
  const [status, setStatus]   = useState<StatusType>("pending");
  const [loading, setLoading] = useState(false);

  // Pulse animation for the icon ring
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (status !== "pending") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [status]);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/workers/status", "GET");
      setStatus(res.status as StatusType);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkStatus(); }, []);

  const cfg = STATUS_CONFIG[status];

  const handleBtn = () => {
    if (status === "approved") router.replace("/worker/dashboard");
    else if (status === "rejected") router.replace("/worker/verification");
    else checkStatus();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={NAVY} />
        </TouchableOpacity>
        <View style={styles.logoPill}>
          <View style={styles.logoIcon}><Ionicons name="shield-checkmark" size={13} color={WHITE} /></View>
          <Text style={styles.logoText}>ServeNow</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        {/* Animated icon ring */}
        <Animated.View style={[
          styles.iconRing,
          { backgroundColor: cfg.bg, borderColor: cfg.border },
          status === "pending" && { transform: [{ scale: pulse }] },
        ]}>
          <View style={[styles.iconInner, { backgroundColor: WHITE }]}>
            <Ionicons name={cfg.icon as any} size={42} color={cfg.iconColor} />
          </View>
        </Animated.View>

        {/* Status chip */}
        <View style={[styles.chip, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
          <View style={[styles.chipDot, { backgroundColor: cfg.iconColor }]} />
          <Text style={[styles.chipText, { color: cfg.iconColor }]}>
            {status === "pending" ? "Under Review" : status === "approved" ? "Verified" : "Action Required"}
          </Text>
        </View>

        <Text style={styles.title}>{cfg.title}</Text>
        <Text style={styles.desc}>{cfg.desc}</Text>

        {/* Steps (pending only) */}
        {status === "pending" && (
          <View style={styles.stepsCard}>
            {[
              { icon: "document-text-outline", label: "Documents submitted",   done: true },
              { icon: "eye-outline",           label: "Admin review in progress", done: false },
              { icon: "checkmark-done-outline",label: "Approval & activation",  done: false },
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                  <Ionicons name={step.icon as any} size={14} color={step.done ? WHITE : MUTED} />
                </View>
                <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>{step.label}</Text>
                {step.done && <Ionicons name="checkmark" size={13} color={SUCCESS} style={{ marginLeft: "auto" }} />}
              </View>
            ))}
          </View>
        )}

        {/* Primary button */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: cfg.btnBg }, loading && { opacity: 0.6 }]}
          onPress={handleBtn}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <Ionicons name="sync" size={18} color={cfg.btnText} />
            : <Text style={[styles.btnText, { color: cfg.btnText }]}>{cfg.btnLabel}</Text>
          }
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace("/customer/dashboard")}>
          <Text style={styles.secondaryText}>Back to Home</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Questions? Contact{" "}
          <Text style={{ color: NAVY, fontWeight: "700" }}>support@servenow.in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: CREAM },
  topBar:  {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: WHITE,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoPill: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: WHITE, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoIcon: {
    width: 22, height: 22, borderRadius: 6, backgroundColor: NAVY,
    justifyContent: "center", alignItems: "center",
  },
  logoText: { color: NAVY, fontSize: 13, fontWeight: "700" },

  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 0 },

  iconRing: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 2, justifyContent: "center", alignItems: "center",
    marginBottom: 20,
  },
  iconInner: {
    width: 96, height: 96, borderRadius: 48,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 16,
  },
  chipDot:  { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },

  title: { color: NAVY, fontSize: 24, fontWeight: "800", textAlign: "center", letterSpacing: -0.4, marginBottom: 10 },
  desc:  { color: MUTED, fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 24 },

  stepsCard: {
    width: "100%", backgroundColor: WHITE, borderRadius: 20,
    padding: 18, gap: 14, marginBottom: 24,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stepRow:      { flexDirection: "row", alignItems: "center", gap: 12 },
  stepDot:      {
    width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(8,31,92,0.06)",
    justifyContent: "center", alignItems: "center",
  },
  stepDotDone:  { backgroundColor: NAVY },
  stepLabel:    { color: MUTED, fontSize: 13, fontWeight: "500", flex: 1 },
  stepLabelDone:{ color: NAVY, fontWeight: "700" },

  btn: {
    width: "100%", paddingVertical: 17, borderRadius: 50,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
    shadowColor: NAVY, shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnText:      { fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  secondaryBtn: {
    width: "100%", paddingVertical: 15, borderRadius: 50,
    alignItems: "center", backgroundColor: WHITE,
    borderWidth: 1, borderColor: BORDER, marginBottom: 20,
  },
  secondaryText:{ color: MUTED, fontSize: 15, fontWeight: "700" },
  hint:         { color: MUTED, fontSize: 12, textAlign: "center" },
});