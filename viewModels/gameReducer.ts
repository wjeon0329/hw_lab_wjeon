import { EmojiSearchStatus, emojiObjects } from '../models/Emoji';

export const ROUND_DURATION = 10;

export type GameState = {
  currentLevel: number;
  timeRemaining: number;
  emojiStatus: EmojiSearchStatus;
  showNext: boolean;
};

export const initialGameState: GameState = {
  currentLevel: 0,
  timeRemaining: ROUND_DURATION,
  emojiStatus: EmojiSearchStatus.Searching,
  showNext: false,
};

export type GameAction =
  | { type: 'tick' }
  | { type: 'foundEmoji' }
  | { type: 'nextEmoji' }
  | { type: 'restart' };

// Transitions the game in response to ticks, predictions, and player actions.
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'tick':
      if (state.emojiStatus !== EmojiSearchStatus.Searching) return state;
      if (state.timeRemaining > 1) return { ...state, timeRemaining: state.timeRemaining - 1 };
      return { ...state, timeRemaining: 0, emojiStatus: EmojiSearchStatus.NotFound, showNext: true };
    case 'foundEmoji':
      if (state.emojiStatus !== EmojiSearchStatus.Searching) return state;
      return { ...state, emojiStatus: EmojiSearchStatus.Found, showNext: true };
    case 'nextEmoji':
      if (state.emojiStatus !== EmojiSearchStatus.Found && state.emojiStatus !== EmojiSearchStatus.NotFound) {
        return state;
      }
      if (state.currentLevel === emojiObjects.length - 1) {
        return { ...state, emojiStatus: EmojiSearchStatus.GameOver, showNext: false };
      }
      return { ...initialGameState, currentLevel: state.currentLevel + 1 };
    case 'restart':
      return initialGameState;
  }
}
