import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

/* List of services (add/remove as needed) */
const services = [
  "Electrician",
  "Plumber",
  "AC Repair",
  "Cleaning",
  "Carpenter",
  "Appliance Repair",
  "Painter",
  "Gardening",
  "Pest Control",
  "Laundry",
  "Home Security",
  "Moving/Transport",
];

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <Text style={styles.subtitle}>Find trusted services near you</Text>
      </View>

      {/* Services Grid */}
      <View style={styles.services}>
        {services.map((service) => (
          <ServiceCard key={service} title={service} />
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace('/auth/login')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* Service Card Component */
function ServiceCard({ title }: { title: string }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/customer/service-list')}
    >
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A2540',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 4,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 4,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A2540',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 14,
    marginTop: 30,
  },
  logoutText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
