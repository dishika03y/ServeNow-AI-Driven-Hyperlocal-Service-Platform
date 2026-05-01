// app/worker/verification.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────
type DocKey = "aadhaar_front" | "aadhaar_back" | "selfie";
type DocStatus = "pending" | "approved" | "rejected";
type DocData = { uri: string; status: DocStatus };
type DocSlot = { key: DocKey; label: string; hint: string; icon: keyof typeof Ionicons.glyphMap };
type DocsState = Partial<Record<DocKey, DocData>>;

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "kyc_docs";

const REQUIRED_DOCS: DocSlot[] = [
  { key: "aadhaar_front", label: "Aadhaar Front", hint: "Front side of your card", icon: "card-outline" },
  { key: "aadhaar_back",  label: "Aadhaar Back",  hint: "Back side of your card",  icon: "card-outline" },
  { key: "selfie",        label: "Live Selfie",    hint: "Take a clear selfie",     icon: "camera-outline" },
];

const TIPS = [
  "All four corners of the document must be visible",
  "Avoid glare, shadows or blurred images",
  "Selfie must match your Aadhaar photo clearly",
];

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: "Pending Review", color: "#b07a10", bg: "#fdf4e0" },
  approved: { label: "Approved",       color: "#1a7a4a", bg: "#e6f5ed" },
  rejected: { label: "Rejected",       color: "#c0392b", bg: "#fdecea" },
};

