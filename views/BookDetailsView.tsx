import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LibraryStackParamList } from '../types';

type Props = NativeStackScreenProps<LibraryStackParamList, 'BookDetails'>;

export default function BookDetailsView({ route }: Props) {
  const { book } = route.params;
  return <View style={styles.container}><Text style={styles.title}>{book.title}</Text><Text style={styles.author}>{book.author}</Text><Text style={styles.gender}>Author gender: {book.gender}</Text><Text style={styles.displayed}>Displayed in library: {book.displayed ? 'Yes' : 'No'}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 }, author: { fontSize: 20, marginBottom: 4 }, gender: { fontSize: 16, color: 'gray' }, displayed: { marginTop: 16, fontSize: 16 } });
