import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";

const { width: W } = Dimensions.get("window");

const C = {
  navy:       "#081F5C",
  sky:        "#BAD6EB",
  skyDim:     "#BAD6EB28",
  skyFaint:   "#BAD6EB0F",
  cream:      "#F7F2EB",
  creamFaint: "#F7F2EB08",
  white10:    "#FFFFFF1A",
};

function LogoMark() {
  return (
    <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
      <Path d="M24 4L38 12V28L24 36L10 28V12L24 4Z" fill={C.sky} opacity={0.9} />
      <Path d="M24 14L31 18V26L24 30L17 26V18L24 14Z" fill={C.sky} opacity={0.35} />
      <Circle cx={24} cy={22} r={4.5} fill={C.cream} opacity={0.95} />
      <Circle cx={24} cy={22} r={2} fill={C.navy} />
    </Svg>
  );
}

function PulseRing({ delay = 0 }: { delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const scale   = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.65] });
  const opacity = anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.5, 0.15, 0] });
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        { borderRadius: 30, borderWidth: 1.5, borderColor: C.skyDim, transform: [{ scale }], opacity },
      ]}
    />
  );
}

export default function Splash() {
  // Same refs as original
  const fade     = useRef(new Animated.Value(0)).current;
  const scale    = useRef(new Animated.Value(0.8)).current;
  const progress = useRef(new Animated.Value(0)).current;

  // Extra stagger
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentY    = useRef(new Animated.Value(14)).current;
  const footerFade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Same logic as original
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
    ]).start();

    Animated.timing(progress, {
      toValue: 1, duration: 2200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    // Staggered extras
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 700, delay: 280, useNativeDriver: true }),
      Animated.timing(contentY,    { toValue: 0, duration: 700, delay: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.timing(footerFade, { toValue: 1, duration: 600, delay: 1000, useNativeDriver: true }).start();

    // Same auth logic as original
    const timer = setTimeout(() => {
      const isLoggedIn = false; // 🔥 replace with real check
      if (isLoggedIn) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Same progress interpolation as original
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      <View style={st.bgCircle1} />
      <View style={st.bgCircle2} />

      {/* Logo — same fade + scale refs */}
      <Animated.View style={[st.logoWrap, { opacity: fade, transform: [{ scale }] }]}>
        <View style={st.outerRing}>
          <PulseRing delay={0} />
          <PulseRing delay={900} />
          <View style={st.innerRing}>
            <LogoMark />
          </View>
        </View>
      </Animated.View>

      {/* Brand + tagline + progress */}
      <Animated.View style={[st.centerBlock, { opacity: contentFade, transform: [{ translateY: contentY }] }]}>
        <Text style={st.brand}>ServeNow</Text>

        <View style={st.taglineRow}>
          <View style={st.tagLine} />
          <Text style={st.tagline}>AI HYPERLOCAL</Text>
          <View style={st.tagLine} />
        </View>

        <Text style={st.progressLabel}>Loading your experience…</Text>
        {/* Same progressTrack as original, upgraded style */}
        <View style={st.progressTrack}>
          <Animated.View style={[st.progressFill, { width: barWidth }]} />
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[st.footer, { opacity: footerFade }]}>
        <View style={st.footerRow}>
          <Text style={st.footerTxt}>Verified providers</Text>
          <View style={st.footerDot} />
          <Text style={st.footerTxt}>SSL secured</Text>
          <View style={st.footerDot} />
        </View>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: C.navy,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 36,
  },

  bgCircle1: {
    position: "absolute", width: W * 0.85, height: W * 0.85,
    borderRadius: W * 0.425, backgroundColor: C.sky,
    opacity: 0.05, top: -W * 0.28, right: -W * 0.28,
  },
  bgCircle2: {
    position: "absolute", width: W * 0.55, height: W * 0.55,
    borderRadius: W * 0.275, backgroundColor: C.sky,
    opacity: 0.03, bottom: -W * 0.18, left: -W * 0.18,
  },

  logoWrap:  { marginBottom: 44, alignItems: "center", justifyContent: "center" },
  outerRing: {
    width: 110, height: 110, borderRadius: 30,
    backgroundColor: C.creamFaint, borderWidth: 1.5, borderColor: C.skyFaint,
    alignItems: "center", justifyContent: "center",
  },
  innerRing: {
    width: 80, height: 80, borderRadius: 21,
    backgroundColor: C.creamFaint, borderWidth: 1, borderColor: C.skyDim,
    alignItems: "center", justifyContent: "center",
  },

  centerBlock: { width: "100%", alignItems: "center" },
  brand: {
    fontFamily: "serif", fontSize: 36, fontWeight: "800",
    color: C.cream, letterSpacing: -0.8, marginBottom: 8,
  },

  taglineRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 40 },
  tagLine:    { width: 20, height: 1, backgroundColor: C.sky, opacity: 0.3 },
  tagline:    { fontSize: 10, fontWeight: "600", color: C.sky, opacity: 0.55, letterSpacing: 1.5 },

  progressLabel: {
    fontSize: 11, color: C.cream, opacity: 0.22, fontWeight: "500",
    textAlign: "center", marginBottom: 10, letterSpacing: 0.3,
  },
  progressTrack: {
    width: "70%", height: 2,
    backgroundColor: C.white10, borderRadius: 1, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: C.sky, borderRadius: 1 },

  footer:    { position: "absolute", bottom: 52, alignItems: "center", gap: 6 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  footerTxt: { fontSize: 10, color: C.cream, opacity: 0.2, fontWeight: "500" },
  footerDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.cream, opacity: 0.18 },
  version:   { fontSize: 10, color: C.cream, opacity: 0.1 },
});