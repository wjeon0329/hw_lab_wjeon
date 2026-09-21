import React, { useState } from 'react';
import { Alert, Button, Keyboard, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { allGenders, Gender } from '../models/Gender';
import { useLibrary } from '../viewModels/LibraryContext';

export default function NewBookView() {
  const { addBook } = useLibrary();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [gender, setGender] = useState<string>(Gender.Male);
  const [displayed, setDisplayed] = useState(false);
  const handleAddBook = () => { Keyboard.dismiss(); addBook(title.trim(), author.trim(), gender, displayed); setTitle(''); setAuthor(''); setGender(Gender.Male); setDisplayed(false); Alert.alert('Success', 'Book added to the library!'); };
  return <View style={styles.container}><Text style={styles.heading}>New Book</Text><TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} /><TextInput style={styles.input} placeholder="Author" value={author} onChangeText={setAuthor} /><Text style={styles.label}>Author Gender</Text><Picker selectedValue={gender} onValueChange={(value) => setGender(value)}>{allGenders.map((value) => <Picker.Item key={value} label={value} value={value} />)}</Picker><View style={styles.row}><Text style={styles.label}>Display book in library</Text><Switch value={displayed} onValueChange={setDisplayed} /></View><Button title="Add Book" disabled={!title.trim() || !author.trim()} onPress={handleAddBook} /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, paddingTop: 60 }, heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 }, input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }, label: { fontSize: 16, marginTop: 8 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 } });
