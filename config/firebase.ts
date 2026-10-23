import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Reads the Firebase web-app identifiers from the local Expo environment file.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Stops startup with an actionable message when the required Firebase values are missing.
function requireFirebaseConfiguration(): void {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missing.join(', ')}. Copy .env.example to .env and fill in the Firebase web-app values.`);
  }
}

requireFirebaseConfiguration();

const app = initializeApp(firebaseConfig);

// Exposes the initialized Firestore database used by the task provider.
export const db = getFirestore(app);
