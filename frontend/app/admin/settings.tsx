// settings.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>App Configuration</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B2239', padding:20 },
  title:{ color:'#fff', fontSize:22, marginBottom:20 },
  btn:{ backgroundColor:'#00C897', padding:15, borderRadius:10, marginBottom:10 },
  btnText:{ color:'#fff', textAlign:'center', fontSize:16 }
});
