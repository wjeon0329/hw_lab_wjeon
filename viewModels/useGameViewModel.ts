import { useCallback, useEffect, useReducer, useState } from 'react';
import { EmojiSearchStatus } from '../models/Emoji';
import { gameReducer, initialGameState } from './gameReducer';

// Runs the countdown only while the current round's camera and model are ready.
export function useGameViewModel() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [cameraReady, setCameraReady] = useState(false);

  // Restarts the interval whenever the active round or its readiness changes.
  useEffect(() => {
    if (!cameraReady || state.emojiStatus !== EmojiSearchStatus.Searching) return;
    // Sends one countdown event per second.
    function tick() {
      dispatch({ type: 'tick' });
    }
    const interval = setInterval(tick, 1000);
    // Cancels outstanding ticks when the round pauses or ends.
    return () => clearInterval(interval);
  }, [cameraReady, state.emojiStatus, state.currentLevel]);

  // Reports a classification match to the current round.
  const foundEmoji = useCallback(() => dispatch({ type: 'foundEmoji' }), []);

  // Waits for the next camera mount before counting down again.
  function startNext() {
    setCameraReady(false);
    dispatch({ type: 'nextEmoji' });
  }

  // Resets the game to its first target.
  function restart() {
    setCameraReady(false);
    dispatch({ type: 'restart' });
  }

  return { ...state, cameraReady, setCameraReady, foundEmoji, startNext, restart };
}
