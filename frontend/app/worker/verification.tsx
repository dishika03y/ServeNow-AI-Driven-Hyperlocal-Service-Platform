import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';

// ── Brand Tokens (identical to Login / Signup / WorkerForm) ───
const C = {
  navy: '#081F5C',
  navyLight: '#081F5C14',
  navyMid: '#081F5C40',
  sky: '#BAD6EB',
  skyMid: '#BAD6EB50',
  cream: '#F7F2EB',
  creamDark: '#EDE7DC',
  creamBorder: '#E8E2D8',
  white: '#FFFFFF',
  success: '#166534',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
  successDot: '#22C55E',
  error: '#991B1B',
  errorBg: '#FEF2F2',
};

// ── Icons ──────────────────────────────────────────────────────
const BackIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M11 4L6 9l5 5" stroke={C.navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LogoMark = () => (
  <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" fill={C.sky} />
    <Circle cx={9} cy={9} r={2.5} fill={C.cream} />
  </Svg>
);

const UploadIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="17 8 12 3 7 8" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1={12} y1={3} x2={12} y2={15} stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);

const CheckIcon = ({ size = 10 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Path d="M2 6l3 3 5-5" stroke={C.white} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CameraIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={12} cy={13} r={4} stroke={C.navy} strokeWidth={1.4} />
  </Svg>
);

const GalleryIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={3} width={18} height={18} rx={2} stroke={C.navy} strokeWidth={1.4} />
    <Circle cx={8.5} cy={8.5} r={1.5} stroke={C.navy} strokeWidth={1.4} />
    <Polyline points="21 15 16 10 5 21" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const XIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
    <Path d="M2 2l6 6M8 2l-6 6" stroke={C.white} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
    <Path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke={C.navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Document slot colors (used as placeholder tints) ──────────
const SLOT_TINTS = ['#D4C5B2', '#B2C5D4', '#C5D4B2', '#D4B2C5', '#C5C5B2'];

// ── Document Slots ─────────────────────────────────────────────
type DocSlot = {
  key: string;
  label: string;
  hint: string;
  required: boolean;
};

const REQUIRED_DOCS: DocSlot[] = [
  { key: 'aadhaar_front', label: 'Aadhaar Front', hint: 'Clear photo of front side', required: true },
  { key: 'aadhaar_back',  label: 'Aadhaar Back',  hint: 'Clear photo of back side',  required: true },
  { key: 'selfie',        label: 'Live Selfie',   hint: 'Front-facing, well-lit',    required: true },
];

const OPTIONAL_DOCS: DocSlot[] = [
  { key: 'portfolio_1', label: 'Portfolio Photo 1', hint: 'Show your best work', required: false },
  { key: 'portfolio_2', label: 'Portfolio Photo 2', hint: 'Another work sample',  required: false },
];

// ── Filled doc colors (indexed) ───────────────────────────────
let fillColorIndex = 0;

// ── Progress Bar ───────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 400, useNativeDriver: false }).start();
  }, [value]);
  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          { width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
        ]}
      />
    </View>
  );
}

