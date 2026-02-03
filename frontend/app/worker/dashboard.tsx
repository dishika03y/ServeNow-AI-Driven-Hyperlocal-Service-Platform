import { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type Job = {
  id: string;
  customer: string;
  service: string;
  location: string;
  role: string;
};

type WorkerCategory = {
  role: string;
  icon: string;
};

export default function WorkerDashboard() {
  const isVerified = true;
  const scrollY = useRef(new Animated.Value(0)).current;

  const workerCategories: WorkerCategory[] = [
    { role: 'Electrician', icon: '⚡' },
    { role: 'Plumber', icon: '💧' },
    { role: 'Carpenter', icon: '🪚' },
    { role: 'Painter', icon: '🎨' },
  ];

  const workerNames: { [role: string]: string } = {
    Electrician: 'Ramesh',
    Plumber: 'Sohan',
    Carpenter: 'Aakash',
    Painter: 'Neelam',
  };

  const allJobs: Job[] = [
    { id: '1', customer: 'Amit', service: 'AC Repair', location: 'Delhi', role: 'Electrician' },
    { id: '2', customer: 'Neha', service: 'Wiring Fix', location: 'Noida', role: 'Electrician' },
    { id: '3', customer: 'Ravi', service: 'Fan Installation', location: 'Gurgaon', role: 'Electrician' },
    { id: '4', customer: 'Priya', service: 'Light Fixture Repair', location: 'Faridabad', role: 'Electrician' },
    { id: '5', customer: 'Sohan', service: 'Pipe Leakage', location: 'Delhi', role: 'Plumber' },
    { id: '6', customer: 'Kavita', service: 'Drain Cleaning', location: 'Noida', role: 'Plumber' },
    { id: '7', customer: 'Aakash', service: 'Furniture Repair', location: 'Gurgaon', role: 'Carpenter' },
    { id: '8', customer: 'Neelam', service: 'Wall Painting', location: 'Delhi', role: 'Painter' },
  ];

  const [selectedWorkerRole, setSelectedWorkerRole] = useState<string>('Electrician');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const jobsForWorker = allJobs.filter((job) => job.role === selectedWorkerRole);
  const filteredJobs = selectedService
    ? jobsForWorker.filter((job) => job.service === selectedService)
    : jobsForWorker;

  const serviceCounts: { service: string; count: number }[] = Array.from(
    jobsForWorker.reduce((acc, job) => {
      acc.set(job.service, (acc.get(job.service) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([service, count]) => ({ service, count }));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 100],
    extrapolate: 'clamp',
  });
  const nameScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  const statsScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  // Animation values for each worker button
  const buttonScales = useRef(workerCategories.map(() => new Animated.Value(1))).current;

  const animateButton = (index: number) => {
    buttonScales.forEach((scale, i) => {
      Animated.spring(scale, {
        toValue: i === index ? 1.1 : 1, // selected button grows
        useNativeDriver: true,
        friction: 6,
        tension: 150,
      }).start();
    });
  };

  useEffect(() => {
    const selectedIndex = workerCategories.findIndex((cat) => cat.role === selectedWorkerRole);
    animateButton(selectedIndex);
  }, [selectedWorkerRole]);

  return (
    <View style={styles.container}>
      {/* Collapsible Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.Text style={[styles.name, { transform: [{ scale: nameScale }] }]}>
            Welcome, {workerNames[selectedWorkerRole]} 👋
          </Animated.Text>
          <Animated.Text style={[styles.role, { transform: [{ scale: nameScale }] }]}>
            {selectedWorkerRole}
          </Animated.Text>
          {isVerified ? (
            <Animated.Text style={[styles.verified, { transform: [{ scale: nameScale }] }]}>
              ✅ Verified Worker
            </Animated.Text>
          ) : (
            <Animated.Text style={[styles.pending, { transform: [{ scale: nameScale }] }]}>
              ⏳ Verification Pending
            </Animated.Text>
          )}

          <Animated.View style={[styles.stats, { transform: [{ scale: statsScale }] }]}>
            <StatBox title="Jobs" value={`${jobsForWorker.length}`} />
            <StatBox title="Rating" value="4.6 ⭐" />
            <StatBox title="Earnings" value="₹12,500" />
          </Animated.View>
        </SafeAreaView>
      </Animated.View>

      {/* Worker Categories Menu with animation */}
      <View style={styles.workerMenu}>
        {workerCategories.map((cat, index) => (
          <Animated.View
            key={cat.role}
            style={{ transform: [{ scale: buttonScales[index] }] }}
          >
            <TouchableOpacity
              style={[
                styles.workerBtn,
                { width: width / workerCategories.length - 16 },
                selectedWorkerRole === cat.role ? styles.workerBtnActive : {},
              ]}
              onPress={() => {
                setSelectedWorkerRole(cat.role);
                setSelectedService(null);
              }}
            >
              <Text style={styles.workerIcon}>{cat.icon}</Text>
              <Text style={styles.workerText}>{cat.role}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Jobs Section */}
      <Animated.ScrollView
        style={styles.jobContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
            <TouchableOpacity
              style={[styles.filterBtn, !selectedService && styles.filterBtnActive]}
              onPress={() => setSelectedService(null)}
            >
              <Text style={styles.filterText}>All ({jobsForWorker.length})</Text>
            </TouchableOpacity>
            {serviceCounts.map(({ service, count }) => (
              <TouchableOpacity
                key={service}
                style={[styles.filterBtn, selectedService === service && styles.filterBtnActive]}
                onPress={() => setSelectedService(service)}
              >
                <Text style={styles.filterText}>{service} ({count})</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>New Job Requests</Text>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} customer={job.customer} service={job.service} location={job.location} />
          ))
        ) : (
          <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 20 }}>
            No jobs found for this role.
          </Text>
        )}

        <View style={{ height: 80 }} />
      </Animated.ScrollView>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/auth/login')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* Components */
function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function JobCard({ customer, service, location }: { customer: string; service: string; location: string }) {
  return (
    <View style={styles.jobCard}>
      <Text style={styles.jobText}>{customer} • {service}</Text>
      <Text style={styles.jobLocation}>📍 {location}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.acceptBtn}>
          <Text style={styles.actionText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn}>
          <Text style={styles.actionText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F2FE' },
  header: { backgroundColor: '#0A2540', paddingHorizontal: 20, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  name: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  role: { color: '#CBD5E1', fontSize: 16, marginBottom: 6 },
  verified: { color: '#22C55E', fontWeight: '600', marginBottom: 12 },
  pending: { color: '#FACC15', marginBottom: 12 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statBox: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, width: '30%', alignItems: 'center', elevation: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#0A2540' },
  statTitle: { fontSize: 12, color: '#64748B', marginTop: 4 },

  workerMenu: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 8 },

  workerBtn: {
    paddingVertical: 12,
    backgroundColor: '#CBD5E1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerBtnActive: { backgroundColor: '#0A2540' },
  workerIcon: { fontSize: 22, marginBottom: 4 },
  workerText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14, textAlign: 'center' },

  jobContainer: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
  filterContainer: { backgroundColor: '#E0F2FE', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#0A2540' },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#CBD5E1', borderRadius: 12, marginRight: 10 },
  filterBtnActive: { backgroundColor: '#0A2540' },
  filterText: { color: '#FFFFFF', fontWeight: '600' },
  jobCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 3 },
  jobText: { fontWeight: '600', color: '#0A2540' },
  jobLocation: { color: '#64748B', marginVertical: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  acceptBtn: { backgroundColor: '#22C55E', padding: 10, borderRadius: 10, width: '48%' },
  rejectBtn: { backgroundColor: '#EF4444', padding: 10, borderRadius: 10, width: '48%' },
  actionText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
  logoutBtn: { backgroundColor: '#DC2626', padding: 14, borderRadius: 14, margin: 20 },
  logoutText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
});
