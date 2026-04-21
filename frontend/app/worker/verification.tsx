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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "@/src/api/api";

const ACCENT = "#00D68F";
const NAVY = "#0B2239";
const SURFACE = "rgba(255,255,255,0.07)";
const TEXT = "#EEF4FA";

export default function Verification() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<any>({
    aadhaar_front: null,
    aadhaar_back: null,
    selfie: null,
    portfolio_1: null,
    portfolio_2: null,
  });

  const pickImage = async (key: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setDocs({ ...docs, [key]: result.assets[0].uri });
    }
  };

  const uploadDocuments = async () => {
    if (!docs.aadhaar_front || !docs.aadhaar_back || !docs.selfie) {
      return Alert.alert(
        "Missing Info",
        "Please upload Aadhaar (Front/Back) and a Selfie.",
      );
    }

    setLoading(true);
    const formData = new FormData();

    // Append core files
    Object.keys(docs).forEach((key) => {
      if (docs[key]) {
        formData.append(key, {
          uri: docs[key],
          name: `${key}.jpg`,
          type: "image/jpeg",
        } as any);
      }
    });

    try {
      await apiRequest("/workers/upload-documents", "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Success", "Documents uploaded! Pending Admin Verification.");
      router.replace("/worker/pending-status");
    } catch (err) {
      Alert.alert(
        "Upload Failed",
        "Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.header}>Verification</Text>
      <Text style={styles.subHeader}>
        Upload required documents to start your work journey.
      </Text>

      {/* Grid for Inputs */}
      {[
        "aadhaar_front",
        "aadhaar_back",
        "selfie",
        "portfolio_1",
        "portfolio_2",
      ].map((key) => (
        <TouchableOpacity
          key={key}
          style={styles.uploadCard}
          onPress={() => pickImage(key)}
        >
          {docs[key] ? (
            <Image source={{ uri: docs[key] }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera" size={24} color={ACCENT} />
              <Text style={styles.placeholderText}>
                {key.replace("_", " ").toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={uploadDocuments}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={NAVY} />
        ) : (
          <Text style={styles.submitText}>Submit for Verification</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 22 },
  scroll: { paddingBottom: 50 },
  header: { color: TEXT, fontSize: 24, fontWeight: "800", marginTop: 40 },
  subHeader: { color: "rgba(255,255,255,0.6)", marginBottom: 20 },
  uploadCard: {
    height: 120,
    backgroundColor: SURFACE,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  preview: { width: "100%", height: "100%" },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: {
    color: ACCENT,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  submitBtn: {
    backgroundColor: ACCENT,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: NAVY, fontWeight: "800", fontSize: 16 },
});
