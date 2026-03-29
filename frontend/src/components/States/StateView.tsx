import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import colors  from "@/src/components/constants/colours";

export function LoadingState({ text = "Loading..." }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.light.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    color: colors.light.text,
  },
});