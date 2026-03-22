import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';

const NAVY        = '#0B2239';
const NAVY_MID    = '#163552';
const NAVY_LIGHT  = '#1E4A6E';
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

const PAYMENT_METHODS = [
  { id: 'upi',  label: 'UPI',          sub: 'Pay via any UPI app', emoji: '📲' },
  { id: 'card', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay', emoji: '💳' },
  { id: 'cash', label: 'Cash on Service', sub: 'Pay directly to provider', emoji: '💵' },
];

const PaymentScreen: React.FC = () => {
  const [selected, setSelected] = useState<string>('upi');

  const handlePayment = () => {
    Alert.alert(
      'Payment Successful',
      'Your payment of ₹500 has been processed.',
      [{ text: 'Done', style: 'default' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appLabel}>WorkerOS</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Payment</Text>
        <Text style={styles.heroSub}>Complete your booking securely</Text>
      </View>

      {/* Order Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionLabel}>ORDER SUMMARY</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryIconWrap}>
            <Text style={styles.summaryEmoji}>🧹</Text>
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryService}>Home Cleaning</Text>
            <Text style={styles.summaryMeta}>John Doe  ·  03 Feb 2026</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BDR }]}>
            <Text style={[styles.statusPillText, { color: ACCENT }]}>Confirmed</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceBreakdown}>
          <PriceRow label="Service charge" value="₹450" />
          <PriceRow label="Platform fee" value="₹50" />
          <View style={styles.divider} />
          <PriceRow label="Total payable" value="₹500" total />
        </View>
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>

      {PAYMENT_METHODS.map((method) => {
        const isActive = selected === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, isActive && styles.methodCardActive]}
            onPress={() => setSelected(method.id)}
            activeOpacity={0.75}
          >
            <View style={[styles.methodIcon, isActive && styles.methodIconActive]}>
              <Text style={styles.methodEmoji}>{method.emoji}</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, isActive && styles.methodLabelActive]}>
                {method.label}
              </Text>
              <Text style={styles.methodSub}>{method.sub}</Text>
            </View>
            <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
              {isActive && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Secure note */}
      <View style={styles.secureRow}>
        <Text style={styles.secureIcon}>🔒</Text>
        <Text style={styles.secureText}>Payments are encrypted and secured</Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payBtn}
        onPress={handlePayment}
        activeOpacity={0.85}
      >
        <Text style={styles.payBtnText}>Pay ₹500</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

function PriceRow({
  label, value, total,
}: {
  label: string; value: string; total?: boolean;
}) {
  return (
    <View style={priceStyles.row}>
      <Text style={[priceStyles.label, total && priceStyles.totalLabel]}>{label}</Text>
      <Text style={[priceStyles.value, total && priceStyles.totalValue]}>{value}</Text>
    </View>
  );
}

const priceStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    color: MUTED,
    fontSize: 13,
  },
  value: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '500',
  },
  totalLabel: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 15,
  },
  totalValue: {
    color: ACCENT,
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: -0.3,
  },
});

export default PaymentScreen;

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
    paddingBottom: 20,
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

  // SECTION LABEL
  sectionLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
    paddingHorizontal: 22,
    marginBottom: 12,
    marginTop: 22,
  },

  // ORDER SUMMARY CARD
  card: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 18,
  },
  cardSectionLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryEmoji: { fontSize: 20 },
  summaryInfo: { flex: 1 },
  summaryService: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
  },
  summaryMeta: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  statusPill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 12,
  },
  priceBreakdown: {
    gap: 2,
  },

  // PAYMENT METHOD CARDS
  methodCard: {
    marginHorizontal: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
  },
  methodCardActive: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT_BDR,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconActive: {
    backgroundColor: NAVY_MID,
    borderColor: ACCENT_BDR,
  },
  methodEmoji: { fontSize: 20 },
  methodInfo: { flex: 1 },
  methodLabel: {
    color: MUTED,
    fontSize: 14,
    fontWeight: '600',
  },
  methodLabelActive: {
    color: TEXT,
  },
  methodSub: {
    color: MUTED,
    fontSize: 11,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: MUTED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: ACCENT,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ACCENT,
  },

  // SECURE ROW
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 4,
  },
  secureIcon: { fontSize: 12 },
  secureText: {
    color: MUTED,
    fontSize: 12,
  },

  // PAY BUTTON
  payBtn: {
    marginHorizontal: 22,
    marginTop: 20,
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  payBtnText: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});