import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';

// ── Tokens (matches Home screen) ─────────────────────────────────────────────
const CREAM        = '#F2EDE4';
const CREAM2       = '#EDE7DC';
const WHITE        = '#FFFFFF';
const BDR          = '#E2DBD0';
const INK          = '#1A2744';
const MUTED        = 'rgba(26,39,68,0.45)';
const DIVIDER      = 'rgba(26,39,68,0.08)';
const SHADOW       = 'rgba(26,39,68,0.08)';
const ACCENT       = '#00897B';
const ACCENT_DIM   = 'rgba(0,137,123,0.10)';
const ACCENT_BDR   = 'rgba(0,137,123,0.25)';
const WARM         = '#E07A10';
const WARM_DIM     = 'rgba(224,122,16,0.10)';
const WARM_BDR     = 'rgba(224,122,16,0.25)';
const SKY          = '#1878CC';
const SKY_DIM      = 'rgba(24,120,204,0.10)';
const SKY_BDR      = 'rgba(24,120,204,0.25)';
const DANGER       = '#D93838';
const DANGER_DIM   = 'rgba(217,56,56,0.09)';
const DANGER_BDR   = 'rgba(217,56,56,0.22)';

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICE_EMOJI: Record<string, string> = {
  'AC Repair':   '❄️',
  'Wiring Fix':  '⚡',
  'Plumbing':    '🔧',
  'Electrician': '⚡',
  'Cleaning':    '🧹',
  'Carpenter':   '🪚',
};

type Status = 'pending' | 'accepted' | 'completed';

type Job = {
  id: string;
  customer: string;
  service: string;
  location: string;
  time: string;
  price: string;
  status: Status;
};

