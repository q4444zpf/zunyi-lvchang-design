<script setup lang="ts">
import { computed, ref } from "vue";
import type { Node } from "../types";
defineProps<{ nodes: Node[]; selectedId?: string }>();
const emit = defineEmits<{ "select-node": [node: Node] }>();
const positions: Record<string, [number, number]> = { "N-01":[10,48],"N-02":[29,48],"N-03":[50,18],"N-04":[50,48],"N-05":[50,78],"N-06":[76,29],"N-07":[76,68] };
const viewMode = ref<"schematic" | "gis" | "three">("schematic");
const viewOptions = [
  { id: "schematic", label: "概化图" },
  { id: "gis", label: "GIS 图" },
  { id: "three", label: "三维图" }
] as const;
const viewTitle = computed(() => viewMode.value === "gis" ? "GIS 管网态势" : viewMode.value === "three" ? "三维管网态势" : "全厂用水管网");
</script>
<template>
  <section class="panel network-panel" :class="`view-${viewMode}`">
    <div class="network-heading">
      <div><span class="eyebrow">实时工艺脉络</span><h2>{{ viewTitle }}</h2></div>
      <div class="view-switcher" data-testid="view-switcher" aria-label="空间视图切换">
        <button
          v-for="option in viewOptions"
          :key="option.id"
          type="button"
          :aria-pressed="viewMode === option.id"
          :class="{ active: viewMode === option.id }"
          @click="viewMode = option.id"
        >{{ option.label }}</button>
      </div>
    </div>
    <div class="network-tools">
      <div><button class="active">全部管线</button><button>供水</button><button>回水</button><button>循环水</button></div>
      <span class="legend"><i></i> 新水 <i class="loop"></i> 循环水</span>
    </div>
    <div class="network-canvas" :aria-label="viewTitle">
      <div v-if="viewMode !== 'schematic'" class="view-watermark" aria-hidden="true">{{ viewMode === "gis" ? "GIS" : "3D" }}</div>
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
    <footer class="network-status">
      <span><i class="success-dot"></i> 数据同步正常</span>
      <span>监测点 <b class="mono">{{ nodes.length }}</b></span>
      <span>异常点 <b class="mono danger">{{ nodes.filter((node) => node.status !== "正常").length }}</b></span>
    </footer>
  </section>
</template>
