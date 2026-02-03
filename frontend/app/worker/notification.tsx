// app/worker/notifications.tsx
import { View, Text, StyleSheet, FlatList } from 'react-native';

const dummyNotifications = [
  { id: '1', message: 'New booking received from John Doe' },
  { id: '2', message: 'Booking #123 has been canceled' },
  { id: '3', message: 'Your payout is ready' },
];

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  notificationCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  message: { fontSize: 16, color: '#334155' },
});
