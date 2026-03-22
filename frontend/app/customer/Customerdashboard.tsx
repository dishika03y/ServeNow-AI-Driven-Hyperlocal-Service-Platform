import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';

// ─── Design tokens (shared across WorkerOS) ───────────────────────────────────
const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const NAVY_LIGHT  = '#1E4A6E';
const ACCENT      = '#00D68F';
const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
const WARM        = '#FF8C42';
const WARM_DIM    = 'rgba(255,140,66,0.10)';
const WARM_BDR    = 'rgba(255,140,66,0.22)';
const PURPLE      = '#A06EFF';
const PURPLE_DIM  = 'rgba(160,110,255,0.12)';
const PURPLE_BDR  = 'rgba(160,110,255,0.25)';
const SKY         = '#52B4FF';
const SKY_DIM     = 'rgba(82,180,255,0.12)';
const SKY_BDR     = 'rgba(82,180,255,0.25)';
const SURFACE     = 'rgba(255,255,255,0.04)';
const SURFACE_MID = 'rgba(255,255,255,0.07)';
const BORDER      = 'rgba(255,255,255,0.08)';
const TEXT        = '#EEF4FA';
const MUTED       = 'rgba(200,220,235,0.55)';
const DANGER      = '#FF4D4D';
const DANGER_DIM  = 'rgba(255,77,77,0.10)';
const DANGER_BDR  = 'rgba(255,77,77,0.22)';

// ─── Dummy data ───────────────────────────────────────────────────────────────
const MONTHLY_SPEND = [1200, 2100, 800, 3400, 1800, 2600, 3100, 900, 2200, 1500, 2800, 3600];
const MONTHS        = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const CURRENT_MONTH = 11; // December (0-indexed)

const RECENT_WORKERS = [
  { id: '1', name: 'Ramesh Kumar',  service: 'Electrician', date: '18 Mar 2026', amount: '₹350', emoji: '⚡', status: 'Completed' },
  { id: '2', name: 'Sunita Devi',   service: 'Cleaning',    date: '12 Mar 2026', amount: '₹500', emoji: '🧹', status: 'Completed' },
  { id: '3', name: 'Anil Tiwari',   service: 'AC Repair',   date: '05 Mar 2026', amount: '₹900', emoji: '❄️', status: 'Completed' },
  { id: '4', name: 'Mohan Lal',     service: 'Plumber',     date: '27 Feb 2026', amount: '₹380', emoji: '🔧', status: 'Completed' },
  { id: '5', name: 'Harish Nair',   service: 'Carpenter',   date: '14 Feb 2026', amount: '₹760', emoji: '🪚', status: 'Completed' },
];

