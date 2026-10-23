import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { TaskItem } from '../models/TaskItem';

const COLLECTION = 'tasks';

type TasksContextValue = {
  tasks: TaskItem[];
  loading: boolean;
  addTask: (task: Omit<TaskItem, 'id'>) => Promise<void>;
  updateTask: (task: TaskItem) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompleted: (task: TaskItem) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

// Shares one real-time Firestore task store with every screen in the app.
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Creates one Firestore listener and removes it when the provider unmounts.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        const nextTasks = snapshot.docs.map((snapshotDocument): TaskItem => {
          const data = snapshotDocument.data();
          return {
            id: snapshotDocument.id,
            name: data.name ?? '',
            assignedTo: data.assignedTo ?? '',
            dueDate: data.dueDate?.toDate() ?? new Date(),
            dateAdded: data.dateAdded?.toDate() ?? new Date(),
            completed: data.completed ?? false,
          };
        });
        nextTasks.sort((first, second) => {
          if (first.completed !== second.completed) return first.completed ? 1 : -1;
          return first.dueDate.getTime() - second.dueDate.getTime();
        });
        setTasks(nextTasks);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  // Adds a task and converts application Date values to Firestore Timestamp values.
  const addTask = async (task: Omit<TaskItem, 'id'>): Promise<void> => {
    await addDoc(collection(db, COLLECTION), {
      ...task,
      dueDate: Timestamp.fromDate(task.dueDate),
      dateAdded: Timestamp.fromDate(task.dateAdded),
    });
  };

  // Updates one existing task after validating that it has a Firestore document id.
  const updateTask = async (task: TaskItem): Promise<void> => {
    if (!task.id) throw new Error('Cannot update a task without an id.');
    await updateDoc(doc(db, COLLECTION, task.id), {
      name: task.name,
      assignedTo: task.assignedTo,
      dueDate: Timestamp.fromDate(task.dueDate),
      completed: task.completed,
    });
  };

  // Deletes the task document with the supplied Firestore id.
  const deleteTask = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  // Flips the completion field for an existing task document.
  const toggleCompleted = async (task: TaskItem): Promise<void> => {
    if (!task.id) throw new Error('Cannot toggle a task without an id.');
    await updateDoc(doc(db, COLLECTION, task.id), { completed: !task.completed });
  };

  const value = useMemo(
    () => ({ tasks, loading, addTask, updateTask, deleteTask, toggleCompleted }),
    [tasks, loading],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

// Returns the task store and ensures callers are nested inside TasksProvider.
export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used inside a TasksProvider.');
  return context;
}
