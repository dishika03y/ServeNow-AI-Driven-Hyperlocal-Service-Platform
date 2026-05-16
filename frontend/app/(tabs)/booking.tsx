import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

interface Booking {
  id: string;
  service: string;
  date: string;
  status: string;
  subtitle: string;
}

const historyData: Booking[] = [
  {
    id: '1',
    service: 'Home Cleaning',
    date: '02 Feb 2026',
    status: 'Completed',
    subtitle: 'Full home clean',
  },
  {
    id: '2',
    service: 'Plumber',
    date: '25 Jan 2026',
    status: 'Cancelled',
    subtitle: 'Pipes & leaks',
  },
  {
    id: '3',
    service: 'Electrician',
    date: '15 Jan 2026',
    status: 'Completed',
    subtitle: 'Wiring & repairs',
  },
];

const icons: Record<string, string> = {
  'Home Cleaning': '🧹',
  Plumber: '🔧',
  Electrician: '⚡',
};

const HistoryScreen = () => {
  const router = useRouter();

  const completed = historyData.filter(
    item => item.status === 'Completed',
  ).length;

  const cancelled = historyData.filter(
    item => item.status === 'Cancelled',
  ).length;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.smallText}>SERVENOW</Text>

        <Text style={styles.title}>
          My Bookings
        </Text>

        <Text style={styles.subtitle}>
          Premium services at your doorstep.
        </Text>
      </View>


      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder='Search bookings...'
          placeholderTextColor='#A5AAB5'
        />
      </View>


      {/* Stats */}
      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {historyData.length}
          </Text>

          <Text style={styles.statLabel}>
            Total
          </Text>
        </View>


        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {completed}
          </Text>

          <Text style={styles.statLabel}>
            Completed
          </Text>
        </View>


        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {cancelled}
          </Text>

          <Text style={styles.statLabel}>
            Cancelled
          </Text>
        </View>

      </View>


      {/* List */}
      <FlatList
        data={historyData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {

          const completed =
            item.status === 'Completed';

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/booking-detail',
                  params: {
                    bookingId: item.id,
                  },
                })
              }
            >

              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  {icons[item.service]}
                </Text>
              </View>


              <View style={{ flex: 1 }}>
                <Text style={styles.service}>
                  {item.service}
                </Text>

                <Text style={styles.serviceSub}>
                  {item.subtitle}
                </Text>

                <Text style={styles.date}>
                  {item.date}
                </Text>
              </View>


              <View
                style={[
                  styles.badge,
                  completed
                    ? styles.completed
                    : styles.cancelled,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: completed
                        ? '#00994D'
                        : '#E53935',
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>

            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  header: {
    marginBottom: 20,
  },

  smallText: {
    color: '#0B2A56',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 2,
  },

  title: {
    color: '#0B2A56',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 10,
  },

  subtitle: {
    color: '#8B9098',
    marginTop: 6,
  },

  searchBox: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 2,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  statCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 2,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B2A56',
  },

  statLabel: {
    marginTop: 5,
    color: '#8B9098',
    fontSize: 12,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },

  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#F4F5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  icon: {
    fontSize: 24,
  },

  service: {
    color: '#0B2A56',
    fontWeight: '700',
    fontSize: 17,
  },

  serviceSub: {
    color: '#8B9098',
    marginTop: 3,
    fontSize: 13,
  },

  date: {
    color: '#B0B5BE',
    marginTop: 4,
    fontSize: 12,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  completed: {
    backgroundColor: '#E8FFF2',
  },

  cancelled: {
    backgroundColor: '#FFF1F1',
  },

  badgeText: {
    fontWeight: '600',
    fontSize: 12,
  },

});