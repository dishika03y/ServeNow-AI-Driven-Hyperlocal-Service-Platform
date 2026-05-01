import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { router } from 'expo-router';
import { apiRequest } from '@/src/api/api';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

const { width: W } = Dimensions.get('window');
const CARD_W = W - 40;

// ── Brand tokens ───────────────────────────────────────────────
const C = {
  navy:        '#081F5C',
  navyLight:   '#081F5C10',
  navyMid:     '#081F5C40',
  sky:         '#BAD6EB',
  skyLight:    '#BAD6EB30',
  cream:       '#F7F2EB',
  creamBorder: '#E8E2D8',
  white:       '#FFFFFF',
  success:     '#166834',
  successBg:   '#F0FDF4',
  error:       '#991B1B',
  errorBg:     '#FEF2F2',
  errorBorder: '#FECACA',
  urgentBg:    '#FEF2F2',
  urgentText:  '#991B1B',
};

// ── Types ──────────────────────────────────────────────────────
type Job = {
  id:          string;
  title:       string;
  description: string;
  location:    string;
  reward:      string;
  scheduledAt?: string;
  category?:   string;
  urgent?:     boolean;
  tags?:       string[];
};

// ── Icons ──────────────────────────────────────────────────────
const p14 = {
  stroke: C.navy, strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

const LogoMark = () => (
  <Svg width={14} height={14} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
    <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
  </Svg>
);

const BackIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <Path d="M9 3L5 7l4 4" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2a5 5 0 00-5 5v3l-1.5 2h13L14 10V7a5 5 0 00-5-5z" stroke={C.navy} strokeWidth={1.3} />
    <Path d="M7 15a2 2 0 004 0" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 10 10" fill="none">
    <Path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke={C.navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
    <Path d="M6 1C4 1 2.5 2.5 2.5 4.5c0 3 3.5 6.5 3.5 6.5s3.5-3.5 3.5-6.5C9.5 2.5 8 1 6 1z" stroke={C.navy} strokeWidth={1} opacity={0.4} />
    <Circle cx={6} cy={4.5} r={1} stroke={C.navy} strokeWidth={0.9} opacity={0.4} />
  </Svg>
);

const ClockIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
    <Circle cx={6} cy={6} r={4.5} stroke={C.navy} strokeWidth={1} opacity={0.4} />
    <Path d="M6 3.5v3l1.5 1.5" stroke={C.navy} strokeWidth={1} strokeLinecap="round" opacity={0.4} />
  </Svg>
);

const CashIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
    <Circle cx={6} cy={6} r={4.5} stroke={C.success} strokeWidth={1.1} />
    <Path d="M4.5 5h2a1 1 0 010 2h-2M5.5 4v5" stroke={C.success} strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

const AlertIcon = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={C.error} strokeWidth={1.4} />
    <Path d="M12 8v4M12 16h.01" stroke={C.error} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const EmptyIcon = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" opacity={0.3} />
    <Polyline points="17 8 12 3 7 8" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
    <Line x1={12} y1={3} x2={12} y2={15} stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" opacity={0.3} />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
    <Path d="M6 1l4 1.5v4C10 9 8 11 6 12c-2-1-4-3-4-5.5V2.5L6 1z" stroke={C.navy} strokeWidth={1} opacity={0.3} />
  </Svg>
);

// ── Stat card ──────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={st.statCard}>
      <Text style={st.statNum}>{value}</Text>
      <Text style={st.statLbl}>{label}</Text>
    </View>
  );
}

