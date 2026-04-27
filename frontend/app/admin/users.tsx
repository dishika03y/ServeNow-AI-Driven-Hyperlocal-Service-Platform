// users.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const users = [{ id:1, name:'John Doe' }];

export default function Users() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>

      {users.map(u => (
        <View key={u.id} style={styles.card}>
          <Text style={styles.text}>{u.name}</Text>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Block</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  card:{ backgroundColor:'#1E3A5F', padding:15, borderRadius:10, marginBottom:10 },
  text:{ color:'#fff' },
  btn:{ backgroundColor:'#FF5C5C', padding:8, marginTop:10, borderRadius:5 },
  btnText:{ color:'#fff', textAlign:'center' }
});