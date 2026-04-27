// analytics.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Analytics() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Top Service: Cleaning</Text>
        <Text style={styles.text}>Peak Time: 6PM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  card:{ backgroundColor:'#1E3A5F', padding:15, borderRadius:10 },
  text:{ color:'#fff' }
});