import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function SplashScreen() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/welcome');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#228B22' }}>
      <Text style={{ fontSize: 24, color: 'white', marginBottom: 20 }}>EcoTrack</Text>
      <ActivityIndicator size="large" color="white" />
      <Text style={{ color: 'white', marginTop: 20 }}>Loading...</Text>
    </View>
  );
}