<script setup lang="ts">
import { ref } from "vue"; import type { Pump } from "../types";
const props=defineProps<{pumps:Pump[];offline:boolean;busy:boolean}>(); const emit=defineEmits<{dispatch:[payload:{plan_id:string;pump_ids:string[];target_level:number}]}>();
const selected=ref(["P-01","P-02"]); const toggle=(id:string)=> selected.value=selected.value.includes(id)?selected.value.filter(x=>x!==id):[...selected.value,id];
</script>
<template>
  <section class="panel dispatch-panel">
    <div class="panel-title"><div><span class="eyebrow">模拟控制</span><h2>泵组调度</h2></div><span class="recommend">推荐 A</span></div>
    <button v-for="pump in pumps" :key="pump.id" class="pump-row" :class="{chosen:selected.includes(pump.id)}" @click="toggle(pump.id)">
      <span class="pump-state" :class="{running:pump.running}">{{ pump.running ? "运行" : "待机" }}</span><b>{{ pump.name }}</b>
      <span class="mono">{{ pump.frequency }} Hz</span><span class="mono">{{ pump.current }} A</span>
    </button>
    <div class="plan-summary"><span>目标液位 <b class="mono">4.20 m</b></span><span>预计耗时 <b class="mono">96 min</b></span></div>
    <p v-if="offline" class="offline-note">通信中断，禁止下发控制命令</p>
    <button data-testid="dispatch-button" class="primary-action" :disabled="offline||busy||selected.length===0" @click="emit('dispatch',{plan_id:'PLAN-A',pump_ids:selected,target_level:4.2})">{{ busy ? "正在下发…" : "下发方案" }}</button>
  </section>
</template>

