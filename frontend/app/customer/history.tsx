import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

interface Booking {
  id: string;
  service: string;
  date: string;
  status: string;
}

const historyData: Booking[] = [
  { id: '1', service: 'Home Cleaning', date: '02 Feb 2026', status: 'Completed' },
  { id: '2', service: 'Plumbing', date: '25 Jan 2026', status: 'Cancelled' },
  { id: '3', service: 'Electrician', date: '15 Jan 2026', status: 'Completed' },
];

const HistoryScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
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
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={[styles.status, item.status === 'Completed' ? styles.completed : styles.cancelled]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  item: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12 },
  service: { fontSize: 18, fontWeight: '600' },
  date: { fontSize: 14, color: '#64748B' },
  status: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  completed: { color: 'green' },
  cancelled: { color: 'red' },
});

export default HistoryScreen;
