import { Alert, Platform } from 'react-native';
import { isValidTask } from '../models/TaskItem';

// Formats a date consistently for task rows and form controls.
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Builds a platform-aware handler for the native date picker.
export function makeDateChangeHandler(
  setShowPicker: (show: boolean) => void,
  onPick: (date: Date) => void,
) {
  return (_event: unknown, selected?: Date): void => {
    setShowPicker(Platform.OS === 'ios');
    if (selected) onPick(selected);
  };
}

// Validates form fields, saves the task, and reports success or failure to the screen.
export async function saveWithValidation(
  name: string,
  assignedTo: string,
  save: () => Promise<void>,
  onDone: () => void,
): Promise<void> {
  if (!isValidTask(name, assignedTo)) {
    Alert.alert('Validation Error', 'Please fill in both name and assignee.');
    return;
  }
  try {
    await save();
    onDone();
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to save task.');
  }
}

// Shows a destructive confirmation before deleting a task.
export function confirmDelete(performDelete: () => Promise<void>, onDone: () => void): void {
  Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          await performDelete();
          onDone();
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to delete task.');
        }
      },
    },
  ]);
}
