import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack } from "expo-router";

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

// ── Dummy data ────────────────────────────────────────────────────────────────
const MONTHLY_DATA = [8200, 11400, 6800, 14200, 9600, 12500, 10800, 7400, 13100, 9200, 11800, 12500];
const MONTHS       = ["J","F","M","A","M","J","J","A","S","O","N","D"];
const CURRENT_MONTH = 11;

const RECENT: { job: string; date: string; amount: string; emoji: string }[] = [
  { job: "Electric Repair",      date: "18 Mar 2026", amount: "₹500",  emoji: "⚡" },
  { job: "Fan Installation",     date: "16 Mar 2026", amount: "₹300",  emoji: "🌀" },
  { job: "Switch Board Repair",  date: "14 Mar 2026", amount: "₹250",  emoji: "🔌" },
  { job: "Wiring – 2BHK Flat",   date: "10 Mar 2026", amount: "₹1,200",emoji: "🔧" },
  { job: "MCB Replacement",      date: "07 Mar 2026", amount: "₹180",  emoji: "⚡" },
  { job: "Inverter Installation", date: "03 Mar 2026", amount: "₹850", emoji: "🔋" },
  { job: "Outdoor Light Wiring", date: "28 Feb 2026", amount: "₹420",  emoji: "💡" },
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
          <Text style={styles.appLabel}>WorkerOS</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.greeting}>Your earnings,</Text>
          <Text style={styles.heroTitle}>Income Summary</Text>
          <View style={styles.heroTag}>
            <View style={[styles.tagDot, { backgroundColor: ACCENT }]} />
            <Text style={styles.heroTagText}>March 2026</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OVERVIEW</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            value="₹800"    label="Today"
            iconBg={WARM_DIM}    iconBdr={WARM_BDR}    valueColor={WARM}   emoji="📅"
          />
          <StatCard
            value="₹12,500" label="This Month"
            iconBg={ACCENT_DIM}  iconBdr={ACCENT_BDR}  valueColor={ACCENT} emoji="📆"
          />
          <StatCard
            value="₹45,000" label="Total Earned"
            iconBg={SKY_DIM}     iconBdr={SKY_BDR}     valueColor={SKY}    emoji="💰"
          />
          <StatCard
            value="120+"    label="Jobs Done"
            iconBg={PURPLE_DIM}  iconBdr={PURPLE_BDR}  valueColor={PURPLE} emoji="✅"
          />
        </View>

        {/* Monthly Chart Card */}
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
            <View style={[styles.trendPill, { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BDR }]}>
              <Text style={[styles.trendText, { color: ACCENT }]}>↑ 5.9% vs last month</Text>
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

        {/* Breakdown strip */}
        <View style={styles.breakdownStrip}>
          <BreakdownItem label="Avg / job" value="₹375" color={WARM} />
          <View style={styles.stripDivider} />
          <BreakdownItem label="Best day"  value="₹1,200" color={ACCENT} />
          <View style={styles.stripDivider} />
          <BreakdownItem label="Pending"   value="₹650"   color={SKY} />
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

        {/* Withdraw CTA */}
        <View style={styles.withdrawCard}>
          <View style={styles.withdrawLeft}>
            <Text style={styles.withdrawLabel}>AVAILABLE BALANCE</Text>
            <Text style={styles.withdrawAmount}>₹12,500</Text>
            <Text style={styles.withdrawSub}>Ready to withdraw</Text>
          </View>
          <View style={styles.withdrawBtn}>
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </View>
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
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 14 },
  value: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  label: { color: MUTED, fontSize: 12 },
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
  wrap: { flex: 1, alignItems: "center", gap: 3 },
  label: { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  value: { fontSize: 15, fontWeight: "800" },
});

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 48 },

  topBar: {
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

  hero: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: { color: MUTED, fontSize: 13, marginBottom: 4 },
  heroTitle: {
    color: TEXT,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  heroTagText: { color: MUTED, fontSize: 12 },

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
  },
  sectionAccent: { color: ACCENT, fontSize: 12 },

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
    backgroundColor: "rgba(11,58,43,0.55)",
    borderWidth: 1,
    borderColor: "rgba(0,214,143,0.14)",
    borderRadius: 18,
    padding: 18,
    gap: 16,
  },
  chartTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chartLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 3,
  },
  chartPeak: {
    color: ACCENT,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  trendPill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  trendText: { fontSize: 11, fontWeight: "700" },

  chartWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 68,
    gap: 5,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end" },
  barFill: {
    width: "100%",
    borderRadius: 3,
    backgroundColor: "rgba(0,214,143,0.18)",
  },
  barFillActive: { backgroundColor: ACCENT },
  barLabel: { color: MUTED, fontSize: 8, fontWeight: "600" },
  barLabelActive: { color: ACCENT },

  // BREAKDOWN STRIP
  breakdownStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  stripDivider: {
    width: 1,
    height: 32,
    backgroundColor: BORDER,
  },

  // HISTORY LIST
  historyList: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  historyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  historyEmoji: { fontSize: 18 },
  historyInfo: { flex: 1 },
  historyJob: { color: TEXT, fontSize: 14, fontWeight: "700" },
  historyDate: { color: MUTED, fontSize: 11, marginTop: 3 },
  historyRight: { alignItems: "flex-end", gap: 5 },
  historyAmount: { color: ACCENT, fontSize: 14, fontWeight: "800" },
  paidBadge: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  paidBadgeText: { color: ACCENT, fontSize: 10, fontWeight: "700" },
  rowDivider: { height: 1, backgroundColor: BORDER },

  // WITHDRAW CARD
  withdrawCard: {
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  withdrawLeft: { gap: 3 },
  withdrawLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  withdrawAmount: {
    color: ACCENT,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  withdrawSub: { color: MUTED, fontSize: 12 },
  withdrawBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 22,
  },
  withdrawBtnText: { color: NAVY, fontSize: 14, fontWeight: "800" },
});