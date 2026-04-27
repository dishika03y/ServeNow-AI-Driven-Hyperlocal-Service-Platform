import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { apiRequest } from '../../src/api/api';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

// ── Brand Tokens (identical to LoginScreen & SignupScreen) ─────
const C = {
  navy: '#081F5C',
  navyLight: '#081F5C14',
  navyMid: '#081F5C40',
  sky: '#BAD6EB',
  skyMid: '#BAD6EB60',
  cream: '#F7F2EB',
  creamDark: '#EDE7DC',
  creamBorder: '#E8E2D8',
  white: '#FFFFFF',
  error: '#991B1B',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
  success: '#166534',
};

// ── Data ───────────────────────────────────────────────────────
const SERVICES = [
  { label: 'Electrician',      icon: 'zap' },
  { label: 'Plumber',          icon: 'tool' },
  { label: 'AC Repair',        icon: 'wind' },
  { label: 'Cleaning',         icon: 'star' },
  { label: 'Carpenter',        icon: 'tool' },
  { label: 'Appliance Repair', icon: 'settings' },
  { label: 'Painter',          icon: 'edit' },
  { label: 'Gardening',        icon: 'leaf' },
  { label: 'Pest Control',     icon: 'shield' },
  { label: 'Laundry',          icon: 'layers' },
  { label: 'Home Security',    icon: 'lock' },
  { label: 'Moving/Transport', icon: 'truck' },
];

const EXPERIENCE_OPTIONS = ['< 1 yr', '1–2 yrs', '3–5 yrs', '6–10 yrs', '10+ yrs'];
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Both', 'Flexible'];
const CITIES = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Mumbai', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Ghaziabad'];

// ── Mini SVG icons ─────────────────────────────────────────────
function ServiceIcon({ name, color }: { name: string; color: string }) {
  const s = { stroke: color, strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const icons: Record<string, React.ReactNode> = {
    zap:      <Path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" {...s} />,
    tool:     <><Path d="M14.7 3.3a3.5 3.5 0 00-4.9 4.9L3 15l2 2 6.8-6.8a3.5 3.5 0 004.9-4.9l-2.3 2.3-1.4-1.4 2.3-2.3-1.4-1.6z" {...s} /></>,
    wind:     <><Path d="M17.7 7.7a2.5 2.5 0 11-4.8-1.4" {...s} /><Path d="M9.6 4.6a2 2 0 11-3.9 1" {...s} /><Path d="M2 12h18M2 16h11" {...s} /></>,
    star:     <Path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.7 5.8 21l1.2-6.8L2 9.3l6.9-1L12 2z" {...s} />,
    settings: <><Circle cx="12" cy="12" r="3" {...s} /><Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" {...s} /></>,
    edit:     <><Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...s} /><Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...s} /></>,
    leaf:     <Path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 004.82 21C7 20.3 12 19 17 14c3-3 3-7 3-7-1 1-4.2 1.8-7 1.5" {...s} />,
    shield:   <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...s} />,
    layers:   <><Polyline points="12 2 2 7 12 12 22 7 12 2" {...s} /><Polyline points="2 17 12 22 22 17" {...s} /><Polyline points="2 12 12 17 22 12" {...s} /></>,
    lock:     <><Rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s} /><Path d="M7 11V7a5 5 0 0110 0v4" {...s} /></>,
    truck:    <><Rect x="1" y="3" width="15" height="13" rx="1" {...s} /><Path d="M16 8h4l3 5v4h-7V8z" {...s} /><Circle cx="5.5" cy="18.5" r="2.5" {...s} /><Circle cx="18.5" cy="18.5" r="2.5" {...s} /></>,
  };
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      {icons[name] ?? null}
    </Svg>
  );
}

function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path d="M11 4L6 9l5 5" stroke={C.navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path d="M2 6l3 3 5-5" stroke={C.white} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LogoMark() {
  return (
    <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
      <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
      <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
    </Svg>
  );
}

// ── Section Label ──────────────────────────────────────────────
function SectionLabel({ title, note }: { title: string; note?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {note && <Text style={styles.sectionNote}>{note}</Text>}
    </View>
  );
}

// ── Text Input Field ───────────────────────────────────────────
function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  multiline?: boolean;
  icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused, multiline && styles.inputRowMulti]}>
        <View style={[styles.inputIcon, multiline && { alignSelf: 'flex-start', marginTop: 14 }]}>{icon}</View>
        <TextInput
          style={[styles.input, multiline && styles.inputMulti]}
          placeholder={placeholder}
          placeholderTextColor={C.navyMid}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

// ── Progress Bar ───────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` as any }]} />
    </View>
  );
}

