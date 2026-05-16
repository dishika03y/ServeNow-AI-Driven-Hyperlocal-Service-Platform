import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const CREAM        = "#F5F0E8";
const CREAM_CARD   = "#FFFFFF";
const CREAM_BORDER = "#E8E1D4";
const INK          = "#1A2744";
const INK_MUTED    = "rgba(26,39,68,0.45)";
const INK_FAINT    = "rgba(26,39,68,0.10)";
const ACCENT       = "#00D68F";
const ACCENT_DIM   = "rgba(0,214,143,0.10)";
const ACCENT_BDR   = "rgba(0,214,143,0.22)";
const WARM         = "#E8740A";
const WARM_DIM     = "rgba(232,116,10,0.09)";
const WARM_BDR     = "rgba(232,116,10,0.20)";
const SKY          = "#1A7DD4";
const SKY_DIM      = "rgba(26,125,212,0.09)";
const SKY_BDR      = "rgba(26,125,212,0.20)";
const PURPLE       = "#6B3FCC";
const PURPLE_DIM   = "rgba(107,63,204,0.09)";
const PURPLE_BDR   = "rgba(107,63,204,0.20)";

// ── Data ──────────────────────────────────────────────────────────────────────
const MONTHLY_DATA  = [8200, 11400, 6800, 14200, 9600, 12500, 10800, 7400, 13100, 9200, 11800, 12500];
const MONTHS        = ["J","F","M","A","M","J","J","A","S","O","N","D"];
const CURRENT_MONTH = 11;

