import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

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

type VerifyState = 'idle' | 'verifying' | 'success' | 'failed';

export default function WorkerVerification() {
  const [image, setImage]           = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to capture your ID.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setVerifyState('idle');
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setVerifyState('idle');
    }
  };

  const handleVerify = () => {
    setVerifyState('verifying');

    // Simulate verification API call
    setTimeout(() => {
      setVerifyState('success');
    }, 2200);
  };

  const handleRetake = () => {
    setImage(null);
    setVerifyState('idle');
  };

  const handleContinue = () => {
    router.push('/(worker-tabs)/dashboard');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
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
        <Text style={styles.heroEmoji}>🪪</Text>
        <Text style={styles.heroTitle}>ID Verification</Text>
        <Text style={styles.heroSub}>
          Take a clear photo of your government-issued ID to verify your identity
        </Text>
      </View>

      {/* Steps */}
      <View style={styles.stepsCard}>
        {[
          { emoji: '📸', text: 'Capture or upload your ID photo' },
          { emoji: '🔍', text: 'We verify your document securely' },
          { emoji: '✅', text: 'Get verified and start accepting jobs' },
        ].map((step, i) => (
          <View key={i} style={[styles.stepRow, i < 2 && styles.stepRowBorder]}>
            <View style={styles.stepIconWrap}>
              <Text style={styles.stepEmoji}>{step.emoji}</Text>
            </View>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </View>

      {/* Accepted IDs */}
      <View style={styles.acceptedRow}>
        {['Aadhaar Card', 'PAN Card', 'Voter ID', 'Driving Licence'].map((id) => (
          <View key={id} style={styles.idChip}>
            <Text style={styles.idChipText}>{id}</Text>
          </View>
        ))}
      </View>

      {/* Image Preview / Placeholder */}
      {image ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: image }} style={styles.previewImage} />

          {/* Overlay on verifying */}
          {verifyState === 'verifying' && (
            <View style={styles.verifyingOverlay}>
              <ActivityIndicator size="large" color={ACCENT} />
              <Text style={styles.verifyingText}>Verifying your ID…</Text>
            </View>
          )}

          {/* Success overlay */}
          {verifyState === 'success' && (
            <View style={styles.successOverlay}>
              <Text style={styles.successTick}>✓</Text>
              <Text style={styles.successOverlayText}>ID Verified!</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderEmoji}>🪪</Text>
          <Text style={styles.placeholderText}>No photo captured yet</Text>
          <Text style={styles.placeholderSub}>Use the buttons below to add your ID</Text>
        </View>
      )}

      {/* Status badge */}
      {verifyState === 'success' && (
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: ACCENT }]} />
          <Text style={[styles.statusText, { color: ACCENT }]}>
            Identity verified successfully
          </Text>
        </View>
      )}

      {verifyState === 'failed' && (
        <View style={[styles.statusBadge, { backgroundColor: DANGER_DIM, borderColor: DANGER_BDR }]}>
          <View style={[styles.statusDot, { backgroundColor: DANGER }]} />
          <Text style={[styles.statusText, { color: DANGER }]}>
            Verification failed — please retake
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsSection}>

        {/* No image yet — show capture + upload */}
        {!image && (
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={openCamera}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryIcon}>📸</Text>
              <Text style={styles.btnPrimaryText}>Capture ID Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={openGallery}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineIcon}>🖼️</Text>
              <Text style={styles.btnOutlineText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Image captured, not yet verified */}
        {image && verifyState === 'idle' && (
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleVerify}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryIcon}>🔍</Text>
              <Text style={styles.btnPrimaryText}>Verify ID</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={handleRetake}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineIcon}>🔄</Text>
              <Text style={styles.btnOutlineText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Verifying in progress */}
        {verifyState === 'verifying' && (
          <View style={[styles.btnPrimary, styles.btnDisabled]}>
            <ActivityIndicator size="small" color={NAVY} style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}>Verifying…</Text>
          </View>
        )}

        {/* Verified — show continue */}
        {verifyState === 'success' && (
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryIcon}>🚀</Text>
              <Text style={styles.btnPrimaryText}>Go to Dashboard →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={handleRetake}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineText}>Use a different ID</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Failed — retake */}
        {verifyState === 'failed' && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: DANGER }]}
            onPress={handleRetake}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryIcon}>🔄</Text>
            <Text style={styles.btnPrimaryText}>Retake Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.disclaimer}>
        Your ID is encrypted and used only for identity verification. We never share it with third parties.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  scrollContent: { paddingBottom: 52 },

  // TOP BAR
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

  // HERO
  hero: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 22,
    gap: 8,
  },
  heroEmoji: { fontSize: 44 },
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
    lineHeight: 20,
  },

  // STEPS
  stepsCard: {
    marginHorizontal: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  stepIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: NAVY_MID,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepEmoji: { fontSize: 16 },
  stepText: { color: TEXT, fontSize: 13, fontWeight: '500', flex: 1 },

  // ACCEPTED IDs
  acceptedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  idChip: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  idChipText: { color: ACCENT, fontSize: 11, fontWeight: '600' },

  // PLACEHOLDER
  placeholder: {
    marginHorizontal: 22,
    height: 200,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderEmoji: { fontSize: 36 },
  placeholderText: { color: TEXT, fontSize: 14, fontWeight: '600' },
  placeholderSub: { color: MUTED, fontSize: 12 },

  // PREVIEW
  previewWrap: {
    marginHorizontal: 22,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 18,
  },
  verifyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,34,57,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
  },
  verifyingText: { color: TEXT, fontSize: 14, fontWeight: '600' },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,214,143,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: ACCENT_BDR,
  },
  successTick: { color: ACCENT, fontSize: 52, fontWeight: '800' },
  successOverlayText: { color: ACCENT, fontSize: 16, fontWeight: '700' },

  // STATUS BADGE
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: ACCENT_BDR,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },

  // ACTIONS
  actionsSection: { paddingHorizontal: 22, marginTop: 20 },
  btnCol: { gap: 10 },

  btnPrimary: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnPrimaryIcon: { fontSize: 16 },
  btnPrimaryText: {
    color: NAVY,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnOutline: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnOutlineIcon: { fontSize: 15 },
  btnOutlineText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  disclaimer: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 20,
    lineHeight: 17,
  },
});