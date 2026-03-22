import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { Stack } from 'expo-router';

const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const ACCENT      = '#00D68F';
const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
const WARM        = '#FF8C42';
const WARM_DIM    = 'rgba(255,140,66,0.10)';
const WARM_BDR    = 'rgba(255,140,66,0.22)';
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
  { id: '1', customer: 'Amit Sharma',  service: 'AC Repair',  location: 'Delhi',    time: '10:00 AM', price: '₹500',  status: 'pending'  },
  { id: '2', customer: 'Neha Gupta',   service: 'Wiring Fix', location: 'Noida',    time: '12:30 PM', price: '₹350',  status: 'pending'  },
  { id: '3', customer: 'Ramesh Verma', service: 'Plumbing',   location: 'Gurgaon',  time: '2:00 PM',  price: '₹420',  status: 'accepted' },
  { id: '4', customer: 'Priya Singh',  service: 'Electrician',location: 'Faridabad',time: '4:00 PM',  price: '₹300',  status: 'completed'},
  { id: '5', customer: 'Karan Mehta',  service: 'AC Repair',  location: 'Delhi',    time: '11:00 AM', price: '₹600',  status: 'pending'  },
];

export default function WorkerJobs() {
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);

  const pending   = jobs.filter(j => j.status === 'pending').length;
  const accepted  = jobs.filter(j => j.status === 'accepted').length;
  const completed = jobs.filter(j => j.status === 'completed').length;

  const handleAccept = (id: string) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'accepted' } : j));

  const handleReject = (id: string) =>
    setJobs(prev => prev.filter(j => j.id !== id));

  const handleComplete = (id: string) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'completed' } : j));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.root}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.appLabel}>WorkerOS</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Job Requests</Text>
          <Text style={styles.heroSub}>Manage your incoming and active jobs</Text>
        </View>

        {/* Summary Strip */}
        <View style={styles.summaryStrip}>
          <SummaryItem value={pending}   label="Pending"   color={WARM}   />
          <View style={styles.stripDiv} />
          <SummaryItem value={accepted}  label="Active"    color={SKY}    />
          <View style={styles.stripDiv} />
          <SummaryItem value={completed} label="Completed" color={ACCENT} />
        </View>

        {/* Section label */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALL JOBS</Text>
          <Text style={styles.sectionCount}>{jobs.length} total</Text>
        </View>

        {/* Job List */}
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
        />
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
    <View style={cardStyles.card}>
      {/* Header row */}
      <View style={cardStyles.headerRow}>
        <View style={cardStyles.iconWrap}>
          <Text style={cardStyles.emoji}>{emoji}</Text>
        </View>
        <View style={cardStyles.headerInfo}>
          <Text style={cardStyles.customer}>{job.customer}</Text>
          <Text style={cardStyles.service}>{job.service}</Text>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.bdr }]}>
          <View style={[cardStyles.statusDot, { backgroundColor: sc.color }]} />
          <Text style={[cardStyles.statusText, { color: sc.color }]}>{sc.label}</Text>
        </View>
      </View>

      {/* Detail row */}
      <View style={cardStyles.detailRow}>
        <DetailPill emoji="📍" text={job.location} />
        <DetailPill emoji="🕐" text={job.time}     />
        <DetailPill emoji="💰" text={job.price} accent />
      </View>

      {/* Actions */}
      {job.status === 'pending' && (
        <View style={cardStyles.actionsRow}>
          <TouchableOpacity style={cardStyles.acceptBtn} onPress={onAccept} activeOpacity={0.85}>
            <Text style={cardStyles.acceptBtnText}>✓  Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cardStyles.rejectBtn} onPress={onReject} activeOpacity={0.8}>
            <Text style={cardStyles.rejectBtnText}>✕  Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {job.status === 'accepted' && (
        <TouchableOpacity style={cardStyles.completeBtn} onPress={onComplete} activeOpacity={0.85}>
          <Text style={cardStyles.completeBtnText}>Mark as Completed →</Text>
        </TouchableOpacity>
      )}

      {job.status === 'completed' && (
        <View style={cardStyles.completedBar}>
          <Text style={cardStyles.completedBarText}>✓  Job completed successfully</Text>
        </View>
      )}
    </View>
  );
}

function DetailPill({ emoji, text, accent }: { emoji: string; text: string; accent?: boolean }) {
  return (
    <View style={pillStyles.pill}>
      <Text style={pillStyles.emoji}>{emoji}</Text>
      <Text style={[pillStyles.text, accent && pillStyles.accentText]}>{text}</Text>
    </View>
  );
}

// ── Sub-styles ────────────────────────────────────────────────────────────────
function SummaryItem({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={sumStyles.wrap}>
      <Text style={[sumStyles.value, { color }]}>{value}</Text>
      <Text style={sumStyles.label}>{label}</Text>
    </View>
  );
}

const sumStyles = StyleSheet.create({
  wrap:  { flex: 1, alignItems: 'center', gap: 3 },
  value: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  label: { color: MUTED, fontSize: 11, fontWeight: '600' },
});

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  emoji: { fontSize: 11 },
  text:  { color: MUTED, fontSize: 11, fontWeight: '500' },
  accentText: { color: WARM, fontWeight: '700' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 20 },
  headerInfo: { flex: 1 },
  customer: { color: TEXT, fontSize: 15, fontWeight: '700' },
  service:  { color: MUTED, fontSize: 12, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusDot:  { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  acceptBtn: {
    flex: 1,
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptBtnText: { color: NAVY, fontSize: 13, fontWeight: '800' },
  rejectBtn: {
    flex: 1,
    backgroundColor: DANGER_DIM,
    borderWidth: 1,
    borderColor: DANGER_BDR,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  rejectBtnText: { color: DANGER, fontSize: 13, fontWeight: '700' },
  completeBtn: {
    backgroundColor: SKY_DIM,
    borderWidth: 1,
    borderColor: SKY_BDR,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeBtnText: { color: SKY, fontSize: 13, fontWeight: '700' },
  completedBar: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  completedBarText: { color: ACCENT, fontSize: 12, fontWeight: '700' },
});

// ── Main styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NAVY },

  topBar: {
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

  hero: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 16,
  },
  heroTitle: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSub: { color: MUTED, fontSize: 13, marginTop: 4 },

  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  stripDiv: { width: 1, height: 32, backgroundColor: BORDER },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 12,
  },
  sectionTitle: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1.8 },
  sectionCount: { color: ACCENT, fontSize: 12 },

  listContent: { paddingHorizontal: 22, paddingBottom: 40 },
});