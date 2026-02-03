// import { View, Text, StyleSheet } from 'react-native';
// import PrimaryButton from '../../components/ui/PrimaryButton';
// import { useRouter, useSearchParams } from 'expo-router';

// export default function JobDetail() {
//   const router = useRouter();
//   const { jobId } = useSearchParams();

//   const job = {
//     id: jobId,
//     service: 'Plumbing',
//     customer: 'John Doe',
//     address: '123 Main St, City',
//     time: '2026-02-03 10:00 AM',
//     status: 'Assigned',
//   };

//   const handleStartJob = () => {
//     console.log('Starting job:', job.id);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Job Detail</Text>
//       <Text>Service: {job.service}</Text>
//       <Text>Customer: {job.customer}</Text>
//       <Text>Address: {job.address}</Text>
//       <Text>Time: {job.time}</Text>
//       <Text>Status: {job.status}</Text>
//       <PrimaryButton title="Start Job" onPress={handleStartJob} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
//   title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
// });
