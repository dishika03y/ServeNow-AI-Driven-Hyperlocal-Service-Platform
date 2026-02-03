import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function WorkerVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (otp.length !== 4) {
      setError('Enter a valid 4-digit OTP');
      return;
    }

    setError('');
    // ✅ After successful verification, navigate to worker dashboard
    router.replace('/worker/dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Verification</Text>
      <Text style={styles.subtitle}>Enter the 4-digit code sent to your phone</Text>

      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={4}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/worker-login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#E0F2FE' },
  title: { fontSize: 26, fontWeight: '700', color: '#0A2540', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#64748B', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#0A2540', padding: 14, borderRadius: 12, marginBottom: 10, textAlign: 'center', fontSize: 18 },
  button: { backgroundColor: '#0A2540', padding: 16, borderRadius: 14, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 16 },
  link: { textAlign: 'center', color: '#38BDF8', marginTop: 18, fontWeight: '500' },
  error: { color: '#DC2626', marginTop: 6, textAlign: 'center' },
});
