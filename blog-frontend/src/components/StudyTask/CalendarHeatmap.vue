<template>
  <div id="heatmap" style="width: 100%; height: 300px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted } from "vue";

const initHeatmap = () => {
  const chartDom = document.getElementById("heatmap") as HTMLElement;
  const myChart = echarts.init(chartDom);

  function getVirtualData(year: string) {
    const date = +echarts.time.parse(year + "-01-01");
    const end = +echarts.time.parse(+year + 1 + "-01-01");
    const dayTime = 3600 * 24 * 1000;
    const data: [string, number][] = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
        Math.floor(Math.random() * 100),
      ]);
    }
    return data;
  }

  const option: echarts.EChartsOption = {
    title: {
      top: 30,
      left: "center",
      text: "学习打卡日历热力图",
    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: 100,
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: 65,
      inRange: {
        color: ["#e0f7e4", "#a8e6cf", "#4caf50", "#2e7d32"], // 绿色系渐变从浅到深
      },
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ["auto", 13],
      range: new Date().getFullYear().toString(),
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: getVirtualData(new Date().getFullYear().toString()),
    },
  };

  myChart.setOption(option);
};

onMounted(initHeatmap);
</script>

<style scoped>
#heatmap {
  padding: 20px;
}
</style>
