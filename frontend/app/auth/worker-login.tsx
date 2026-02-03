import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import InputField from '../../components/ui/InputField';

export default function WorkerLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!phone || !password) {
      setError('All fields are required');
      return;
    }

    setError('');

    // ✅ After successful worker login
    router.replace('/worker/dashboard');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>ServeNow</Text>
        <Text style={styles.subtitle}>Worker Login</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.desc}>Login to manage your jobs</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/worker-signup')}
        >
          <Text style={styles.link}>
            New worker? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🎨 Styles */

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
});
