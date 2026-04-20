import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const user = await AsyncStorage.getItem('userProfile');

    if (!token || !user) {
      setRoute('/auth/login');
      return;
    }

    // ✅ Logged in → check role
    const parsedUser = JSON.parse(user);

    if (parsedUser.role === 'admin') {
      setRoute('/admin/dashboard');
    } else if (parsedUser.role === 'worker') {
      setRoute('/worker');
    } else {
      setRoute('/customer/Customerdashboard');
    }
  };

  if (!route) return null;

  return <Redirect href={route} />;
}