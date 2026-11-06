import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { MobileNet } from '@tensorflow-models/mobilenet';
import { matchesEmoji } from '../models/Emoji';
import { classifyFrame, loadClassifier } from '../viewModels/classifier';

type Props = {
  emojiNames: string[];
  onEmojiFound: () => void;
  onReady: (ready: boolean) => void;
};

// Opens the rear camera and samples frames until this round ends.
export default function CustomCamera({ emojiNames, onEmojiFound, onReady }: Props) {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [model, setModel] = useState<MobileNet | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const camera = useRef<CameraView>(null);
  const granted = permission?.granted === true;
  const ready = granted && cameraReady && model !== null && error === '';

  // Rechecks permission when the player returns from Settings.
  useEffect(() => {
    if (granted) return;
    // Refreshes access after the app becomes active.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void getPermission();
    });
    // Removes the listener once camera access is granted.
    return () => subscription.remove();
  }, [granted, getPermission]);

  // Reuses the loaded model on subsequent rounds and ignores unmounted requests.
  useEffect(() => {
    if (!granted) return;
    let cancelled = false;
    // Reports a recoverable loading error without starting the game clock.
    async function prepareModel() {
      try {
        const classifier = await loadClassifier();
        if (!cancelled) setModel(classifier);
      } catch (failure) {
        if (!cancelled) {
          console.warn('MobileNet load failed:', failure);
          setError('Could not load the image classifier.');
        }
      }
    }
    void prepareModel();
    // Discards completions from this camera mount.
    return () => { cancelled = true; };
  }, [granted, attempt]);

  // Tells the game when the camera and model are both ready.
  useEffect(() => {
    onReady(ready);
  }, [ready, onReady]);

  // Uses a single in-flight capture and drops predictions from previous rounds.
  useEffect(() => {
    if (!ready || !model) return;
    const classifier = model;
    let cancelled = false;
    let processing = false;
    let found = false;

    // Takes a silent photo and reports an exact match from the classifier.
    async function scan() {
      if (processing || found || cancelled || !camera.current) return;
      processing = true;
      try {
        const photo = await camera.current.takePictureAsync({ shutterSound: false, quality: 0.5 });
        if (!photo) return;
        const predictions = await classifyFrame(classifier, photo.uri);
        if (cancelled) return;
        if (__DEV__) console.log('Predictions:', predictions);
        if (matchesEmoji(predictions, emojiNames)) {
          found = true;
          onEmojiFound();
        }
      } catch (failure) {
        if (!cancelled) console.warn('Frame capture or classification failed:', failure);
      } finally {
        processing = false;
      }
    }

    const interval = setInterval(scan, 1000);
    void scan();
    // Stops sampling when the camera is replaced by a result screen.
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [ready, model, emojiNames, onEmojiFound]);

  // Requests camera access or opens Settings after a permanent denial.
  async function enableCamera() {
    if (permission?.canAskAgain) {
      await requestPermission();
    } else {
      await Linking.openSettings();
    }
  }

  // Starts a new camera and model-loading attempt after an error.
  function retry() {
    setError('');
    setCameraReady(false);
    setAttempt((current) => current + 1);
  }

  // Enables capture once Expo reports that the preview is ready.
  function markCameraReady() {
    setCameraReady(true);
  }

  // Stops the timer if the native camera cannot mount.
  function reportCameraError() {
    setCameraReady(false);
    setError('Could not start the camera.');
  }

  if (!permission) {
    return <View style={styles.centered}><ActivityIndicator color="#fff" /></View>;
  }
  if (!granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Camera access is needed to hunt for emoji objects.</Text>
        <Pressable accessibilityRole="button" style={styles.button} onPress={enableCamera}>
          <Text style={styles.buttonText}>{permission.canAskAgain ? 'Enable camera' : 'Open Settings'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        key={attempt}
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing="back"
        onCameraReady={markCameraReady}
        onMountError={reportCameraError}
      />
      {!ready && (
        <View style={[StyleSheet.absoluteFill, styles.centered, styles.overlay]}>
          {!error && <ActivityIndicator color="#fff" />}
          <Text style={styles.message}>
            {error || (model ? 'Starting camera…' : 'Loading image classification model…')}
          </Text>
          {error !== '' && (
            <Pressable accessibilityRole="button" style={styles.button} onPress={retry}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, padding: 24 },
  overlay: { backgroundColor: 'rgba(0,0,0,0.65)' },
  message: { color: '#fff', textAlign: 'center', fontSize: 18 },
  button: { borderRadius: 10, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20 },
  buttonText: { color: '#111', fontSize: 16, fontWeight: '600' },
});