const RECENT = [
  { job: "Electric Repair",       date: "18 Mar 2026", amount: "₹500",   emoji: "⚡" },
  { job: "Fan Installation",      date: "16 Mar 2026", amount: "₹300",   emoji: "🌀" },
  { job: "Switch Board Repair",   date: "14 Mar 2026", amount: "₹250",   emoji: "🔌" },
  { job: "Wiring – 2BHK Flat",    date: "10 Mar 2026", amount: "₹1,200", emoji: "🔧" },
  { job: "MCB Replacement",       date: "07 Mar 2026", amount: "₹180",   emoji: "⚡" },
  { job: "Inverter Installation", date: "03 Mar 2026", amount: "₹850",   emoji: "🔋" },
  { job: "Outdoor Light Wiring",  date: "28 Feb 2026", amount: "₹420",   emoji: "💡" },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Earnings: React.FC = () => {
  const maxVal = Math.max(...MONTHLY_DATA);

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
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconEmoji}>🔌</Text>
            </View>
            <Text style={styles.brandName}>ServeNow</Text>
          </View>
          <View style={styles.notifBtn}>
            <Text style={styles.notifEmoji}>🔔</Text>
            <View style={styles.notifDot} />
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.greeting}>Your earnings,</Text>
          <Text style={styles.heroTitle}>Income Summary</Text>
          <View style={styles.heroTag}>
            <View style={styles.tagDot} />
            <Text style={styles.heroTagText}>March 2026</Text>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OVERVIEW</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard value="₹800"    label="Today"        iconBg={WARM_DIM}   iconBdr={WARM_BDR}   valueColor={WARM}   emoji="📅" />
          <StatCard value="₹12,500" label="This Month"   iconBg={ACCENT_DIM} iconBdr={ACCENT_BDR} valueColor={ACCENT} emoji="📆" />
          <StatCard value="₹45,000" label="Total Earned" iconBg={SKY_DIM}    iconBdr={SKY_BDR}    valueColor={SKY}    emoji="💰" />
          <StatCard value="120+"    label="Jobs Done"    iconBg={PURPLE_DIM} iconBdr={PURPLE_BDR} valueColor={PURPLE} emoji="✅" />
        </View>

        {/* Monthly Trend */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MONTHLY TREND</Text>
          <Text style={styles.sectionAccent}>2026</Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartTopRow}>
            <View>
              <Text style={styles.chartLabel}>PEAK MONTH</Text>
              <Text style={styles.chartPeak}>₹14,200</Text>
            </View>
            <View style={styles.trendPill}>
              <Text style={styles.trendText}>↑ 5.9% vs last month</Text>
            </View>
          </View>

          <View style={styles.chartWrap}>
            {MONTHLY_DATA.map((val, i) => {
              const heightPct = (val / maxVal) * 100;
              const isActive  = i === CURRENT_MONTH;
              return (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPct}%` },
                        isActive && styles.barFillActive,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isActive && styles.barLabelActive]}>
                    {MONTHS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Breakdown Strip */}
        <View style={styles.breakdownStrip}>
          <BreakdownItem label="Avg / job" value="₹375"   color={WARM}   />
          <View style={styles.stripDivider} />
          <BreakdownItem label="Best day"  value="₹1,200" color={ACCENT} />
          <View style={styles.stripDivider} />
          <BreakdownItem label="Pending"   value="₹650"   color={SKY}    />
        </View>

        {/* Recent Earnings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT EARNINGS</Text>
          <Text style={styles.sectionAccent}>{RECENT.length} jobs</Text>
        </View>

        <View style={styles.historyList}>
          {RECENT.map((item, idx) => (
            <View key={idx}>
              <View style={styles.historyRow}>
                <View style={styles.historyIconWrap}>
                  <Text style={styles.historyEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyJob}>{item.job}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{item.amount}</Text>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>Paid</Text>
                  </View>
                </View>
              </View>
              {idx < RECENT.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* Withdraw Card */}
        <View style={styles.withdrawCard}>
          <View style={styles.withdrawLeft}>
            <Text style={styles.withdrawLabel}>AVAILABLE BALANCE</Text>
            <Text style={styles.withdrawAmount}>₹12,500</Text>
            <Text style={styles.withdrawSub}>Ready to withdraw</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85}>
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Strip */}
        <View style={styles.trustStrip}>
          <Text style={styles.trustItem}>✦ Verified platform</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustItem}>Instant payouts</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustItem}>Insured jobs</Text>
        </View>

      </ScrollView>
    </>
  );
};

export default Earnings;

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  value, label, iconBg, iconBdr, valueColor, emoji,
}: {
  value: string; label: string;
  iconBg: string; iconBdr: string; valueColor: string; emoji: string;
}) {
  return (
    <View style={statStyles.card}>
      <View style={[statStyles.iconWrap, { backgroundColor: iconBg, borderColor: iconBdr }]}>
        <Text style={statStyles.emoji}>{emoji}</Text>
      </View>
      <Text style={[statStyles.value, { color: valueColor }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: CREAM_CARD,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 15 },
  value: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  label: { color: INK_MUTED, fontSize: 12 },
});

function BreakdownItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={bdStyles.wrap}>
      <Text style={bdStyles.label}>{label}</Text>
      <Text style={[bdStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const bdStyles = StyleSheet.create({
  wrap:  { flex: 1, alignItems: "center", gap: 3 },
  label: { color: INK_MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  value: { fontSize: 15, fontWeight: "800" },
});

// ── Main Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: CREAM },
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
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: {
    width: 38,
    height: 38,
    backgroundColor: INK,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  brandIconEmoji: { fontSize: 16 },
  brandName: { fontSize: 18, fontWeight: "800", color: INK, letterSpacing: -0.3 },
  notifBtn: {
    width: 38,
    height: 38,
    backgroundColor: CREAM_CARD,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifEmoji: { fontSize: 16 },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    backgroundColor: "#FF4D4D",
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: CREAM_CARD,
  },

  // HERO
  hero: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20 },
  greeting:  { color: INK_MUTED, fontSize: 13, marginBottom: 4 },
  heroTitle: { color: INK, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: CREAM_CARD,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tagDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  heroTagText: { color: INK_MUTED, fontSize: 12 },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 12,
  },
  sectionTitle:  { color: INK_MUTED, fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  sectionAccent: { color: ACCENT, fontSize: 12, fontWeight: "600" },

  // STATS GRID
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 22,
    gap: 12,
  },

  // CHART CARD
  chartCard: {
    marginHorizontal: 22,
    backgroundColor: CREAM_CARD,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    borderRadius: 18,
    padding: 18,
    gap: 16,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  chartTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chartLabel: {
    color: INK_MUTED,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 3,
  },
  chartPeak:  { color: INK, fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  trendPill: {
    backgroundColor: ACCENT_DIM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  trendText: { color: ACCENT, fontSize: 11, fontWeight: "700" },

  chartWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 68,
    gap: 5,
  },
  barCol:         { flex: 1, alignItems: "center", gap: 5, height: "100%", justifyContent: "flex-end" },
  barTrack:       { flex: 1, width: "100%", justifyContent: "flex-end" },
  barFill:        { width: "100%", borderRadius: 3, backgroundColor: INK_FAINT },
  barFillActive:  { backgroundColor: INK },
  barLabel:       { color: INK_MUTED, fontSize: 8, fontWeight: "600" },
  barLabelActive: { color: INK, fontWeight: "800" },

  // BREAKDOWN STRIP
  breakdownStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: CREAM_CARD,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  stripDivider: { width: 1, height: 32, backgroundColor: CREAM_BORDER },

  // HISTORY LIST
  historyList: {
    marginHorizontal: 22,
    backgroundColor: CREAM_CARD,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    borderRadius: 18,
    paddingHorizontal: 16,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyRow:     { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  historyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: CREAM,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  historyEmoji:  { fontSize: 18 },
  historyInfo:   { flex: 1 },
  historyJob:    { color: INK, fontSize: 14, fontWeight: "700" },
  historyDate:   { color: INK_MUTED, fontSize: 11, marginTop: 3 },
  historyRight:  { alignItems: "flex-end", gap: 5 },
  historyAmount: { color: INK, fontSize: 14, fontWeight: "800" },
  paidBadge: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  paidBadgeText: { color: ACCENT, fontSize: 10, fontWeight: "700" },
  rowDivider:    { height: 1, backgroundColor: CREAM_BORDER },

  // WITHDRAW CARD
  withdrawCard: {
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: INK,
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  withdrawLeft:    { gap: 3 },
  withdrawLabel:   { color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  withdrawAmount:  { color: CREAM_CARD, fontSize: 28, fontWeight: "800", letterSpacing: -0.4 },
  withdrawSub:     { color: "rgba(255,255,255,0.45)", fontSize: 12 },
  withdrawBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 22,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  withdrawBtnText: { color: INK, fontSize: 14, fontWeight: "800" },

  // TRUST STRIP
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: CREAM_CARD,
    borderWidth: 1.5,
    borderColor: CREAM_BORDER,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  trustItem: { color: INK_MUTED, fontSize: 11, fontWeight: "600" },
  trustDot:  { width: 4, height: 4, backgroundColor: CREAM_BORDER, borderRadius: 2, marginHorizontal: 10 },
});