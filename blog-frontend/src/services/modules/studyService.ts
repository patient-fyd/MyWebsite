import { studyApi } from "../api/studyApi";
import type { Project, Task, CheckIn } from "../types/study";

export const studyService = {
  async getProjects(): Promise<Project[]> {
    try {
      const { data } = await studyApi.getProjects();
      if (!data.data) {
        throw new Error("获取项目列表失败");
      }
      return data.data.projects;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "获取项目列表失败");
    }
  },

  async createProject(projectData: { name: string; description: string }): Promise<Project> {
    try {
      const { data } = await studyApi.createProject(projectData);
      if (!data.data) {
        throw new Error("创建项目失败");
      }
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "创建项目失败");
    }
  },

  async getTasks(projectId: number): Promise<Task[]> {
    try {
      const { data } = await studyApi.getTasks(projectId);
      if (!data.data) {
        throw new Error("获取任务列表失败");
      }
      return data.data.tasks;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "获取任务列表失败");
    }
  },

  async createTask(projectId: number, taskData: { 
    name: string;
    description: string;
    date: string;
  }): Promise<Task> {
    try {
      const { data } = await studyApi.createTask(projectId, taskData);
      if (!data.data) {
        throw new Error("创建任务失败");
      }
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "创建任务失败");
    }
  },

  async updateTask(taskId: number, taskData: {
    name?: string;
    description?: string;
    date?: string;
    completed?: boolean;
  }): Promise<void> {
    try {
      await studyApi.updateTask(taskId, taskData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "更新任务失败");
    }
  },

  async deleteTask(taskId: number): Promise<void> {
    try {
      await studyApi.deleteTask(taskId);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "删除任务失败");
    }
  },

  async getCheckIns(params: {
    project_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    checkins: CheckIn[];
    total: number;
    statistics: {
      total_days: number;
      current_streak: number;
      max_streak: number;
    };
  }> {
    try {
      const { data } = await studyApi.getCheckIns(params);
      if (!data.data) {
        throw new Error("获取打卡记录失败");
      }
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "获取打卡记录失败");
    }
  }
};