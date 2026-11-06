export enum EmojiSearchStatus {
  Searching = 'Searching',
  Found = 'Found',
  NotFound = 'NotFound',
  GameOver = 'GameOver',
}

export interface Emoji {
  emoji: string;
  emojiNames: string[];
}

export const emojiObjects: Emoji[] = [
  { emoji: '💻', emojiNames: ['laptop', 'laptop computer', 'notebook', 'notebook computer'] },
  { emoji: '📱', emojiNames: ['cellular telephone', 'cellular phone', 'cellphone', 'cell', 'mobile phone'] },
  { emoji: '🖊', emojiNames: ['ballpoint', 'ballpoint pen', 'ballpen', 'biro', 'fountain pen', 'quill pen'] },
  { emoji: '📕', emojiNames: ['book jacket', 'dust cover', 'dust jacket', 'dust wrapper', 'comic book'] },
  { emoji: '🎒', emojiNames: ['backpack', 'back pack', 'knapsack', 'packsack', 'rucksack', 'haversack'] },
];

export interface Prediction {
  className: string;
  probability: number;
}

// Checks complete MobileNet aliases above 20% confidence.
export function matchesEmoji(predictions: Prediction[], emojiNames: string[]): boolean {
  for (const { className, probability } of predictions) {
    if (probability <= 0.2) continue;
    for (const label of className.toLowerCase().split(',')) {
      if (emojiNames.includes(label.trim())) return true;
    }
  }
  return false;
}
