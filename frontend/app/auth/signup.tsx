import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { apiRequest } from "../../src/api/api";
import Svg, { Path, Circle, Rect } from "react-native-svg";

// ── Brand Tokens (identical to LoginScreen) ───────────────────
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
  success: "#166534",
  successBg: "#F0FDF4",
  successBorder: "#BBF7D0",
};

// ── Icons ──────────────────────────────────────────────────────
const UserIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Circle cx={9} cy={6} r={3} stroke={C.navy} strokeWidth={1.3} />
    <Path
      d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6"
      stroke={C.navy}
      strokeWidth={1.3}
      strokeLinecap="round"
    />
  </Svg>
);

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

const MailIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={2} y={4} width={14} height={10} rx={2} stroke={C.navy} strokeWidth={1.3} />
    <Path d="M2 6l7 5 7-5" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" />
  </Svg>
);

const LockIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={3} y={8} width={12} height={8} rx={2} stroke={C.navy} strokeWidth={1.3} />
    <Path d="M6 8V5.5a3 3 0 016 0V8" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" />
    <Circle cx={9} cy={12} r={1.2} fill={C.navy} />
  </Svg>
);

const CityIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M9 2C6.2 2 4 4.2 4 7c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z"
      stroke={C.navy}
      strokeWidth={1.3}
    />
    <Circle cx={9} cy={7} r={1.8} stroke={C.navy} strokeWidth={1.2} />
  </Svg>
);

const PinIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={2} y={3} width={14} height={12} rx={2} stroke={C.navy} strokeWidth={1.3} />
    <Path d="M2 7h14" stroke={C.navy} strokeWidth={1.3} />
    <Path d="M6 3v4M12 3v4" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" />
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
      <Path d="M2 2l12 12" stroke={C.navy} strokeWidth={1.2} strokeLinecap="round" />
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

// ── Field Component ────────────────────────────────────────────
function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  optional = false,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  optional?: boolean;
  icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.fieldWrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optionalBadge}>Optional</Text>}
      </View>
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
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
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

