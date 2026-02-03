import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ServiceDetails() {
  const { service } = useLocalSearchParams<{ service?: string }>();

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {service ?? 'Service Details'}
        </Text>
        <Text style={styles.subtitle}>
          Professional and verified service providers
        </Text>
      </View>

      {/* SERVICE INFO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Description</Text>
        <Text style={styles.text}>
          Our skilled professionals provide high-quality service at your doorstep.
          All workers are verified and trained for safety and reliability.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What’s Included</Text>
        <Text style={styles.text}>• Verified service provider</Text>
        <Text style={styles.text}>• Tools & basic equipment</Text>
        <Text style={styles.text}>• Service warranty</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Estimated Cost</Text>
        <Text style={styles.price}>₹ 500 – ₹ 1,200</Text>
        <Text style={styles.note}>
          Final price depends on work complexity
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Estimated Time</Text>
        <Text style={styles.text}>1 – 2 hours</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/customer/booking')}
      >
        <Text style={styles.buttonText}>Proceed to Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
  },
  note: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
