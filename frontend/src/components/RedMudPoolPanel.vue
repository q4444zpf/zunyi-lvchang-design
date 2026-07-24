<script setup lang="ts">import type { Pool } from "../types"; defineProps<{ pools: Pool[] }>();</script>
<template>
  <section class="panel pool-panel">
    <div class="panel-title"><div><span class="eyebrow">未来 2 小时预测</span><h2>赤泥集水池</h2></div></div>
    <article v-for="pool in pools" :key="pool.id" class="pool-unit">
      <div class="pool-head"><b>{{ pool.name }}</b><span :class="pool.status">{{ pool.status }}</span></div>
      <div class="pool-body">
        <div class="pool-vessel"><div class="water" :class="pool.status" :style="{height:(pool.level/pool.capacity*100)+'%'}"></div><span class="danger-mark">危险 6.3</span><strong class="mono">{{ pool.level }} m</strong></div>
        <dl><div><dt>入流</dt><dd class="mono">{{ pool.inflow }} m³/h</dd></div><div><dt>出流</dt><dd class="mono">{{ pool.outflow }} m³/h</dd></div><div><dt>2h 预测</dt><dd class="mono">{{ pool.forecast_level }} m</dd></div></dl>
      </div>
    </article>
  </section>
</template>

