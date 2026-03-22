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
const DANGER      = '#FF4D4D';
const DANGER_DIM  = 'rgba(255,77,77,0.10)';
const DANGER_BDR  = 'rgba(255,77,77,0.22)';

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
  const [idProof, setIdProof]                   = useState('');

  const toggleService = (label: string) => {
    setSelectedServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSubmit = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Missing Info', 'Please select at least one service you offer.');
      return;
    }
    if (!experience) {
      Alert.alert('Missing Info', 'Please select your years of experience.');
      return;
    }
    if (!city) {
      Alert.alert('Missing Info', 'Please select your city.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Missing Info', 'Please enter your phone number.');
      return;
    }

    Alert.alert(
      'Profile Submitted! 🎉',
      'Your worker profile is under review. We\'ll notify you within 24 hours.',
      [{ text: 'Go to Dashboard', onPress: () => router.push('/worker/verification') }]
    );
  };

  const isReady =
    selectedServices.length > 0 && experience && city && phone.trim().length >= 10;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.appLabel}>WorkerOS</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🛠️</Text>
        <Text style={styles.heroTitle}>Become a Worker</Text>
        <Text style={styles.heroSub}>
          Fill in the details below and start earning with WorkerOS
        </Text>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressRow}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={[styles.progressDot, step === 1 && styles.progressDotActive]} />
        ))}
        <Text style={styles.progressText}>Step 1 of 3 — Basic Info</Text>
      </View>

      {/* ── Section: Services ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SERVICES YOU OFFER</Text>
        <Text style={styles.sectionNote}>Select all that apply</Text>
      </View>

      <View style={styles.servicesGrid}>
        {SERVICES.map((s) => {
          const active = selectedServices.includes(s.label);
          return (
            <TouchableOpacity
              key={s.label}
              style={[styles.serviceChip, active && styles.serviceChipActive]}
              onPress={() => toggleService(s.label)}
              activeOpacity={0.75}
            >
              <Text style={styles.serviceEmoji}>{s.emoji}</Text>
              <Text style={[styles.serviceLabel, active && styles.serviceLabelActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Section: Experience ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>YEARS OF EXPERIENCE</Text>
      </View>

      <View style={styles.optionRow}>
        {EXPERIENCE_OPTIONS.map((opt) => {
          const active = experience === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionPill, active && styles.optionPillActive]}
              onPress={() => setExperience(opt)}
              activeOpacity={0.75}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Section: Availability ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AVAILABILITY</Text>
      </View>

      <View style={styles.optionRow}>
        {AVAILABILITY_OPTIONS.map((opt) => {
          const active = availability === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionPill, active && styles.optionPillActive]}
              onPress={() => setAvailability(opt)}
              activeOpacity={0.75}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Section: Location ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>YOUR CITY</Text>
      </View>

      <View style={styles.cityGrid}>
        {CITIES.map((c) => {
          const active = city === c;
          return (
            <TouchableOpacity
              key={c}
              style={[styles.cityChip, active && styles.cityChipActive]}
              onPress={() => setCity(c)}
              activeOpacity={0.75}
            >
              <Text style={[styles.cityText, active && styles.cityTextActive]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Section: Text Inputs ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CONTACT & RATE</Text>
      </View>

      <View style={styles.inputsCard}>
        <InputField
          label="Phone Number"
          placeholder="e.g. 98765 43210"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          emoji="📞"
        />
        <Divider />
        <InputField
          label="Hourly Rate (₹)"
          placeholder="e.g. 350"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          keyboardType="numeric"
          emoji="💰"
        />
        <Divider />
        <InputField
          label="Govt. ID Proof"
          placeholder="Aadhaar / PAN / Voter ID number"
          value={idProof}
          onChangeText={setIdProof}
          emoji="🪪"
        />
      </View>

      {/* ── Section: Bio ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SHORT BIO</Text>
        <Text style={styles.sectionNote}>Optional</Text>
      </View>

      <View style={styles.bioCard}>
        <TextInput
          style={styles.bioInput}
          placeholder="Tell customers about your skills, work style, and experience…"
          placeholderTextColor={MUTED}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Text style={styles.bioCount}>{bio.length} / 200</Text>
      </View>

      {/* ── Selected summary ── */}
      {selectedServices.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>YOUR PROFILE SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Services</Text>
            <Text style={styles.summaryVal}>{selectedServices.join(', ')}</Text>
          </View>
          {experience !== '' && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Experience</Text>
              <Text style={styles.summaryVal}>{experience}</Text>
            </View>
          )}
          {city !== '' && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Location</Text>
              <Text style={styles.summaryVal}>{city}</Text>
            </View>
          )}
          {hourlyRate !== '' && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Rate</Text>
              <Text style={styles.summaryVal}>₹{hourlyRate}/hr</Text>
            </View>
          )}
        </View>
      )}

      {/* ── Submit ── */}
      <TouchableOpacity
        style={[styles.submitBtn, !isReady && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        activeOpacity={isReady ? 0.85 : 1}
      >
        <Text style={[styles.submitText, !isReady && styles.submitTextDisabled]}>
          Submit Profile →
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By submitting, you agree to WorkerOS's Terms of Service and background verification process.
      </Text>
    </ScrollView>
  );
}

