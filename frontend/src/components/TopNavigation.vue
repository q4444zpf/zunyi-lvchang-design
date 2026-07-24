<script setup lang="ts">
export type PlatformTask = "overview" | "network" | "analysis" | "dispatch" | "events";

const items = [
  { task: "overview", label: "监控总览", href: "#overview" },
  { task: "network", label: "水网监控", href: "#network" },
  { task: "analysis", label: "运行分析", href: "#analysis" },
  { task: "dispatch", label: "智能调度", href: "#pools" },
  { task: "events", label: "告警事件", href: "#alarms" }
] as const;

defineProps<{ activeTask: PlatformTask }>();
const emit = defineEmits<{ navigate: [task: PlatformTask] }>();
</script>

<template>
  <nav class="top-navigation" aria-label="平台主导航" data-testid="top-navigation">
    <a
      v-for="item in items"
      :key="item.href"
      :href="item.href"
      :data-task="item.task"
      :class="{ active: activeTask === item.task }"
      :aria-current="activeTask === item.task ? 'page' : undefined"
      @click="emit('navigate', item.task)"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
