// components/ui/InputField.tsx
import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

const InputField = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return <TextInput {...props} ref={ref} style={[styles.input, props.style]} />;
});


export default InputField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
  },
});

