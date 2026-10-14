import React, { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { filterAndSort, SortOrder, usePeople } from '../viewModels/PeopleContext';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'People'>;

// Displays contacts, filters and orders them, and opens actions for each row.
export default function PeopleView() {
  const navigation = useNavigation<NavProp>();
  const { people, loading, addPerson, deletePerson } = usePeople();
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Creates a new contact and immediately routes to its editable details.
  const handleAdd = () => {
    const person = addPerson();
    navigation.navigate('EditPerson', { personId: person.id });
  };
  // Opens a native choice dialog for selecting ascending or descending name order.
  const handleSort = () => Alert.alert('Sort contacts', 'Choose a name order.', [
    { text: 'Name (A-Z)', onPress: () => setSortOrder('asc') },
    { text: 'Name (Z-A)', onPress: () => setSortOrder('desc') },
    { text: 'Cancel', style: 'cancel' },
  ]);

  // Adds the native header search control and sort/add buttons for this screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: { placeholder: 'Search', onChangeText: (event: any) => setSearchText(event.nativeEvent.text) },
      headerRight: () => <View style={styles.headerActions}>
        <Pressable accessibilityLabel="Sort contacts" onPress={handleSort}><Ionicons name="swap-vertical" size={22} color="#007AFF" /></Pressable>
        <Pressable accessibilityLabel="Add contact" onPress={handleAdd}><Ionicons name="add" size={27} color="#007AFF" /></Pressable>
      </View>,
    });
  }, [navigation, searchText, sortOrder]);

  const displayedPeople = useMemo(() => filterAndSort(people, searchText, sortOrder), [people, searchText, sortOrder]);
  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;

  return <FlatList
    data={displayedPeople}
    keyExtractor={(item) => item.id}
    contentContainerStyle={displayedPeople.length === 0 ? styles.emptyContainer : undefined}
    ListEmptyComponent={<Text style={styles.emptyText}>Tap + to add your first contact.</Text>}
    renderItem={({ item }) => <Swipeable renderRightActions={() => <Pressable style={styles.deleteAction} onPress={() => deletePerson(item.id)}><Text style={styles.deleteText}>Delete</Text></Pressable>}>
      <Pressable style={styles.row} onPress={() => navigation.navigate('EditPerson', { personId: item.id })}>
        <Text style={styles.name}>{item.name || 'New Contact'}</Text><Ionicons name="chevron-forward" size={18} color="#999" />
      </Pressable>
    </Swipeable>}
  />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc', backgroundColor: '#fff' },
  name: { fontSize: 17 }, deleteAction: { backgroundColor: '#d92121', justifyContent: 'center', paddingHorizontal: 20 }, deleteText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }, emptyText: { color: '#666', fontSize: 16, textAlign: 'center' },
});
