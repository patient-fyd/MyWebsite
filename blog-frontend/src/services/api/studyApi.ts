import axiosInstance from "@/utils/axiosInstance";
import type { Project, Task, CheckIn, ApiResponse } from "../types/study.d.ts";

export const studyApi = {
  getProjects() {
    return axiosInstance.get<ApiResponse<Project[]>>("/projects");
  },

  createProject(data: Partial<Project>) {
    return axiosInstance.post<ApiResponse<Project>>("/projects", data);
  },

  getTasks(projectId: number) {
    return axiosInstance.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
  },

  createTask(projectId: number, data: Partial<Task>) {
    return axiosInstance.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data);
  },

  updateTask(taskId: number, data: Task) {
    return axiosInstance.put<ApiResponse<Task>>(`/tasks/${taskId}`, data);
  },

  deleteTask(taskId: number) {
    return axiosInstance.delete<ApiResponse>(`/tasks/${taskId}`);
  },

  getCheckIns(projectId: number) {
    return axiosInstance.get<ApiResponse<CheckIn[]>>("/checkins", {
      params: { project_id: projectId }
    });
  }
}; 