/* ── Sub-components ── */
function InputField({
  label, placeholder, value, onChangeText, keyboardType, emoji,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  emoji: string;
}) {
  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.emoji}>{emoji}</Text>
      <View style={inputStyles.col}>
        <Text style={inputStyles.label}>{label}</Text>
        <TextInput
          style={inputStyles.input}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ?? 'default'}
        />
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: BORDER }} />;
}

const inputStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  emoji: { fontSize: 18, width: 24, textAlign: 'center' },
  col: { flex: 1 },
  label: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  input: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
});

/* ── Styles ── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 52 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: TEXT, fontSize: 22, lineHeight: 24, fontWeight: '300' },
  appLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  hero: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 8,
  },
  heroEmoji: { fontSize: 40 },
  heroTitle: {
    color: TEXT,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroSub: {
    color: MUTED,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    marginBottom: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
  },
  progressDotActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  progressText: {
    color: MUTED,
    fontSize: 11,
    marginLeft: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  sectionNote: { color: ACCENT, fontSize: 11 },

  // SERVICES GRID
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 10,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  serviceChipActive: {
    backgroundColor: ACCENT_DIM,
    borderColor: ACCENT_BDR,
  },
  serviceEmoji: { fontSize: 14 },
  serviceLabel: { color: MUTED, fontSize: 13, fontWeight: '500' },
  serviceLabelActive: { color: ACCENT, fontWeight: '700' },

  // OPTION PILLS
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 10,
  },
  optionPill: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  optionPillActive: {
    backgroundColor: WARM_DIM,
    borderColor: WARM_BDR,
  },
  optionText: { color: MUTED, fontSize: 13, fontWeight: '500' },
  optionTextActive: { color: WARM, fontWeight: '700' },

  // CITY GRID
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 10,
  },
  cityChip: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cityChipActive: {
    backgroundColor: 'rgba(82,180,255,0.12)',
    borderColor: 'rgba(82,180,255,0.30)',
  },
  cityText: { color: MUTED, fontSize: 13, fontWeight: '500' },
  cityTextActive: { color: '#52B4FF', fontWeight: '700' },

  // INPUTS CARD
  inputsCard: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  // BIO
  bioCard: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
  },
  bioInput: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 90,
  },
  bioCount: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 8,
  },

  // SUMMARY
  summaryCard: {
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  summaryLabel: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryKey: { color: MUTED, fontSize: 12 },
  summaryVal: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // SUBMIT
  submitBtn: {
    marginHorizontal: 22,
    marginTop: 24,
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: SURFACE_MID,
    borderWidth: 1,
    borderColor: BORDER,
  },
  submitText: {
    color: NAVY,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  submitTextDisabled: { color: MUTED },

  disclaimer: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 14,
    lineHeight: 17,
  },
});