import { EmojiSearchStatus, emojiObjects, matchesEmoji } from '../models/Emoji';
import { gameReducer, initialGameState, ROUND_DURATION } from '../viewModels/gameReducer';

// Covers the nine game transitions from the handout.
describe('gameReducer', () => {
  // Verifies the first round starts with a full countdown.
  test('initial state is Searching at level 0 with full time', () => {
    expect(initialGameState).toEqual({
      currentLevel: 0, timeRemaining: ROUND_DURATION,
      emojiStatus: EmojiSearchStatus.Searching, showNext: false,
    });
  });

  // Checks that an active search uses one second per tick.
  test('tick decrements time while Searching', () => {
    const next = gameReducer(initialGameState, { type: 'tick' });
    expect(next.timeRemaining).toBe(ROUND_DURATION - 1);
    expect(next.emojiStatus).toBe(EmojiSearchStatus.Searching);
  });

  // Checks that the player can continue after time runs out.
  test('tick at 1 second marks NotFound and shows Next', () => {
    const next = gameReducer({ ...initialGameState, timeRemaining: 1 }, { type: 'tick' });
    expect(next.timeRemaining).toBe(0);
    expect(next.emojiStatus).toBe(EmojiSearchStatus.NotFound);
    expect(next.showNext).toBe(true);
  });

  // Ensures ticks stop changing the result after a match.
  test('tick is a no-op when not Searching', () => {
    const state = { ...initialGameState, emojiStatus: EmojiSearchStatus.Found };
    expect(gameReducer(state, { type: 'tick' })).toBe(state);
  });

  // Checks that a match ends the search and shows Next.
  test('foundEmoji flips to Found and shows Next', () => {
    const next = gameReducer(initialGameState, { type: 'foundEmoji' });
    expect(next.emojiStatus).toBe(EmojiSearchStatus.Found);
    expect(next.showNext).toBe(true);
  });

  // Prevents a late camera callback from overwriting a timeout.
  test('foundEmoji is ignored if not Searching', () => {
    const state = { ...initialGameState, emojiStatus: EmojiSearchStatus.NotFound };
    expect(gameReducer(state, { type: 'foundEmoji' })).toBe(state);
  });

  // Verifies the next target starts with a reset countdown.
  test('nextEmoji advances the level and resets the round', () => {
    const state = { ...initialGameState, emojiStatus: EmojiSearchStatus.Found, showNext: true, timeRemaining: 3 };
    expect(gameReducer(state, { type: 'nextEmoji' })).toEqual({ ...initialGameState, currentLevel: 1 });
  });

  // Verifies the final result leads to Game Over.
  test('nextEmoji at the last level transitions to GameOver', () => {
    const state = { ...initialGameState, currentLevel: emojiObjects.length - 1, emojiStatus: EmojiSearchStatus.Found };
    expect(gameReducer(state, { type: 'nextEmoji' }).emojiStatus).toBe(EmojiSearchStatus.GameOver);
  });

  // Checks that restart returns all round state to its defaults.
  test('restart returns to the initial state', () => {
    const state = { ...initialGameState, currentLevel: 3, emojiStatus: EmojiSearchStatus.GameOver };
    expect(gameReducer(state, { type: 'restart' })).toEqual(initialGameState);
  });
});

// Covers the classification rules that decide whether a round succeeds.
describe('matchesEmoji', () => {
  // Accepts complete comma-separated aliases regardless of capitalization.
  test('accepts a complete alias', () => {
    expect(matchesEmoji([{ className: 'Ballpoint, Ballpoint Pen', probability: 0.8 }], ['ballpoint pen'])).toBe(true);
  });

  // Prevents substring matches from awarding a round.
  test('rejects substrings', () => {
    expect(matchesEmoji([{ className: 'notebook computer', probability: 0.8 }], ['book'])).toBe(false);
  });

  // Enforces the strictly greater than 20 percent threshold.
  test('rejects low-confidence labels', () => {
    expect(matchesEmoji([{ className: 'backpack', probability: 0.2 }], ['backpack'])).toBe(false);
  });
});
