import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const FeatureCard = ({ icon, title }: { icon: string; title: string }) => (
    <View style={styles.featureCard}>
      <Ionicons name={icon as any} size={32} color="#228B22" />
      <Text style={styles.featureText}>{title}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.welcomeContainer}>
      <Image 
        source={require('../assets/images/ecotrack-logo.png')} 
        style={styles.welcomeImage}
      />
      <Text style={styles.title}>Track Your Carbon Footprint</Text>
      
      <View style={styles.featuresContainer}>
        <FeatureCard icon="car" title="Transport Tracking" />
        <FeatureCard icon="fast-food" title="Food Impact" />
        <FeatureCard icon="flash" title="Energy Usage" />
      </View>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.secondaryButtonText}>
          Already have an account? <Text style={styles.loginText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    backgroundColor: '#F5F5F5',
    paddingBottom: 40,
  },
  welcomeImage: {
    width: 200,              // resized width
    height: 200,             // resized height
    alignSelf: 'center',     // center the image
    resizeMode: 'contain',   // maintain aspect ratio
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    elevation: 2,
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#228B22',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
  loginText: {
    color: '#228B22',
    fontWeight: 'bold',
  },
});
