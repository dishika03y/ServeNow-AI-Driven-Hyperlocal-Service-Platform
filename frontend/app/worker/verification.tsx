import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Modal, Alert, Image, Animated,
} from 'react-native';
import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

// ===== COLORS =====
const C = {
  navy: '#081F5C',
  navyLight: '#081F5C14',
  sky: '#BAD6EB',
  cream: '#F2EDE4',
  creamBorder: '#E8E2D8',
  white: '#FFFFFF',
  successBg: '#DCFCE7',
  successBorder: '#BBF7D0',
  successDot: '#22C55E',
  successText: '#166534',
  dark: '#1C1C1E',
};

// ===== DOCS =====
const REQUIRED_DOCS = [
  {
    key: 'aadhaar_front',
    label: 'Aadhaar Front',
    hint: 'Front side photo',
    icon: 'id-front',
  },
  {
    key: 'aadhaar_back',
    label: 'Aadhaar Back',
    hint: 'Back side photo',
    icon: 'id-back',
  },
  {
    key: 'selfie',
    label: 'Live Selfie',
    hint: 'Take a selfie',
    icon: 'camera',
  },
];

// ===== ICONS =====
const LogoIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Circle cx={10} cy={10} r={5} fill="white" opacity={0.25} />
    <Circle cx={10} cy={10} r={3} fill="white" />
  </Svg>
);

const BackIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
    stroke={C.navy} strokeWidth={2}>
    <Path d="M19 12H5M12 5l-7 7 7 7" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth={2.5}>
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth={3}>
    <Path d="M5 13l4 4L19 7" />
  </Svg>
);

const IdFrontIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8}>
    <Rect x={3} y={5} width={18} height={14} rx={2} />
    <Circle cx={9} cy={11} r={2} />
    <Path d="M14 9h3M14 13h2" />
  </Svg>
);

const IdBackIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8}>
    <Rect x={3} y={5} width={18} height={14} rx={2} />
    <Path d="M6 10h12M6 14h8" />
  </Svg>
);

const CameraIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8}>
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <Circle cx={12} cy={13} r={3} />
  </Svg>
);

const GalleryIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"
    stroke={C.navy} strokeWidth={1.8}>
    <Rect x={3} y={3} width={18} height={18} rx={2} />
    <Circle cx={8.5} cy={8.5} r={1.5} />
    <Path d="M21 15l-5-5L5 21" />
  </Svg>
);

const SheetCameraIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"
    stroke={C.navy} strokeWidth={1.8}>
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <Circle cx={12} cy={13} r={4} />
  </Svg>
);

function DocIcon({ type, color }: { type: string; color: string }) {
  if (type === 'id-front') return <IdFrontIcon color={color} />;
  if (type === 'id-back') return <IdBackIcon color={color} />;
  return <CameraIcon color={color} />;
}

