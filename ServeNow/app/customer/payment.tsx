import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

type PaymentMethod = 'UPI' | 'Card' | 'Cash';

export default function PaymentScreen() {
  const [method, setMethod] = useState<PaymentMethod>('UPI');

  const handlePayNow = () => {

    router.replace('/customer/my-bookings');
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Choose a payment method</Text>
      </View>


      <View style={styles.card}>
        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.amount}>₹ 800</Text>
        <Text style={styles.note}>Includes service & platform charges</Text>
      </View>


      <View style={styles.card}>
        <Text style={styles.label}>Payment Method</Text>

        <TouchableOpacity
          style={[
            styles.method,
            method === 'UPI' && styles.methodSelected,
          ]}
          onPress={() => setMethod('UPI')}
        >
          <Text style={styles.methodText}>UPI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.method,
            method === 'Card' && styles.methodSelected,
          ]}
          onPress={() => setMethod('Card')}
        >
          <Text style={styles.methodText}>Debit / Credit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.method,
            method === 'Cash' && styles.methodSelected,
          ]}
          onPress={() => setMethod('Cash')}
        >
          <Text style={styles.methodText}>Cash on Service</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
        <Text style={styles.payText}>Pay Now</Text>
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
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#16A34A',
  },
  note: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  method: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
  },
  methodSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  payButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  payText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

