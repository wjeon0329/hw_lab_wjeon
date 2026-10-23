// Represents one task stored in the Firestore tasks collection.
export interface TaskItem {
  id?: string;
  name: string;
  assignedTo: string;
  dueDate: Date;
  dateAdded: Date;
  completed: boolean;
}

// Returns true only when the task has both required text fields.
export function isValidTask(name: string, assignedTo: string): boolean {
  return name.trim().length > 0 && assignedTo.trim().length > 0;
}

// Orders tasks alphabetically by name for Array.sort.
export function compareTasksByName(first: TaskItem, second: TaskItem): number {
  return first.name.localeCompare(second.name);
}

// Orders tasks from the earliest due date to the latest.
export function compareTasksByDueDate(first: TaskItem, second: TaskItem): number {
  return first.dueDate.getTime() - second.dueDate.getTime();
}

// Compares the editable identity fields while deliberately ignoring id and completion state.
export function areTasksEqual(first: TaskItem, second: TaskItem): boolean {
  return first.name === second.name
    && first.assignedTo === second.assignedTo
    && first.dueDate.getTime() === second.dueDate.getTime();
}
