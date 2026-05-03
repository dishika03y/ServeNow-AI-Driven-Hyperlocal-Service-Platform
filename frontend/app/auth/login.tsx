import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../../src/api/api";
import Svg, { Path, Circle, Rect, Polygon } from "react-native-svg";
import { handleUserRouting } from "@/src/utils/navigation";

const { width } = Dimensions.get("window");

// ── Brand Tokens ──────────────────────────────────────────────
const C = {
  navy: "#081F5C",
  navyLight: "#081F5C14",
  navyMid: "#081F5C40",
  sky: "#BAD6EB",
  cream: "#F7F2EB",
  creamDark: "#EDE7DC",
  creamBorder: "#E8E2D8",
  white: "#FFFFFF",
  error: "#991B1B",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  muted: "#08204099",
};

// ── Icons ──────────────────────────────────────────────────────
const PhoneIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M3.5 3.5h3l1.5 3.5-1.5 1c.8 1.5 2 2.8 3.5 3.5l1-1.5 3.5 1.5v3c0 .8-.7 1.5-1.5 1.5C6 16 2 12 2 5c0-.8.7-1.5 1.5-1.5z"
      stroke={C.navy}
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect
      x={3}
      y={8}
      width={12}
      height={8}
      rx={2}
      stroke={C.navy}
      strokeWidth={1.3}
    />
    <Path
      d="M6 8V5.5a3 3 0 016 0V8"
      stroke={C.navy}
      strokeWidth={1.3}
      strokeLinecap="round"
    />
    <Circle cx={9} cy={12} r={1.2} fill={C.navy} />
  </Svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
      stroke={C.navy}
      strokeWidth={1.2}
    />
    <Circle cx={8} cy={8} r={2} stroke={C.navy} strokeWidth={1.2} />
    {!visible && (
      <Path
        d="M2 2l12 12"
        stroke={C.navy}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    )}
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
    <Path
      d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"
      stroke={C.navy}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LogoMark = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
    <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Rect
      x={1.5}
      y={5}
      width={9}
      height={6.5}
      rx={1.2}
      stroke={C.navy}
      strokeWidth={1.1}
      opacity={0.4}
    />
    <Path
      d="M4 5V3.5a2 2 0 014 0V5"
      stroke={C.navy}
      strokeWidth={1.1}
      strokeLinecap="round"
      opacity={0.4}
    />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path
      d="M2 6l3 3 5-5"
      stroke={C.navy}
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.4}
    />
  </Svg>
);

const StarIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path
      d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5 3.4 8.9l.5-2.9-2.1-2 2.9-.4L6 1z"
      fill={C.navy}
      opacity={0.4}
    />
  </Svg>
);

// ── InputField ─────────────────────────────────────────────────
function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={C.navyMid}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !showPw}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPw((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <EyeIcon visible={showPw} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────
export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      setError(
        !phone
          ? "Please enter your phone number."
          : "Please enter your password.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", "POST", {
        phone,
        password,
      });

      if (data?.access_token) {
        const token = data.access_token;

        await AsyncStorage.setItem("access_token", token);

        if (data.refresh_token) {
          await AsyncStorage.setItem("refresh_token", data.refresh_token);
        }

        if (data.role) {
          await AsyncStorage.setItem("role", data.role);
        }

        // ✅ CALL /users/me API
        // ✅ CALL /users/me
        const userData = await apiRequest("/users/me", "GET", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await AsyncStorage.setItem("user_role", userData.role);

        // ✅ DIRECT DECISION
        handleUserRouting(userData);
      } else {
        setError("Login failed");
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Invalid phone or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

      {/* Background accents */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Eyebrow / Brand */}
        <View style={styles.eyebrow}>
          <View style={styles.logoMark}>
            <LogoMark />
          </View>
          <Text style={styles.brandText}>ServeNow</Text>
          <Text style={styles.tagline}>HYPERLOCAL AI</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>
            Welcome <Text style={styles.headingItalic}>back.</Text>
          </Text>
          <Text style={styles.desc}>
            Find trusted services near you — login to continue
          </Text>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Field
            label="PHONE NUMBER"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<PhoneIcon />}
          />

          <Field
            label="PASSWORD"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<LockIcon />}
          />

          {/* Forgot */}
          <View style={styles.forgotRow}>
            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color={C.cream} />
            ) : (
              <>
                <Text style={styles.btnText}>Login to ServeNow</Text>
                <View style={styles.btnArrow}>
                  <ArrowIcon />
                </View>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <Text style={styles.socialBtnText}>G Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <Text style={styles.socialBtnText}>⌥ GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.footerLink}>Sign up free</Text>
          </TouchableOpacity>
        </View>

        {/* Trust strip */}
        <View style={styles.trust}>
          <View style={styles.trustItem}>
            <StarIcon />
            <Text style={styles.trustText}>Verified providers</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <ShieldIcon />
            <Text style={styles.trustText}>SSL secured</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <CheckIcon />
            <Text style={styles.trustText}>1M+ users</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.cream,
  },

  // Background accents
  bgCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: C.sky,
    opacity: 0.32,
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: C.navy,
    opacity: 0.06,
    bottom: 60,
    left: -50,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
  },

  // Eyebrow
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logoMark: {
    width: 36,
    height: 36,
    backgroundColor: C.navy,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.3,
  },
  tagline: {
    marginLeft: "auto",
    fontSize: 10,
    color: C.navy,
    opacity: 0.4,
    fontWeight: "500",
    letterSpacing: 0.8,
  },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: C.creamBorder,
  },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.5,
    marginBottom: 4,
    fontFamily: "serif",
  },
  headingItalic: {
    fontStyle: "italic",
    color: C.sky,
  },
  desc: {
    fontSize: 13,
    color: C.navy,
    opacity: 0.45,
    marginBottom: 24,
    lineHeight: 18,
  },

  // Error
  errorBox: {
    backgroundColor: C.errorBg,
    borderWidth: 1,
    borderColor: C.errorBorder,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: C.error,
  },

  // Fields
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: C.navy,
    opacity: 0.5,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.cream,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    height: 50,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputRowFocused: {
    borderColor: C.sky,
    backgroundColor: C.white,
  },
  inputIcon: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.navy,
    height: "100%",
  },
  eyeBtn: {
    opacity: 0.4,
    padding: 2,
  },

  // Forgot
  forgotRow: {
    alignItems: "flex-end",
    marginTop: -6,
    marginBottom: 22,
  },
  forgot: {
    fontSize: 12,
    color: C.navy,
    opacity: 0.5,
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  // Button
  btn: {
    height: 52,
    backgroundColor: C.navy,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    color: C.cream,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  btnArrow: {
    width: 22,
    height: 22,
    backgroundColor: C.sky,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.navyLight,
  },
  dividerText: {
    fontSize: 11,
    color: C.navy,
    opacity: 0.3,
    fontWeight: "500",
    letterSpacing: 0.4,
  },

  // Social
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    height: 44,
    backgroundColor: C.cream,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: C.navy,
    letterSpacing: 0.2,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  footerText: {
    fontSize: 13,
    color: C.navy,
    opacity: 0.45,
  },
  footerLink: {
    fontSize: 13,
    color: C.navy,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  // Trust strip
  trust: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    backgroundColor: C.navyLight,
    borderRadius: 12,
    padding: 12,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trustText: {
    fontSize: 11,
    color: C.navy,
    opacity: 0.4,
    fontWeight: "500",
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.navy,
    opacity: 0.2,
  },
});
