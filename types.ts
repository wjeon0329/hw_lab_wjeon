// Defines parameters for the Tasks stack navigator.
export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetails: { taskId: string };
};

// Defines parameters for the root tab navigator.
export type RootTabParamList = {
  Tasks: undefined;
  NewTask: undefined;
};
