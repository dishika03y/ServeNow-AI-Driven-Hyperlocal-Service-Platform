// services.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Services() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services Management</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Total Services: 15</Text>
        <Text style={styles.text}>Active: 12</Text>
        <Text style={styles.text}>Inactive: 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  card:{ backgroundColor:'#1E3A5F', padding:15, borderRadius:10 },
  text:{ color:'#fff', marginBottom:5 }
});
