import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function WorkerVerification() {
  const [image, setImage] = useState<string | null>(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.text}>Capture ID Photo</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0A2540',
    padding: 16,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  preview: {
    width: 250,
    height: 250,
    marginTop: 20,
    borderRadius: 12,
  },
});
