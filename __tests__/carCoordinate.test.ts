import { CarCoordinate, defaultCarCoordinate, formatCoordinate, isValidCoordinate } from '../models/CarCoordinate';

// Covers the six model behaviors requested by the Lab 08 handout.
describe('CarCoordinate', () => {
  // Verifies the sentinel used for an unsaved parking location.
  test('defaultCarCoordinate is (0, 0)', () => {
    expect(defaultCarCoordinate).toEqual({ latitude: 0, longitude: 0 });
  });
  // Ensures the map button stays disabled for the default location.
  test('isValidCoordinate returns false for the default', () => {
    expect(isValidCoordinate(defaultCarCoordinate)).toBe(false);
  });
  // Allows saved positions on either the equator or the prime meridian.
  test('isValidCoordinate returns true when either component is non-zero', () => {
    expect(isValidCoordinate({ latitude: 40.4446, longitude: -79.9454 })).toBe(true);
    expect(isValidCoordinate({ latitude: 40.4446, longitude: 0 })).toBe(true);
    expect(isValidCoordinate({ latitude: 0, longitude: -79.9454 })).toBe(true);
  });
  // Verifies rounding and punctuation in the coordinate label.
  test('formatCoordinate produces six-decimal output', () => {
    const coordinate: CarCoordinate = { latitude: 40.4446443, longitude: -79.945424 };
    expect(formatCoordinate(coordinate)).toBe('(40.444644, -79.945424)');
  });
  // Keeps whole-number positions aligned with the six-decimal display format.
  test('formatCoordinate pads short values to six decimals', () => {
    expect(formatCoordinate({ latitude: 1, longitude: 2 })).toBe('(1.000000, 2.000000)');
  });
  // Confirms serialization preserves coordinates for AsyncStorage.
  test('round-trips cleanly through JSON', () => {
    const original: CarCoordinate = { latitude: 40.4446, longitude: -79.9454 };
    const restored = JSON.parse(JSON.stringify(original));
    expect(restored).toEqual(original);
    expect(isValidCoordinate(restored)).toBe(true);
  });
});
