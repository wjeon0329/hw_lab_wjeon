import * as Crypto from 'expo-crypto';

export class Book {
  id: string;

  constructor(
    public title: string,
    public author: string,
    public gender: string,
    public displayed: boolean,
  ) {
    this.id = Crypto.randomUUID();
  }

  static equals(a: Book, b: Book): boolean {
    return a.title === b.title && a.author === b.author;
  }

  static compare(a: Book, b: Book): number {
    return a.title.localeCompare(b.title);
  }
}
