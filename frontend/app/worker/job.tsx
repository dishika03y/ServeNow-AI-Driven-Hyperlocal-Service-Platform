import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

type Job = {
  id: string;
  customer: string;
  service: string;
  location: string;
  status: 'pending' | 'accepted' | 'completed';
};

/* Dummy data for now, later comes from backend */
const dummyJobs: Job[] = [
  { id: '1', customer: 'Amit', service: 'AC Repair', location: 'Delhi', status: 'pending' },
  { id: '2', customer: 'Neha', service: 'Wiring Fix', location: 'Noida', status: 'pending' },
  { id: '3', customer: 'Ramesh', service: 'Plumbing', location: 'Gurgaon', status: 'accepted' },
];

export default function WorkerJobs() {
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);

  const handleAccept = (id: string) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === id ? { ...job, status: 'accepted' } : job
      )
    );
  };

  const handleReject = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Jobs</Text>

      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onAccept={() => handleAccept(item.id)}
            onReject={() => handleReject(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
}

/* Job Card Component */
function JobCard({
  job,
  onAccept,
  onReject,
}: {
  job: Job;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.customer}>{job.customer}</Text>
      <Text style={styles.service}>{job.service}</Text>
      <Text style={styles.location}>📍 {job.location}</Text>

      {job.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {job.status === 'accepted' && (
        <Text style={styles.acceptedText}>✅ Job Accepted</Text>
      )}

      {job.status === 'completed' && (
        <Text style={styles.completedText}>✔ Completed</Text>
      )}
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
    marginBottom: 20,
    color: '#0A2540',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
  },
  customer: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2540',
  },
  service: {
    color: '#334155',
    marginTop: 4,
  },
  location: {
    color: '#64748B',
    marginVertical: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    backgroundColor: '#22C55E',
    padding: 10,
    borderRadius: 12,
    width: '48%',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 12,
    width: '48%',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  acceptedText: {
    color: '#22C55E',
    fontWeight: '700',
    marginTop: 6,
  },
  completedText: {
    color: '#0A2540',
    fontWeight: '700',
    marginTop: 6,
  },
});
