import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';

const PaymentScreen: React.FC = () => {
  const handlePayment = () => {
    Alert.alert('Payment Successful', 'Your payment has been processed.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.text}>Amount to Pay: ₹500</Text>
      <Text style={styles.text}>Service: Home Cleaning</Text>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 10, color: '#334155' },
  button: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});

export default PaymentScreen;