const STATS = {
  totalWorkers:   18,
  totalBookings:  24,
  completed:      21,
  cancelled:       3,
  totalSpend:  '₹14,820',
  thisMonth:    '₹3,600',
  avgPerBooking: '₹617',
  savedAmount:   '₹1,240',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const [workerMode, setWorkerMode] = useState(false);

  const handleBecomeWorker = () => {
    Alert.alert(
      'Switch to Worker Account',
      'You\'ll be redirected to complete your worker profile. Your customer account stays active.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            setWorkerMode(true);
            router.push('/worker/Becomeworkerform');
          },
        },
      ]
    );
  };

  const maxSpend = Math.max(...MONTHLY_SPEND);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Text style={styles.appLabel}>WorkerOS</Text>
        <View style={styles.avatarBtn}>
          <Text style={styles.avatarText}>AK</Text>
        </View>
      </View>

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Your dashboard,</Text>
        <Text style={styles.heroName}>Arjun Kapoor</Text>
        <View style={styles.memberTag}>
          <View style={[styles.tagDot, { backgroundColor: ACCENT }]} />
          <Text style={styles.memberTagText}>Customer since Jan 2025</Text>
        </View>
      </View>

      {/* ── Primary Stats Grid ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>OVERVIEW</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="👷"
          value={STATS.totalWorkers}
          label="Workers hired"
          iconBg={ACCENT_DIM}
          iconBdr={ACCENT_BDR}
        />
        <StatCard
          icon="📋"
          value={STATS.totalBookings}
          label="Total bookings"
          iconBg={SKY_DIM}
          iconBdr={SKY_BDR}
        />
        <StatCard
          icon="✅"
          value={STATS.completed}
          label="Completed"
          iconBg={ACCENT_DIM}
          iconBdr={ACCENT_BDR}
        />
        <StatCard
          icon="✕"
          value={STATS.cancelled}
          label="Cancelled"
          iconBg={DANGER_DIM}
          iconBdr={DANGER_BDR}
          valueColor={DANGER}
        />
      </View>

      {/* ── Spending Summary ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SPENDING</Text>
        <Text style={styles.sectionAccent}>All time</Text>
      </View>

      <View style={styles.spendCard}>
        {/* Top spend numbers */}
        <View style={styles.spendTopRow}>
          <View>
            <Text style={styles.spendLabel}>TOTAL SPENT</Text>
            <Text style={styles.spendTotal}>{STATS.totalSpend}</Text>
          </View>
          <View style={styles.spendDivider} />
          <View style={styles.spendRight}>
            <SpendMini label="This month"   value={STATS.thisMonth}    color={WARM} />
            <SpendMini label="Avg / booking" value={STATS.avgPerBooking} color={SKY} />
            <SpendMini label="Saved"         value={STATS.savedAmount}   color={ACCENT} />
          </View>
        </View>

        {/* Bar chart */}
        <View style={styles.chartWrap}>
          {MONTHLY_SPEND.map((val, i) => {
            const heightPct = (val / maxSpend) * 100;
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

      {/* ── Recent Workers ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT WORKERS</Text>
        <TouchableOpacity onPress={() => router.push('/customer/history')}>
          <Text style={styles.sectionAccent}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.workerList}>
        {RECENT_WORKERS.map((w, idx) => (
          <View key={w.id}>
            <View style={styles.workerRow}>
              <View style={styles.workerIconWrap}>
                <Text style={styles.workerEmoji}>{w.emoji}</Text>
              </View>
              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{w.name}</Text>
                <Text style={styles.workerMeta}>{w.service}  ·  {w.date}</Text>
              </View>
              <View style={styles.workerRight}>
                <Text style={styles.workerAmount}>{w.amount}</Text>
                <View style={[styles.workerStatus, { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BDR }]}>
                  <Text style={[styles.workerStatusText, { color: ACCENT }]}>{w.status}</Text>
                </View>
              </View>
            </View>
            {idx < RECENT_WORKERS.length - 1 && <View style={styles.rowDivider} />}
          </View>
        ))}
      </View>

      {/* ── Become a Worker CTA ── */}
      <View style={styles.becomeCard}>
        <View style={styles.becomeLeft}>
          <Text style={styles.becomeEmoji}>🛠️</Text>
          <View>
            <Text style={styles.becomeTitle}>Become a Worker</Text>
            <Text style={styles.becomeSub}>Earn by offering your skills on WorkerOS</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.becomeBtn}
          onPress={handleBecomeWorker}
          activeOpacity={0.85}
        >
          <Text style={styles.becomeBtnText}>Switch →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Quick Actions ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
      </View>

      <View style={styles.actionsRow}>
        <QuickAction emoji="🔍" label="Book a Service"  onPress={() => router.push('/customer/dashboard')} color={ACCENT_DIM}  bdr={ACCENT_BDR} />
        <QuickAction emoji="📋" label="My Bookings"     onPress={() => router.push('/customer/history')}   color={SKY_DIM}    bdr={SKY_BDR}    />
        <QuickAction emoji="💰" label="Payments"        onPress={() => router.push('/payment')}            color={WARM_DIM}   bdr={WARM_BDR}   />
        <QuickAction emoji="💬" label="Support"         onPress={() => router.push('/support')}            color={PURPLE_DIM} bdr={PURPLE_BDR} />
      </View>

      {/* ── Sign Out ── */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace('/auth/login')}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>→  Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, value, label, iconBg, iconBdr, valueColor,
}: {
  icon: string; value: number; label: string;
  iconBg: string; iconBdr: string; valueColor?: string;
}) {
  return (
    <View style={statStyles.card}>
      <View style={[statStyles.iconWrap, { backgroundColor: iconBg, borderColor: iconBdr }]}>
        <Text style={statStyles.icon}>{icon}</Text>
      </View>
      <Text style={[statStyles.value, valueColor ? { color: valueColor } : {}]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 16 },
  value: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  label: { color: MUTED, fontSize: 12 },
});

