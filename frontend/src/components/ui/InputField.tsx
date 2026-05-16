import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Extending TextInputProps allows keyboardType, autoCapitalize, etc.
interface Props extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  ...rest // This captures keyboardType and other props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>

      <View style={[styles.inputWrapper, isFocused && styles.focusedInput]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest} // Spreads keyboardType and others here
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 50,
  },
  focusedInput: {
    borderColor: "#2563EB",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
  iconContainer: {
    paddingLeft: 10,
  },
});
