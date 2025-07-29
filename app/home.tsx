import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoTrack Dashboard</Text>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/track')}
        >
          <Ionicons name="add-circle" size={32} color="#228B22" />
          <Text style={styles.actionText}>Track Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/insights')}
        >
          <Ionicons name="stats-chart" size={32} color="#228B22" />
          <Text style={styles.actionText}>View Insights</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/community')}
        >
          <Ionicons name="people" size={32} color="#228B22" />
          <Text style={styles.actionText}>Community</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation to Profile */}
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => router.push('/profile')}
      >
        <Ionicons name="person" size={24} color="white" />
        <Text style={styles.profileButtonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '45%',
    elevation: 3,
  },
  actionText: {
    marginTop: 10,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#228B22',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  profileButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