// ── Job card ───────────────────────────────────────────────────
function JobCard({
  job,
  onAccept,
}: {
  job: Job;
  onAccept: (id: string) => void;
}) {
  const slideOut = useRef(new Animated.Value(0)).current;
  const opacity  = useRef(new Animated.Value(1)).current;

  const handleAccept = () => {
    Animated.parallel([
      Animated.timing(opacity,  { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(slideOut, { toValue: 60, duration: 280, useNativeDriver: true }),
    ]).start(() => onAccept(job.id));
  };

  return (
    <Animated.View style={[st.jobCard, { opacity, transform: [{ translateX: slideOut }] }]}>
      {/* Header */}
      <View style={st.jcTop}>
        <View style={st.jcLeft}>
          <View style={st.jcIcon}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" {...p14} />
            </Svg>
          </View>
          <View style={st.jcTitleWrap}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={st.jcTitle} numberOfLines={1}>{job.title}</Text>
              {job.urgent && (
                <View style={st.urgentBadge}>
                  <Text style={st.urgentTxt}>URGENT</Text>
                </View>
              )}
            </View>
            <View style={st.jcLocRow}>
              <LocIcon />
              <Text style={st.jcLoc} numberOfLines={1}>{job.location}</Text>
            </View>
          </View>
        </View>
        <View style={st.rewardBadge}>
          <CashIcon />
          <Text style={st.rewardTxt}>{job.reward}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={st.jcDesc} numberOfLines={2}>{job.description}</Text>

      {/* Meta chips */}
      <View style={st.metaRow}>
        {job.scheduledAt && (
          <View style={st.metaChip}>
            <ClockIcon />
            <Text style={st.metaChipTxt}>{job.scheduledAt}</Text>
          </View>
        )}
        {(job.tags ?? []).map((tag) => (
          <View key={tag} style={st.metaChip}>
            <Text style={st.metaChipTxt}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Action row */}
      <View style={st.jcBtns}>
        <TouchableOpacity style={st.acceptBtn} onPress={handleAccept} activeOpacity={0.85}>
          <Text style={st.acceptTxt}>Accept Job</Text>
          <View style={st.acceptChip}><ArrowIcon /></View>
        </TouchableOpacity>
        <TouchableOpacity style={st.skipBtn} activeOpacity={0.75}>
          <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
            <Path d="M2 8h10M8 4l4 4-4 4" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
          </Svg>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ────────────────────────────────────────────────
const FILTERS = ['All', 'Repair', 'Cleaning', 'Installation', 'Maintenance'];

export default function JobScreen() {
  const [jobs, setJobs]         = useState<Job[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState('All');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest('/workers/jobs', 'GET');
      setJobs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.log('JobScreen fetch error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (jobId: string) => {
    try {
      await apiRequest(`/workers/jobs/${jobId}/accept`, 'POST');
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      Alert.alert('Error', 'Could not accept job. Please try again.');
    }
  };

  const filtered = jobs.filter(
    (j) => filter === 'All' || j.category === filter
  );

  const urgentCount = jobs.filter((j) => j.urgent).length;
  const totalReward = jobs
    .reduce((sum, j) => sum + (parseFloat(j.reward.replace(/[^0-9.]/g, '')) || 0), 0)
    .toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // ── Loading skeleton ──
  if (loading) {
    return (
      <View style={st.root}>
        <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
        <View style={st.topBar}>
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <BackIcon />
          </TouchableOpacity>
          <View style={st.brandRow}>
            <View style={st.logoBox}><LogoMark /></View>
            <Text style={st.brandName}>ServeNow</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>
        <View style={st.loadingWrap}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[st.skeletonCard, { opacity: 1 - i * 0.2 }]} />
          ))}
        </View>
      </View>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <View style={st.root}>
        <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
        <View style={st.bg1} />
        <View style={st.topBar}>
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <BackIcon />
          </TouchableOpacity>
          <View style={st.brandRow}>
            <View style={st.logoBox}><LogoMark /></View>
            <Text style={st.brandName}>ServeNow</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>
        <View style={st.centerWrap}>
          <View style={[st.errorCard]}>
            <AlertIcon />
            <Text style={st.errorTitle}>Something went wrong</Text>
            <Text style={st.errorSub}>{error}</Text>
            <TouchableOpacity style={st.errorRetryBtn} onPress={fetchJobs} activeOpacity={0.85}>
              <Text style={st.errorRetryTxt}>Try again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Empty state ──
  if (filtered.length === 0 && jobs.length === 0) {
    return (
      <View style={st.root}>
        <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
        <View style={st.bg1} />
        <View style={st.topBar}>
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <BackIcon />
          </TouchableOpacity>
          <View style={st.brandRow}>
            <View style={st.logoBox}><LogoMark /></View>
            <Text style={st.brandName}>ServeNow</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>
        <View style={st.centerWrap}>
          <View style={st.emptyIconBox}><EmptyIcon /></View>
          <Text style={st.emptyTitle}>No jobs right now</Text>
          <Text style={st.emptySub}>
            New jobs matching your skills will appear here. Check back in a while — they fill up fast!
          </Text>
          <TouchableOpacity style={st.retryBtn} onPress={fetchJobs} activeOpacity={0.85}>
            <Text style={st.retryTxt}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main list ──
  return (
    <View style={st.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
      <View style={st.bg1} />
      <View style={st.bg2} />

      {/* Top bar */}
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <BackIcon />
        </TouchableOpacity>
        <View style={st.brandRow}>
          <View style={st.logoBox}><LogoMark /></View>
          <Text style={st.brandName}>ServeNow</Text>
        </View>
        <TouchableOpacity style={st.bellBtn} activeOpacity={0.75}>
          <BellIcon />
          {urgentCount > 0 && <View style={st.bellDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={st.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Text style={st.greeting}>Good afternoon, there</Text>
        <Text style={st.heroTitle}>
          Available <Text style={st.heroItalic}>jobs.</Text>
        </Text>

        {/* Stats */}
        <View style={st.statsRow}>
          <StatCard value={String(jobs.length)} label="OPEN JOBS" />
          <StatCard value={String(urgentCount)}  label="URGENT" />
          <StatCard value={`₹${totalReward}`}    label="TOTAL REWARD" />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.filterContent}
          style={st.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[st.filterPill, filter === f && st.filterPillActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.75}
            >
              <Text style={[st.filterTxt, filter === f && st.filterTxtActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section header */}
        <View style={st.secRow}>
          <Text style={st.secLbl}>NEAR YOU</Text>
          <View style={st.secBadge}>
            <Text style={st.secBadgeTxt}>{filtered.length} jobs</Text>
          </View>
        </View>

        {/* Job cards */}
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} onAccept={handleAccept} />
        ))}

        {/* Trust strip */}
        <View style={st.trust}>
          <ShieldIcon />
          <Text style={st.trustTxt}>Verified clients</Text>
          <View style={st.trustDot} />
          <Text style={st.trustTxt}>Instant payment</Text>
          <View style={st.trustDot} />
          <Text style={st.trustTxt}>Insured jobs</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  bg1:  { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: C.sky,  opacity: 0.24, top: -60,  right: -60 },
  bg2:  { position: 'absolute', width: 160, height: 160, borderRadius: 80,  backgroundColor: C.navy, opacity: 0.05, bottom: 80, left: -40 },

  // Top bar
  topBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 54, paddingBottom: 8, zIndex: 2 },
  backBtn:  { width: 32, height: 32, borderRadius: 8, backgroundColor: C.white, borderWidth: 1, borderColor: C.creamBorder, alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  logoBox:  { width: 26, height: 26, backgroundColor: C.navy, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  brandName:{ fontFamily: 'serif', fontSize: 16, fontWeight: '700', color: C.navy, letterSpacing: -0.2 },
  bellBtn:  { width: 32, height: 32, borderRadius: 8, backgroundColor: C.white, borderWidth: 1, borderColor: C.creamBorder, alignItems: 'center', justifyContent: 'center' },
  bellDot:  { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#F87171', position: 'absolute', top: 6, right: 6, borderWidth: 1.5, borderColor: C.cream },

  scroll: { paddingHorizontal: 20, paddingBottom: 80 },

  // Hero
  greeting:   { fontSize: 12, color: C.navy, opacity: 0.38, marginTop: 8, marginBottom: 2 },
  heroTitle:  { fontFamily: 'serif', fontSize: 26, fontWeight: '700', color: C.navy, letterSpacing: -0.5, marginBottom: 16 },
  heroItalic: { fontStyle: 'italic', color: C.sky },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1.5, borderColor: C.creamBorder, padding: 10 },
  statNum:  { fontFamily: 'serif', fontSize: 20, fontWeight: '800', color: C.navy, letterSpacing: -0.3 },
  statLbl:  { fontSize: 8, fontWeight: '700', color: C.navy, opacity: 0.35, letterSpacing: 0.5, marginTop: 2 },

  // Filters
  filterScroll:  { marginBottom: 14 },
  filterContent: { gap: 7, paddingRight: 4 },
  filterPill:    { height: 30, paddingHorizontal: 13, borderRadius: 15, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder, alignItems: 'center', justifyContent: 'center' },
  filterPillActive: { backgroundColor: C.navy, borderColor: C.navy },
  filterTxt:     { fontSize: 11, fontWeight: '600', color: C.navy, opacity: 0.45 },
  filterTxtActive:  { color: C.cream, opacity: 1 },

  // Section
  secRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  secLbl:      { fontSize: 9, fontWeight: '700', letterSpacing: 1.1, color: C.navy, opacity: 0.35 },
  secBadge:    { backgroundColor: C.navyLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  secBadgeTxt: { fontSize: 9, fontWeight: '600', color: C.navy, opacity: 0.5 },

  // Job card
  jobCard: {
    backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1.5, borderColor: C.creamBorder,
    padding: 15, marginBottom: 10,
  },
  jcTop:       { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  jcLeft:      { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  jcIcon:      { width: 40, height: 40, borderRadius: 10, backgroundColor: C.navyLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  jcTitleWrap: { flex: 1, minWidth: 0 },
  jcTitle:     { fontSize: 13, fontWeight: '700', color: C.navy, marginBottom: 3 },
  jcLocRow:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  jcLoc:       { fontSize: 10, color: C.navy, opacity: 0.38, flex: 1 },
  urgentBadge: { backgroundColor: C.urgentBg, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 },
  urgentTxt:   { fontSize: 8, fontWeight: '700', color: C.urgentText, letterSpacing: 0.3 },
  rewardBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.successBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, flexShrink: 0 },
  rewardTxt:   { fontSize: 11, fontWeight: '700', color: C.success },

  jcDesc: { fontSize: 11, color: C.navy, opacity: 0.4, lineHeight: 16, marginBottom: 10 },

  metaRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 11 },
  metaChip:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.cream, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 },
  metaChipTxt: { fontSize: 9, fontWeight: '600', color: C.navy, opacity: 0.5 },

  jcBtns:    { flexDirection: 'row', gap: 8 },
  acceptBtn: { flex: 1, height: 40, backgroundColor: C.navy, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  acceptTxt: { fontSize: 13, fontWeight: '700', color: C.cream },
  acceptChip:{ width: 20, height: 20, backgroundColor: C.sky, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  skipBtn:   { width: 40, height: 40, backgroundColor: C.cream, borderRadius: 11, borderWidth: 1.5, borderColor: C.creamBorder, alignItems: 'center', justifyContent: 'center' },

  // Loading skeletons
  loadingWrap:   { padding: 20, gap: 10 },
  skeletonCard:  { width: '100%', height: 140, backgroundColor: C.white, borderRadius: 16, borderWidth: 1.5, borderColor: C.creamBorder },

  // Center wrapper (error + empty)
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingBottom: 60 },

  // Error
  errorCard:     { width: '100%', backgroundColor: C.errorBg, borderRadius: 16, borderWidth: 1.5, borderColor: C.errorBorder, padding: 24, alignItems: 'center', gap: 10 },
  errorTitle:    { fontFamily: 'serif', fontSize: 18, fontWeight: '700', color: C.error, textAlign: 'center' },
  errorSub:      { fontSize: 12, color: C.error, opacity: 0.6, textAlign: 'center', lineHeight: 17 },
  errorRetryBtn: { height: 42, paddingHorizontal: 24, backgroundColor: C.error, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  errorRetryTxt: { fontSize: 13, fontWeight: '700', color: C.errorBg },

  // Empty
  emptyIconBox: { width: 60, height: 60, borderRadius: 17, backgroundColor: C.navyLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle:   { fontFamily: 'serif', fontSize: 22, fontWeight: '700', color: C.navy, letterSpacing: -0.3, textAlign: 'center', marginBottom: 8 },
  emptySub:     { fontSize: 12, color: C.navy, opacity: 0.35, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  retryBtn:     { height: 42, paddingHorizontal: 24, backgroundColor: C.navy, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  retryTxt:     { fontSize: 13, fontWeight: '700', color: C.cream },

  // Trust
  trust:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.navyLight, borderRadius: 12, padding: 12, marginTop: 8 },
  trustTxt: { fontSize: 10, color: C.navy, opacity: 0.3, fontWeight: '500' },
  trustDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: C.navy, opacity: 0.18 },
});