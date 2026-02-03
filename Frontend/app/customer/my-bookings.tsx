import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

const BOOKINGS = [
  {
    id: '1',
    service: 'Plumbing Repair',
    date: '28 Jan 2026',
    time: '10:00 AM',
    status: 'Upcoming',
    price: '₹800',
  },
  {
    id: '2',
    service: 'House Cleaning',
    date: '20 Jan 2026',
    time: '2:00 PM',
    status: 'Completed',
    price: '₹1200',
  },
];

export default function MyBookings() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>
          Track your service requests
        </Text>
      </View>


      {BOOKINGS.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.service}>{booking.service}</Text>
            <Text
              style={[
                styles.status,
                booking.status === 'Upcoming'
                  ? styles.upcoming
                  : styles.completed,
              ]}
            >
              {booking.status}
            </Text>
          </View>

          <Text style={styles.text}>Date: {booking.date}</Text>
          <Text style={styles.text}>Time: {booking.time}</Text>
          <Text style={styles.price}>{booking.price}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push('/customer/booking-details')
            }
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
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
    color: '#475569',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  service: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcoming: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
  },
  completed: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  text: {
    fontSize: 14,
    color: '#334155',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
