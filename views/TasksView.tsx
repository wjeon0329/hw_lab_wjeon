import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TasksStackParamList } from '../types';
import { useTasks } from '../viewModels/TasksContext';
import TaskRowView from './TaskRowView';

type NavProp = NativeStackNavigationProp<TasksStackParamList, 'TasksList'>;

// Displays loading, empty, and task-list states from the shared task provider.
export default function TasksView() {
  const { tasks, loading, toggleCompleted } = useTasks();
  const navigation = useNavigation<NavProp>();

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  if (tasks.length === 0) {
    return <View style={styles.centered}><Text style={styles.emptyTitle}>No tasks yet</Text><Text style={styles.emptySubtitle}>Head to the New Task tab to create one.</Text></View>;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => <TaskRowView task={item} onPress={() => navigation.navigate('TaskDetails', { taskId: item.id! })} onToggleCompleted={() => void toggleCompleted(item)} />}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#666', marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: '#999', textAlign: 'center' },
});
