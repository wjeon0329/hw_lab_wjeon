import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';
import { usePeople } from '../viewModels/PeopleContext';

type RouteProps = RouteProp<RootStackParamList, 'EditPerson'>;

// Edits one live contact record and lets the user choose its optional photo.
export default function EditPersonView() {
  const route = useRoute<RouteProps>();
  const { getPerson, updatePerson } = usePeople();
  const person = getPerson(route.params.personId);
  if (!person) return <View style={styles.centered}><Text>Contact not found.</Text></View>;

  // Requests photo access, presents the device picker, and stores the selected file URI.
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) updatePerson(person.id, { photoUri: result.assets[0].uri });
  };

  return <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Photo</Text>
      {person.photoUri && <Image source={{ uri: person.photoUri }} style={styles.photo} resizeMode="cover" />}
      <Pressable style={styles.photoButton} onPress={pickImage}><Ionicons name="person-circle-outline" size={22} color="#007AFF" /><Text style={styles.photoButtonText}>Select a photo</Text></Pressable>
    </View>
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Information</Text>
      <TextInput style={styles.input} placeholder="Name" value={person.name} onChangeText={(text) => updatePerson(person.id, { name: text })} textContentType="name" />
      <TextInput style={styles.input} placeholder="Email" value={person.email} onChangeText={(text) => updatePerson(person.id, { email: text })} textContentType="emailAddress" autoCapitalize="none" keyboardType="email-address" />
    </View>
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Details</Text>
      <TextInput style={[styles.input, styles.detailsInput]} placeholder="Details on this person" value={person.details} onChangeText={(text) => updatePerson(person.id, { details: text })} multiline />
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' }, centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }, section: { backgroundColor: '#fff', padding: 12, marginTop: 20 }, sectionHeader: { fontSize: 13, color: '#666', textTransform: 'uppercase', marginBottom: 8 }, input: { fontSize: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' }, detailsInput: { minHeight: 88, textAlignVertical: 'top', borderBottomWidth: 0 }, photo: { width: '100%', height: 240, borderRadius: 8, marginBottom: 12 }, photoButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }, photoButtonText: { fontSize: 16, color: '#007AFF' },
});
