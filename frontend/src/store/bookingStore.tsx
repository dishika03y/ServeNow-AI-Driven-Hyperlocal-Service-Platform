import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "BOOKINGS_DB";

// create booking (like backend POST /bookings)
export const createBooking = async (booking: any) => {
  const existing = await getBookings();

  const newBooking = {
    id: Date.now().toString(),
    status: "SEARCHING",
    createdAt: new Date().toISOString(),
    ...booking,
  };

  const updated = [newBooking, ...existing];

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));

  return newBooking;
};

// get all bookings (like GET /bookings)
export const getBookings = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

// update booking status (like PATCH /bookings/:id)
export const updateBooking = async (id: string, updates: any) => {
  const bookings = await getBookings();

  const updated = bookings.map((b: any) =>
    b.id === id ? { ...b, ...updates } : b,
  );

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));

  return updated;
};
