import type { BaseResponse } from './base'

export interface Project {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  total_tasks: number;
  completed_tasks: number;
}

export interface Task {
  id: number;
  project_id: number;
  name: string;
  description: string;
  date: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: number;
  user_id: number;
  project_id: number;
  date: string;
  task_count: number;
  created_at: string;
}

export interface ProjectListResponse extends BaseResponse<{
  projects: Project[];
  total: number;
}> {}

export interface ProjectResponse extends BaseResponse<Project> {}

export interface TaskListResponse extends BaseResponse<{
  tasks: Task[];
  total: number;
}> {}

export interface TaskResponse extends BaseResponse<Task> {}

export interface CheckInListResponse extends BaseResponse<{
  checkins: CheckIn[];
  total: number;
  statistics: {
    total_days: number;
    current_streak: number;
    max_streak: number;
  };
}> {} 