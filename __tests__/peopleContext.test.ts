import { filterAndSort } from '../viewModels/PeopleContext';
import type { Person } from '../models/Person';

const sample: Person[] = [
  { id: '1', name: 'Alex Heimann', email: 'alex@example.com', details: '' },
  { id: '2', name: 'An Heimann', email: 'an@example.com', details: '' },
  { id: '3', name: 'Tim Daigle', email: 'tim@example.com', details: '' },
  { id: '4', name: 'Tom Brady', email: 'tom@example.com', details: '' },
];

describe('filterAndSort', () => {
  test('empty search returns all people in ascending order', () => expect(filterAndSort(sample, '', 'asc').map((person) => person.name)).toEqual(['Alex Heimann', 'An Heimann', 'Tim Daigle', 'Tom Brady']));
  test('descending sort reverses the name order', () => expect(filterAndSort(sample, '', 'desc').map((person) => person.name)).toEqual(['Tom Brady', 'Tim Daigle', 'An Heimann', 'Alex Heimann']));
  test('search matches a substring of a name', () => expect(filterAndSort(sample, 'heim', 'asc').map((person) => person.name)).toEqual(['Alex Heimann', 'An Heimann']));
  test('search is case-insensitive', () => expect(filterAndSort(sample, 'BRADY', 'asc')[0].name).toBe('Tom Brady'));
  test('whitespace-only search returns everyone', () => expect(filterAndSort(sample, '   ', 'asc')).toHaveLength(4));
  test('non-matching search returns no people', () => expect(filterAndSort(sample, 'zzz', 'asc')).toEqual([]));
  test('does not mutate its input', () => { const before = [...sample]; filterAndSort(sample, '', 'desc'); expect(sample).toEqual(before); });
});
