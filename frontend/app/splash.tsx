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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path, Circle } from "react-native-svg";

const { width: W } = Dimensions.get("window");

const C = {
  navy: "#081F5C",
  sky: "#BAD6EB",
  skyDim: "#BAD6EB28",
  skyFaint: "#BAD6EB0F",
  cream: "#F7F2EB",
  creamFaint: "#F7F2EB08",
  white10: "#FFFFFF1A",
};

function LogoMark() {
  return (
    <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
      <Path d="M24 4L38 12V28L24 36L10 28V12L24 4Z" fill={C.sky} opacity={0.9} />
      <Path d="M24 14L31 18V26L24 30L17 26V18L24 14Z" fill={C.sky} opacity={0.35} />
      <Circle cx={24} cy={22} r={4.5} fill={C.cream} />
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
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.65],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.5, 0.15, 0],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          borderRadius: 30,
          borderWidth: 1.5,
          borderColor: C.skyDim,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

export default function Splash() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    // animations
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();

    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentY, {
        toValue: 0,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 🔥 REAL LOGIN CHECK
    const checkAuth = async () => {
  const token = await AsyncStorage.getItem("access_token");
  const role = await AsyncStorage.getItem("role"); // 👈 ADD THIS

  setTimeout(() => {
    if (token) {
      if (role === "Admin") {
        router.replace("/admin/dashboard");
      } else if (role === "worker") {
        router.replace("/worker/home");
      } else {
        router.replace("/(tabs)/home");
      }
    } else {
      router.replace("/auth/login");
    }
  }, 2000);
};

    checkAuth();
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      <View style={st.bgCircle1} />
      <View style={st.bgCircle2} />

      {/* Logo */}
      <Animated.View style={[st.logoWrap, { opacity: fade, transform: [{ scale }] }]}>
        <View style={st.outerRing}>
          <PulseRing />
          <View style={st.innerRing}>
            <LogoMark />
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentY }] }}>
        <Text style={st.brand}>ServeNow</Text>

        <Text style={st.progressLabel}>Loading your experience…</Text>

        <View style={st.progressTrack}>
          <Animated.View style={[st.progressFill, { width: barWidth }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  bgCircle1: {
    position: "absolute",
    width: W * 0.8,
    height: W * 0.8,
    borderRadius: 200,
    backgroundColor: C.sky,
    opacity: 0.05,
  },
  bgCircle2: {
    position: "absolute",
    width: W * 0.5,
    height: W * 0.5,
    borderRadius: 200,
    backgroundColor: C.sky,
    opacity: 0.03,
    bottom: -50,
    left: -50,
  },
  logoWrap: { marginBottom: 40 },
  outerRing: {
    width: 110,
    height: 110,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    color: C.cream,
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  progressLabel: {
    color: "#fff",
    opacity: 0.5,
    textAlign: "center",
    marginBottom: 10,
  },
  progressTrack: {
    width: 200,
    height: 3,
    backgroundColor: "#ffffff20",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.sky,
  },
});