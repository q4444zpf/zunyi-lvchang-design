<script setup lang="ts">
import { ref } from "vue";

const items = [
  { label: "监控总览", href: "#overview" },
  { label: "水网监控", href: "#network" },
  { label: "运行分析", href: "#analysis" },
  { label: "智能调度", href: "#pools" },
  { label: "告警事件", href: "#alarms" }
] as const;

const activeHref = ref("#overview");
</script>

<template>
  <nav class="top-navigation" aria-label="平台主导航" data-testid="top-navigation">
    <a
      v-for="item in items"
      :key="item.href"
      :href="item.href"
      :class="{ active: activeHref === item.href }"
      :aria-current="activeHref === item.href ? 'page' : undefined"
      @click="activeHref = item.href"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
