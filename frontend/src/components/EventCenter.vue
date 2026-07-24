<script setup lang="ts">
import { ref } from "vue";
import type { Alarm } from "../types";

defineProps<{ alarms: Alarm[] }>();
const emit = defineEmits<{ acknowledge: [id: string] }>();
const activeTab = ref<"alarms" | "events" | "work-orders" | "reports">("alarms");
const tabs = [
  ["alarms", "实时告警"],
  ["events", "事件处置"],
  ["work-orders", "工单管理"],
  ["reports", "报表管理"]
] as const;
</script>

<template>
  <section class="task-workspace event-center" data-testid="event-center">
    <header class="task-heading">
      <div><span class="eyebrow">发现 · 处置 · 验证 · 复盘</span><h2>告警与事件中心</h2><p>恢复只表示实时值回到正常范围，事件仍需完成效果验证后才能关闭。所有确认、分派、控制和导出操作保留审计记录。</p></div>
      <div class="event-counts"><span><small>未确认</small><b class="danger mono">{{ alarms.filter(item=>item.status==='未确认').length }}</b></span><span><small>处理中</small><b class="warning mono">4</b></span><span><small>超时工单</small><b class="danger mono">1</b></span></div>
    </header>
    <div class="subtask-tabs" role="tablist" aria-label="告警事件视图">
      <button v-for="tab in tabs" :key="tab[0]" type="button" role="tab" :data-event-tab="tab[0]" :aria-selected="activeTab===tab[0]" :class="{active:activeTab===tab[0]}" @click="activeTab=tab[0]">{{ tab[1] }}</button>
    </div>

    <div v-if="activeTab==='alarms'" class="event-layout">
      <section class="event-list-panel">
        <header><div><span class="eyebrow">按严重度与时间排序</span><h3>实时告警</h3></div><span class="mono subtle">自动刷新 15s</span></header>
        <article v-for="alarm in alarms" :key="alarm.id" class="event-row">
          <span class="severity danger">{{ alarm.severity }}</span><div><small class="mono">{{ alarm.id }} · {{ alarm.device }}</small><h3>{{ alarm.event }}</h3><p>建议：定位设备，核对关联压力与流量，确认后进入事件处置。</p></div><time class="mono">{{ new Date(alarm.occurred_at).toLocaleTimeString('zh-CN') }}</time><button v-if="alarm.status==='未确认'" type="button" @click="emit('acknowledge',alarm.id)">确认告警</button><b v-else class="success">已确认</b>
        </article>
        <div v-if="!alarms.length" class="empty">当前没有告警。系统仍在持续监测。</div>
      </section>
      <aside class="event-stage-panel"><header><span class="eyebrow">处置标准</span><h3>事件闭环阶段</h3></header><ol><li class="done">发生</li><li class="current">确认</li><li>分派</li><li>处置</li><li>恢复</li><li>验证</li><li>关闭</li></ol><p>恢复后至少观察 30 分钟，确认压力与流量同时稳定，再执行关闭。</p></aside>
    </div>

    <section v-else-if="activeTab==='events'" class="event-table-panel">
      <header><div><span class="eyebrow">责任与时限</span><h3>事件处置队列</h3></div><button class="primary-action" type="button">新建事件</button></header>
      <div class="industrial-table"><div class="table-row event-columns table-head"><span>事件</span><span>来源</span><span>责任人</span><span>阶段</span></div><div class="table-row event-columns"><strong>EVT-20260724-006 赤泥北支低压</strong><span>ALM-001</span><span>王海 / 运行二班</span><b class="warning">处置中</b></div><div class="table-row event-columns"><strong>EVT-20260724-004 DMA-08 产销差</strong><span>模型诊断</span><span>李宁 / 管网组</span><b class="success">效果验证</b></div></div>
    </section>

    <section v-else-if="activeTab==='work-orders'" class="event-table-panel">
      <header><div><span class="eyebrow">现场执行</span><h3>检修与巡检工单</h3></div><button class="primary-action" type="button">创建工单</button></header>
      <div class="industrial-table"><div class="table-row work-columns table-head"><span>工单</span><span>来源事件</span><span>负责人 / 期限</span><span>状态</span></div><div class="table-row work-columns"><strong>WO-20260724-018 北支阀井巡检</strong><span>EVT-20260724-006</span><span>陈强 · 今日 16:30</span><b class="warning">执行中</b></div><div class="table-row work-columns"><strong>WO-20260724-016 FT-084 表计复核</strong><span>EVT-20260724-004</span><span>周敏 · 今日 17:00</span><b class="danger">已超时</b></div><div class="table-row work-columns"><strong>WO-20260723-041 2# 泵振动检查</strong><span>EVT-20260723-012</span><span>赵峰 · 昨日 21:00</span><b class="success">已完成</b></div></div>
    </section>

    <section v-else class="event-table-panel">
      <header><div><span class="eyebrow">生成 · 审批 · 导出 · 归档</span><h3>报表管理</h3></div><button class="primary-action" type="button">生成报表</button></header>
      <div class="industrial-table"><div class="table-row report-columns table-head"><span>报表</span><span>周期 / 数据范围</span><span>生成状态</span><span>操作</span></div><div class="table-row report-columns"><strong>水量平衡日报</strong><span>2026-07-23 · 全厂</span><b class="success">已审批</b><button class="text-action">导出 PDF</button></div><div class="table-row report-columns"><strong>压力异常周报</strong><span>第 30 周 · 生产管网</span><b class="warning">待审批</b><button class="text-action">在线预览</button></div><div class="table-row report-columns"><strong>DMA 漏损诊断报告</strong><span>2026-07 · 12 个分区</span><b>生成中 68%</b><button class="text-action" disabled>等待生成</button></div></div>
    </section>
  </section>
</template>
