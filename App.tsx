import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootTabParamList, TasksStackParamList } from './types';
import { TasksProvider } from './viewModels/TasksContext';
import NewTaskView from './views/NewTaskView';
import TaskDetailsView from './views/TaskDetailsView';
import TasksView from './views/TasksView';

const Tab = createBottomTabNavigator<RootTabParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();

// Supplies the nested stack used by the Tasks tab.
function TasksStackScreen() {
  return <TasksStack.Navigator><TasksStack.Screen name="TasksList" component={TasksView} options={{ title: 'Arbeit' }} /><TasksStack.Screen name="TaskDetails" component={TaskDetailsView} options={{ title: 'Task Details' }} /></TasksStack.Navigator>;
}

// Starts shared task state and the bottom-tab navigation hierarchy.
export default function App() {
  return (
    <TasksProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name={route.name === 'Tasks' ? 'checkmark-done-circle' : 'add-circle'} size={size} color={color} /> })}>
          <Tab.Screen name="Tasks" component={TasksStackScreen} />
          <Tab.Screen name="NewTask" component={NewTaskView} options={{ title: 'New Task', headerShown: true }} />
        </Tab.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
