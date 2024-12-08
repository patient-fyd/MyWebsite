import { defineStore } from "pinia";
import { ref } from "vue";
import { studyService } from "@/services/modules/studyService";
import type { Project, Task } from "../services/types/study.d.ts";

export const useStudyTaskStore = defineStore("studyTaskStore", () => {
  // 状态
  const projects = ref<Project[]>([]);
  const tasks = ref<Task[]>([]);
  const checkIns = ref<{ date: string; task_count: number }[]>([]);
  const selectedProjectId = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchProjects = async () => {
    loading.value = true;
    try {
      projects.value = await studyService.getProjects();
      if (projects.value.length > 0 && !selectedProjectId.value) {
        selectedProjectId.value = projects.value[0].id;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error("获取项目失败", err);
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    loading.value = true;
    try {
      const newProject = await studyService.createProject(projectData);
      projects.value.push(newProject);
    } catch (err: any) {
      error.value = err.message;
      console.error("创建项目失败", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchTasks = async () => {
    if (!selectedProjectId.value) return;
    loading.value = true;
    try {
      tasks.value = await studyService.getTasks(selectedProjectId.value);
    } catch (err: any) {
      error.value = err.message;
      console.error("获取任务失败", err);
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    if (!selectedProjectId.value) return;
    loading.value = true;
    try {
      const newTask = await studyService.createTask(selectedProjectId.value, taskData);
      tasks.value.push(newTask);
    } catch (err: any) {
      error.value = err.message;
      console.error("创建任务失败", err);
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (task: Task) => {
    loading.value = true;
    try {
      await studyService.updateTask(task);
      await fetchTasks();
      await fetchCheckIns();
    } catch (err: any) {
      error.value = err.message;
      console.error("更新任务失败", err);
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (taskId: number) => {
    loading.value = true;
    try {
      await studyService.deleteTask(taskId);
      tasks.value = tasks.value.filter(task => task.id !== taskId);
    } catch (err: any) {
      error.value = err.message;
      console.error("删除任务失败", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCheckIns = async () => {
    if (!selectedProjectId.value) return;
    loading.value = true;
    try {
      const data = await studyService.getCheckIns(selectedProjectId.value);
      checkIns.value = data.map(checkin => ({
        date: checkin.date.slice(0, 10),
        task_count: checkin.task_count
      }));
    } catch (err: any) {
      error.value = err.message;
      console.error("获取打卡记录失败", err);
    } finally {
      loading.value = false;
    }
  };

  const selectProject = (projectId: number) => {
    selectedProjectId.value = projectId;
    fetchTasks();
    fetchCheckIns();
  };

  return {
    // 状态
    projects,
    tasks,
    checkIns,
    selectedProjectId,
    loading,
    error,
    // Actions
    fetchProjects,
    createProject,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchCheckIns,
    selectProject
  };
});
