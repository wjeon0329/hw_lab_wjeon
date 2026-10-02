import { filterRepositories } from '../viewModels/useRepositories';
import { Repository } from '../models/Repository';

const sample: Repository[] = [
  { id: 1, name: 'Alamofire', description: 'Elegant HTTP Networking in Swift', html_url: 'https://github.com/Alamofire/Alamofire', stargazers_count: 40000 },
  { id: 2, name: 'SwiftLint', description: 'A tool to enforce Swift style', html_url: 'https://github.com/realm/SwiftLint', stargazers_count: 18000 },
  { id: 3, name: 'Vapor', description: 'A server-side Swift web framework', html_url: 'https://github.com/vapor/vapor', stargazers_count: 24000 },
];

describe('filterRepositories', () => {
  test('empty search returns all repos', () => expect(filterRepositories(sample, '')).toHaveLength(3));
  test('whitespace-only search returns all repos', () => expect(filterRepositories(sample, ' ')).toHaveLength(3));
  test('matches a substring of the name', () => expect(filterRepositories(sample, 'swift').map((repo) => repo.name)).toEqual(['SwiftLint']));
  test('is case-insensitive', () => expect(filterRepositories(sample, 'VAPOR')[0].name).toBe('Vapor'));
  test('returns empty when no repo matches', () => expect(filterRepositories(sample, 'nothing-matches-this')).toEqual([]));
});
