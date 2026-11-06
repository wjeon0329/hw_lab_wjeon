# Lab 09 — Emoji Hunter

Find the five emoji objects using the phone’s rear camera. Each round gives you 10 seconds once the camera and classifier are ready. A full MobileNet label match above 20% confidence ends the round.

## Run on iPhone

Open the Lab09 folder in VS Code. Stop any previous Expo server with Ctrl+C, then run:

```powershell
npm ci
npm test -- --runInBand
npx expo start --clear
```

Scan the new QR code with the iPhone Camera and open it in Expo Go for SDK 58. Tap **Enable camera** and grant access. Point the camera at a laptop for the first round. Tap **Next** after each result and play all five rounds to reach **Game Over**. Tap the game-over screen to restart.

The app uses TensorFlow.js with the CPU backend, Expo Camera, Image Manipulator, and FileSystem. This keeps the lab compatible with the SDK 58 Expo Go native modules. The MobileNet model is included as app assets and camera frames are processed locally.

## Model

Google MobileNet V2, 0.50 width, 224×224 ImageNet classification, TensorFlow.js variation version 3. [Model source](https://www.kaggle.com/models/google/mobilenet-v2/tfJs/050-224-classification/3).
