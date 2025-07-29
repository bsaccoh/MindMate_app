import { db } from '../../firebase/firebase'; // Correct relative path
import { addDoc, collection } from 'firebase/firestore';

interface Activity {
  userId: string;
  type: 'transport' | 'food' | 'energy';
  description: string;
  carbonFootprint: number;
  details: Record<string, any>;
  createdAt: string;
}

export const saveActivity = async (activity: Omit<Activity, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      createdAt: new Date().toISOString()
    });
    console.log('Activity saved with ID:', docRef.id);
    return true;
  } catch (error) {
    console.error('Error saving activity:', error);
    return false;
  }
};

export const EMISSION_FACTORS = {
  transport: {
    car: 0.12,    // kg CO2 per km
    bus: 0.07,
    train: 0.03,
    electric: 0.05
  },
  food: {
    beef: 27,     // kg CO2 per kg
    chicken: 6.9,
    vegetarian: 2.5
  },
  energy: {
    electricity: 0.5,  // kg CO2 per kWh
    gas: 0.2,
    solar: 0.05
  }
};