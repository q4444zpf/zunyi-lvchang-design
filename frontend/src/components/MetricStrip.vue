<script setup lang="ts">import type { Metric } from "../types"; defineProps<{ metrics: Metric[] }>();</script>
<template>
  <section class="metric-strip" aria-label="关键用水指标">
    <article v-for="metric in metrics" :key="metric.label">
      <span>{{ metric.label }}</span><strong class="mono">{{ metric.value.toLocaleString() }} <small>{{ metric.unit }}</small></strong>
      <em :class="metric.trend === '下降' ? 'success' : metric.trend === '上升' ? 'accent' : ''">{{ metric.trend === "上升" ? "↑" : metric.trend === "下降" ? "↓" : "→" }} {{ metric.comparison }}</em>
    </article>
  </section>
</template>

