import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export default function JobCard({
  service,
  status,
  subtitle,
}: {
  service: string;
  status: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.service}>{service}</Text>
      {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      <Text style={[styles.status, styles[status]]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles: any = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  service: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  sub: {
    marginTop: 4,
    color: COLORS.muted,
  },
  status: {
    marginTop: 8,
    fontWeight: "600",
  },
  pending: { color: "#F59E0B" },
  accepted: { color: "#2563EB" },
  completed: { color: COLORS.success },
});