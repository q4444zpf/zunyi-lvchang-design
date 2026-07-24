<script setup lang="ts">import type { Alarm } from "../types"; defineProps<{alarms:Alarm[]}>(); defineEmits<{acknowledge:[id:string]}>();</script>
<template>
  <section class="panel alarms">
    <div class="panel-title"><div><span class="eyebrow">按严重度与时间排序</span><h2>实时告警</h2></div><span>{{ alarms.filter(a=>a.status==="未确认").length }} 条未确认</span></div>
    <div v-if="!alarms.length" class="empty">当前无未确认告警</div>
    <article v-for="alarm in alarms" :key="alarm.id" :class="alarm.severity">
      <span class="severity">{{ alarm.severity }}</span><div><b>{{ alarm.device }}</b><p>{{ alarm.event }}</p><time class="mono">{{ new Date(alarm.occurred_at).toLocaleTimeString("zh-CN",{hour12:false}) }}</time></div>
      <button v-if="alarm.status==='未确认'" :data-alarm-id="alarm.id" @click="$emit('acknowledge',alarm.id)">确认告警</button><span v-else class="success">已确认</span>
    </article>
  </section>
</template>

