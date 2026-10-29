# Lab 08 - FindMyCarRN

React Native / TypeScript implementation of the Find My Car lab. Uses Expo SDK 58, foreground location, react-native-maps, and local AsyncStorage persistence. No Firebase project or environment file is required.

## Run on an iPhone

Open this `Lab08` folder in VS Code. Stop the previous lab's Expo server with Ctrl+C before starting this one.

```powershell
npm ci
npx expo-doctor
npm test -- --runInBand
npm run typecheck
npx expo start --clear
```

Scan this project's QR code using the iPhone Camera and open it in Expo Go (SDK 58). Keep the computer and phone on the same Wi-Fi. In Expo Go, Apple Maps works without a Google Maps API key.

1. Initially, **Where's My Car?** is disabled.
2. Tap **Here's My Car**. Allow location access while using the app; enable Precise Location for a more useful parking position.
3. Wait for **Location Saved**, which displays the saved coordinate.
4. Tap **Where's My Car?** to open the map. Confirm the custom **Your Car** marker, coordinate card, and current user location.
5. Return Home, reload the app, and confirm **Location Saved** remains and the map shows the same car coordinate. Do not tap save again until you have checked persistence.
6. If location is denied or disabled, saving displays **Location Error**; enable location access in the phone's settings and retry.

Location acquisition may take longer indoors. Test with a real GPS fix; simulator users must configure a simulated location. The handout's CMU example is `(40.444644, -79.945424)`.

## Structure

- `models/CarCoordinate.ts`: coordinate interface, default sentinel, validation, formatting.
- `viewModels/LocationContext.tsx`: permission checks, GPS acquisition, storage, shared state, clear-location method.
- `views/HomeView.tsx`: save/find controls, progress, alerts.
- `views/MapView.tsx`: native map with car annotation and device location.
- `__tests__/carCoordinate.test.ts`: six required model tests.

The required lab treats `(0, 0)` as an unsaved coordinate. The provider also validates stored JSON before using it on the map. Optional distance/route and clear-button enhancements are not included.

## Screenshot checklist

Capture screenshots on the phone and save them separately for submission, as in the previous lab:

1. Initial Home screen with the find button disabled (before the first save).
2. Location permission prompt, if practical.
3. **Location Saved** alert with coordinates.
4. Home screen with **Location Saved** and the find button enabled.
5. Map showing **Your Car**, the coordinate card, and the current location dot (move a short distance if both locations overlap).
6. Home/map after reloading, proving the saved coordinate persists.
7. Terminal showing six tests passed.

Avoid committing real parking coordinates or screenshots of your private location to a public repository. Screenshot PNGs named `Screenshot*.png` are ignored by default.

## GitHub

Repository: `wjeon0329/hw_lab_wjeon`

Branch: `hw_lab8_FindMyCar`
