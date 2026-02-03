import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function WorkerProfile() {
  const [name, setName] = useState('Ramesh Kumar');
  const [service, setService] = useState('Electrician');
  const [phone, setPhone] = useState('9876543210');
  const [location, setLocation] = useState('Delhi');

  const handleSave = () => {
    // TODO: Save profile changes to backend
    alert('Profile updated successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Service</Text>
      <TextInput
        style={styles.input}
        value={service}
        onChangeText={setService}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace('/auth/login')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A2540',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    color: '#0A2540',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#0A2540',
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
