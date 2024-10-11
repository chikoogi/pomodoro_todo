export interface TodoItem {
  id: string;
  name: string;
  tasks: TaskItem[];
}

export interface TaskItem {
  id: string;
  name: string;
  pomodoroTime: number;
  pomodoroCount: number;
  completed: boolean;
}
