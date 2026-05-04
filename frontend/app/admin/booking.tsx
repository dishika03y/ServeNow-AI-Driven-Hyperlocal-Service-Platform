import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getBookings } from "@/src/store/bookingStore";

const NAVY = "#081F5C";
const CREAM = "#F7F2EB";
const WHITE = "#fff";

export default function BookingScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getBookings();
    setBookings(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      <ScrollView>
        {bookings.length === 0 ? (
          <Text style={styles.empty}>No bookings yet</Text>
        ) : (
          bookings.map((b: any) => (
            <View key={b.id} style={styles.card}>
              <Text style={styles.service}>{b.service}</Text>

              <Text style={styles.worker}>{b.worker}</Text>

              <Text style={styles.status}>Status: {b.status}</Text>

              <Text style={styles.price}>{b.price}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM, padding: 20 },
  title: { fontSize: 22, fontWeight: "800", color: NAVY, marginBottom: 20 },

  card: {
    backgroundColor: WHITE,
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
  },

  service: { fontSize: 16, fontWeight: "700", color: NAVY },
  worker: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  status: { marginTop: 8, fontWeight: "600", color: NAVY },
  price: { marginTop: 6, fontWeight: "800", color: NAVY },

  empty: { textAlign: "center", marginTop: 40, opacity: 0.5 },
});
