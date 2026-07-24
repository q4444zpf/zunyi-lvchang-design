<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Trends } from "../types";
const props = defineProps<{ trends: Trends | null }>();
const mode = ref<"total"|"zones">("total"); const host = ref<HTMLDivElement>(); let chart: echarts.ECharts | undefined;
function render() {
  if (!host.value || !props.trends) return;
  chart ||= echarts.init(host.value, undefined, { renderer: "svg" });
  const total = props.trends.total;
  chart.setOption({ backgroundColor:"transparent", tooltip:{trigger:"axis"}, legend:{textStyle:{color:"#9EAFB2"}},
    grid:{left:48,right:18,top:36,bottom:30}, xAxis:{type:"category",data:total.map(p=>p.time),axisLabel:{color:"#697B7F"},axisLine:{lineStyle:{color:"#35484D"}}},
    yAxis:{type:"value",axisLabel:{color:"#697B7F"},splitLine:{lineStyle:{color:"#26373b"}}},
    series: mode.value === "total" ? [
      {name:"实际用水",type:"line",smooth:true,data:total.map(p=>p.actual),lineStyle:{color:"#20B8C7",width:3},itemStyle:{color:"#20B8C7"},symbol:"none"},
      {name:"计划线",type:"line",data:total.map(p=>p.plan),lineStyle:{color:"#F0B84A",type:"dashed"},itemStyle:{color:"#F0B84A"},symbol:"none"}
    ] : Object.entries(props.trends.zones).map(([name,data])=>({name,type:"line",data,symbol:"none"})) });
}
onMounted(()=>nextTick(render)); watch([()=>props.trends,mode],()=>nextTick(render),{deep:true}); onBeforeUnmount(()=>chart?.dispose());
</script>
<template>
  <section class="panel trend-panel">
    <div class="panel-title"><div><span class="eyebrow">24 小时</span><h2>用水趋势</h2></div><div class="segmented"><button :class="{active:mode==='total'}" @click="mode='total'">总量</button><button :class="{active:mode==='zones'}" @click="mode='zones'">分区</button></div></div>
    <div v-if="!trends" class="empty">暂无趋势数据</div><div v-else ref="host" class="chart" role="img" aria-label="24 小时实际用水与计划用水趋势图"></div>
    <p class="chart-summary">当前总用水总体贴近计划线，14:00 后赤泥洗涤区出现轻微偏低。</p>
  </section>
</template>
