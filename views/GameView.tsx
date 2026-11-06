import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EmojiSearchStatus, emojiObjects } from '../models/Emoji';
import { useGameViewModel } from '../viewModels/useGameViewModel';
import CustomCamera from './CustomCamera';

// Switches between the camera, round result, and restart screens.
export default function GameView() {
  const vm = useGameViewModel();
  const target = emojiObjects[vm.currentLevel];
  const gameOver = vm.emojiStatus === EmojiSearchStatus.GameOver;

  return (
    <View style={styles.container}>
      {gameOver ? (
        <Pressable accessibilityRole="button" style={[styles.fullscreenButton, styles.gameOver]} onPress={vm.restart}>
          <Text style={styles.gameOverText}>GAME OVER{'\n'}Tap to restart</Text>
        </Pressable>
      ) : vm.showNext ? (
        <Pressable accessibilityRole="button" style={[styles.fullscreenButton, styles.next]} onPress={vm.startNext}>
          <Text style={styles.nextText}>NEXT</Text>
        </Pressable>
      ) : (
        <CustomCamera
          emojiNames={target.emojiNames}
          onEmojiFound={vm.foundEmoji}
          onReady={vm.setCameraReady}
        />
      )}
      {!gameOver && (
        <View pointerEvents="none" style={styles.info}>
          {vm.emojiStatus === EmojiSearchStatus.Searching && vm.cameraReady && (
            <Text style={styles.timer}>Time Remaining: {vm.timeRemaining}</Text>
          )}
          <Text style={styles.emojiText}>{emojiResultText(vm.emojiStatus, target.emoji)}</Text>
        </View>
      )}
    </View>
  );
}

// Formats the target or its result for the bottom status bar.
function emojiResultText(status: EmojiSearchStatus, emoji: string): string {
  if (status === EmojiSearchStatus.Found) return `${emoji} FOUND!`;
  if (status === EmojiSearchStatus.NotFound) return `${emoji} NOT FOUND`;
  return emoji;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullscreenButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  next: { backgroundColor: '#248A3D' },
  gameOver: { backgroundColor: '#C9252D' },
  nextText: { color: '#fff', fontSize: 60, fontWeight: 'bold' },
  gameOverText: { color: '#fff', fontSize: 38, fontWeight: 'bold', textAlign: 'center' },
  info: {
    position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 12,
  },
  timer: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  emojiText: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
});
