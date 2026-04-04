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
import axios from 'axios';

// Colors
const NAVY = '#0B2239';
const ACCENT = '#00D68F';
const ACCENT_BDR = 'rgba(0,214,143,0.25)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#EEF4FA';
const MUTED = 'rgba(200,220,235,0.55)';
const DANGER = '#FF4D4D';
const DANGER_BDR = 'rgba(255,77,77,0.22)';

type VerifyState = 'idle' | 'verifying' | 'success' | 'failed';

// Replace this with your actual backend URL
const BASE_URL = 'https://your-backend.com/api';

export default function WorkerVerification() {
  const [image, setImage] = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');

  // Open camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to capture your ID.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Open gallery
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Call backend API to verify ID
  const handleVerify = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please capture or upload an ID image first.');
      return;
    }

    setVerifyState('verifying');

    try {
      const formData = new FormData();
      formData.append('id_image', { uri: image, type: 'image/jpeg', name: 'id.jpg' } as any);

      const response = await axios.post(`${BASE_URL}/workers/verify-face`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setVerifyState('success');
      } else {
        setVerifyState('failed');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Verification failed. Please try again.');
      setVerifyState('failed');
    }
  };

  const handleRetake = () => {
    setImage(null);
    setVerifyState('idle');
  };

  const handleContinue = () => {
    router.push('/(worker-tabs)/dashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: TEXT }}>ID Verification</Text>
      </View>

      {image ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          {verifyState === 'verifying' && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color={ACCENT} />
              <Text style={{ color: TEXT }}>Verifying your ID…</Text>
            </View>
          )}
          {verifyState === 'success' && (
            <View style={styles.overlay}>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: ACCENT }}>✓</Text>
              <Text style={{ color: ACCENT, fontWeight: '600' }}>ID Verified!</Text>
            </View>
          )}
          {verifyState === 'failed' && (
            <View style={styles.overlay}>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: DANGER }}>✗</Text>
              <Text style={{ color: DANGER, fontWeight: '600' }}>Verification Failed</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ fontSize: 36 }}>🪪</Text>
          <Text style={{ color: MUTED }}>No photo captured yet</Text>
        </View>
      )}

      <View style={{ margin: 20 }}>
        {!image && (
          <>
            <TouchableOpacity style={styles.btn} onPress={openCamera}>
              <Text style={styles.btnText}>📸 Capture ID Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { marginTop: 10 }]} onPress={openGallery}>
              <Text style={styles.btnText}>🖼️ Upload from Gallery</Text>
            </TouchableOpacity>
          </>
        )}
        {image && verifyState === 'idle' && (
          <>
            <TouchableOpacity style={styles.btn} onPress={handleVerify}>
              <Text style={styles.btnText}>🔍 Verify ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { marginTop: 10 }]} onPress={handleRetake}>
              <Text style={styles.btnText}>🔄 Retake Photo</Text>
            </TouchableOpacity>
          </>
        )}
        {verifyState === 'success' && (
          <TouchableOpacity style={styles.btn} onPress={handleContinue}>
            <Text style={styles.btnText}>🚀 Continue to Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  previewWrap: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    height: 240,
    position: 'relative',
  },
  previewImage: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,34,57,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    margin: 20,
    height: 200,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: ACCENT,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: NAVY, fontWeight: '700', fontSize: 16 },
});