// ─── Doc Card ─────────────────────────────────────────────────────────────────
function DocCard({ slot, data, onTap, onRetake }: { slot: DocSlot; data?: DocData; onTap: () => void; onRetake: () => void }) {
  const sc = data?.status ? STATUS_CONFIG[data.status] : null;

  if (data?.uri) {
    return (
      <View style={[styles.docCard, styles.docCardDone]}>
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
        <Image source={{ uri: data.uri }} style={styles.docImage} resizeMode="cover" />
        <View style={styles.docInfoRow}>
          <View>
            <Text style={styles.docLabel}>{slot.label}</Text>
            {sc && (
              <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.retakeBtn} onPress={onRetake} activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={14} color="#7BAFD4" />
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.docCard} onPress={onTap} activeOpacity={0.85}>
      <View style={styles.docEmpty}>
        <View style={styles.docIconCircle}>
          <Ionicons name={slot.icon} size={26} color="#1a2f4e" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.docLabel}>{slot.label}</Text>
          <Text style={styles.docHint}>{slot.hint}</Text>
        </View>
        <View style={styles.uploadPill}>
          <Ionicons name="cloud-upload-outline" size={13} color="#7BAFD4" />
          <Text style={styles.uploadPillText}>Upload</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Upload Sheet ─────────────────────────────────────────────────────────────
function UploadSheet({ visible, slotLabel, onCamera, onGallery, onClose }: { visible: boolean; slotLabel: string; onCamera: () => void; onGallery: () => void; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Upload <Text style={styles.sheetTitleItalic}>{slotLabel}</Text></Text>
          <Text style={styles.sheetSub}>Choose how you'd like to upload</Text>

          <TouchableOpacity style={styles.sheetBtn} onPress={onCamera} activeOpacity={0.85}>
            <View style={styles.sheetBtnIcon}><Ionicons name="camera-outline" size={22} color="#1a2f4e" /></View>
            <View style={styles.sheetBtnContent}>
              <Text style={styles.sheetBtnTitle}>Take a Photo</Text>
              <Text style={styles.sheetBtnSub}>Use your camera to capture</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#b0bec8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetBtn} onPress={onGallery} activeOpacity={0.85}>
            <View style={styles.sheetBtnIcon}><Ionicons name="images-outline" size={22} color="#1a2f4e" /></View>
            <View style={styles.sheetBtnContent}>
              <Text style={styles.sheetBtnTitle}>Choose from Gallery</Text>
              <Text style={styles.sheetBtnSub}>Select an existing photo</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#b0bec8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function VerificationScreen() {
  const [docs, setDocs]                   = useState<DocsState>({});
  const [sheetVisible, setSheetVisible]   = useState(false);
  const [activeSlot, setActiveSlot]       = useState<DocSlot | null>(null);

  const uploadedCount = Object.keys(docs).length;
  const allDone       = uploadedCount === REQUIRED_DOCS.length;
  const progress      = uploadedCount / REQUIRED_DOCS.length;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) setDocs(JSON.parse(saved));
    });
  }, []);

  const persist = async (updated: DocsState) => {
    setDocs(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openSheet = (slot: DocSlot) => { setActiveSlot(slot); setSheetVisible(true); };

  const handleImage = async (uri: string) => {
    if (!activeSlot) return;
    await persist({ ...docs, [activeSlot.key]: { uri, status: "pending" } });
    setSheetVisible(false);
  };

  const removeDoc = async (key: DocKey) => {
    const next = { ...docs };
    delete next[key];
    await persist(next);
  };

  const openCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) { Alert.alert("Permission required", "Camera access is needed."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) handleImage(res.assets[0].uri);
  };

  const openGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert("Permission required", "Gallery access is needed."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!res.canceled) handleImage(res.assets[0].uri);
  };

  const handleSubmit = () => {
    if (!allDone) { Alert.alert("Incomplete", "Please upload all required documents."); return; }
    router.push("/worker/pending-status");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE9E1" />

      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.brand}>
          <View style={styles.logoBox}><Ionicons name="star" size={20} color="#fff" /></View>
          <Text style={styles.brandName}>ServeNow</Text>
        </View>
        <Text style={styles.navTag}>HYPERLOCAL AI</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Verify <Text style={styles.headingItalic}>Identity.</Text></Text>
          <Text style={styles.subtext}>Upload your documents to unlock bookings and start earning</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Verification Progress</Text>
            <Text style={styles.progressCount}><Text style={styles.progressNum}>{uploadedCount}</Text>/{REQUIRED_DOCS.length} uploaded</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
          {allDone && (
            <View style={styles.allDoneRow}>
              <Ionicons name="checkmark-circle" size={16} color="#1a7a4a" />
              <Text style={styles.allDoneText}>All documents uploaded! Ready to submit.</Text>
            </View>
          )}
        </View>

        {/* Docs */}
        {REQUIRED_DOCS.map((slot) => (
          <DocCard key={slot.key} slot={slot} data={docs[slot.key]} onTap={() => openSheet(slot)} onRetake={() => removeDoc(slot.key)} />
        ))}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="information-circle-outline" size={18} color="#2d4a6e" />
            <Text style={styles.tipsTitle}>Upload Tips</Text>
          </View>
          {TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* View Status */}
        <TouchableOpacity style={styles.statusBtn} onPress={() => router.push("/worker/pending-status")} activeOpacity={0.85}>
          <Text style={styles.statusBtnText}>View Verification Status</Text>
          <View style={styles.arrowCircleGhost}><Ionicons name="arrow-forward" size={16} color="#1a2f4e" /></View>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={[styles.submitBtn, !allDone && styles.submitBtnDisabled]} onPress={handleSubmit} activeOpacity={allDone ? 0.85 : 1} disabled={!allDone}>
          <Text style={[styles.submitText, !allDone && styles.submitTextDisabled]}>Submit for Verification</Text>
          <View style={[styles.arrowCircle, !allDone && styles.arrowCircleDisabled]}>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Trust bar */}
        <View style={styles.trustBar}>
          <Text style={styles.trustItem}>🔒 SSL secured</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustItem}>✓ Data encrypted</Text>
          <View style={styles.trustDot} />
          <Text style={styles.trustItem}>★ Verified safely</Text>
        </View>
      </ScrollView>

      <UploadSheet visible={sheetVisible} slotLabel={activeSlot?.label ?? ""} onCamera={openCamera} onGallery={openGallery} onClose={() => setSheetVisible(false)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDE9E1" },
  scroll:   { paddingBottom: 40 },
  navbar:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 18 },
  brand:     { flexDirection: "row", alignItems: "center" },
  logoBox:   { width: 42, height: 42, borderRadius: 12, backgroundColor: "#1a2f4e", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: 20, fontWeight: "700", color: "#1a2f4e", marginLeft: 10 },
  navTag:    { fontSize: 10, fontWeight: "600", letterSpacing: 2, color: "#8a9ab0" },
  headerRow:     { paddingHorizontal: 20, marginBottom: 20 },
  heading:       { fontSize: 32, fontWeight: "800", color: "#1a2f4e" },
  headingItalic: { fontStyle: "italic", fontWeight: "400", color: "#7BAFD4" },
  subtext:       { fontSize: 13, color: "#8a9ab0", marginTop: 4, lineHeight: 19 },
  progressCard:  { backgroundColor: "#fff", borderRadius: 20, marginHorizontal: 20, padding: 20, marginBottom: 16, shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  progressTop:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressLabel: { fontSize: 13, fontWeight: "700", color: "#1a2f4e" },
  progressCount: { fontSize: 12, color: "#8a9ab0" },
  progressNum:   { fontWeight: "800", color: "#1a2f4e" },
  progressTrack: { height: 6, backgroundColor: "#f0f4f8", borderRadius: 3, overflow: "hidden" },
  progressFill:  { height: "100%", backgroundColor: "#1a2f4e", borderRadius: 3 },
  allDoneRow:    { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 6 },
  allDoneText:   { fontSize: 12, color: "#1a7a4a", fontWeight: "600" },
  docCard:      { backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 20, marginBottom: 12, borderWidth: 1.5, borderColor: "#e0e8f0", shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, overflow: "hidden" },
  docCardDone:  { borderColor: "rgba(123,175,212,0.4)" },
  checkBadge:   { position: "absolute", top: 10, right: 10, zIndex: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: "#1a7a4a", alignItems: "center", justifyContent: "center" },
  docImage:     { width: "100%", height: 140 },
  docInfoRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  docLabel:     { fontSize: 14, fontWeight: "700", color: "#1a2f4e" },
  docHint:      { fontSize: 11, color: "#8a9ab0", marginTop: 2 },
  statusBadge:  { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  statusText:   { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  retakeBtn:    { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(123,175,212,0.12)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  retakeText:   { fontSize: 12, color: "#7BAFD4", fontWeight: "700" },
  docEmpty:     { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
  docIconCircle:{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#e8eef5", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  uploadPill:   { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(123,175,212,0.12)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  uploadPillText:{ fontSize: 11, fontWeight: "700", color: "#7BAFD4" },
  tipsCard:   { backgroundColor: "#fff", borderRadius: 20, marginHorizontal: 20, padding: 18, marginBottom: 16, shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  tipsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  tipsTitle:  { fontSize: 14, fontWeight: "700", color: "#1a2f4e" },
  tipRow:     { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  tipDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: "#7BAFD4", marginTop: 5 },
  tipText:    { fontSize: 13, color: "#64748b", flex: 1, lineHeight: 19 },
  statusBtn:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: "#d8e2ec", backgroundColor: "#f9fafb", marginBottom: 12 },
  statusBtnText:   { fontSize: 14, fontWeight: "600", color: "#1a2f4e" },
  arrowCircleGhost:{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#e8eef5", alignItems: "center", justifyContent: "center" },
  submitBtn:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, backgroundColor: "#1a2f4e", marginBottom: 20, shadowColor: "#1a2f4e", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  submitBtnDisabled: { backgroundColor: "#f0f4f8", shadowOpacity: 0, elevation: 0 },
  submitText:        { fontSize: 15, fontWeight: "700", color: "#fff" },
  submitTextDisabled:{ color: "#b0bec8" },
  arrowCircle:       { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  arrowCircleDisabled: { backgroundColor: "#e0e8f0" },
  trustBar:  { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.55)", marginHorizontal: 32, marginBottom: 8, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16 },
  trustItem: { fontSize: 11, color: "#8a9ab0" },
  trustDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: "#b0bec8", marginHorizontal: 6 },
  modalBg:        { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  sheet:          { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingBottom: Platform.OS === "ios" ? 44 : 28, paddingTop: 16 },
  sheetHandle:    { width: 40, height: 4, borderRadius: 2, backgroundColor: "#e0e8f0", alignSelf: "center", marginBottom: 20 },
  sheetTitle:     { fontSize: 22, fontWeight: "800", color: "#1a2f4e", marginBottom: 4 },
  sheetTitleItalic: { fontStyle: "italic", fontWeight: "400", color: "#7BAFD4" },
  sheetSub:       { fontSize: 13, color: "#8a9ab0", marginBottom: 24 },
  sheetBtn:       { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1.5, borderColor: "#e0e8f0" },
  sheetBtnIcon:   { width: 44, height: 44, borderRadius: 12, backgroundColor: "#e8eef5", alignItems: "center", justifyContent: "center", marginRight: 14 },
  sheetBtnContent:{ flex: 1 },
  sheetBtnTitle:  { fontSize: 15, fontWeight: "700", color: "#1a2f4e", marginBottom: 2 },
  sheetBtnSub:    { fontSize: 12, color: "#8a9ab0" },
  cancelBtn:      { alignItems: "center", paddingVertical: 14, marginTop: 4 },
  cancelText:     { fontSize: 14, fontWeight: "600", color: "#94a3b8" },
});