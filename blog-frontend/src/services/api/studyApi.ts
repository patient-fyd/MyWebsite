import axiosInstance from "@/utils/axiosInstance";
import type {
  ProjectListResponse,
  ProjectResponse,
  TaskListResponse,
  TaskResponse,
  CheckInListResponse
} from "../types/study";

export const studyApi = {
  getProjects() {
    return axiosInstance.get<ProjectListResponse>("/projects");
  },

  createProject(data: { name: string; description: string }) {
    return axiosInstance.post<ProjectResponse>("/projects", data);
  },

  getTasks(projectId: number) {
    return axiosInstance.get<TaskListResponse>(`/projects/${projectId}/tasks`);
  },

  createTask(projectId: number, data: {
    name: string;
    description: string;
    date: string;
  }) {
    return axiosInstance.post<TaskResponse>(`/projects/${projectId}/tasks`, data);
  },

  updateTask(taskId: number, data: {
    name?: string;
    description?: string;
    date?: string;
    completed?: boolean;
  }) {
    return axiosInstance.put<TaskResponse>(`/tasks/${taskId}`, data);
  },

  getCheckIns(params: {
    project_id?: number;
    start_date?: string;
    end_date?: string;
  }) {
    return axiosInstance.get<CheckInListResponse>("/checkins", { params });
  },

  deleteTask(taskId: number) {
    return axiosInstance.delete<TaskResponse>(`/tasks/${taskId}`);
  }
}; 