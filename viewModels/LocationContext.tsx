import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarCoordinate, defaultCarCoordinate } from '../models/CarCoordinate';

const STORAGE_KEY = '@FindMyCar:coordinate';

type LocationContextValue = {
  coordinate: CarCoordinate;
  loading: boolean;
  saveCurrentLocation: () => Promise<CarCoordinate>;
  clearLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

// Shares the saved parking coordinate and persists changes across app launches.
export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinate, setCoordinate] = useState<CarCoordinate>(defaultCarCoordinate);
  const [loading, setLoading] = useState(true);

  // Restores the parking coordinate before enabling controls that could overwrite it.
  useEffect(() => {
    let active = true;
    // Loads and validates stored JSON so damaged storage cannot break the native map.
    async function loadLocation(): Promise<void> {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json !== null) {
          const saved = JSON.parse(json) as CarCoordinate;
          if (!saved || !Number.isFinite(saved.latitude) || !Number.isFinite(saved.longitude)
            || Math.abs(saved.latitude) > 90 || Math.abs(saved.longitude) > 180) {
            throw new Error('The saved coordinate is invalid. Save your car location again.');
          }
          if (active) setCoordinate(saved);
        }
      } catch (error) {
        console.error('Error loading coordinate:', error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadLocation();
    // Avoids updating state after the provider has unmounted.
    return () => { active = false; };
  }, []);

  // Checks services and permission, gets a fresh GPS fix, then persists it before publishing.
  async function saveCurrentLocation(): Promise<CarCoordinate> {
    if (!(await Location.hasServicesEnabledAsync())) {
      throw new Error('Location services are disabled. Enable Location Services in Settings.');
    }
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      ({ status } = await Location.requestForegroundPermissionsAsync());
    }
    if (status !== 'granted') {
      throw new Error('Location access denied. Please enable location access in Settings.');
    }
    const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const next = { latitude: fix.coords.latitude, longitude: fix.coords.longitude };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCoordinate(next);
    return next;
  }

  // Resets the stored and reactive coordinates to the no-location sentinel.
  async function clearLocation(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCarCoordinate));
    setCoordinate(defaultCarCoordinate);
  }

  return <LocationContext.Provider value={{ coordinate, loading, saveCurrentLocation, clearLocation }}>{children}</LocationContext.Provider>;
}

// Returns the shared location store and catches calls outside its provider.
export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used inside a LocationProvider');
  return context;
}
