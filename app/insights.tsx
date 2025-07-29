import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/firebase';  // adjust path as needed
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase/firebase';

export default function AnalyticsScreen() {
  const screenWidth = Dimensions.get('window').width;

  // States for fetched data & computed stats
  const [activities, setActivities] = useState<any[]>([]);
  const [totalFootprint, setTotalFootprint] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({
    transport: 0,
    food: 0,
    energy: 0,
  });

  // Fetch real-time user activities from Firestore
  useEffect(() => {
    if (!auth.currentUser) return; // safety check

    const q = query(
      collection(db, 'activities'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setActivities(data);
    });

    return () => unsubscribe();
  }, []);

  // Calculate total footprint and breakdown whenever activities change
  useEffect(() => {
    let total = 0;
    const breakdown = { transport: 0, food: 0, energy: 0 };

    activities.forEach((activity) => {
      total += activity.carbonFootprint || 0;
      if (activity.type && breakdown[activity.type] !== undefined) {
        breakdown[activity.type] += activity.carbonFootprint || 0;
      }
    });

    setTotalFootprint(total);

    // Convert to percentages for pie chart legend
    const totalForPercent = total || 1; // prevent division by zero
    setCategoryBreakdown({
      transport: ((breakdown.transport / totalForPercent) * 100).toFixed(0),
      food: ((breakdown.food / totalForPercent) * 100).toFixed(0),
      energy: ((breakdown.energy / totalForPercent) * 100).toFixed(0),
    });
  }, [activities]);

  const StatCard = ({ value, label }: { value: string | number; label: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const AchievementBadge = ({ title, earned }: { title: string; earned: boolean }) => (
    <View style={[
      styles.badge,
      earned ? styles.earnedBadge : styles.pendingBadge
    ]}>
      <Ionicons
        name="ribbon"
        size={40}
        color={earned ? '#FF8C00' : '#ccc'}
      />
      <Text style={[
        styles.badgeText,
        earned ? styles.earnedText : styles.pendingText
      ]}>
        {title}
      </Text>
    </View>
  );

  // Example achievement logic (you can customize)
  const achievements = [
    { title: 'Eco Starter', earned: totalFootprint > 0 },
    { title: 'Green Commute', earned: categoryBreakdown.transport > 30 },
    { title: 'Recycler', earned: categoryBreakdown.energy < 20 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Carbon Insights</Text>

      {/* You can add your time filter UI here */}

      <View style={styles.chartContainer}>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Carbon Trend Chart</Text>
          {/* You can integrate charts here with 'activities' data */}
        </View>
      </View>

      <Text style={styles.sectionHeader}>Category Breakdown</Text>

      <View style={styles.pieChartContainer}>
        <View style={styles.pieChartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Pie Chart</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: '#228B22' }]} />
            <Text style={styles.legendText}>Transport ({categoryBreakdown.transport}%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: '#4682B4' }]} />
            <Text style={styles.legendText}>Food ({categoryBreakdown.food}%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: '#FF8C00' }]} />
            <Text style={styles.legendText}>Energy ({categoryBreakdown.energy}%)</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Statistics</Text>

      <View style={styles.statsContainer}>
        <StatCard value={`${totalFootprint.toFixed(2)} kg`} label="Total Footprint" />
        {/* You can add more stats like reduction or streak here */}
      </View>

      <Text style={styles.sectionHeader}>Achievements</Text>

      <View style={styles.badgesContainer}>
        {achievements.map(({ title, earned }) => (
          <AchievementBadge key={title} title={title} earned={earned} />
        ))}
      </View>
    </ScrollView>
  );
}

// Keep your styles here unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  timeFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  activeFilter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#228B22',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#228B22',
  },
  inactiveFilter: {
    fontSize: 16,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  chartPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  chartPlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  pieChartContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  pieChartPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  legend: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#228B22',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  badge: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
  },
  earnedBadge: {
    opacity: 1,
  },
  pendingBadge: {
    opacity: 0.5,
  },
  badgeText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  earnedText: {
    color: '#333',
    fontWeight: '500',
  },
  pendingText: {
    color: '#666',
  },
});
