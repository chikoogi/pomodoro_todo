export interface TodoItem {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  pomodoroTime: number;
  pomodoroCount: number;
  completed: boolean;
}
