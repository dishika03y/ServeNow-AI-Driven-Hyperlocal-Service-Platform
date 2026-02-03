import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';

const SERVICES = [
  { id: '1', title: 'Plumber', icon: '🛠️' },
  { id: '2', title: 'Electrician', icon: '⚡' },
  { id: '3', title: 'Housekeeping', icon: '🧹' },
  { id: '4', title: 'Delivery Boy', icon: '🛵' },
  { id: '5', title: 'Gardener', icon: '🌱' },
  { id: '6', title: 'Carpenter', icon: '🪚' },
];

const JOBS = [
  { id: '1', title: 'Pipe Leakage Repair', location: 'Sector 21', pay: '₹600' },
  { id: '2', title: 'House Cleaning', location: 'MG Road', pay: '₹1,200' },
  { id: '3', title: 'Electrical Fan Installation', location: 'Phase 2', pay: '₹800' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Find Work. Earn Daily. Live Better.
        </Text>
        <Text style={styles.heroSubtitle}>
          ServeNow connects blue-collar workers with nearby job opportunities.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/customer/booking')}
        >
          <Text style={styles.primaryButtonText}>Find Jobs Near Me</Text>
        </TouchableOpacity>
      </View>

      {/* SERVICES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Categories</Text>

        <View style={styles.serviceGrid}>
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() =>
                router.push({
                  pathname: '/customer/service-details',
                  params: { service: service.title },
                })
              }
            >
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceText}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* HOW IT WORKS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Register with your basic details</Text>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Choose your skill & location</Text>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Accept nearby jobs & earn money</Text>
        </View>
      </View>

      {/* FEATURED JOBS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Jobs</Text>

        {JOBS.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobLocation}>{job.location}</Text>
            </View>

            <View style={styles.jobRight}>
              <Text style={styles.jobPay}>{job.pay}</Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/customer/booking')}
              >
                <Text style={styles.secondaryButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* CTA BANNER */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Get Work on Your Phone</Text>
        <Text style={styles.ctaText}>
          Register on ServeNow and start earning today.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/auth/signup')}
        >
          <Text style={styles.primaryButtonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  hero: {
    backgroundColor: '#2563EB',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#E0E7FF',
    marginVertical: 10,
  },

  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0F172A',
  },

  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  serviceIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '500',
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  stepNumber: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#334155',
  },

  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  jobLocation: {
    fontSize: 13,
    color: '#64748B',
  },
  jobRight: {
    alignItems: 'flex-end',
  },
  jobPay: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 6,
  },

  primaryButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  cta: {
    backgroundColor: '#1E3A8A',
    padding: 20,
    margin: 16,
    borderRadius: 16,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  ctaText: {
    color: '#CBD5E1',
    marginVertical: 8,
  },
});
