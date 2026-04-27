import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getWorkerDetails } from '../../src/api/admin';

export default function WorkerDetail() {
  const { id } = useLocalSearchParams();
  const [worker, setWorker] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getWorkerDetails(id as string);
      setWorker(data);
    };
    fetch();
  }, []);

  if (!worker) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{worker.name}</Text>
      <Text style={styles.text}>Skill: {worker.skill}</Text>
      <Text style={styles.text}>AI Score: {worker.ai_score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22 },
  text:{ color:'#A0AEC0', marginTop:10 }
});