import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const ACCENT      = '#00D68F';
const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
const WARM        = '#FF8C42';
const SURFACE     = 'rgba(255,255,255,0.04)';
const SURFACE_MID = 'rgba(255,255,255,0.07)';
const BORDER      = 'rgba(255,255,255,0.08)';
const TEXT        = '#EEF4FA';
const MUTED       = 'rgba(200,220,235,0.55)';
const DANGER      = '#FF4D4D';
const DANGER_DIM  = 'rgba(255,77,77,0.1)';

const services = [
  { title: 'Electrician',      emoji: '⚡' },
  { title: 'Plumber',          emoji: '🔧' },
  { title: 'AC Repair',        emoji: '❄️' },
  { title: 'Cleaning',         emoji: '🧹' },
  { title: 'Carpenter',        emoji: '🪚' },
  { title: 'Appliance Repair', emoji: '🔌' },
  { title: 'Painter',          emoji: '🖌️' },
  { title: 'Gardening',        emoji: '🌿' },
  { title: 'Pest Control',     emoji: '🛡️' },
  { title: 'Laundry',          emoji: '👕' },
  { title: 'Home Security',    emoji: '🔒' },
  { title: 'Moving/Transport', emoji: '🚚' },
];

export default function Home() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appLabel}>WorkerOS</Text>
       <TouchableOpacity 
  style={styles.avatarBtn}
  onPress={() => router.push('/customer/Customerdashboard')} // 👈 change path
>
  <Text style={styles.avatarText}>AK</Text>
</TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <Text style={styles.heroTitle}>Find trusted{'\n'}services near you</Text>
        <View style={styles.locationTag}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText}>Delhi NCR</Text>
        </View>
      </View>

      {/* Search Bar (visual only) */}
      <TouchableOpacity style={styles.searchBar} activeOpacity={0.75}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search for a service…</Text>
      </TouchableOpacity>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ALL SERVICES</Text>
        <Text style={styles.sectionCount}>{services.length} available</Text>
      </View>

      {/* Services Grid */}
      <View style={styles.grid}>
        {services.map((service) => (
          <ServiceCard key={service.title} title={service.title} emoji={service.emoji} />
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace('/auth/login')}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutIcon}>→</Text>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ServiceCard({ title, emoji }: { title: string; emoji: string }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/customer/service-list',
          // ✅ Pass the tapped service title — ServiceList reads this via useLocalSearchParams
          params: { service: title },
        })
      }
      activeOpacity={0.75}
    >
      <View style={styles.cardIconWrap}>
        <Text style={styles.cardEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 40 },

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

  hero: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20 },
  greeting: { color: MUTED, fontSize: 13, marginBottom: 6 },
  heroTitle: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  locationDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: WARM },
  locationText: { color: MUTED, fontSize: 12 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 22,
    marginBottom: 4,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { color: MUTED, fontSize: 14 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 14,
  },
  sectionTitle: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1.8 },
  sectionCount: { color: ACCENT, fontSize: 12 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: { fontSize: 22 },
  cardText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 22,
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: DANGER_DIM,
    borderWidth: 1,
    borderColor: 'rgba(255,77,77,0.2)',
  },
  logoutIcon: { color: DANGER, fontSize: 16, fontWeight: '700' },
  logoutText: { color: DANGER, fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
});