// ── Main Form ──────────────────────────────────────────────────
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

  const mapExperienceToNumber = (exp: string) => {
    if (exp.includes('<')) return 1;
    if (exp.includes('1–2')) return 2;
    if (exp.includes('3–5')) return 4;
    if (exp.includes('6–10')) return 8;
    if (exp.includes('10+')) return 10;
    return 1;
  };

  const isReady = selectedServices.length > 0 && experience && city && phone.trim().length >= 10;

  // Progress calculation
  const fields = [selectedServices.length > 0, !!experience, !!availability, !!city, phone.length >= 10, !!hourlyRate, bio.length > 10];
  const progress = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const handleSubmit = async () => {
    if (!isReady) {
      Alert.alert('Incomplete', 'Please fill all required fields before submitting.');
      return;
    }
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
      Alert.alert('Profile Submitted!', 'Your worker profile is under review.', [
        { text: 'Go to Dashboard', onPress: () => router.push('/worker/verification') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

      {/* Background accents */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.brandRow}>
            <View style={styles.logoMark}><LogoMark /></View>
            <Text style={styles.brandText}>ServeNow</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Become a{'\n'}<Text style={styles.heroItalic}>Worker.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Fill in your details and start earning with verified clients near you.
          </Text>

          {/* Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Profile completeness</Text>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
            <ProgressBar value={progress} />
          </View>
        </View>

        {/* ── Services ── */}
        <SectionLabel title="SERVICES YOU OFFER" note="Select all that apply" />
        <View style={styles.chipGrid}>
          {SERVICES.map(s => {
            const active = selectedServices.includes(s.label);
            return (
              <TouchableOpacity
                key={s.label}
                style={[styles.serviceChip, active && styles.serviceChipActive]}
                onPress={() => toggleService(s.label)}
                activeOpacity={0.75}
              >
                {active && (
                  <View style={styles.serviceCheckDot}>
                    <CheckIcon />
                  </View>
                )}
                <ServiceIcon name={s.icon} color={active ? C.navy : C.navyMid} />
                <Text style={[styles.serviceLabel, active && styles.serviceLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Experience ── */}
        <SectionLabel title="YEARS OF EXPERIENCE" />
        <View style={styles.pillRow}>
          {EXPERIENCE_OPTIONS.map(opt => {
            const active = experience === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setExperience(opt)}
                activeOpacity={0.75}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Availability ── */}
        <SectionLabel title="AVAILABILITY" />
        <View style={styles.pillRow}>
          {AVAILABILITY_OPTIONS.map(opt => {
            const active = availability === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setAvailability(opt)}
                activeOpacity={0.75}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── City ── */}
        <SectionLabel title="YOUR CITY" />
        <View style={styles.chipGrid}>
          {CITIES.map(c => {
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

        {/* ── Contact & Rate ── */}
        <SectionLabel title="CONTACT & RATE" />
        <View style={styles.card}>
          <Field
            label="PHONE NUMBER"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Path d="M3.5 3.5h3l1.5 3.5-1.5 1c.8 1.5 2 2.8 3.5 3.5l1-1.5 3.5 1.5v3c0 .8-.7 1.5-1.5 1.5C6 16 2 12 2 5c0-.8.7-1.5 1.5-1.5z" stroke={C.navy} strokeWidth={1.3} strokeLinejoin="round" />
              </Svg>
            }
          />
          <View style={styles.cardDivider} />
          <Field
            label="HOURLY RATE (₹)"
            placeholder="350"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
            icon={
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Circle cx={9} cy={9} r={7} stroke={C.navy} strokeWidth={1.3} />
                <Path d="M6.5 6.5h4a1.5 1.5 0 010 3h-4m0 0h4a1.5 1.5 0 010 3H6.5M9 4v1.5M9 12.5V14" stroke={C.navy} strokeWidth={1.2} strokeLinecap="round" />
              </Svg>
            }
          />
        </View>

        {/* ── Bio ── */}
        <SectionLabel title="SHORT BIO" note="Optional" />
        <View style={styles.card}>
          <Field
            label="ABOUT YOU"
            placeholder="Describe your skills, certifications, and what makes you reliable..."
            value={bio}
            onChangeText={setBio}
            multiline
            icon={
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Path d="M3 4h12M3 8h8M3 12h10M3 16h6" stroke={C.navy} strokeWidth={1.3} strokeLinecap="round" />
              </Svg>
            }
          />
        </View>

        {/* Required fields note */}
        <View style={styles.requiredNote}>
          <Text style={styles.requiredNoteText}>
            ✦  Services, experience, city and phone are required fields.
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !isReady && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={isReady ? 0.88 : 1}
          disabled={!isReady}
        >
          <Text style={[styles.submitText, !isReady && styles.submitTextDisabled]}>
            Submit Profile
          </Text>
          {isReady && (
            <View style={styles.submitArrow}>
              <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                <Path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          )}
        </TouchableOpacity>

        {/* Trust strip */}
        <View style={styles.trust}>
          <Text style={styles.trustText}>✦ Background verified</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>Instant payouts</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>Free to join</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },

  bgCircle1: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: C.sky, opacity: 0.32, top: -80, right: -80,
  },
  bgCircle2: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: C.navy, opacity: 0.06, bottom: 60, left: -50,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 8,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.white, borderWidth: 1, borderColor: C.creamBorder,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 28, height: 28, backgroundColor: C.navy,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  brandText: {
    fontFamily: 'serif', fontSize: 17, fontWeight: '700',
    color: C.navy, letterSpacing: -0.3,
  },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  heroTitle: {
    fontFamily: 'serif', fontSize: 34, fontWeight: '700',
    color: C.navy, letterSpacing: -0.8, lineHeight: 40, marginBottom: 10,
  },
  heroItalic: { fontStyle: 'italic', color: C.sky },
  heroSub: {
    fontSize: 13, color: C.navy, opacity: 0.45,
    lineHeight: 19, marginBottom: 20,
  },

  // Progress
  progressCard: {
    backgroundColor: C.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.creamBorder,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 11, fontWeight: '600', color: C.navy, opacity: 0.5, letterSpacing: 0.5 },
  progressValue: { fontSize: 13, fontWeight: '700', color: C.navy },
  progressTrack: { height: 6, backgroundColor: C.creamBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.navy, borderRadius: 3 },

  // Section header
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 28, paddingBottom: 12,
  },
  sectionTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: C.navy, opacity: 0.45 },
  sectionNote: { fontSize: 10, fontWeight: '600', color: C.navy, opacity: 0.35 },

  // Service chips
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  serviceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder,
    borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12,
    position: 'relative',
  },
  serviceChipActive: { backgroundColor: C.navy, borderColor: C.navy },
  serviceCheckDot: {
    position: 'absolute', top: -5, right: -5,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.sky, alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel: { fontSize: 12, fontWeight: '500', color: C.navy, opacity: 0.6 },
  serviceLabelActive: { color: C.cream, opacity: 1, fontWeight: '600' },

  // Pills
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  pill: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder,
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16,
  },
  pillActive: { backgroundColor: C.navy, borderColor: C.navy },
  pillText: { fontSize: 13, fontWeight: '500', color: C.navy, opacity: 0.55 },
  pillTextActive: { color: C.cream, opacity: 1, fontWeight: '600' },

  // City chips
  cityChip: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14,
  },
  cityChipActive: { backgroundColor: C.sky, borderColor: C.sky },
  cityText: { fontSize: 13, fontWeight: '500', color: C.navy, opacity: 0.55 },
  cityTextActive: { color: C.navy, opacity: 1, fontWeight: '700' },

  // Card
  card: {
    marginHorizontal: 20, backgroundColor: C.white,
    borderRadius: 20, borderWidth: 1, borderColor: C.creamBorder,
    paddingHorizontal: 20, paddingVertical: 4,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardDivider: { height: 1, backgroundColor: C.creamBorder, marginHorizontal: -20 },

  // Fields (inside card)
  fieldWrap: { paddingVertical: 14 },
  label: {
    fontSize: 10, fontWeight: '600', letterSpacing: 0.8,
    color: C.navy, opacity: 0.45, marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.cream, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'transparent',
    height: 50, paddingHorizontal: 14, gap: 10,
  },
  inputRowFocused: { borderColor: C.sky, backgroundColor: C.white },
  inputRowMulti: { height: 'auto' as any, paddingVertical: 12 },
  inputIcon: { opacity: 0.5 },
  input: { flex: 1, fontSize: 15, color: C.navy, height: '100%' },
  inputMulti: { height: 'auto' as any, minHeight: 80, textAlignVertical: 'top', paddingTop: 0 },

  // Required note
  requiredNote: {
    marginHorizontal: 20, marginTop: 24, marginBottom: 4,
    backgroundColor: C.navyLight, borderRadius: 10, padding: 12,
  },
  requiredNoteText: { fontSize: 11, color: C.navy, opacity: 0.45, lineHeight: 17 },

  // Submit
  submitBtn: {
    marginHorizontal: 20, marginTop: 14, height: 54,
    backgroundColor: C.navy, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  submitBtnDisabled: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder,
  },
  submitText: { fontSize: 15, fontWeight: '700', color: C.cream, letterSpacing: 0.2 },
  submitTextDisabled: { color: C.navy, opacity: 0.3 },
  submitArrow: {
    width: 24, height: 24, backgroundColor: C.sky,
    borderRadius: 7, alignItems: 'center', justifyContent: 'center',
  },

  // Trust
  trust: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 20, marginHorizontal: 20,
    backgroundColor: C.navyLight, borderRadius: 12, padding: 12,
  },
  trustText: { fontSize: 10, color: C.navy, opacity: 0.35, fontWeight: '500' },
  trustDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.navy, opacity: 0.2 },
});