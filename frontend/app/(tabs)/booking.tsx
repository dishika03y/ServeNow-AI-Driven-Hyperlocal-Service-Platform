import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const ACCENT      = '#00D68F';
const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
const WARM        = '#FF8C42';
const WARM_DIM    = 'rgba(255,140,66,0.10)';
const WARM_BDR    = 'rgba(255,140,66,0.25)';
const DANGER      = '#FF4D4D';
const DANGER_DIM  = 'rgba(255,77,77,0.10)';
const DANGER_BDR  = 'rgba(255,77,77,0.22)';
const SURFACE     = 'rgba(255,255,255,0.04)';
const SURFACE_MID = 'rgba(255,255,255,0.07)';
const BORDER      = 'rgba(255,255,255,0.08)';
const TEXT        = '#EEF4FA';
const MUTED       = 'rgba(200,220,235,0.55)';

const SERVICE_EMOJI: Record<string, string> = {
  'Plumbing':      '🔧',
  'Electrician':   '⚡',
  'Home Cleaning': '🧹',
  'AC Repair':     '❄️',
  'Carpenter':     '🪚',
  'Painter':       '🖌️',
};

const dummyBooking = {
  bookingId:    'B12345',
  serviceName:  'Plumbing',
  providerName: 'John Doe',
  date:         '2026-02-03',
  time:         '10:30 AM',
  address:      '123 Main Street, City',
  price:        '₹500',
  status:       'Completed',
};

const BookingDetail: React.FC = () => {
  const router = useRouter();
  const { bookingId, serviceName, providerName, date, time, address, price, status } = dummyBooking;

  const isCompleted = status === 'Completed';
  const isPending   = status === 'Pending';

  const statusColor = isCompleted ? ACCENT
    : isPending ? WARM
    : DANGER;
  const statusDim   = isCompleted ? ACCENT_DIM  : isPending ? WARM_DIM  : DANGER_DIM;
  const statusBdr   = isCompleted ? ACCENT_BDR  : isPending ? WARM_BDR  : DANGER_BDR;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
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

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <Text style={styles.heroEmoji}>
            {SERVICE_EMOJI[serviceName] ?? '🛠️'}
          </Text>
        </View>
        <Text style={styles.heroService}>{serviceName}</Text>
        <Text style={styles.heroProvider}>by {providerName}</Text>

        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusDim, borderColor: statusBdr }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      {/* Booking ID strip */}
      <View style={styles.idStrip}>
        <Text style={styles.idLabel}>BOOKING ID</Text>
        <Text style={styles.idValue}>{bookingId}</Text>
      </View>

      {/* Details Card */}
      <View style={styles.detailCard}>
        <DetailRow icon="📅" label="Date & Time" value={`${date}  ·  ${time}`} />
        <Divider />
        <DetailRow icon="📍" label="Address" value={address} />
        <Divider />
        <DetailRow icon="💰" label="Total Price" value={price} accent />
      </View>

      {/* Provider Card */}
      <View style={styles.detailCard}>
        <View style={styles.providerRow}>
          <View style={styles.providerAvatar}>
            <Text style={styles.providerInitials}>
              {providerName.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerLabel}>SERVICE PROVIDER</Text>
            <Text style={styles.providerName}>{providerName}</Text>
          </View>
          <TouchableOpacity style={styles.contactBtn} activeOpacity={0.75}>
            <Text style={styles.contactBtnText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA */}
      {!isCompleted && (
        <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
      {isCompleted && (
        <TouchableOpacity style={styles.reviewBtn} activeOpacity={0.8}>
          <Text style={styles.reviewBtnText}>Leave a Review</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// Sub-components
function DetailRow({
  icon, label, value, accent,
}: {
  icon: string; label: string; value: string; accent?: boolean;
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.icon}>{icon}</Text>
      <View style={rowStyles.body}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={[rowStyles.value, accent && rowStyles.accentValue]}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: BORDER, marginVertical: 4 }} />;
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  icon: { fontSize: 16, marginTop: 1 },
  body: { flex: 1 },
  label: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  value: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  accentValue: {
    color: ACCENT,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});

export default BookingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },
  scrollContent: {
    paddingBottom: 48,
  },

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
  backIcon: {
    color: TEXT,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '300',
  },
  appLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  // HERO CARD
  heroCard: {
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroEmoji: { fontSize: 28 },
  heroService: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroProvider: {
    color: MUTED,
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // BOOKING ID STRIP
  idStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 22,
    marginTop: 14,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  idLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  idValue: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // DETAIL CARD
  detailCard: {
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  // PROVIDER
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInitials: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
  providerInfo: { flex: 1 },
  providerLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 3,
  },
  providerName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
  },
  contactBtn: {
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  contactBtnText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '600',
  },

  // CTAs
  reviewBtn: {
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reviewBtnText: {
    color: NAVY,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: DANGER_DIM,
    borderWidth: 1,
    borderColor: DANGER_BDR,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: DANGER,
    fontSize: 15,
    fontWeight: '600',
  },
});