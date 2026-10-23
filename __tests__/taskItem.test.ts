import { areTasksEqual, compareTasksByDueDate, compareTasksByName, isValidTask, TaskItem } from '../models/TaskItem';

const fixedDate = new Date('2026-01-15T00:00:00Z');

// Builds a predictable task that individual tests can override.
function sample(overrides: Partial<TaskItem> = {}): TaskItem {
  return { name: 'Write lab', assignedTo: 'Prof H', dueDate: fixedDate, dateAdded: fixedDate, completed: false, ...overrides };
}

describe('isValidTask', () => {
  test('rejects an empty name', () => expect(isValidTask('', 'someone')).toBe(false));
  test('rejects an empty assignee', () => expect(isValidTask('something', '')).toBe(false));
  test('rejects whitespace-only fields', () => { expect(isValidTask('   ', 'someone')).toBe(false); expect(isValidTask('something', '   ')).toBe(false); });
  test('accepts both fields present', () => expect(isValidTask('something', 'someone')).toBe(true));
});

describe('comparators', () => {
  test('compareTasksByName sorts alphabetically', () => { const list = [sample({ name: 'Cherry' }), sample({ name: 'Apple' }), sample({ name: 'Banana' })]; list.sort(compareTasksByName); expect(list.map((task) => task.name)).toEqual(['Apple', 'Banana', 'Cherry']); });
  test('compareTasksByDueDate sorts earliest-first', () => { const list = [sample({ name: 'A', dueDate: new Date('2026-03-01') }), sample({ name: 'B', dueDate: new Date('2026-01-01') }), sample({ name: 'C', dueDate: new Date('2026-02-01') })].sort(compareTasksByDueDate); expect(list.map((task) => task.name)).toEqual(['B', 'C', 'A']); });
});

describe('areTasksEqual', () => {
  test('ignores completion state and id', () => expect(areTasksEqual(sample(), sample({ id: 'changed', completed: true }))).toBe(true));
  test('differs when the name differs', () => expect(areTasksEqual(sample({ name: 'A' }), sample({ name: 'B' }))).toBe(false));
  test('differs when the due date differs', () => expect(areTasksEqual(sample({ dueDate: new Date('2026-01-01') }), sample({ dueDate: new Date('2026-02-01') }))).toBe(false));
});
