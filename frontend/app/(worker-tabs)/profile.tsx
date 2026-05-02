import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";

// ── Tokens (matches Home screen) ─────────────────────────────────────────────
const CREAM        = "#F2EDE4";
const CREAM2       = "#EDE7DC";
const WHITE        = "#FFFFFF";
const BDR          = "#E2DBD0";
const INK          = "#1A2744";
const MUTED        = "rgba(26,39,68,0.45)";
const SHADOW       = "rgba(26,39,68,0.08)";
const ACCENT       = "#00897B";
const ACCENT_DIM   = "rgba(0,137,123,0.10)";
const ACCENT_BDR   = "rgba(0,137,123,0.25)";
const WARM         = "#E07A10";
const WARM_DIM     = "rgba(224,122,16,0.10)";
const WARM_BDR     = "rgba(224,122,16,0.25)";
const SKY          = "#1878CC";
const SKY_DIM      = "rgba(24,120,204,0.10)";
const SKY_BDR      = "rgba(24,120,204,0.25)";
const PURPLE       = "#6B3FCC";
const PURPLE_DIM   = "rgba(107,63,204,0.10)";
const PURPLE_BDR   = "rgba(107,63,204,0.25)";
const DANGER       = "#D93838";
const DANGER_DIM   = "rgba(217,56,56,0.09)";
const DANGER_BDR   = "rgba(217,56,56,0.22)";
const DIVIDER      = "rgba(26,39,68,0.08)";

// ── Data ──────────────────────────────────────────────────────────────────────
interface WorkerProfile {
  name: string;       skill: string;    rating: string;
  mobile: string;     experience: string; location: string;
  jobs: string;       earnings: string; reviews: string;
  memberSince: string;
}

const SKILLS_TAGS = ["Wiring", "MCB Panel", "Fan Install", "Inverter", "CCTV"];

// ── Component ─────────────────────────────────────────────────────────────────
const Profile: React.FC = () => {
  const router = useRouter();

  const [profile] = useState<WorkerProfile>({
    name:        "Tanmay",
    skill:       "Electrician",
    rating:      "4.5",
    mobile:      "+91 9XXXXXXXXX",
    experience:  "5 Years",
    location:    "Indore, MP",
    jobs:        "120+",
    earnings:    "₹45,000",
    reviews:     "98",
    memberSince: "Jan 2024",
  });

  const handleEditProfile = () =>
    Alert.alert("Edit Profile", "Profile editing will be enabled after backend integration.", [{ text: "OK" }]);

  const handleLogout = () =>
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            router.replace("/auth/login");
          } catch (e) {
            console.log("Logout error:", e);
          }
        },
      },
    ]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top Bar ── */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandEmoji}>🔌</Text>
              </View>
              <Text style={styles.brandName}>ServeNow</Text>
            </View>
            <TouchableOpacity
              style={styles.editIconBtn}
              onPress={handleEditProfile}
              activeOpacity={0.75}
            >
              <Text style={styles.editIconEmoji}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* ── Location row ── */}
          <View style={styles.locationRow}>
            <Text style={styles.locIcon}>📍</Text>
            <Text style={styles.locText}>Indore</Text>
          </View>

          {/* ── Hero Card ── */}
          <View style={styles.heroCard}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                style={styles.avatar}
              />
              <View style={styles.onlineDot} />
            </View>

            <Text style={styles.heroName}>{profile.name}</Text>

            {/* Skill + Rating */}
            <View style={styles.heroMetaRow}>
              <View style={styles.skillBadge}>
                <Text style={styles.skillBadgeText}>⚡ {profile.skill}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingValue}>{profile.rating}</Text>
                <Text style={styles.ratingReviews}>({profile.reviews})</Text>
              </View>
            </View>

            {/* Member tag */}
            <View style={styles.memberTag}>
              <View style={styles.tagDot} />
              <Text style={styles.memberTagText}>Member since {profile.memberSince}</Text>
            </View>
          </View>

          {/* ── Stats Strip ── */}
          <View style={styles.statsStrip}>
            <StatItem value={profile.jobs}     label="Jobs Done"    color={ACCENT}  />
            <View style={styles.stripDiv} />
            <StatItem value={profile.earnings} label="Total Earned" color={WARM}    />
            <View style={styles.stripDiv} />
            <StatItem value={profile.rating}   label="Avg Rating"   color={PURPLE}  />
            <View style={styles.stripDiv} />
            <StatItem value={profile.reviews}  label="Reviews"      color={SKY}     />
          </View>

          {/* ── Personal Info ── */}
          <View style={styles.secHdr}>
            <Text style={styles.secTitle}>PERSONAL INFO</Text>
          </View>

          <View style={styles.infoCard}>
            <InfoRow emoji="📞" label="MOBILE"     value={profile.mobile}     />
            <View style={styles.rowDiv} />
            <InfoRow emoji="🛠️" label="EXPERIENCE" value={profile.experience} />
            <View style={styles.rowDiv} />
            <InfoRow emoji="📍" label="LOCATION"   value={profile.location}   />
          </View>

          {/* ── Skills ── */}
          <View style={styles.secHdr}>
            <Text style={styles.secTitle}>SKILLS</Text>
          </View>

          <View style={styles.skillsRow}>
            {SKILLS_TAGS.map((tag) => (
              <View key={tag} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* ── Availability ── */}
          <View style={styles.availCard}>
            <View style={styles.availLeft}>
              <View style={styles.availPulse} />
              <View>
                <Text style={styles.availTitle}>Currently Available</Text>
                <Text style={styles.availSub}>Mon – Sat, 8 AM – 7 PM</Text>
              </View>
            </View>
            <View style={styles.availBadge}>
              <Text style={styles.availBadgeText}>Active</Text>
            </View>
          </View>

          {/* ── Buttons ── */}
          <View style={styles.btnsSection}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleEditProfile}
              activeOpacity={0.85}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>→  Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* ── Trust Strip ── */}
          <View style={styles.trustStrip}>
            <Text style={styles.trustItem}>✦ Verified platform</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustItem}>Instant payouts</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustItem}>Insured jobs</Text>
          </View>
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>🕐</Text>
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navCenter} activeOpacity={0.85}>
            <View style={styles.navCenterBtn}>
              <Text style={styles.navCenterEmoji}>📋</Text>
            </View>
            <Text style={styles.navCenterLabel}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>💳</Text>
            <Text style={styles.navLabel}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <View style={styles.navIconActive}>
              <Text style={styles.navIconEmoji}>👤</Text>
            </View>
            <Text style={styles.navLabelActive}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Profile;

