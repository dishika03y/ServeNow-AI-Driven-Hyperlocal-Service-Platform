import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WorkerEarnings() {
  // Dummy earnings data
  const earningsData = [
    { month: 'January', earnings: 12000 },
    { month: 'February', earnings: 15000 },
    { month: 'March', earnings: 10000 },
  ];

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Earnings</Text>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total Earnings</Text>
        <Text style={styles.totalAmount}>₹ {totalEarnings}</Text>
      </View>

      {earningsData.map((item) => (
        <View key={item.month} style={styles.earningCard}>
          <Text style={styles.month}>{item.month}</Text>
          <Text style={styles.amount}>₹ {item.earnings}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A2540',
    marginBottom: 20,
  },
  totalBox: {
    backgroundColor: '#0A2540',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalText: {
    color: '#CBD5E1',
    fontWeight: '600',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  earningCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  month: {
    fontWeight: '600',
    color: '#0A2540',
  },
  amount: {
    fontWeight: '700',
    color: '#22C55E',
  },
});
