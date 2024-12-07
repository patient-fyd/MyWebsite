<template>
  <div class="task-area">
    <!-- 项目选择区域 -->
    <div class="task-project">
      <label for="project">选择你要完成的项目：</label>
      <select v-model="selectedProject">
        <option value="">全部</option>
        <option value="project1">项目1</option>
        <option value="project2">项目2</option>
        <option value="project3">项目3</option>
        <option
          v-for="project in projects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
      <router-link to="/public" class="button-link">返回首页</router-link>
    </div>

    <!-- 任务区域 -->
    <div class="task-sections">
      <div class="task-section" v-for="(day, index) in days" :key="index">
        <h2>{{ day.label }}的任务</h2>
        <ul>
          <!-- 演示用任务 -->
          <li>
            <input type="checkbox" id="demo-task-1" />
            <label for="demo-task-1">背10个单词</label>
          </li>
          <li>
            <input type="checkbox" id="demo-task-2" />
            <label for="demo-task-2">写一篇博客</label>
          </li>
          <li>
            <input type="checkbox" id="demo-task-3" />
            <label for="demo-task-3">写两个算法题</label>
          </li>
          <li v-for="task in tasks[day.key]" :key="task.id">
            <input
              type="checkbox"
              :id="`task-${task.id}`"
              v-model="task.completed"
              @change="handleTaskCompletion(task)"
            />
            <label :for="`task-${task.id}`">{{ task.name }}</label>
            <button @click="deleteTask(task.id)">删除</button>
          </li>
        </ul>
        <button v-if="index > 0" @click="createTask(day.key)">
          添加额外任务
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStudyTaskStore } from "@/stores/studyTaskStore.ts";

const store = useStudyTaskStore();

const projects = ref([
  // 这里添加项目数据
  { id: "project1", name: "项目1" },
  { id: "project2", name: "项目2" },
  { id: "project3", name: "项目3" },
]);

const days = [
  { label: "以往未完成", key: "yesterday" as const },
  { label: "今天", key: "today" as const },
  { label: "明天", key: "tomorrow" as const },
];

interface Task {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  date: string;
  completed: boolean;
  day?: "yesterday" | "today" | "tomorrow";
}

const tasks = ref<{
  yesterday: Task[];
  today: Task[];
  tomorrow: Task[];
}>({
  yesterday: [],
  today: [],
  tomorrow: [],
});

const selectedProject = ref("");

const fetchTasks = async () => {
  await store.fetchTasks();
  store.tasks.forEach((task) => {
    const dateKey = getDateKey(task.date);
    if (dateKey && tasks.value[dateKey]) {
      (task as Task & { day?: "yesterday" | "today" | "tomorrow" }).day =
        dateKey;
      tasks.value[dateKey].push(task);
    }
  });
};

function getDateKey(dateString: string) {
  const today = new Date();
  const taskDate = new Date(dateString);
  const diffDays = Math.floor(
    (taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays === -1
    ? "yesterday"
    : diffDays === 0
      ? "today"
      : diffDays === 1
        ? "tomorrow"
        : null;
}

const createTask = async (dayKey: "yesterday" | "today" | "tomorrow") => {
  const taskName = prompt("请输入任务名称：");
  if (taskName) {
    await store.createTask({
      name: taskName,
      date:
        dayKey === "yesterday"
          ? getYesterday().toISOString().split("T")[0]
          : dayKey === "today"
            ? new Date().toISOString().split("T")[0]
            : getTomorrow().toISOString().split("T")[0],
    });
    fetchTasks();
  }
};

const updateTask = async (task: Task) => {
  await store.updateTask(task);
  fetchTasks();
};

const deleteTask = async (taskId: number) => {
  await store.deleteTask(taskId);
  fetchTasks();
};

const handleTaskCompletion = (task: Task) => {
  updateTask(task);
  if (task.day && tasks.value[task.day].every((t) => t.completed)) {
    alert(`${task.day} 的所有任务已完成！`);
  }
};

function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

fetchTasks();
</script>

<style scoped>
.task-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.task-project {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  font-size: 16px;
}

.button-link {
  margin-left: auto;
}

.task-sections {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  width: 100%;
}

.task-section {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.task-section h2 {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
}

.task-section ul {
  list-style: none;
  padding: 0;
}

.task-section li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
}

.task-section button {
  background-color: #8dc9e8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.task-section button:hover {
  background-color: #47abef;
}
</style>
