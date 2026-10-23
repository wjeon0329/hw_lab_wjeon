import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../types';
import { formatDate, makeDateChangeHandler, saveWithValidation } from '../viewModels/taskFormHelpers';
import { useTasks } from '../viewModels/TasksContext';

type NavProp = BottomTabNavigationProp<RootTabParamList, 'NewTask'>;

// Provides the form used to add a validated task to Firestore.
export default function NewTaskView() {
  const { addTask } = useTasks();
  const navigation = useNavigation<NavProp>();
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const onDateChange = makeDateChangeHandler(setShowPicker, setDueDate);

  // Saves the form and resets it only after Firestore accepts the new task.
  const onSave = (): void => {
    void saveWithValidation(name, assignedTo, async () => {
      await addTask({ name, assignedTo, dueDate, dateAdded: new Date(), completed: false });
      setName(''); setAssignedTo(''); setDueDate(new Date());
    }, () => navigation.navigate('Tasks'));
  };

  return (
    <ScrollView style={styles.container}>
      <FormSection label="Task Name"><TextInput style={styles.input} placeholder="Enter task name" value={name} onChangeText={setName} /></FormSection>
      <FormSection label="Assigned To"><TextInput style={styles.input} placeholder="Enter assignee name" value={assignedTo} onChangeText={setAssignedTo} /></FormSection>
      <FormSection label="Due Date"><Pressable style={styles.dateButton} onPress={() => setShowPicker((shown) => !shown)}><Text style={styles.dateText}>{formatDate(dueDate)}</Text></Pressable>{showPicker && <DateTimePicker value={dueDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}</FormSection>
      <Pressable style={styles.saveButton} onPress={onSave}><Text style={styles.saveButtonText}>Save Task</Text></Pressable>
    </ScrollView>
  );
}

// Wraps one labeled group of controls in the shared form layout.
function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.label}>{label}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }, section: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, marginTop: 20 },
  label: { fontSize: 13, color: '#666', textTransform: 'uppercase', marginBottom: 8 }, input: { fontSize: 17, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
  dateButton: { paddingVertical: 12 }, dateText: { fontSize: 17, color: '#007AFF' }, saveButton: { margin: 16, backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' }, saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
