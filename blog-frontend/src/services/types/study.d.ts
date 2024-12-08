export interface Project {
  id: number;
  name: string;
  description?: string;
}

export interface Task {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  date: string;
  completed: boolean;
}

export interface CheckIn {
  id: number;
  user_id: number;
  project_id: number;
  date: string;
  task_count: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message: string;
} 