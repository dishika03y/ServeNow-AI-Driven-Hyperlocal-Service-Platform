import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";

const NAVY        = "#0B2239";
const NAVY_MID    = "#163552";
const ACCENT      = "#00D68F";
const ACCENT_DIM  = "rgba(0,214,143,0.12)";
const ACCENT_BDR  = "rgba(0,214,143,0.25)";
const WARM        = "#FF8C42";
const WARM_DIM    = "rgba(255,140,66,0.10)";
const WARM_BDR    = "rgba(255,140,66,0.22)";
const SKY         = "#52B4FF";
const SKY_DIM     = "rgba(82,180,255,0.12)";
const SKY_BDR     = "rgba(82,180,255,0.25)";
const PURPLE      = "#A06EFF";
const PURPLE_DIM  = "rgba(160,110,255,0.12)";
const PURPLE_BDR  = "rgba(160,110,255,0.25)";
const SURFACE     = "rgba(255,255,255,0.04)";
const SURFACE_MID = "rgba(255,255,255,0.07)";
const BORDER      = "rgba(255,255,255,0.08)";
const TEXT        = "#EEF4FA";
const MUTED       = "rgba(200,220,235,0.55)";
const DANGER      = "#FF4D4D";
const DANGER_DIM  = "rgba(255,77,77,0.10)";
const DANGER_BDR  = "rgba(255,77,77,0.22)";

interface WorkerProfile {
  name: string;
  skill: string;
  rating: string;
  mobile: string;
  experience: string;
  location: string;
  jobs: string;
  earnings: string;
  reviews: string;
  memberSince: string;
}

const SKILLS_TAGS = ["Wiring", "MCB Panel", "Fan Install", "Inverter", "CCTV"];

const Profile: React.FC = () => {
  const router = useRouter();

  const [profile] = useState<WorkerProfile>({
    name:        "Ramesh Kumar",
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

  const handleEditProfile = (): void => {
    Alert.alert(
      "Edit Profile",
      "Profile editing will be enabled after backend integration.",
      [{ text: "OK" }]
    );
  };

  const handleLogout = (): void => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            router.replace("/auth/login");
          } catch (error) {
            console.log("Error removing token:", error);
          }
        },
      },
    ]);
  };

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
          <TouchableOpacity
            style={styles.editIconBtn}
            onPress={handleEditProfile}
            activeOpacity={0.75}
          >
            <Text style={styles.editIconText}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Hero Card */}
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

          {/* Skill + Rating row */}
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
            <View style={[styles.tagDot, { backgroundColor: ACCENT }]} />
            <Text style={styles.memberTagText}>Member since {profile.memberSince}</Text>
          </View>
        </View>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          <StatItem value={profile.jobs}     label="Jobs Done"    color={ACCENT}  />
          <View style={styles.stripDiv} />
          <StatItem value={profile.earnings} label="Total Earned" color={WARM}    />
          <View style={styles.stripDiv} />
          <StatItem value={profile.rating}   label="Avg Rating"   color={PURPLE}  />
          <View style={styles.stripDiv} />
          <StatItem value={profile.reviews}  label="Reviews"      color={SKY}     />
        </View>

        {/* Info Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PERSONAL INFO</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow emoji="📞" label="Mobile"     value={profile.mobile}     />
          <Divider />
          <InfoRow emoji="🛠️" label="Experience" value={profile.experience} />
          <Divider />
          <InfoRow emoji="📍" label="Location"   value={profile.location}   />
        </View>

        {/* Skills */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
        </View>

        <View style={styles.skillsRow}>
          {SKILLS_TAGS.map((tag) => (
            <View key={tag} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Availability Card */}
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

        {/* Edit Profile Button */}
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
      </ScrollView>
    </>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatItem({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={statStyles.wrap}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  wrap:  { flex: 1, alignItems: "center", gap: 3 },
  value: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
  label: { color: MUTED, fontSize: 10, fontWeight: "600", textAlign: "center" },
});

function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.emoji}>{emoji}</Text>
      <View style={infoStyles.col}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  emoji: { fontSize: 18, width: 24, textAlign: "center" },
  col:   { flex: 1 },
  label: { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1.4, marginBottom: 3 },
  value: { color: TEXT, fontSize: 14, fontWeight: "500" },
});

function Divider() {
  return <View style={{ height: 1, backgroundColor: BORDER }} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
export default Profile;

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 48 },

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
  editIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  editIconText: { fontSize: 15 },

  // HERO CARD
  heroCard: {
    marginHorizontal: 22,
    marginTop: 10,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 4,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: ACCENT_BDR,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ACCENT,
    borderWidth: 2,
    borderColor: NAVY_MID,
  },
  heroName: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  skillBadge: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  skillBadgeText: { color: ACCENT, fontSize: 12, fontWeight: "700" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: WARM_DIM,
    borderWidth: 1,
    borderColor: WARM_BDR,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  ratingStar:    { color: WARM, fontSize: 12 },
  ratingValue:   { color: WARM, fontSize: 12, fontWeight: "700" },
  ratingReviews: { color: MUTED, fontSize: 11 },
  memberTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  memberTagText: { color: MUTED, fontSize: 11 },

  // STATS STRIP
  statsStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  stripDiv: {
    width: 1,
    height: 32,
    backgroundColor: BORDER,
  },

  // SECTION HEADER
  sectionHeader: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },

  // INFO CARD
  infoCard: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  // SKILLS
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 22,
    gap: 8,
  },
  skillChip: {
    backgroundColor: PURPLE_DIM,
    borderWidth: 1,
    borderColor: PURPLE_BDR,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  skillChipText: { color: PURPLE, fontSize: 12, fontWeight: "600" },

  // AVAILABILITY CARD
  availCard: {
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  availPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ACCENT,
  },
  availTitle: { color: TEXT, fontSize: 14, fontWeight: "600" },
  availSub:   { color: MUTED, fontSize: 12, marginTop: 2 },
  availBadge: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  availBadgeText: { color: ACCENT, fontSize: 11, fontWeight: "700" },

  // BUTTONS
  btnsSection: { paddingHorizontal: 22, marginTop: 18, gap: 10 },
  editBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  editBtnText: { color: NAVY, fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },
  logoutBtn: {
    backgroundColor: DANGER_DIM,
    borderWidth: 1,
    borderColor: DANGER_BDR,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  logoutText: { color: DANGER, fontSize: 14, fontWeight: "600", letterSpacing: 0.3 },
});