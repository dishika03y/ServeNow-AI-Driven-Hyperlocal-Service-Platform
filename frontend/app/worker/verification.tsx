import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "@/src/api/api";

// ── Design Tokens (matches WorkerOS screenshot) ──────────────────────────────
const ACCENT   = "#00D68F";
const NAVY     = "#0B2239";
const NAVY_MID = "#0F2A45";
const SURFACE  = "rgba(255,255,255,0.07)";
const BORDER   = "rgba(255,255,255,0.10)";
const TEXT     = "#EEF4FA";
const MUTED    = "rgba(255,255,255,0.50)";

// ── Document slots config ─────────────────────────────────────────────────────
const DOC_SLOTS = [
  { key: "aadhaar_front", label: "Aadhaar Front",  icon: "card-outline",        required: true },
  { key: "aadhaar_back",  label: "Aadhaar Back",   icon: "card-outline",        required: true },
  { key: "selfie",        label: "Selfie",          icon: "person-circle-outline", required: true },
  { key: "portfolio_1",   label: "Portfolio 1",    icon: "images-outline",      required: false },
  { key: "portfolio_2",   label: "Portfolio 2",    icon: "images-outline",      required: false },
] as const;

type DocKey = typeof DOC_SLOTS[number]["key"];
type DocsState = Record<DocKey, string | null>;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Verification() {
  const router  = useRouter();
  const [loading, setLoading]     = useState(false);
  const [activeSlot, setActiveSlot] = useState<DocKey | null>(null); // controls picker sheet
  const [docs, setDocs] = useState<DocsState>({
    aadhaar_front: null,
    aadhaar_back:  null,
    selfie:        null,
    portfolio_1:   null,
    portfolio_2:   null,
  });

  // ── Open source-picker sheet ────────────────────────────────────────────────
  const openPicker = (key: DocKey) => setActiveSlot(key);
  const closePicker = () => setActiveSlot(null);

  // ── Take photo with camera ──────────────────────────────────────────────────
  const takePhoto = async (key: DocKey) => {
    closePicker();
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    });
    if (!result.canceled) {
      setDocs((prev) => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  // ── Pick image from gallery ─────────────────────────────────────────────────
  const pickFromGallery = async (key: DocKey) => {
    closePicker();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow photo library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    });
    if (!result.canceled) {
      setDocs((prev) => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  // ── Remove a selected image ─────────────────────────────────────────────────
  const removeImage = (key: DocKey) => {
    setDocs((prev) => ({ ...prev, [key]: null }));
  };

  // ── Upload & submit ─────────────────────────────────────────────────────────
  const uploadDocuments = async () => {
    const missing = DOC_SLOTS.filter((s) => s.required && !docs[s.key]);
    if (missing.length) {
      Alert.alert(
        "Missing Documents",
        `Please upload: ${missing.map((m) => m.label).join(", ")}.`
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();

    (Object.keys(docs) as DocKey[]).forEach((key) => {
      if (docs[key]) {
        formData.append(key, {
          uri:  docs[key],
          name: `${key}.jpg`,
          type: "image/jpeg",
        } as any);
      }
    });

    try {
      await apiRequest("/workers/upload-documents", "POST", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Submitted!", "Documents uploaded. Pending admin verification.");
      router.replace("/worker/pending-status");
    } catch {
      Alert.alert("Upload Failed", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Count filled required slots ─────────────────────────────────────────────
  const requiredFilled = DOC_SLOTS.filter((s) => s.required && docs[s.key]).length;
  const requiredTotal  = DOC_SLOTS.filter((s) => s.required).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={TEXT} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Verification</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Text ── */}
        <Text style={styles.heading}>Verify your identity</Text>
        <Text style={styles.subText}>
          Upload your documents to start accepting jobs. Required fields are marked.
        </Text>

        {/* ── Progress Pill ── */}
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(requiredFilled / requiredTotal) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {requiredFilled}/{requiredTotal} required
          </Text>
        </View>

        {/* ── Document Cards ── */}
        <Text style={styles.sectionLabel}>REQUIRED DOCUMENTS</Text>
        {DOC_SLOTS.filter((s) => s.required).map((slot) => (
          <DocCard
            key={slot.key}
            slot={slot}
            uri={docs[slot.key]}
            onPick={() => openPicker(slot.key)}
            onRemove={() => removeImage(slot.key)}
          />
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>
          PORTFOLIO{" "}
          <Text style={styles.optionalTag}>OPTIONAL</Text>
        </Text>
        {DOC_SLOTS.filter((s) => !s.required).map((slot) => (
          <DocCard
            key={slot.key}
            slot={slot}
            uri={docs[slot.key]}
            onPick={() => openPicker(slot.key)}
            onRemove={() => removeImage(slot.key)}
          />
        ))}

        {/* ── Submit ── */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            requiredFilled < requiredTotal && styles.submitBtnDisabled,
          ]}
          onPress={uploadDocuments}
          disabled={loading || requiredFilled < requiredTotal}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={NAVY} />
          ) : (
            <View style={styles.submitInner}>
              <Ionicons name="cloud-upload-outline" size={18} color={NAVY} />
              <Text style={styles.submitText}>Submit for Verification</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your documents are encrypted and reviewed only by our trust &amp; safety team.
        </Text>
      </ScrollView>

      {/* ── Source Picker Bottom Sheet ── */}
      <Modal
        visible={activeSlot !== null}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
      >
        <Pressable style={sheet.backdrop} onPress={closePicker}>
          <Pressable style={sheet.sheet}>
            {/* Handle bar */}
            <View style={sheet.handle} />

            <Text style={sheet.sheetTitle}>Upload Document</Text>
            <Text style={sheet.sheetSub}>
              {activeSlot
                ? DOC_SLOTS.find((s) => s.key === activeSlot)?.label
                : ""}
            </Text>

            {/* Camera option */}
            <TouchableOpacity
              style={sheet.option}
              onPress={() => activeSlot && takePhoto(activeSlot)}
              activeOpacity={0.8}
            >
              <View style={sheet.optionIcon}>
                <Ionicons name="camera" size={22} color={ACCENT} />
              </View>
              <View style={sheet.optionText}>
                <Text style={sheet.optionLabel}>Take a Photo</Text>
                <Text style={sheet.optionDesc}>Open camera to capture now</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={MUTED} />
            </TouchableOpacity>

            {/* Gallery option */}
            <TouchableOpacity
              style={sheet.option}
              onPress={() => activeSlot && pickFromGallery(activeSlot)}
              activeOpacity={0.8}
            >
              <View style={sheet.optionIcon}>
                <Ionicons name="images" size={22} color={ACCENT} />
              </View>
              <View style={sheet.optionText}>
                <Text style={sheet.optionLabel}>Choose from Gallery</Text>
                <Text style={sheet.optionDesc}>Pick an existing photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={MUTED} />
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity style={sheet.cancelBtn} onPress={closePicker}>
              <Text style={sheet.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── DocCard sub-component ─────────────────────────────────────────────────────
type SlotDef = { key: DocKey; label: string; icon: string; required: boolean };

function DocCard({
  slot,
  uri,
  onPick,
  onRemove,
}: {
  slot: SlotDef;
  uri: string | null;
  onPick: () => void;
  onRemove: () => void;
}) {
  const filled = Boolean(uri);

  return (
    <View style={cardStyles.wrapper}>
      <TouchableOpacity
        style={[cardStyles.card, filled && cardStyles.cardFilled]}
        onPress={onPick}
        activeOpacity={0.8}
      >
        {filled ? (
          <Image source={{ uri: uri! }} style={cardStyles.preview} resizeMode="cover" />
        ) : (
          <View style={cardStyles.placeholder}>
            <View style={cardStyles.iconCircle}>
              <Ionicons name={slot.icon as any} size={22} color={ACCENT} />
            </View>
            <Text style={cardStyles.placeholderLabel}>{slot.label}</Text>
            <Text style={cardStyles.tapHint}>Tap to upload</Text>
          </View>
        )}

        {/* Filled overlay with label */}
        {filled && (
          <View style={cardStyles.filledOverlay}>
            <View style={cardStyles.checkBadge}>
              <Ionicons name="checkmark" size={12} color={NAVY} />
            </View>
            <Text style={cardStyles.filledLabel}>{slot.label}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Remove button */}
      {filled && (
        <TouchableOpacity style={cardStyles.removeBtn} onPress={onRemove}>
          <Ionicons name="close" size={14} color={NAVY} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: NAVY,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SURFACE,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },
  heading: {
    color: TEXT,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  // Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: SURFACE,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT,
    borderRadius: 10,
  },
  progressLabel: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: "700",
  },
  // Section
  sectionLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  optionalTag: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  // Submit
  submitBtn: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitText: {
    color: NAVY,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  disclaimer: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
});

const cardStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 12,
  },
  card: {
    height: 120,
    backgroundColor: SURFACE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardFilled: {
    borderColor: ACCENT,
    borderWidth: 1.5,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,214,143,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  placeholderLabel: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "700",
  },
  tapHint: {
    color: MUTED,
    fontSize: 11,
  },
  // Filled state overlay
  filledOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(11,34,57,0.75)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  filledLabel: {
    color: TEXT,
    fontSize: 12,
    fontWeight: "600",
  },
  // Remove button
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

// ── Bottom Sheet Styles ───────────────────────────────────────────────────────
const sheet = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0F2A45",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: BORDER,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  sheetSub: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,214,143,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },
  optionDesc: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 6,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cancelText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "700",
  },
});