import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InputField from '../../src/components/ui/InputField';
import PrimaryButton from '../../src/components/ui/PrimaryButton';

export default function AdminProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // Logic to save admin profile
    console.log('Saving admin profile');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>
      
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
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <PrimaryButton
        title="Save Changes"
        onPress={handleSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
});
