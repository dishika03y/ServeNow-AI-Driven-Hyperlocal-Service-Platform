import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'booking' | 'payment' | 'review' | 'alert' | 'system';

type Notification = {
  id: string;
  type: NotifType;
  message: string;
  time: string;
  unread: boolean;
};

// ─── Mock Data (replace with API call) ───────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'booking',
    message: 'New booking request from Rahul Sharma for Home Cleaning.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    type: 'payment',
    message: 'Payment of ₹850 received for Plumbing service on Apr 30.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: '3',
    type: 'review',
    message: 'Priya Mehta left you a 5-star review! "Excellent work, very punctual."',
    time: '3 hr ago',
    unread: false,
  },
  {
    id: '4',
    type: 'alert',
    message: 'Your service area has been updated to include Vijay Nagar.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '5',
    type: 'booking',
    message: 'Booking #2041 confirmed — AC Repair at 11:00 AM tomorrow.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '6',
    type: 'system',
    message: 'ServeNow app updated to v2.4. Tap to see what\'s new.',
    time: '2 days ago',
    unread: false,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<NotifType, { icon: string; color: string; bg: string }> = {
  booking: { icon: '📋', color: '#2d4a6e', bg: '#e8eef5' },
  payment: { icon: '💰', color: '#1a7a4a', bg: '#e6f5ed' },
  review:  { icon: '⭐', color: '#b07a10', bg: '#fdf4e0' },
  alert:   { icon: '📍', color: '#7c3aed', bg: '#f0ebff' },
  system:  { icon: '🔔', color: '#64748b', bg: '#f1f5f9' },
};

const FILTERS = ['All', 'Bookings', 'Payments', 'Reviews', 'Alerts'] as const;
type Filter = typeof FILTERS[number];

const FILTER_TYPE_MAP: Record<Filter, NotifType | null> = {
  All:      null,
  Bookings: 'booking',
  Payments: 'payment',
  Reviews:  'review',
  Alerts:   'alert',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [loading] = useState(false); // set true while fetching from API

  const unreadCount = notifications.filter(n => n.unread).length;

  const filtered =
    activeFilter === 'All'
      ? notifications
      : notifications.filter(n => n.type === FILTER_TYPE_MAP[activeFilter]);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const markOneRead = (id: string) =>
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );

  // ── Loading State ──
  if (loading) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color="#2d4a6e" />
        <Text style={styles.loadingText}>Loading notifications…</Text>
      </SafeAreaView>
    );
  }

  // ── Main Render ──
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE9E1" />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>✦</Text>
          </View>
          <Text style={styles.brandName}>ServeNow</Text>
        </View>
        <Text style={styles.navTag}>HYPERLOCAL AI</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ── Page Header ── */}
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.heading}>
                  Notif<Text style={styles.headingItalic}>ications.</Text>
                </Text>
                {unreadCount > 0 && (
                  <Text style={styles.unreadLabel}>
                    {unreadCount} unread update{unreadCount > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllRead}>
                  <Text style={styles.markAllBtn}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Filter Chips ── */}
            <FlatList
              horizontal
              data={FILTERS}
              keyExtractor={f => f}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              renderItem={({ item: f }) => {
                const isActive = activeFilter === f;
                return (
                  <TouchableOpacity
                    onPress={() => setActiveFilter(f)}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        }
        renderItem={({ item }) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => markOneRead(item.id)}
              style={[styles.card, item.unread && styles.cardUnread]}
            >
              {item.unread && <View style={styles.unreadDot} />}
              <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
                <Text style={styles.iconText}>{cfg.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardMessage, item.unread && styles.cardMessageUnread]}>
                  {item.message}
                </Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>No notifications in this category yet.</Text>
          </View>
        }
        ListFooterComponent={
          /* ── Trust Bar ── */
          <View style={styles.trustBar}>
            <Text style={styles.trustItem}>★ Verified providers</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustItem}>🔒 SSL secured</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustItem}>✓ 1M+ users</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EDE9E1',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Georgia',
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1a2f4e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 18,
    color: '#fff',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2f4e',
    fontFamily: 'Georgia',
    marginLeft: 8,
  },
  navTag: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#8a9ab0',
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 4,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a2f4e',
    fontFamily: 'Georgia',
  },
  headingItalic: {
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#7BAFD4',
    fontFamily: 'Georgia',
  },
  unreadLabel: {
    fontSize: 12,
    color: '#8a9ab0',
    marginTop: 2,
  },
  markAllBtn: {
    fontSize: 13,
    color: '#7BAFD4',
    fontWeight: '600',
  },

  // Filters
  filterRow: {
    gap: 8,
    marginBottom: 20,
    paddingRight: 4,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(200,210,220,0.6)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#1a2f4e',
    borderColor: '#1a2f4e',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#1a2f4e',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: 'relative',
  },
  cardUnread: {
    borderColor: 'rgba(123, 175, 212, 0.35)',
    backgroundColor: '#FDFEFF',
  },
  unreadDot: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7BAFD4',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  cardMessage: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 21,
    marginBottom: 6,
    fontWeight: '400',
  },
  cardMessageUnread: {
    fontWeight: '700',
    color: '#1a2f4e',
  },
  cardTime: {
    fontSize: 11,
    color: '#94a3b8',
    letterSpacing: 0.2,
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 21,
  },

  // Trust Bar
  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  trustItem: {
    fontSize: 11,
    color: '#8a9ab0',
  },
  trustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#b0bec8',
    marginHorizontal: 10,
  },
});