import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

export default function Layout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#228B22',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Create Account',
          headerBackTitle: 'Back',
        }} 
      />

      {/* Main App Screens */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'My Profile',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}