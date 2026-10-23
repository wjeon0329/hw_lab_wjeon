# ArbeitRN - Lab 07

## Firebase setup

1. In the Firebase Console, create a project named `Arbeit` and create a Firestore database in **test mode**.
2. Add a **Web app** named `ArbeitRN`; the Firebase Console then displays a `firebaseConfig` object.
3. Copy `.env.example` to `.env`, then copy the matching values from that object into the `EXPO_PUBLIC_FIREBASE_*` variables.
4. In Firestore, create a `tasks` collection with two documents. Each document needs `name` (string), `assignedTo` (string), `completed` (boolean), `dueDate` (timestamp), and `dateAdded` (timestamp).

The Firebase web configuration identifies the app and project. It is intended to be bundled in web/mobile clients; Firestore security rules protect the database.

## Run and verify

```powershell
npm install
npm test
npm run typecheck
npm start
```

Use the Android emulator or Expo Go to create, edit, complete, and delete tasks.
