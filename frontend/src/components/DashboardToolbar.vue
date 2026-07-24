<script setup lang="ts">
defineProps<{ loading: boolean }>();
defineEmits<{ refresh: [] }>();
</script>

<template>
  <section class="dashboard-toolbar" data-testid="dashboard-toolbar" aria-label="监控范围与数据工具">
    <div class="page-context">
      <span>监控中心</span>
      <i aria-hidden="true">/</i>
      <strong>监控总览</strong>
    </div>
    <div class="scope-controls">
      <span class="scope-chip"><small>监控范围</small><b>全厂范围</b></span>
      <span class="scope-chip"><small>数据模式</small><b class="success">● 实时数据</b></span>
      <button type="button" :disabled="loading" @click="$emit('refresh')">
        <span aria-hidden="true">↻</span>{{ loading ? "正在刷新" : "刷新数据" }}
      </button>
    </div>
  </section>
</template>
