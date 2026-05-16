// app/worker/notifications.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────
type NotificationType = 'booking' | 'payment' | 'review' | 'alert' | 'system';

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  unread: boolean;
};

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = 'https://your-backend.com/api';

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  booking: { icon: 'clipboard-outline', color: '#2d4a6e', bg: '#e8eef5' },
  payment: { icon: 'cash-outline', color: '#1a7a4a', bg: '#e6f5ed' },
  review:  { icon: 'star-outline',  color: '#b07a10', bg: '#fdf4e0' },
  alert:   { icon: 'location-outline', color: '#7c3aed', bg: '#f0ebff' },
  system:  { icon: 'notifications-outline', color: '#64748b', bg: '#f1f5f9' },
};

const FILTERS = ['All', 'Bookings', 'Payments', 'Reviews', 'Alerts'] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_TYPE_MAP: Record<Filter, NotificationType | null> = {
  All: null,
  Bookings: 'booking',
  Payments: 'payment',
  Reviews: 'review',
  Alerts: 'alert',
};

// ─── Mock data (remove when backend is ready) ─────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'booking', message: 'New booking request from Rahul Sharma for Home Cleaning.', time: '2 min ago', unread: true },
  { id: '2', type: 'payment', message: 'Payment of ₹850 received for Plumbing service on Apr 30.', time: '1 hr ago', unread: true },
  { id: '3', type: 'review',  message: 'Priya Mehta left you a 5-star review! "Excellent work, very punctual."', time: '3 hr ago', unread: false },
  { id: '4', type: 'alert',   message: 'Your service area has been updated to include Vijay Nagar.', time: 'Yesterday', unread: false },
  { id: '5', type: 'booking', message: 'Booking #2041 confirmed — AC Repair at 11:00 AM tomorrow.', time: 'Yesterday', unread: false },
  { id: '6', type: 'system',  message: 'ServeNow app updated to v2.4. Tap to see what\'s new.', time: '2 days ago', unread: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/workers/notifications`);
      setNotifications(res.data || []);
    } catch {
      // Fallback to mock data during development
      setNotifications(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  // ── Derived ────────────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered =
    activeFilter === 'All'
      ? notifications
      : notifications.filter((n) => n.type === FILTER_TYPE_MAP[activeFilter]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2d4a6e" />
        <Text style={styles.loadingText}>Loading notifications…</Text>
      </View>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE9E1" />

      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Ionicons name="star" size={20} color="#fff" />
          </View>
          <Text style={styles.brandName}>ServeNow</Text>
        </View>
        <Text style={styles.navTag}>HYPERLOCAL AI</Text>
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>
            Notif<Text style={styles.headingItalic}>ications.</Text>
          </Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadSub}>
              {unreadCount} unread update{unreadCount > 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={styles.markAllBtn}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <FlatList
        horizontal
        data={FILTERS as unknown as Filter[]}
        keyExtractor={(f) => f}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item: f }) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Notification list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>No notifications in this category yet.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system;
          return (
            <TouchableOpacity
              style={[styles.card, item.unread && styles.cardUnread]}
              activeOpacity={0.85}
              onPress={() => markRead(item.id)}
            >
              {item.unread && <View style={styles.unreadDot} />}
              <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={22} color={cfg.color} />
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
      />

      {/* Trust bar */}
      <View style={styles.trustBar}>
        <Text style={styles.trustItem}>★ Verified</Text>
        <View style={styles.trustDot} />
        <Text style={styles.trustItem}>🔒 SSL secured</Text>
        <View style={styles.trustDot} />
        <Text style={styles.trustItem}>✓ 1M+ users</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EDE9E1' },
  container: { flex: 1, backgroundColor: '#EDE9E1' },
  centered:  { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#334155', fontSize: 14 },

  // Navbar
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 18 },
  brand:  { flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#1a2f4e', alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 20, fontWeight: '700', color: '#1a2f4e', marginLeft: 10 },
  navTag: { fontSize: 10, fontWeight: '600', letterSpacing: 2, color: '#8a9ab0' },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 16 },
  heading: { fontSize: 32, fontWeight: '800', color: '#1a2f4e' },
  headingItalic: { fontStyle: 'italic', fontWeight: '400', color: '#7BAFD4' },
  unreadSub: { fontSize: 13, color: '#8a9ab0', marginTop: 2 },
  markAllBtn: { fontSize: 13, color: '#7BAFD4', fontWeight: '600' },

  // Filters
  filterList: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(200,210,220,0.7)', backgroundColor: 'rgba(255,255,255,0.7)', marginRight: 8 },
  filterChipActive: { backgroundColor: '#1a2f4e', borderColor: '#1a2f4e' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  filterChipTextActive: { color: '#fff' },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, shadowColor: '#1a2f4e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, borderWidth: 1.5, borderColor: 'transparent', position: 'relative' },
  cardUnread: { borderColor: 'rgba(123,175,212,0.35)', backgroundColor: '#FDFEFF' },
  unreadDot: { position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7BAFD4' },
  iconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardContent: { flex: 1 },
  cardMessage: { fontSize: 14, color: '#334155', lineHeight: 21, marginBottom: 6, paddingRight: 16 },
  cardMessageUnread: { fontWeight: '700', color: '#1a2f4e' },
  cardTime: { fontSize: 11, color: '#94a3b8' },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:  { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  emptyText:  { fontSize: 14, color: '#94a3b8' },

  // Trust bar
  trustBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.55)', marginHorizontal: 32, marginBottom: 16, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 20 },
  trustItem: { fontSize: 11, color: '#8a9ab0' },
  trustDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: '#b0bec8', marginHorizontal: 6 },
});