const dummyJobs: Job[] = [
  { id: '1', customer: 'Amit Sharma',  service: 'AC Repair',   location: 'Delhi',     time: '10:00 AM', price: '₹500', status: 'pending'   },
  { id: '2', customer: 'Neha Gupta',   service: 'Wiring Fix',  location: 'Noida',     time: '12:30 PM', price: '₹350', status: 'pending'   },
  { id: '3', customer: 'Ramesh Verma', service: 'Plumbing',    location: 'Gurgaon',   time: '2:00 PM',  price: '₹420', status: 'accepted'  },
  { id: '4', customer: 'Priya Singh',  service: 'Electrician', location: 'Faridabad', time: '4:00 PM',  price: '₹300', status: 'completed' },
  { id: '5', customer: 'Karan Mehta',  service: 'AC Repair',   location: 'Delhi',     time: '11:00 AM', price: '₹600', status: 'pending'   },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function WorkerJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);

  const pending   = jobs.filter(j => j.status === 'pending').length;
  const accepted  = jobs.filter(j => j.status === 'accepted').length;
  const completed = jobs.filter(j => j.status === 'completed').length;

  const handleAccept   = (id: string) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'accepted'  } : j));
  const handleReject   = (id: string) =>
    setJobs(prev => prev.filter(j => j.id !== id));
  const handleComplete = (id: string) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'completed' } : j));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.root}>

        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandEmoji}>🔌</Text>
            </View>
            <Text style={styles.brandName}>ServeNow</Text>
          </View>
          <View style={styles.avatarBtn}>
            <Text style={styles.avatarText}>T</Text>
          </View>
        </View>

        {/* ── Location ── */}
        <View style={styles.locationRow}>
          <Text style={styles.locIcon}>📍</Text>
          <Text style={styles.locText}>Indore</Text>
        </View>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroGreeting}>Your work,</Text>
          <Text style={styles.heroTitle}>Job Requests</Text>
          <Text style={styles.heroSub}>Manage your incoming and active jobs</Text>
        </View>

        {/* ── Summary Strip ── */}
        <View style={styles.summaryStrip}>
          <SummaryItem value={pending}   label="Pending"   color={WARM}   />
          <View style={styles.stripDiv} />
          <SummaryItem value={accepted}  label="Active"    color={SKY}    />
          <View style={styles.stripDiv} />
          <SummaryItem value={completed} label="Completed" color={ACCENT} />
        </View>

        {/* ── Section Header ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALL JOBS</Text>
          <Text style={styles.sectionCount}>{jobs.length} total</Text>
        </View>

        {/* ── Job List ── */}
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onAccept={()   => handleAccept(item.id)}
              onReject={()   => handleReject(item.id)}
              onComplete={() => handleComplete(item.id)}
            />
          )}
          ListFooterComponent={<View style={{ height: 24 }} />}
        />

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
            <Text style={styles.navIcon}>🎧</Text>
            <Text style={styles.navLabel}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({
  job, onAccept, onReject, onComplete,
}: {
  job: Job;
  onAccept: () => void;
  onReject: () => void;
  onComplete: () => void;
}) {
  const emoji = SERVICE_EMOJI[job.service] ?? '🛠️';

  const statusConfig: Record<Status, { bg: string; bdr: string; color: string; label: string }> = {
    pending:   { bg: WARM_DIM,   bdr: WARM_BDR,   color: WARM,   label: 'Pending'   },
    accepted:  { bg: SKY_DIM,    bdr: SKY_BDR,    color: SKY,    label: 'Active'    },
    completed: { bg: ACCENT_DIM, bdr: ACCENT_BDR, color: ACCENT, label: 'Completed' },
  };
  const sc = statusConfig[job.status];

  return (
    <View style={cardS.card}>

      {/* Header */}
      <View style={cardS.headerRow}>
        <View style={cardS.iconWrap}>
          <Text style={cardS.emoji}>{emoji}</Text>
        </View>
        <View style={cardS.headerInfo}>
          <Text style={cardS.customer}>{job.customer}</Text>
          <Text style={cardS.service}>{job.service}</Text>
        </View>
        <View style={[cardS.statusBadge, { backgroundColor: sc.bg, borderColor: sc.bdr }]}>
          <View style={[cardS.statusDot, { backgroundColor: sc.color }]} />
          <Text style={[cardS.statusText, { color: sc.color }]}>{sc.label}</Text>
        </View>
      </View>

      {/* Detail Pills */}
      <View style={cardS.detailRow}>
        <DetailPill emoji="📍" text={job.location} />
        <DetailPill emoji="🕐" text={job.time}     />
        <DetailPill emoji="💰" text={job.price} accent />
      </View>

      {/* Actions */}
      {job.status === 'pending' && (
        <View style={cardS.actionsRow}>
          <TouchableOpacity style={cardS.acceptBtn} onPress={onAccept} activeOpacity={0.85}>
            <Text style={cardS.acceptBtnText}>✓  Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cardS.rejectBtn} onPress={onReject} activeOpacity={0.8}>
            <Text style={cardS.rejectBtnText}>✕  Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {job.status === 'accepted' && (
        <TouchableOpacity style={cardS.completeBtn} onPress={onComplete} activeOpacity={0.85}>
          <Text style={cardS.completeBtnText}>Mark as Completed →</Text>
        </TouchableOpacity>
      )}

      {job.status === 'completed' && (
        <View style={cardS.completedBar}>
          <Text style={cardS.completedBarText}>✓  Job completed successfully</Text>
        </View>
      )}
    </View>
  );
}

// ── Detail Pill ───────────────────────────────────────────────────────────────
function DetailPill({ emoji, text, accent }: { emoji: string; text: string; accent?: boolean }) {
  return (
    <View style={pillS.pill}>
      <Text style={pillS.emoji}>{emoji}</Text>
      <Text style={[pillS.text, accent && pillS.accentText]}>{text}</Text>
    </View>
  );
}

// ── Summary Item ──────────────────────────────────────────────────────────────
function SummaryItem({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={sumS.wrap}>
      <Text style={[sumS.value, { color }]}>{value}</Text>
      <Text style={sumS.label}>{label}</Text>
    </View>
  );
}

// ── Sub-styles ────────────────────────────────────────────────────────────────
const sumS = StyleSheet.create({
  wrap:  { flex: 1, alignItems: 'center', gap: 3 },
  value: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  label: { color: MUTED, fontSize: 11, fontWeight: '600' },
});

const pillS = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: CREAM2,
    borderWidth: 1.5, borderColor: BDR,
    borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10,
  },
  emoji:      { fontSize: 11 },
  text:       { color: MUTED, fontSize: 11, fontWeight: '500' },
  accentText: { color: WARM, fontWeight: '700' },
});

