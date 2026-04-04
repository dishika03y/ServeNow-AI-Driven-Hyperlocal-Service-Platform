// app/worker/notifications.tsx
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Notification = {
  id: string;
  message: string;
};

// Replace with your backend URL
const BASE_URL = 'https://your-backend.com/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/workers/notifications`); // Add this endpoint in backend
      setNotifications(res.data || []);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00D68F" />
        <Text style={{ color: '#334155', marginTop: 10 }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#64748B', textAlign: 'center', marginTop: 20 }}>No notifications yet.</Text>}
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