// ===== DOC CARD =====
function DocCard({ slot, image, onTap }: any) {
  const uploaded = !!image;

  return (
    <TouchableOpacity
      style={[styles.docCard, uploaded && styles.docCardUploaded]}
      onPress={onTap}
      activeOpacity={0.8}
    >
      <View style={[styles.docIconWrap, uploaded && styles.docIconWrapDone]}>
        <DocIcon
          type={slot.icon}
          color={uploaded ? C.successText : C.navy}
        />
      </View>

      <View style={styles.docInfo}>
        <Text style={styles.docLabel}>{slot.label}</Text>
        <Text style={styles.docHint}>{slot.hint}</Text>
      </View>

      <View style={[
        styles.docBadge,
        uploaded ? styles.badgeDone : styles.badgePending,
      ]}>
        <Text style={[
          styles.docBadgeText,
          uploaded ? styles.badgeDoneText : styles.badgePendingText,
        ]}>
          {uploaded ? 'DONE' : 'PENDING'}
        </Text>
      </View>

      {uploaded && (
        <View style={styles.checkCircle}>
          <CheckIcon />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ===== BOTTOM SHEET =====
function UploadSheet({ visible, slot, onCamera, onGallery, onClose }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.sheet}
          onPress={() => {}}
        >
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{slot?.label ?? 'Upload'}</Text>
          <Text style={styles.sheetSub}>Choose how to upload your document</Text>

          <TouchableOpacity style={styles.sheetBtn} onPress={onCamera}>
            <View style={styles.sheetBtnIcon}>
              <SheetCameraIcon />
            </View>
            <Text style={styles.sheetBtnText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetBtn} onPress={onGallery}>
            <View style={styles.sheetBtnIcon}>
              <GalleryIcon />
            </View>
            <Text style={styles.sheetBtnText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetCancel} onPress={onClose}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ===== MAIN =====
export default function VerificationScreen() {
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState<any>(null);

  const allUploaded = REQUIRED_DOCS.every((d) => !!docs[d.key]);

  const openSheet = (slot: any) => {
    setActiveSlot(slot);
    setSheetVisible(true);
  };

  const handleImage = (uri: string) => {
    setDocs((prev) => ({ ...prev, [activeSlot.key]: uri }));
    setSheetVisible(false);
  };

  const openCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) { Alert.alert('Permission required'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled) handleImage(result.assets[0].uri);
  };

  const openGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert('Permission required'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
    if (!result.canceled) handleImage(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Topbar */}
        <View style={styles.topbar}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}><LogoIcon /></View>
            <Text style={styles.logoText}>ServeNow</Text>
          </View>
          <Text style={styles.tagline}>HYPERLOCAL AI</Text>
        </View>

        {/* Header */}
        <View style={styles.backRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>
          Verify{' '}
          <Text style={styles.pageTitleItalic}>Identity.</Text>
        </Text>
        <Text style={styles.pageSub}>
          Upload your KYC documents to get started
        </Text>

        {/* Step dots */}
        <View style={styles.stepsRow}>
          <View style={[styles.stepDot, styles.stepDone]} />
          <View style={[styles.stepDot, styles.stepDone]} />
          <View style={[styles.stepDot, styles.stepActive]} />
          <View style={styles.stepDot} />
        </View>

        {/* Doc cards */}
        <View style={styles.docGrid}>
          {REQUIRED_DOCS.map((slot) => (
            <DocCard
              key={slot.key}
              slot={slot}
              image={docs[slot.key]}
              onTap={() => openSheet(slot)}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, !allUploaded && styles.ctaBtnDisabled]}
          disabled={!allUploaded}
          onPress={() => router.push('/home')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaLabel}>Continue</Text>
          <ArrowIcon />
        </TouchableOpacity>

        {/* Trust note */}
        <View style={styles.noteRow}>
          <View style={styles.noteDot} />
          <Text style={styles.noteText}>Your data is encrypted & secure</Text>
        </View>
      </ScrollView>

      <UploadSheet
        visible={sheetVisible}
        slot={activeSlot}
        onCamera={openCamera}
        onGallery={openGallery}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream },
  scroll: { flexGrow: 1, padding: 20, paddingTop: 36 },

  blob1: {
    position: 'absolute', width: 170, height: 170, borderRadius: 85,
    backgroundColor: C.sky, opacity: 0.5, top: 40, right: -50,
  },
  blob2: {
    position: 'absolute', width: 210, height: 210, borderRadius: 105,
    backgroundColor: C.sky, opacity: 0.35, bottom: 80, left: -70,
  },

  // Topbar
  topbar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20, zIndex: 2,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 36, height: 36, backgroundColor: C.navy,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: 17, fontWeight: '600', color: C.navy, letterSpacing: -0.3 },
  tagline: { fontSize: 10, fontWeight: '500', color: C.navy, opacity: 0.55, letterSpacing: 1.8 },

  backRow: { marginBottom: 16, zIndex: 2 },
  backBtn: {
    width: 36, height: 36, backgroundColor: C.white,
    borderRadius: 10, borderWidth: 1, borderColor: C.creamBorder,
    justifyContent: 'center', alignItems: 'center',
  },

  pageTitle: { fontSize: 26, fontWeight: '700', color: C.navy, lineHeight: 32, zIndex: 2 },
  pageTitleItalic: { fontStyle: 'italic', fontWeight: '400', color: C.sky },
  pageSub: {
    fontSize: 13, color: C.navy, opacity: 0.45,
    marginTop: 4, marginBottom: 20, zIndex: 2,
  },

  // Steps
  stepsRow: { flexDirection: 'row', gap: 6, marginBottom: 24, zIndex: 2 },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.creamBorder },
  stepActive: { backgroundColor: C.navy },
  stepDone: { backgroundColor: C.successDot },

  // Doc cards
  docGrid: { gap: 14, zIndex: 2 },
  docCard: {
    backgroundColor: C.white, borderRadius: 18,
    borderWidth: 1.5, borderColor: C.creamBorder, borderStyle: 'dashed',
    padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16,
    position: 'relative',
  },
  docCardUploaded: {
    borderColor: C.successBorder, borderStyle: 'solid', backgroundColor: '#F0FDF4',
  },
  docIconWrap: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: C.cream,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  docIconWrapDone: { backgroundColor: C.successBg },
  docInfo: { flex: 1 },
  docLabel: { fontSize: 15, fontWeight: '600', color: C.navy, marginBottom: 2 },
  docHint: { fontSize: 12, color: C.navy, opacity: 0.4 },

  docBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgePending: { backgroundColor: C.cream },
  badgeDone: { backgroundColor: C.successBg },
  docBadgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.8 },
  badgePendingText: { color: C.navy, opacity: 0.5 } as any,
  badgeDoneText: { color: C.successText },

  checkCircle: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.successDot, justifyContent: 'center', alignItems: 'center',
  },

  // CTA
  ctaBtn: {
    height: 54, backgroundColor: C.navy, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 28, zIndex: 2,
  },
  ctaBtnDisabled: { opacity: 0.35 },
  ctaLabel: { fontSize: 15, fontWeight: '600', color: C.white },

  noteRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 14,
  },
  noteDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.successDot },
  noteText: { fontSize: 11, color: C.navy, opacity: 0.4 },

  // Bottom Sheet
  overlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: C.white, padding: 24, paddingBottom: 40,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: C.creamBorder, alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: C.navy, marginBottom: 4 },
  sheetSub: { fontSize: 13, color: C.navy, opacity: 0.4, marginBottom: 20 },
  sheetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 14, borderWidth: 1, borderColor: C.creamBorder,
    backgroundColor: C.white, marginBottom: 10,
  },
  sheetBtnIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.cream, justifyContent: 'center', alignItems: 'center',
  },
  sheetBtnText: { fontSize: 15, fontWeight: '500', color: C.navy },
  sheetCancel: {
    padding: 14, borderRadius: 14, backgroundColor: C.cream,
    alignItems: 'center', marginTop: 4,
  },
  sheetCancelText: { fontSize: 14, fontWeight: '500', color: C.navy, opacity: 0.5 },
});