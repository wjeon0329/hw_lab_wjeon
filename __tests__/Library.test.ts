import { Book } from '../models/Book';
import { Gender } from '../models/Gender';
import { Library } from '../viewModels/Library';

describe('Library', () => {
  test('library is populated with 77 books', () => expect(new Library().books).toHaveLength(77));
  test('library is sorted alphabetically by title', () => { const library = new Library(); expect(library.books.map((book) => book.title)).toEqual([...library.books].sort(Book.compare).map((book) => book.title)); });
  test('adding a book increases the count', () => { const library = new Library(); const before = library.books.length; library.addBook('Diary of a Young Girl', 'Anne Frank', Gender.Female, true); expect(library.books).toHaveLength(before + 1); });
  test('removing a book by id decreases the count', () => { const library = new Library(); const doomed = library.books[0].id; library.removeBook(doomed); expect(library.books).toHaveLength(76); expect(library.books.find((book) => book.id === doomed)).toBeUndefined(); });
  test('getBooksFor returns only that author', () => { const books = new Library().getBooksFor('William Shakespeare'); expect(books.length).toBeGreaterThan(0); expect(books.every((book) => book.author === 'William Shakespeare')).toBe(true); });
  test('gender filters partition the seed data', () => { const library = new Library(); const male = library.getMaleAuthoredBooks(); const female = library.getFemaleAuthoredBooks(); expect(male.every((book) => book.gender === Gender.Male)).toBe(true); expect(female.every((book) => book.gender === Gender.Female)).toBe(true); expect(male.length + female.length).toBe(library.books.length); });
  test('book equality uses title and author only', () => { const a = new Book('Hamlet', 'William Shakespeare', Gender.Male, true); const b = new Book('Hamlet', 'William Shakespeare', Gender.Male, false); const c = new Book('Macbeth', 'William Shakespeare', Gender.Male, true); expect(Book.equals(a, b)).toBe(true); expect(Book.equals(a, c)).toBe(false); });
});
