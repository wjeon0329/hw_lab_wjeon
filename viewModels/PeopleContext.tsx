import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBlankPerson, Person } from '../models/Person';

const STORAGE_KEY = '@SimpleContacts:people';
export type SortOrder = 'asc' | 'desc';

// Returns a new array filtered by a case-insensitive name search and sorted by name.
export function filterAndSort(people: Person[], searchText: string, sortOrder: SortOrder): Person[] {
  const needle = searchText.trim().toLowerCase();
  const filtered = needle === '' ? people : people.filter((person) => person.name.toLowerCase().includes(needle));
  return [...filtered].sort((first, second) => (sortOrder === 'asc'
    ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name)));
}

type PeopleContextValue = {
  people: Person[];
  loading: boolean;
  addPerson: () => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
};

const PeopleContext = createContext<PeopleContextValue | undefined>(undefined);

// Shares contacts with every screen and saves changes automatically to device storage.
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Loads contacts once when the provider first mounts.
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json !== null) setPeople(JSON.parse(json) as Person[]);
      } catch (error) { console.error('Error loading contacts:', error); }
      finally { setLoading(false); }
    };
    void loadPeople();
  }, []);

  // Persists the current contact list after loading has completed.
  useEffect(() => {
    if (!loading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(people)).catch((error) => console.error('Error saving contacts:', error));
  }, [people, loading]);

  // Adds a blank contact and returns it so the list can open its edit screen.
  const addPerson = (): Person => {
    const person = createBlankPerson();
    setPeople((current) => [...current, person]);
    return person;
  };
  // Merges changed fields into the contact whose id matches the requested record.
  const updatePerson = (id: string, updates: Partial<Person>) => setPeople((current) => current.map((person) => person.id === id ? { ...person, ...updates } : person));
  // Removes the contact with the requested identifier from the stored list.
  const deletePerson = (id: string) => setPeople((current) => current.filter((person) => person.id !== id));
  // Finds the most current version of one contact by its identifier.
  const getPerson = (id: string) => people.find((person) => person.id === id);
  const value = useMemo(() => ({ people, loading, addPerson, updatePerson, deletePerson, getPerson }), [people, loading]);
  return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}

// Returns the contacts store and ensures it is only used inside its provider.
export function usePeople(): PeopleContextValue {
  const context = useContext(PeopleContext);
  if (!context) throw new Error('usePeople must be used inside a PeopleProvider');
  return context;
}
