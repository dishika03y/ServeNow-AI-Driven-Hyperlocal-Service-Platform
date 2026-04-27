import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

const NAVY = '#0B2239';
const NAVY_MID = '#163552';
const ACCENT = '#00D68F';
const ACCENT_DIM = 'rgba(0,214,143,0.12)';
const ACCENT_BORDER = 'rgba(0,214,143,0.25)';
const SURFACE = 'rgba(255,255,255,0.04)';
const SURFACE_MID = 'rgba(255,255,255,0.07)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#EEF4FA';
const MUTED = 'rgba(200,220,235,0.55)';
const DANGER = '#FF4D4D';
const DANGER_DIM = 'rgba(255,77,77,0.1)';
const DANGER_BORDER = 'rgba(255,77,77,0.22)';
const WARM = '#FF8C42';
const WARM_DIM = 'rgba(255,140,66,0.1)';
const WARM_BORDER = 'rgba(255,140,66,0.22)';

interface Booking {
  id: string;
  service: string;
  date: string;
  status: string;
}

const historyData: Booking[] = [
  { id: '1', service: 'Home Cleaning', date: '02 Feb 2026', status: 'Completed' },
  { id: '2', service: 'Plumbing',      date: '25 Jan 2026', status: 'Cancelled' },
  { id: '3', service: 'Electrician',   date: '15 Jan 2026', status: 'Completed' },
];

const SERVICE_EMOJI: Record<string, string> = {
  'Home Cleaning': '🧹',
  'Plumbing':      '🔧',
  'Electrician':   '⚡',
};

const HistoryScreen: React.FC = () => {
  const router = useRouter();

  const completed = historyData.filter((b) => b.status === 'Completed').length;
  const cancelled = historyData.filter((b) => b.status === 'Cancelled').length;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appLabel}>WorkerOS</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Booking History</Text>
        <Text style={styles.heroSub}>{historyData.length} total bookings</Text>
      </View>

      {/* Summary Pills */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryPill, styles.pillGreen]}>
          <View style={[styles.pillDot, { backgroundColor: ACCENT }]} />
          <Text style={[styles.pillText, { color: ACCENT }]}>{completed} Completed</Text>
        </View>
        <View style={[styles.summaryPill, styles.pillRed]}>
          <View style={[styles.pillDot, { backgroundColor: DANGER }]} />
          <Text style={[styles.pillText, { color: DANGER }]}>{cancelled} Cancelled</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT</Text>
      </View>

      {/* List */}
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const isCompleted = item.status === 'Completed';
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: '/booking-detail',
                  params: {
                    bookingId: item.id,
                    serviceName: item.service,
                    providerName: 'John Doe',
                    date: item.date,
                    time: '10:00 AM',
                    address: '123 Main Street',
                    price: '₹500',
                    status: item.status,
                  },
                })
              }
            >
              {/* Left: icon + info */}
              <View style={styles.cardLeft}>
                <View style={styles.iconWrap}>
                  <Text style={styles.cardEmoji}>
                    {SERVICE_EMOJI[item.service] ?? '🛠️'}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardService}>{item.service}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
              </View>

              {/* Right: status badge + chevron */}
              <View style={styles.cardRight}>
                <View
                  style={[
                    styles.statusBadge,
                    isCompleted ? styles.badgeGreen : styles.badgeRed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isCompleted ? styles.statusTextGreen : styles.statusTextRed,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },

  // TOP BAR
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

  // HERO
  hero: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 16,
  },
  heroTitle: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSub: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
  },

  // SUMMARY PILLS
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    marginBottom: 4,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  pillGreen: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT_BORDER,
  },
  pillRed: {
    backgroundColor: DANGER_DIM,
    borderColor: DANGER_BORDER,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // SECTION HEADER
  sectionHeader: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
  },

  // LIST
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  // CARD
  card: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
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
  cardEmoji: {
    fontSize: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardService: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  cardDate: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  badgeGreen: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT_BORDER,
  },
  badgeRed: {
    backgroundColor: DANGER_DIM,
    borderColor: DANGER_BORDER,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusTextGreen: {
    color: ACCENT,
  },
  statusTextRed: {
    color: DANGER,
  },
  chevron: {
    color: MUTED,
    fontSize: 20,
    lineHeight: 20,
  },
});