import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

const NAVY = '#0B2239';
const ACCENT = '#00D68F';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#EEF4FA';
const MUTED = 'rgba(200,220,235,0.55)';
const DANGER = '#FF4D4D';

// Replace this with your actual backend URL
const BASE_URL = 'https://your-backend.com/api';

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  reward: string;
};

export default function JobScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/workers/jobs`);
      if (response.status === 200) setJobs(response.data);
      else setError('Failed to load jobs.');
    } catch (err) {
      console.log(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/workers/jobs/${jobId}/accept`);
      if (response.status === 200) {
        Alert.alert('Success', 'Job accepted!');
        fetchJobs(); // Refresh job list
      } else {
        Alert.alert('Error', 'Could not accept job.');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Network error while accepting job.');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={ACCENT} />;

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: DANGER }}>{error}</Text>
        <TouchableOpacity onPress={fetchJobs} style={{ marginTop: 10 }}>
          <Text style={{ color: ACCENT }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  if (jobs.length === 0)
    return (
      <View style={styles.center}>
        <Text style={{ color: MUTED }}>No jobs available right now.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {jobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobDesc}>{job.description}</Text>
          <Text style={styles.jobInfo}>Location: {job.location}</Text>
          <Text style={styles.jobInfo}>Reward: {job.reward}</Text>

          <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAcceptJob(job.id)}>
            <Text style={styles.acceptBtnText}>Accept Job</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  jobCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  jobTitle: { color: TEXT, fontWeight: '700', fontSize: 16, marginBottom: 4 },
  jobDesc: { color: MUTED, fontSize: 14, marginBottom: 4 },
  jobInfo: { color: MUTED, fontSize: 12, marginBottom: 4 },
  acceptBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  acceptBtnText: { color: NAVY, fontWeight: '700' },
});