  import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
  } from 'react-native';
  import { router } from 'expo-router';
  import React, { useState } from 'react';
  import { apiRequest } from '../../src/api/api';

  const NAVY        = '#0B2239';
  const NAVY_MID    = '#163552';
  const ACCENT      = '#00D68F';
  const ACCENT_DIM  = 'rgba(0,214,143,0.12)';
  const ACCENT_BDR  = 'rgba(0,214,143,0.25)';
  const WARM        = '#FF8C42';
  const WARM_DIM    = 'rgba(255,140,66,0.10)';
  const WARM_BDR    = 'rgba(255,140,66,0.22)';
  const SURFACE     = 'rgba(255,255,255,0.04)';
  const SURFACE_MID = 'rgba(255,255,255,0.07)';
  const BORDER      = 'rgba(255,255,255,0.08)';
  const TEXT        = '#EEF4FA';
  const MUTED       = 'rgba(200,220,235,0.55)';

  const SERVICES = [
    { label: 'Electrician',      emoji: '⚡' },
    { label: 'Plumber',          emoji: '🔧' },
    { label: 'AC Repair',        emoji: '❄️' },
    { label: 'Cleaning',         emoji: '🧹' },
    { label: 'Carpenter',        emoji: '🪚' },
    { label: 'Appliance Repair', emoji: '🔌' },
    { label: 'Painter',          emoji: '🖌️' },
    { label: 'Gardening',        emoji: '🌿' },
    { label: 'Pest Control',     emoji: '🛡️' },
    { label: 'Laundry',          emoji: '👕' },
    { label: 'Home Security',    emoji: '🔒' },
    { label: 'Moving/Transport', emoji: '🚚' },
  ];

  const EXPERIENCE_OPTIONS = ['< 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'];
  const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Both', 'Flexible'];
  const CITIES = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Mumbai', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'];

  export default function BecomeWorkerForm() {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [experience, setExperience]             = useState('');
    const [availability, setAvailability]         = useState('');
    const [city, setCity]                         = useState('');
    const [bio, setBio]                           = useState('');
    const [hourlyRate, setHourlyRate]             = useState('');
    const [phone, setPhone]                       = useState('');

    const toggleService = (label: string) => {
      setSelectedServices(prev =>
        prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
      );
    };

    // Map experience string to number
    const mapExperienceToNumber = (exp: string) => {
      if (exp.includes('<')) return 1;
      if (exp.includes('1–2')) return 2;
      if (exp.includes('3–5')) return 4;
      if (exp.includes('6–10')) return 8;
      if (exp.includes('10+')) return 10;
      return 1;
    };

    const handleSubmit = async () => {
      if (!isReady) {
        return Alert.alert('Incomplete form', 'Please fill all required fields before submitting.');
      }

      if (selectedServices.length === 0) return Alert.alert('Missing Info', 'Select at least one service.');
      if (!experience) return Alert.alert('Missing Info', 'Select your experience.');
      if (!city) return Alert.alert('Missing Info', 'Select your city.');
      if (!phone.trim()) return Alert.alert('Missing Info', 'Enter your phone number.');

      const payload = {
        serviceCategory: selectedServices[0],
        subCategories: selectedServices,
        experienceYears: mapExperienceToNumber(experience),
        baseRate: Number(hourlyRate) || 0,
        serviceRadius: 5,
        latitude: 23.2599,
        longitude: 77.4126,
        city,
        pincode: '462001',
        shortBio: bio,
        emergencyContact: { name: 'Self', phone },
        bankDetails: { accountNumber: '0000000000', ifscCode: 'TEST0000', upiId: 'test@upi' },
      };

      try {
        const res = await apiRequest('/workers/apply', 'POST', payload);
        console.log('Backend response:', res);

        Alert.alert(
          'Profile Submitted! 🎉',
          'Your worker profile is under review.',
          [{ text: 'Go to Dashboard', onPress: () => router.push('/worker/verification') }]
        );
      } catch (error: any) {
        Alert.alert('Error ❌', error.message || 'Network/Backend error');
      }
    };

    const isReady = selectedServices.length > 0 && experience && city && phone.trim().length >= 10;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.appLabel}>WorkerOS</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🛠️</Text>
          <Text style={styles.heroTitle}>Become a Worker</Text>
          <Text style={styles.heroSub}>Fill details below and start earning</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SERVICES YOU OFFER</Text>
          <Text style={styles.sectionNote}>Select all that apply</Text>
        </View>
        <View style={styles.servicesGrid}>
          {SERVICES.map(s => {
            const active = selectedServices.includes(s.label);
            return (
              <TouchableOpacity
                key={s.label}
                style={[styles.serviceChip, active && styles.serviceChipActive]}
                onPress={() => toggleService(s.label)}
              >
                <Text style={styles.serviceEmoji}>{s.emoji}</Text>
                <Text style={[styles.serviceLabel, active && styles.serviceLabelActive]}>{s.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>YEARS OF EXPERIENCE</Text>
        </View>
        <View style={styles.optionRow}>
          {EXPERIENCE_OPTIONS.map(opt => {
            const active = experience === opt;
            return (
              <TouchableOpacity key={opt} style={[styles.optionPill, active && styles.optionPillActive]} onPress={() => setExperience(opt)}>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AVAILABILITY</Text>
        </View>
        <View style={styles.optionRow}>
          {AVAILABILITY_OPTIONS.map(opt => {
            const active = availability === opt;
            return (
              <TouchableOpacity key={opt} style={[styles.optionPill, active && styles.optionPillActive]} onPress={() => setAvailability(opt)}>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>YOUR CITY</Text>
        </View>
        <View style={styles.cityGrid}>
          {CITIES.map(c => {
            const active = city === c;
            return (
              <TouchableOpacity key={c} style={[styles.cityChip, active && styles.cityChipActive]} onPress={() => setCity(c)}>
                <Text style={[styles.cityText, active && styles.cityTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CONTACT & RATE</Text>
        </View>
        <View style={styles.inputsCard}>
          <InputField label="Phone Number" placeholder="98765 43210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" emoji="📞" />
          <Divider />
          <InputField label="Hourly Rate (₹)" placeholder="350" value={hourlyRate} onChangeText={setHourlyRate} keyboardType="numeric" emoji="💰" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SHORT BIO</Text>
        </View>
        <View style={styles.bioCard}>
          <TextInput style={styles.bioInput} placeholder="Your skills & experience..." placeholderTextColor={MUTED} value={bio} onChangeText={setBio} multiline numberOfLines={4} />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !isReady && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={isReady ? 0.85 : 1}
          disabled={!isReady}
        >
          <Text style={[styles.submitText, !isReady && { color: MUTED }]}>Submit Profile →</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  function InputField({ label, placeholder, value, onChangeText, keyboardType, emoji }: any) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
        <Text style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: MUTED, fontSize: 10, fontWeight: '700', marginBottom: 4 }}>{label}</Text>
          <TextInput style={{ color: 'white', fontSize: 14, fontWeight: '500', padding: 0 }} placeholder={placeholder} placeholderTextColor={MUTED} value={value} onChangeText={onChangeText} keyboardType={keyboardType ?? 'default'} />
        </View>
      </View>
    );
  }
  function Divider() { return <View style={{ height: 1, backgroundColor: BORDER }} />; }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: NAVY },
    scrollContent: { paddingBottom: 52 },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 52, paddingBottom: 10 },
    backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: SURFACE_MID, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
    backIcon: { color: TEXT, fontSize: 22, lineHeight: 24, fontWeight: '300' },
    appLabel: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase' },
    hero: { alignItems: 'center', paddingHorizontal: 22, paddingTop: 16, paddingBottom: 20, gap: 8 },
    heroEmoji: { fontSize: 40 },
    heroTitle: { color: TEXT, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
    heroSub: { color: MUTED, fontSize: 13, textAlign: 'center', lineHeight: 19 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingTop: 22, paddingBottom: 12 },
    sectionTitle: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1.8 },
    sectionNote: { color: ACCENT, fontSize: 11 },
    servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 10 },
    serviceChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12 },
    serviceChipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BDR },
    serviceEmoji: { fontSize: 14 },
    serviceLabel: { color: MUTED, fontSize: 13, fontWeight: '500' },
    serviceLabelActive: { color: ACCENT, fontWeight: '700' },
    optionRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 10 },
    optionPill: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
    optionPillActive: { backgroundColor: WARM_DIM, borderColor: WARM_BDR },
    optionText: { color: MUTED, fontSize: 13, fontWeight: '500' },
    optionTextActive: { color: WARM, fontWeight: '700' },
    cityGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 10 },
    cityChip: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
    cityChipActive: { backgroundColor: 'rgba(82,180,255,0.12)', borderColor: 'rgba(82,180,255,0.30)' },
    cityText: { color: MUTED, fontSize: 13, fontWeight: '500' },
    cityTextActive: { color: '#52B4FF', fontWeight: '700' },
    inputsCard: { marginHorizontal: 22, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, paddingHorizontal: 16 },
    bioCard: { marginHorizontal: 22, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16 },
    bioInput: { color: TEXT, fontSize: 14, lineHeight: 22, minHeight: 90 },
    submitBtn: { marginHorizontal: 22, marginTop: 24, backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 17, alignItems: 'center' },
    submitBtnDisabled: { backgroundColor: SURFACE_MID, borderWidth: 1, borderColor: BORDER },
    submitText: { color: NAVY, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  });
  
 