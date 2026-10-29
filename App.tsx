import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationProvider } from './viewModels/LocationContext';
import HomeView from './views/HomeView';
import MapViewScreen from './views/MapView';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Starts a shared location store and the Home/Map native navigation stack.
export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeView} options={{ title: 'Find My Car' }} />
          <Stack.Screen name="Map" component={MapViewScreen} options={{ title: 'Map View' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}