// ── Step indicator ─────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepDots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.stepDot, i === current && styles.stepDotActive]}
        />
      ))}
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────
export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0 = personal, 1 = location

  const handleNext = () => {
    if (!fullName || !phone || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStep(1);
  };

  const handleSignup = async () => {
    if (!city || !pincode) {
      setError("Please enter your city and pincode.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/register", "POST", {
        fullName,
        phone,
        email,
        password,
        city,
        pincode,
      });
      Alert.alert("Welcome to ServeNow!", "Your account has been created.", [
        { text: "Login now", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (err: any) {
      let msg = "Something went wrong. Please try again.";
      if (err.response) {
        const { status, data } = err.response;
        if (status === 422) msg = "Please check your details — some fields are missing or invalid.";
        else if (status === 400) msg = data?.detail || "This account already exists.";
        else if (status === 401) msg = "Incorrect phone or password.";
      }
      setError(msg);
      if (__DEV__) console.log("Signup Error:", JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Background accents */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Eyebrow */}
        <View style={styles.eyebrow}>
          <View style={styles.logoMark}>
            <LogoMark />
          </View>
          <Text style={styles.brandText}>ServeNow</Text>
          <Text style={styles.tagline}>HYPERLOCAL AI</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Card header */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.heading}>
                {step === 0 ? (
                  <>Create your{"\n"}<Text style={styles.headingItalic}>account.</Text></>
                ) : (
                  <>Almost{"\n"}<Text style={styles.headingItalic}>there.</Text></>
                )}
              </Text>
              <Text style={styles.desc}>
                {step === 0
                  ? "Join 1M+ users finding trusted services"
                  : "Tell us where you're located"}
              </Text>
            </View>
            <StepDots current={step} total={2} />
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Step 0 — Personal info */}
          {step === 0 && (
            <>
              <Field
                label="FULL NAME"
                placeholder="Arjun Sharma"
                value={fullName}
                onChangeText={setFullName}
                icon={<UserIcon />}
              />
              <Field
                label="PHONE NUMBER"
                placeholder="+91 98765 43210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                icon={<PhoneIcon />}
              />
              <Field
                label="EMAIL ADDRESS"
                placeholder="arjun@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                optional
                icon={<MailIcon />}
              />
              <Field
                label="PASSWORD"
                placeholder="Create a strong password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<LockIcon />}
              />

              <TouchableOpacity
                style={styles.btn}
                onPress={handleNext}
                activeOpacity={0.88}
              >
                <Text style={styles.btnText}>Continue</Text>
                <View style={styles.btnArrow}>
                  <ArrowIcon />
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* Step 1 — Location */}
          {step === 1 && (
            <>
              <Field
                label="CITY"
                placeholder="Mumbai"
                value={city}
                onChangeText={setCity}
                icon={<CityIcon />}
              />
              <Field
                label="PINCODE"
                placeholder="400001"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                icon={<PinIcon />}
              />

              <View style={styles.locationNote}>
                <Text style={styles.locationNoteText}>
                  We use your location to connect you with nearby verified service providers.
                </Text>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => { setStep(0); setError(""); }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.backBtnText}>← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.btnFlex]}
                  onPress={handleSignup}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color={C.cream} />
                  ) : (
                    <>
                      <Text style={styles.btnText}>Create account</Text>
                      <View style={styles.btnArrow}>
                        <ArrowIcon />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>already a member?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login link */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.replace("/auth/login")}
            activeOpacity={0.75}
          >
            <Text style={styles.loginBtnText}>Sign in to existing account</Text>
          </TouchableOpacity>
        </View>

        {/* Trust strip */}
        <View style={styles.trust}>
          <View style={styles.trustItem}>
            <Text style={styles.trustText}>✦ Verified providers</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <Text style={styles.trustText}>SSL secured</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <Text style={styles.trustText}>Free to join</Text>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.5,
    fontFamily: "serif",
    lineHeight: 34,
  },
  headingItalic: {
    fontStyle: "italic",
    color: C.sky,
  },
  desc: {
    fontSize: 12,
    color: C.navy,
    opacity: 0.4,
    marginTop: 4,
    lineHeight: 17,
  },

  // Step dots
  stepDots: {
    flexDirection: "row",
    gap: 6,
    paddingTop: 4,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.navy,
    opacity: 0.15,
  },
  stepDotActive: {
    width: 18,
    opacity: 1,
    backgroundColor: C.navy,
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
    lineHeight: 18,
  },

  // Fields
  fieldWrap: { marginBottom: 14 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: C.navy,
    opacity: 0.5,
  },
  optionalBadge: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: C.navy,
    opacity: 0.35,
    backgroundColor: C.cream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
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
  inputIcon: { opacity: 0.5 },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.navy,
    height: "100%",
  },
  eyeBtn: { opacity: 0.4, padding: 2 },

  // Location note
  locationNote: {
    backgroundColor: C.navyLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    marginTop: 4,
  },
  locationNoteText: {
    fontSize: 12,
    color: C.navy,
    opacity: 0.55,
    lineHeight: 17,
  },

  // Buttons
  btn: {
    height: 52,
    backgroundColor: C.navy,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
  },
  btnFlex: { flex: 1 },
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
  btnRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 6,
  },
  backBtn: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 14,
    color: C.navy,
    opacity: 0.55,
    fontWeight: "500",
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.navyLight },
  dividerText: {
    fontSize: 11,
    color: C.navy,
    opacity: 0.3,
    fontWeight: "500",
    letterSpacing: 0.4,
  },

  // Login link button
  loginBtn: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.cream,
  },
  loginBtnText: {
    fontSize: 14,
    color: C.navy,
    fontWeight: "600",
    opacity: 0.7,
  },

  // Trust strip
  trust: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    backgroundColor: C.navyLight,
    borderRadius: 12,
    padding: 12,
  },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: {
    fontSize: 10,
    color: C.navy,
    opacity: 0.35,
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