import { defineStore } from "pinia";
import { computed, ref } from "vue";
import * as api from "../api";
import type { Alarm, DispatchRequest, Overview, Trends } from "../types";

export const usePlantStore = defineStore("plant", () => {
  const overview = ref<Overview | null>(null);
  const trends = ref<Trends | null>(null);
  const alarms = ref<Alarm[]>([]);
  const loading = ref(true);
  const error = ref("");
  const dispatching = ref(false);
  const selectedNodeId = ref("");
  const selectedNode = computed(() => overview.value?.nodes.find((node) => node.id === selectedNodeId.value));

  async function loadDashboard() {
    loading.value = true; error.value = "";
    try {
      [overview.value, trends.value, alarms.value] = await Promise.all([api.getOverview(), api.getTrends(), api.getAlarms()]);
    } catch {
      error.value = "实时数据连接失败，已保留最后数据";
    } finally { loading.value = false; }
  }
  async function acknowledgeAlarm(id: string) {
    const updated = await api.acknowledgeAlarm(id);
    alarms.value = alarms.value.map((item) => item.id === id ? updated : item);
  }
  async function submitDispatch(request: DispatchRequest) {
    if (overview.value?.communication !== "在线") throw new Error("通信中断，禁止下发控制命令");
    dispatching.value = true;
    try { return await api.dispatchPlan(request); }
    finally { dispatching.value = false; }
  }
  return { overview, trends, alarms, loading, error, dispatching, selectedNodeId, selectedNode, loadDashboard, acknowledgeAlarm, submitDispatch };
});