// ── Sub-components ────────────────────────────────────────────────────────────
function StatItem({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={statS.wrap}>
      <Text style={[statS.value, { color }]}>{value}</Text>
      <Text style={statS.label}>{label}</Text>
    </View>
  );
}
const statS = StyleSheet.create({
  wrap:  { flex: 1, alignItems: "center", gap: 3 },
  value: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
  label: { color: MUTED, fontSize: 10, fontWeight: "600", textAlign: "center" },
});

function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={infoS.row}>
      <View style={infoS.iconWrap}>
        <Text style={infoS.emoji}>{emoji}</Text>
      </View>
      <View style={infoS.col}>
        <Text style={infoS.label}>{label}</Text>
        <Text style={infoS.value}>{value}</Text>
      </View>
    </View>
  );
}
const infoS = StyleSheet.create({
  row:     { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  iconWrap:{ width: 38, height: 38, borderRadius: 11, backgroundColor: CREAM2, borderWidth: 1.5, borderColor: BDR, justifyContent: "center", alignItems: "center" },
  emoji:   { fontSize: 17 },
  col:     { flex: 1 },
  label:   { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1.4, marginBottom: 3 },
  value:   { color: INK, fontSize: 14, fontWeight: "500" },
});

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: CREAM },
  scroll:       { flex: 1 },
  scrollContent:{ paddingBottom: 24 },

  // TOP BAR
  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 18, paddingTop: 52, paddingBottom: 6,
  },
  brandRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  brandIcon: {
    width: 34, height: 34, backgroundColor: INK, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  brandEmoji: { fontSize: 14 },
  brandName:  { fontSize: 17, fontWeight: "700", color: INK },
  editIconBtn: {
    width: 34, height: 34, backgroundColor: WHITE,
    borderRadius: 10, borderWidth: 1.5, borderColor: BDR,
    justifyContent: "center", alignItems: "center",
    shadowColor: SHADOW, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  editIconEmoji: { fontSize: 14 },

  // LOCATION
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 18, paddingBottom: 10 },
  locIcon:     { fontSize: 11, opacity: 0.5 },
  locText:     { fontSize: 12, color: MUTED },

  // HERO CARD
  heroCard: {
    marginHorizontal: 18,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 24, padding: 24, alignItems: "center", gap: 10,
    shadowColor: SHADOW, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 4,
  },
  avatarWrap:  { position: "relative", marginBottom: 4 },
  avatar:      { width: 88, height: 88, borderRadius: 44, borderWidth: 2.5, borderColor: ACCENT_BDR },
  onlineDot:   {
    position: "absolute", bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: ACCENT, borderWidth: 2.5, borderColor: WHITE,
  },
  heroName:    { color: INK, fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  heroMetaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  skillBadge:  {
    backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT_BDR,
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12,
  },
  skillBadgeText:  { color: ACCENT, fontSize: 12, fontWeight: "700" },
  ratingBadge:     {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: WARM_DIM, borderWidth: 1, borderColor: WARM_BDR,
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10,
  },
  ratingStar:    { color: WARM, fontSize: 12 },
  ratingValue:   { color: WARM, fontSize: 12, fontWeight: "700" },
  ratingReviews: { color: MUTED, fontSize: 11 },
  memberTag:     {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: CREAM2, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12,
  },
  tagDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  memberTagText:{ color: MUTED, fontSize: 11 },

  // STATS STRIP
  statsStrip: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 18, marginTop: 12,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 8,
    shadowColor: SHADOW, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  stripDiv: { width: 1, height: 32, backgroundColor: DIVIDER },

  // SECTION HEADER
  secHdr:   { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 11 },
  secTitle: { color: MUTED, fontSize: 11, fontWeight: "700", letterSpacing: 1.6 },

  // INFO CARD
  infoCard: {
    marginHorizontal: 18,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 18, paddingHorizontal: 14,
    shadowColor: SHADOW, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  rowDiv: { height: 1, backgroundColor: DIVIDER },

  // SKILLS
  skillsRow:     { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 18, gap: 8 },
  skillChip:     {
    backgroundColor: PURPLE_DIM, borderWidth: 1, borderColor: PURPLE_BDR,
    borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14,
  },
  skillChipText: { color: PURPLE, fontSize: 12, fontWeight: "600" },

  // AVAILABILITY
  availCard: {
    marginHorizontal: 18, marginTop: 14,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 18, padding: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    shadowColor: SHADOW, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  availLeft:      { flexDirection: "row", alignItems: "center", gap: 12 },
  availPulse:     { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT },
  availTitle:     { color: INK, fontSize: 14, fontWeight: "600" },
  availSub:       { color: MUTED, fontSize: 12, marginTop: 2 },
  availBadge:     {
    backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT_BDR,
    borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12,
  },
  availBadgeText: { color: ACCENT, fontSize: 11, fontWeight: "700" },

  // BUTTONS
  btnsSection: { paddingHorizontal: 18, marginTop: 18, gap: 10 },
  editBtn: {
    backgroundColor: INK, borderRadius: 14, paddingVertical: 16, alignItems: "center",
    shadowColor: INK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  editBtnText: { color: WHITE, fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },
  logoutBtn:   {
    backgroundColor: DANGER_DIM, borderWidth: 1.5, borderColor: DANGER_BDR,
    borderRadius: 14, paddingVertical: 15, alignItems: "center",
  },
  logoutText:  { color: DANGER, fontSize: 14, fontWeight: "600", letterSpacing: 0.3 },

  // TRUST STRIP
  trustStrip: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginHorizontal: 18, marginTop: 14, marginBottom: 8,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 14, paddingVertical: 11, paddingHorizontal: 16,
  },
  trustItem: { color: MUTED, fontSize: 11, fontWeight: "600" },
  trustDot:  { width: 4, height: 4, backgroundColor: BDR, borderRadius: 2, marginHorizontal: 10 },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: WHITE, borderTopWidth: 1.5, borderTopColor: BDR,
    paddingTop: 10, paddingBottom: 24,
    shadowColor: INK, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 8,
  },
  navItem:        { flex: 1, alignItems: "center", gap: 4 },
  navIcon:        { fontSize: 20, opacity: 0.35 },
  navLabel:       { fontSize: 10, fontWeight: "600", color: MUTED },
  navIconActive:  { width: 28, height: 28, borderRadius: 8, backgroundColor: CREAM2, justifyContent: "center", alignItems: "center" },
  navIconEmoji:   { fontSize: 18 },
  navLabelActive: { fontSize: 10, fontWeight: "700", color: INK },
  navCenter:      { flex: 1, alignItems: "center", marginTop: -26 },
  navCenterBtn: {
    width: 52, height: 52, backgroundColor: INK, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
    shadowColor: INK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6,
  },
  navCenterEmoji: { fontSize: 22 },
  navCenterLabel: { fontSize: 10, fontWeight: "700", color: INK, marginTop: 5 },
});