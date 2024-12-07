import { studyApi } from "../api/studyApi";
import type { Project, Task, CheckIn } from "../types/study.d.ts";

export const studyService = {
  async getProjects(): Promise<Project[]> {
    try {
      const { data } = await studyApi.getProjects();
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "获取项目列表失败");
    }
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    try {
      const { data } = await studyApi.createProject(projectData);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "创建项目失败");
    }
  },

  async getTasks(projectId: number): Promise<Task[]> {
    try {
      const { data } = await studyApi.getTasks(projectId);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "获取任务列表失败");
    }
  },

  async createTask(projectId: number, taskData: Partial<Task>): Promise<Task> {
    try {
      const { data } = await studyApi.createTask(projectId, taskData);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "创建任务失败");
    }
  },

  async updateTask(task: Task): Promise<void> {
    try {
      await studyApi.updateTask(task.id, task);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "更新任务失败");
    }
  },

  async deleteTask(taskId: number): Promise<void> {
    try {
      await studyApi.deleteTask(taskId);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "删除任务失败");
    }
  },

  async getCheckIns(projectId: number): Promise<CheckIn[]> {
    try {
      const { data } = await studyApi.getCheckIns(projectId);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "获取打卡记录失败");
    }
  }
};