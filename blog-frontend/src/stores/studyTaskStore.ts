import { defineStore } from "pinia";
import axiosInstance from "@/utils/axiosInstance";

interface Project {
  id: number;
  name: string;
  description?: string;
}

interface Task {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  date: string;
  completed: boolean;
}

interface CheckIn {
  id: number;
  user_id: number;
  project_id: number;
  date: string;
  task_count: number;
}

export const useStudyTaskStore = defineStore("studyTaskStore", {
  state: () => ({
    projects: [] as Project[],
    tasks: [] as Task[],
    checkIns: [] as { date: string; task_count: number }[],
    selectedProjectId: null as number | null,
  }),
  actions: {
    async fetchProjects() {
      try {
        const response = await axiosInstance.get("/projects");
        this.projects = response.data;
        if (this.projects.length > 0 && !this.selectedProjectId) {
          this.selectedProjectId = this.projects[0].id;
        }
      } catch (error) {
        console.error("获取大任务失败", error);
      }
    },
    async createProject(projectData: Partial<Project>) {
      try {
        const response = await axiosInstance.post("/projects", projectData);
        this.projects.push(response.data);
      } catch (error) {
        console.error("创建大任务失败", error);
      }
    },
    async fetchTasks() {
      if (!this.selectedProjectId) return;
      try {
        const response = await axiosInstance.get(
          `/api/projects/${this.selectedProjectId}/tasks`,
        );
        this.tasks = response.data;
      } catch (error) {
        console.error("获取任务失败", error);
      }
    },
    async createTask(taskData: Partial<Task>) {
      if (!this.selectedProjectId) return;
      try {
        const response = await axiosInstance.post(
          `/projects/${this.selectedProjectId}/tasks`,
          taskData,
        );
        this.tasks.push(response.data);
      } catch (error) {
        console.error("创建任务失败", error);
      }
    },
    async updateTask(task: Task) {
      try {
        await axiosInstance.put(`/tasks/${task.id}`, task);
        this.fetchTasks();
        this.fetchCheckIns();
      } catch (error) {
        console.error("更新任务失败", error);
      }
    },
    async deleteTask(taskId: number) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      } catch (error) {
        console.error("删除任务失败", error);
      }
    },
    async fetchCheckIns() {
      if (!this.selectedProjectId) return;
      try {
        const response = await axiosInstance.get("/checkins", {
          params: { project_id: this.selectedProjectId },
        });
        const data = response.data as CheckIn[];
        this.checkIns = data.map((checkin) => ({
          date: checkin.date.slice(0, 10),
          task_count: checkin.task_count,
        }));
      } catch (error) {
        console.error("获取打卡数据失败", error);
      }
    },
    selectProject(projectId: number) {
      this.selectedProjectId = projectId;
      this.fetchTasks();
      this.fetchCheckIns();
    },
  },
});
