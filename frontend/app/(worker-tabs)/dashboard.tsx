import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter, Stack } from "expo-router";

const Dashboard: React.FC = () => {
  const [available, setAvailable] = useState<boolean>(true);
  const router = useRouter();

  const toggleAvailability = () => setAvailable((prev) => !prev);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.appLabel}>WorkerOS</Text>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <View style={styles.notifDot} />
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.heroName}>Ramesh Kumar</Text>
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <View style={styles.tagDot} />
              <Text style={styles.tagText}>Electrician</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>⭐ 4.5 Rating</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Delhi NCR</Text>
            </View>
          </View>
        </View>

        {/* Availability Card */}
        <TouchableOpacity
          style={[styles.availCard, available && styles.availCardOnline]}
          onPress={toggleAvailability}
          activeOpacity={0.85}
        >
          <View style={styles.availLeft}>
            <View
              style={[styles.pulse, available && styles.pulseActive]}
            />
            <View>
              <Text style={styles.availLabel}>STATUS</Text>
              <Text style={styles.availStatus}>
                {available ? "Available for work" : "Offline — not accepting jobs"}
              </Text>
            </View>
          </View>

          {/* Toggle */}
          <View
            style={[
              styles.toggleTrack,
              available && styles.toggleTrackOn,
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                available && styles.toggleThumbOn,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Stats Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S SNAPSHOT</Text>
          <Text style={styles.seeAll}>View all</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* New Jobs */}
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <View style={[styles.statIcon, styles.iconGreen]}>
                <Text style={styles.statEmoji}>💼</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>+2</Text>
              </View>
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>New job requests</Text>
          </View>

          {/* In Progress */}
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <View style={[styles.statIcon, styles.iconOrange]}>
                <Text style={styles.statEmoji}>⏱</Text>
              </View>
              <View style={[styles.statBadge, styles.statBadgeOrange]}>
                <Text style={[styles.statBadgeText, styles.statBadgeTextOrange]}>live</Text>
              </View>
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Jobs in progress</Text>
          </View>

          {/* Jobs Done */}
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <View style={[styles.statIcon, styles.iconBlue]}>
                <Text style={styles.statEmoji}>📈</Text>
              </View>
            </View>
            <Text style={styles.statValue}>120+</Text>
            <Text style={styles.statLabel}>Jobs completed</Text>
          </View>

          {/* Rating */}
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <View style={[styles.statIcon, styles.iconPurple]}>
                <Text style={styles.statEmoji}>⭐</Text>
              </View>
            </View>
            <Text style={styles.statValue}>4.5</Text>
            <Text style={styles.statLabel}>Avg. rating</Text>
          </View>
        </View>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsTop}>
            <View>
              <Text style={styles.earnLabel}>EARNINGS TODAY</Text>
              <Text style={styles.earnAmount}>₹800</Text>
              <Text style={styles.earnSub}>across 2 completed jobs</Text>
            </View>
            <TouchableOpacity
              style={styles.earnBtn}
              onPress={() => router.push("/worker/earnings")}
              activeOpacity={0.8}
            >
              <Text style={styles.earnBtnText}>Details</Text>
            </TouchableOpacity>
          </View>

          {/* Mini Bar Chart */}
          <View style={styles.miniBars}>
            {[30, 50, 40, 70, 60, 80, 100].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.miniBar,
                  { height: `${h}%` },
                  i === 6 && styles.miniBarActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnsSection}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push("/worker/job-requests")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>View Job Requests</Text>
          </TouchableOpacity>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => router.push("/worker/earnings")}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineText}>Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => router.push("/worker/profile")}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineText}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Dashboard;

const NAVY = "#0B2239";
const NAVY_MID = "#163552";
const NAVY_LIGHT = "#1E4A6E";
const ACCENT = "#00D68F";
const ACCENT_DIM = "rgba(0,214,143,0.12)";
const WARM = "#FF8C42";
const WARM_DIM = "rgba(255,140,66,0.12)";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#EEF4FA";
const MUTED = "rgba(200,220,235,0.55)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },
  scrollContent: {
    paddingBottom: 36,
  },

  // TOP BAR
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 10,
  },
  appLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  notifIcon: {
    fontSize: 16,
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: WARM,
    borderWidth: 1.5,
    borderColor: NAVY,
    zIndex: 1,
  },

  // HERO
  hero: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    paddingTop: 6,
  },
  greeting: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 4,
  },
  heroName: {
    color: TEXT,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ACCENT,
  },
  tagText: {
    color: MUTED,
    fontSize: 12,
  },

  // AVAILABILITY
  availCard: {
    marginHorizontal: 22,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availCardOnline: {
    borderColor: "rgba(0,214,143,0.25)",
  },
  availLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MUTED,
  },
  pulseActive: {
    backgroundColor: ACCENT,
  },
  availLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  availStatus: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  toggleTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  seeAll: {
    color: ACCENT,
    fontSize: 12,
  },

  // STATS GRID
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 22,
    gap: 12,
  },
  statCard: {
    width: "47.5%",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
  },
  statIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  iconGreen: { backgroundColor: ACCENT_DIM },
  iconOrange: { backgroundColor: WARM_DIM },
  iconBlue: { backgroundColor: "rgba(82,180,255,0.12)" },
  iconPurple: { backgroundColor: "rgba(160,110,255,0.12)" },
  statEmoji: { fontSize: 14 },
  statBadge: {
    backgroundColor: ACCENT_DIM,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  statBadgeText: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: "600",
  },
  statBadgeOrange: { backgroundColor: WARM_DIM },
  statBadgeTextOrange: { color: WARM },
  statValue: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  statLabel: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },

  // EARNINGS CARD
  earningsCard: {
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: "#0B3A2B",
    borderWidth: 1,
    borderColor: "rgba(0,214,143,0.15)",
    borderRadius: 18,
    padding: 20,
  },
  earningsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  earnLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  earnAmount: {
    color: ACCENT,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  earnSub: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  earnBtn: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: "rgba(0,214,143,0.25)",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  earnBtnText: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: "500",
  },
  miniBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    height: 36,
  },
  miniBar: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: "rgba(0,214,143,0.2)",
  },
  miniBarActive: {
    backgroundColor: ACCENT,
  },

  // BUTTONS
  btnsSection: {
    paddingHorizontal: 22,
    paddingTop: 18,
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: NAVY,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnOutlineText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },
});