import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

// Dummy props for testing
const dummyBooking = {
  bookingId: 'B12345',
  serviceName: 'Plumbing',
  providerName: 'John Doe',
  date: '2026-02-03',
  time: '10:30 AM',
  address: '123 Main Street, City',
  price: '₹500',
  status: 'Completed',
};

const BookingDetail: React.FC = () => {
  const { bookingId, serviceName, providerName, date, time, address, price, status } = dummyBooking;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Booking ID:</Text>
        <Text style={styles.value}>{bookingId}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Service:</Text>
        <Text style={styles.value}>{serviceName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Provider:</Text>
        <Text style={styles.value}>{providerName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Date & Time:</Text>
        <Text style={styles.value}>{date} at {time}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>{price}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, status === 'Completed' ? styles.completed : styles.pending]}>
          {status}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  detailRow: { flexDirection: 'row', marginBottom: 12 },
  label: { fontWeight: '600', width: 120 },
  value: { flex: 1, color: '#334155' },
  completed: { color: 'green', fontWeight: '700' },
  pending: { color: 'orange', fontWeight: '700' },
});

export default BookingDetail;
