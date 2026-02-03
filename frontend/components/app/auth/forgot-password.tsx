// 1️⃣ Imports
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import InputField from '../../components/ui/InputField';

// 2️⃣ Component
export default function ForgotPasswordScreen() {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendLink = () => {
    if (!contact) {
      setError('Email or phone number is required');
      return;
    }

    setError('');
    setMessage('Reset link sent');

    setTimeout(() => {
      router.push('/auth/reset-password');
    }, 1000);
  };

  return (
     
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Forgot Password</Text>

      <InputField
        placeholder="Email or Phone"
        value={contact}
        onChangeText={setContact}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.success}>{message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSendLink}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

// 3️⃣ Styles (MUST be in same file)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0A2540',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A2540',
    marginBottom: 6,
  },
  desc: {
    color: '#64748B',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0A2540',
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#38BDF8',
    marginTop: 18,
    fontWeight: '500',
  },
  error: {
    color: '#DC2626',
    marginBottom: 8,
  },
  success: {
    color: '#16A34A',
    marginBottom: 8,
  },
});
