import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { TasksStackParamList } from '../types';
import { confirmDelete, formatDate, makeDateChangeHandler, saveWithValidation } from '../viewModels/taskFormHelpers';
import { useTasks } from '../viewModels/TasksContext';

type RouteProps = RouteProp<TasksStackParamList, 'TaskDetails'>;

// Lets the user edit, complete, or delete the freshest task found in the provider.
export default function TaskDetailsView() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const task = tasks.find((candidate) => candidate.id === route.params.taskId);
  const [name, setName] = useState(task?.name ?? '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? new Date());
  const [completed, setCompleted] = useState(task?.completed ?? false);
  const [showPicker, setShowPicker] = useState(false);

  if (!task) return <View style={styles.centered}><Text>Task not found.</Text></View>;
  const onDateChange = makeDateChangeHandler(setShowPicker, setDueDate);

  // Validates and writes the edited local form state back to Firestore.
  const onSave = (): void => {
    void saveWithValidation(name, assignedTo, () => updateTask({ ...task, name, assignedTo, dueDate, completed }), () => navigation.goBack());
  };

  // Confirms deletion before removing the current task document.
  const onDelete = (): void => {
    confirmDelete(() => deleteTask(task.id!), () => navigation.goBack());
  };

  return (
    <ScrollView style={styles.container}>
      <Section label="Task Name"><TextInput style={styles.input} value={name} onChangeText={setName} /></Section>
      <Section label="Assigned To"><TextInput style={styles.input} value={assignedTo} onChangeText={setAssignedTo} /></Section>
      <Section label="Due Date"><Pressable onPress={() => setShowPicker((shown) => !shown)}><Text style={styles.dateText}>{formatDate(dueDate)}</Text></Pressable>{showPicker && <DateTimePicker value={dueDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}</Section>
      <Section label="Status"><Pressable style={styles.statusRow} onPress={() => setCompleted((value) => !value)}><Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={completed ? '#34C759' : '#007AFF'} /><Text style={styles.statusText}>{completed ? 'Completed' : 'Not Completed'}</Text></Pressable></Section>
      <Pressable style={styles.saveButton} onPress={onSave}><Text style={styles.saveButtonText}>Save Changes</Text></Pressable>
      <Pressable style={styles.deleteButton} onPress={onDelete}><Text style={styles.deleteButtonText}>Delete Task</Text></Pressable>
    </ScrollView>
  );
}

// Wraps one labeled detail control in the shared screen layout.
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.label}>{label}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }, centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }, section: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, marginTop: 20 },
  label: { fontSize: 13, color: '#666', textTransform: 'uppercase', marginBottom: 8 }, input: { fontSize: 17, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' }, dateText: { fontSize: 17, color: '#007AFF', paddingVertical: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }, statusText: { fontSize: 17 }, saveButton: { margin: 16, backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' }, saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  deleteButton: { marginHorizontal: 16, marginBottom: 32, backgroundColor: '#FF3B30', padding: 16, borderRadius: 8, alignItems: 'center' }, deleteButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
