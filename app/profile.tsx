import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/welcome');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.warn('No user profile found');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace('/welcome');
          } catch (error) {
            Alert.alert('Logout Error', 'Failed to sign out. Please try again.');
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Failed to load profile.</Text>
        <TouchableOpacity onPress={() => router.replace('/welcome')}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="white" />
        </View>
        <Text style={styles.name}>{userData.name || 'John Doe'}</Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
        <Text style={styles.memberSince}>Member since: June 2024</Text>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <Text style={styles.item}>Total Footprint: {userData.totalFootprint || '120'} kg</Text>
        <Text style={styles.item}>Reduction: {userData.reduction || '15%'} </Text>
        <Text style={styles.item}>Streak: {userData.streak || '7'} days</Text>
      </View>

      {/* Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Goals</Text>
        <Text style={styles.item}>Daily: {'<'} {userData.dailyGoal || '8'} kg</Text>
        <Text style={styles.item}>Weekly: {'<'} {userData.weeklyGoal || '50'} kg</Text>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.link}><Text>Account Settings</Text></TouchableOpacity>
        <TouchableOpacity style={styles.link}><Text>Notifications</Text></TouchableOpacity>
        <TouchableOpacity style={styles.link}><Text>Privacy</Text></TouchableOpacity>
        <TouchableOpacity style={styles.link}><Text>Help & Support</Text></TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 16,
    color: '#666',
  },
  retryText: {
    marginTop: 10,
    color: '#228B22',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#228B22',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  memberSince: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
  link: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButton: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
