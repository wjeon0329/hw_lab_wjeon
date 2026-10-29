import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatCoordinate, isValidCoordinate } from '../models/CarCoordinate';
import { useLocation } from '../viewModels/LocationContext';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Presents the lab's save-location and find-car actions with loading feedback.
export default function HomeView() {
  const navigation = useNavigation<NavProp>();
  const { coordinate, loading, saveCurrentLocation } = useLocation();
  const [busy, setBusy] = useState(false);
  const hasLocation = isValidCoordinate(coordinate);

  // Saves a fresh location once per tap and displays permission, GPS, or storage errors.
  async function onSave(): Promise<void> {
    if (busy || loading) return;
    setBusy(true);
    try {
      const next = await saveCurrentLocation();
      Alert.alert('Location Saved', `Your car is at:\n${formatCoordinate(next)}\n\nTap "Where's My Car?" to view on the map.`);
    } catch (error) {
      Alert.alert('Location Error', error instanceof Error ? error.message : 'Unable to save your location.');
    } finally {
      setBusy(false);
    }
  }

  // Opens the map using the current coordinate from the shared provider.
  function onFind(): void {
    navigation.navigate('Map');
  }

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" accessibilityLabel="Loading saved location" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Find My Car</Text>
        {hasLocation && <Text style={styles.subtitle}>Location Saved</Text>}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Here's My Car" accessibilityState={{ disabled: busy, busy }} style={[styles.button, styles.primary, busy && styles.busy]} onPress={onSave} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <><Ionicons name="car" size={22} color="#fff" style={styles.icon} /><Text style={styles.buttonText}>Here's My Car</Text></>}
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !hasLocation || busy }} style={[styles.button, hasLocation ? styles.success : styles.disabled]} onPress={onFind} disabled={!hasLocation || busy}>
        <Ionicons name="map" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Where's My Car?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 20 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleBlock: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 34, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#248A3D', marginTop: 6 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 56, padding: 16, borderRadius: 10 },
  primary: { backgroundColor: '#007AFF' },
  success: { backgroundColor: '#34C759' },
  disabled: { backgroundColor: '#a1a1a1' },
  busy: { opacity: 0.7 },
  icon: { marginRight: 8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
