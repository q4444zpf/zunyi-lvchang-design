<script setup lang="ts">
import { ref } from "vue";
import type { DispatchRequest, Pool, Pump } from "../types";

defineProps<{ pools: Pool[]; pumps: Pump[]; offline: boolean; busy: boolean }>();
const emit = defineEmits<{ dispatch: [request: DispatchRequest] }>();
const activeTab = ref<"plans" | "tasks" | "execution">("plans");
const selectedPlan = ref("PLAN-B");
const plans = [
  { id: "PLAN-A", name: "节能优先方案", score: 86, target: 4.35, energy: "1,420 kWh", risk: "低", note: "减少启停 2 次，电耗最低" },
  { id: "PLAN-B", name: "稳妥平衡方案", score: 94, target: 4.20, energy: "1,510 kWh", risk: "低", note: "水位裕度 1.18 m，推荐执行" },
  { id: "PLAN-C", name: "防洪优先方案", score: 89, target: 3.85, energy: "1,680 kWh", risk: "中", note: "提前腾库 3.4 万 m³" }
];

function applyPlan() {
  const plan = plans.find((item) => item.id === selectedPlan.value) ?? plans[1];
  emit("dispatch", { plan_id: plan.id, pump_ids: ["P-01"], target_level: plan.target });
}
</script>

<template>
  <section class="task-workspace dispatch-center" data-testid="dispatch-center">
    <header class="task-heading">
      <div><span class="eyebrow">预测 · 校核 · 执行</span><h2>三水池智能调度</h2><p>综合未来降雨、产流预测、水池上下限、生产需水和双向泵曲线生成方案。水位安全优先，其次保障连续供水。</p></div>
      <div class="data-stamp"><small>计算批次</small><b class="mono">DS-20260724-1430</b><span class="success">约束校核 18/18 通过</span></div>
    </header>
    <div class="subtask-tabs" role="tablist" aria-label="智能调度视图" data-testid="dispatch-tabs">
      <button type="button" role="tab" :aria-selected="activeTab==='plans'" :class="{active:activeTab==='plans'}" @click="activeTab='plans'">方案中心</button>
      <button type="button" role="tab" :aria-selected="activeTab==='tasks'" :class="{active:activeTab==='tasks'}" @click="activeTab='tasks'">任务编排</button>
      <button type="button" role="tab" :aria-selected="activeTab==='execution'" :class="{active:activeTab==='execution'}" @click="activeTab='execution'">执行监控</button>
    </div>

    <div v-if="activeTab==='plans'" class="dispatch-layout">
      <section class="plan-board">
        <header><div><span class="eyebrow">方案比选</span><h3>未来 6 小时调度策略</h3></div><span class="mono subtle">模型 WN-DSP 2.6</span></header>
        <button v-for="plan in plans" :key="plan.id" type="button" class="plan-row" :class="{selected:selectedPlan===plan.id}" @click="selectedPlan=plan.id">
          <span class="plan-radio" aria-hidden="true"></span><span><small>{{ plan.id }}</small><b>{{ plan.name }}</b><em>{{ plan.note }}</em></span>
          <span><small>综合评分</small><strong class="mono">{{ plan.score }}</strong></span>
          <span><small>目标水位</small><b class="mono">{{ plan.target }} m</b></span>
          <span><small>预计能耗</small><b class="mono">{{ plan.energy }}</b></span>
          <span><small>风险</small><b :class="plan.risk==='低'?'success':'warning'">{{ plan.risk }}</b></span>
        </button>
      </section>
      <aside class="dispatch-side">
        <header><span class="eyebrow">约束校核</span><h3>应用前检查</h3></header>
        <ul><li><span>三池上下限</span><b class="success">通过</b></li><li><span>供水连续性</span><b class="success">通过</b></li><li><span>管线能力</span><b class="success">通过</b></li><li><span>泵组互斥</span><b class="success">通过</b></li></ul>
        <p v-if="offline" class="offline-note">通信中断，禁止下发控制命令</p>
        <button class="primary-action" type="button" :disabled="offline||busy" @click="applyPlan">{{ busy ? "正在校核" : "应用选中方案" }}</button>
      </aside>
    </div>

    <div v-else-if="activeTab==='tasks'" class="task-timeline">
      <article v-for="(task,index) in ['校核池容与降雨预测','1#泵切换外排方向','2#泵升频至 38 Hz','观察水位偏差 30 分钟','生成执行复盘记录']" :key="task">
        <span class="timeline-index mono">{{ String(index+1).padStart(2,'0') }}</span><div><small>{{ index<1?'已完成':index===1?'执行中':'待执行' }}</small><h3>{{ task }}</h3></div><time class="mono">{{ ['14:32','14:36','14:41','15:11','16:20'][index] }}</time>
      </article>
    </div>

    <div v-else class="execution-grid">
      <section class="pool-execution">
        <header><div><span class="eyebrow">DSP-20260724-006</span><h3>稳妥平衡方案执行中</h3></div><strong class="success">进度 42%</strong></header>
        <div class="execution-rail"><span style="width:42%"></span></div>
        <div class="pool-readings">
          <article v-for="pool in pools" :key="pool.id"><small>{{ pool.name }}</small><strong class="mono">{{ pool.level.toFixed(2) }} m</strong><span>目标 4.20 m</span></article>
          <article v-if="!pools.length"><small>2# 集水池</small><strong class="mono">6.42 m</strong><span>目标 4.20 m</span></article>
        </div>
      </section>
      <aside class="pump-execution"><header><span class="eyebrow">双向泵反馈</span><h3>控制状态</h3></header><div v-for="pump in pumps" :key="pump.id" class="pump-feedback"><b>{{ pump.name }}</b><span class="success">{{ pump.running?'外排运行':'待机' }}</span><strong class="mono">{{ pump.frequency }} Hz</strong></div><div v-if="!pumps.length" class="pump-feedback"><b>1# 外排泵</b><span class="success">外排运行</span><strong class="mono">42 Hz</strong></div></aside>
    </div>
  </section>
</template>
