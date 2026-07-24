<script setup lang="ts">
import type { Node } from "../types";
defineProps<{ nodes: Node[]; selectedId?: string }>();
const emit = defineEmits<{ "select-node": [node: Node] }>();
const positions: Record<string, [number, number]> = { "N-01":[10,48],"N-02":[29,48],"N-03":[50,18],"N-04":[50,48],"N-05":[50,78],"N-06":[76,29],"N-07":[76,68] };
</script>
<template>
  <section class="panel network-panel">
    <div class="panel-title"><div><span class="eyebrow">实时工艺脉络</span><h2>全厂用水管网</h2></div><span class="legend"><i></i> 新水 / <i class="loop"></i> 循环水</span></div>
    <div class="network-canvas">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 48 H50 M29 48 V18 H50 M29 48 V78 H50 M50 18 H65 V29 H76 M50 48 H65 V68 H76 M50 78 H76" />
        <path class="loop-pipe" d="M29 48 C35 92 72 94 76 68" />
      </svg>
      <button v-for="node in nodes" :key="node.id" class="network-node" :class="[node.status, {selected: selectedId === node.id}]"
        :style="{ left: positions[node.id]?.[0] + '%', top: positions[node.id]?.[1] + '%' }" :data-node-id="node.id"
        @click="emit('select-node', node)" @keydown.enter="emit('select-node', node)">
        <span>{{ node.name }}</span><b class="mono">{{ node.flow }} m³/h</b><small>{{ node.pressure }} MPa · {{ node.status }}</small>
      </button>
    </div>
  </section>
</template>