const cardS = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderWidth: 1.5, borderColor: BDR,
    borderRadius: 20, padding: 16, gap: 12,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  headerRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 46, height: 46, borderRadius: 13,
    backgroundColor: CREAM2, borderWidth: 1.5, borderColor: BDR,
    justifyContent: 'center', alignItems: 'center',
  },
  emoji:      { fontSize: 20 },
  headerInfo: { flex: 1 },
  customer:   { color: INK, fontSize: 15, fontWeight: '700' },
  service:    { color: MUTED, fontSize: 12, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 20, borderWidth: 1,
    paddingVertical: 4, paddingHorizontal: 10,
  },
  statusDot:  { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  detailRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionsRow: { flexDirection: 'row', gap: 10 },

  // Accept
  acceptBtn: {
    flex: 1, backgroundColor: INK,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 3,
  },
  acceptBtnText: { color: WHITE, fontSize: 13, fontWeight: '800' },

  // Reject
  rejectBtn: {
    flex: 1,
    backgroundColor: DANGER_DIM, borderWidth: 1.5, borderColor: DANGER_BDR,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  rejectBtnText: { color: DANGER, fontSize: 13, fontWeight: '700' },

  // Complete
  completeBtn: {
    backgroundColor: SKY_DIM, borderWidth: 1.5, borderColor: SKY_BDR,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  completeBtnText: { color: SKY, fontSize: 13, fontWeight: '700' },

  // Done bar
  completedBar: {
    backgroundColor: ACCENT_DIM, borderWidth: 1.5, borderColor: ACCENT_BDR,
    borderRadius: 10, paddingVertical: 9, alignItems: 'center',
  },
  completedBarText: { color: ACCENT, fontSize: 12, fontWeight: '700' },
});

// ── Main Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },

  // TOP BAR
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 52, paddingBottom: 6,
  },
  brandRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: {
    width: 34, height: 34, backgroundColor: INK, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  brandEmoji: { fontSize: 14 },
  brandName:  { fontSize: 17, fontWeight: '700', color: INK },
  avatarBtn:  {
    width: 34, height: 34, backgroundColor: INK,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: WHITE },

  // LOCATION
  locationRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 18, paddingBottom: 8,
  },
  locIcon: { fontSize: 11, opacity: 0.5 },
  locText: { fontSize: 12, color: MUTED },

  // HERO
  hero: { paddingHorizontal: 18, paddingBottom: 16 },
  heroGreeting: { color: MUTED, fontSize: 13, marginBottom: 3 },
  heroTitle: { color: INK, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  heroSub:   { color: MUTED, fontSize: 13, marginTop: 4 },

  // SUMMARY STRIP
  summaryStrip: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 18,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BDR,
    borderRadius: 18, paddingVertical: 14, paddingHorizontal: 8,
    shadowColor: SHADOW, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  stripDiv: { width: 1, height: 32, backgroundColor: DIVIDER },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 18, paddingBottom: 12,
  },
  sectionTitle: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1.8 },
  sectionCount: { color: ACCENT, fontSize: 12, fontWeight: '600' },

  listContent: { paddingHorizontal: 18 },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: WHITE, borderTopWidth: 1.5, borderTopColor: BDR,
    paddingTop: 10, paddingBottom: 24,
    shadowColor: INK, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 8,
  },
  navItem:        { flex: 1, alignItems: 'center', gap: 4 },
  navIcon:        { fontSize: 20, opacity: 0.35 },
  navLabel:       { fontSize: 10, fontWeight: '600', color: MUTED },
  navCenter:      { flex: 1, alignItems: 'center', marginTop: -26 },
  navCenterBtn: {
    width: 52, height: 52, backgroundColor: INK, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: INK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6,
  },
  navCenterEmoji: { fontSize: 22 },
  navCenterLabel: { fontSize: 10, fontWeight: '700', color: INK, marginTop: 5 },
});