function SpendMini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={spendMiniStyles.wrap}>
      <Text style={spendMiniStyles.label}>{label}</Text>
      <Text style={[spendMiniStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const spendMiniStyles = StyleSheet.create({
  wrap: { gap: 2 },
  label: { color: MUTED, fontSize: 10, fontWeight: '600', letterSpacing: 0.8 },
  value: { fontSize: 14, fontWeight: '700' },
});

function QuickAction({
  emoji, label, onPress, color, bdr,
}: {
  emoji: string; label: string; onPress: () => void; color: string; bdr: string;
}) {
  return (
    <TouchableOpacity
      style={[qaStyles.btn, { backgroundColor: color, borderColor: bdr }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={qaStyles.emoji}>{emoji}</Text>
      <Text style={qaStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const qaStyles = StyleSheet.create({
  btn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  emoji: { fontSize: 20 },
  label: { color: TEXT, fontSize: 10, fontWeight: '600', textAlign: 'center' },
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 48 },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 10,
  },
  appLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: ACCENT, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  // HERO
  hero: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20 },
  greeting: { color: MUTED, fontSize: 13, marginBottom: 4 },
  heroName: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  memberTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  memberTagText: { color: MUTED, fontSize: 12 },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  sectionAccent: { color: ACCENT, fontSize: 12 },

  // STATS GRID
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 12,
  },

  // SPEND CARD
  spendCard: {
    marginHorizontal: 22,
    backgroundColor: 'rgba(11,58,43,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,214,143,0.15)',
    borderRadius: 18,
    padding: 20,
    gap: 18,
  },
  spendTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 18,
  },
  spendLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  spendTotal: {
    color: ACCENT,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  spendDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: BORDER,
    marginHorizontal: 2,
  },
  spendRight: { flex: 1, gap: 10 },

  // BAR CHART
  chartWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
    backgroundColor: 'rgba(0,214,143,0.2)',
  },
  barFillActive: {
    backgroundColor: ACCENT,
  },
  barLabel: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '600',
  },
  barLabelActive: {
    color: ACCENT,
  },

  // WORKER LIST
  workerList: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  workerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerEmoji: { fontSize: 18 },
  workerInfo: { flex: 1 },
  workerName: { color: TEXT, fontSize: 14, fontWeight: '700' },
  workerMeta: { color: MUTED, fontSize: 11, marginTop: 3 },
  workerRight: { alignItems: 'flex-end', gap: 5 },
  workerAmount: { color: TEXT, fontSize: 13, fontWeight: '700' },
  workerStatus: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  workerStatusText: { fontSize: 10, fontWeight: '700' },
  rowDivider: { height: 1, backgroundColor: BORDER, marginHorizontal: 0 },

  // BECOME A WORKER CARD
  becomeCard: {
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  becomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  becomeEmoji: { fontSize: 26 },
  becomeTitle: { color: TEXT, fontSize: 15, fontWeight: '700' },
  becomeSub: { color: MUTED, fontSize: 12, marginTop: 2 },
  becomeBtn: {
    backgroundColor: ACCENT,
    borderRadius: 11,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  becomeBtnText: { color: NAVY, fontSize: 13, fontWeight: '800' },

  // QUICK ACTIONS
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    gap: 10,
  },

  // LOGOUT
  logoutBtn: {
    marginHorizontal: 22,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: DANGER_DIM,
    borderWidth: 1,
    borderColor: DANGER_BDR,
    alignItems: 'center',
  },
  logoutText: { color: DANGER, fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
});