// complaints.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Complaints() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Worker was late</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={{ color:'#fff' }}>Resolve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  card:{ backgroundColor:'#1E3A5F', padding:15, borderRadius:10 },
  text:{ color:'#fff' },
  btn:{ backgroundColor:'#00C897', marginTop:10, padding:10, borderRadius:5 }
});