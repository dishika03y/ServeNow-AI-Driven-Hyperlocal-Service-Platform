// app/worker/schedule.tsx
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars'; // Removed DateObject
import axios from 'axios';

type ScheduleDay = {
  date: string; // YYYY-MM-DD
  available: boolean;
};

// Replace with your backend URL
const BASE_URL = 'https://your-backend.com/api';

export default function Schedule() {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/workers/schedule`);
      const schedule: ScheduleDay[] = res.data || [];

      const marks: { [key: string]: any } = {};
      schedule.forEach((day) => {
        marks[day.date] = {
          selected: day.available,
          marked: day.available,
          selectedColor: day.available ? '#3B82F6' : undefined,
        };
      });
      setMarkedDates(marks);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 10, color: '#334155' }}>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Schedule</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => Alert.alert('Selected day', day.dateString)} // day is plain object
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
});