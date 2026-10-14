import * as Crypto from 'expo-crypto';

export interface Person {
  id: string;
  name: string;
  email: string;
  details: string;
  photoUri?: string;
}

// Creates a new contact with a unique identifier and editable blank fields.
export function createBlankPerson(): Person {
  return { id: Crypto.randomUUID(), name: '', email: '', details: '' };
}
