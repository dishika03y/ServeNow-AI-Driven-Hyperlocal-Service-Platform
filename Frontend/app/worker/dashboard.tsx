import { View, Text, StyleSheet } from 'react-native';

export default function WorkerDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Dashboard</Text>
      <Text style={styles.text}>
        Welcome! Manage your jobs and track your work here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
