import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

export default function BookingDetails() {
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Booking Details</Text>
        <Text style={styles.subtitle}>
          Complete service information
        </Text>
      </View>

      {/* SERVICE INFO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service</Text>
        <Text style={styles.value}>Plumbing Repair</Text>
      </View>

      {/* WORKER INFO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Provider</Text>
        <Text style={styles.value}>Ramesh Kumar</Text>
        <Text style={styles.small}>Experience: 6 Years</Text>
        <Text style={styles.small}>Rating: ★ 4.6</Text>
      </View>

      {/* SCHEDULE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <Text style={styles.value}>28 Jan 2026</Text>
        <Text style={styles.small}>10:00 AM</Text>
      </View>

      {/* ADDRESS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Address</Text>
        <Text style={styles.value}>
          12, MG Road, Bengaluru, Karnataka
        </Text>
      </View>

      {/* PAYMENT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.row}>
          <Text style={styles.small}>Service Charge</Text>
          <Text style={styles.amount}>₹800</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.small}>Status</Text>
          <Text style={styles.paid}>Paid</Text>
        </View>
      </View>

      {/* STATUS */}
      <View style={[styles.card, styles.statusCard]}>
        <Text style={styles.status}>Upcoming</Text>
      </View>

      {/* ACTION */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back to My Bookings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  small: {
    fontSize: 14,
    color: '#334155',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16A34A',
  },
  paid: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  statusCard: {
    alignItems: 'center',
  },
  status: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
