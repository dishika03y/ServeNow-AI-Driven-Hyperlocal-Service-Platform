import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function BookingScreen() {
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleProceed = () => {
    // Later you can validate or send data to backend
    router.push('/customer/payment');
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Your Booking</Text>
        <Text style={styles.subtitle}>
          Please provide details to schedule the service
        </Text>
      </View>

      {/* ADDRESS */}
      <View style={styles.card}>
        <Text style={styles.label}>Service Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full address"
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      {/* DATE */}
      <View style={styles.card}>
        <Text style={styles.label}>Preferred Date</Text>
        <TextInput
          style={styles.input}
          placeholder="DD / MM / YYYY"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {/* TIME */}
      <View style={styles.card}>
        <Text style={styles.label}>Preferred Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg: 10:00 AM – 12:00 PM"
          value={time}
          onChangeText={setTime}
        />
      </View>

      {/* SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.label}>Booking Summary</Text>
        <Text style={styles.summaryText}>Service: Selected Service</Text>
        <Text style={styles.summaryText}>Estimated Cost: ₹500 – ₹1200</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
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
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0F172A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  summaryText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
