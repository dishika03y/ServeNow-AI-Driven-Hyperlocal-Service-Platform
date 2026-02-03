// app/worker/schedule.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function Schedule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Schedule</Text>

      <Calendar
        // For simplicity, marking today as available
        markedDates={{
          '2026-02-03': { selected: true, marked: true, selectedColor: '#3B82F6' },
        }}
        onDayPress={(day) => console.log('Selected day', day)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
});
