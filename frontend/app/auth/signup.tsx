import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import InputField from '../../components/ui/InputField';

const BASE_URL = "http://10.188.35.21:8000";

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      setError('');

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          phone: phone,
          pincode: pincode,
          city: city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Signup failed');
        return;
      }

      console.log("Signup Success:", data);

      router.replace('/auth/login');

    } catch (err) {
      console.log(err);
      setError('Network error. Check backend.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>ServeNow</Text>
        <Text style={styles.subtitle}>AI Hyperlocal Services platform</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.desc}>Sign up to get started</Text>

        <InputField
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <InputField
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
        />

        <InputField
          placeholder="Pincode"
          value={pincode}
          onChangeText={setPincode}
        />

        <InputField
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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