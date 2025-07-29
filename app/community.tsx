import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { db, auth } from '../firebase/firebase';
import {
  collection, query, orderBy, limit,
  onSnapshot, doc, updateDoc, arrayUnion
} from 'firebase/firestore';

dayjs.extend(relativeTime);

export default function CommunityScreen() {
  const [challenge, setChallenge] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const chQuery = query(
      collection(db, 'challenges'),
      orderBy('startDate', 'desc'),
      limit(1)
    );
    const lbQuery = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(10)
    );
    const actQuery = query(
      collection(db, 'activities'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubCh = onSnapshot(chQuery, (snap) => {
      const doc0 = snap.docs[0];
      setChallenge(doc0 ? { id: doc0.id, ...doc0.data() } : null);
    }, (error) => {
      console.error('Challenge read error', error);
      Alert.alert('Error', 'Permission denied to read challenges');
    });

    const unsubLb = onSnapshot(lbQuery, (snap) => {
      setLeaderboard(snap.docs.map(d => d.data()));
    }, (error) => {
      console.error('Leaderboard read error', error);
      Alert.alert('Error', 'Permission denied to read leaderboard');
    });

    const unsubAct = onSnapshot(actQuery, (snap) => {
      setActivities(snap.docs.map(d => d.data()));
      setLoading(false);
    }, (error) => {
      console.error('Activities read error', error);
      Alert.alert('Error', 'Permission denied to read activities');
      setLoading(false);
    });

    return () => {
      unsubCh();
      unsubLb();
      unsubAct();
    };
  }, []);

  const handleJoin = async () => {
    if (!auth.currentUser || !challenge) return;
    setJoining(true);
    try {
      const chRef = doc(db, 'challenges', challenge.id);
      await updateDoc(chRef, {
        participants: arrayUnion(auth.currentUser.uid),
      });
      Alert.alert('Joined!', 'You have joined the challenge.');
    } catch (e) {
      console.error('Join error:', e);
      Alert.alert('Error', 'Could not join challenge.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Community Challenges</Text>
      {challenge ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{challenge.title}</Text>
          <Text style={styles.cardDesc}>{challenge.description}</Text>
          <Text style={styles.cardProgress}>Progress: {challenge.progress}%</Text>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoin}
            disabled={joining}
          >
            <Text style={styles.joinText}>{joining ? 'Joining...' : 'Join Challenge'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noData}>No active challenges</Text>
      )}

      <Text style={styles.subHeader}>Leaderboard</Text>
      {leaderboard.length ? (
        leaderboard.map((item, idx) => (
          <Text
            key={idx}
            style={[styles.lbItem, item.name === 'You' && styles.highlight]}
          >
            {idx + 1}. {item.name} ({item.score}% reduction)
          </Text>
        ))
      ) : (
        <Text style={styles.noData}>No leaderboard data</Text>
      )}

      <Text style={styles.subHeader}>Friends' Activities</Text>
      {activities.length ? (
        activities.map((a, idx) => {
          const ts = a.createdAt?.toDate ? dayjs(a.createdAt.toDate()).fromNow() : '';
          return (
            <Text key={idx} style={styles.activityItem}>
              • {a.userName} {a.action} • {ts}
            </Text>
          );
        })
      ) : (
        <Text style={styles.noData}>No recent activity</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardDesc: { marginVertical: 8, color: '#666' },
  cardProgress: { fontWeight: '500', color: '#228B22' },
  joinButton: {
    marginTop: 12,
    backgroundColor: '#4682B4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinText: { color: 'white', fontWeight: 'bold' },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#333' },
  lbItem: { marginVertical: 3, fontSize: 16, color: '#333' },
  highlight: { backgroundColor: '#e8f5e9' },
  activityItem: { marginVertical: 2, color: '#333' },
  noData: { color: '#666', fontStyle: 'italic', marginVertical: 10 },
});
