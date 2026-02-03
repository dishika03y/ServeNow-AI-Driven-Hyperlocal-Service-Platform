import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import InputField from '../../components/ui/InputField';

export default function WorkerSignup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!name || !phone || !password) {
      setError('All fields are required');
      return;
    }

    setError('');

    // ✅ After signup, navigate to verification page
    router.push('/auth/worker-verification');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Signup</Text>

      <InputField
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <InputField
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/worker-login')}>
        <Text style={styles.link}>Already a worker? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#E0F2FE' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20, color: '#0A2540', textAlign: 'center' },
  button: { backgroundColor: '#0A2540', padding: 16, borderRadius: 14, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', color: '#38BDF8', marginTop: 18, fontWeight: '500' },
  error: { color: '#DC2626', marginTop: 6, textAlign: 'center' },
});
