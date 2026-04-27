import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const ACCENT      = '#00D68F';
const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
const WARM        = '#FF8C42';
const WARM_DIM    = 'rgba(255,140,66,0.10)';
const WARM_BDR    = 'rgba(255,140,66,0.22)';
const SURFACE     = 'rgba(255,255,255,0.04)';
const SURFACE_MID = 'rgba(255,255,255,0.07)';
const BORDER      = 'rgba(255,255,255,0.08)';
const TEXT        = '#EEF4FA';
const MUTED       = 'rgba(200,220,235,0.55)';

const SERVICE_EMOJI: Record<string, string> = {
  'Electrician':      '⚡',
  'Plumber':          '🔧',
  'AC Repair':        '❄️',
  'Cleaning':         '🧹',
  'Carpenter':        '🪚',
  'Appliance Repair': '🔌',
  'Painter':          '🖌️',
  'Gardening':        '🌿',
  'Pest Control':     '🛡️',
  'Laundry':          '👕',
  'Home Security':    '🔒',
  'Moving/Transport': '🚚',
};

type Worker = {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  verified: boolean;
  location: string;
  experience: string;
  price: string;
};

const ALL_WORKERS: Worker[] = [
  // Electricians
  { id: '1',  name: 'Ramesh Kumar',   service: 'Electrician',      rating: 4.6, reviews: 128, verified: true,  location: 'Delhi',    experience: '8 yrs',  price: '₹350/hr' },
  { id: '2',  name: 'Suresh Yadav',   service: 'Electrician',      rating: 4.2, reviews: 74,  verified: false, location: 'Noida',    experience: '5 yrs',  price: '₹300/hr' },
  { id: '3',  name: 'Amit Singh',     service: 'Electrician',      rating: 4.8, reviews: 210, verified: true,  location: 'Gurgaon',  experience: '12 yrs', price: '₹400/hr' },
  { id: '4',  name: 'Vijay Sharma',   service: 'Electrician',      rating: 4.4, reviews: 95,  verified: true,  location: 'Faridabad',experience: '6 yrs',  price: '₹320/hr' },
  { id: '5',  name: 'Deepak Verma',   service: 'Electrician',      rating: 3.9, reviews: 42,  verified: false, location: 'Delhi',    experience: '3 yrs',  price: '₹280/hr' },
  // Plumbers
  { id: '6',  name: 'Mohan Lal',      service: 'Plumber',          rating: 4.7, reviews: 183, verified: true,  location: 'Delhi',    experience: '10 yrs', price: '₹380/hr' },
  { id: '7',  name: 'Prakash Joshi',  service: 'Plumber',          rating: 4.3, reviews: 61,  verified: true,  location: 'Noida',    experience: '7 yrs',  price: '₹340/hr' },
  { id: '8',  name: 'Ravi Gupta',     service: 'Plumber',          rating: 4.1, reviews: 38,  verified: false, location: 'Gurgaon',  experience: '4 yrs',  price: '₹290/hr' },
  // AC Repair
  { id: '9',  name: 'Anil Tiwari',    service: 'AC Repair',        rating: 4.9, reviews: 247, verified: true,  location: 'Delhi',    experience: '14 yrs', price: '₹500/visit' },
  { id: '10', name: 'Sanjay Mishra',  service: 'AC Repair',        rating: 4.5, reviews: 112, verified: true,  location: 'Noida',    experience: '9 yrs',  price: '₹450/visit' },
  { id: '11', name: 'Kiran Patel',    service: 'AC Repair',        rating: 4.0, reviews: 55,  verified: false, location: 'Gurgaon',  experience: '5 yrs',  price: '₹400/visit' },
  // Cleaning
  { id: '12', name: 'Sunita Devi',    service: 'Cleaning',         rating: 4.8, reviews: 320, verified: true,  location: 'Delhi',    experience: '6 yrs',  price: '₹250/hr' },
  { id: '13', name: 'Priya Singh',    service: 'Cleaning',         rating: 4.6, reviews: 190, verified: true,  location: 'Noida',    experience: '4 yrs',  price: '₹220/hr' },
  { id: '14', name: 'Meena Kumari',   service: 'Cleaning',         rating: 4.2, reviews: 88,  verified: false, location: 'Delhi',    experience: '3 yrs',  price: '₹200/hr' },
  // Carpenter
  { id: '15', name: 'Harish Nair',    service: 'Carpenter',        rating: 4.7, reviews: 142, verified: true,  location: 'Gurgaon',  experience: '11 yrs', price: '₹420/hr' },
  { id: '16', name: 'Rajesh Pillai',  service: 'Carpenter',        rating: 4.4, reviews: 76,  verified: true,  location: 'Delhi',    experience: '8 yrs',  price: '₹380/hr' },
  // Appliance Repair
  { id: '17', name: 'Dinesh Babu',    service: 'Appliance Repair', rating: 4.6, reviews: 165, verified: true,  location: 'Delhi',    experience: '9 yrs',  price: '₹350/visit' },
  { id: '18', name: 'Santosh Kumar',  service: 'Appliance Repair', rating: 4.3, reviews: 92,  verified: false, location: 'Noida',    experience: '5 yrs',  price: '₹300/visit' },
  // Painter
  { id: '19', name: 'Mahesh Pawar',   service: 'Painter',          rating: 4.5, reviews: 108, verified: true,  location: 'Delhi',    experience: '7 yrs',  price: '₹300/hr' },
  { id: '20', name: 'Ganesh Raut',    service: 'Painter',          rating: 4.1, reviews: 47,  verified: false, location: 'Faridabad',experience: '4 yrs',  price: '₹260/hr' },
  // Gardening
  { id: '21', name: 'Bharat Mali',    service: 'Gardening',        rating: 4.8, reviews: 134, verified: true,  location: 'Gurgaon',  experience: '10 yrs', price: '₹200/hr' },
  // Pest Control
  { id: '22', name: 'Sunil Rawat',    service: 'Pest Control',     rating: 4.6, reviews: 89,  verified: true,  location: 'Delhi',    experience: '6 yrs',  price: '₹600/visit' },
  // Laundry
  { id: '23', name: 'Kavita Sharma',  service: 'Laundry',          rating: 4.4, reviews: 203, verified: true,  location: 'Noida',    experience: '5 yrs',  price: '₹150/kg' },
  // Home Security
  { id: '24', name: 'Arvind Saxena',  service: 'Home Security',    rating: 4.7, reviews: 67,  verified: true,  location: 'Delhi',    experience: '12 yrs', price: '₹800/visit' },
  // Moving
  { id: '25', name: 'Rakesh Thakur',  service: 'Moving/Transport', rating: 4.5, reviews: 156, verified: true,  location: 'Delhi',    experience: '8 yrs',  price: '₹1200/trip' },
];

