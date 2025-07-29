import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return isAuthenticated ? <Redirect href="/home" /> : <Redirect href="/welcome" />;
}