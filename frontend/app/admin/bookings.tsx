// bookings.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Bookings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Home Cleaning</Text>
        <Text style={styles.sub}>John Doe</Text>
        <Text style={styles.price}>₹500</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  card:{ backgroundColor:'#1E3A5F', padding:15, borderRadius:10 },
  text:{ color:'#fff' },
  sub:{ color:'#A0AEC0' },
  price:{ color:'#00C897', marginTop:10 }
});