export default function ServiceList() {
  // ✅ Read the service name passed from Home
  const { service } = useLocalSearchParams<{ service: string }>();

  const filtered = service
    ? ALL_WORKERS.filter((w) => w.service === service)
    : ALL_WORKERS;

  const emoji = service ? (SERVICE_EMOJI[service] ?? '🛠️') : '🛠️';
  const topRated = [...filtered].sort((a, b) => b.rating - a.rating)[0];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.appLabel}>WorkerOS</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <Text style={styles.heroEmoji}>{emoji}</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>{service ?? 'All Workers'}</Text>
          <Text style={styles.heroSub}>{filtered.length} professionals available</Text>
        </View>
      </View>

      {/* Top Rated Banner */}
      {topRated && (
        <View style={styles.topRatedBanner}>
          <Text style={styles.topRatedLabel}>⭐ TOP RATED</Text>
          <Text style={styles.topRatedName}>{topRated.name} · {topRated.rating}</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <WorkerCard worker={item} />}
      />
    </View>
  );
}

function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {worker.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>

        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.workerName}>{worker.name}</Text>
            {worker.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.workerLocation}>📍 {worker.location}  ·  {worker.experience}</Text>
        </View>

        <Text style={styles.priceTag}>{worker.price}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statStar}>★</Text>
          <Text style={styles.statValue}>{worker.rating}</Text>
          <Text style={styles.statSub}>({worker.reviews})</Text>
        </View>
      </View>

      {/* Book button */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => router.push('/customer/booking')}
        activeOpacity={0.85}
      >
        <Text style={styles.bookBtnText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: TEXT, fontSize: 22, lineHeight: 24, fontWeight: '300' },
  appLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  // HERO
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 16,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 24 },
  heroText: { flex: 1 },
  heroTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSub: { color: MUTED, fontSize: 13, marginTop: 3 },

  // TOP RATED BANNER
  topRatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginBottom: 14,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  topRatedLabel: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  topRatedName: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },

  // LIST
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  // WORKER CARD
  card: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
  nameBlock: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  workerName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  verifiedText: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: '700',
  },
  workerLocation: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  priceTag: {
    color: WARM,
    fontSize: 13,
    fontWeight: '700',
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: WARM_DIM,
    borderWidth: 1,
    borderColor: WARM_BDR,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statStar: { color: WARM, fontSize: 12 },
  statValue: { color: WARM, fontSize: 12, fontWeight: '700' },
  statSub: { color: MUTED, fontSize: 11 },

  // BOOK BUTTON
  bookBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  bookBtnText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});