// ── Doc Card ───────────────────────────────────────────────────
function DocCard({
  slot,
  filled,
  fillColor,
  onTap,
  onRemove,
}: {
  slot: DocSlot;
  filled: boolean;
  fillColor?: string;
  onTap: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.docCard, filled && styles.docCardFilled]}
      onPress={filled ? undefined : onTap}
      activeOpacity={0.8}
    >
      {filled ? (
        <>
          {/* Filled tint block */}
          <View style={[styles.docTint, { backgroundColor: fillColor }]}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={C.navy} strokeWidth={1.3} strokeOpacity={0.4} />
              <Polyline points="14 2 14 8 20 8" stroke={C.navy} strokeWidth={1.3} strokeOpacity={0.4} />
            </Svg>
          </View>

          {/* Label strip */}
          <View style={styles.docFilledStrip}>
            <View style={styles.docCheckBadge}>
              <CheckIcon size={9} />
            </View>
            <Text style={styles.docFilledLabel} numberOfLines={1}>{slot.label}</Text>
          </View>

          {/* Remove */}
          <TouchableOpacity style={styles.docRemoveBtn} onPress={onRemove} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <XIcon />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.docEmpty}>
          <View style={styles.docIconBox}>
            <UploadIcon />
          </View>
          <Text style={styles.docLabel}>{slot.label}</Text>
          <Text style={styles.docHint}>{slot.hint}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Bottom Sheet ───────────────────────────────────────────────
function UploadSheet({
  visible,
  slotLabel,
  onCamera,
  onGallery,
  onClose,
}: {
  visible: boolean;
  slotLabel: string;
  onCamera: () => void;
  onGallery: () => void;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 10 }),
        Animated.timing(bgAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.sheetOverlay, { opacity: bgAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Upload Document</Text>
          <Text style={styles.sheetSub}>{slotLabel}</Text>

          <TouchableOpacity style={styles.sheetOption} onPress={onCamera} activeOpacity={0.75}>
            <View style={styles.sheetOptIcon}><CameraIcon /></View>
            <View style={styles.sheetOptText}>
              <Text style={styles.sheetOptLabel}>Take a Photo</Text>
              <Text style={styles.sheetOptDesc}>Open camera to capture now</Text>
            </View>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path d="M6 4l4 4-4 4" stroke={C.navyMid} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetOption} onPress={onGallery} activeOpacity={0.75}>
            <View style={styles.sheetOptIcon}><GalleryIcon /></View>
            <View style={styles.sheetOptText}>
              <Text style={styles.sheetOptLabel}>Choose from Gallery</Text>
              <Text style={styles.sheetOptDesc}>Pick an existing photo</Text>
            </View>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path d="M6 4l4 4-4 4" stroke={C.navyMid} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetCancel} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ── Main Screen ────────────────────────────────────────────────
export default function VerificationScreen() {
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState<DocSlot | null>(null);

  const allSlots   = [...REQUIRED_DOCS, ...OPTIONAL_DOCS];
  const reqFilled  = REQUIRED_DOCS.filter(s => docs[s.key]).length;
  const totalFilled = allSlots.filter(s => docs[s.key]).length;
  const progress   = Math.round((reqFilled / REQUIRED_DOCS.length) * 100);
  const isReady    = reqFilled === REQUIRED_DOCS.length;

  const openSheet = (slot: DocSlot) => {
    setActiveSlot(slot);
    setSheetVisible(true);
  };

  const simulateUpload = () => {
    if (!activeSlot) return;
    const colorIndex = Object.keys(docs).length % SLOT_TINTS.length;
    setDocs(prev => ({ ...prev, [activeSlot.key]: SLOT_TINTS[colorIndex] }));
    setSheetVisible(false);
  };

  const removeDoc = (key: string) => {
    setDocs(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!isReady) return;
    Alert.alert(
      'Submitted for Review',
      "Your documents are under review. We'll notify you within 24 hours.",
      [{ text: 'Back to Dashboard', onPress: () => router.back() }]
    );
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
          <Text style={styles.heading}>
            Verify your{'\n'}
            <Text style={styles.headingItalic}>identity.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Upload your documents to start accepting jobs. Required documents are marked below.
          </Text>

          {/* Progress card */}
          <View style={styles.progressCard}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Required documents</Text>
              <Text style={styles.progressValue}>{reqFilled} / {REQUIRED_DOCS.length}</Text>
            </View>
            <ProgressBar value={progress} />
            {reqFilled > 0 && (
              <Text style={styles.progressHint}>
                {isReady ? '✦ All required documents uploaded' : `${REQUIRED_DOCS.length - reqFilled} more required`}
              </Text>
            )}
          </View>
        </View>

        {/* Required documents */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>REQUIRED DOCUMENTS</Text>
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredBadgeText}>3 needed</Text>
          </View>
        </View>

        <View style={styles.docGrid}>
          {REQUIRED_DOCS.map(slot => (
            <DocCard
              key={slot.key}
              slot={slot}
              filled={!!docs[slot.key]}
              fillColor={docs[slot.key]}
              onTap={() => openSheet(slot)}
              onRemove={() => removeDoc(slot.key)}
            />
          ))}
        </View>

        {/* Portfolio (optional) */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>PORTFOLIO</Text>
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalBadgeText}>Optional</Text>
          </View>
        </View>
        <Text style={styles.sectionDesc}>Show off your past work to attract more clients.</Text>

        <View style={styles.docGridRow}>
          {OPTIONAL_DOCS.map(slot => (
            <DocCard
              key={slot.key}
              slot={slot}
              filled={!!docs[slot.key]}
              fillColor={docs[slot.key]}
              onTap={() => openSheet(slot)}
              onRemove={() => removeDoc(slot.key)}
            />
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !isReady && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isReady}
          activeOpacity={isReady ? 0.88 : 1}
        >
          {isReady ? (
            <>
              <Text style={styles.submitText}>Submit for Verification</Text>
              <View style={styles.submitArrow}><ArrowIcon /></View>
            </>
          ) : (
            <Text style={styles.submitTextDisabled}>
              Upload {REQUIRED_DOCS.length - reqFilled} more required doc{REQUIRED_DOCS.length - reqFilled > 1 ? 's' : ''} to continue
            </Text>
          )}
        </TouchableOpacity>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <ShieldIcon />
          <Text style={styles.disclaimerText}>
            Your documents are encrypted and reviewed only by our trust & safety team.
          </Text>
        </View>

        {/* Trust strip */}
        <View style={styles.trust}>
          <Text style={styles.trustText}>✦ 256-bit encrypted</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>GDPR compliant</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>24hr review</Text>
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <UploadSheet
        visible={sheetVisible}
        slotLabel={activeSlot?.label ?? ''}
        onCamera={simulateUpload}
        onGallery={simulateUpload}
        onClose={() => setSheetVisible(false)}
      />
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
  heading: {
    fontFamily: 'serif', fontSize: 34, fontWeight: '700',
    color: C.navy, letterSpacing: -0.8, lineHeight: 40, marginBottom: 10,
  },
  headingItalic: { fontStyle: 'italic', color: C.sky },
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
  progressLabel: { fontSize: 11, fontWeight: '600', color: C.navy, opacity: 0.5, letterSpacing: 0.4 },
  progressValue: { fontSize: 13, fontWeight: '700', color: C.navy },
  progressTrack: { height: 6, backgroundColor: C.creamBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.navy, borderRadius: 3 },
  progressHint: {
    fontSize: 11, color: C.navy, opacity: 0.4,
    marginTop: 10, fontWeight: '500',
  },

  // Section headers
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingTop: 28, paddingBottom: 12,
  },
  sectionTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: C.navy, opacity: 0.45 },
  sectionDesc: {
    fontSize: 12, color: C.navy, opacity: 0.4,
    paddingHorizontal: 20, marginTop: -4, marginBottom: 12, lineHeight: 17,
  },
  requiredBadge: {
    backgroundColor: C.navy, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  requiredBadgeText: { fontSize: 9, fontWeight: '700', color: C.cream, letterSpacing: 0.4 },
  optionalBadge: {
    backgroundColor: C.creamBorder, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  optionalBadgeText: { fontSize: 9, fontWeight: '600', color: C.navy, opacity: 0.5, letterSpacing: 0.4 },

  // Doc grids
  docGrid: { paddingHorizontal: 20, gap: 10 },
  docGridRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },

  // Doc card
  docCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    height: 104,
    overflow: 'hidden',
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  docCardFilled: { borderColor: C.successBorder },

  docEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 12,
  },
  docIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.navyLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  docLabel: { fontSize: 12, fontWeight: '600', color: C.navy, textAlign: 'center' },
  docHint:  { fontSize: 10, color: C.navy, opacity: 0.35, textAlign: 'center' },

  docTint: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  docFilledStrip: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 36,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.successBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  docCheckBadge: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.successDot,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  docFilledLabel: { fontSize: 11, fontWeight: '600', color: C.navy, flex: 1 },

  docRemoveBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.navy,
    alignItems: 'center', justifyContent: 'center',
  },

  // Submit
  submitBtn: {
    marginHorizontal: 20, marginTop: 28, height: 54,
    backgroundColor: C.navy, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  submitBtnDisabled: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.creamBorder,
  },
  submitText: { fontSize: 15, fontWeight: '700', color: C.cream, letterSpacing: 0.2 },
  submitTextDisabled: { fontSize: 13, fontWeight: '500', color: C.navy, opacity: 0.35 },
  submitArrow: {
    width: 24, height: 24, backgroundColor: C.sky,
    borderRadius: 7, alignItems: 'center', justifyContent: 'center',
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 20, marginTop: 16,
    backgroundColor: C.navyLight, borderRadius: 12, padding: 12,
  },
  disclaimerText: {
    flex: 1, fontSize: 11, color: C.navy, opacity: 0.4,
    lineHeight: 16, fontWeight: '400',
  },

  // Trust strip
  trust: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 12, marginHorizontal: 20,
    backgroundColor: C.navyLight, borderRadius: 12, padding: 12,
  },
  trustText: { fontSize: 10, color: C.navy, opacity: 0.35, fontWeight: '500' },
  trustDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.navy, opacity: 0.2 },

  // Bottom sheet
  sheetOverlay: {
    flex: 1, backgroundColor: 'rgba(8,31,92,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: C.creamBorder, alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: 'serif', fontSize: 22, fontWeight: '700',
    color: C.navy, letterSpacing: -0.4, marginBottom: 2,
  },
  sheetSub: {
    fontSize: 13, color: C.navy, opacity: 0.4, marginBottom: 20,
  },
  sheetOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.cream, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: C.creamBorder,
    marginBottom: 10,
  },
  sheetOptIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.navyLight,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  sheetOptText: { flex: 1 },
  sheetOptLabel: { fontSize: 14, fontWeight: '600', color: C.navy, marginBottom: 2 },
  sheetOptDesc:  { fontSize: 11, color: C.navy, opacity: 0.4 },
  sheetCancel: {
    marginTop: 6, height: 48,
    backgroundColor: C.cream, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.creamBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  sheetCancelText: { fontSize: 14, fontWeight: '600', color: C.navy, opacity: 0.45 },
});