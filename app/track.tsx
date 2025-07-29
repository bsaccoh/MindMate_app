import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../firebase/firebase';
import { saveActivity, EMISSION_FACTORS } from './services/activityService';
import { router } from 'expo-router';

export default function TrackActivityScreen() {
  const [type, setType] = useState<'transport' | 'food' | 'energy'>('transport');
  const [description, setDescription] = useState('');
  const [formData, setFormData] = useState({
    distance: '',
    vehicleType: 'car',
    foodType: 'beef',
    quantity: '',
    energyType: 'electricity',
    kwh: ''
  });

  const calculateFootprint = () => {
    switch (type) {
      case 'transport':
        return (Number(formData.distance) || 0) * 
               (EMISSION_FACTORS.transport[formData.vehicleType] || 0);
      case 'food':
        return ((Number(formData.quantity) || 0) / 1000) * 
               (EMISSION_FACTORS.food[formData.foodType] || 0);
      case 'energy':
        return (Number(formData.kwh) || 0) * 
               (EMISSION_FACTORS.energy[formData.energyType] || 0);
      default:
        return 0;
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser?.uid) {
      Alert.alert('Error', 'Please login to track activities');
      return router.push('/login');
    }

    if (!description.trim()) {   // Trim to avoid spaces only
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const footprint = calculateFootprint();
    const activity = {
      userId: auth.currentUser.uid,
      type,
      description,
      carbonFootprint: parseFloat(footprint.toFixed(2)),
      details: { ...formData }
    };

    console.log('Submitting activity:', activity); // Debug log

    const success = await saveActivity(activity);
    if (success) {
      Alert.alert('Success', 'Activity saved successfully!');
      // Reset form
      setDescription('');
      setFormData({
        distance: '',
        vehicleType: 'car',
        foodType: 'beef',
        quantity: '',
        energyType: 'electricity',
        kwh: ''
      });
    } else {
      Alert.alert('Error', 'Failed to save activity');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Activity</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Activity Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value)}
          >
            <Picker.Item label="Transport" value="transport" />
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Energy" value="energy" />
          </Picker>
        </View>
      </View>

      {/* Transport Fields */}
      {type === 'transport' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Distance (km)</Text>
            <TextInput
              style={styles.input}
              value={formData.distance}
              onChangeText={(text) => setFormData({...formData, distance: text})}
              keyboardType="numeric"
              placeholder="Enter distance"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.vehicleType}
                onValueChange={(value) => setFormData({...formData, vehicleType: value})}
              >
                {Object.keys(EMISSION_FACTORS.transport).map((key) => (
                  <Picker.Item key={key} label={key} value={key} />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}

      {/* Food Fields */}
      {type === 'food' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantity (grams)</Text>
            <TextInput
              style={styles.input}
              value={formData.quantity}
              onChangeText={(text) => setFormData({...formData, quantity: text})}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Food Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.foodType}
                onValueChange={(value) => setFormData({...formData, foodType: value})}
              >
                {Object.keys(EMISSION_FACTORS.food).map((key) => (
                  <Picker.Item key={key} label={key} value={key} />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}

      {/* Energy Fields */}
      {type === 'energy' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>kWh</Text>
            <TextInput
              style={styles.input}
              value={formData.kwh}
              onChangeText={(text) => setFormData({...formData, kwh: text})}
              keyboardType="numeric"
              placeholder="Enter kWh used"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Energy Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.energyType}
                onValueChange={(value) => setFormData({...formData, energyType: value})}
              >
                {Object.keys(EMISSION_FACTORS.energy).map((key) => (
                  <Picker.Item key={key} label={key} value={key} />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}

      {/* **Description Input Field** */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    fontWeight: '500'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#228B22',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
