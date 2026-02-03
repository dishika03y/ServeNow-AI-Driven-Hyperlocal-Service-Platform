import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

type Worker = {
  id: string;
  name: string;
  service: string;
  rating: number;
  verified: boolean;
  location: string;
};

/* Dummy data (later comes from backend) */
const workers: Worker[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    service: 'Electrician',
    rating: 4.6,
    verified: true,
    location: 'Delhi',
  },
  {
    id: '2',
    name: 'Suresh Yadav',
    service: 'Electrician',
    rating: 4.2,
    verified: false,
    location: 'Noida',
  },
  {
    id: '3',
    name: 'Amit Singh',
    service: 'Electrician',
    rating: 4.8,
    verified: true,
    location: 'Gurgaon',
  },
];

export default function ServiceList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Electricians</Text>

      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WorkerCard worker={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* Worker Card */
function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{worker.name}</Text>
        {worker.verified && <Text style={styles.verified}>✅ Verified</Text>}
      </View>

      <Text style={styles.info}>
        {worker.service} • ⭐ {worker.rating}
      </Text>

      <Text style={styles.location}>📍 {worker.location}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/customer/booking")}

      >
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A2540',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2540',
  },
  verified: {
    color: '#22C55E',
    fontWeight: '600',
  },
  info: {
    color: '#334155',
    marginTop: 4,
  },
  location: {
    color: '#64748B',
    marginVertical: 6,
  },
  button: {
    backgroundColor: '#0A2540',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
