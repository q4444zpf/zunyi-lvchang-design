<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ name: string; dataTime: string; communication: "在线" | "离线"; operator: string }>();
const time = computed(() => new Date(props.dataTime).toLocaleString("zh-CN", { hour12: false }));
</script>
<template>
  <header class="plant-header">
    <div><span class="eyebrow">水资源调度中心</span><h1>{{ name }}</h1></div>
    <div class="header-status">
      <span><small>数据时间</small><b class="mono">{{ time }}</b></span>
      <span role="status" aria-live="polite"><small>通信状态</small><b :class="communication === '在线' ? 'success' : 'danger'">● {{ communication }}</b></span>
      <span><small>当前值班员</small><b>{{ operator }}</b></span>
    </div>
  </header>
</template>

