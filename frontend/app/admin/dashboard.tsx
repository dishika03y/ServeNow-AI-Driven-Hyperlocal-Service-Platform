// dashboard.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.card}><Text style={styles.text}>Users: 120</Text></View>
      <View style={styles.card}><Text style={styles.text}>Workers: 80</Text></View>
      <View style={styles.card}><Text style={styles.text}>Jobs: 25</Text></View>
      <View style={styles.card}><Text style={styles.text}>Revenue: ₹45K</Text></View>
    </View>
  );
}

const COLORS = { bg:'#0B2239', card:'#1E3A5F', text:'#fff' };

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:COLORS.bg, padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  card:{ backgroundColor:COLORS.card, padding:15, borderRadius:10, marginBottom:10 },
  text:{ color:'#fff' }
});   
// export default function Dashboard() {
//   return (
//     <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ color: 'white' }}>DASHBOARD WORKING</Text>
//     </View>
//   );
// }