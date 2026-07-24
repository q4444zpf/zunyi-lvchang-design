<script setup lang="ts">
import { onMounted, ref } from "vue";
import AlarmList from "./components/AlarmList.vue"; import ConfirmDialog from "./components/ConfirmDialog.vue";
import DashboardToolbar from "./components/DashboardToolbar.vue";
import MetricStrip from "./components/MetricStrip.vue"; import PlantHeader from "./components/PlantHeader.vue";
import PumpDispatch from "./components/PumpDispatch.vue"; import RedMudPoolPanel from "./components/RedMudPoolPanel.vue";
import TopNavigation from "./components/TopNavigation.vue"; import TrendPanel from "./components/TrendPanel.vue"; import WaterNetworkMap from "./components/WaterNetworkMap.vue";
import type { PlatformTask } from "./components/TopNavigation.vue";
import { usePlantStore } from "./stores/plant"; import type { DispatchRequest, Node } from "./types";
const store=usePlantStore(); const pending=ref<DispatchRequest|null>(null); const dialogOpen=ref(false); const toast=ref(""); const activeTask=ref<PlatformTask>("overview");
onMounted(()=>store.loadDashboard());
function selectNode(node:Node){store.selectedNodeId=node.id}
function requestDispatch(payload:DispatchRequest){pending.value=payload;dialogOpen.value=true}
async function confirmDispatch(){if(!pending.value)return;try{await store.submitDispatch(pending.value);toast.value="调度方案已下发并生成记录";dialogOpen.value=false}catch(e){toast.value=e instanceof Error?e.message:"调度下发失败，请重试"}}
</script>
<template>
  <div class="app-shell">
    <div class="top-shell">
      <div class="brand"><span>ZY</span><b>水网智能管理平台</b></div>
      <TopNavigation :active-task="activeTask" @navigate="activeTask=$event" />
      <div class="shift"><span>当前班次</span><b>中班 · 14:00—22:00</b></div>
    </div>
    <main>
      <PlantHeader v-if="store.overview" :name="store.overview.plant_name" :data-time="store.overview.data_time" :communication="store.overview.communication" :operator="store.overview.operator"/>
      <header v-else class="plant-header"><div><span class="eyebrow">水资源调度中心</span><h1>遵义氧化铝厂</h1></div></header>
      <DashboardToolbar :loading="store.loading" @refresh="store.loadDashboard"/>
      <div v-if="store.overview?.communication==='离线'" class="offline-banner" role="status">通信中断：当前显示最后数据，禁止下发控制命令</div>
      <section v-if="activeTask==='analysis'" class="task-placeholder" data-testid="analysis-center">
        <span class="eyebrow">运行分析</span>
        <h2>分析中心正在载入</h2>
      </section>
      <div v-else-if="store.loading" class="loading-state"><span></span>正在连接实时数据</div>
      <div v-else-if="store.error&&!store.overview" class="loading-state danger">{{ store.error }} <button @click="store.loadDashboard">重试</button></div>
      <template v-else-if="store.overview">
        <MetricStrip id="overview" :metrics="store.overview.metrics"/>
        <div class="workspace">
          <section class="center-column">
            <WaterNetworkMap id="network" :nodes="store.overview.nodes" :selected-id="store.selectedNodeId" @select-node="selectNode"/>
            <aside v-if="store.selectedNode" class="node-detail"><div><span class="eyebrow">节点详情</span><h3>{{ store.selectedNode.name }}</h3></div><dl><div><dt>实时流量</dt><dd class="mono">{{ store.selectedNode.flow }} m³/h</dd></div><div><dt>管网压力</dt><dd class="mono">{{ store.selectedNode.pressure }} MPa</dd></div><div><dt>状态</dt><dd>{{ store.selectedNode.status }}</dd></div></dl><button @click="store.selectedNodeId=''">关闭</button></aside>
            <div id="analysis"><TrendPanel :trends="store.trends"/></div>
            <AlarmList id="alarms" :alarms="store.alarms" @acknowledge="store.acknowledgeAlarm"/>
          </section>
          <aside id="pools" class="right-column">
            <RedMudPoolPanel :pools="store.overview.pools"/>
            <PumpDispatch :pumps="store.overview.pumps" :offline="store.overview.communication==='离线'" :busy="store.dispatching" @dispatch="requestDispatch"/>
          </aside>
        </div>
      </template>
    </main>
    <div v-if="toast" class="toast" role="status">{{ toast }}<button aria-label="关闭提示" @click="toast=''">×</button></div>
    <ConfirmDialog :open="dialogOpen" :request="pending" @close="dialogOpen=false" @confirm="confirmDispatch"/>
  </div>
</template>
